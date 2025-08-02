import React from 'react';
import Styles from './HeroSection.module.css';
import { MoveUpRight } from 'lucide-react'

export default function HeroSection() {
  return (
    <div className={Styles.container}>
      <div className={Styles.heroTextContainer}>
        <div className={Styles.tag}>
            Non-Profit
        </div>

        <div className={Styles.titleContainer}>
            <h1 className={Styles.title}>Student Led Non-Profit</h1>
            <h1 className={Styles.title}>Based in Bangladesh.</h1>
        </div>

        <div className={Styles.subtitleContainer}>
          <h2 className={Styles.subtitle}>
            Empowering communities through education, sustainability, and social
            impact. Together, we&rsquo;re building a brighter future for
            Bangladesh, one initiative at a time.
          </h2>
        </div>

        <div className={Styles.buttonContainer}>
            <button className={Styles.button}>
               <MoveUpRight className={Styles.icon}/> Discover More
            </button>

            <button className={Styles.button}>
               <MoveUpRight className={Styles.icon}/> Donate
            </button>
        </div>
      </div>

      <div className={Styles.heroImagesContainer}>
        <div className={Styles.parent}>
          <div className={Styles.div1}>1</div>
          <div className={Styles.div2}>2</div>
          <div className={Styles.div3}>3</div>
          <div className={Styles.div4}>4</div>
          <div className={Styles.div5}>5</div>
        </div>
      </div>
    </div>
  );
}
