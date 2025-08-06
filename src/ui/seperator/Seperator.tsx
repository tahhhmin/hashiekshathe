// components/Divider.tsx

import styles from './Divider.module.css';

type DividerVariant = 'horizontal' | 'vertical';

interface DividerProps {
  variant?: DividerVariant;
  backgroundColor?: string; // Optional override
  length?: string | number; // Optional custom height/width depending on orientation
}

export default function Divider({
  variant = 'horizontal',
  backgroundColor,
  length,
}: DividerProps) {
  const isHorizontal = variant === 'horizontal';

  const style = {
    backgroundColor,
    width: isHorizontal ? '100%' : typeof length === 'number' ? `${length}px` : length,
    height: !isHorizontal ? '100%' : typeof length === 'number' ? `${length}px` : length,
  };

  return (
    <div
      className={
        isHorizontal ? styles.horizontalDivider : styles.verticalDivider
      }
      style={style}
    ></div>
  );
}
