'use client';

import React from 'react';
import styles from './Switch.module.css';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
}

export default function Switch({
  checked,
  onChange,
  label,
  disabled = false,
  id,
  name,
}: SwitchProps) {
  const switchId = id || `switch-${Math.random().toString(36).slice(2)}`;

  return (
    <div className={styles.switchContainer}>
      {label && (
        <p className={styles.label}>
          {label}
        </p>
      )}
      <label className={styles.switch}>
        <input
          type="checkbox"
          id={switchId}
          name={name}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className={styles.input}
        />
        <span className={styles.slider} />
      </label>
    </div>
  );
}
