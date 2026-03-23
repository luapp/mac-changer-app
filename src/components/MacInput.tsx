import { useAppStore } from "../store";
import { formatMacInput, isValidMac } from "../lib/utils";
import { cn } from "../lib/utils";

export function MacInput() {
  const newMac = useAppStore((s) => s.newMac);
  const setNewMac = useAppStore((s) => s.setNewMac);
  const selectedInterface = useAppStore((s) => s.selectedInterface);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatMacInput(e.target.value);
    setNewMac(formatted);
  };

  const isComplete = newMac.length === 17;
  const isValid = isComplete && isValidMac(newMac);
  const showError = isComplete && !isValid;

  return (
    <div>
      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-text-tertiary">
        New MAC Address
      </label>
      <input
        type="text"
        value={newMac}
        onChange={handleChange}
        disabled={!selectedInterface}
        placeholder="XX:XX:XX:XX:XX:XX"
        maxLength={17}
        className={cn(
          "w-full rounded-xl border bg-surface-raised px-4 py-3 font-mono text-lg tracking-wider text-text-primary placeholder:text-text-tertiary/40 transition-all duration-150",
          "focus:outline-none focus:ring-2 focus:ring-offset-0",
          "disabled:cursor-not-allowed disabled:opacity-40",
          showError
            ? "border-danger/50 focus:ring-danger/30"
            : "border-border-subtle focus:border-accent/50 focus:ring-accent/20",
        )}
      />
      {showError && (
        <p className="mt-1.5 text-xs text-danger">
          Invalid MAC address. Cannot be broadcast or all zeros.
        </p>
      )}
    </div>
  );
}
