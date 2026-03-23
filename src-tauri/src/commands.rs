use crate::data::{self, AppData};
use crate::network;
use crate::AppState;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct NetworkInterface {
    pub name: String,
    pub display_name: String,
    pub mac_address: String,
    pub is_up: bool,
    pub interface_type: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PermissionStatus {
    pub is_admin: bool,
    pub message: String,
}

// ── Network commands ──────────────────────────────────────────

#[tauri::command]
pub fn get_interfaces() -> Result<Vec<NetworkInterface>, String> {
    network::get_interfaces()
}

#[tauri::command]
pub fn get_current_mac(interface: String) -> Result<String, String> {
    network::get_current_mac(&interface)
}

#[tauri::command]
pub fn set_mac(
    interface: String,
    mac: String,
    state: tauri::State<AppState>,
) -> Result<String, String> {
    if !network::validate_interface_name(&interface) {
        return Err("Invalid interface name".to_string());
    }
    if !network::validate_mac_address(&mac) {
        return Err("Invalid MAC address format. Use XX:XX:XX:XX:XX:XX".to_string());
    }

    // Store original MAC on first change
    {
        let mut originals = state.original_macs.lock().map_err(|e| e.to_string())?;
        if !originals.contains_key(&interface) {
            if let Ok(current) = network::get_current_mac(&interface) {
                originals.insert(interface.clone(), current);
            }
        }
    }

    network::set_mac(&interface, &mac)
}

#[tauri::command]
pub fn reset_mac(
    interface: String,
    state: tauri::State<AppState>,
) -> Result<String, String> {
    let originals = state.original_macs.lock().map_err(|e| e.to_string())?;
    let original_mac = originals
        .get(&interface)
        .ok_or_else(|| {
            "No original MAC address stored. MAC has not been changed this session.".to_string()
        })?
        .clone();
    drop(originals);

    network::set_mac(&interface, &original_mac)?;

    let mut originals = state.original_macs.lock().map_err(|e| e.to_string())?;
    originals.remove(&interface);

    Ok(format!(
        "MAC address reset to {} on {}",
        original_mac, interface
    ))
}

#[tauri::command]
pub fn check_permissions() -> Result<PermissionStatus, String> {
    network::check_permissions()
}

// ── Data persistence commands ─────────────────────────────────

#[tauri::command]
pub fn load_app_data(
    app: tauri::AppHandle,
    state: tauri::State<AppState>,
) -> Result<AppData, String> {
    let app_data = data::load(&app)?;

    // Restore original MACs into in-memory state
    let mut originals = state.original_macs.lock().map_err(|e| e.to_string())?;
    for (k, v) in &app_data.original_macs {
        originals.entry(k.clone()).or_insert_with(|| v.clone());
    }

    Ok(app_data)
}

#[tauri::command]
pub fn save_app_data(
    app: tauri::AppHandle,
    mut save_data: AppData,
    state: tauri::State<AppState>,
) -> Result<(), String> {
    // Merge current in-memory original MACs
    let originals = state.original_macs.lock().map_err(|e| e.to_string())?;
    save_data.original_macs = originals.clone();

    data::save(&app, &save_data)
}

#[tauri::command]
pub fn export_app_data(
    app: tauri::AppHandle,
    export_path: String,
    state: tauri::State<AppState>,
) -> Result<(), String> {
    let mut app_data = data::load(&app).unwrap_or_default();

    // Ensure latest original MACs
    let originals = state.original_macs.lock().map_err(|e| e.to_string())?;
    app_data.original_macs = originals.clone();

    let content = serde_json::to_string_pretty(&app_data).map_err(|e| e.to_string())?;
    std::fs::write(&export_path, content).map_err(|e| format!("Failed to export: {}", e))
}

#[tauri::command]
pub fn import_app_data(
    app: tauri::AppHandle,
    import_path: String,
    state: tauri::State<AppState>,
) -> Result<AppData, String> {
    let content =
        std::fs::read_to_string(&import_path).map_err(|e| format!("Failed to read file: {}", e))?;
    let app_data: AppData =
        serde_json::from_str(&content).map_err(|e| format!("Invalid data format: {}", e))?;

    // Save to app data directory
    data::save(&app, &app_data)?;

    // Update in-memory state
    let mut originals = state.original_macs.lock().map_err(|e| e.to_string())?;
    *originals = app_data.original_macs.clone();

    Ok(app_data)
}

#[tauri::command]
pub fn get_data_path(app: tauri::AppHandle) -> Result<String, String> {
    let path = data::get_data_file_path(&app)?;
    Ok(path.to_string_lossy().to_string())
}
