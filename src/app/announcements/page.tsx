'use client';

import { useState, useEffect, useMemo } from 'react';
import Styles from './page.module.css';
import Input from '@/ui/input/Input';
import { Funnel } from 'lucide-react';
import Button from '@/ui/button/Button';
import Link from 'next/link';
import IndeterminateProgressBar from '@/ui/Progress/FreeProgressBar';

// Define the interface for an announcement
interface Announcement {
    _id: string;
    title: string;
    subtitle: string;
    links: string[];
    description: string;
    tags: string[];
    createdAt: string;
}

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

const AnnouncementsPage = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    // Search state
    const [titleSearch, setTitleSearch] = useState<string>('');
    const [tagSearch, setTagSearch] = useState<string>('');

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await fetch('/api/announcements/get');
                if (!response.ok) {
                    throw new Error('Failed to fetch announcements');
                }
                const data = await response.json();
                setAnnouncements(data);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, []);

    // Filter announcements based on search terms
    const filteredAnnouncements = useMemo(() => {
        return announcements.filter((announcement) => {
            const titleMatch = titleSearch === '' || 
                announcement.title.toLowerCase().includes(titleSearch.toLowerCase()) ||
                announcement.subtitle.toLowerCase().includes(titleSearch.toLowerCase()) ||
                announcement.description.toLowerCase().includes(titleSearch.toLowerCase());

            const tagMatch = tagSearch === '' || 
                announcement.tags.some(tag => 
                    tag.toLowerCase().includes(tagSearch.toLowerCase())
                );

            return titleMatch && tagMatch;
        });
    }, [announcements, titleSearch, tagSearch]);

    // Handle search input changes
    const handleTitleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitleSearch(e.target.value);
    };

    const handleTagSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTagSearch(e.target.value);
    };

    // Clear all filters
    const clearFilters = () => {
        setTitleSearch('');
        setTagSearch('');
    };

    // Render loading state
    if (loading) {
        return <div className={Styles.sectionLoading}>
            <IndeterminateProgressBar/>
        </div>;
    }

    // Render error state
    if (error) {
        return <div className="section">Error: {error}</div>;
    }

    return (
        <section className='section'>
            <div className={Styles.container}>
                <div className={Styles.announcementContainer}>
                    {filteredAnnouncements.length > 0 ? (
                        filteredAnnouncements.map((announcement) => (
                            <div key={announcement._id} className={Styles.announcementCard}>
                                <div className={Styles.announcementCardHeader}>
                                    <div className={Styles.announcementCardtitleContainer}>
                                        <h2 className={Styles.announcementTitle}>{announcement.title}</h2>
                                        {announcement.subtitle && (
                                            <h3 className={Styles.announcementSubtitle}>{announcement.subtitle}</h3>
                                        )}
                                    </div>
                                    <div className={Styles.dateContainer}>
                                        {formatDate(announcement.createdAt)}
                                    </div>
                                </div>

                                <div className={Styles.announcementCardContent}>
                                    <p>{announcement.description}</p>
                                </div>

                                <div className={Styles.announcementCardFooter}>
                                    {announcement.tags.length > 0 && (
                                        <div className={Styles.announcementCardFooterTagContainer}>
                                            {announcement.tags.map((tag, index) => (
                                                <div key={index} className={Styles.announcementTag}>
                                                    {tag}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {announcement.links.length > 0 && (
                                        <div className={Styles.announcementCardFooterButtonContainer}>
                                            {announcement.links.map((link, index) => (
                                                <Link key={index} href={link} passHref>
                                                    <Button
                                                        variant={index === 0 ? 'primary' : 'outlined'}
                                                        label={`Link ${index + 1}`}
                                                        showIcon
                                                        icon='Link'
                                                    />
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={Styles.noAnnouncements}>
                            {announcements.length === 0 
                                ? 'No announcements found.' 
                                : `No announcements match your search criteria. Showing 0 of ${announcements.length} announcements.`
                            }
                        </div>
                    )}
                </div>
                <div className={Styles.optionContainer}>
                    <div className={Styles.optionContainerHeader}>
                        <Funnel className={Styles.optionContainerIcon} /> <h2>Filter</h2>
                    </div>
                    <div className={Styles.filterGroup}>
                        <Input 
                            showIcon 
                            icon='Search' 
                            placeholder='Search by title' 
                            value={titleSearch}
                            onChange={handleTitleSearchChange}
                        />
                        <Input 
                            showIcon 
                            icon='Search' 
                            placeholder='Search by tag' 
                            value={tagSearch}
                            onChange={handleTagSearchChange}
                        />
                        {(titleSearch || tagSearch) && (
                            <Button
                                variant="outlined"
                                label="Clear Filters"
                                onClick={clearFilters}
                            />
                        )}
                    </div>
                    {(titleSearch || tagSearch) && (
                        <div className={Styles.searchResults}>
                            Showing {filteredAnnouncements.length} of {announcements.length} announcements
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default AnnouncementsPage;