'use client';

import React, { useState, useEffect } from 'react';
import Styles from './UserSignupForm.module.css';
import Input from '@/ui/input/Input'; // Assuming you have an Input component
import Button from '@/ui/button/Button'; // Assuming you have a Button component

// Define the structure for the form data
type FormData = {
  firstName: string;
  lastName: string;
  middleName: string;
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  institution: string;
  educationLevel: string;
  address: string;
  location: string;
};

// Define props for pre-filling the form
type Props = {
  prefill?: Partial<FormData>; // Partial means all properties are optional
};

export default function UserSignupForm({ prefill }: Props) {
  // Initialize form data with empty strings or pre-filled values if available
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    middleName: '',
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    institution: '',
    educationLevel: '',
    address: '',
    location: '',
  });

  const [loading, setLoading] = useState(false); // State for loading indicator during submission
  const [message, setMessage] = useState(''); // State for success or error messages
  const [isSuccess, setIsSuccess] = useState(false); // State to determine message styling

  // Effect to update form data when prefill prop changes
  useEffect(() => {
    if (prefill) {
      setFormData((prev) => ({
        ...prev, // Keep existing data
        ...prefill, // Overlay with prefill data
      }));
    }
  }, [prefill]); // Dependency array: run this effect when 'prefill' changes

  // Handler for input changes, updates formData state
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Update the specific field
    }));
  };

  // Handler for form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true); // Set loading to true
    setMessage(''); // Clear previous messages
    setIsSuccess(false); // Reset success status

    try {
      const response = await fetch('/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Send form data as JSON
      });

      const data = await response.json(); // Parse JSON response

      if (response.ok) {
        setMessage(data.message || 'Signup successful!');
        setIsSuccess(true);
        // Clear the form after successful submission
        setFormData({
          firstName: '',
          lastName: '',
          middleName: '',
          username: '',
          email: '',
          password: '',
          phoneNumber: '',
          dateOfBirth: '',
          gender: '',
          institution: '',
          educationLevel: '',
          address: '',
          location: '',
        });
      } else {
        setMessage(data.error || 'Signup failed. Please try again.');
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      setMessage('Unexpected error occurred.');
    } finally {
      setLoading(false); // Always reset loading state
    }
  };

  return (
    <form onSubmit={handleSubmit} className={Styles.form}>
      <h2>Create a volunteer account</h2>

      {message && (
        <div className={isSuccess ? Styles.success : Styles.error}>
          {message}
        </div>
      )}

      {/* Input Fields */}
      <Input
        type="text"
        label="First Name"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        required
        placeholder="First name"
        showIcon
        icon="User" // Assuming 'User' is a valid icon prop for your Input component
      />

      <Input
        type="text"
        label="Last Name"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        required
        placeholder="Last name"
        showIcon
        icon="User"
      />

      <Input
        type="text"
        label="Middle Name"
        name="middleName"
        value={formData.middleName}
        onChange={handleChange}
        placeholder="Middle name"
        showIcon
        icon="User"
      />

      <Input
        label="Date of birth"
        type="date"
        placeholder="YYYY-MM-DD"
        showIcon
        icon="Calendar"
        name="dateOfBirth"
        value={formData.dateOfBirth}
        onChange={handleChange}
        required
      />

      {/* Gender Select Dropdown */}
      <select
        id="gender"
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        required
        className={Styles.select} // Apply custom styles if needed
      >
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>

      <Input
        label="Phone Number"
        icon="Phone"
        showIcon
        placeholder="+880..."
        type="tel"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        required
      />

      <Input
        label="Username"
        icon="AtSign"
        type="text"
        showIcon
        placeholder="username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        required
      />

      <Input
        label="Email"
        icon="Mail"
        showIcon
        placeholder="email@example.com"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <Input
        label="Password"
        icon="Lock"
        showIcon
        placeholder="Your password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <Input
        label="Institution"
        icon="School"
        showIcon
        type="text"
        name="institution"
        value={formData.institution}
        onChange={handleChange}
      />

      <Input
        label="Education Level"
        icon="Book"
        showIcon
        type="text"
        name="educationLevel"
        value={formData.educationLevel}
        onChange={handleChange}
      />

      <Input
        label="Address"
        icon="MapPin"
        showIcon
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
      />

      <Input
        label="Location"
        icon="Map"
        showIcon
        type="text"
        name="location"
        value={formData.location}
        onChange={handleChange}
      />

      <Button
        type="submit"
        label={loading ? 'Submitting...' : 'Submit'}
        disabled={loading} // Disable button when submitting
      />
    </form>
  );
}