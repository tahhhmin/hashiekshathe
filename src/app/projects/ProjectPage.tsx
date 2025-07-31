'use client';

import React, { useEffect, useState } from 'react';
import Styles from './page.module.css';
import Link from 'next/link';
import { Loader2, XCircle, MapPin, Calendar, Tag } from 'lucide-react';

interface LocationData {
  city: string;
  division?: string;
  country: string;
}

interface ProjectCardData {
  _id: string;
  name: string;
  slug: string;
  location: LocationData;
  startDate: string;
  endDate?: string;
  description: string;
  tags: string[];
  thumbnailURL: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/projects/get');
        const result = await response.json();
        if (result.success) {
          setProjects(result.projects);
        } else {
          setError(result.message || 'Failed to fetch projects.');
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('An unexpected error occurred while fetching projects.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section className="section">
        <div className={Styles.loadingContainer}>
          <Loader2 className={Styles.spinner} />
          <p>Loading projects...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section">
        <div className={Styles.errorContainer}>
          <XCircle className={Styles.errorIcon} />
          <p>{error}</p>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return (
      <section className={Styles.section}>
        <div className={Styles.noProjectsContainer}>
          <p>No projects found at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={Styles.section}>
      <div className={Styles.container}>
        <h1 className={Styles.pageTitle}>Our Projects – Hashi Ekshathe</h1>
        <p className={Styles.pageSubtitle}>
          Explore the social impact initiatives led by Hashi Ekshathe across Bangladesh and beyond.
        </p>

        <div className={Styles.projectGrid}>
          {projects.map((project) => (
            <Link
              key={project._id}
              href={`/projects/${project.slug}`}
              className={Styles.projectCard}
              aria-label={`Project: ${project.name}`}
            >
              <img
                src={project.thumbnailURL}
                alt={`Thumbnail for ${project.name}`}
                className={Styles.cardThumbnail}
              />
              <div className={Styles.cardContent}>
                <h2 className={Styles.cardTitle}>{project.name}</h2>
                <div className={`${Styles.statusBadge} ${Styles[project.status.toLowerCase()]}`}>
                  {project.status}
                </div>
                <p className={Styles.cardLocation}>
                  <MapPin size={16} />
                  {project.location.city}, {project.location.country}
                </p>
                <p className={Styles.cardDates}>
                  <Calendar size={16} />
                  {new Date(project.startDate).toLocaleDateString()}
                  {project.endDate && ` - ${new Date(project.endDate).toLocaleDateString()}`}
                </p>
                <p className={Styles.cardDescription}>
                  {project.description.substring(0, 100)}...
                </p>
                {project.tags.length > 0 && (
                  <div className={Styles.cardTags}>
                    <Tag size={14} /> {project.tags.join(', ')}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
