import { Clock, Copy } from "lucide-react";
import { useAppStore } from "../store";
import { useState } from "react";

export function HistoryPanel() {
  const history = useAppStore((s) => s.history);
  const setNewMac = useAppStore((s) => s.setNewMac);

  if (history.length === 0) return null;

  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5">
        <Clock size={12} className="text-text-tertiary" />
        <span className="text-xs font-medium uppercase tracking-wider text-text-tertiary">
          Recent
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {history.map((mac) => (
          <HistoryChip key={mac} mac={mac} onUse={() => setNewMac(mac)} />
        ))}
      </div>
    </div>
  );
}

function HistoryChip({ mac, onUse }: { mac: string; onUse: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(mac.toUpperCase());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={onUse}
      className="group flex items-center gap-2 rounded-lg border border-border-subtle bg-surface-raised px-3 py-1.5 font-mono text-xs text-text-secondary transition-colors hover:border-accent/30 hover:text-text-primary"
    >
      {mac.toUpperCase()}
      <span
        onClick={handleCopy}
        className="opacity-0 transition-opacity group-hover:opacity-60 hover:!opacity-100"
      >
        <Copy size={10} />
      </span>
      {copied && (
        <span className="text-[10px] text-success">copied</span>
      )}
    </button>
  );
}
