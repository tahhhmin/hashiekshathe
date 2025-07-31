'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Loader2, Calendar, MapPin, Tag, Users, Building2,
  DollarSign, Image, FileText, Globe, ExternalLink,
  Edit, ShieldCheck,
  XCircle
} from 'lucide-react';
import styles from './ProjectProfile.module.css'; // New CSS module
import Button from '@/ui/button/Button'; // Assuming you have a reusable Button component

interface LocationData {
  city: string;
  division?: string;
  country: string;
}

interface ImpactData {
  peopleServed: number;
  volunteersEngaged: number;
  materialsDistributed: number;
}

interface CollaboratorData {
  name: string;
  logoURL?: string;
  website?: string;
}

interface SponsorData {
  name: string;
  logoURL?: string;
  website?: string;
}

interface VolunteerData {
  user: {
    _id: string;
    name: string;
    email: string;
  };
  hours: number;
  certificateURL?: string;
  impactDescription?: string;
}

interface ProjectData {
  _id: string;
  name: string;
  slug: string;
  location: LocationData;
  startDate: string;
  endDate?: string;
  description: string;
  tags: string[];
  thumbnailURL: string;
  bannerURL: string;
  galleryURL: string[];
  financialRecordURL: string;
  impact: ImpactData;
  volunteers: VolunteerData[];
  collaborators: CollaboratorData[];
  sponsors: SponsorData[];
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  isPublic: boolean;
}

