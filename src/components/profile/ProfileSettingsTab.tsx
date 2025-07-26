import React, { useState, useEffect } from 'react'

import styles from './ProfileSettingsTab.module.css'
import Button from '@/ui/button/Button'

import { useRouter } from 'next/navigation';

import Input from '@/ui/input/Input';
import Textarea from '@/ui/input/Textarea';
import LogoutButton from '../button/LogoutButton';
import HorizontalDivider from '../dividers/HorizontalDivider';


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






export default function ProfileProfileTab() {
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
        <div className={styles.container}>
            <div className={styles.subContainer}>
                <div className={styles.basicInformationTitleContainer}>
                    <div>
                        <h2>Basic Information</h2>
                        <p>Your personal details and contact information</p>
                    </div>

                    <div className={styles.basicInformationTitleButtonContainer}>
                    {!isEditing ? (
                        <Button
                            variant='outlined'
                            icon='Pencil'
                            showIcon
                            onClick={() => setIsEditing(true)}
                            label="Edit Profile"
                            
                        />
                    ) : (
                        <div className={styles.basicInformationTitleButtonContainer}>
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
                </div>

                <div className={styles.formGrid}>
                    <div className={styles.nameEdit}>
                        {isEditing ? (
                        <>
                            <div className={styles.nameEditInput}>
                            <Input
                                label="First Name"
                                type="text"
                                value={editData?.firstName || ""}
                                onChange={(e) => handleInputChange("firstName", e.target.value)}
                                placeholder=""
                                showIcon
                                icon="User"
                                showHelpText
                                helpText="Input ur name"
                            />
                            {errors.firstName && (
                                <span className={styles.errorText}>{errors.firstName}</span>
                            )}
                            </div>

                            <div className={styles.nameEditInput}>
                            <Input
                                label="Last Name"
                                type="text"
                                value={editData?.lastName || ""}
                                onChange={(e) => handleInputChange("lastName", e.target.value)}
                                showHelpText
                                helpText="meowing"
                                showIcon
                                icon="User"
                            />
                            {errors.lastName && (
                                <span className={styles.errorText}>{errors.lastName}</span>
                            )}
                            </div>

                            <div className={styles.nameEditInput}>
                            <Input
                                label="Middle Name"
                                type="text"
                                value={editData?.middleName || ""}
                                onChange={(e) => handleInputChange("middleName", e.target.value)}
                                showHelpText
                                helpText="meowing"
                                showIcon
                                icon="User"
                            />
                            </div>
                        </>
                        ) : (
                        <div className={styles.displayValue}>
                            <p className={styles.displayValueTitle}>Name</p>
                            <div className={styles.displayValueContent}>
                                {userData.firstName}{" "}
                                {userData.middleName ? `${userData.middleName} ` : ""}
                                {userData.lastName}
                            </div>
                        </div>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        {isEditing ? (
                            <>
                                <Input
                                    label='Username'
                                    type="text"
                                    value={editData?.username || ''}
                                    onChange={(e) => handleInputChange('username', e.target.value)}
                                    showHelpText
                                    helpText='yikes'
                                    showIcon
                                    icon='AtSign'
                                />
                                {errors.username && <span className={styles.errorText}>{errors.username}</span>}
                            </>
                        ) : (
                        <div className={styles.displayValue}>
                            <p className={styles.displayValueTitle}>Username</p>
                            <div className={styles.displayValueContent}>
                                @{userData.username}
                            </div>
                        </div>
                        
                        )}
                    </div>


                    <div className={styles.formGroup}>
                        {isEditing ? (
                            <>
                                <Input
                                    label='Phone Number'
                                    type="tel"
                                    value={editData?.phoneNumber || ''}
                                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                    placeholder={userData.phoneNumber}
                                />
                                {errors.phoneNumber && <span className={styles.errorText}>{errors.phoneNumber}</span>}
                            </>
                        ) : (
                            <div className={styles.displayValue}>
                                <p className={styles.displayValueTitle}>Phone Number</p>
                                <div className={styles.displayValueContent}>
                                    {userData.phoneNumber || 'Not specified'}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        {isEditing ? (
                            <Textarea
                                label='Biography'
                                value={editData?.biography || ''}
                                onChange={(e) => handleInputChange('biography', e.target.value)}
                                showHelpText
                                helpText='yikes'
                            />
                        ) : (
                            <div className={styles.displayValue}>
                                <p className={styles.displayValueTitle}>Biography</p>
                                <div className={styles.displayValueContent}>
                                    {userData.biography} 
                                </div>
                            </div>
                        )}
                    </div>



                    <div className={styles.formGroup}>
                        {isEditing ? (
                            <Input
                                label='Date of birth'
                                type="date"
                                showHelpText
                                helpText='dob'
                                showIcon
                                icon='Calendar'
                                value={editData?.dateOfBirth ? new Date(editData.dateOfBirth).toISOString().split('T')[0] : ''}
                                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                            />
                        ) : (
                            <div className={styles.displayValue}>
                                <p className={styles.displayValueTitle}>Date of Birth</p>
                                <div className={styles.displayValueContent}>
                                    {userData.dateOfBirth}
                                </div>
                            </div>
                        )}
                    </div>


                    <div className={styles.formGroup}>
                        {isEditing ? (
                            <Input
                                label='Location'
                                type='text'
                                value={editData?.address || ''}
                                showHelpText
                                helpText='loca'
                                showIcon
                                icon='MapPin'
                                onChange={(e) => handleInputChange('address', e.target.value)}
                            />
                        ) : (
                            <div className={styles.displayValue}>
                                <p className={styles.displayValueTitle}>Address</p>
                                <div className={styles.displayValueContent}>
                                    {userData.address}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            {isEditing ? (
                                <Input
                                    type="text"
                                    label='Institution'
                                    value={editData?.institution || ''}
                                    onChange={(e) => handleInputChange('institution', e.target.value)}
                                />
                            ) : (
                                <div className={styles.displayValue}>
                                    <p className={styles.displayValueTitle}>Institution</p>
                                    <div className={styles.displayValueContent}>
                                        {userData.institution}
                                    </div>
                                </div>
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
                    
                </div>
            </div>
        </div>










            <div className={styles.subContainer}>
                <div>
                    <h2>Social Media Links</h2>
                    <p>Connect your social media profiles</p>
                </div>
            </div>

            <div className={styles.subContainer}>
                <div>
                    <h2>Privacy Settings</h2>
                    <p>Control who can see your information</p>
                </div>
            </div>

            <div className={styles.subContainer}>
                <div>
                    <h2>Notification Preferences</h2>
                    <p>Choose how you want to be notified</p>
                </div>
            </div>


            <div className={styles.subContainer}>
                <div>
                    <h2>Account Settings</h2>
                    <p>Manage your account security and preferences</p>
                </div>
                

                <div>
                    <Button
                        variant='outlined'
                        showIcon
                        icon='Settings'
                        label='Change Password'
                    />
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

                <div>
                    <LogoutButton />
                </div>

                <HorizontalDivider />

                <div className={styles.dangerZoneContainer}>
                    <div>
                        <h3 className={styles.dangerZoneTitle}>Danger Zone</h3>
                        <p className='muted-text'>These actions are permanent and cannot be undone.</p>
                    </div>
                    <Button
                        variant='danger'
                        label='Delete account'
                        showIcon
                        icon='Trash2'
                    />
                </div>
            </div>
        </div>

    )
}