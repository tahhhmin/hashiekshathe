'use client';

import React from 'react';
import * as LucideIcons from 'lucide-react';
import styles from './Alert.module.css';

type Variant = 'default' | 'warning' | 'danger' | 'success' | 'info';

interface AlertProps {
  title: string;
  description?: string;
  icon?: string | React.ReactNode;
  variant?: Variant;
}

export default function Alert({
  title,
  description,
  icon = 'CircleAlert',
  variant = 'default',
}: AlertProps) {
  const isStringIcon = typeof icon === 'string';

  const IconComponent =
    isStringIcon && icon in LucideIcons
      ? (LucideIcons[icon as keyof typeof LucideIcons] as React.ElementType)
      : null;

  return (
    <div className={`${styles.container} ${styles[variant]}`}>
      <div className={styles.iconContainer}>
        {isStringIcon && IconComponent ? (
          <IconComponent className={`${styles.icon} ${styles[`${variant}Icon`]}`} size={24} />
        ) : (
          <span className={`${styles.icon} ${styles[`${variant}Icon`]}`}>{icon}</span>
        )}
      </div>
      <div className={styles.textContainer}>
        <p className={`${styles.title} ${styles[`${variant}Text`]}`}>{title}</p>
        {description && (
          <p className={`${styles.description} ${styles[`${variant}Text`]}`}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
