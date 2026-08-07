import { cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  /** Show an online status indicator dot. */
  showStatus?: boolean;
  status?: "ACTIVE" | "BANNED";
}

const SIZE_CLASSES: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-lg",
  xl: "h-24 w-24 text-2xl",
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (
    parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
  ).toUpperCase();
}

/**
 * Avatar with graceful fallback chain:
 * 1. Remote image (if `src` provided and loads)
 * 2. Initials on a gradient background (default)
 */
export function Avatar({
  name,
  src,
  size = "md",
  className,
  showStatus = false,
  status = "ACTIVE",
}: AvatarProps) {
  const isActive = status === "ACTIVE";

  return (
    <div className={cn("relative inline-flex shrink-0", className)}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          className={cn(
            "rounded-full object-cover ring-2 ring-white dark:ring-slate-800 shadow-xs",
            SIZE_CLASSES[size],
          )}
        />
      ) : (
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 font-bold text-white ring-2 ring-white dark:ring-slate-800 shadow-xs",
            SIZE_CLASSES[size],
          )}
        >
          {getInitials(name)}
        </span>
      )}

      {showStatus && (
        <span
          className={cn(
            "absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-800",
            isActive ? "bg-emerald-500" : "bg-rose-500",
          )}
          aria-label={isActive ? "Active" : "Banned"}
        />
      )}
    </div>
  );
}
