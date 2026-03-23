import { invoke } from "@tauri-apps/api/core";
import type { NetworkInterface, PermissionStatus, AppData } from "../types";

export async function getInterfaces(): Promise<NetworkInterface[]> {
  return invoke<NetworkInterface[]>("get_interfaces");
}

export async function getCurrentMac(iface: string): Promise<string> {
  return invoke<string>("get_current_mac", { interface: iface });
}

export async function setMac(iface: string, mac: string): Promise<string> {
  return invoke<string>("set_mac", { interface: iface, mac });
}

export async function resetMac(iface: string): Promise<string> {
  return invoke<string>("reset_mac", { interface: iface });
}

export async function checkPermissions(): Promise<PermissionStatus> {
  return invoke<PermissionStatus>("check_permissions");
}

export async function loadAppData(): Promise<AppData> {
  return invoke<AppData>("load_app_data");
}

export async function saveAppData(data: AppData): Promise<void> {
  return invoke("save_app_data", { saveData: data });
}

export async function exportAppData(exportPath: string): Promise<void> {
  return invoke("export_app_data", { exportPath });
}

export async function importAppData(importPath: string): Promise<AppData> {
  return invoke<AppData>("import_app_data", { importPath });
}

export async function getDataPath(): Promise<string> {
  return invoke<string>("get_data_path");
}
