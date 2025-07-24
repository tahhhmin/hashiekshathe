"use client";

import React, { useState, ChangeEvent, FormEvent } from 'react';

// Main App component for the signup form
export default function App() {
    // State to manage form data
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        middleName: '',
        username: '',
        email: '',
        password: '',
        phoneNumber: '',
        dateOfBirth: '', // Format as YYYY-MM-DD for date input
        gender: '',
        institution: '',
        educationLevel: '',
        address: '',
        location: '',
    });

    // State for loading and error messages
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    // Handle input changes
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setIsSuccess(false);

        // --- DEBUGGING STEP 1: Log formData before sending ---
        console.log("Sending formData:", formData);

        try {
            // Send data to the signup API endpoint
            const response = await fetch('/api/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            // --- DEBUGGING STEP 2: Log the full response from the server ---
            console.log("Server response:", data);
            console.log("Response status:", response.status);

            if (response.ok) {
                setMessage(data.message || 'Signup successful!');
                setIsSuccess(true);
                // Optionally clear form or redirect
                setFormData({
                    firstName: '', lastName: '', middleName: '', username: '', email: '',
                    password: '', phoneNumber: '', dateOfBirth: '', gender: '',
                    institution: '', educationLevel: '', address: '', location: '',
                });
            } else {
                // Display specific error message from the server if available
                setMessage(data.error || 'Signup failed. Please try again.');
                setIsSuccess(false);
            }
        } catch (error) {
            console.error('Error during signup:', error);
            setMessage('An unexpected error occurred. Please check console for details.');
            setIsSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-inter">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-2xl">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create Your Account</h2>

                {message && (
                    <div className={`p-3 mb-4 rounded-lg text-center ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Personal Details */}
                    <div className="md:col-span-2 text-lg font-semibold text-gray-700 mt-4 mb-2">Personal Details</div>
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="middleName" className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                        <input
                            type="text"
                            id="middleName"
                            name="middleName"
                            value={formData.middleName}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth <span className="text-red-500">*</span></label>
                        <input
                            type="date"
                            id="dateOfBirth"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender <span className="text-red-500">*</span></label>
                        <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Account Details */}
                    <div className="md:col-span-2 text-lg font-semibold text-gray-700 mt-6 mb-2">Account Details</div>
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="md:col-span-2">
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

                    {/* Educational & Location Details */}
                    <div className="md:col-span-2 text-lg font-semibold text-gray-700 mt-6 mb-2">Educational & Location Details</div>
                    <div>
                        <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-1">Institution <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            id="institution"
                            name="institution"
                            value={formData.institution}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="educationLevel" className="block text-sm font-medium text-gray-700 mb-1">Education Level <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            id="educationLevel"
                            name="educationLevel"
                            value={formData.educationLevel}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="md:col-span-2 mt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold shadow-md"
                        >
                            {loading ? 'Signing Up...' : 'Sign Up'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
