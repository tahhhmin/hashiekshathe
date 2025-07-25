import React from 'react';
import Styles from './BentoGrid.module.css';

type BentoBoxProps = {
  items: React.ReactNode[];
};

const BentoGrid: React.FC<BentoBoxProps> = ({ items }) => {
    // Split items into 3 columns
    const columns = [[], [], []] as React.ReactNode[][];

    items.forEach((item, index) => {
        columns[index % 3].push(item);
    });

    return (
        <div className={Styles.gridContainer}>
        {columns.map((columnItems, columnIndex) => (
            <div key={columnIndex} className={Styles.column}>
            {columnItems.map((item, index) => (
                <div key={index} className={Styles.box}>
                {item}
                </div>
            ))}
            </div>
        ))}
        </div>
    );
};

export default BentoGrid;
