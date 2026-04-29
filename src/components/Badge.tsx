import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'risk' | 'green' | 'neutral' | 'accent';
  size?: 'sm' | 'md';
}

const variantStyles: Record<string, string> = {
  risk: 'bg-red-50 text-[#B42318] border border-red-200',
  green: 'bg-emerald-50 text-[#027A48] border border-emerald-200',
  neutral: 'bg-gray-100 text-[#666666] border border-gray-200',
  accent: 'bg-amber-50 text-[#B54708] border border-amber-200',
};

const sizeStyles: Record<string, string> = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
};

export default function Badge({
  children,
  variant = 'neutral',
  size = 'md',
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${variantStyles[variant]} ${sizeStyles[size]}`}
    >
      {children}
    </span>
  );
}
