import React from 'react'
import Styles from './page.module.css'

import { Book } from 'lucide-react'
import Button from '@/ui/button/Button'

export default function page() {
    return (
        <section className={Styles.section}>
            <div className={Styles.container}>
                <div className={Styles.heroContainer}>
                    <div className={Styles.tag}>
                        <Book className={Styles.tagIcon}/>
                        <p className={Styles.tagLabel}>Education Program</p>
                    </div>
                    
                    <div className={Styles.heroTextContainer}>
                        <h1 className={Styles.title}>Transform Your Learning Journey</h1>
                        <h2 className={Styles.subtitle}>Join thousands of students in our comprehensive YouTube education program. Access high-quality content, expert instruction, and a supportive learning community.</h2>
                    </div>

                    <div className={Styles.heroContainerbuttonContainer}>
                        <Button
                            variant='primary'
                            label='Visit our channel'
                            showIcon
                            icon='ExternalLink'
                        />

                        <Button
                            variant='outlined'
                            label='View all courses'
                            showIcon
                            icon='ExternalLink'
                        />
                    </div>



                    <div className={Styles.statsContainer}>
                        <div className={Styles.statsCard}>
                            <p>Students</p>
                            <h1>1,000+</h1>
                        </div>

                        <div className={Styles.statsCard}>
                            <p>Students</p>
                            <h1>1,000+</h1>
                        </div>

                        <div className={Styles.statsCard}>
                            <p>Students</p>
                            <h1>1,000+</h1>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
