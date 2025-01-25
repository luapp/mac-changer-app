/*
* © 2024 Paul Le Gall. All Rights Reserved.
* This code is proprietary and confidential. Unauthorized copying, reproduction, or redistribution is strictly prohibited.
*/


#[tauri::command]
pub fn detect_os() -> String {
    let os = std::env::consts::OS;
    os.to_string()
}

#[tauri::command]
pub fn detect_arch() -> String {
    let arch = std::env::consts::ARCH;
    arch.to_string()
}
