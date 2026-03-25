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
    // Use networksetup as the source of truth — this matches what
    // macOS System Settings shows, filtering out internal/virtual interfaces.
    let hardware_ports = get_hardware_port_mapping();

    let mut interfaces = Vec::new();

    for (device, (port_name, iface_type)) in &hardware_ports {
        // Query ifconfig for live status and current MAC of this device.
        // If the device doesn't exist (hardware unplugged), ifconfig will fail
        // and return empty — we still show the service, just as System Settings does.
        let (mac, is_up) = get_ifconfig_info(device);

        // Try networksetup as a fallback for the MAC when ifconfig has nothing
        // (e.g. device registered but interface not yet created)
        let mac = if mac.is_empty() {
            get_mac_via_networksetup(port_name)
        } else {
            mac
        };

        interfaces.push(NetworkInterface {
            name: device.clone(),
            display_name: port_name.clone(),
            mac_address: mac,
            is_up,
            interface_type: iface_type.clone(),
        });
    }

    // Sort: Wi-Fi first, then ethernet, then others
    interfaces.sort_by(|a, b| {
        let order = |t: &str| match t {
            "wifi" => 0,
            "ethernet" => 1,
            "bridge" => 2,
            _ => 3,
        };
        order(&a.interface_type).cmp(&order(&b.interface_type))
    });

    Ok(interfaces)
}

/// Get the current MAC address and UP status for a device via ifconfig.
#[cfg(target_os = "macos")]
fn get_ifconfig_info(device: &str) -> (String, bool) {
    let output = match Command::new("ifconfig").arg(device).output() {
        Ok(o) => o,
        Err(_) => return (String::new(), false),
    };

    let stdout = String::from_utf8_lossy(&output.stdout);
    let mut mac = String::new();
    let mut is_up = false;

    for line in stdout.lines() {
        if line.contains("flags=") {
            if let Some(flags) = line.split('<').nth(1) {
                is_up = flags.split(',').any(|f| f.trim() == "UP" || f.trim().starts_with("UP"));
            }
        }
        let trimmed = line.trim();
        if trimmed.starts_with("ether ") {
            mac = trimmed
                .strip_prefix("ether ")
                .unwrap_or("")
                .split_whitespace()
                .next()
                .unwrap_or("")
                .to_lowercase()
                .to_string();
        }
    }

    (mac, is_up)
}

/// Try to get MAC address via networksetup (works for connected services
/// even when ifconfig doesn't have the info).
#[cfg(target_os = "macos")]
fn get_mac_via_networksetup(service_name: &str) -> String {
    let output = match Command::new("networksetup")
        .args(["-getmacaddress", service_name])
        .output()
    {
        Ok(o) if o.status.success() => o,
        _ => return String::new(),
    };

    let stdout = String::from_utf8_lossy(&output.stdout);
    // Output: "Ethernet Address: aa:bb:cc:dd:ee:ff (Hardware Port: Wi-Fi)"
    if let Some(addr_part) = stdout.strip_prefix("Ethernet Address: ") {
        if let Some(mac) = addr_part.split_whitespace().next() {
            return mac.to_lowercase().to_string();
        }
    }
    String::new()
}

