/*
* © 2024 Paul Le Gall. All Rights Reserved.
* This code is proprietary and confidential. Unauthorized copying, reproduction, or redistribution is strictly prohibited.
*/

use tokio::task;

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
                    let interface =
                        line.split("Ethernet Address:").collect::<Vec<&str>>()[1].trim();
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
                    interfaces.push(vec![
                        wifi_interface_name.clone(),
                        wifi_interface_mac_address.clone(),
                    ]);
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
pub async fn modify_random_mac_address(network_interface: String, mac_address: String) -> Result<String, String> {
    // Offload the blocking task to a separate thread
    let handle = task::spawn_blocking(move || {
        // Perform the blocking task
        let script = format!(r#"
            do shell script "networksetup -setairportpower {} off" with administrator privileges
            do shell script "networksetup -setairportpower {} on" with administrator privileges
            do shell script "ifconfig {} ether {}" with administrator privileges
            "#, network_interface, network_interface, network_interface, mac_address);

        let output = std::process::Command::new("osascript")
            .arg("-e")
            .arg(script)
            .output()
            .map_err(|e| e.to_string())?;
        Ok::<String, String>("Blocking operation finished.".to_string())
    });
    let result = handle.await.unwrap();

    match result {
        Ok(message) => {
            println!("{}", message);
            Ok("Finished blocking operation.".to_string()) // Return success message
        }
        Err(e) => {
            println!("Error in blocking operation: {}", e);
            Err("Error during blocking operation.".to_string()) // Return error message
        }
    }
}
