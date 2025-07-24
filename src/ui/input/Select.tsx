'use client';

import React, { useState, useRef, useEffect } from 'react';
import * as Icons from 'lucide-react';
import Styles from './Select.module.css';
import { ChevronDown } from 'lucide-react';

interface Option {
  label: string;
  value: string | boolean;
}

interface SelectInputProps {
  label?: string;
  name?: string;
  value: string | boolean;
  onChange: (value: string | boolean) => void; // simplified to just pass value
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  showIcon?: boolean;
  icon?: keyof typeof Icons; // icon name string like 'User', 'Mail'
  showHelpText?: boolean;
  helpText?: string;
  options: Option[];
}

export default function SelectInput({
  label,
  name,
  value,
  onChange,
  required,
  disabled,
  placeholder = 'Select an option',
  showIcon = false,
  icon,
  showHelpText,
  helpText,
  options,
}: SelectInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const IconComponent = icon && Icons[icon] ? Icons[icon] : null;
  const IconComp = IconComponent as React.ElementType | null;

  // Find selected option object for label display
  const selectedOption = options.find(
    (opt) => String(opt.value) === String(value)
  );

  // Handle selection of an option
  const handleSelect = (opt: Option) => {
    onChange(opt.value);
    setIsOpen(false);
  };

  return (
    <div className={Styles.container} ref={containerRef}>
      {label && (
        <label htmlFor={name} id={`${name}-label`}>
          {label}
        </label>
      )}

      <div
        className={`${Styles.wrapper} ${disabled ? Styles.disabled : ''}`}
      >
        <div
          className={Styles.inputWrapper}
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={`${name}-listbox`}
          aria-labelledby={`${name}-label`}
          aria-required={required}  
          onClick={() => {
            if (!disabled) setIsOpen((prev) => !prev);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (!disabled) setIsOpen((prev) => !prev);
            } else if (e.key === 'Escape') {
              setIsOpen(false);
            }
          }}
        >
          {showIcon && IconComp && (
            <IconComp className={Styles.icon} size={24} aria-hidden="true" />
          )}

          <div className={Styles.selectedValue}>
            {selectedOption ? selectedOption.label : placeholder}
          </div>

          <ChevronDown
            className={`${Styles.chevronIcon} ${isOpen ? Styles.rotate : ''}`}
            size={20}
            aria-hidden="true"
          />
        </div>

        {/* Dropdown list */}
        <ul
          role="listbox"
          id={`${name}-listbox`}
          className={`${Styles.dropdown} ${isOpen ? Styles.show : ''}`}
          tabIndex={-1}
        >
          {options.map((opt) => (
            <li
              key={String(opt.value)}
              role="option"
              aria-selected={String(opt.value) === String(value)}
              className={`${Styles.option} ${
                String(opt.value) === String(value) ? Styles.selected : ''
              }`}
              onClick={() => handleSelect(opt)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelect(opt);
                }
              }}
              tabIndex={0}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      </div>

      {showHelpText && helpText && <p className="muted-text">{helpText}</p>}
    </div>
  );
}
