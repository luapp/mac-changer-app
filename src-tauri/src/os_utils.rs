/*
* © 2024 Paul Le Gall. All Rights Reserved.
* This code is proprietary and confidential. Unauthorized copying, reproduction, or redistribution is strictly prohibited.
*/

use tokio::task;
use std::time::Duration;

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

#[tauri::command]
pub async fn random_time_perso() -> Result<String, String> {
    // Offload the blocking task to a separate thread
    let handle = task::spawn_blocking(|| {
        std::thread::sleep(Duration::from_secs(5));  // Blocking operation
        println!("Blocking operation finished.");
        
        // Return a successful Result from the blocking task
        Ok::<String, String>("Blocking operation finished.".to_string())
    });

    // Await the result of the blocking task
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