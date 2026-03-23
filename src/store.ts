import { create } from "zustand";
import type { NetworkInterface, PermissionStatus, Toast } from "./types";
import {
  getInterfaces,
  setMac,
  resetMac,
  checkPermissions,
  loadAppData,
  saveAppData,
} from "./lib/commands";
import { generateRandomMac } from "./lib/utils";

interface AppStore {
  interfaces: NetworkInterface[];
  selectedInterface: string | null;
  newMac: string;
  permissions: PermissionStatus | null;
  favorites: string[];
  history: string[];
  toasts: Toast[];
  isLoadingInterfaces: boolean;
  isApplying: boolean;
  isResetting: boolean;
  settingsOpen: boolean;

  init: () => Promise<void>;
  fetchInterfaces: () => Promise<void>;
  selectInterface: (name: string) => void;
  setNewMac: (mac: string) => void;
  randomizeMac: () => void;
  applyMac: () => Promise<void>;
  performReset: () => Promise<void>;
  fetchPermissions: () => Promise<void>;
  toggleFavorite: (name: string) => void;
  setSettingsOpen: (open: boolean) => void;
  addToast: (type: Toast["type"], message: string) => void;
  removeToast: (id: string) => void;
  persistData: () => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  interfaces: [],
  selectedInterface: null,
  newMac: "",
  permissions: null,
  favorites: [],
  history: [],
  toasts: [],
  isLoadingInterfaces: false,
  isApplying: false,
  isResetting: false,
  settingsOpen: false,

  init: async () => {
    try {
      const data = await loadAppData();
      set({
        favorites: data.favorites,
        history: data.history,
      });
    } catch {
      // First run - no data file yet
    }
    get().fetchInterfaces();
    get().fetchPermissions();
  },

  fetchInterfaces: async () => {
    set({ isLoadingInterfaces: true });
    try {
      const interfaces = await getInterfaces();
      const state = get();
      set({
        interfaces,
        isLoadingInterfaces: false,
        selectedInterface:
          state.selectedInterface &&
          interfaces.some((i) => i.name === state.selectedInterface)
            ? state.selectedInterface
            : interfaces.length > 0
              ? interfaces[0].name
              : null,
      });
    } catch (e) {
      set({ isLoadingInterfaces: false });
      get().addToast("error", `Failed to load interfaces: ${e}`);
    }
  },

  selectInterface: (name: string) => {
    set({ selectedInterface: name, newMac: "" });
  },

  setNewMac: (mac: string) => {
    set({ newMac: mac });
  },

  randomizeMac: () => {
    const mac = generateRandomMac();
    set({ newMac: mac });
  },

  applyMac: async () => {
    const { selectedInterface, newMac, history } = get();
    if (!selectedInterface || !newMac) return;

    set({ isApplying: true });
    try {
      const result = await setMac(selectedInterface, newMac);
      const updatedHistory = [
        newMac,
        ...history.filter((m) => m !== newMac),
      ].slice(0, 10);
      set({
        isApplying: false,
        history: updatedHistory,
        newMac: "",
      });
      get().addToast("success", result);
      get().persistData();
      get().fetchInterfaces();
    } catch (e) {
      set({ isApplying: false });
      get().addToast("error", `${e}`);
    }
  },

  performReset: async () => {
    const { selectedInterface } = get();
    if (!selectedInterface) return;

    set({ isResetting: true });
    try {
      const result = await resetMac(selectedInterface);
      set({ isResetting: false });
      get().addToast("success", result);
      get().persistData();
      get().fetchInterfaces();
    } catch (e) {
      set({ isResetting: false });
      get().addToast("error", `${e}`);
    }
  },

  fetchPermissions: async () => {
    try {
      const permissions = await checkPermissions();
      set({ permissions });
    } catch {
      // Silently handle
    }
  },

  toggleFavorite: (name: string) => {
    const { favorites } = get();
    const updated = favorites.includes(name)
      ? favorites.filter((f) => f !== name)
      : [...favorites, name];
    set({ favorites: updated });
    get().persistData();
  },

  setSettingsOpen: (open: boolean) => {
    set({ settingsOpen: open });
  },

  addToast: (type, message) => {
    const id = crypto.randomUUID();
    set((state) => ({
      toasts: [...state.toasts, { id, type, message }],
    }));
    setTimeout(() => {
      get().removeToast(id);
    }, 4000);
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  persistData: () => {
    const { favorites, history } = get();
    saveAppData({
      favorites,
      history,
      original_macs: {},
    }).catch(() => {
      // Best-effort save
    });
  },
}));
