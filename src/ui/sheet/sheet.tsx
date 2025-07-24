import React, { useState } from 'react';
import Styles from './sheet.module.css';
import Button from '@/ui/button/Button';
import { X } from 'lucide-react';
import ThemeToggleButton from '@/components/button/ThemeToggleButton';
import AuthButton from '@/components/button/AuthButton';
import Link from 'next/link';

interface SheetProps {
    menuName?: string;
    footer?: boolean;
    items?: SheetItem[];
}

interface SheetItem {
    name: string;
    path?: string;
}

export default function Sheet({
    menuName,
    footer,
    items = [],
    }: SheetProps) {
    const [open, setOpen] = useState(false);

    return (
        <div>
        <Button
            variant="icon"
            showIcon={true}
            icon='Menu'
            onClick={() => setOpen(true)}
        />

        {/* === BACKDROP === */}
        {open && <span className={Styles.backdrop} onClick={() => setOpen(false)}></span>}

        {/* === SHEET === */}
        <div className={`${Styles.sheet} ${open ? Styles.active : ''}`}>
            <div className={Styles.header}>
            <h4>{menuName}</h4>
            <X
                className={Styles.menuIcon}
                size={24}
                onClick={() => setOpen(false)}
            />
            </div>

            {footer && (
            <div className={Styles.footer}>
                <Link href="/donate" className={Styles.footerButton1}><Button
                variant="primary"
                label="Donate"
                /></Link>
                <div className={Styles.footerButton}>
                    <div className={Styles.footerButton1}>
                        <AuthButton />
                    </div>
                    <ThemeToggleButton />
                </div>
            </div>
            )}

            <div className={Styles.container}>
            {items.map((item, index) => (
                <a key={index} href={item.path} className={Styles.item}>
                {item.name}
                </a>
            ))}
            </div>

            
        </div>
        </div>
    );
}
