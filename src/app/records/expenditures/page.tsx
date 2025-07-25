import React from 'react'
import Styles from './page.module.css'
import Button from '@/ui/button/Button'
import Link from 'next/link'
import { Wallet } from 'lucide-react'
import Input from '@/ui/input/Input'
import ExpenditureTable from '@/components/records-page/ExpenditureTable'

export default function page() {
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
                        <Link href='#'><Button
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
                            placeholder='search'
                            showHelpText
                        />

                        <Input
                            icon='Search'
                            placeholder='search'
                            showHelpText
                        />

                        <Input
                            icon='Search'
                            placeholder='search'
                            showHelpText
                        />
                    </div>
                </div>

                <div className={Styles.tableContainer}>
                    <ExpenditureTable />
                </div>
            </div>


        </section>
    )
}
