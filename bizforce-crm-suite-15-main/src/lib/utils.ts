
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import * as LucideIcons from "lucide-react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getLucideIcon = (iconName: string) => {
  // Ensure we have a valid icon name and it exists in LucideIcons
  if (!iconName || typeof iconName !== 'string') {
    return LucideIcons.AppWindow;
  }

  // Try to get the icon from LucideIcons
  const Icon = (LucideIcons as any)[iconName];
  
  // Return the icon if it exists, otherwise return a default icon
  return Icon && typeof Icon === 'function' ? Icon : LucideIcons.AppWindow;
};
