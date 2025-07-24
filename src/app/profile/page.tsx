// app/user/profile/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface UserData {
    firstName: string;
    lastName: string;
    middleName?: string;
    username: string;
    email: string;
    avatar?: string;
    // Add other fields you want to display
}

export default function UserProfilePage() {
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true); // Start in loading state
    const [avatarError, setAvatarError] = useState(false);
    // No 'error' state for display, as we'll redirect immediately on error

    useEffect(() => {
        async function fetchUserProfile() {
            try {
                const response = await fetch('/api/users/profile', { method: 'GET' });
                const data = await response.json();

                if (response.ok && data.success) {
                    setUserData(data.data);
                } else {
                    // If API returns an error, it means the token was invalid, user not found, etc.
                    // Immediately redirect to login.
                    console.warn(`Client-side: API denied access to /user/profile (Status: ${response.status}). Redirecting.`);
                    router.replace('/login'); // Use replace to prevent going back to profile page
                    return; // Stop further execution
                }
            } catch (err) {
                // Catch network errors or other unexpected errors
                console.error('Client-side: Network or unexpected error fetching user profile:', err);
                router.replace('/login'); // Redirect to login
                return; // Stop further execution
            } finally {
                setLoading(false); // End loading regardless of success or failure
            }
        }
        fetchUserProfile();
    }, [router]);

    // If still loading OR if no user data is found (meaning redirect is pending or failed),
    // render nothing or a minimal loading indicator.
    // The middleware should handle unauthorized access before this component even loads.
    // This acts as a client-side fallback.
    if (loading || !userData) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center font-inter">
                {/* You can show a very brief loading spinner here if desired,
                    but for immediate redirect, often nothing is preferred. */}
                <p className="text-gray-700 text-lg">Loading...</p>
            </div>
        );
    }

    // Generate fallback initials
    const firstNameInitial = userData.firstName ? userData.firstName.charAt(0).toUpperCase() : '';
    const lastNameInitial = userData.lastName ? userData.lastName.charAt(0).toUpperCase() : '';
    const fallbackUrl = `https://placehold.co/96x96/cccccc/333333?text=${firstNameInitial}${lastNameInitial}`;

    // Only render profile content if user data is successfully loaded and not in loading state
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-inter">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-md text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Profile</h2>

                {userData.avatar && !avatarError ? (
                    <div className="relative w-24 h-24 mx-auto mb-4">
                        <Image
                            src={userData.avatar}
                            alt="User Avatar"
                            width={96}
                            height={96}
                            className="rounded-full object-cover border-4 border-blue-500 shadow-md"
                            onError={() => setAvatarError(true)}
                            priority
                        />
                    </div>
                ) : userData.avatar && avatarError ? (
                    <div className="relative w-24 h-24 mx-auto mb-4">
                        <Image
                            src={fallbackUrl}
                            alt="User Avatar Fallback"
                            width={96}
                            height={96}
                            className="rounded-full object-cover border-4 border-blue-500 shadow-md"
                            priority
                        />
                    </div>
                ) : (
                    <div className="w-24 h-24 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center text-5xl font-bold mx-auto mb-4 border-4 border-blue-500 shadow-md">
                        {firstNameInitial}
                        {lastNameInitial}
                    </div>
                )}

                <p className="text-2xl font-semibold text-gray-800 mb-2">
                    {userData.firstName} {userData.middleName} {userData.lastName}
                </p>
                <p className="text-gray-600 mb-1">@{userData.username}</p>
                <p className="text-gray-600">{userData.email}</p>

                <div className="mt-6">
                    <button
                        onClick={() => router.push('/dashboard')} // Example: Go to dashboard
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 mr-2"
                    >
                        Go to Dashboard
                    </button>
                    <button
                        onClick={async () => {
                            await fetch('/api/users/logout', { method: 'GET' });
                            router.replace('/login'); // Redirect to login after logout
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}