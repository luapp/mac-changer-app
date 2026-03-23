import { ShieldAlert } from "lucide-react";
import { useAppStore } from "../store";

export function PermissionBanner() {
  const permissions = useAppStore((s) => s.permissions);

  if (!permissions || permissions.is_admin) return null;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-warning/20 bg-warning/5 px-4 py-3 text-sm">
      <ShieldAlert size={18} className="shrink-0 text-warning" />
      <p className="text-warning/90">{permissions.message}</p>
    </div>
  );
}
