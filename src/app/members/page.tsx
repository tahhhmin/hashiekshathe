'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
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
    const [usersByDepartment, setUsersByDepartment] = useState<Record<string, User[]>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterDepartment, setFilterDepartment] = useState<string>('all');
    const [showDeptMembersOnly, setShowDeptMembersOnly] = useState(false);
    const [departments, setDepartments] = useState<string[]>([]);

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
                // Corrected: We only need usersByDepartment for this view
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
    }, [filterDepartment, showDeptMembersOnly]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

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
                    <h1>Members</h1>
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
                            <h2 className={Styles.departmentTitle}>{department}</h2>
                            <div className={Styles.membersGrid}>
                                {deptUsers.map((user) => (
                                    <div
                                        key={user._id}
                                        className={Styles.memberCard}
                                        style={{ backgroundColor: getDepartmentColor(user.department) }}
                                    >
                                        <div className={Styles.memberHeader}>
                                            <div className={Styles.avatar}>
                                                {user.avatar ? (
                                                    <Image
                                                        src={user.avatar}
                                                        alt={`${user.firstName} ${user.lastName}`}
                                                        width={64}
                                                        height={64}
                                                        className={Styles.avatarImage}
                                                    />
                                                ) : (
                                                    <div className={Styles.avatarPlaceholder}>
                                                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className={Styles.memberInfo}>
                                            <h3 className={Styles.memberName}>
                                                {user.firstName} {user.lastName}
                                            </h3>
                                            <p className={Styles.memberRole}>{user.teamRole}</p>
                                            <p className={Styles.memberJoinDate}>Joined: {formatDate(user.dateJoined)}</p>
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