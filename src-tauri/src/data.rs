use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;
use tauri::Manager;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AppData {
    #[serde(default)]
    pub favorites: Vec<String>,
    #[serde(default)]
    pub original_macs: HashMap<String, String>,
    #[serde(default)]
    pub history: Vec<String>,
}

impl Default for AppData {
    fn default() -> Self {
        Self {
            favorites: Vec::new(),
            original_macs: HashMap::new(),
            history: Vec::new(),
        }
    }
}

pub fn get_data_file_path(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    let data_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    fs::create_dir_all(&data_dir).map_err(|e| e.to_string())?;
    Ok(data_dir.join("app_data.json"))
}

pub fn load(app: &tauri::AppHandle) -> Result<AppData, String> {
    let path = get_data_file_path(app)?;
    if !path.exists() {
        return Ok(AppData::default());
    }
    let content =
        fs::read_to_string(&path).map_err(|e| format!("Failed to read data file: {}", e))?;
    serde_json::from_str(&content).map_err(|e| format!("Failed to parse data file: {}", e))
}

pub fn save(app: &tauri::AppHandle, data: &AppData) -> Result<(), String> {
    let path = get_data_file_path(app)?;
    let content = serde_json::to_string_pretty(data).map_err(|e| e.to_string())?;
    fs::write(&path, content).map_err(|e| format!("Failed to save data: {}", e))
}
