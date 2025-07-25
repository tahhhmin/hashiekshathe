import React from 'react';
import Styles from './HeroSection.module.css';

export default function HeroSection() {
    return (
            <div className={Styles.container}>
                <div className={Styles.textContainer}>
                    <div>
                        <h1 className={`${Styles.title} ${Styles.line1}`}>Hashi Ekshathe</h1>
                        <h1 className={`${Styles.title}`}>Student Led Non-Profit</h1>
                        <h1 className={`${Styles.title}`}>Based in Bangladesh.</h1>
                    </div>

                    <h2 className={Styles.subtitle}>
                        Empowering communities through education, sustainability, and social impact.
                        Together, we&rsquo;re building a brighter future for Bangladesh, one initiative at a time.
                    </h2>
                </div>

                <div>
                    <div>
                        <h2>Volunteers</h2>
                        <h1>1400</h1>
                    </div>
                </div>
            </div>
    );
}
