import React from 'react';
import * as LucideIcons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
  color?: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({
  name,
  className = 'w-5 h-5',
  size,
  color,
}) => {
  // @ts-ignore
  const IconComponent = LucideIcons[name] || LucideIcons.CircleDollarSign;

  return <IconComponent className={className} size={size} color={color} />;
};
