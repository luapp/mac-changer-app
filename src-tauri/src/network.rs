use crate::commands::{NetworkInterface, PermissionStatus};
use std::process::Command;

pub fn validate_interface_name(name: &str) -> bool {
    !name.is_empty()
        && name.len() <= 256
        && name
            .chars()
            .all(|c| c.is_alphanumeric() || " _-.()".contains(c))
}

pub fn validate_mac_address(mac: &str) -> bool {
    let parts: Vec<&str> = mac.split(':').collect();
    if parts.len() != 6 {
        return false;
    }
    if !parts
        .iter()
        .all(|p| p.len() == 2 && p.chars().all(|c| c.is_ascii_hexdigit()))
    {
        return false;
    }
    let upper = mac.to_uppercase();
    if upper == "FF:FF:FF:FF:FF:FF" || upper == "00:00:00:00:00:00" {
        return false;
    }
    true
}

// ============================================================
// macOS implementation
// ============================================================

#[cfg(target_os = "macos")]
pub fn get_interfaces() -> Result<Vec<NetworkInterface>, String> {
    let hardware_ports = get_hardware_port_mapping();

    let output = Command::new("ifconfig")
        .arg("-a")
        .output()
        .map_err(|e| format!("Failed to run ifconfig: {}", e))?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    let mut interfaces = Vec::new();
    let mut current_name = String::new();
    let mut current_mac = String::new();
    let mut is_up = false;

    for line in stdout.lines() {
        if !line.starts_with('\t') && !line.starts_with(' ') && line.contains(": flags=") {
            if !current_name.is_empty() && !current_mac.is_empty() {
                let (display_name, iface_type) = hardware_ports
                    .get(&current_name)
                    .cloned()
                    .unwrap_or_else(|| (current_name.clone(), guess_interface_type(&current_name)));

                interfaces.push(NetworkInterface {
                    name: current_name.clone(),
                    display_name,
                    mac_address: current_mac.clone(),
                    is_up,
                    interface_type: iface_type,
                });
            }

            current_name = line.split(':').next().unwrap_or("").to_string();
            current_mac = String::new();
            is_up = false;
            if let Some(flags_section) = line.split('<').nth(1) {
                is_up = flags_section.split(',').any(|f| f.trim() == "UP" || f.trim().starts_with("UP"));
            }
        }

        let trimmed = line.trim();
        if trimmed.starts_with("ether ") {
            current_mac = trimmed
                .strip_prefix("ether ")
                .unwrap_or("")
                .split_whitespace()
                .next()
                .unwrap_or("")
                .to_lowercase()
                .to_string();
        }
    }

    // Last interface
    if !current_name.is_empty() && !current_mac.is_empty() {
        let (display_name, iface_type) = hardware_ports
            .get(&current_name)
            .cloned()
            .unwrap_or_else(|| (current_name.clone(), guess_interface_type(&current_name)));

        interfaces.push(NetworkInterface {
            name: current_name,
            display_name,
            mac_address: current_mac,
            is_up,
            interface_type: iface_type,
        });
    }

    Ok(interfaces)
}

#[cfg(target_os = "macos")]
fn get_hardware_port_mapping() -> std::collections::HashMap<String, (String, String)> {
    let mut mapping = std::collections::HashMap::new();

    let output = Command::new("networksetup")
        .arg("-listallhardwareports")
        .output();

    if let Ok(output) = output {
        let stdout = String::from_utf8_lossy(&output.stdout);
        let mut current_port = String::new();

        for line in stdout.lines() {
            if let Some(port) = line.strip_prefix("Hardware Port: ") {
                current_port = port.to_string();
            } else if let Some(device) = line.strip_prefix("Device: ") {
                let device = device.trim().to_string();
                let lower = current_port.to_lowercase();
                let iface_type = if lower.contains("wi-fi")
                    || lower.contains("wifi")
                    || lower.contains("airport")
                {
                    "wifi"
                } else if lower.contains("thunderbolt")
                    || lower.contains("ethernet")
                    || lower.contains("usb")
                {
                    "ethernet"
                } else if lower.contains("bluetooth") {
                    "bluetooth"
                } else if lower.contains("bridge") {
                    "bridge"
                } else {
                    "other"
                };

                mapping.insert(device, (current_port.clone(), iface_type.to_string()));
            }
        }
    }

    mapping
}

