import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function generateRandomMac(): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  // Set locally administered bit, clear multicast bit
  bytes[0] = (bytes[0] | 0x02) & 0xfe;
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(":");
}

export function isValidMac(mac: string): boolean {
  const pattern = /^([0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}$/;
  if (!pattern.test(mac)) return false;
  const upper = mac.toUpperCase();
  if (upper === "FF:FF:FF:FF:FF:FF") return false;
  if (upper === "00:00:00:00:00:00") return false;
  return true;
}

export function formatMacInput(value: string): string {
  const hex = value.replace(/[^0-9a-fA-F]/g, "").substring(0, 12);
  const parts = hex.match(/.{1,2}/g) || [];
  return parts.join(":");
}