const ProjectProfilePage: React.FC = () => {
  const params = useParams();
  const { slug } = params; // This will be the slug or ID depending on how you route
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Placeholder for admin check - In a real app, this would come from auth context
  // For demonstration, let's assume 'isAdmin' is set based on some login state
  // For now, let's hardcode it to true to see the admin options
  const [isAdmin, setIsAdmin] = useState(true); 

  useEffect(() => {
    // In a real application, you'd verify the user's role here
    // For now, let's just make it true for development to see the admin view.
    // In production, ensure this is tied to actual user roles.
    // Example:
    // const checkAdminStatus = async () => {
    //   // Fetch user session or check a token
    //   const response = await fetch('/api/auth/session'); // Example API endpoint
    //   const session = await response.json();
    //   if (session?.user?.role === 'admin') {
    //     setIsAdmin(true);
    //   } else {
    //     setIsAdmin(false);
    //   }
    // };
    // checkAdminStatus();
  }, []);

  useEffect(() => {
    if (!slug) return;

    const fetchProject = async () => {
      setLoading(true);
      setError(null);
      try {
        // Corrected API endpoint to match the [slug] dynamic route
        const response = await fetch(`/api/projects/${slug}`); 
        const result = await response.json();

        if (result.success) {
          setProject(result.project);
        } else {
          setError(result.message || 'Failed to fetch project details.');
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        setError('An unexpected error occurred while fetching the project.');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.loadingContainer}>
          <Loader2 className={styles.spinner} />
          <p>Loading project details...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.section}>
        <div className={styles.errorContainer}>
          <XCircle className={styles.errorIcon} />
          <p>{error}</p>
          <Link href="/projects"> {/* Link back to the projects listing */}
            <Button variant='secondary' label='Back to Projects' />
          </Link>
        </div>
      </section>
    );
  }

  if (!project) {
    return (
      <section className={styles.section}>
        <div className={styles.errorContainer}>
          <XCircle className={styles.errorIcon} />
          <p>Project not found.</p>
          <Link href="/projects"> {/* Link back to the projects listing */}
            <Button variant='secondary' label='Back to Projects' />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {isAdmin && (
          <div className={styles.adminActions}>
            <Link href={`/projects/edit/${project._id}`}>
              <Button
                variant='primary'
                label='Edit Project'
                showIcon
                icon='Edit'
              />
            </Link>
            <span className={styles.adminNote}>
              <ShieldCheck size={18} /> Admin View
            </span>
          </div>
        )}

        {/* Project Header */}
        <div className={styles.header}>
          <img src={project.bannerURL} alt={`${project.name} Banner`} className={styles.bannerImage} onError={(e) => { e.currentTarget.src = 'https://placehold.co/1200x400/cccccc/333333?text=Project+Banner'; }} />
          <div className={styles.headerContent}>
            <h1 className={styles.title}>{project.name}</h1>
            <div className={`${styles.statusBadge} ${styles[project.status.toLowerCase()]}`}>
              {project.status}
            </div>
            <p className={styles.location}>
              <MapPin size={18} /> {project.location.city}, {project.location.division && `${project.location.division}, `}{project.location.country}
            </p>
            <p className={styles.dates}>
              <Calendar size={18} /> {new Date(project.startDate).toLocaleDateString()}
              {project.endDate && ` - ${new Date(project.endDate).toLocaleDateString()}`}
            </p>
          </div>
        </div>

        {/* Project Details */}
        <div className={styles.contentGrid}>
          <div className={styles.mainContent}>
            <h2 className={styles.sectionTitle}>Project Overview</h2>
            <p className={styles.description}>{project.description}</p>

            {project.tags.length > 0 && (
              <div className={styles.tagsContainer}>
                <h3 className={styles.subSectionTitle}><Tag size={16} /> Tags:</h3>
                <div className={styles.tagsList}>
                  {project.tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Impact Metrics */}
            <h2 className={styles.sectionTitle}>Impact</h2>
            <div className={styles.impactMetrics}>
              <div className={styles.metricCard}>
                <Users size={24} />
                <span>{project.impact.peopleServed}</span>
                <p>People Served</p>
              </div>
              <div className={styles.metricCard}>
                <Users size={24} />
                <span>{project.impact.volunteersEngaged}</span>
                <p>Volunteers Engaged</p>
              </div>
              <div className={styles.metricCard}>
                <Users size={24} />
                <span>{project.impact.materialsDistributed}</span>
                <p>Materials Distributed</p>
              </div>
            </div>

            {/* Collaborators */}
            {project.collaborators.length > 0 && (
              <div className={styles.collaboratorsSection}>
                <h2 className={styles.sectionTitle}><Building2 className={styles.icon} /> Collaborators</h2>
                <div className={styles.orgList}>
                  {project.collaborators.map((collab, index) => (
                    <div key={index} className={styles.orgItem}>
                      {collab.logoURL && <img src={collab.logoURL} alt={collab.name} className={styles.orgLogo} onError={(e) => { e.currentTarget.src = 'https://placehold.co/80x80/cccccc/333333?text=Logo'; }} />}
                      <p className={styles.orgName}>{collab.name}</p>
                      {collab.website && (
                        <a href={collab.website} target="_blank" rel="noopener noreferrer" className={styles.orgWebsite}>
                          <ExternalLink size={16} /> Website
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sponsors */}
            {project.sponsors.length > 0 && (
              <div className={styles.sponsorsSection}>
                <h2 className={styles.sectionTitle}><DollarSign className={styles.icon} /> Sponsors</h2>
                <div className={styles.orgList}>
                  {project.sponsors.map((sponsor, index) => (
                    <div key={index} className={styles.orgItem}>
                      {sponsor.logoURL && <img src={sponsor.logoURL} alt={sponsor.name} className={styles.orgLogo} onError={(e) => { e.currentTarget.src = 'https://placehold.co/80x80/cccccc/333333?text=Logo'; }} />}
                      <p className={styles.orgName}>{sponsor.name}</p>
                      {sponsor.website && (
                        <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className={styles.orgWebsite}>
                          <ExternalLink size={16} /> Website
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={styles.sidebar}>
            {/* Gallery */}
            {project.galleryURL.length > 0 && (
              <div className={styles.gallerySection}>
                <h2 className={styles.sectionTitle}><Image className={styles.icon} /> Gallery</h2>
                <div className={styles.imageGrid}>
                  {project.galleryURL.map((url, index) => (
                    <img key={index} src={url} alt={`Gallery image ${index + 1}`} className={styles.galleryImage} onError={(e) => { e.currentTarget.src = `https://placehold.co/120x120/cccccc/333333?text=Image+${index + 1}`; }} />
                  ))}
                </div>
              </div>
            )}

            {/* Financial Records */}
            {project.financialRecordURL && (
              <div className={styles.financialSection}>
                <h2 className={styles.sectionTitle}><FileText className={styles.icon} /> Financial Records</h2>
                <a href={project.financialRecordURL} target="_blank" rel="noopener noreferrer" className={styles.financialLink}>
                  View Financial Report <ExternalLink size={16} />
                </a>
              </div>
            )}

            {/* Volunteers (if populated, and if relevant to display here) */}
            {project.volunteers && project.volunteers.length > 0 && (
              <div className={styles.volunteersSection}>
                <h2 className={styles.sectionTitle}><Users className={styles.icon} /> Volunteers</h2>
                <ul className={styles.volunteerList}>
                  {project.volunteers.map((volunteer, index) => (
                    <li key={index} className={styles.volunteerItem}>
                      <span className={styles.volunteerName}>{volunteer.user.name}</span>
                      <span className={styles.volunteerHours}>({volunteer.hours} hours)</span>
                      {volunteer.certificateURL && (
                        <a href={volunteer.certificateURL} target="_blank" rel="noopener noreferrer" className={styles.volunteerLink}>
                          Certificate <ExternalLink size={14} />
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Public/Private Status */}
            <div className={styles.visibilityStatus}>
                {project.isPublic ? (
                    <>
                        <Globe size={20} className={styles.publicIcon} />
                        <span>Public Project</span>
                    </>
                ) : (
                    <>
                        <Globe size={20} className={styles.privateIcon} />
                        <span>Private Project</span>
                    </>
                )}
                <p className={styles.visibilityDescription}>
                    {project.isPublic ? 'This project is visible to everyone.' : 'This project is visible only to authorized users.'}
                </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectProfilePage;
