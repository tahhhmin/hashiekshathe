"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import styles from './ProjectCard.module.css';
import { MapPin } from 'lucide-react';

interface Project {
    _id: string;
    name: string;
    slug: string;
    thumbnailURL: string;
    location: {
        city: string;
        division?: string;
    };
    description: string;
    tags: string[];
}

// Utility function to truncate description to N words
const truncateDescription = (text: string, wordLimit: number): string => {
    const words = text.trim().split(/\s+/);
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + ' [...]';
};

const ProjectCard = ({ project }: { project: Project }) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const handleImageError = () => {
        setImageError(true);
        setImageLoading(false);
    };

    const handleImageLoad = () => {
        setImageLoading(false);
    };

    return (
        <Link href={`/projects/${project.slug}`} className={styles.projectCard}>
            <div className={styles.projectCardContainer}>
                <div className={styles.imageContainer}>
                    <div className={styles.projectTags}>
                        {project.tags?.map((tag, index) => (
                            <span key={index} className={styles.tag}>
                                <p>{tag}</p>
                            </span>
                        ))}
                    </div>

                    {!imageError && project.thumbnailURL ? (
                        <>
                            {imageLoading && (
                                <div className={styles.imagePlaceholder}>
                                    <div className={styles.loadingSpinner}></div>
                                </div>
                            )}
                            <Image
                                src={project.thumbnailURL}
                                alt={`${project.name} thumbnail`}
                                fill
                                className={styles.projectImage}
                                style={{
                                    objectFit: 'cover',
                                    opacity: imageLoading ? 0 : 1,
                                    transition: 'opacity 0.3s ease'
                                }}
                                onError={handleImageError}
                                onLoad={handleImageLoad}
                            />
                        </>
                    ) : (
                        <div className={styles.imagePlaceholder}>
                            <div className={styles.placeholderIcon}>📷</div>
                            <span className={styles.placeholderText}>No Image Available</span>
                        </div>
                    )}
                </div>

                <div className={styles.projectInfoContainer}>
                    <h2 className={styles.projectTitle}>{project.name}</h2>

                    <p className={styles.projectLocation}>
                        <MapPin /> {project.location?.city}, {project.location?.division}
                    </p>

                    <p className={styles.projectDescription}>
                        {truncateDescription(project.description, 20)}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default ProjectCard;
