import { Shuffle, Check, RotateCcw, Loader2 } from "lucide-react";
import { useAppStore } from "../store";
import { isValidMac, cn } from "../lib/utils";

export function ActionButtons() {
  const selectedInterface = useAppStore((s) => s.selectedInterface);
  const newMac = useAppStore((s) => s.newMac);
  const isApplying = useAppStore((s) => s.isApplying);
  const isResetting = useAppStore((s) => s.isResetting);
  const randomizeMac = useAppStore((s) => s.randomizeMac);
  const applyMac = useAppStore((s) => s.applyMac);
  const performReset = useAppStore((s) => s.performReset);

  const interfaces = useAppStore((s) => s.interfaces);
  const iface = interfaces.find((i) => i.name === selectedInterface);
  const hasMac = iface ? iface.mac_address.length > 0 : false;

  const canApply = selectedInterface && hasMac && newMac && isValidMac(newMac) && !isApplying;
  const canReset = selectedInterface && hasMac && !isResetting;
  const isDisabled = !selectedInterface || !hasMac;

  return (
    <div className="flex gap-3">
      <button
        onClick={randomizeMac}
        disabled={isDisabled}
        className={cn(
          "flex flex-1 items-center justify-center gap-2 rounded-xl border border-border-subtle px-4 py-3 text-sm font-medium transition-all duration-150",
          "bg-surface-raised text-text-secondary hover:bg-surface-overlay hover:text-text-primary",
          "disabled:cursor-not-allowed disabled:opacity-40",
        )}
      >
        <Shuffle size={15} />
        Randomize
      </button>

      <button
        onClick={applyMac}
        disabled={!canApply}
        className={cn(
          "flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-150",
          "bg-accent text-white hover:bg-accent-hover",
          "disabled:cursor-not-allowed disabled:opacity-40",
        )}
      >
        {isApplying ? (
          <Loader2 size={15} className="animate-spin" />
        ) : (
          <Check size={15} />
        )}
        {isApplying ? "Applying..." : "Apply"}
      </button>

      <button
        onClick={performReset}
        disabled={!canReset}
        className={cn(
          "flex flex-1 items-center justify-center gap-2 rounded-xl border border-border-subtle px-4 py-3 text-sm font-medium transition-all duration-150",
          "bg-surface-raised text-text-secondary hover:bg-surface-overlay hover:text-text-primary",
          "disabled:cursor-not-allowed disabled:opacity-40",
        )}
      >
        {isResetting ? (
          <Loader2 size={15} className="animate-spin" />
        ) : (
          <RotateCcw size={15} />
        )}
        {isResetting ? "Resetting..." : "Reset"}
      </button>
    </div>
  );
}
