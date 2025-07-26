'use client';

import Styles from './SignupTab.module.css';

import React, { useState } from 'react';
import RegisterList from '@/components/dashboard/volunteer/RegisterList'; // Adjust path if needed
import UserSignupForm from '@/components/dashboard/volunteer/UserSignupForm'; // Adjust path if needed

// Define a type for the prefill data, ensuring it matches the expected structure for form fields
type PrefillDataType = {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  username?: string;
  email?: string;
  password?: string; // Although password shouldn't be pre-filled from a list
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  institution?: string;
  educationLevel?: string;
  address?: string;
  location?: string;
};

export default function SignupTab() {
  // State to hold the data that will pre-fill the UserSignupForm
  const [prefillData, setPrefillData] = useState<PrefillDataType | undefined>(undefined);

  return (
    <div className={Styles.container}>
      {/* RegisterList component. When 'onFill' is called, it updates 'prefillData' state */}
      <RegisterList onFill={setPrefillData} />
      {/* UserSignupForm component receives 'prefillData' to populate its fields */}
      <UserSignupForm prefill={prefillData} />
    </div>
  );
}