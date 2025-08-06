import React from 'react'
import Styles from './page.module.css'
import Button from '@/ui/button/Button'

export default function page() {
    return (
        <section className='section'>
            <div className={Styles.container}>
               
               
                <div className={Styles.card}>
                    
                    
                    
                    <div className={Styles.cardHeader}>
                        <h2>Bkash</h2>
                    </div>
                    <div>
                        <p className={Styles.description}>Lorem ipsum dolor sit amet consectetur 
                            adipisicing elit. Expedita quasi 
                            cumque, mollitia quos veritatis 
                            accusamus id quam quis repudiandae 

                            </p>
                    </div>
                    <Button
                        variant='primary'
                        label='Bkash'
                        showIcon
                    />
                </div>






                <div className={Styles.card}>
                    <div className={Styles.cardHeader}>
                        <h2>Rocket</h2>
                    </div>
                                        <div>
                        <p className={Styles.description}>Lorem ipsum dolor sit amet consectetur 
                            adipisicing elit. Expedita quasi 
                            cumque, mollitia quos veritatis 
                            accusamus id quam quis repudiandae 

                            </p>
                    </div>
                    <Button
                        variant='primary'
                        label='Rocket'
                        showIcon
                    />
                </div>

                <div className={Styles.card}>
                    <div className={Styles.cardHeader}>
                        <h2>Google Pay</h2>
                    </div>
                    <div>
                                            <p className={Styles.description}>Lorem ipsum dolor sit amet consectetur 
                            adipisicing elit. Expedita quasi 
                            cumque, mollitia quos veritatis 
                            accusamus id quam quis repudiandae 

                            </p>
                    </div>
                    <Button
                        variant='primary'
                        label='Google Pay'
                        showIcon
                    />
                </div>

                <div className={Styles.card}>
                    <div className={Styles.cardHeader}>
                        <h2>Credit Card</h2>
                    </div>

                                        <div>
                                            <p className={Styles.description}>Lorem ipsum dolor sit amet consectetur 
                            adipisicing elit. Expedita quasi 
                            cumque, mollitia quos veritatis 
                            accusamus id quam quis repudiandae 

                            </p>
                    </div>
                    <Button
                        variant='primary'
                        label='Credit Card'
                        showIcon
                    />
                </div>
                
            </div>
        </section>
    )
}
