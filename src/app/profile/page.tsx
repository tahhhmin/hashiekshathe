// app/user/profile/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './page.module.css';
import { Calendar, MapPin } from 'lucide-react';
import Button from '@/ui/button/Button';

import ProfileOverviewTab from '@/components/profile/ProfileOverviewTab'
import ProfileInvolvementTab from '@/components/profile/ProfileInvolvementTab';
import ProfileAccountTab from '@/components/profile/ProfileSettingsTab'
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

interface FormErrors {
    [key: string]: string;
}

export default function UserProfilePage() {
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [editData, setEditData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [successMessage, setSuccessMessage] = useState('');
    const [activeTab, setActiveTab] = useState<'profile' | 'involvement' | 'notifications' | 'settings'>('profile');

    useEffect(() => {
        async function fetchUserProfile() {
            try {
                const response = await fetch('/api/users/profile', { method: 'GET' });
                const data = await response.json();

                if (response.ok && data.success) {
                    setUserData(data.data);
                    setEditData(data.data);
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

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!editData?.firstName?.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!editData?.lastName?.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!editData?.username?.trim()) {
            newErrors.username = 'Username is required';
        } else if (editData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!editData?.email?.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (editData?.phoneNumber && !/^\+?[0-9\s\-]{7,15}$/.test(editData.phoneNumber)) {
            newErrors.phoneNumber = 'Please enter a valid phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof UserData, value: string | boolean) => {
        if (!editData) return;

        setEditData({
            ...editData,
            [field]: value
        });

        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors({
                ...errors,
                [field]: ''
            });
        }
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        setUpdating(true);
        setErrors({});

        try {
            const response = await fetch('/api/users/update-user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editData),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setUserData(data.user);
                setEditData(data.user);
                setIsEditing(false);
                setSuccessMessage('Profile updated successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                if (data.details) {
                    setErrors(data.details);
                } else {
                    setErrors({ general: data.error || 'Failed to update profile' });
                }
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            setErrors({ general: 'Network error. Please try again.' });
        } finally {
            setUpdating(false);
        }
    };

    const handleCancel = () => {
        setEditData(userData);
        setIsEditing(false);
        setErrors({});
    };

    const handleLogout = async () => {
        await fetch('/api/users/logout', { method: 'GET' });
        router.replace('/login');
    };

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

    // Determine if we should show avatar or initials
    // We should show initials if there's no avatar, or if the avatar URL (after transformation) is still problematic.
    // However, after transformation, it should ideally load. The `onError` will act as a final fallback.
    const shouldShowInitials = !userData.avatar; // Start with the assumption that if no avatar, show initials

    return (
        <section className='section'>
            <div className={styles.container}>

                <div className={styles.header}>
                    <div className={styles.avatarContainer}>
                        {shouldShowInitials ? (
                            <div className={styles.avatar}>
                                {firstNameInitial}{lastNameInitial}
                            </div>
                        ) : (
                            <div className={styles.avatar}>
                                <img
                                    src={avatarSrc} // Use the potentially transformed URL
                                    alt="User Avatar"
                                    className={styles.avatar}
                                    onError={(e) => {
                                        // Hide the img and show initials on error
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        const parent = target.parentElement;
                                        if (parent) {
                                            parent.innerHTML = `${firstNameInitial}${lastNameInitial}`;
                                            parent.style.display = 'flex';
                                            parent.style.alignItems = 'center';
                                            parent.style.justifyContent = 'center';
                                        }
                                    }}
                                />
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
                                <MapPin /> {userData.address}
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

                <div className={styles.profileCard}>
                    {/* Success Message */}
                    {successMessage && (
                        <div className={styles.successMessage}>
                            {successMessage}
                        </div>
                    )}
                    {/* General Error */}
                    {errors.general && (
                        <div className={styles.errorMessage}>
                            {errors.general}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}