import React from 'react'
import Styles from './page.module.css'
import Input from '@/ui/input/Input'
import { Funnel } from 'lucide-react'
import Button from '@/ui/button/Button'

export default function page() {
    return (
        <section className='section'>
            <div className={Styles.container}>
                <div className={Styles.announcementContainer}>



                    <div className={Styles.announcementCard}>
                        <div  className={Styles.announcementCardHeader}>
                            <div className={Styles.announcementCardtitleContainer}>
                                <h2 className={Styles.announcementTitle}>Announcement Title</h2>
                                <h3 className={Styles.announcementSubtitle}>Subtitle</h3>
                            </div>
                            <div className={Styles.dateContainer}>7th Nov 2025</div>
                        </div>

                        <div className={Styles.announcementCardContent}>
                            <p>Lorem ipsum dolor sit amet consectetur 
                                adipisicing elit. Amet sed sunt commodi 
                                quas, eligendi facere fugiat! Vel sint 
                                nihil dicta sequi doloremque tempora 
                                mollitia temporibus! Maiores quaerat 
                                laborum sed placeat.
                            </p>
                        </div>



                        <div  className={Styles.announcementCardFooter}>

                            <div className={Styles.announcementCardFooterTagContainer}>
                                <div className={Styles.announcementTag}>
                                    Green Project
                                </div>
                            </div>

                            <div className={Styles.announcementCardFooterButtonContainer}>
                                    <Button 
                                    variant='primary'
                                    label='Link1'
                                    showIcon
                                    icon='Link'
                                />
                                <Button 
                                    variant='outlined'
                                    label='Link2'
                                    showIcon
                                    icon='Link'
                                />
                            </div>

                        </div>
                    </div>



















                </div>
                <div className={Styles.optionContainer}>
                    <div className={Styles.optionContainerHeader}>
                        <Funnel className={Styles.optionContainerIcon}/> <h2>Filter</h2>
                    </div>
                    <div className={Styles.filterGroup}>
                        <Input
                            showIcon
                            icon='Search'
                            placeholder='Search'
                        />
                        <Input
                            showIcon
                            icon='Search'
                            placeholder='Search'
                        />
                        <Input
                            showIcon
                            icon='Search'
                            placeholder='Search'
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
