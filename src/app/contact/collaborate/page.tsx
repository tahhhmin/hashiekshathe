'use client'

import React, { useState } from 'react'
import Styles from './page.module.css'
import { Mail } from 'lucide-react'
import Button from '@/ui/button/Button'
import Input from '@/ui/input/Input'
import Textarea from '@/ui/input/Textarea'
import VerificationCodeInput from '@/ui/input/VerificationCodeInput'

export default function ContactPage() {
    const [formData, setFormData] = useState({
        orgName: '',
        orgType: '',
        orgEmail: '',
        orgWebsiteLink: '',
        orgSocialLink: '',
        orgAddress: '',
        collaborationDescription: '',
        proposedTimeline: '',
        collaborationGoals: '',
        senderName: '',
        senderEmail: '',
        senderContactNumber: '',
        senderSocialLink: '',
        senderPosition: ''
    });

    const [verificationCode, setVerificationCode] = useState('');
    const [showVerification, setShowVerification] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSendVerificationCode = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const requiredFields = [
            'orgName', 'orgType', 'orgEmail', 'orgAddress',
            'collaborationDescription', 'proposedTimeline', 'collaborationGoals',
            'senderName', 'senderEmail', 'senderContactNumber', 'senderPosition'
        ];

        const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);

        if (missingFields.length > 0) {
            setMessage('Please fill in all required fields.');
            setMessageType('error');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const res = await fetch('/api/contact/collaborate/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (data.success) {
                setShowVerification(true);
                setMessage(data.message || 'Verification code sent to your email.');
                setMessageType('success');
            } else {
                setMessage(data.message || 'Failed to submit collaboration request.');
                setMessageType('error');
            }
        } catch (err) {
            setMessage('Something went wrong. Please try again.');
            setMessageType('error');
            console.error('Error sending verification code:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyAndSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!verificationCode) {
            setMessage('Please enter the verification code.');
            setMessageType('error');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const res = await fetch('/api/contact/collaborate/verify-submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.senderEmail,
                    verificationCode
                })
            });

            const data = await res.json();

            if (data.success) {
                setMessage(data.message || 'Collaboration request submitted successfully!');
                setMessageType('success');
                setFormData({
                    orgName: '',
                    orgType: '',
                    orgEmail: '',
                    orgWebsiteLink: '',
                    orgSocialLink: '',
                    orgAddress: '',
                    collaborationDescription: '',
                    proposedTimeline: '',
                    collaborationGoals: '',
                    senderName: '',
                    senderEmail: '',
                    senderContactNumber: '',
                    senderSocialLink: '',
                    senderPosition: ''
                });
                setVerificationCode('');
                setShowVerification(false);
            } else {
                setMessage(data.message || 'Verification failed.');
                setMessageType('error');
                if (data.message.includes('expired')) setShowVerification(false);
            }
        } catch (err) { // The 'err' variable is now used here
            setMessage('Verification failed. Please try again.');
            setMessageType('error');
            console.error('Error verifying code:', err); // The 'err' variable is used to log the error
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
                            <h2 className={Styles.formHeaderTitle}>Collaboration Request</h2>
                            <h3 className={Styles.formHeaderSubtitle}>
                                {showVerification ? 'Enter Verification Code' : 'Share your collaboration proposal'}
                            </h3>
                        </div>

                        {message && (
                            <div className={`${Styles.message} ${messageType === 'success' ? Styles.success : Styles.error}`}>
                                {message}
                            </div>
                        )}

                        {!showVerification ? (
                            <div className={Styles.formInputs}>
                                <h4>Organization Details</h4>
                                <Input label="Organization Name" name="orgName" value={formData.orgName} onChange={handleInputChange} required />
                                <Input label="Organization Type" name="orgType" value={formData.orgType} onChange={handleInputChange} required />
                                <Input label="Organization Email" name="orgEmail" type="email" value={formData.orgEmail} onChange={handleInputChange} required />
                                <Input label="Website Link" name="orgWebsiteLink" value={formData.orgWebsiteLink} onChange={handleInputChange} />
                                <Input label="Social Media Link" name="orgSocialLink" value={formData.orgSocialLink} onChange={handleInputChange} />
                                <Input label="Address" name="orgAddress" value={formData.orgAddress} onChange={handleInputChange} required />
                                <Textarea label="Collaboration Description" name="collaborationDescription" value={formData.collaborationDescription} onChange={handleInputChange} required />
                                <Input label="Proposed Timeline" name="proposedTimeline" value={formData.proposedTimeline} onChange={handleInputChange} required />
                                <Textarea label="Collaboration Goals" name="collaborationGoals" value={formData.collaborationGoals} onChange={handleInputChange} required />

                                <h4>Sender Information</h4>
                                <Input label="Your Name" name="senderName" value={formData.senderName} onChange={handleInputChange} required />
                                <Input label="Your Email" name="senderEmail" type="email" value={formData.senderEmail} onChange={handleInputChange} required />
                                <Input label="Contact Number" name="senderContactNumber" value={formData.senderContactNumber} onChange={handleInputChange} required />
                                <Input label="Social Media Link" name="senderSocialLink" value={formData.senderSocialLink} onChange={handleInputChange} />
                                <Input label="Your Position" name="senderPosition" value={formData.senderPosition} onChange={handleInputChange} required />
                            </div>
                        ) : (
                            <div className={Styles.formInputs}>
                                <VerificationCodeInput
                                    label="Verification Code"
                                    value={verificationCode}
                                    onChange={setVerificationCode}
                                />
                                <div className={Styles.resendContainer}>
                                    <span>Didn’t receive the code? </span>
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
                                variant="primary"
                                label={
                                    loading
                                        ? 'Processing...'
                                        : showVerification
                                            ? 'Submit Collaboration'
                                            : 'Send Verification Code'
                                }
                                showIcon
                                disabled={loading}
                                type="submit"
                            />

                            {showVerification && (
                                <Button
                                    variant="outlined"
                                    label="Back to Form"
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
                        <Mail className={Styles.sideContainerIcon} />
                        <h2>Mail us</h2>
                    </div>
                    <div className={Styles.sideContainerButtonContainer}>
                        <Button
                            variant="outlined"
                            label="Mail us via Gmail"
                            onClick={() => window.open('mailto:your-email@gmail.com', '_blank')}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
