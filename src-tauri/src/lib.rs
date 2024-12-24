/*
* © 2024 Paul Le Gall. All Rights Reserved.
* This code is proprietary and confidential. Unauthorized copying, reproduction, or redistribution is strictly prohibited.
*/

mod os_utils;
mod network_utils;


#[cfg_attr(mobile, tauri::mobile_entry_point)]
macro_rules! generate_tauri_handlers {
    () => {
        tauri::generate_handler![
            os_utils::detect_os,
            os_utils::detect_arch,
            network_utils::get_all_network_interfaces,
            network_utils::get_all_wifi_interfaces,
        ]
    };
}
pub fn run() {

    tauri::Builder::default()
    .plugin(tauri_plugin_opener::init())
    .invoke_handler(generate_tauri_handlers!())
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
