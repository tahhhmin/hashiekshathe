// app/login-combined/page.tsx (or wherever you want this component)
"use client";

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function CombinedLoginPage() {
    const router = useRouter();

    // State to manage form data for both login and verification
    const [formData, setFormData] = useState({
        identifier: '', // Can be email or username
        password: '',
        loginVerifyToken: '', // For the verification step
    });

    // State to control which part of the form is currently displayed
    const [currentStep, setCurrentStep] = useState<'login' | 'verify'>('login');

    // State for loading, message, and success status
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    // Handle input changes for all fields
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission based on the current step
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setIsSuccess(false);

        if (currentStep === 'login') {
            // --- Step 1: Handle initial login (send identifier and password) ---
            const loginPayload = {
                identifier: formData.identifier,
                password: formData.password,
            };
            console.log("DEBUG: Sending login payload:", loginPayload); // Log payload

            try {
                const response = await fetch('/api/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(loginPayload),
                });

                const data = await response.json();

                console.log("DEBUG: Login API response:", data);
                console.log("DEBUG: Login API status:", response.status);

                if (response.ok && data.requiresVerification) {
                    setMessage(data.message || 'Login successful. A verification code has been sent to your email. Please enter it below.');
                    setIsSuccess(true);
                    setCurrentStep('verify'); // Move to the verification step
                } else {
                    setMessage(data.error || 'Login failed. Please check your credentials.');
                    setIsSuccess(false);
                }
            } catch (error) {
                console.error('ERROR: During initial login:', error);
                setMessage('An unexpected error occurred during login. Please try again later.');
                setIsSuccess(false);
            } finally {
                setLoading(false);
            }
        } else if (currentStep === 'verify') {
            // --- Step 2: Handle verification (send identifier and code) ---
            const verifyPayload = {
                identifier: formData.identifier,
                loginVerifyToken: formData.loginVerifyToken,
            };
            console.log("DEBUG: Sending verification payload:", verifyPayload); // Log payload

            try {
                const response = await fetch('/api/users/login-verify', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(verifyPayload),
                });

                const data = await response.json();

                console.log("DEBUG: Verify API response:", data);
                console.log("DEBUG: Verify API status:", response.status);

                if (response.ok) {
                    setMessage(data.message || 'Verification successful! You are now logged in.');
                    setIsSuccess(true);
                    // Redirect to dashboard or home page upon successful verification
                    setTimeout(() => {
                        router.push('/profile'); // Redirect to the new profile page
                    }, 1500); // Give user a moment to read success message
                } else {
                    setMessage(data.error || 'Verification failed. Please check the code and try again.');
                    setIsSuccess(false);
                }
            } catch (error) {
                console.error('ERROR: During verification:', error);
                setMessage('An unexpected error occurred during verification. Please try again later.');
                setIsSuccess(false);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-inter">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    {currentStep === 'login' ? 'Login to Your Account' : 'Verify Your Login'}
                </h2>
                {currentStep === 'verify' && (
                    <p className="text-center text-gray-600 mb-4">
                        A verification code has been sent to your email. Please enter it below to complete your login.
                    </p>
                )}

                {message && (
                    <div className={`p-3 mb-4 rounded-lg text-center ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {currentStep === 'login' && (
                        <>
                            <div>
                                <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-1">Email or Username <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    id="identifier"
                                    name="identifier"
                                    value={formData.identifier}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </>
                    )}

                    {currentStep === 'verify' && (
                        <>
                            <div>
                                <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-1">Email or Username</label>
                                <input
                                    type="text"
                                    id="identifier"
                                    name="identifier"
                                    value={formData.identifier}
                                    // Disable the identifier input in verification step as it's already provided
                                    disabled
                                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Your email or username"
                                />
                            </div>
                            <div>
                                <label htmlFor="loginVerifyToken" className="block text-sm font-medium text-gray-700 mb-1">Verification Code <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    id="loginVerifyToken"
                                    name="loginVerifyToken"
                                    value={formData.loginVerifyToken}
                                    onChange={handleChange}
                                    required
                                    maxLength={6} // Assuming a 6-digit code
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-center text-xl tracking-widest"
                                    placeholder="______"
                                />
                            </div>
                            <p className="mt-4 text-center text-gray-600 text-sm">
                                Didn&apos;t receive the code? Try logging in again to resend.
                            </p>
                        </>
                    )}

                    <div className="mt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold shadow-md"
                        >
                            {loading ? (currentStep === 'login' ? 'Logging In...' : 'Verifying...') : (currentStep === 'login' ? 'Login' : 'Verify Code')}
                        </button>
                    </div>
                </form>

                {currentStep === 'login' && (
                    <p className="mt-4 text-center text-gray-600">
                        Don&apos;t have an account?{' '}
                        <button
                            onClick={() => router.push('/login-signup')} // Adjust this path if your signup is separate
                            className="text-blue-600 hover:underline font-medium"
                        >
                            Sign Up
                        </button>
                    </p>
                )}
            </div>
        </div>
    );
}