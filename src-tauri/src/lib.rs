/*
* © 2024 Paul Le Gall. All Rights Reserved.
* This code is proprietary and confidential. Unauthorized copying, reproduction, or redistribution is strictly prohibited.
*/

#[tauri::command]
fn detect_os() -> String {
    let os = std::env::consts::OS;
    os.to_string()
}

#[tauri::command]
fn detect_arch() -> String {
    let arch = std::env::consts::ARCH;
    arch.to_string()
}

#[tauri::command]
fn get_all_network_interfaces() -> Result<String, String> {
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



#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_all_network_interfaces, detect_os, detect_arch])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
