import React from 'react';
import Styles from './BentoGrid.module.css';

type BentoBoxItem = {
  id: string;
  content: React.ReactNode;
};

type BentoGridProps = {
  items: BentoBoxItem[];
};

const BentoGrid: React.FC<BentoGridProps> = ({ items }) => {
  const columns: BentoBoxItem[][] = [[], [], []];

  items.forEach((item, index) => {
    columns[index % 3].push(item);
  });

  return (
    <div className={Styles.gridContainer}>
      {columns.map((columnItems, columnIndex) => (
        <div key={`column-${columnIndex}`} className={Styles.column}>
          {columnItems.map((item) => (
            <div key={item.id} className={Styles.box}>
              {item.content}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default BentoGrid;
