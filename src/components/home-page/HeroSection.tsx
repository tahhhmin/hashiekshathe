import React from 'react';
import Styles from './HeroSection.module.css';

export default function HeroSection() {
  return (
    <div className={Styles.section}>
      <div className={Styles.container}>
        <div>
          <h1 className={Styles.title}>Hashi Ekshathe</h1>
          <h1 className={`${Styles.title} ${Styles.hideTitle}`}>Student Led Non-Profit</h1>
          <h1 className={`${Styles.title} ${Styles.hideTitle}`}>Based in Bangladesh.</h1>
          <h1 className={Styles.hiddenTitle}>Student Led Non-Profit Based in Bangladesh.</h1>
        </div>

        <h2 className={Styles.subtitle}>
            Empowering communities through education, sustainability, and social impact.
            Together, we&rsquo;re building a brighter future for Bangladesh, one initiative at a time.
        </h2>
      </div>
    </div>
  );
}
