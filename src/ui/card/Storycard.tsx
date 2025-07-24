'use client';

import React, { useState, useRef, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import Styles from './Storycard.module.css';
import Button from '../button/Button';

interface ButtonConfig {
  label: string;
  variant?: 'primary' | 'secondary' | 'outlined' | 'icon' | 'action' | 'danger' | 'submit';
  onClick?: () => void;
  linkTo?: string;
}

interface StorycardProps {
  icon?: string;
  title?: string;
  subtitle?: string;
  text?: string[];
  button1?: ButtonConfig;
  button2?: ButtonConfig;
  maxHeight?: number;
}

export default function Storycard({
  icon = 'UserSearch',
  title = 'About Us',
  subtitle = 'Subtitle',
  text = ['Default paragraph text here.'],
  button1 = { label: 'Show More', variant: 'primary' },
  button2,
  maxHeight = 200
}: StorycardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showExpandButton, setShowExpandButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Get the icon component from the string
  const IconComponent = (icon && icon in LucideIcons
    ? LucideIcons[icon as keyof typeof LucideIcons]
    : LucideIcons.UserSearch) as React.ElementType;

  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      setShowExpandButton(contentHeight > maxHeight);
    }
  }, [text, maxHeight]);

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleButton2Click = () => {
    if (button2?.onClick) {
      button2.onClick();
    }
    if (button2?.linkTo) {
      // In a real app, you'd use your router here
      console.log(`Navigate to: ${button2.linkTo}`);
    }
  };

  return (
    <div className={Styles.card}>
      <div className={Styles.cardHeader}>
        <div className={Styles.title}>
          <IconComponent className={Styles.icon} />
          <h2>{title}</h2>
        </div>
        <div className={Styles.subtitle}>
          <h3 className="muted-text">{subtitle}</h3>
        </div>
      </div>

      <div className={Styles.contentWrapper}>
        <div 
          className={`${Styles.cardContent} ${!isExpanded && showExpandButton ? Styles.collapsed : ''}`}
          ref={contentRef}
          style={{
            maxHeight: !isExpanded && showExpandButton ? `${maxHeight}px` : 'none'
          }}
        >
          {text.map((paragraph, index) => (
            <p key={index} className={Styles.cardText}>
              {paragraph}
            </p>
          ))}
        </div>
        {!isExpanded && showExpandButton && (
          <div className={Styles.fadeGradient}></div>
        )}
      </div>

      <div className={Styles.cardfooter}>
        {showExpandButton && (
          <Button
            variant={button1.variant}
            label={isExpanded ? 'Show Less' : button1.label}
            onClick={handleExpand}
          />
        )}
        
        {button2 && (
          <Button
            variant={button2.variant}
            label={button2.label}
            onClick={handleButton2Click}
          />
        )}
      </div>
    </div>
  );
}