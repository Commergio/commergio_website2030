import {
  Globe,
  Smartphone,
  Settings,
  Palette,
  TrendingUp,
  CreditCard,
  Briefcase,
  ShoppingBag,
  Search,
  Brain,
  type LucideIcon,
} from 'lucide-react';

export const SERVICE_ICON_OPTIONS = [
  'Globe',
  'Smartphone',
  'Settings',
  'Palette',
  'TrendingUp',
  'CreditCard',
  'Briefcase',
  'ShoppingBag',
  'Search',
  'Brain',
] as const;

export type ServiceIconName = (typeof SERVICE_ICON_OPTIONS)[number];

const ICON_MAP: Record<ServiceIconName, LucideIcon> = {
  Globe,
  Smartphone,
  Settings,
  Palette,
  TrendingUp,
  CreditCard,
  Briefcase,
  ShoppingBag,
  Search,
  Brain,
};

export function getServiceIcon(name: string): LucideIcon {
  return ICON_MAP[name as ServiceIconName] ?? Globe;
}
