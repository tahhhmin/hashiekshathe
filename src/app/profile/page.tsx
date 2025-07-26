// app/user/profile/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './page.module.css';
import { Calendar, MapPin } from 'lucide-react';
import Button from '@/ui/button/Button';
import ProfileAccountTab from '@/components/profile/ProfileAccountTab'

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
    const [avatarError, setAvatarError] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [successMessage, setSuccessMessage] = useState('');
    const [activeTab, setActiveTab] = useState<'overview' | 'personal' | 'academic' | 'settings'>('overview');

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
    const fallbackUrl = `https://placehold.co/120x120/cccccc/333333?text=${firstNameInitial}${lastNameInitial}`;

    const formattedDateJoined = userData?.dateJoined
    ? new Date(userData.dateJoined).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        })
    : "N/A";



    return (
        <section className='section'>
            <div className={styles.container}>

                <div className={styles.header}>
                    <div className={styles.avatarContainer}>
                        {userData.avatar && !avatarError ? (
                            <div className={styles.avatar}>
                                <Image
                                    src={userData.avatar}
                                    alt="User Avatar"
                                    className={styles.avatar}
                                    onError={() => setAvatarError(true)}
                                    priority
                                />
                            </div>


                        ) : userData.avatar && avatarError ? (
                            <div className={styles.avatar}>
                                <Image
                                    src={fallbackUrl}
                                    alt="User Avatar Fallback"
                                    className={styles.avatar}
                                    priority
                                />
                            </div>
                        ) : (
                            <div className={styles.avatar}>
                                {firstNameInitial}{lastNameInitial}
                            </div>
                        )}
                        <div className={styles.mobileIdentityContainer}>
                            <h1 className={styles.nameMobile}>{userData.firstName} {userData.middleName} {userData.lastName}</h1>
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

                            <div className={styles.infoItem}>
                                <MapPin /> {userData.address}
                            </div>
                        </div>
                    </div>
                </div>



                <div className={styles.navbar}>

                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`${styles.tab} ${activeTab === 'overview' ? styles.activeTab : ''}`}
                    >
                        Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('personal')}
                        className={`${styles.tab} ${activeTab === 'personal' ? styles.activeTab : ''}`}
                    >
                        Involvement
                    </button>
                    <button
                        onClick={() => setActiveTab('academic')}
                        className={`${styles.tab} ${activeTab === 'academic' ? styles.activeTab : ''}`}
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

                {activeTab === 'overview' && (
                    <div className={styles.containerOverview}>


                    </div>
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


                    {/* Tabs */}


                    {/* Form Content */}
                    <div className={styles.formContent}>
                        {activeTab === 'personal' && (



                                <div className={styles.formSection}>

                <div className=''>
                    {!isEditing ? (
                                <Button
                                    variant='outlined'
                                    icon='Pencil'
                                    showIcon
                                    onClick={() => setIsEditing(true)}
                                    label="Edit Profile"
                                    
                                />
                        ) : (
                                <div className={styles.editActions}>
                                    <Button
                                        variant='outlined'
                                        onClick={handleSave}
                                        disabled={updating}
                                        showIcon
                                        icon='Save'
                                        label={updating ? 'Saving...' : 'Save'}
                                    />
                                    <Button
                                        onClick={handleCancel}
                                        disabled={updating}
                                        variant='danger'
                                        label='Cancel'
                                    />
                                </div>
                        )}
                </div>

                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>First Name *</label>
                                        {isEditing ? (
                                            <>
                                                <input
                                                    type="text"
                                                    value={editData?.firstName || ''}
                                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                                    className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
                                                />
                                                {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
                                            </>
                                        ) : (
                                            <div className={styles.displayValue}>{userData.firstName}</div>
                                        )}
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Last Name *</label>
                                        {isEditing ? (
                                            <>
                                                <input
                                                    type="text"
                                                    value={editData?.lastName || ''}
                                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                                    className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
                                                />
                                                {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
                                            </>
                                        ) : (
                                            <div className={styles.displayValue}>{userData.lastName}</div>
                                        )}
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Middle Name</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editData?.middleName || ''}
                                                onChange={(e) => handleInputChange('middleName', e.target.value)}
                                                className={styles.input}
                                            />
                                        ) : (
                                            <div className={styles.displayValue}>{userData.middleName || 'Not specified'}</div>
                                        )}
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Username *</label>
                                        {isEditing ? (
                                            <>
                                                <input
                                                    type="text"
                                                    value={editData?.username || ''}
                                                    onChange={(e) => handleInputChange('username', e.target.value)}
                                                    className={`${styles.input} ${errors.username ? styles.inputError : ''}`}
                                                />
                                                {errors.username && <span className={styles.errorText}>{errors.username}</span>}
                                            </>
                                        ) : (
                                            <div className={styles.displayValue}>@{userData.username}</div>
                                        )}
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Email *</label>
                                        {isEditing ? (
                                            <>
                                                <input
                                                    type="email"
                                                    value={editData?.email || ''}
                                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                                    className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                                                />
                                                {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                                            </>
                                        ) : (
                                            <div className={styles.displayValue}>{userData.email}</div>
                                        )}
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Phone Number</label>
                                        {isEditing ? (
                                            <>
                                                <input
                                                    type="tel"
                                                    value={editData?.phoneNumber || ''}
                                                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                                    className={`${styles.input} ${errors.phoneNumber ? styles.inputError : ''}`}
                                                    placeholder="+1234567890"
                                                />
                                                {errors.phoneNumber && <span className={styles.errorText}>{errors.phoneNumber}</span>}
                                            </>
                                        ) : (
                                            <div className={styles.displayValue}>{userData.phoneNumber || 'Not specified'}</div>
                                        )}
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Date of Birth</label>
                                        {isEditing ? (
                                            <input
                                                type="date"
                                                value={editData?.dateOfBirth ? new Date(editData.dateOfBirth).toISOString().split('T')[0] : ''}
                                                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                                className={styles.input}
                                            />
                                        ) : (
                                            <div className={styles.displayValue}>
                                                {userData.dateOfBirth ? new Date(userData.dateOfBirth).toLocaleDateString() : 'Not specified'}
                                            </div>
                                        )}
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Gender</label>
                                        {isEditing ? (
                                            <select
                                                value={editData?.gender || ''}
                                                onChange={(e) => handleInputChange('gender', e.target.value)}
                                                className={styles.select}
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                                <option value="prefer-not-to-say">Prefer not to say</option>
                                            </select>
                                        ) : (
                                            <div className={styles.displayValue}>{userData.gender || 'Not specified'}</div>
                                        )}
                                    </div>

                                                                    <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Team Name</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editData?.teamName || ''}
                                                onChange={(e) => handleInputChange('teamName', e.target.value)}
                                                className={styles.input}
                                            />
                                        ) : (
                                            <div className={styles.displayValue}>{userData.teamName || 'Not specified'}</div>
                                        )}
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Team Role</label>
                                        {isEditing ? (
                                            <select
                                                value={editData?.teamRole || ''}
                                                onChange={(e) => handleInputChange('teamRole', e.target.value)}
                                                className={styles.select}
                                            >
                                                <option value="">Select Role</option>
                                                <option value="leader">Team Leader</option>
                                                <option value="member">Team Member</option>
                                                <option value="coordinator">Coordinator</option>
                                                <option value="advisor">Advisor</option>
                                                <option value="other">Other</option>
                                            </select>
                                        ) : (
                                            <div className={styles.displayValue}>{userData.teamRole || 'Not specified'}</div>
                                        )}
                                    </div>
                                </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Address</label>
                                    {isEditing ? (
                                        <textarea
                                            value={editData?.address || ''}
                                            onChange={(e) => handleInputChange('address', e.target.value)}
                                            className={styles.textarea}
                                            rows={3}
                                        />
                                    ) : (
                                        <div className={styles.displayValue}>{userData.address || 'Not specified'}</div>
                                    )}
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Location</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editData?.location || ''}
                                            onChange={(e) => handleInputChange('location', e.target.value)}
                                            className={styles.input}
                                            placeholder="City, Country"
                                        />
                                    ) : (
                                        <div className={styles.displayValue}>{userData.location || 'Not specified'}</div>
                                    )}
                                </div>

                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Institution</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editData?.institution || ''}
                                                onChange={(e) => handleInputChange('institution', e.target.value)}
                                                className={styles.input}
                                            />
                                        ) : (
                                            <div className={styles.displayValue}>{userData.institution || 'Not specified'}</div>
                                        )}
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Education Level</label>
                                        {isEditing ? (
                                            <select
                                                value={editData?.educationLevel || ''}
                                                onChange={(e) => handleInputChange('educationLevel', e.target.value)}
                                                className={styles.select}
                                            >
                                                <option value="">Select Education Level</option>
                                                <option value="high-school">High School</option>
                                                <option value="bachelors">Bachelor&apos;s Degree</option> {/* Changed here */}
                                                <option value="masters">Master&apos;s Degree</option>   {/* Changed here */}
                                                <option value="phd">PhD</option>
                                                <option value="other">Other</option>
                                            </select>
                                        ) : (
                                            <div className={styles.displayValue}>{userData.educationLevel || 'Not specified'}</div>
                                        )}
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Department</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editData?.department || ''}
                                                onChange={(e) => handleInputChange('department', e.target.value)}
                                                className={styles.input}
                                            />
                                        ) : (
                                            <div className={styles.displayValue}>{userData.department || 'Not specified'}</div>
                                        )}
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.checkboxLabel}>
                                            {isEditing ? (
                                                <input
                                                    type="checkbox"
                                                    checked={editData?.isDeptMember || false}
                                                    onChange={(e) => handleInputChange('isDeptMember', e.target.checked)}
                                                    className={styles.checkbox}
                                                />
                                            ) : null}
                                            <span className={styles.checkboxText}>
                                                {isEditing ? 'Department Member' : `Department Member: ${userData.isDeptMember ? 'Yes' : 'No'}`}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'academic' && (
                            <div className={styles.formSection}>
                                
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <ProfileAccountTab />
                        )}
                    </div>

                    {/* Action Buttons */}

                </div>
            </div>
        </section>
    );
}