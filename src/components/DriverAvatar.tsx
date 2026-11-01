import React, { useState } from 'react';
import { Car } from 'lucide-react';

interface DriverAvatarProps {
  photoUrl: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const DriverAvatar: React.FC<DriverAvatarProps> = ({
  photoUrl,
  name,
  size = 'md',
  className = ''
}) => {
  const [hasError, setHasError] = useState(false);

  // Compute initials e.g. "Si Hassan El Amrani" -> "SH" or "HA"
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase())
    .join('');

  const sizeClasses = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base'
  }[size];

  if (hasError || !photoUrl) {
    return (
      <div
        className={`${sizeClasses} rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white font-extrabold flex flex-col items-center justify-center shadow-sm border border-amber-400/40 shrink-0 ${className}`}
        title={name}
      >
        <span className="leading-none">{initials || 'TX'}</span>
        <span className="text-[9px] opacity-80 leading-none mt-0.5">TAXI</span>
      </div>
    );
  }

  return (
    <div className={`relative ${sizeClasses} rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 shadow-sm ${className}`}>
      <img
        src={photoUrl}
        alt={name}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className="w-full h-full object-cover"
      />
    </div>
  );
};
