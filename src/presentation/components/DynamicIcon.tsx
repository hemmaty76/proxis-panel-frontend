import * as LucideIcons from 'lucide-react';

interface DynamicIconProps {
  name?: string;
  size?: number;
  className?: string;
}

export default function DynamicIcon({ name, size = 16, className = '' }: DynamicIconProps) {
  if (!name) return null;
  
  // Normalize name to match PascalCase (e.g. mail -> Mail)
  const normalizedName = name.charAt(0).toUpperCase() + name.slice(1);
  const IconComponent = (LucideIcons as any)[normalizedName] || (LucideIcons as any)[name];
  
  if (!IconComponent) return null;
  return <IconComponent size={size} className={className} />;
}
