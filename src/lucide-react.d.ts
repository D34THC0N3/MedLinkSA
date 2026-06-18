/* eslint-disable */
import type { ForwardRefExoticComponent, RefAttributes, SVGAttributes } from 'react';

declare module 'lucide-react' {
  interface LucideProps extends Partial<SVGAttributes<SVGSVGElement>> {
    size?: string | number;
    absoluteStrokeWidth?: boolean;
    color?: string;
    strokeWidth?: string | number;
    className?: string;
  }

  type LucideIcon = ForwardRefExoticComponent<LucideProps & RefAttributes<SVGSVGElement>>;

  // Icons missing from installed package type declarations
  export const ChevronLeft: LucideIcon;
  export const MoreVertical: LucideIcon;
  export const Edit3: LucideIcon;
  export const Loader2: LucideIcon;
  export const Server: LucideIcon;
  export const Wifi: LucideIcon;
  export const Cpu: LucideIcon;
  export const DollarSign: LucideIcon;
  export const Package: LucideIcon;
  export const Thermometer: LucideIcon;
  export const UserX: LucideIcon;
  export const Brain: LucideIcon;
  export const Bone: LucideIcon;
  export const Award: LucideIcon;
  export const LogIn: LucideIcon;
}
