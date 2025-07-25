"use client"

// 1. Enhanced React Component with State Management
// pages/contact/page.js or components/ContactForm.js

import React, { useState } from 'react'
import Styles from './page.module.css'
import { Mail } from 'lucide-react'
import Button from '@/ui/button/Button'
import Input from '@/ui/input/Input'
import Textarea from '@/ui/input/Textarea'
import VerificationCodeInput from '@/ui/input/VerificationCodeInput'

export default function ContactPage() {
    const [formData, setFormData] = useState({
        email: '',
        subject: '',
        message: ''
    });
    
    const [verificationCode, setVerificationCode] = useState('');
    const [showVerification, setShowVerification] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSendVerificationCode = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!formData.email || !formData.subject || !formData.message) {
            setMessage('Please fill in all fields');
            setMessageType('error');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('/api/contact/inquiry/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                setShowVerification(true);
                setMessage(data.message);
                setMessageType('success');
            } else {
                setMessage(data.message);
                setMessageType('error');
            }
        } catch (error) {
            setMessage('Failed to send verification code. Please try again.');
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyAndSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!verificationCode) {
            setMessage('Please enter the verification code');
            setMessageType('error');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('/api/contact/inquiry/verify-submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    verificationCode: verificationCode
                }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage(data.message);
                setMessageType('success');
                // Reset form
                setFormData({ email: '', subject: '', message: '' });
                setVerificationCode('');
                setShowVerification(false);
            } else {
                setMessage(data.message);
                setMessageType('error');
                // If code expired, hide verification form
                if (data.message.includes('expired')) {
                    setShowVerification(false);
                }
            }
        } catch (error) {
            setMessage('Failed to verify code. Please try again.');
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = () => {
        setShowVerification(false);
        setVerificationCode('');
        const mockEvent = { preventDefault: () => {} } as React.FormEvent<HTMLFormElement>;
        handleSendVerificationCode(mockEvent);
    };

    return (
        <section className='section'>
            <div className={Styles.container}>
                <div className={Styles.formContainer}>
                    <form className={Styles.form} onSubmit={showVerification ? handleVerifyAndSubmit : handleSendVerificationCode}>
                        <div className={Styles.formHeader}>
                            <h2 className={Styles.formHeaderTitle}>Collaborate Message</h2>
                            <h3 className={Styles.formHeaderSubtitle}>
                                {showVerification ? 'Enter Verification Code' : 'Send us a message'}
                            </h3>
                        </div>

                        {message && (
                            <div className={`${Styles.message} ${messageType === 'success' ? Styles.success : Styles.error}`}>
                                {message}
                            </div>
                        )}

                        {!showVerification ? (
                            <div className={Styles.formInputs}>
                                <Input
                                    label='Email'
                                    name='email'
                                    showIcon
                                    icon='Mail'
                                    placeholder='e.g. sender@gmail.com'
                                    type='email'
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />

                                <Input
                                    label='Subject'
                                    name='subject'
                                    showIcon
                                    icon='Type'
                                    placeholder='e.g. Inquiry about services...'
                                    type='text'
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    required
                                />

                                <Textarea
                                    label='Message'
                                    name='message'
                                    placeholder='Please describe your inquiry...'
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        ) : (
                            <div className={Styles.formInputs}>
                                <VerificationCodeInput
                                    label='Verification Code'
                                    value={verificationCode}
                                    onChange={(value: string) => setVerificationCode(value)}
                                />
                                <div className={Styles.resendContainer}>
                                    <span>Didn't receive the code? </span>
                                    <button 
                                        type="button" 
                                        className={Styles.resendButton}
                                        onClick={handleResendCode}
                                        disabled={loading}
                                    >
                                        Resend Code
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className={Styles.formFooter}>
                            <Button
                                variant='primary'
                                label={
                                    loading 
                                        ? 'Processing...' 
                                        : showVerification 
                                            ? 'Submit Inquiry' 
                                            : 'Send Verification Code'
                                }
                                showIcon
                                disabled={loading}
                                type="submit"
                            />
                            
                            {showVerification && (
                                <Button
                                    variant='outlined'
                                    label='Back to Form'
                                    onClick={() => {
                                        setShowVerification(false);
                                        setVerificationCode('');
                                        setMessage('');
                                    }}
                                    type="button"
                                />
                            )}
                        </div>
                    </form>
                </div>

                <div className={Styles.sideContainer}>
                    <div className={Styles.sideContainerHeader}>
                        <Mail className={Styles.sideContainerIcon}/> 
                        <h2>Mail us</h2>
                    </div>
                    <div className={Styles.sideContainerButtonContainer}>
                        <Button
                            variant='outlined'
                            label='Mail us Via Gmail'
                            onClick={() => window.open('mailto:your-email@gmail.com', '_blank')}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
