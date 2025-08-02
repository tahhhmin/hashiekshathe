import React, { useState, useEffect } from 'react'

import styles from './ProfileSettingsTab.module.css'
import Button from '@/ui/button/Button'

import { useRouter } from 'next/navigation';

import Input from '@/ui/input/Input';
import Textarea from '@/ui/input/Textarea';
import LogoutButton from '../button/LogoutButton';
import HorizontalDivider from '../../ui/dividers/HorizontalDivider';

interface SocialMedia {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    github?: string;
    website?: string;
}

interface Organization {
    type: "team" | "department" | "none";
    name?: string;
    role?: string;
}

interface UserData {
    _id: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    username: string;
    email: string;
    avatar?: string;
    phoneNumber: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    institution: string;
    educationLevel: "SSC/O-Level" | "HSC/A-Level" | "Undergrad";
    address: string;
    organization: Organization;
    socialMedia: SocialMedia;
    isAdmin: boolean;
    isSuperAdmin: boolean;
    adminType: "departmentAdmin" | "teamAdmin" | "projectAdmin" | "none";
    isVerified: boolean;
    dateJoined: string;
    fullName: string;
}

interface UpdateData {
    firstName?: string;
    lastName?: string;
    middleName?: string;
    username?: string;
    email?: string;
    password?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    gender?: 'male' | 'female' | 'other';
    avatar?: string;
    institution?: string;
    educationLevel?: "SSC/O-Level" | "HSC/A-Level" | "Undergrad";
    address?: string;
    organization?: Organization;
    socialMedia?: SocialMedia;
}

interface FormErrors {
    [key: string]: string;
}

