'use client';

import React from 'react';
import * as Icons from 'lucide-react';
import Image from 'next/image';
import Styles from './Sidebar.module.css';

interface SidebarItem {
  label: string;
  uniqueId: string; // Add unique identifier for each item
}

interface SidebarSection {
  title: string;
  icon: keyof typeof Icons;
  items: SidebarItem[];
}

// Export types for usage
export type { SidebarSection, SidebarItem };

interface SidebarHeader {
  logo: string;
  title: string;
  subtitle: string;
}

interface SidebarFooter {
  avatar: string;
  name: string;
  email: string;
  accessLevel?: string;
}

interface SidebarProps {
  header: SidebarHeader;
  sections: SidebarSection[];
  footer: SidebarFooter;
  onItemClick?: (uniqueId: string, label: string, sectionTitle: string) => void;
}

export default function Sidebar({
  header,
  sections,
  footer,
  onItemClick,
}: SidebarProps) {
  return (
    <aside className={Styles.sidebarContainer}>
      {/* Header */}
      <div className={Styles.sidebarHeader}>
        <Image src={header.logo} alt="Logo" width={40} height={40} />
        <div>
          <h4>{header.title}</h4>
          <p className="muted-text">{header.subtitle}</p>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className={Styles.sidebarContents}>
        {sections.map((section, secIdx) => {
          const iconKey = section.icon as keyof typeof Icons;
          const IconComponent = Icons[iconKey] as React.ComponentType<{
            className?: string;
            size?: number;
          }>;

          return (
            <div key={secIdx}>
              <div className={Styles.sidebarContentsHeader}>
                <div className={Styles.sectionTitleWrapper}>
                  <IconComponent className={Styles.icon} size={20} />
                  <p className="muted-text">{section.title}</p>
                </div>
              </div>

              <div className={Styles.sidebarNavbar}>
                {section.items.map((item) => (
                  <div key={item.uniqueId} className={Styles.sidebarNavbarItem}>
                    <div
                      className={Styles.sidebarNavbarItemOption}
                      onClick={() => onItemClick?.(item.uniqueId, item.label, section.title)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && onItemClick?.(item.uniqueId, item.label, section.title)
                      }
                    >
                      <p>{item.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className={Styles.sidebarFooter}>
        <Image src={footer.avatar} alt="Admin Avatar" width={40} height={40} />
        <div>
          <h4>{footer.name}</h4>
          <p className="muted-text">{footer.email}</p>
          {footer.accessLevel && (
            <p className="muted-text small">{footer.accessLevel}</p>
          )}
        </div>
      </div>
    </aside>
  );
}