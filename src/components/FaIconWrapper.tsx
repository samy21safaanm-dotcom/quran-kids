import * as FaIcons from 'react-icons/fa';

// Wrapper to allow className prop for all react-icons/fa icons
export function getFaIcon(name: string, className: string) {
  const Icon = (FaIcons as any)[name];
  if (!Icon) return null;
  return <Icon className={className} />;
}
