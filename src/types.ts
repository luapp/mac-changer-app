export interface NetworkInterface {
  name: string;
  display_name: string;
  mac_address: string;
  is_up: boolean;
  interface_type: string;
}

export interface PermissionStatus {
  is_admin: boolean;
  message: string;
}

export interface Toast {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

export interface AppData {
  favorites: string[];
  original_macs: Record<string, string>;
  history: string[];
}
