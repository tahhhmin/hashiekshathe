import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Plus, Trash2, Mail, Link as LinkIcon, Tag as TagIcon, FileText } from 'lucide-react';
import styles from './AnnouncementForm.module.css';

// Component for the Announcement Form
const AnnouncementForm = () => {
    // State variables for form data
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [description, setDescription] = useState('');
    // State variables are now arrays of strings for dynamic input fields.
    const [tags, setTags] = useState<string[]>(['']);
    const [links, setLinks] = useState<string[]>(['']);
    const [sendMailToAll, setSendMailToAll] = useState(false);

    // State variables for UI feedback
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    /**
     * Generic handler for updating a specific item in an array of strings.
     * @param index - The index of the item to update.
     * @param value - The new value for the item.
     * @param field - The name of the state field ('tags' or 'links').
     */
    const handleArrayChange = (index: number, value: string, field: 'tags' | 'links') => {
        const updatedArray = field === 'tags' ? [...tags] : [...links];
        updatedArray[index] = value;
        if (field === 'tags') {
        setTags(updatedArray);
        } else {
        setLinks(updatedArray);
        }
    };

    /**
     * Adds a new empty string to the specified array field.
     * @param field - The name of the state field ('tags' or 'links').
     */
    const addArrayItem = (field: 'tags' | 'links') => {
        if (field === 'tags') {
        setTags([...tags, '']);
        } else {
        setLinks([...links, '']);
        }
    };

    /**
     * Removes an item at a specific index from the specified array field.
     * @param index - The index of the item to remove.
     * @param field - The name of the state field ('tags' or 'links').
     */
    const removeArrayItem = (index: number, field: 'tags' | 'links') => {
        if (field === 'tags') {
        setTags(tags.filter((_, i) => i !== index));
        } else {
        setLinks(links.filter((_, i) => i !== index));
        }
    };

    // Handles the form submission.
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        // Clean data by filtering out any empty string inputs.
        const filteredTags = tags.filter(tag => tag.trim() !== '');
        const filteredLinks = links.filter(link => link.trim() !== '');

        // Basic client-side validation.
        if (!title || !description || filteredTags.length === 0) {
        setMessage('Please fill out all required fields (Title, Description, and at least one Tag).');
        setIsSuccess(false);
        setLoading(false);
        return;
        }

        const announcementData = {
        title,
        subtitle,
        description,
        tags: filteredTags,
        links: filteredLinks,
        sendMailToAll,
        };

        try {
        // Mock API call - replace with your actual endpoint
        const response = await fetch('/api/announcements/create', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(announcementData),
        });

        const result = await response.json();

        if (response.ok) {
            setMessage(result.message || 'Announcement created successfully!');
            setIsSuccess(true);
            // Clear the form after a successful submission.
            setTitle('');
            setSubtitle('');
            setDescription('');
            setTags(['']);
            setLinks(['']);
            setSendMailToAll(false);
        } else {
            setMessage(result.message || 'Failed to create announcement.');
            setIsSuccess(false);
        }
        } catch (error) {
        console.error('Submission error:', error);
        setMessage('An unexpected error occurred. Please try again.');
        setIsSuccess(false);
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
        <div className={styles.formCard}>
            <h1 className={styles.formTitle}>Create New Announcement</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
            
            {/* Basic Information Section */}
            <div className={styles.formSection}>
                <div className={styles.sectionHeader}>
                <FileText className={styles.sectionIcon} />
                <h2 className={styles.sectionTitle}>Basic Information</h2>
                </div>
                
                {/* Title Input */}
                <div className={styles.formGroup}>
                <label htmlFor="title" className={styles.label}>
                    Title <span className={styles.required}>*</span>
                </label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                    required
                    className={styles.input}
                    placeholder="E.g., Important System Update"
                    maxLength={50}
                />
                <p className={styles.charCount}>{title.length}/50</p>
                </div>

                {/* Subtitle Input */}
                <div className={styles.formGroup}>
                <label htmlFor="subtitle" className={styles.label}>
                    Subtitle
                </label>
                <input
                    type="text"
                    id="subtitle"
                    value={subtitle}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSubtitle(e.target.value)}
                    className={styles.input}
                    placeholder="E.g., Downtime scheduled for Friday"
                />
                </div>

                {/* Description Textarea */}
                <div className={styles.formGroup}>
                <label htmlFor="description" className={styles.label}>
                    Description <span className={styles.required}>*</span>
                </label>
                <textarea
                    id="description"
                    rows={4}
                    value={description}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                    required
                    className={styles.textarea}
                    placeholder="Provide a detailed description of the announcement."
                    maxLength={500}
                />
                <p className={styles.charCount}>{description.length}/500</p>
                </div>
            </div>

            {/* Tags Section */}
            <div className={styles.formSection}>
                <div className={styles.sectionHeader}>
                <TagIcon className={styles.sectionIcon} />
                <h2 className={styles.sectionTitle}>Tags</h2>
                </div>
                
                {tags.map((tag, index) => (
                <div key={index} className={styles.arrayItem}>
                    <input
                    type="text"
                    value={tag}
                    onChange={(e) => handleArrayChange(index, e.target.value, 'tags')}
                    className={styles.input}
                    placeholder="Enter tag"
                    required={tags.length === 1 && tag.trim() === ''}
                    />
                    {tags.length > 1 && (
                    <button
                        type="button"
                        onClick={() => removeArrayItem(index, 'tags')}
                        className={styles.removeButton}
                    >
                        <Trash2 className={styles.removeIcon} />
                    </button>
                    )}
                </div>
                ))}
                <button
                type="button"
                onClick={() => addArrayItem('tags')}
                className={styles.addButton}
                >
                <Plus className={styles.addIcon} />
                Add Tag
                </button>
            </div>

            {/* Links Section */}
            <div className={styles.formSection}>
                <div className={styles.sectionHeader}>
                <LinkIcon className={styles.sectionIcon} />
                <h2 className={styles.sectionTitle}>Links</h2>
                </div>
                
                {links.map((link, index) => (
                <div key={index} className={styles.arrayItem}>
                    <input
                    type="url"
                    value={link}
                    onChange={(e) => handleArrayChange(index, e.target.value, 'links')}
                    className={styles.input}
                    placeholder="Enter link URL"
                    />
                    {links.length > 1 && (
                    <button
                        type="button"
                        onClick={() => removeArrayItem(index, 'links')}
                        className={styles.removeButton}
                    >
                        <Trash2 className={styles.removeIcon} />
                    </button>
                    )}
                </div>
                ))}
                <button
                type="button"
                onClick={() => addArrayItem('links')}
                className={styles.addButton}
                >
                <Plus className={styles.addIcon} />
                Add Link
                </button>
            </div>

            {/* Settings Section */}
            <div className={styles.formSection}>
                <div className={styles.sectionHeader}>
                <Mail className={styles.sectionIcon} />
                <h2 className={styles.sectionTitle}>Notification Settings</h2>
                </div>
                <div className={styles.checkboxGroup}>
                <input
                    id="sendMailToAll"
                    name="sendMailToAll"
                    type="checkbox"
                    checked={sendMailToAll}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSendMailToAll(e.target.checked)}
                    className={styles.checkbox}
                />
                <label htmlFor="sendMailToAll" className={styles.checkboxLabel}>
                    Send a notification email to all users
                </label>
                </div>
            </div>

            {/* Submission Button */}
            <button
                type="submit"
                disabled={loading}
                className={`${styles.submitButton} ${loading ? styles.submitButtonLoading : ''}`}
            >
                {loading ? (
                <>
                    <div className={styles.spinner}></div>
                    Creating...
                </>
                ) : (
                'Create Announcement'
                )}
            </button>
            </form>

            {/* Status Message Display */}
            {message && (
            <div className={`${styles.message} ${isSuccess ? styles.successMessage : styles.errorMessage}`}>
                {message}
            </div>
            )}
        </div>
        </div>
    );
};

export default AnnouncementForm;

