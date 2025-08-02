'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image'; // Import Next.js Image component
import Styles from './page.module.css';

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    username: string;
    email: string;
    avatar?: string;
    phoneNumber: string;
    dateOfBirth: string;
    gender: string;
    institution: string;
    educationLevel: string;
    address: string;
    location: string;
    teamName: string;
    teamRole: string;
    isDeptMember: boolean;
    department?: string;
    dateJoined: string;
    isVerified: boolean;
}

interface ApiResponse {
    success: boolean;
    data: {
        users: User[];
        usersByDepartment: Record<string, User[]>;
        totalUsers: number;
        departments: string[];
    };
}

export default function MembersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [usersByDepartment, setUsersByDepartment] = useState<Record<string, User[]>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterDepartment, setFilterDepartment] = useState<string>('all');
    const [showDeptMembersOnly, setShowDeptMembersOnly] = useState(false);
    const [departments, setDepartments] = useState<string[]>([]);

    // Memoize the fetchUsers function to prevent unnecessary re-renders of the useEffect hook.
    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                sortBy: 'department',
                ...(filterDepartment !== 'all' && { department: filterDepartment }),
                ...(showDeptMembersOnly && { isDeptMember: 'true' })
            });

            const response = await fetch(`/api/users/get?${params}`);
            const data: ApiResponse = await response.json();

            if (data.success) {
                setUsers(data.data.users);
                setUsersByDepartment(data.data.usersByDepartment);
                setDepartments(data.data.departments);
            } else {
                setError('Failed to fetch users');
            }
        } catch (err) {
            setError('An error occurred while fetching users');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    }, [filterDepartment, showDeptMembersOnly]); // This is the complete dependency array

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]); // The dependency is now the memoized fetchUsers function

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getDepartmentColor = (department?: string) => {
        const colors: Record<string, string> = {
            'Administration': '#e3f2fd',
            'Human Resources': '#f3e5f5',
            'other': '#fff3e0',
            'No Department': '#f5f5f5'
        };
        return colors[department || 'No Department'] || '#f5f5f5';
    };

    if (loading) {
        return (
            <section className='section'>
                <div className={Styles.container}>
                    <div className={Styles.loading}>Loading members...</div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className='section'>
                <div className={Styles.container}>
                    <div className={Styles.error}>{error}</div>
                </div>
            </section>
        );
    }

    return (
        <section className='section'>
            <div className={Styles.container}>
                <div className={Styles.header}>
                    <h1>Members ({users.length})</h1>
                    
                    <div className={Styles.filters}>
                        <select 
                            value={filterDepartment} 
                            onChange={(e) => setFilterDepartment(e.target.value)}
                            className={Styles.select}
                        >
                            <option value="all">All Departments</option>
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>

                        <label className={Styles.checkbox}>
                            <input
                                type="checkbox"
                                checked={showDeptMembersOnly}
                                onChange={(e) => setShowDeptMembersOnly(e.target.checked)}
                            />
                            Show Department Members Only
                        </label>
                    </div>
                </div>

                <div className={Styles.departmentsList}>
                    {Object.entries(usersByDepartment).map(([department, deptUsers]) => (
                        <div key={department} className={Styles.departmentSection}>
                            <div 
                                className={Styles.departmentHeader}
                                style={{ backgroundColor: getDepartmentColor(department) }}
                            >
                                <h2>{department}</h2>
                                <span className={Styles.memberCount}>
                                    {deptUsers.length} member{deptUsers.length !== 1 ? 's' : ''}
                                </span>
                            </div>

                            <div className={Styles.membersGrid}>
                                {deptUsers.map((user) => (
                                    <div key={user._id} className={Styles.memberCard}>
                                        <div className={Styles.memberHeader}>
                                            <div className={Styles.avatar}>
                                                {user.avatar ? (
                                                    <Image
                                                        src={user.avatar}
                                                        alt={`${user.firstName} ${user.lastName}`}
                                                        width={64}
                                                        height={64}
                                                        className={Styles.avatarImage} // Add a new class for styling the image
                                                    />
                                                ) : (
                                                    <div className={Styles.avatarPlaceholder}>
                                                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className={Styles.memberInfo}>
                                                <h3>
                                                    {user.firstName} {user.middleName} {user.lastName}
                                                    {user.isDeptMember && (
                                                        <span className={Styles.deptBadge}>DEPT</span>
                                                    )}
                                                </h3>
                                                <p className={Styles.username}>@{user.username}</p>
                                            </div>
                                        </div>

                                        <div className={Styles.memberDetails}>
                                            <div className={Styles.detailRow}>
                                                <span className={Styles.label}>Email:</span>
                                                <span>{user.email}</span>
                                            </div>
                                            <div className={Styles.detailRow}>
                                                <span className={Styles.label}>Phone:</span>
                                                <span>{user.phoneNumber}</span>
                                            </div>
                                            <div className={Styles.detailRow}>
                                                <span className={Styles.label}>Institution:</span>
                                                <span>{user.institution}</span>
                                            </div>
                                            <div className={Styles.detailRow}>
                                                <span className={Styles.label}>Team:</span>
                                                <span>{user.teamName} ({user.teamRole})</span>
                                            </div>
                                            <div className={Styles.detailRow}>
                                                <span className={Styles.label}>Location:</span>
                                                <span>{user.location}</span>
                                            </div>
                                            <div className={Styles.detailRow}>
                                                <span className={Styles.label}>Joined:</span>
                                                <span>{formatDate(user.dateJoined)}</span>
                                            </div>
                                            <div className={Styles.statusRow}>
                                                <span className={`${Styles.status} ${user.isVerified ? Styles.verified : Styles.unverified}`}>
                                                    {user.isVerified ? '✓ Verified' : '⚠ Unverified'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
