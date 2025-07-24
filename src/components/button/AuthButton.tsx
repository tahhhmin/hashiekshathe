// app/components/AuthButton.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from '@/ui/button/Button'; // Assuming this Button component is flexible or we'll bypass it

export default function AuthButton() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userType, setUserType] = useState<"user" | "organization" | null>(null);
    const [userAvatar, setUserAvatar] = useState<string | null>(null); // State for avatar URL
    const [userFirstName, setUserFirstName] = useState<string | null>(null); // State for user's first name
    const [userLastName, setUserLastName] = useState<string | null>(null); // State for user's last name
    const [avatarError, setAvatarError] = useState(false); // State to handle avatar loading errors
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
                    setUserLastName(data.data.lastName || null); // Store last name
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
                    setUserLastName(data.data.lastName || null); // Store last name for organization admin
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
            // Always redirect to the user profile page as requested
            router.push("/profile");
        } else {
            // Redirect to your combined login/signup page
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

    // Conditional rendering based on login status and avatar availability
    if (isLoggedIn && userAvatar && !avatarError) {
        // Render an avatar button if logged in and avatar is available
        return (
            <button
                onClick={handleClick}
                className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500 hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center bg-gray-200 text-gray-700 text-sm font-semibold"
                aria-label="User Profile"
            >
                <Image
                    src={userAvatar}
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                    onError={() => {
                        setAvatarError(true);
                        console.error("Failed to load avatar image:", userAvatar);
                    }}
                />
            </button>
        );
    } else if (isLoggedIn && userAvatar && avatarError) {
        // If avatar failed to load, show fallback image
        return (
            <button
                onClick={handleClick}
                className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500 hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center bg-gray-200 text-gray-700 text-sm font-semibold"
                aria-label="User Profile"
            >
                <Image
                    src={getFallbackAvatarUrl()}
                    alt="User Avatar Fallback"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                />
            </button>
        );
    } else if (isLoggedIn && !userAvatar) {
        // If logged in but no avatar is set, show a generic initial button
        const initials = getInitials();
        return (
            <button
                onClick={handleClick}
                className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500 hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center bg-blue-200 text-blue-800 text-lg font-semibold"
                aria-label="User Profile"
            >
                {initials}
            </button>
        );
    } else {
        // If not logged in, show "Login" button
        return (
            <Button
                onClick={handleClick}
                variant="outlined"
                label="Login"
                showIcon={false} // No icon for login button, or whatever is appropriate for your Button component
            />
        );
    }
}