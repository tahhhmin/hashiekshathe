import React from 'react'
import Styles from './page.module.css'
import Button from '@/ui/button/Button'
import Link from 'next/link'
import { Handshake } from 'lucide-react'

export default function page() {
    return (
        <section className='section'>
            <div className={Styles.container}>
                <div className={Styles.card}>
                    <div className={Styles.header}>
                        <div className={Styles.title}>
                           <Handshake className={Styles.icon}/> <h2>Register</h2>
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
                            href='https://docs.google.com/forms/d/1NhQfdLWm2MtPAunO2Q-qobOFGZkf1oJiHCTC2020UFo/viewform?edit_requested=true'
                            className={Styles.primaryButton}
                            >
                            <Button
                            variant='primary'
                            label='Proceed to google forms'
                            showIcon
                        /></Link>

                        <Link href='/volunteer/benefits'
                            className={Styles.outlinedButton}
                            >
                            <Button
                            variant='outlined'
                            label='View volunteer benefits'
                            showIcon
                        /></Link>
                    </div>

                </div>

                
            </div>


        </section>
    )
}
