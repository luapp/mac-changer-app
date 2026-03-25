import { useEffect } from "react";
import { Network, RefreshCw, Settings } from "lucide-react";
import { useAppStore } from "./store";
import { InterfaceSelector } from "./components/InterfaceSelector";
import { MacAddressCard } from "./components/MacAddressCard";
import { MacInput } from "./components/MacInput";
import { ActionButtons } from "./components/ActionButtons";
import { PermissionBanner } from "./components/PermissionBanner";
import { HistoryPanel } from "./components/HistoryPanel";
import { ToastContainer } from "./components/ToastContainer";
import { SettingsModal } from "./components/SettingsModal";

function App() {
  const init = useAppStore((s) => s.init);
  const fetchInterfaces = useAppStore((s) => s.fetchInterfaces);
  const isLoadingInterfaces = useAppStore((s) => s.isLoadingInterfaces);
  const setSettingsOpen = useAppStore((s) => s.setSettingsOpen);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div className="flex h-screen bg-surface text-text-primary">
      {/* Sidebar */}
      <aside className="flex w-72 shrink-0 flex-col border-r border-border-subtle bg-surface">
        <div className="flex items-center gap-3 border-b border-border-subtle px-5 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Network size={16} />
          </div>
          <div>
            <h1 className="text-sm font-semibold">MAC Changer</h1>
            <p className="text-[11px] text-text-tertiary">Network Interfaces</p>
          </div>
        </div>

        <div className="flex items-center justify-between px-5 pb-2 pt-4">
          <span className="text-xs font-medium uppercase tracking-wider text-text-tertiary">
            Interfaces
          </span>
          <button
            onClick={fetchInterfaces}
            disabled={isLoadingInterfaces}
            className="rounded-md p-1 text-text-tertiary transition-colors hover:bg-surface-overlay hover:text-text-secondary disabled:opacity-40"
            title="Refresh interfaces"
          >
            <RefreshCw
              size={12}
              className={isLoadingInterfaces ? "animate-spin" : ""}
            />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-4 pt-1">
          <InterfaceSelector />
        </div>

        <div className="flex items-center justify-between border-t border-border-subtle px-5 py-3">
          <p className="text-[11px] text-text-tertiary">
            &copy; {new Date().getFullYear()} Paul Le Gall
          </p>
          <button
            onClick={() => setSettingsOpen(true)}
            className="rounded-md p-1.5 text-text-tertiary transition-colors hover:bg-surface-overlay hover:text-text-secondary"
            title="Settings"
          >
            <Settings size={14} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col overflow-y-auto">
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-8">
          <PermissionBanner />
          <MacAddressCard />
          <MacInput />
          <ActionButtons />
          <HistoryPanel />
        </div>
      </main>

      <SettingsModal />
      <ToastContainer />
    </div>
  );
}

export default App;
