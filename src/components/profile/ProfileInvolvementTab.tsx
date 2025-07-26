import React from 'react'
import styles from './ProfileInvolvementTab.module.css'
import { Inbox } from 'lucide-react'

export default function ProfileInvolvementTab() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerTitleContainer}>
                    <Inbox className={styles.headerIcon} />
                    <h2 className={styles.headerTitle}>Current Projects</h2>
                </div>
                <p className='muted-text'>
                    Initiatives we're working on to make an impact
                </p>
            </div>

            <div className={styles.projectListContainer}>
                <div className={styles.projectContainer}>
                    <div className={styles.projectHeaderContainer}>
                        <h3>Green Tech Initiative</h3>
                        <div className={styles.projectStatusTag}>
                            Active
                        </div>
                    </div>
                    
                    <div className={styles.projectContent}>
                        {/*
                            certificates
                            volunteering hours
                            role
                            team
                            
                        */}
                        A comprehensive online platform for teaching AI concepts to students and professionals.
                    </div>

                    <div className={styles.projectFooterContainer}>
                        <div className={styles.projectDates}>
                            <p className='muted-text'>
                                Started: Jun 2023
                            </p>
                            <p className='muted-text'>
                                Ended: May 2023
                            </p>
                        </div>
                    </div>
                </div>
            </div>







        </div>
    )
}