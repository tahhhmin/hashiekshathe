"use client"
import React, { useEffect, useState } from 'react';
import './TableStyles.css'

interface DonationRow {
  [key: string]: string;
}

export default function ExpenditureTable() {
    const [rows, setRows] = useState<DonationRow[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    
    useEffect(() => {
        fetch('https://opensheet.vercel.app/1SIgCAMpZhHtNM3p0HgKjO3-9Lsk6KUiyc2Zn7Lya9qM/Sheet2')
        .then((res) => res.json())
        .then((data: DonationRow[]) => {
            setRows([...data].reverse()); 
            setLoading(false);
        })
        .catch((error) => {
            console.error('Error fetching sheet data:', error);
            setLoading(false);
        });
    }, []);
    
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
        </div>
    )
}