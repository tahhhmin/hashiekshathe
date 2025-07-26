'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Styles from './page.module.css';
import Sidebar, { SidebarSection } from '@/ui/sidebar/Sidebar';
import Button from '@/ui/button/Button';
import Signup from '@/components/dashboard/volunteer/SignupTab';

// Dummy components for demonstration – replace these with actual ones
const ProjectList = () => <p>Project List Content</p>;
const AddProjectForm = () => <p>Add Project Form</p>;
const AnnouncementList = () => <p>Announcement List Content</p>;

const header = {
    logo: '/favicon.svg',
    title: 'Hashi Ekshathe',
    subtitle: 'Admin Panel',
};

const footer = {
    avatar: '/favicon.svg',
    name: 'Admin Name',
    email: 'admin@example.com',
    accessLevel: 'Super Admin',
};

const sections: SidebarSection[] = [
    //{
      //  title: 'Platform',
        //items: [
          //  { label: 'Analytics', icon: 'ChartLine', dropdown: ['Reports', 'Graphs'] },
          //  { label: 'Settings', icon: 'Settings', dropdown: ['x', 'y'] },
           // { label: 'Admin', icon: 'ShieldUser', dropdown: ['x', 'y'] },
       // ],
  //  },
   // {
     //   title: 'Manage',
     //   items: [
      //      { label: 'Projects', icon: 'Boxes', dropdown: ['View List', 'Add New'] },
       //     {
        //        label: 'Announcements',
         //       icon: 'Megaphone',
      //          dropdown: ['View announcement list', 'Create new announcement'],
       //     },
        //    { label: 'FAQs', icon: 'MessageCircleQuestionMark', dropdown: ['View List', 'Add New'] },
    //    ],
 //   },
  //  {
  //      title: 'Manage',
 //       items: [
 //           { label: 'Department', icon: 'BookUser', dropdown: ['List', 'Requests'] },
 //           { label: 'Volunteers', icon: 'Users', dropdown: ['List', 'Requests'] },
//        ],
 //   },
 //   {
 //       title: 'Finance',
 //       items: [
//            { label: 'Records', icon: 'Archive', dropdown: ['List', 'Requests'] },
 //       ],
//    },
  //  {
    //    title: 'Contacts',
   //     items: [
  //          { label: 'Contact', icon: 'Mail', dropdown: ['List', 'Requests'] },
  //          { label: 'Collaborate', icon: 'Handshake', dropdown: ['List', 'Requests'] },
  //      ],
  //  },

    {
        title: 'Volunteer',
        items: [
            { label: 'Volunteer', icon: 'Users', dropdown: ['View all volunteer', 'Signup'] },
            { label: 'Departments', icon: 'Users', dropdown: ['a', 'b'] }
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


    const handleSubItemClick = (label: string) => {
        console.log('Clicked:', label);
        setSelectedContent(label);
    };

    const contentComponents: Record<string, React.ReactNode> = {
        'View List': <ProjectList />,
        'Add New': <AddProjectForm />,
        'View announcement list': <AnnouncementList />,
        'Signup': <Signup/>,
        // Add more mappings as needed
    };

    return (
        <div className={Styles.dashboard}>
            {showSidebar && (
                <div className={Styles.sidebar}>
                    <Sidebar header={header} sections={sections} footer={footer} onSubItemClick={handleSubItemClick} />
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
