"use client"
import React, { useState, useMemo, useEffect } from 'react'
import Styles from './page.module.css'
import Button from '@/ui/button/Button'
import Link from 'next/link'
import { HandCoins } from 'lucide-react'
import DonationTable from '@/components/records-page/DonationTable'
import Input from '@/ui/input/Input'
import IndeterminateProgressBar from '@/ui/Progress/FreeProgressBar'

interface DonationRow {
    [key: string]: string;
}

export default function page() {
    // State for search filters
    const [searchTerm, setSearchTerm] = useState('')
    const [dateFilter, setDateFilter] = useState('')
    const [amountFilter, setAmountFilter] = useState('')
    
    // State for Google Sheets data
    const [donationsData, setDonationsData] = useState<DonationRow[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    // Fetch data from Google Sheets
    useEffect(() => {
        fetch('https://opensheet.vercel.app/1SIgCAMpZhHtNM3p0HgKjO3-9Lsk6KUiyc2Zn7Lya9qM/Sheet1')
        .then((res) => res.json())
        .then((data: DonationRow[]) => {
            setDonationsData([...data].reverse());
            setLoading(false);
        })
        .catch((error) => {
            console.error('Error fetching sheet data:', error);
            setLoading(false);
        });
    }, []);

    // Filtered data based on search criteria
    const filteredDonations = useMemo(() => {
        return donationsData.filter(donation => {
            // Search across all fields
            const matchesSearch = searchTerm === '' || 
                Object.values(donation).some(value => 
                    value.toLowerCase().includes(searchTerm.toLowerCase())
                )
            
            // Filter by date (assumes there's a date field)
            const matchesDate = dateFilter === '' || 
                Object.values(donation).some(value => 
                    value.includes(dateFilter)
                )
            
            // Filter by amount (assumes there's an amount field)
            const matchesAmount = amountFilter === '' || 
                Object.values(donation).some(value => 
                    value.includes(amountFilter)
                )
            
            return matchesSearch && matchesDate && matchesAmount
        })
    }, [donationsData, searchTerm, dateFilter, amountFilter])

    // Calculate dynamic stats
    const stats = useMemo(() => {
        if (donationsData.length === 0) {
            return {
                totalAmount: '$0',
                totalDonations: 0
            }
        }

        // Try to find amount column (common names)
        const amountKeys = Object.keys(donationsData[0]).filter(key => 
            key.toLowerCase().includes('amount') || 
            key.toLowerCase().includes('donation') ||
            key.toLowerCase().includes('total') ||
            key.toLowerCase().includes('sum')
        )

        let totalAmount = 0
        if (amountKeys.length > 0) {
            const amountKey = amountKeys[0]
            totalAmount = filteredDonations.reduce((sum, donation) => {
                const amount = parseFloat(donation[amountKey].replace(/[^0-9.-]+/g, '')) || 0
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
            totalDonations: filteredDonations.length
        }
    }, [filteredDonations, donationsData])

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
                           <HandCoins className={Styles.icon}/> <h2>Donations</h2>
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
                        <Link 
                        target='_blank'
                        href='https://docs.google.com/spreadsheets/d/1SIgCAMpZhHtNM3p0HgKjO3-9Lsk6KUiyc2Zn7Lya9qM/edit?usp=sharing'><Button
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
                            placeholder='Search by donor or category'
                            showHelpText
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        <Input
                            icon='Calendar'
                            showIcon
                            placeholder='Filter by date (YYYY-MM)'
                            showHelpText
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                        />

                        <Input
                            icon='DollarSign'
                            showIcon
                            placeholder='Filter by amount'
                            showHelpText
                            value={amountFilter}
                            onChange={(e) => setAmountFilter(e.target.value)}
                        />
                    </div>

                    <div className={Styles.statContainer}>
                        <div className={Styles.statCard}>
                            <p className='muted-text'>Money donated</p>
                            <h1 className={Styles.statCardTitle}>{stats.totalAmount}</h1>
                        </div>

                        <div className={Styles.statCard}>
                            <p className='muted-text'>Donations made</p>
                            <h1 className={Styles.statCardTitle}>{stats.totalDonations}</h1>
                        </div>
                    </div>
                </div>

                <div className={Styles.tableContainer}>
                    <DonationTable data={filteredDonations} />
                </div>
            </div>
        </section>
    )
}