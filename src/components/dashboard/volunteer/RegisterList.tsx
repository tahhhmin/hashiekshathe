'use client';

import React, { useEffect, useState } from 'react';
import Styles from './RegisterList.module.css';
import Button from '@/ui/button/Button'; // Assuming you have a Button component

// Define props for the RegisterList component
interface RegisterListProps {
  // onFill is a function that takes an object with string keys and string values
  onFill: (data: Record<string, string>) => void;
}

export default function RegisterList({ onFill }: RegisterListProps) {
  const [headers, setHeaders] = useState<string[]>([]); // State for sheet headers
  const [rows, setRows] = useState<string[][]>([]); // State for sheet data rows
  const [error, setError] = useState<string | null>(null); // State for error messages
  const [openIndex, setOpenIndex] = useState<number | null>(null); // State to control accordion open/close

  useEffect(() => {
    // Fetch data from the Google Sheet in TSV format
    fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vS2SFjyUt7kQKJbFUNMRtdsjwLC-gpZdRaQZ0jGjM6CJMzBq2pctdLmbMEUy7_TCI6Z5rd2WfpKH5Qw/pub?output=tsv')
      .then((res) => res.text()) // Get the response as plain text
      .then((tsv) => {
        const lines = tsv.trim().split('\n'); // Split by new line
        const data = lines.map((line) => line.split('\t')); // Split each line by tab

        if (data.length < 2) {
          throw new Error('Sheet has no data or only headers.');
        }

        setHeaders(data[0]); // First row is headers
        setRows(data.slice(1)); // Remaining rows are data
      })
      .catch((err) => {
        console.error('Failed to load register list:', err);
        setError('Failed to load register list. Please check the sheet URL or try again later.');
      });
  }, []); // Empty dependency array means this effect runs once on mount

  // Toggles the accordion item open or closed
  const toggleIndex = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  // Handles filling the form with data from the selected row
  const handleFill = (row: string[]) => {
    const mapped: Record<string, string> = {};
    headers.forEach((header, i) => {
      // Map sheet headers to corresponding row data
      // Trim header to remove any potential whitespace issues
      mapped[header.trim()] = row[i] || ''; // Use empty string if data is missing
    });
    onFill(mapped); // Pass the mapped data to the parent component
  };

  return (
    <div className={Styles.container}>
      <h2>Register List</h2>

      {error && <p className={Styles.error}>{error}</p>}

      {!error && rows.length > 0 && (
        <div className={Styles.accordionList}>
          {rows.map((row, index) => (
            <div key={index} className={Styles.accordionItem}>
              <button
                className={Styles.accordionHeader}
                onClick={() => toggleIndex(index)}
              >
                {/* Displaying First Name, Last Name, Institution, and Email in the header */}
                {row[1] || 'N/A'} {row[2] || 'N/A'} — {row[10] || 'N/A'} ({row[4] || 'N/A'})
              </button>

              {openIndex === index && ( // Only show body if accordion item is open
                <div className={Styles.accordionBody}>
                  {row.map((cell, i) => (
                    <div key={i} className={Styles.accordionField}>
                      <strong>{headers[i] || 'N/A'}:</strong> {cell || 'N/A'}
                    </div>
                  ))}
                  <Button label="Fill Form" onClick={() => handleFill(row)} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!error && rows.length === 0 && <p>No registered volunteers found.</p>}
    </div>
  );
}