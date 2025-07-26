// ./src/components/profile/ProfileSettingsTab.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import styles from './ProfileSettingsTab.module.css'; // Assuming this is the correct path to your CSS module

// You likely have an interface for UserData defined elsewhere,
// or it should be defined if this component fetches its own user data.
// For now, I'll assume it's either passed as a prop or fetched internally.
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

export default function ProfileSettingsTab() {
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [editData, setEditData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});

    // Removed unused state variables:
    // - avatarError, setAvatarError (these might be relevant if you add avatar upload logic later)
    // - successMessage (should ideally be handled by the component that performs the save action)
    // - activeTab, setActiveTab (these are managed by the parent UserProfilePage component)

    useEffect(() => {
        async function fetchUserProfile() {
            try {
                // This component fetching its own profile data might be redundant
                // if the parent UserProfilePage already fetches and passes it down.
                // Consider whether ProfileSettingsTab truly needs to fetch this itself,
                // or if it should receive `userData` as a prop.
                const response = await fetch('/api/users/profile', { method: 'GET' });
                const data = await response.json();

                if (response.ok && data.success) {
                    setUserData(data.data);
                    setEditData(data.data); // Initialize editData with fetched data
                } else {
                    console.warn(`Client-side: API denied access to /user/profile (Status: ${response.status}). Redirecting.`);
                    router.replace('/login');
                    return;
                }
            } catch (err) {
                console.error('Client-side: Network or unexpected error fetching user profile:', err);
                // Optionally redirect or show an error to the user
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
                // If this component should show a success message, you'd manage it here.
                // For now, it's removed as per the warning.
                // setSuccessMessage('Profile updated successfully!');
                // setTimeout(() => setSuccessMessage(''), 3000);
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
        setEditData(userData); // Reset to original data
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
                <p>Loading settings...</p>
            </div>
        );
    }

    // Removed unused variables: fallbackUrl, formattedDateJoined
    // These appear to be related to general profile display and are not specific to settings.
    // They are correctly used in UserProfilePage and don't need to be duplicated here.

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.headerTitle}>Account Settings</h2>
                <p className='muted-text'>Manage your account details and preferences.</p>
            </div>

            {/* General Error Display */}
            {errors.general && (
                <div className={styles.errorMessage}>
                    {errors.general}
                </div>
            )}

            {/* Profile Information Section */}
            <div className={styles.card}>
                <h3 className={styles.cardTitle}>Personal Information</h3>
                {!isEditing ? (
                    <div className={styles.infoGrid}>
                        <div className={styles.infoItem}>
                            <strong>First Name:</strong> {userData.firstName}
                        </div>
                        <div className={styles.infoItem}>
                            <strong>Last Name:</strong> {userData.lastName}
                        </div>
                        {userData.middleName && (
                            <div className={styles.infoItem}>
                                <strong>Middle Name:</strong> {userData.middleName}
                            </div>
                        )}
                        <div className={styles.infoItem}>
                            <strong>Username:</strong> @{userData.username}
                        </div>
                        <div className={styles.infoItem}>
                            <strong>Email:</strong> {userData.email}
                        </div>
                        {userData.phoneNumber && (
                            <div className={styles.infoItem}>
                                <strong>Phone:</strong> {userData.phoneNumber}
                            </div>
                        )}
                        {userData.dateOfBirth && (
                            <div className={styles.infoItem}>
                                <strong>Date of Birth:</strong> {new Date(userData.dateOfBirth).toLocaleDateString()}
                            </div>
                        )}
                        {userData.gender && (
                            <div className={styles.infoItem}>
                                <strong>Gender:</strong> {userData.gender}
                            </div>
                        )}
                        {userData.address && (
                            <div className={styles.infoItem}>
                                <strong>Address:</strong> {userData.address}
                            </div>
                        )}
                        {userData.location && (
                            <div className={styles.infoItem}>
                                <strong>Location:</strong> {userData.location}
                            </div>
                        )}
                        <button onClick={() => setIsEditing(true)} className={styles.editButton}>Edit Profile</button>
                    </div>
                ) : (
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label htmlFor="firstName">First Name:</label>
                            <input
                                type="text"
                                id="firstName"
                                value={editData?.firstName || ''}
                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                className={errors.firstName ? styles.inputError : ''}
                            />
                            {errors.firstName && <p className={styles.errorText}>{errors.firstName}</p>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="lastName">Last Name:</label>
                            <input
                                type="text"
                                id="lastName"
                                value={editData?.lastName || ''}
                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                className={errors.lastName ? styles.inputError : ''}
                            />
                            {errors.lastName && <p className={styles.errorText}>{errors.lastName}</p>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="middleName">Middle Name (Optional):</label>
                            <input
                                type="text"
                                id="middleName"
                                value={editData?.middleName || ''}
                                onChange={(e) => handleInputChange('middleName', e.target.value)}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="username">Username:</label>
                            <input
                                type="text"
                                id="username"
                                value={editData?.username || ''}
                                onChange={(e) => handleInputChange('username', e.target.value)}
                                className={errors.username ? styles.inputError : ''}
                            />
                            {errors.username && <p className={styles.errorText}>{errors.username}</p>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                value={editData?.email || ''}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className={errors.email ? styles.inputError : ''}
                            />
                            {errors.email && <p className={styles.errorText}>{errors.email}</p>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="phoneNumber">Phone Number (Optional):</label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                value={editData?.phoneNumber || ''}
                                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                className={errors.phoneNumber ? styles.inputError : ''}
                            />
                            {errors.phoneNumber && <p className={styles.errorText}>{errors.phoneNumber}</p>}
                        </div>

                        {/* Add more editable fields as needed, e.g., dateOfBirth, gender, address, location */}

                        <div className={styles.formActions}>
                            <button onClick={handleSave} className={styles.saveButton} disabled={updating}>
                                {updating ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button onClick={handleCancel} className={styles.cancelButton} disabled={updating}>
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Logout Section */}
            <div className={styles.card}>
                <h3 className={styles.cardTitle}>Account Actions</h3>
                <button onClick={handleLogout} className={styles.logoutButton}>
                    Logout
                </button>
            </div>
        </div>
    );
}