'use client';

import React from 'react';
import styles from './Slider.module.css';

interface SliderProps {
    label?: string;
    name?: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    showValue?: boolean;
    disabled?: boolean;
}

export default function Slider({
    label,
    name,
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    showValue = true,
    disabled = false,
}: SliderProps) {
    return (
        <div className={styles.sliderContainer}>
        {label && (
            <label htmlFor={name} className={styles.label}>
            {label}
            </label>
        )}

        <div className={styles.sliderWrapper}>
            <input
                type="range"
                id={name}
                name={name}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                min={min}
                max={max}
                step={step}
                disabled={disabled}
                className={styles.slider}
                />
            {showValue && <span className={styles.value}>{value}</span>}
        </div>
        </div>
    );
}
