"use client"

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Styles from './HeroSection.module.css';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image'

export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const tagRef = useRef<HTMLDivElement>(null);
    const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
    const subtitleRef = useRef<HTMLHeadingElement>(null);
    const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Set initial states
            gsap.set([
                tagRef.current, 
                ...titleRefs.current.filter(Boolean), 
                subtitleRef.current, 
                ...buttonRefs.current.filter(Boolean)
            ], {
                opacity: 0,
                y: 50
            });

            // Hide images initially and set transform properties
            gsap.set(imageRefs.current.filter(Boolean), {
                opacity: 0,
                scale: 0.8,
                rotation: 10
            });

            // Also hide all Next.js images initially
            gsap.set("img", {
                opacity: 0
            });

            // Create timeline for sequential animations
            const tl = gsap.timeline({
                defaults: { ease: "power3.out" }
            });

            // Animate tag
            tl.to(tagRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.6
            })

            // Animate titles with stagger
            .to(titleRefs.current.filter(Boolean), {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.2
            }, "-=0.3")

            // Animate subtitle
            .to(subtitleRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.8
            }, "-=0.4")

            // Animate buttons
            .to(buttonRefs.current.filter(Boolean), {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1
            }, "-=0.3")

            // Animate images with stagger and different effects
            .to(imageRefs.current.filter(Boolean), {
                opacity: 1,
                scale: 1,
                rotation: 0,
                duration: 1,
                stagger: {
                    amount: 0.8,
                    from: "random"
                }
            }, "-=0.6")
            
            // Animate the actual img elements
            .to("img", {
                opacity: 1,
                duration: 0.5,
                stagger: 0.1
            }, "-=0.8");

            // Add hover animations for buttons
            buttonRefs.current.forEach(button => {
                if (button) {
                    const icon = button.querySelector('svg');
                    
                    const handleMouseEnter = () => {
                        gsap.to(button, {
                            scale: 1.05,
                            duration: 0.3,
                            ease: "power2.out"
                        });
                        
                        if (icon) {
                            gsap.to(icon, {
                                x: 3,
                                y: -3,
                                duration: 0.3,
                                ease: "power2.out"
                            });
                        }
                    };

                    const handleMouseLeave = () => {
                        gsap.to(button, {
                            scale: 1,
                            duration: 0.3,
                            ease: "power2.out"
                        });
                        
                        if (icon) {
                            gsap.to(icon, {
                                x: 0,
                                y: 0,
                                duration: 0.3,
                                ease: "power2.out"
                            });
                        }
                    };
                    
                    button.addEventListener('mouseenter', handleMouseEnter);
                    button.addEventListener('mouseleave', handleMouseLeave);
                }
            });

            // Add floating animation to images
            gsap.to(imageRefs.current.filter(Boolean), {
                y: -10,
                duration: 2,
                ease: "power2.inOut",
                yoyo: true,
                repeat: -1,
                stagger: {
                    amount: 1,
                    from: "random"
                }
            });

        }, containerRef);

        return () => ctx.revert(); // Cleanup
    }, []);

    return (
        <div className={Styles.container} ref={containerRef}>
            <div className={Styles.heroTextContainer}>
                <div className={Styles.tag} ref={tagRef}>
                    Non-Profit
                </div>

                <div className={Styles.titleContainer}>
                    <h1 
                        className={Styles.title} 
                        ref={el => { titleRefs.current[0] = el; }}
                    >
                        Student Led Non-Profit
                    </h1>
                    <h1 
                        className={Styles.title} 
                        ref={el => { titleRefs.current[1] = el; }}
                    >
                        Based in Bangladesh.
                    </h1>
                </div>

                <div className={Styles.subtitleContainer}>
                    <h2 className={Styles.subtitle} ref={subtitleRef}>
                        Empowering communities through education, sustainability, and social
                        impact. Together, we&rsquo;re building a brighter future for
                        Bangladesh, one initiative at a time.
                    </h2>
                </div>

                <div className={Styles.buttonContainer}>
                    <button 
                        className={Styles.button}
                        ref={el => { buttonRefs.current[0] = el; }}
                    >
                        <ArrowUpRight className={Styles.icon}/> Discover More
                    </button>

                    <button 
                        className={Styles.button}
                        ref={el => { buttonRefs.current[1] = el; }}
                    >
                        <ArrowUpRight className={Styles.icon}/> Donate
                    </button>
                </div>
            </div>

            <div className={Styles.heroImagesContainer}>
                <div className={Styles.parent}>
                    <div 
                        className={Styles.div1} 
                        ref={el => { imageRefs.current[0] = el; }}
                    >
                        <Image 
                            src="https://drive.google.com/uc?export=view&id=1nd7DJVJfPP4LS0Xn9COcazkce0ASS_zL"
                            alt="hello"
                            fill
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                    <div 
                        className={Styles.div2} 
                        ref={el => { imageRefs.current[1] = el; }}
                    >
                        <Image 
                            src="https://drive.google.com/uc?export=view&id=1Adh5lwSOP1Ms8NME8t7YEc6tCpF1a7GL"
                            alt="hello"
                            fill
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                    <div 
                        className={Styles.div3} 
                        ref={el => { imageRefs.current[2] = el; }}
                    >
                        <Image 
                            src="https://drive.google.com/uc?export=view&id=1cZzqFY8sOREhAjvJZqs2R2ueQhY6oBxP"
                            alt="hello"
                            fill
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                    <div 
                        className={Styles.div4} 
                        ref={el => { imageRefs.current[3] = el; }}
                    >
                        <Image 
                            src="https://drive.google.com/uc?export=view&id=1Nw3ziJkV7WcSFU1NwtmzjmGKTcnAoKlC"
                            alt="hello"
                            fill
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                    <div 
                        className={Styles.div5} 
                        ref={el => { imageRefs.current[4] = el; }}
                    >
                        <Image 
                            src="https://drive.google.com/uc?export=view&id=1ciS-BgtzjVCnBuH_QMFx1A8Bv8rQ-7Bx"
                            alt="hello"
                            fill
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}