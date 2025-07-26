// app/components/AuthButton.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from '@/ui/button/Button';
import Styles from './AuthButton.module.css'

export default function AuthButton() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userType, setUserType] = useState<"user" | "organization" | null>(null);
    const [userAvatar, setUserAvatar] = useState<string | null>(null);
    const [userFirstName, setUserFirstName] = useState<string | null>(null);
    const [userLastName, setUserLastName] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function checkAuth() {
            try {
                // Attempt to fetch user profile (volunteer) using GET
                let res = await fetch("/api/users/profile", { method: "GET" });
                let data = await res.json();

                if (res.ok && data?.data) {
                    setIsLoggedIn(true);
                    setUserType("user");
                    setUserAvatar(data.data.avatar || null);
                    setUserFirstName(data.data.firstName || null);
                    setUserLastName(data.data.lastName || null);
                    return;
                }

                // If not a user, attempt to fetch admin profile using GET
                res = await fetch("/api/admins/profile", { method: "GET" });
                data = await res.json();

                if (res.ok && data?.data) {
                    setIsLoggedIn(true);
                    setUserType("organization");
                    setUserAvatar(data.data.avatar || null);
                    setUserFirstName(data.data.firstName || null);
                    setUserLastName(data.data.lastName || null);
                    return;
                }

                // If neither is found
                setIsLoggedIn(false);
                setUserType(null);
                setUserAvatar(null);
                setUserFirstName(null);
                setUserLastName(null);

            } catch (error) {
                console.error("Authentication check failed:", error);
                setIsLoggedIn(false);
                setUserType(null);
                setUserAvatar(null);
                setUserFirstName(null);
                setUserLastName(null);
            }
        }
        checkAuth();
    }, []);

    const handleClick = () => {
        if (isLoggedIn) {
            router.push("/profile");
        } else {
            router.push("/login");
        }
    };

    // Function to generate initials for placeholder
    const getInitials = () => {
        let initials = '';
        if (userFirstName) {
            initials += userFirstName.charAt(0).toUpperCase();
        }
        if (userLastName) {
            initials += userLastName.charAt(0).toUpperCase();
        }
        // Fallback if no names are available
        if (initials === '') {
            initials = userType === "user" ? "U" : (userType === "organization" ? "O" : "?");
        }
        return initials;
    };

    // Generate fallback URL for avatar errors
    const getFallbackAvatarUrl = () => {
        const initials = getInitials();
        return `https://placehold.co/40x40/cccccc/333333?text=${initials}`;
    };

    // Check if avatar is a problematic URL (like Google Drive)
    const isProblematicUrl = (url: string) => {
        return url.includes('drive.google.com') || 
               url.includes('docs.google.com') ||
               url.includes('dropbox.com/s/') ||
               url.includes('onedrive.com');
    };

    // Determine if we should show avatar or initials
    const shouldShowInitials = !userAvatar || isProblematicUrl(userAvatar);

    if (isLoggedIn) {
        if (shouldShowInitials) {
            // Show initials button for logged in users without valid avatar
            const initials = getInitials();
            return (
                <button
                    className={Styles.intitalsAvatar}
                    onClick={handleClick}
                    aria-label="User Profile"
                >
                    {initials}
                </button>
            );
        } else {
            // Show avatar with fallback to placeholder image
            return (
                <button
                    onClick={handleClick}
                    className=""
                    aria-label="User Profile"
                >
                    <Image
                        src={getFallbackAvatarUrl()}
                        alt="User Avatar"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
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