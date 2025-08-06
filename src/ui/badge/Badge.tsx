'use client';

import React from 'react';
import Styles from './Badge.module.css';
import * as LucideIcons from 'lucide-react';

type BadgeVariant = 
  'primary' | 'secondary' | 'destructive' | 'outlined' | 'variable';

interface BadgeProps {
  variant?: BadgeVariant;
  showIcon: boolean;
  icon?: string;
  label?: string;
  bgcolor?: string;
  textcolor?: string; // 🆕
}

export default function Badge({
  variant = 'primary',
  showIcon,
  icon,
  label,
  bgcolor,
  textcolor,
}: BadgeProps) {
  const IconComponent = (icon && icon in LucideIcons
    ? LucideIcons[icon as keyof typeof LucideIcons]
    : LucideIcons.CircleArrowRight) as React.ElementType;

  const badgeClassname = `${Styles.badge} ${
    variant !== 'variable' ? Styles[variant] || '' : ''
  }`;

  return (
    <div
      className={badgeClassname}
      style={
        variant === 'variable'
          ? {
              backgroundColor: bgcolor,
              color: textcolor,
            }
          : undefined
      }
    >
      {showIcon && IconComponent && (
        <IconComponent
          className={Styles.icon}
          size={20}
          style={
            variant === 'variable' && textcolor
              ? { color: textcolor }
              : undefined
          }
        />
      )}
      {label && <span className={Styles.label}>{label}</span>}
    </div>
  );
}
