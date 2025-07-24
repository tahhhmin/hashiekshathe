import React from 'react';
import Styles from './Textarea.module.css';

interface TextareaProps {
    label?: string;
    name?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
    showHelpText?: boolean;
    helpText?: string;
    className?: string;
}

export default function Textarea({
    label,
    name,
    value,
    onChange,
    required = false,
    disabled = false,
    placeholder = '',
    showHelpText = false,
    helpText = '',
    className = '',
    }: TextareaProps) {
        const textareaId = name || 'custom-textarea';

    return (
        <div className={`${Styles.container} ${className}`}>
        {label && (
            <label htmlFor={textareaId} className={Styles.label}>
            {label}
            </label>
        )}

        <textarea
            id={textareaId}
            name={name}
            value={value ?? ''}
            onChange={onChange}
            required={required}
            disabled={disabled}
            placeholder={placeholder}
            autoComplete="off"
            className={Styles.textarea}
            rows={5}
        />

        {showHelpText && helpText && (
            <p className='muted-text'>{helpText}</p>
        )}
        </div>
    );
}
