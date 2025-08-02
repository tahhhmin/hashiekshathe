// app/components/AuthButton.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from '@/ui/button/Button';
import Styles from './AuthButton.module.css'

interface UserData {
    firstName: string;
    lastName: string;
    middleName?: string;
    avatar?: string;
    fullName?: string;
    isAdmin: boolean;
    isSuperAdmin: boolean;
    adminType: "recordsAdmin" | "volunteerAdmin" | "projectAdmin" | "educationAdmin" | "contactAdmin" | "announcementAdmin" | "none";
    organization: {
        type: "team" | "department" | "none";
        name?: string;
        role?: string;
    };
}

export default function AuthButton() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function checkAuth() {
            setIsLoading(true);
            try {
                // Since the model shows a unified User schema, we should check a single endpoint
                // Assuming you have a unified profile endpoint or adjust based on your API structure
                const res = await fetch("/api/users/profile", { 
                    method: "GET",
                    credentials: 'include' // Ensure cookies are sent
                });
                
                if (res.ok) {
                    const data = await res.json();
                    if (data?.data) {
                        setIsLoggedIn(true);
                        setUserData(data.data);
                        return;
                    }
                }

                // Fallback: try the existing endpoints if unified endpoint doesn't exist
                let userRes = await fetch("/api/users/profile", { method: "GET" });
                if (userRes.ok) {
                    const userData = await userRes.json();
                    if (userData?.data) {
                        setIsLoggedIn(true);
                        setUserData(userData.data);
                        return;
                    }
                }

                // If no valid session found
                setIsLoggedIn(false);
                setUserData(null);

            } catch (error) {
                console.error("Authentication check failed:", error);
                setIsLoggedIn(false);
                setUserData(null);
            } finally {
                setIsLoading(false);
            }
        }
        
        checkAuth();
    }, []);

    const handleClick = () => {
            router.push("/profile");

    };

    // Function to generate initials for placeholder
    const getInitials = (): string => {
        if (!userData) return "?";
        
        let initials = '';
        if (userData.firstName) {
            initials += userData.firstName.charAt(0).toUpperCase();
        }
        if (userData.lastName) {
            initials += userData.lastName.charAt(0).toUpperCase();
        }
        
        // Fallback if no names are available
        if (initials === '') {
            if (userData.isAdmin || userData.isSuperAdmin) {
                initials = "A"; // Admin
            } else {
                initials = "U"; // User
            }
        }
        
        return initials;
    };

    // Generate fallback URL for avatar errors
    const getFallbackAvatarUrl = (): string => {
        const initials = getInitials();
        // Different colors for different user types
        let bgColor = "cccccc";
        let textColor = "333333";
        
        if (userData?.isSuperAdmin) {
            bgColor = "dc2626"; // Red for super admin
            textColor = "ffffff";
        } else if (userData?.isAdmin) {
            bgColor = "2563eb"; // Blue for admin
            textColor = "ffffff";
        } else {
            bgColor = "10b981"; // Green for regular users
            textColor = "ffffff";
        }
        
        return `https://placehold.co/40x40/${bgColor}/${textColor}?text=${initials}`;
    };

    // Check if avatar is a problematic URL
    const isProblematicUrl = (url: string): boolean => {
        return url.includes('drive.google.com') || 
               url.includes('docs.google.com') ||
               url.includes('dropbox.com/s/') ||
               url.includes('onedrive.com') ||
               url.trim() === '';
    };

    // Get user display name
    const getDisplayName = (): string => {
        if (!userData) return '';
        
        // Use fullName if available (from virtual), otherwise construct it
        if (userData.fullName) {
            return userData.fullName;
        }
        
        let name = userData.firstName;
        if (userData.middleName) {
            name += ` ${userData.middleName}`;
        }
        name += ` ${userData.lastName}`;
        
        return name.trim();
    };

    // Get user role/title for tooltip
    const getUserRole = (): string => {
        if (!userData) return '';
        
        if (userData.isSuperAdmin) {
            return 'Super Administrator';
        } else if (userData.isAdmin) {
            const adminTypeMap = {
                recordsAdmin: 'Records Administrator',
                volunteerAdmin: 'Volunteer Administrator', 
                projectAdmin: 'Project Administrator',
                educationAdmin: 'Education Administrator',
                contactAdmin: 'Contact Administrator',
                announcementAdmin: 'Announcement Administrator',
                none: 'Administrator'
            };
            return adminTypeMap[userData.adminType] || 'Administrator';
        } else if (userData.organization.type !== 'none' && userData.organization.name) {
            const orgType = userData.organization.type === 'team' ? 'Team' : 'Department';
            return `${orgType}: ${userData.organization.name}`;
        }
        
        return 'Volunteer';
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
        );
    }

    // Determine if we should show avatar or initials
    const shouldShowInitials = !userData?.avatar || isProblematicUrl(userData.avatar);

    if (isLoggedIn && userData) {
        const userRole = getUserRole();
        const displayName = getDisplayName();
        
        if (shouldShowInitials) {
            // Show initials button for logged in users without valid avatar
            const initials = getInitials();
            return (
                <button
                    className={Styles.intitalsAvatar}
                    onClick={handleClick}
                    aria-label={`${displayName} - ${userRole}`}
                    title={`${displayName} - ${userRole}`}
                >
                    {initials}
                </button>
            );
        } else {
            // Show avatar with fallback to placeholder image
            return (
                <button
                    onClick={handleClick}
                    className="rounded-full overflow-hidden w-10 h-10 hover:ring-2 hover:ring-blue-300 transition-all"
                    aria-label={`${displayName} - ${userRole}`}
                    title={`${displayName} - ${userRole}`}
                >
                    <Image
                        src={userData.avatar || getFallbackAvatarUrl()}
                        alt={`${displayName}'s Avatar`}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            // Fallback to placeholder on error
                            (e.target as HTMLImageElement).src = getFallbackAvatarUrl();
                        }}
                    />
                </button>
            );
        }
    } else {
        // If not logged in, show "Login" button
        return (
            <Button
                onClick={handleClick}
                variant="outlined"
                label="Login"
                showIcon={false}
            />
        );
    }
}