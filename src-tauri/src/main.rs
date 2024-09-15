use tauri::command;
use std::process::Command;

#[command]
fn mac_address_modifier(network_interface: String, mac_address: String) -> Result<String, String> {
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

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![mac_address_modifier])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
