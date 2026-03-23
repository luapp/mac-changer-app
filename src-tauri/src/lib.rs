mod commands;
mod data;
mod network;

use std::collections::HashMap;
use std::sync::Mutex;

pub struct AppState {
    pub original_macs: Mutex<HashMap<String, String>>,
}

impl AppState {
    pub fn new() -> Self {
        Self {
            original_macs: Mutex::new(HashMap::new()),
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .manage(AppState::new())
        .invoke_handler(tauri::generate_handler![
            commands::get_interfaces,
            commands::get_current_mac,
            commands::set_mac,
            commands::reset_mac,
            commands::check_permissions,
            commands::load_app_data,
            commands::save_app_data,
            commands::export_app_data,
            commands::import_app_data,
            commands::get_data_path,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
