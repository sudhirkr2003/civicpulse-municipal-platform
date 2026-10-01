import React from 'react';

export const Logo = ({ size = 36, className = '' }) => {
  return (
    <div className={`inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="civicPulseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="50%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <linearGradient id="pillarGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#0F1E36" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
          <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <rect width="100" height="100" rx="22" fill="#0F1E36" stroke="#1E2C4A" strokeWidth="2" />

        <path
          d="M32 30 C32 18, 68 18, 68 30 Z"
          fill="none"
          stroke="url(#civicPulseGrad)"
          strokeWidth="3.5"
          filter="url(#glowEffect)"
        />

        <line x1="22" y1="32" x2="78" y2="32" stroke="#06B6D4" strokeWidth="3" strokeLinecap="round" />

        <line x1="32" y1="34" x2="32" y2="70" stroke="url(#civicPulseGrad)" strokeWidth="3" strokeLinecap="round" />
        <line x1="44" y1="34" x2="44" y2="70" stroke="url(#civicPulseGrad)" strokeWidth="3" strokeLinecap="round" />
        <line x1="56" y1="34" x2="56" y2="70" stroke="url(#civicPulseGrad)" strokeWidth="3" strokeLinecap="round" />
        <line x1="68" y1="34" x2="68" y2="70" stroke="url(#civicPulseGrad)" strokeWidth="3" strokeLinecap="round" />

        <line x1="18" y1="72" x2="82" y2="72" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="14" y1="78" x2="86" y2="78" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round" />

        <path
          d="M10 52 L28 52 L36 40 L44 64 L52 32 L60 68 L68 46 L76 52 L90 52"
          stroke="#10B981"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glowEffect)"
        />

        <circle cx="52" cy="32" r="3.5" fill="#06B6D4" filter="url(#glowEffect)" />
        <circle cx="60" cy="68" r="3" fill="#10B981" filter="url(#glowEffect)" />
      </svg>
    </div>
  );
};

export default Logo;
