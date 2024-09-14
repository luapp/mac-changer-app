use tauri::command;
use std::process::Command;

#[command]
fn wifi_card_toggle_execution(card_name: String, mac_add: String) -> Result<String, String> {
    let script = format!(r#"
    do shell script "networksetup -setairportpower {} off" with administrator privileges
    do shell script "networksetup -setairportpower {} on" with administrator privileges
    do shell script "ifconfig {} ether {}" with administrator privileges
    "#, card_name, card_name, card_name, mac_add);

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
        .invoke_handler(tauri::generate_handler![wifi_card_toggle_execution])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
