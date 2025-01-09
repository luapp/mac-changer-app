/*
* © 2024 Paul Le Gall. All Rights Reserved.
* This code is proprietary and confidential. Unauthorized copying, reproduction, or redistribution is strictly prohibited.
*/

use tauri::command;
use std::process::Command;
use tokio::task;
use std::time::Duration;

#[tauri::command]
pub fn get_all_network_interfaces() -> Result<String, String> {
    let output = std::process::Command::new("networksetup")
        .arg("-listallhardwareports")
        .output()
        .expect("failed to execute process");
    let output = String::from_utf8(output.stdout);
    match output {
        Ok(output) => {
            let output = output.split("\n");
            let mut interfaces = Vec::new();
            for line in output {
                if line.contains("Hardware Port:") {
                    let interface = line.split("Hardware Port:").collect::<Vec<&str>>()[1].trim();
                    let interface = interface.split("(").collect::<Vec<&str>>()[0].trim();
                    interfaces.push(interface);
                }
                if line.contains("Device:") {
                    let interface = line.split("Device:").collect::<Vec<&str>>()[1].trim();
                    interfaces.push(interface);
                }
                if line.contains("Ethernet Address:") {
                    let interface = line.split("Ethernet Address:").collect::<Vec<&str>>()[1].trim();
                    interfaces.push(interface);
                }
            }
            Ok(interfaces.join("\n"))
        }
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub fn get_all_wifi_interfaces() -> Result<String, String> {
    let output = std::process::Command::new("networksetup")
    .arg("-listallhardwareports")
    .output()
    .expect("failed to execute process");
    let output = String::from_utf8(output.stdout);
    match output {
        Ok(output) => {
            let output = output.split("\n");
            let mut interfaces = Vec::new();
            let mut wifi_interface_name = String::new();
            let mut wifi_interface_mac_address = String::new();
        
            for line in output {
                if line.contains("Wi-Fi") {
                    if let Some(name) = line.split("Hardware Port:").nth(1) {
                        wifi_interface_name = name.trim().to_string();
                    }
                }
                if line.contains("Ethernet Address:") && !wifi_interface_name.is_empty() {
                    if let Some(mac) = line.split("Ethernet Address:").nth(1) {
                        wifi_interface_mac_address = mac.trim().to_string();
                    }
                }
                if !wifi_interface_name.is_empty() && !wifi_interface_mac_address.is_empty() {
                    interfaces.push(vec![wifi_interface_name.clone(), wifi_interface_mac_address.clone()]);
                    wifi_interface_name.clear();
                    wifi_interface_mac_address.clear();
                }
            }
            let mut wifi_interfaces = Vec::new();
            for interface in interfaces {
                wifi_interfaces.push(interface.join("\n"));
            }
            Ok(wifi_interfaces.join("\n"))
        }
        Err(e) => Err(e.to_string()),
    }
}


#[tauri::command]
pub fn mac_address_modifier(network_interface: String, mac_address: String) -> Result<String, String> {
    let script = format!(r#"
    do shell script "networksetup -setairportpower {} off" with administrator privileges
    do shell script "networksetup -setairportpower {} on" with administrator privileges
    do shell script "ifconfig {} ether {}" with administrator privileges
    "#, network_interface, network_interface, network_interface, mac_address);

    let output = Command::new("osascript")
        .arg("-e")
        .arg(script)
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}
