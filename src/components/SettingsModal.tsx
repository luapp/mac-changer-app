import { useEffect, useState } from "react";
import {
  X,
  FolderOpen,
  Download,
  Upload,
  Loader2,
  HardDrive,
} from "lucide-react";
import { save, open } from "@tauri-apps/plugin-dialog";
import { useAppStore } from "../store";
import {
  getDataPath,
  exportAppData,
  importAppData,
} from "../lib/commands";

export function SettingsModal() {
  const settingsOpen = useAppStore((s) => s.settingsOpen);
  const setSettingsOpen = useAppStore((s) => s.setSettingsOpen);
  const addToast = useAppStore((s) => s.addToast);
  const [dataPath, setDataPath] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    if (settingsOpen) {
      getDataPath().then(setDataPath).catch(() => {});
    }
  }, [settingsOpen]);

  if (!settingsOpen) return null;

  const handleExport = async () => {
    try {
      const filePath = await save({
        filters: [{ name: "JSON", extensions: ["json"] }],
        defaultPath: "mac-changer-backup.json",
      });
      if (!filePath) return;

      setIsExporting(true);
      await exportAppData(filePath);
      addToast("success", "Data exported successfully");
    } catch (e) {
      addToast("error", `Export failed: ${e}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async () => {
    try {
      const filePath = await open({
        filters: [{ name: "JSON", extensions: ["json"] }],
        multiple: false,
      });
      if (!filePath) return;

      setIsImporting(true);
      const data = await importAppData(filePath as string);
      // Update the store with imported data
      useAppStore.setState({
        favorites: data.favorites,
        history: data.history,
      });
      addToast("success", "Data imported successfully");
    } catch (e) {
      addToast("error", `Import failed: ${e}`);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[480px] rounded-2xl border border-border-subtle bg-surface-raised shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
          <h2 className="text-base font-semibold">Settings</h2>
          <button
            onClick={() => setSettingsOpen(false)}
            className="rounded-lg p-1.5 text-text-tertiary transition-colors hover:bg-surface-overlay hover:text-text-secondary"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-6 p-6">
          {/* Data Storage */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <HardDrive size={14} className="text-text-tertiary" />
              <h3 className="text-sm font-medium">Data Storage</h3>
            </div>
            <div className="rounded-xl border border-border-subtle bg-surface/80 p-3">
              <p className="mb-1 text-xs text-text-tertiary">
                Data file location
              </p>
              <p className="selectable break-all font-mono text-xs text-text-secondary">
                {dataPath || "Loading..."}
              </p>
            </div>
            <p className="mt-2 text-xs text-text-tertiary">
              Favorites, MAC history, and original addresses are saved
              automatically and persist across sessions.
            </p>
          </section>

          {/* Export & Import */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <FolderOpen size={14} className="text-text-tertiary" />
              <h3 className="text-sm font-medium">Export & Import</h3>
            </div>
            <p className="mb-4 text-xs text-text-tertiary">
              Back up your data or restore from a previous backup file.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border-subtle bg-surface px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-overlay hover:text-text-primary disabled:opacity-40"
              >
                {isExporting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Download size={14} />
                )}
                Export
              </button>
              <button
                onClick={handleImport}
                disabled={isImporting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border-subtle bg-surface px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-overlay hover:text-text-primary disabled:opacity-40"
              >
                {isImporting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Upload size={14} />
                )}
                Import
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
