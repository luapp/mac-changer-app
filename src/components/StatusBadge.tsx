import { cn } from "../lib/utils";

interface StatusBadgeProps {
  isUp: boolean;
}

export function StatusBadge({ isUp }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        isUp
          ? "bg-success/10 text-success"
          : "bg-zinc-700/50 text-text-tertiary",
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          isUp ? "bg-success animate-pulse" : "bg-zinc-500",
        )}
      />
      {isUp ? "Active" : "Inactive"}
    </span>
  );
}
