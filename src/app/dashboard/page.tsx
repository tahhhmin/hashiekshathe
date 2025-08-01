'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Styles from './page.module.css';
import Sidebar, { SidebarSection } from '@/ui/sidebar/Sidebar';
import Button from '@/ui/button/Button';
import Signup from '@/components/dashboard/volunteer/SignupTab';

// Dummy components for demonstration – replace these with actual ones
const ProjectList = () => <p>Project List Content</p>;
const AnnouncementList = () => <p>Announcement List Content</p>;
const CreateAnnouncement = () => <p>Create New Announcement Content</p>;
const ViewAllVolunteers = () => <p>View All Volunteers Content</p>;
const DepartmentA = () => <p>Department A Content</p>;
const DepartmentB = () => <p>Department B Content</p>;

import CreateProjectForm from '@/components/dashboard/project/CreateProjectForm';
import CreateAnnouncementForm from '@/components/dashboard/announcement/CreateAnnouncementForm';
import favicon from '../../../public/favicon-orange.svg'

const header = {
    logo: favicon,
    title: 'Hashi Ekshathe',
    subtitle: 'Admin Panel',
};

const footer = {
    avatar: favicon,
    name: 'Admin Name',
    email: 'admin@example.com',
    accessLevel: 'Super Admin',
};

const sections: SidebarSection[] = [
    {
        title: 'Project',
        icon: 'Boxes',
        items: [
            { label: 'View List', uniqueId: 'project_view_list' },
            { label: 'Create', uniqueId: 'project_add_new' },
        ],
    },
    {
        title: 'Volunteer',
        icon: 'Users',
        items: [
            { label: 'View all volunteer', uniqueId: 'volunteer_view_all' },
            { label: 'Signup', uniqueId: 'volunteer_signup' },
        ]
    },
    {
        title: 'Announcement',
        icon: 'Mic',
        items: [
            { label: 'View all', uniqueId: 'announcement_view_all' },
            { label: 'Create', uniqueId: 'announcement_create' },
        ]
    }
];

export default function Page() {
    const [showSidebar, setShowSidebar] = useState(true);
    const [selectedContent, setSelectedContent] = useState<string | null>(null);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 750px)');
        setShowSidebar(!mediaQuery.matches);

        const handleResize = (e: MediaQueryListEvent) => {
            setShowSidebar(!e.matches);
        };

        mediaQuery.addEventListener('change', handleResize);
        return () => mediaQuery.removeEventListener('change', handleResize);
    }, []);

    const handleItemClick = (uniqueId: string, label: string, sectionTitle: string) => {
        console.log(`Clicked: ${label} (ID: ${uniqueId}) in section: ${sectionTitle}`);
        setSelectedContent(uniqueId);
    };

    const contentComponents: Record<string, React.ReactNode> = {

        'project_add_new': <CreateProjectForm />,
        'project_announcement_list': <AnnouncementList />,
 
        'announcement_create': <CreateAnnouncementForm />,
 
        'volunteer_view_all': <ViewAllVolunteers />,
        'volunteer_signup': <Signup />,

        // Add more mappings as needed
    };

    return (
        <div className={Styles.dashboard}>
            {showSidebar && (
                <div className={Styles.sidebar}>
                    <Sidebar 
                        header={header} 
                        sections={sections} 
                        footer={footer} 
                        onItemClick={handleItemClick} 
                    />
                </div>
            )}

            <div className={Styles.content}>
                <div className={Styles.dashboardHeader}>
                    <Button variant="icon" showIcon icon="PanelLeft" onClick={() => setShowSidebar((prev) => !prev)} />
                    <Link href="/">
                        <Button variant="primary" label="Go back to site" showIcon />
                    </Link>
                </div>

                <div className={Styles.dashboardContent}>
                    {selectedContent ? (
                        contentComponents[selectedContent] ? (
                            contentComponents[selectedContent]
                        ) : (
                            <p>Content for &quot;{selectedContent}&quot; coming soon.</p>
                        )
                    ) : (
                        <div className={Styles.overview}>
                            <p>Overview</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}