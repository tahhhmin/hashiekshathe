// app/login-combined/page.tsx
'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Styles from './page.module.css';
import Button from '@/ui/button/Button';
import Input from '@/ui/input/Input';
import VerificationCodeInput from '@/ui/input/VerificationCodeInput';
import Link from 'next/link';

export default function CombinedLoginPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        identifier: '', // Email or username
        password: '',
        loginVerifyToken: '', // Code input
    });

    const [currentStep, setCurrentStep] = useState<'login' | 'verify'>('login');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setIsSuccess(false);

        if (currentStep === 'login') {
            const loginPayload = {
                identifier: formData.identifier,
                password: formData.password,
            };

            console.log('DEBUG: Sending login payload:', loginPayload);

            try {
                const response = await fetch('/api/users/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(loginPayload),
                });

                const data = await response.json();
                console.log('DEBUG: Login API response:', data);

                if (response.ok && data.requiresVerification) {
                    setMessage(data.message || 'Login successful. Verification code sent.');
                    setIsSuccess(true);
                    setCurrentStep('verify');
                } else {
                    setMessage(data.error || 'Login failed. Check credentials.');
                }
            } catch (error) {
                console.error('ERROR during login:', error);
                setMessage('Unexpected login error. Please try again.');
            } finally {
                setLoading(false);
            }
        } else if (currentStep === 'verify') {
            const verifyPayload = {
                identifier: formData.identifier,
                loginVerifyToken: formData.loginVerifyToken,
            };

            console.log('DEBUG: Sending verification payload:', verifyPayload);

            try {
                const response = await fetch('/api/users/login-verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(verifyPayload),
                });

                const data = await response.json();
                console.log('DEBUG: Verify API response:', data);

                if (response.ok) {
                    setMessage(data.message || 'Verification successful!');
                    setIsSuccess(true);
                    setTimeout(() => router.push('/profile'), 1500);
                } else {
                    setMessage(data.error || 'Verification failed. Check the code.');
                }
            } catch (error) {
                console.error('ERROR during verification:', error);
                setMessage('Unexpected verification error. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className={Styles.page}>
        <form onSubmit={handleSubmit} className={Styles.form}>

            <div className={Styles.formHeader}>
                    <div><h2 className={Styles.formTitle}>
                        {currentStep === 'login' ? 'Login' : 'Verify Your Login'}

                    </h2>

                                {currentStep === 'verify' && (
                            <p>A verification code has been sent to your email. Enter it below.</p>
                        )}

                        {message && (
                            <div className={isSuccess ? Styles.successMsg : Styles.errorMsg}>
                                {message}
                            </div>
                        )}
                        </div>
                    <div className={Styles.headerButton}>
                        <Button
                            variant='icon'
                            showIcon
                            icon='X'
                            onClick={() => router.back()}
                        />
                    </div>
                </div>






            {currentStep === 'login' && (
                <div className={Styles.inputGroup}>
                    <Input
                        label="Email or Username"
                        showIcon
                        icon="User"
                        type="text"
                        placeholder="example@gmail.com"
                        name="identifier"
                        value={formData.identifier}
                        onChange={handleChange}
                    />

                    <Input
                        label="Password"
                        showIcon
                        icon="Lock"
                        type="password"
                        placeholder="Enter password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
            )}

            {currentStep === 'verify' && (
                <>
                    <Input
                        label="Identifier"
                        type="text"
                        name="identifier"
                        value={formData.identifier}
                        disabled
                        showIcon
                        icon="User"
                    />

                    <VerificationCodeInput
                        label="Verification Code *"
                        value={formData.loginVerifyToken}
                        onChange={(value) => {
                            setFormData(prev => ({
                                ...prev,
                                loginVerifyToken: value,
                            }));
                        }}
                        length={6}
                        autoFocus={true}
                        helpText="Enter the 6-digit verification code"
                    />

                    <p>Didn&apos;t get the code? Try logging in again to resend.</p>
                </>
            )}

            <div className={Styles.formButtonContainer}>
                <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                    label={
                        loading
                            ? currentStep === 'login'
                                ? 'Logging In...'
                                : 'Verifying...'
                            : currentStep === 'login'
                            ? 'Login'
                            : 'Verify Code'
                    }
                    showIcon
                />
            </div>

            {currentStep === 'login' && (
                <div className={Styles.formFooter}>
                    <p>Don&apos;t have an account?</p>
                        <Link className={Styles.link} href="/volunteer/register"><p>Register</p></Link>
                </div>
            )}
        </form>
        </div>
    );
}
