import React from 'react'
import Styles from './page.module.css'
import Button from '@/ui/button/Button'
import Link from 'next/link'
import { Mail, CircleQuestionMark } from 'lucide-react'

export default function page() {
    return (
        <section className='section'>
            <div className={Styles.container}>
                <div className={Styles.card}>
                    <div className={Styles.header}>
                        <div className={Styles.title}>
                           <CircleQuestionMark className={Styles.icon}/> <h2>Inquiry</h2>
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
                        <Link href='/contact/inquiry'><Button
                            variant='primary'
                            label='Send message'
                            showIcon
                        /></Link>
                    </div>

                </div>


<div className={Styles.card}>
                    <div className={Styles.header}>
                        <div className={Styles.title}>
                            <Mail className={Styles.icon}/> <h2>Collaborate</h2>
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
                        <Link href='/contact/collaborate'><Button
                            variant='primary'
                            label='Send message'
                            showIcon
                        /></Link>
                    </div>

                </div>
            </div>
        </section>
    )
}
