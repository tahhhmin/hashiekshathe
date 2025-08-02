// app/user/profile/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Import Next.js Image component

import styles from './page.module.css';
import { Calendar, MapPin } from 'lucide-react';

// Import your tab components (they will handle their own state and logic internally)
import ProfileInvolvementTab from '@/components/profile/ProfileInvolvementTab';
import ProfileAccountTab from '@/components/profile/ProfileSettingsTab'; // Renamed for clarity as per previous file
import ProfileProfileTab from '@/components/profile/ProfileProfileTab';
import ProfileNotificationTab from '@/components/profile/ProfileNotificationTab';

interface UserData {
    firstName: string;
    lastName: string;
    middleName?: string;
    username: string;
    email: string;
    avatar?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    gender?: string;
    institution?: string;
    educationLevel?: string;
    address?: string;
    location?: string;
    teamName?: string;
    teamRole?: string;
    isDeptMember?: boolean;
    department?: string;
    dateJoined?: string;
}

export default function UserProfilePage() {
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    
    const [activeTab, setActiveTab] = useState<'profile' | 'involvement' | 'notifications' | 'settings'>('profile');

    useEffect(() => {
        async function fetchUserProfile() {
            try {
                const response = await fetch('/api/users/profile', { method: 'GET' });
                const data = await response.json();

                if (response.ok && data.success) {
                    setUserData(data.data);
                } else {
                    console.warn(`Client-side: API denied access to /user/profile (Status: ${response.status}). Redirecting.`);
                    router.replace('/login');
                    return;
                }
            } catch (err) {
                console.error('Client-side: Network or unexpected error fetching user profile:', err);
                router.replace('/login');
                return;
            } finally {
                setLoading(false);
            }
        }
        fetchUserProfile();
    }, [router]);

    if (loading || !userData) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Loading your profile...</p>
            </div>
        );
    }

    const firstNameInitial = userData.firstName ? userData.firstName.charAt(0).toUpperCase() : '';
    const lastNameInitial = userData.lastName ? userData.lastName.charAt(0).toUpperCase() : '';

    const formattedDateJoined = userData?.dateJoined
        ? new Date(userData.dateJoined).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
          })
        : "N/A";

    // Function to transform Google Drive view link to direct download link
    const getGoogleDriveDirectLink = (url: string): string => {
        if (url.includes('drive.google.com/file/d/') && url.includes('/view')) {
            const fileIdMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view/);
            if (fileIdMatch && fileIdMatch[1]) {
                return `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
            }
        }
        return url; // Return original URL if not a problematic Google Drive view link
    };

    const avatarSrc = userData.avatar ? getGoogleDriveDirectLink(userData.avatar) : '';

    return (
        <section className='section'>
            <div className={styles.container}>

                <div className={styles.header}>
                    <div className={styles.avatarContainer}>
                        {userData.avatar ? (
                            <div className={styles.avatar}>
                                <Image
                                    src={avatarSrc}
                                    alt="User Avatar"
                                    className={styles.avatar}
                                    width={100} // Set appropriate width for your avatar
                                    height={100} // Set appropriate height for your avatar
                                    priority={true} // Prioritize loading for a better LCP
                                    onError={(e) => {
                                        // Fallback to initials if image fails to load
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none'; // Hide the broken image element
                                        const parent = target.parentElement;
                                        if (parent) {
                                            // Ensure this creates a div for initials to be styled correctly
                                            parent.innerHTML = `<div class="${styles.initialsFallback}">${firstNameInitial}${lastNameInitial}</div>`;
                                            parent.style.display = 'flex';
                                            parent.style.alignItems = 'center';
                                            parent.style.justifyContent = 'center';
                                        }
                                    }}
                                />
                            </div>
                        ) : (
                            // Show initials directly if no avatar URL is provided
                            <div className={styles.avatar}>
                                {firstNameInitial}{lastNameInitial}
                            </div>
                        )}
                        <div className={styles.mobileIdentityContainer}>
                            <h3 className={styles.nameMobile}>{userData.firstName} {userData.middleName} {userData.lastName}</h3>
                            <p className={styles.usernameMobile}>@{userData.username}</p>
                        </div>
                    </div>

                    <div className={styles.profileIdentityContainer}>
                        <div className={styles.nameContainer}>
                            <h1 className={styles.name}>{userData.firstName} {userData.middleName} {userData.lastName}</h1>
                            <p className={styles.username}>@{userData.username}</p>
                        </div>
                        <p className='muted-text'>
                            Lorem ipsum dolor, sit amet consectetur
                            adipisicing elit. Aut sapiente autem quam
                            id expedita distinctio illum qui.
                            Inventore porro quos quasi. Totam,
                            reprehenderit cum. Deleniti ducimus
                            officiis amet id asperiores.
                        </p>

                        <div className={styles.headerInfoContainer}>
                            <div className={styles.infoItem}>
                                <MapPin /> {userData.address || 'N/A'}
                            </div>

                            <div className={styles.infoItem}>
                                <Calendar /> {formattedDateJoined}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.navbar}>
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`${styles.tab} ${activeTab === 'profile' ? styles.activeTab : ''}`}
                    >
                        Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('involvement')}
                        className={`${styles.tab} ${activeTab === 'involvement' ? styles.activeTab : ''}`}
                    >
                        Involvement
                    </button>
                    <button
                        onClick={() => setActiveTab('notifications')}
                        className={`${styles.tab} ${activeTab === 'notifications' ? styles.activeTab : ''}`}
                    >
                        Notifications
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`${styles.tab} ${activeTab === 'settings' ? styles.activeTab : ''}`}
                    >
                        Settings
                    </button>
                </div>

                {/* Render active tab component */}
                {activeTab === 'profile' && (
                    <ProfileProfileTab />
                )}

                {activeTab === 'involvement' && (
                    <ProfileInvolvementTab />
                )}
                {activeTab === 'notifications' && (
                    <ProfileNotificationTab />
                )}
                {activeTab === 'settings' && (
                    <ProfileAccountTab />
                )}
            </div>
        </section>
    );
}
