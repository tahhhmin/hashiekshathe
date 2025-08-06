"use client"
import React, { useState, useMemo, useEffect } from 'react'
import Styles from './page.module.css'
import Button from '@/ui/button/Button'
import Link from 'next/link'
import { Wallet } from 'lucide-react'
import Input from '@/ui/input/Input'
import ExpenditureTable from '@/components/records-page/ExpenditureTable'
import IndeterminateProgressBar from '@/ui/Progress/FreeProgressBar'

interface ExpenditureRow {
    [key: string]: string;
}

export default function Page() {
    // State for search filters
    const [searchTerm, setSearchTerm] = useState('')
    const [dateFilter, setDateFilter] = useState('')
    const [amountFilter, setAmountFilter] = useState('')
    
    // State for Google Sheets data
    const [expendituresData, setExpendituresData] = useState<ExpenditureRow[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    // Fetch data from Google Sheets
    useEffect(() => {
        fetch('https://opensheet.vercel.app/1SIgCAMpZhHtNM3p0HgKjO3-9Lsk6KUiyc2Zn7Lya9qM/Sheet2')
        .then((res) => res.json())
        .then((data: ExpenditureRow[]) => {
            setExpendituresData([...data].reverse());
            setLoading(false);
        })
        .catch((error) => {
            console.error('Error fetching sheet data:', error);
            setLoading(false);
        });
    }, []);

    // Filtered data based on search criteria
    const filteredExpenditures = useMemo(() => {
        return expendituresData.filter(expenditure => {
            // Search across all fields
            const matchesSearch = searchTerm === '' || 
                Object.values(expenditure).some(value => 
                    value.toLowerCase().includes(searchTerm.toLowerCase())
                )
            
            // Filter by date (assumes there's a date field)
            const matchesDate = dateFilter === '' || 
                Object.values(expenditure).some(value => 
                    value.includes(dateFilter)
                )
            
            // Filter by amount (assumes there's an amount field)
            const matchesAmount = amountFilter === '' || 
                Object.values(expenditure).some(value => 
                    value.includes(amountFilter)
                )
            
            return matchesSearch && matchesDate && matchesAmount
        })
    }, [expendituresData, searchTerm, dateFilter, amountFilter])

    // Calculate dynamic stats
    const stats = useMemo(() => {
        if (expendituresData.length === 0) {
            return {
                totalAmount: '$0',
                totalExpenditures: 0
            }
        }

        // Try to find amount column (common names)
        const amountKeys = Object.keys(expendituresData[0]).filter(key => 
            key.toLowerCase().includes('amount') || 
            key.toLowerCase().includes('cost') ||
            key.toLowerCase().includes('expense') ||
            key.toLowerCase().includes('total') ||
            key.toLowerCase().includes('sum') ||
            key.toLowerCase().includes('price')
        )

        let totalAmount = 0
        if (amountKeys.length > 0) {
            const amountKey = amountKeys[0]
            totalAmount = filteredExpenditures.reduce((sum, expenditure) => {
                const amount = parseFloat(expenditure[amountKey].replace(/[^0-9.-]+/g, '')) || 0
                return sum + amount
            }, 0)
        }

        return {
            totalAmount: totalAmount.toLocaleString('en-US', { 
                style: 'currency', 
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }),
            totalExpenditures: filteredExpenditures.length
        }
    }, [filteredExpenditures, expendituresData])

    if (loading) {
        return (
            <section className={Styles.sectionLoading}>
                <IndeterminateProgressBar />
            </section>
        )
    }

    return (
        <section className='section'>
            <div className={Styles.container}>
                <div className={Styles.card}>
                    <div className={Styles.header}>
                        <div className={Styles.title}>
                           <Wallet className={Styles.icon}/> <h2>Expenditures</h2>
                        </div>
                          <h3 className={Styles.subtitle}>Subtitle</h3>
                    </div>

                    <div className={Styles.content}>
                        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                             Iure harum nobis placeat, facere, odit mollitia velit illo 
                             dolor temporibus pariatur officia magni eius nihil accusamus 
                             excepturi. Expedita quis facilis aliquid?
                        </p>
                    </div>

                    <div className={Styles.footer}>
                        <Link href='https://docs.google.com/spreadsheets/d/1SIgCAMpZhHtNM3p0HgKjO3-9Lsk6KUiyc2Zn7Lya9qM/edit?gid=803396454#gid=803396454'
                        target='_blank'><Button
                            variant='primary'
                            label='View google sheets'
                            showIcon
                        /></Link>
                    </div>
                </div>

                <div className={Styles.utilities}>
                    <div className={Styles.filterContainer}>
                        <Input
                            icon='Search'
                            showIcon
                            placeholder='Search by vendor or category'
                            showHelpText
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        <Input
                            icon='Calendar'
                            placeholder='Filter by date (YYYY-MM)'
                            showHelpText
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                        />

                        <Input
                            icon='DollarSign'
                            placeholder='Filter by amount'
                            showHelpText
                            value={amountFilter}
                            onChange={(e) => setAmountFilter(e.target.value)}
                        />
                    </div>

                    <div className={Styles.statContainer}>
                        <div className={Styles.statCard}>
                            <p className='muted-text'>Total spent</p>
                            <h1 className={Styles.statCardTitle}>{stats.totalAmount}</h1>
                        </div>

                        <div className={Styles.statCard}>
                            <p className='muted-text'>Expenditures made</p>
                            <h1 className={Styles.statCardTitle}>{stats.totalExpenditures}</h1>
                        </div>
                    </div>
                </div>

                <div className={Styles.tableContainer}>
                    <ExpenditureTable data={filteredExpenditures} />
                </div>
            </div>
        </section>
    )
}