#[cfg(target_os = "macos")]
fn guess_interface_type(name: &str) -> String {
    if name == "en0" {
        "wifi".to_string()
    } else if name.starts_with("en") {
        "ethernet".to_string()
    } else if name.starts_with("bridge") {
        "bridge".to_string()
    } else if name.starts_with("awdl") || name.starts_with("llw") {
        "airdrop".to_string()
    } else {
        "other".to_string()
    }
}

#[cfg(target_os = "macos")]
pub fn get_current_mac(interface: &str) -> Result<String, String> {
    if !validate_interface_name(interface) {
        return Err("Invalid interface name".to_string());
    }

    let output = Command::new("ifconfig")
        .arg(interface)
        .output()
        .map_err(|e| format!("Failed to run ifconfig: {}", e))?;

    let stdout = String::from_utf8_lossy(&output.stdout);

    for line in stdout.lines() {
        let trimmed = line.trim();
        if trimmed.starts_with("ether ") {
            return Ok(trimmed
                .strip_prefix("ether ")
                .unwrap_or("")
                .split_whitespace()
                .next()
                .unwrap_or("")
                .to_lowercase()
                .to_string());
        }
    }

    Err(format!(
        "Could not find MAC address for interface {}",
        interface
    ))
}

#[cfg(target_os = "macos")]
pub fn set_mac(interface: &str, mac: &str) -> Result<String, String> {
    if !validate_interface_name(interface) {
        return Err("Invalid interface name".to_string());
    }
    if !validate_mac_address(mac) {
        return Err("Invalid MAC address format".to_string());
    }

    let script = format!(
        "do shell script \"ifconfig {} ether {}\" with administrator privileges",
        interface, mac
    );

    let output = Command::new("osascript")
        .args(["-e", &script])
        .output()
        .map_err(|e| format!("Failed to execute command: {}", e))?;

    if output.status.success() {
        Ok(format!("MAC address changed to {} on {}", mac, interface))
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr);
        if stderr.contains("cancel") {
            Err("Operation cancelled by user".to_string())
        } else {
            Err(format!("Failed to change MAC address: {}", stderr.trim()))
        }
    }
}

#[cfg(target_os = "macos")]
pub fn check_permissions() -> Result<PermissionStatus, String> {
    let output = Command::new("id")
        .arg("-u")
        .output()
        .map_err(|e| format!("Failed to check permissions: {}", e))?;

    let uid = String::from_utf8_lossy(&output.stdout).trim().to_string();
    let is_root = uid == "0";

    Ok(PermissionStatus {
        is_admin: is_root,
        message: if is_root {
            "Running with root privileges".to_string()
        } else {
            "You will be prompted for your admin password when changing MAC addresses".to_string()
        },
    })
}

// ============================================================
// Windows implementation
// ============================================================

#[cfg(target_os = "windows")]
pub fn get_interfaces() -> Result<Vec<NetworkInterface>, String> {
    let output = Command::new("powershell")
        .args([
            "-NoProfile",
            "-Command",
            "Get-NetAdapter | Select-Object Name, MacAddress, Status, InterfaceDescription | ConvertTo-Json",
        ])
        .output()
        .map_err(|e| format!("Failed to run PowerShell: {}", e))?;

    if !output.status.success() {
        return Err(format!(
            "PowerShell command failed: {}",
            String::from_utf8_lossy(&output.stderr)
        ));
    }

    let stdout = String::from_utf8_lossy(&output.stdout);
    let json: serde_json::Value =
        serde_json::from_str(&stdout).map_err(|e| format!("Failed to parse output: {}", e))?;

    let adapters = match &json {
        serde_json::Value::Array(arr) => arr.clone(),
        obj @ serde_json::Value::Object(_) => vec![obj.clone()],
        _ => return Err("Unexpected output format".to_string()),
    };

    let mut interfaces = Vec::new();
    for adapter in adapters {
        let name = adapter["Name"].as_str().unwrap_or("").to_string();
        let mac = adapter["MacAddress"]
            .as_str()
            .unwrap_or("")
            .replace('-', ":")
            .to_lowercase();
        let status = adapter["Status"].as_str().unwrap_or("");
        let description = adapter["InterfaceDescription"]
            .as_str()
            .unwrap_or("")
            .to_string();

        let lower_desc = description.to_lowercase();
        let iface_type = if lower_desc.contains("wi-fi")
            || lower_desc.contains("wifi")
            || lower_desc.contains("wireless")
        {
            "wifi"
        } else {
            "ethernet"
        };

        if !mac.is_empty() {
            interfaces.push(NetworkInterface {
                name: name.clone(),
                display_name: if description.is_empty() {
                    name
                } else {
                    description
                },
                mac_address: mac,
                is_up: status == "Up",
                interface_type: iface_type.to_string(),
            });
        }
    }

    Ok(interfaces)
}

