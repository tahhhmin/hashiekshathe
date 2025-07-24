import React from 'react'
import Styles from './Header.module.css'

import Image from 'next/image'
import Link from 'next/link'

import Logo from '../../../public/logo-orange.svg'

import Button from '@/ui/button/Button'
import ThemeToggleButton from '@/components/button/ThemeToggleButton';
import NavigationMenu, { NavItem } from '@/ui/navigationMenu/NavigationMenu'
import Sheet from '@/ui/sheet/sheet'
import AuthButton from '../button/AuthButton'

const navItems: NavItem[] = [
    { name: 'Home', path: '/' },
    {
        name: 'About',
        path: '/about',
        hasDropdown: true,
        dropdownItems: [
        { name: 'Introduction', path: '/about/introduction', description: 'Get to know who we are and what drives our mission.' },
        { name: 'Founding Story', path: '/about/founding', description: 'Discover how our journey began and the values we’re built on.' },
        { name: 'Mission & Vision', path: '/about/mission-vision', description: 'Learn about our core purpose and the future we’re working toward.' },
        { name: 'Our Initiatives', path: '/about/initiatives', description: 'Understand the key focus areas that guide our work.' },
        { name: 'Get Involved', path: '/about/get-involved', description: 'Find out how you can contribute, volunteer, or support us.' },
        { name: 'Our Leadership', path: '/about/leadership', description: 'Meet the people guiding our vision and impact.' },
        { name: 'Our Collaborators', path: '/about/collaborators', description: 'Explore the partnerships that strengthen our mission.' },
        ],
    },
    {
        name: 'Records',
        path: '/records',
        hasDropdown: true,
        dropdownItems: [
        { name: 'Donations', path: '/records/donations', description: 'See how your contributions are making a difference.' },
        { name: 'Expenditures', path: '/records/expenditures', description: 'Review how we allocate funds for complete transparency.' },
        ],
    },
    {
        name: 'Projects',
        path: '/projects',
        hasDropdown: true,
        dropdownItems: [
        { name: 'Upcoming Projects', path: '/projects/upcoming-projects', description: 'Explore the initiatives we’re planning in the near future.' },
        { name: 'Ongoing Projects', path: '/projects/ongoing-projects', description: 'Follow the progress of our current impactful efforts.' },
        { name: 'Completed Projects', path: '/projects/completed-projects', description: 'Look back at our past achievements and milestones.' },
        { name: 'Gallery', path: '/projects/gallery', description: 'View memorable moments and snapshots from our events.' },
        ],
    },
    {
        name: 'Volunteer',
        path: '/volunteer',
        hasDropdown: true,
        dropdownItems: [
        { name: 'Register', path: '/volunteer/register', description: 'Sign up to be a part of our growing volunteer community.' },
        { name: 'Benefits', path: '/volunteer/benefits', description: 'Discover how volunteering with us helps you grow too.' },
        ],
    },
    { name: 'Education', path: '/education', hasDropdown: false },
    { name: 'Announcements', path: '/announcements', hasDropdown: false },
    {
        name: 'Members',
        path: '/members',
        hasDropdown: true,
        dropdownItems: [
        { name: 'Departments', path: '/members/departments', description: 'Explore the various departments that power our organization.' },
        { name: 'Volunteers', path: '/members/volunteers', description: 'Meet the passionate individuals behind our efforts.' },
        ],
    },
    {
        name: 'Contact',
        path: '/contact',
        hasDropdown: true,
        dropdownItems: [
        { name: 'Inquiry', path: '/contact/inquiry', description: 'Have a question? Reach out and we’ll be happy to help.' },
        { name: 'Collaborate', path: '/contact/collaborate', description: 'Let’s team up and create something meaningful together.' },
        ],
    },
];

export default function Header() {
    return (
        <header className={Styles.header}>
            <div className={Styles.logoContainer}>
                <Link href='/' className={Styles.logoLink}>
                    <Image
                        src={Logo}
                        alt="Hashi Ekshathe Logo"
                        className={Styles.logo}
                    />
                </Link>
            </div>

            <div className={Styles.navigationMenuContainer}>
                <NavigationMenu navItems={navItems} />
            </div>

            <div className={Styles.buttonContainer}>
                <Link href='/donate' className={Styles.donateButton}>
                    <Button
                    variant='primary'
                    label='Donate'
                /></Link>

                <div className={Styles.authButton}>
                    <AuthButton />
                
                </div>
                <div className={Styles.themeToggleButton}><ThemeToggleButton /></div>

                <div className={Styles.sheetMenuContainer}>
                    <Sheet menuName="Menu" footer items={navItems} />
                </div>
            </div>
        </header>
    )
}