'use client';

import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import Image from 'next/image';
import Styles from './Sidebar.module.css';

interface SidebarItem {
  label: string;
  icon: keyof typeof Icons;
  dropdown: string[];
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

// ✅ Export it so page.tsx can import and use it
export type { SidebarSection };


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
  onSubItemClick?: (label: string) => void;
}

export default function Sidebar({
  header,
  sections,
  footer,
  onSubItemClick,
}: SidebarProps) {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleDropdown = (label: string) => {
    setOpenIndex(openIndex === label ? null : label);
  };

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
        {sections.map((section, secIdx) => (
          <div key={secIdx}>
            <div className={Styles.sidebarContentsHeader}>
              <p className="muted-text">{section.title}</p>
            </div>

            <div className={Styles.sidebarNavbar}>
              {section.items.map((item, itemIdx) => {
                const isOpen = openIndex === `${secIdx}-${itemIdx}`;
                const iconKey = item.icon as keyof typeof Icons;
                const IconComponent = Icons[iconKey] as React.ComponentType<{
                  className?: string;
                  size?: number;
                }>;

                return (
                  <div key={item.label} className={Styles.sidebarNavbarItem}>
                    <div
                      className={Styles.sidebarNavbarItemOption}
                      onClick={() => toggleDropdown(`${secIdx}-${itemIdx}`)}
                    >
                      <div className={Styles.sidebarNavbarItemOptionWrapper}>
                        <IconComponent className={Styles.icon} size={20} />
                        <p>{item.label}</p>
                      </div>
                      <Icons.ChevronRight
                        className={`${Styles.icon} ${isOpen ? Styles.rotateIcon : ''}`}
                        size={18}
                      />
                    </div>

                    {isOpen && (
                      <div className={Styles.sidebarNavbarItemDropdown}>
                        <div className={Styles.dropdownListContainer}>
                          <div className={Styles.verticalLine}></div>
                          {item.dropdown.map((sub, subIdx) => (
                            <p
                              key={subIdx}
                              className={Styles.dropdownItem}
                              onClick={() => onSubItemClick?.(sub)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) =>
                                e.key === 'Enter' && onSubItemClick?.(sub)
                              }
                            >
                              {sub}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
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