/// Get only user-configured network services (matches macOS System Settings).
/// Uses `networksetup -listnetworkserviceorder` which returns only services
/// the user has set up, not every hardware port on the machine.
#[cfg(target_os = "macos")]
fn get_hardware_port_mapping() -> std::collections::HashMap<String, (String, String)> {
    let mut mapping = std::collections::HashMap::new();

    let output = Command::new("networksetup")
        .arg("-listnetworkserviceorder")
        .output();

    if let Ok(output) = output {
        let stdout = String::from_utf8_lossy(&output.stdout);
        let mut current_service = String::new();

        for line in stdout.lines() {
            let trimmed = line.trim();

            // Device lines look like: "(Hardware Port: Wi-Fi, Device: en0)"
            // Check this FIRST since it also starts with '('
            if trimmed.starts_with("(Hardware Port:") && !current_service.is_empty() {
                if let Some(device_part) = trimmed.split("Device: ").nth(1) {
                    let device = device_part.trim_end_matches(')').trim().to_string();
                    let lower = current_service.to_lowercase();

                    let iface_type = if lower.contains("wi-fi")
                        || lower.contains("wifi")
                        || lower.contains("airport")
                    {
                        "wifi"
                    } else if lower.contains("thunderbolt bridge") {
                        "bridge"
                    } else if lower.contains("thunderbolt")
                        || lower.contains("ethernet")
                        || lower.contains("usb")
                        || lower.contains("lan")
                        || lower.contains("iphone")
                    {
                        "ethernet"
                    } else if lower.contains("bluetooth") {
                        "bluetooth"
                    } else if lower.contains("bridge") {
                        "bridge"
                    } else {
                        "other"
                    };

                    mapping.insert(device, (current_service.clone(), iface_type.to_string()));
                }
                continue;
            }

            // Service name lines look like: "(1) Wi-Fi" or "(*) Disabled Service"
            // Skip disabled services (marked with *)
            if let Some(rest) = trimmed.strip_prefix('(') {
                if let Some(idx) = rest.find(')') {
                    let marker = &rest[..idx];
                    if marker == "*" {
                        current_service.clear();
                        continue;
                    }
                    current_service = rest[idx + 1..].trim().to_string();
                }
            }
        }
    }

    mapping
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

    let is_wifi = is_wifi_interface(interface);

    // Wi-Fi: must DISASSOCIATE without powering off the interface.
    //   Powering off removes the interface entirely → "Network is down" errors.
    //   Disassociating keeps the interface alive so ifconfig ether works.
    //
    //   Strategy (tried in order):
    //   1. airport -z          (legacy macOS, removed on Sequoia+)
    //   2. CoreWLAN via swift   (works on all modern macOS)
    //   3. Direct ifconfig      (last resort)
    //
    // Non-Wi-Fi: standard down / change / up cycle.
    let shell_commands = if is_wifi {
        let airport =
            "/System/Library/PrivateFrameworks/Apple80211.framework/Resources/airport";
        let disassociate_cmd = if std::path::Path::new(airport).exists() {
            format!("{} -z 2>/dev/null", airport)
        } else {
            // Use CoreWLAN via swift to disassociate — works on Sequoia/Tahoe+
            "swift -e 'import CoreWLAN; CWWiFiClient.shared().interface()?.disassociate()' 2>/dev/null".to_string()
        };

        format!(
            "{disassociate}; \
             sleep 1; \
             /sbin/ifconfig {iface} ether {mac}",
            disassociate = disassociate_cmd,
            iface = interface,
            mac = mac,
        )
    } else {
        format!(
            "/sbin/ifconfig {iface} down; \
             /sbin/ifconfig {iface} ether {mac}; \
             /sbin/ifconfig {iface} up",
            iface = interface,
            mac = mac,
        )
    };

    let script = format!(
        "do shell script \"{}\" with administrator privileges",
        shell_commands.replace('\\', "\\\\").replace('"', "\\\"")
    );

    let output = Command::new("osascript")
        .args(["-e", &script])
        .current_dir("/tmp") // avoid sandbox cwd permission errors
        .output()
        .map_err(|e| format!("Failed to execute command: {}", e))?;

    if output.status.success() {
        Ok(format!("MAC address changed to {} on {}", mac, interface))
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr);
        if stderr.contains("cancel") || stderr.contains("User canceled") {
            Err("Operation cancelled by user".to_string())
        } else {
            Err(format!("Failed to change MAC address: {}", stderr.trim()))
        }
    }
}

/// Determine if an interface is a Wi-Fi adapter by checking networksetup.
#[cfg(target_os = "macos")]
fn is_wifi_interface(interface: &str) -> bool {
    // Check if this device is listed as Wi-Fi hardware port
    if let Ok(output) = Command::new("networksetup")
        .arg("-listallhardwareports")
        .current_dir("/tmp")
        .output()
    {
        let stdout = String::from_utf8_lossy(&output.stdout);
        let mut current_port = String::new();
        for line in stdout.lines() {
            if let Some(port) = line.strip_prefix("Hardware Port: ") {
                current_port = port.to_lowercase();
            } else if let Some(device) = line.strip_prefix("Device: ") {
                if device.trim() == interface {
                    return current_port.contains("wi-fi")
                        || current_port.contains("wifi")
                        || current_port.contains("airport");
                }
            }
        }
    }
    false
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
