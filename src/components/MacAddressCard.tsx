import { Copy, Check, Wifi, Cable, Globe, MonitorSmartphone } from "lucide-react";
import { useAppStore } from "../store";
import { StatusBadge } from "./StatusBadge";
import { useState } from "react";

function getIcon(type: string) {
  switch (type) {
    case "wifi":
      return Wifi;
    case "ethernet":
      return Cable;
    case "bluetooth":
      return MonitorSmartphone;
    default:
      return Globe;
  }
}

export function MacAddressCard() {
  const interfaces = useAppStore((s) => s.interfaces);
  const selectedInterface = useAppStore((s) => s.selectedInterface);
  const [copied, setCopied] = useState(false);

  const iface = interfaces.find((i) => i.name === selectedInterface);

  if (!iface) {
    return (
      <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-border-subtle text-text-tertiary">
        <p className="text-sm">Select a network interface</p>
      </div>
    );
  }

  const Icon = getIcon(iface.interface_type);

  const hasMac = iface.mac_address.length > 0;

  const handleCopy = async () => {
    if (!hasMac) return;
    await navigator.clipboard.writeText(iface.mac_address.toUpperCase());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-raised p-6">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <Icon size={20} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-text-primary">
              {iface.display_name}
            </h2>
            <span className="text-xs text-text-tertiary">{iface.name}</span>
          </div>
        </div>
        <StatusBadge isUp={iface.is_up} />
      </div>

      <div className="rounded-xl bg-surface/80 p-4">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-text-tertiary">
            Current MAC Address
          </span>
          {hasMac && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-text-tertiary transition-colors hover:bg-surface-overlay hover:text-text-secondary"
            >
              {copied ? (
                <>
                  <Check size={12} className="text-success" />
                  <span className="text-success">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
        </div>
        {hasMac ? (
          <p className="selectable font-mono text-2xl font-semibold tracking-widest text-text-primary">
            {iface.mac_address.toUpperCase()}
          </p>
        ) : (
          <p className="text-sm text-text-tertiary">
            Device not connected
          </p>
        )}
      </div>
    </div>
  );
}
