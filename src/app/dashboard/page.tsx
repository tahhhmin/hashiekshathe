'use client';

import favicon from '../../../public/favicon-orange.svg'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Styles from './page.module.css';
import Sidebar, { SidebarSection } from '@/ui/sidebar/Sidebar';
import Button from '@/ui/button/Button';
import Signup from '@/components/dashboard/volunteer/SignupTab';

// Dummy components for demonstration – replace these with actual ones
const AnnouncementList = () => <p>Announcement List Content</p>;

import CreateProjectForm from '@/components/dashboard/project/CreateProjectForm';
import CreateAnnouncementForm from '@/components/dashboard/announcement/CreateAnnouncementForm';
import AdminUsersPage from '@/components/dashboard/volunteer/ViewAll';

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
            { label: 'View all projects', uniqueId: 'project_view_list' },
            { label: 'Create project', uniqueId: 'project_add_new' },
        ],
    },
    {
        title: 'Volunteer',
        icon: 'Users',
        items: [
            { label: 'View all volunteers', uniqueId: 'volunteer_view_all' },
            { label: 'Signup new volunteer', uniqueId: 'volunteer_signup' },
        ]
    },
    {
        title: 'Announcement',
        icon: 'Megaphone',
        items: [
            { label: 'View all announcements', uniqueId: 'announcement_view_all' },
            { label: 'Create announcement', uniqueId: 'announcement_create' },
        ]
    },
    {
        title: 'Members',
        icon: 'ShieldUser',
        items: [
            { label: 'View all members', uniqueId: 'announcement_view_all' },
            { label: 'Add new member', uniqueId: 'announcement_create' },
        ]
    },
    {
        title: 'Contact',
        icon: 'Mail',
        items: [
            { label: 'Collaborate messages', uniqueId: 'announcement_view_all' },
            { label: 'Inquiry messages', uniqueId: 'announcement_create' },
        ]
    }
];

// Loading Component
const LoadingScreen = () => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem',
        backgroundColor: '#f5f5f5'
    }}>
        <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e3e3e3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
        }}></div>
        <p>Verifying admin access...</p>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
    </div>
);

// Access Denied Component
const AccessDenied = ({ message }: { message: string }) => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem',
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: '#f5f5f5'
    }}>
        <div style={{
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: '8px',
            padding: '2rem',
            maxWidth: '400px'
        }}>
            <h2 style={{ color: '#c33', margin: '0 0 1rem 0' }}>Access Denied</h2>
            <p style={{ color: '#666', margin: '0 0 1rem 0' }}>{message}</p>
            <p style={{ color: '#888', fontSize: '0.9rem', margin: 0 }}>
                Redirecting to login page...
            </p>
        </div>
    </div>
);

export default function Page() {
    const [showSidebar, setShowSidebar] = useState(true);
    const [selectedContent, setSelectedContent] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const router = useRouter();

    // Admin verification effect
    useEffect(() => {
        const verifyAdminAccess = async () => {
            try {
                console.log('🔍 Starting admin verification...');
                
                const response = await fetch('/api/users/profile', {
                    method: 'GET',
                    credentials: 'include',
                });

                console.log('🔍 Response status:', response.status);
                console.log('🔍 Response ok:', response.ok);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.log('🔍 Error response:', errorText);
                    throw new Error('Authentication failed');
                }

                const responseData = await response.json();
                console.log('🔍 Full API response:', JSON.stringify(responseData, null, 2));
                
                // The user data is in responseData.data, not responseData.user
                const user = responseData.data;
                console.log('🔍 user exists?', !!user);
                console.log('🔍 user:', user);
                console.log('🔍 All top-level keys:', Object.keys(responseData));

                // Check admin access with detailed logging
                console.log('🔍 Checking admin access...');
                console.log('🔍 user.isAdmin:', user?.isAdmin);
                console.log('🔍 user.isSuperAdmin:', user?.isSuperAdmin);
                console.log('🔍 Type of isAdmin:', typeof user?.isAdmin);
                console.log('🔍 Type of isSuperAdmin:', typeof user?.isSuperAdmin);

                const hasAdminAccess = user?.isAdmin || user?.isSuperAdmin;
                console.log('🔍 Has admin access?', hasAdminAccess);

                // Check if user is admin
                if (!hasAdminAccess) {
                    throw new Error('Admin access required. You do not have permission to access this page.');
                }

                console.log('✅ Admin verification successful!');
                setIsAuthorized(true);
            } catch (error) {
                console.error('❌ Admin verification failed:', error);
                const message = error instanceof Error ? error.message : 'Access denied';
                setErrorMessage(message);
                
                // Redirect after 3 seconds
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            } finally {
                setIsLoading(false);
            }
        };

        verifyAdminAccess();
    }, [router]);

    // Media query effect (only run when authorized)
    useEffect(() => {
        if (!isAuthorized) return;

        const mediaQuery = window.matchMedia('(max-width: 750px)');
        setShowSidebar(!mediaQuery.matches);

        const handleResize = (e: MediaQueryListEvent) => {
            setShowSidebar(!e.matches);
        };

        mediaQuery.addEventListener('change', handleResize);
        return () => mediaQuery.removeEventListener('change', handleResize);
    }, [isAuthorized]);

    const handleItemClick = (uniqueId: string, label: string, sectionTitle: string) => {
        console.log(`Clicked: ${label} (ID: ${uniqueId}) in section: ${sectionTitle}`);
        setSelectedContent(uniqueId);
    };

    const contentComponents: Record<string, React.ReactNode> = {
        'project_add_new': <CreateProjectForm />,
        'project_announcement_list': <AnnouncementList />,
        'announcement_create': <CreateAnnouncementForm />,
        'volunteer_view_all': <AdminUsersPage />,
        'volunteer_signup': <Signup />,
        // Add more mappings as needed
    };

    // Show loading screen while verifying
    if (isLoading) {
        return <LoadingScreen />;
    }

    // Show access denied if not authorized
    if (!isAuthorized) {
        return <AccessDenied message={errorMessage} />;
    }

    // Render dashboard only if authorized
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