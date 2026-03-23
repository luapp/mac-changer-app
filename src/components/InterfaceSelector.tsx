import {
  Wifi,
  Cable,
  Globe,
  MonitorSmartphone,
  Loader2,
  Star,
} from "lucide-react";
import { useAppStore } from "../store";
import { cn } from "../lib/utils";
import { StatusBadge } from "./StatusBadge";
import type { NetworkInterface } from "../types";

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

function InterfaceItem({ iface }: { iface: NetworkInterface }) {
  const selectedInterface = useAppStore((s) => s.selectedInterface);
  const selectInterface = useAppStore((s) => s.selectInterface);
  const favorites = useAppStore((s) => s.favorites);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const isSelected = selectedInterface === iface.name;
  const isFavorite = favorites.includes(iface.name);
  const Icon = getIcon(iface.interface_type);

  return (
    <div
      onClick={() => selectInterface(iface.name)}
      className={cn(
        "group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3.5 text-left transition-all duration-150",
        isSelected
          ? "bg-accent/10 text-text-primary ring-1 ring-accent/30"
          : "text-text-secondary hover:bg-surface-overlay/50 hover:text-text-primary",
      )}
    >
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
          isSelected
            ? "bg-accent/20 text-accent"
            : "bg-surface-overlay text-text-tertiary",
        )}
      >
        <Icon size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium">{iface.name}</span>
          <StatusBadge isUp={iface.is_up} />
        </div>
        <span className="block truncate text-xs text-text-tertiary">
          {iface.display_name}
        </span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(iface.name);
        }}
        className={cn(
          "shrink-0 rounded-md p-1 transition-all duration-150",
          isFavorite
            ? "text-warning"
            : "text-text-tertiary/0 group-hover:text-text-tertiary/50 hover:!text-warning",
        )}
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Star size={14} fill={isFavorite ? "currentColor" : "none"} />
      </button>
    </div>
  );
}

export function InterfaceSelector() {
  const interfaces = useAppStore((s) => s.interfaces);
  const favorites = useAppStore((s) => s.favorites);
  const isLoading = useAppStore((s) => s.isLoadingInterfaces);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-text-tertiary">
        <Loader2 size={24} className="animate-spin" />
        <span className="mt-2 text-xs">Loading interfaces...</span>
      </div>
    );
  }

  if (interfaces.length === 0) {
    return (
      <div className="px-3 py-8 text-center text-sm text-text-tertiary">
        No network interfaces found
      </div>
    );
  }

  const favoriteInterfaces = interfaces.filter((i) =>
    favorites.includes(i.name),
  );
  const otherInterfaces = interfaces.filter(
    (i) => !favorites.includes(i.name),
  );

  return (
    <div className="flex flex-col gap-2">
      {favoriteInterfaces.length > 0 && (
        <>
          {favoriteInterfaces.map((iface) => (
            <InterfaceItem key={iface.name} iface={iface} />
          ))}
          {otherInterfaces.length > 0 && (
            <div className="my-1 border-t border-border-subtle" />
          )}
        </>
      )}
      {otherInterfaces.map((iface) => (
        <InterfaceItem key={iface.name} iface={iface} />
      ))}
    </div>
  );
}