export default function ProfileSettingsTab() {
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [editData, setEditData] = useState<UpdateData>({});
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [successMessage, setSuccessMessage] = useState('');
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        async function fetchUserProfile() {
            try {
                const response = await fetch('/api/users/profile', { method: 'GET' });
                const data = await response.json();

                if (response.ok && data.success) {
                    setUserData(data.data);
                    // Initialize edit data with current user data
                    setEditData({
                        firstName: data.data.firstName,
                        lastName: data.data.lastName,
                        middleName: data.data.middleName || '',
                        username: data.data.username,
                        email: data.data.email,
                        phoneNumber: data.data.phoneNumber,
                        dateOfBirth: data.data.dateOfBirth,
                        gender: data.data.gender,
                        avatar: data.data.avatar || '',
                        institution: data.data.institution,
                        educationLevel: data.data.educationLevel,
                        address: data.data.address,
                        organization: data.data.organization,
                        socialMedia: data.data.socialMedia || {}
                    });
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

        if (!editData?.institution?.trim()) {
            newErrors.institution = 'Institution is required';
        }

        if (!editData?.educationLevel?.trim()) {
            newErrors.educationLevel = 'Education level is required';
        }

        if (!editData?.address?.trim()) {
            newErrors.address = 'Address is required';
        }

        if (!editData?.dateOfBirth) {
            newErrors.dateOfBirth = 'Date of birth is required';
        }

        if (!editData?.gender) {
            newErrors.gender = 'Gender is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePasswordForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!passwordData.newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (passwordData.newPassword.length < 8) {
            newErrors.newPassword = 'Password must be at least 8 characters long';
        } else if (!/[A-Za-z]/.test(passwordData.newPassword) || !/\d/.test(passwordData.newPassword)) {
            newErrors.newPassword = 'Password must contain at least one letter and one number';
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof UpdateData, value: string | Organization) => {
        setEditData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleSocialMediaChange = (platform: keyof SocialMedia, value: string) => {
        setEditData(prev => ({
            ...prev,
            socialMedia: {
                ...prev.socialMedia,
                [platform]: value
            }
        }));
    };

    const handleOrganizationChange = (field: keyof Organization, value: string) => {
        setEditData(prev => ({
            ...prev,
            organization: {
                ...prev.organization,
                [field]: value
            } as Organization
        }));
    };

    const handlePasswordChange = (field: keyof typeof passwordData, value: string) => {
        setPasswordData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        setUpdating(true);
        setErrors({});

        try {
            // Only send fields that have changed
            const changedFields: UpdateData = {};
            if (editData.firstName !== userData?.firstName) changedFields.firstName = editData.firstName;
            if (editData.lastName !== userData?.lastName) changedFields.lastName = editData.lastName;
            if (editData.middleName !== userData?.middleName) changedFields.middleName = editData.middleName;
            if (editData.username !== userData?.username) changedFields.username = editData.username;
            if (editData.email !== userData?.email) changedFields.email = editData.email;
            if (editData.phoneNumber !== userData?.phoneNumber) changedFields.phoneNumber = editData.phoneNumber;
            if (editData.dateOfBirth !== userData?.dateOfBirth) changedFields.dateOfBirth = editData.dateOfBirth;
            if (editData.gender !== userData?.gender) changedFields.gender = editData.gender;
            if (editData.avatar !== userData?.avatar) changedFields.avatar = editData.avatar;
            if (editData.institution !== userData?.institution) changedFields.institution = editData.institution;
            if (editData.educationLevel !== userData?.educationLevel) changedFields.educationLevel = editData.educationLevel;
            if (editData.address !== userData?.address) changedFields.address = editData.address;
            
            // Check if organization changed
            if (JSON.stringify(editData.organization) !== JSON.stringify(userData?.organization)) {
                changedFields.organization = editData.organization;
            }
            
            // Check if social media changed
            if (JSON.stringify(editData.socialMedia) !== JSON.stringify(userData?.socialMedia)) {
                changedFields.socialMedia = editData.socialMedia;
            }

            if (Object.keys(changedFields).length === 0) {
                setIsEditing(false);
                return;
            }

            const response = await fetch('/api/users/update-user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(changedFields),
            });

            const data = await response.json();

            if (response.ok) {
                // Refresh user data
                const profileResponse = await fetch('/api/users/profile', { method: 'GET' });
                const profileData = await profileResponse.json();
                
                if (profileResponse.ok && profileData.success) {
                    setUserData(profileData.data);
                    setEditData({
                        firstName: profileData.data.firstName,
                        lastName: profileData.data.lastName,
                        middleName: profileData.data.middleName || '',
                        username: profileData.data.username,
                        email: profileData.data.email,
                        phoneNumber: profileData.data.phoneNumber,
                        dateOfBirth: profileData.data.dateOfBirth,
                        gender: profileData.data.gender,
                        avatar: profileData.data.avatar || '',
                        institution: profileData.data.institution,
                        educationLevel: profileData.data.educationLevel,
                        address: profileData.data.address,
                        organization: profileData.data.organization,
                        socialMedia: profileData.data.socialMedia || {}
                    });
                }
                
                setIsEditing(false);
                setSuccessMessage('Profile updated successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setErrors({ general: data.error || 'Failed to update profile' });
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            setErrors({ general: 'Network error. Please try again.' });
        } finally {
            setUpdating(false);
        }
    };

    const handlePasswordUpdate = async () => {
        if (!validatePasswordForm()) {
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
                body: JSON.stringify({ password: passwordData.newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                setShowChangePassword(false);
                setPasswordData({ newPassword: '', confirmPassword: '' });
                setSuccessMessage('Password updated successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setErrors({ password: data.error || 'Failed to update password' });
            }
        } catch (err) {
            console.error('Error updating password:', err);
            setErrors({ password: 'Network error. Please try again.' });
        } finally {
            setUpdating(false);
        }
    };

    const handleCancel = () => {
        if (userData) {
            setEditData({
                firstName: userData.firstName,
                lastName: userData.lastName,
                middleName: userData.middleName || '',
                username: userData.username,
                email: userData.email,
                phoneNumber: userData.phoneNumber,
                dateOfBirth: userData.dateOfBirth,
                gender: userData.gender,
                avatar: userData.avatar || '',
                institution: userData.institution,
                educationLevel: userData.educationLevel,
                address: userData.address,
                organization: userData.organization,
                socialMedia: userData.socialMedia || {}
            });
        }
        setIsEditing(false);
        setErrors({});
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

    const formattedDateJoined = userData?.dateJoined
        ? new Date(userData.dateJoined).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
        })
        : "N/A";

    const formattedDateOfBirth = userData?.dateOfBirth
        ? new Date(userData.dateOfBirth).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
        })
        : "N/A";

    return (
        <div className={styles.container}>
            {successMessage && (
                <div className={styles.successMessage}>
                    {successMessage}
                </div>
            )}

            {errors.general && (
                <div className={styles.errorMessage}>
                    {errors.general}
                </div>
            )}

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
                    {/* Name Section */}
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
                                        helpText="Enter your first name"
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
                                        helpText="Enter your last name"
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
                                        helpText="Enter your middle name (optional)"
                                        showIcon
                                        icon="User"
                                    />
                                </div>
                            </>
                        ) : (
                            <div className={styles.displayValue}>
                                <p className={styles.displayValueTitle}>Name</p>
                                <div className={styles.displayValueContent}>
                                    {userData.fullName}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Username */}
                    <div className={styles.formGroup}>
                        {isEditing ? (
                            <>
                                <Input
                                    label='Username'
                                    type="text"
                                    value={editData?.username || ''}
                                    onChange={(e) => handleInputChange('username', e.target.value)}
                                    showHelpText
                                    helpText='Choose a unique username'
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

                    {/* Phone Number */}
                    <div className={styles.formGroup}>
                        {isEditing ? (
                            <>
                                <Input
                                    label='Phone Number'
                                    type="tel"
                                    value={editData?.phoneNumber || ''}
                                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                    placeholder="e.g., +1234567890"
                                    showHelpText
                                    helpText='Include country code'
                                    showIcon
                                    icon='Phone'
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

                    {/* Date of Birth */}
                    <div className={styles.formGroup}>
                        {isEditing ? (
                            <>
                                <Input
                                    label='Date of Birth'
                                    type="date"
                                    showHelpText
                                    helpText='Your date of birth'
                                    showIcon
                                    icon='Calendar'
                                    value={editData?.dateOfBirth ? new Date(editData.dateOfBirth).toISOString().split('T')[0] : ''}
                                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                />
                                {errors.dateOfBirth && <span className={styles.errorText}>{errors.dateOfBirth}</span>}
                            </>
                        ) : (
                            <div className={styles.displayValue}>
                                <p className={styles.displayValueTitle}>Date of Birth</p>
                                <div className={styles.displayValueContent}>
                                    {formattedDateOfBirth}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Gender */}
                    <div className={styles.formGroup}>
                        {isEditing ? (
                            <>
                                <label className={styles.label}>Gender *</label>
                                <select
                                    value={editData?.gender || ''}
                                    onChange={(e) => handleInputChange('gender', e.target.value as 'male' | 'female' | 'other')}
                                    className={styles.select}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                                {errors.gender && <span className={styles.errorText}>{errors.gender}</span>}
                            </>
                        ) : (
                            <div className={styles.displayValue}>
                                <p className={styles.displayValueTitle}>Gender</p>
                                <div className={styles.displayValueContent}>
                                    {userData.gender ? userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1) : 'Not specified'}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Address */}
                    <div className={styles.formGroup}>
                        {isEditing ? (
                            <>
                                <Input
                                    label='Address'
                                    type='text'
                                    value={editData?.address || ''}
                                    showHelpText
                                    helpText='Your current address'
                                    showIcon
                                    icon='MapPin'
                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                />
                                {errors.address && <span className={styles.errorText}>{errors.address}</span>}
                            </>
                        ) : (
                            <div className={styles.displayValue}>
                                <p className={styles.displayValueTitle}>Address</p>
                                <div className={styles.displayValueContent}>
                                    {userData.address || 'Not specified'}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Institution */}
                    <div className={styles.formGroup}>
                        {isEditing ? (
                            <>
                                <Input
                                    type="text"
                                    label='Institution'
                                    value={editData?.institution || ''}
                                    onChange={(e) => handleInputChange('institution', e.target.value)}
                                    showHelpText
                                    helpText='Your school or university'
                                    showIcon
                                    icon='Building'
                                />
                                {errors.institution && <span className={styles.errorText}>{errors.institution}</span>}
                            </>
                        ) : (
                            <div className={styles.displayValue}>
                                <p className={styles.displayValueTitle}>Institution</p>
                                <div className={styles.displayValueContent}>
                                    {userData.institution || 'Not specified'}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Education Level */}
                    <div className={styles.formGroup}>
                        {isEditing ? (
                            <>
                                <label className={styles.label}>Education Level *</label>
                                <select
                                    value={editData?.educationLevel || ''}
                                    onChange={(e) => handleInputChange('educationLevel', e.target.value as "SSC/O-Level" | "HSC/A-Level" | "Undergrad")}
                                    className={styles.select}
                                >
                                    <option value="">Select Education Level</option>
                                    <option value="SSC/O-Level">SSC/O-Level</option>
                                    <option value="HSC/A-Level">HSC/A-Level</option>
                                    <option value="Undergrad">Undergrad</option>
                                </select>
                                {errors.educationLevel && <span className={styles.errorText}>{errors.educationLevel}</span>}
                            </>
                        ) : (
                            <div className={styles.displayValue}>
                                <p className={styles.displayValueTitle}>Education Level</p>
                                <div className={styles.displayValueContent}>
                                    {userData.educationLevel || 'Not specified'}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Organization Type */}
                    <div className={styles.formGroup}>
                        {isEditing ? (
                            <>
                                <label className={styles.label}>Organization Type</label>
                                <select
                                    value={editData?.organization?.type || 'none'}
                                    onChange={(e) => handleOrganizationChange('type', e.target.value)}
                                    className={styles.select}
                                >
                                    <option value="none">None</option>
                                    <option value="team">Team</option>
                                    <option value="department">Department</option>
                                </select>
                            </>
                        ) : (
                            <div className={styles.displayValue}>
                                <p className={styles.displayValueTitle}>Organization Type</p>
                                <div className={styles.displayValueContent}>
                                    {userData.organization?.type || 'None'}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Organization Name */}
                    {editData?.organization?.type !== 'none' && (
                        <div className={styles.formGroup}>
                            {isEditing ? (
                                <Input
                                    label='Organization Name'
                                    type='text'
                                    value={editData?.organization?.name || ''}
                                    onChange={(e) => handleOrganizationChange('name', e.target.value)}
                                    showHelpText
                                    helpText='Your team or department name'
                                    showIcon
                                    icon='Users'
                                />
                            ) : (
                                <div className={styles.displayValue}>
                                    <p className={styles.displayValueTitle}>Organization Name</p>
                                    <div className={styles.displayValueContent}>
                                        {userData.organization?.name || 'Not specified'}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Organization Role */}
                    {editData?.organization?.type !== 'none' && (
                        <div className={styles.formGroup}>
                            {isEditing ? (
                                <Input
                                    label='Organization Role'
                                    type='text'
                                    value={editData?.organization?.role || ''}
                                    onChange={(e) => handleOrganizationChange('role', e.target.value)}
                                    showHelpText
                                    helpText='Your role in the organization'
                                    showIcon
                                    icon='UserCheck'
                                />
                            ) : (
                                <div className={styles.displayValue}>
                                    <p className={styles.displayValueTitle}>Organization Role</p>
                                    <div className={styles.displayValueContent}>
                                        {userData.organization?.role || 'Not specified'}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Join Date Display */}
                    <div className={styles.formGroup}>
                        <div className={styles.displayValue}>
                            <p className={styles.displayValueTitle}>Date Joined</p>
                            <div className={styles.displayValueContent}>
                                {formattedDateJoined}
                            </div>
                        </div>
                    </div>

                    {/* Verification Status Display */}
                    <div className={styles.formGroup}>
                        <div className={styles.displayValue}>
                            <p className={styles.displayValueTitle}>Account Status</p>
                            <div className={styles.displayValueContent}>
                                {userData.isVerified ? '✅ Verified' : '❌ Not Verified'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Social Media Links */}
            <div className={styles.subContainer}>
                <div>
                    <h2>Social Media Links</h2>
                    <p>Connect your social media profiles</p>
                </div>

                <div className={styles.formGrid}>
                    {Object.entries({
                        facebook: 'Facebook',
                        twitter: 'Twitter',
                        linkedin: 'LinkedIn',
                        instagram: 'Instagram',
                        github: 'GitHub',
                        website: 'Website'
                    }).map(([platform, label]) => (
                        <div key={platform} className={styles.formGroup}>
                            {isEditing ? (
                                <Input
                                    label={label}
                                    type='url'
                                    value={editData?.socialMedia?.[platform as keyof SocialMedia] || ''}
                                    onChange={(e) => handleSocialMediaChange(platform as keyof SocialMedia, e.target.value)}
                                    showHelpText
                                    helpText={`Your ${label} profile URL`}
                                    showIcon
                                    icon='Link'
                                />
                            ) : (
                                <div className={styles.displayValue}>
                                    <p className={styles.displayValueTitle}>{label}</p>
                                    <div className={styles.displayValueContent}>
                                        {userData.socialMedia?.[platform as keyof SocialMedia] ? (
                                            <a
                                                href={userData.socialMedia[platform as keyof SocialMedia]}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.socialLink}
                                            >
                                                {userData.socialMedia[platform as keyof SocialMedia]}
                                            </a>
                                        ) : (
                                            'Not provided'
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Account Settings */}
            <div className={styles.subContainer}>
                <div>
                    <h2>Account Settings</h2>
                    <p>Manage your account security and preferences</p>
                </div>

                {/* Email */}
                <div className={styles.formGroup}>
                    {isEditing ? (
                        <>
                            <Input
                                label='Email'
                                type="email"
                                value={editData?.email || ''}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                showHelpText
                                helpText='Your email address'
                                showIcon
                                icon='Mail'
                            />
                            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                        </>
                    ) : (
                        <div className={styles.displayValue}>
                            <p className={styles.displayValueTitle}>Email</p>
                            <div className={styles.displayValueContent}>
                                {userData.email}
                            </div>
                        </div>
                    )}
                </div>

                {/* Change Password */}
                <div className={styles.formGroup}>
                    <Button
                        variant='outlined'
                        showIcon
                        icon='Lock'
                        label={showChangePassword ? 'Cancel Password Change' : 'Change Password'}
                        onClick={() => setShowChangePassword(!showChangePassword)}
                    />

                    {showChangePassword && (
                        <div className={styles.passwordChangeForm}>
                            <Input
                                label='New Password'
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                                showHelpText
                                helpText='At least 8 characters with letters and numbers'
                                showIcon
                                icon='Lock'
                            />
                            {errors.newPassword && <span className={styles.errorText}>{errors.newPassword}</span>}

                            <Input
                                label='Confirm New Password'
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                                showHelpText
                                helpText='Repeat your new password'
                                showIcon
                                icon='Lock'
                            />
                            {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}

                            {errors.password && <span className={styles.errorText}>{errors.password}</span>}

                            <div className={styles.passwordButtonGroup}>
                                <Button
                                    variant='primary'
                                    onClick={handlePasswordUpdate}
                                    disabled={updating}
                                    showIcon
                                    icon='Save'
                                    label={updating ? 'Updating...' : 'Update Password'}
                                />
                                <Button
                                    variant='outlined'
                                    onClick={() => {
                                        setShowChangePassword(false);
                                        setPasswordData({ newPassword: '', confirmPassword: '' });
                                        setErrors({});
                                    }}
                                    label='Cancel'
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className={styles.formGroup}>
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
                        onClick={() => {
                            // You can implement account deletion functionality here
                            alert('Account deletion functionality would be implemented here');
                        }}
                    />
                </div>
            </div>
        </div>
    );
}