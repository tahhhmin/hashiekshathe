// app/components/LogoutButton.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/ui/button/Button';

export default function LogoutButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        setMessage('');
        setIsError(false);

        try {
            // Send a GET request to the logout API endpoint
            const response = await fetch('/api/users/logout', {
                method: 'GET',
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message || 'Logged out successfully!');
                setIsError(false);
                // Redirect to the combined login page after a short delay
                setTimeout(() => {
                    router.push('/login'); // Adjust this path to your combined login/signup page
                }, 1000);
            } else {
                setMessage(data.error || 'Logout failed. Please try again.');
                setIsError(true);
                console.error('Logout error:', data.error);
            }
        } catch (error) {
            console.error('An unexpected error occurred during logout:', error);
            setMessage('An unexpected error occurred. Please try again.');
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <Button
                onClick={handleLogout}
                disabled={loading}
                variant='danger'
            
                label={loading ? 'Logging out...' : 'Logout'}
            />

            {message && (
                <p className={`mt-2 text-sm ${isError ? 'text-red-600' : 'text-green-600'}`}>
                    {message}
                </p>
            )}
        </div>
    );
}
