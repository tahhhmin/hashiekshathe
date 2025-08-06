"use client"
import React, { useEffect, useState } from 'react';
import './TableStyles.css'

interface ExpenditureRow {
  [key: string]: string;
}

interface ExpenditureTableProps {
  data?: ExpenditureRow[];
}

export default function ExpenditureTable({ data }: ExpenditureTableProps) {
    const [rows, setRows] = useState<ExpenditureRow[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // If data is provided as props, use it instead of fetching
        if (data) {
            setRows(data);
            setLoading(false);
        } else {
            // Fallback to original fetching behavior
            fetch('https://opensheet.vercel.app/1SIgCAMpZhHtNM3p0HgKjO3-9Lsk6KUiyc2Zn7Lya9qM/Sheet2')
            .then((res) => res.json())
            .then((fetchedData: ExpenditureRow[]) => {
                setRows([...fetchedData].reverse());
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching sheet data:', error);
                setLoading(false);
            });
        }
    }, [data]);

    if (loading) return <></>;

    return (
        <div className="records-container">
            <table className="records-table">
                <thead>
                <tr>
                    {rows.length > 0 &&
                    Object.keys(rows[0]).map((key) => <th key={key}>{key}</th>)}
                </tr>
                </thead>
                <tbody>
                {rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                    {Object.values(row).map((cell, colIndex) => (
                        <td key={colIndex}>{cell}</td>
                    ))}
                    </tr>
                ))}
                </tbody>
            </table>
            {rows.length === 0 && (
                <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                    No expenditures found matching your search criteria.
                </div>
            )}
        </div>
    );
}