#[cfg(target_os = "windows")]
pub fn get_current_mac(interface: &str) -> Result<String, String> {
    if !validate_interface_name(interface) {
        return Err("Invalid interface name".to_string());
    }

    let command = format!(
        "Get-NetAdapter -Name '{}' | Select-Object -ExpandProperty MacAddress",
        interface.replace('\'', "''")
    );

    let output = Command::new("powershell")
        .args(["-NoProfile", "-Command", &command])
        .output()
        .map_err(|e| format!("Failed to run PowerShell: {}", e))?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout)
            .trim()
            .replace('-', ":")
            .to_lowercase())
    } else {
        Err(format!(
            "Failed to get MAC address: {}",
            String::from_utf8_lossy(&output.stderr)
        ))
    }
}

#[cfg(target_os = "windows")]
pub fn set_mac(interface: &str, mac: &str) -> Result<String, String> {
    if !validate_interface_name(interface) {
        return Err("Invalid interface name".to_string());
    }
    if !validate_mac_address(mac) {
        return Err("Invalid MAC address format".to_string());
    }

    let mac_no_colons = mac.replace(':', "");
    let safe_name = interface.replace('\'', "''");

    let command = format!(
        "Set-NetAdapterAdvancedProperty -Name '{}' -RegistryKeyword 'NetworkAddress' -RegistryValue '{}'; Restart-NetAdapter -Name '{}' -Confirm:$false",
        safe_name, mac_no_colons, safe_name
    );

    let output = Command::new("powershell")
        .args(["-NoProfile", "-Command", &command])
        .output()
        .map_err(|e| format!("Failed to execute PowerShell: {}", e))?;

    if output.status.success() {
        Ok(format!("MAC address changed to {} on {}", mac, interface))
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr);
        if stderr.contains("Access is denied") || stderr.contains("elevation") {
            Err("Administrator privileges required. Run the application as Administrator.".to_string())
        } else {
            Err(format!("Failed to change MAC address: {}", stderr.trim()))
        }
    }
}

#[cfg(target_os = "windows")]
pub fn check_permissions() -> Result<PermissionStatus, String> {
    let output = Command::new("powershell")
        .args([
            "-NoProfile",
            "-Command",
            "([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)",
        ])
        .output()
        .map_err(|e| format!("Failed to check permissions: {}", e))?;

    let is_admin = String::from_utf8_lossy(&output.stdout)
        .trim()
        .eq_ignore_ascii_case("true");

    Ok(PermissionStatus {
        is_admin,
        message: if is_admin {
            "Running with Administrator privileges".to_string()
        } else {
            "Run this application as Administrator to change MAC addresses".to_string()
        },
    })
}

// ============================================================
// Unsupported platform fallback
// ============================================================

#[cfg(not(any(target_os = "macos", target_os = "windows")))]
pub fn get_interfaces() -> Result<Vec<NetworkInterface>, String> {
    Err("This platform is not currently supported".to_string())
}

#[cfg(not(any(target_os = "macos", target_os = "windows")))]
pub fn get_current_mac(_interface: &str) -> Result<String, String> {
    Err("This platform is not currently supported".to_string())
}

#[cfg(not(any(target_os = "macos", target_os = "windows")))]
pub fn set_mac(_interface: &str, _mac: &str) -> Result<String, String> {
    Err("This platform is not currently supported".to_string())
}

#[cfg(not(any(target_os = "macos", target_os = "windows")))]
pub fn check_permissions() -> Result<PermissionStatus, String> {
    Err("This platform is not currently supported".to_string())
}
