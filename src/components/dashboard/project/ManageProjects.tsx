// app/projects/manage/page.tsx (Updated)
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, Loader2, PlusCircle, CheckCircle, XCircle } from 'lucide-react';
import styles from './ManageProjects.module.css'; // We'll create this CSS module
import Button from '@/ui/button/Button';

interface LocationData {
  city: string;
  division: string;
  country: string;
}

interface ProjectData {
  _id: string;
  name: string;
  location: LocationData;
  startDate: string;
  endDate?: string;
  description: string;
  tags: string[];
  thumbnailURL: string;
  bannerURL: string;
  galleryURL: string[];
  financialRecordURL: string;
  impact: {
    peopleServed: number;
    volunteersEngaged: number;
    materialsDistributed: number;
  };
  collaborators: { name: string; logoURL: string; website: string }[];
  sponsors: { name: string; logoURL: string; website: string }[];
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  isPublic: boolean;
}

const ManageProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    setMessage(null);
    try {
      // Changed to fetch from the /api/projects/get endpoint
      const response = await fetch('/api/projects/get');
      const result = await response.json();
      if (result.success) {
        setProjects(result.projects);
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to fetch projects.' });
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setMessage({ type: 'error', text: 'An unexpected error occurred while fetching projects.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    setDeletingId(id);
    setMessage(null);
    try {
      // Corrected API endpoint for DELETE
      const response = await fetch(`/api/projects/edit/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        setProjects(prevProjects => prevProjects.filter(project => project._id !== id));
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to delete project.' });
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      setMessage({ type: 'error', text: 'An unexpected error occurred while deleting the project.' });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 className={styles.spinner} />
        <p>Loading projects...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Manage Projects</h1>
      </div>

      {message && (
        <div className={`${styles.message} ${message.type === 'success' ? styles.successMessage : styles.errorMessage}`}>
          {message.text}
        </div>
      )}

      {projects.length === 0 ? (
        <div className={styles.noProjects}>
          <p>No projects found. Start by creating a new one!</p>
        </div>
      ) : (
        <div className={styles.projectList}>
          {projects.map(project => (
            <div key={project._id} className={styles.projectCard}>
              <div className={styles.projectHeader}>
                <h2 className={styles.projectName}>{project.name}</h2>
                <div className={`${styles.statusBadge} ${styles[project.status.toLowerCase()]}`}>
                  {project.status}
                </div>
              </div>
              <p className={styles.projectLocation}>
                {project.location.city}, {project.location.country}
              </p>
              <p className={styles.projectDates}>
                {new Date(project.startDate).toLocaleDateString()}
                {project.endDate && ` - ${new Date(project.endDate).toLocaleDateString()}`}
              </p>
              <p className={styles.projectDescription}>{project.description.substring(0, 150)}...</p>

              <div className={styles.projectActions}>
                <Link href={`/projects/edit/${project._id}`} className={styles.editButton}>
                    <Button
                        variant='primary'
                        label='Edit'
                        showIcon
                        icon='Pencil'
                    />
                </Link>

                <Button
                    variant='danger'
                    label='Delete'
                    showIcon
                    icon='Trash2'
                                      onClick={() => handleDelete(project._id)}
                                                        disabled={deletingId === project._id}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageProjectsPage;