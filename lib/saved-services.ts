import { toast } from "sonner";
import type { RepairService } from "@/lib/services-data";

const SAVED_STORAGE_KEY = "fixitnow_saved_services";

export function getSavedServices(): RepairService[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SAVED_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isServiceSaved(serviceId: string): boolean {
  const saved = getSavedServices();
  return saved.some((s) => s.id === serviceId);
}

export function toggleSaveService(service: RepairService): boolean {
  const saved = getSavedServices();
  const exists = saved.some((s) => s.id === service.id);

  let updated: RepairService[];
  if (exists) {
    updated = saved.filter((s) => s.id !== service.id);
    toast.success(`Removed "${service.name}" from your saved list.`);
  } else {
    updated = [service, ...saved];
    toast.success(`Saved "${service.name}" to your favorites!`);
  }

  try {
    localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to update saved services in localStorage", err);
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("saved-services-updated"));
  }

  return !exists;
}
