import React from 'react'
import Styles from './page.module.css'
import Button from '@/ui/button/Button'
import Link from 'next/link'

export default function page() {
    return (
        <section className='section'>
            <div className={Styles.container}>
                <div className={Styles.card}>
                    <div className={Styles.header}>
                        <div className={Styles.title}>
                            <h2>Donations</h2>
                            </div>
                        <div className={Styles.subtitle}><h3>Subtitle</h3></div>
                    </div>

                    <div className={Styles.content}>
                        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                             Iure harum nobis placeat, facere, odit mollitia velit illo 
                             dolor temporibus pariatur officia magni eius nihil accusamus 
                             excepturi. Expedita quis facilis aliquid?
                             
                            </p>
                    </div>

                    <div className={Styles.footer}>
                        <Link href='/records/donations'><Button
                            variant='primary'
                            label='View donations'
                        /></Link>
                    </div>

                </div>


<div className={Styles.card}>
                    <div className={Styles.header}>
                        <div className={Styles.title}>
                            <h2>Expenditures</h2>
                            </div>
                        <div className={Styles.subtitle}><h3>Subtitle</h3></div>
                    </div>

                    <div className={Styles.content}>
                        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                             Iure harum nobis placeat, facere, odit mollitia velit illo 
                             dolor temporibus pariatur officia magni eius nihil accusamus 
                             excepturi. Expedita quis facilis aliquid?
                             
                            </p>
                    </div>

                    <div className={Styles.footer}>
                        <Link href='/records/expenditures'><Button
                            variant='primary'
                            label='View donations'
                        /></Link>
                    </div>

                </div>
            </div>
        </section>
    )
}
