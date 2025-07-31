// src/app/projects/edit/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import {
  Plus, Trash2, Calendar, MapPin, Tag, Users, Building2, DollarSign, Image,
  FileText, Globe, Eye, EyeOff, Loader2, XCircle, CheckCircle
} from 'lucide-react';
import styles from './EditProjectForm.module.css';
import Button from '@/ui/button/Button';
import Link from 'next/link'; // Added Link import for error page navigation
import User from '@/models/User';
// Define the interfaces based on your Mongoose schema
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
    _id: string; // Assuming user ID is required when assigning a volunteer
    name: string;
    email: string;
  };
  hours: number;
  certificateURL?: string;
  impactDescription?: string;
}

interface ProjectFormData {
  _id: string; // Add _id for the PUT request
  name: string;
  slug: string; // Add slug for redirection
  location: LocationData;
  startDate: string;
  endDate?: string; // Optional
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

const EditProjectPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params; // The project ID from the URL
  const [formData, setFormData] = useState<ProjectFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [error, setError] = useState<string | null>(null); // FIX: Declare the error state here

  // Placeholder for admin check - crucial for restricting access
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // In a real application, you'd verify the user's role here on the client-side
    // and ideally also on the server-side within API routes.
    // For now, let's hardcode it to true for testing purposes.
    setIsAdmin(true);

    if (!id) {
        setError('Project ID is missing.'); // Now setError is defined
        setLoading(false);
        return;
    }

    const fetchProjectData = async () => {
      setLoading(true);
      setMessage(null);
      setError(null); // Clear previous errors on new fetch attempt
      try {
        const response = await fetch(`/api/projects/edit/${id}`);
        const result = await response.json();

        if (result.success && result.project) {
          // Format dates to YYYY-MM-DD for input type="date"
          const projectData = result.project;
          projectData.startDate = new Date(projectData.startDate).toISOString().split('T')[0];
          if (projectData.endDate) {
            projectData.endDate = new Date(projectData.endDate).toISOString().split('T')[0];
          }
          // Ensure arrays are initialized if null/undefined from backend for form consistency
          projectData.tags = projectData.tags || [];
          projectData.galleryURL = projectData.galleryURL || [];
          projectData.collaborators = projectData.collaborators || [];
          projectData.sponsors = projectData.sponsors || [];
          projectData.volunteers = projectData.volunteers || []; // For consistency, though no UI for it yet

          setFormData(projectData);
        } else {
          setError(result.message || 'Failed to fetch project for editing.'); // Use setError here
        }
      } catch (error) {
        console.error("Error fetching project for edit:", error);
        setError('An unexpected error occurred while fetching project data.'); // Use setError here
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProjectData();
    }
  }, [id]);

  const handleInputChange = (field: string, value: any) => {
    if (!formData) return;
    setFormData(prev => {
      if (!prev) return null; // Should not happen
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...prev,
          [parent]: {
            ...(prev[parent as keyof ProjectFormData] as any),
            [child]: value
          }
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleArrayChange = (field: 'tags' | 'galleryURL', index: number, value: string) => {
    if (!formData) return;
    setFormData(prev => {
      if (!prev) return null;
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field: 'tags' | 'galleryURL') => {
    if (!formData) return;
    setFormData(prev => {
      if (!prev) return null;
      return { ...prev, [field]: [...prev[field], ''] };
    });
  };

  const removeArrayItem = (field: 'tags' | 'galleryURL', index: number) => {
    if (!formData) return;
    setFormData(prev => {
      if (!prev) return null;
      return { ...prev, [field]: prev[field].filter((_, i) => i !== index) };
    });
  };

  const handleCollaboratorChange = (index: number, field: keyof CollaboratorData, value: string) => {
    if (!formData) return;
    setFormData(prev => {
      if (!prev) return null;
      const newCollaborators = [...prev.collaborators];
      newCollaborators[index] = { ...newCollaborators[index], [field]: value };
      return { ...prev, collaborators: newCollaborators };
    });
  };

  const addCollaborator = () => {
    if (!formData) return;
    setFormData(prev => {
      if (!prev) return null;
      return { ...prev, collaborators: [...prev.collaborators, { name: '', logoURL: '', website: '' }] };
    });
  };

  const removeCollaborator = (index: number) => {
    if (!formData) return;
    setFormData(prev => {
      if (!prev) return null;
      return { ...prev, collaborators: prev.collaborators.filter((_, i) => i !== index) };
    });
  };

  const handleSponsorChange = (index: number, field: keyof SponsorData, value: string) => {
    if (!formData) return;
    setFormData(prev => {
      if (!prev) return null;
      const newSponsors = [...prev.sponsors];
      newSponsors[index] = { ...newSponsors[index], [field]: value };
      return { ...prev, sponsors: newSponsors };
    });
  };

  const addSponsor = () => {
    if (!formData) return;
    setFormData(prev => {
      if (!prev) return null;
      return { ...prev, sponsors: [...prev.sponsors, { name: '', logoURL: '', website: '' }] };
    });
  };

  const removeSponsor = (index: number) => {
    if (!formData) return;
    setFormData(prev => {
      if (!prev) return null;
      return { ...prev, sponsors: prev.sponsors.filter((_, i) => i !== index) };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setSubmitting(true);
    setMessage(null);
    setError(null); // Clear errors before new submission

    try {
      // Filter out empty tags and gallery URLs
      const cleanedData = {
        ...formData,
        tags: formData.tags.filter(tag => tag.trim() !== ''),
        galleryURL: formData.galleryURL.filter(url => url.trim() !== ''),
        collaborators: formData.collaborators.filter(collab => collab.name.trim() !== ''),
        sponsors: formData.sponsors.filter(sponsor => sponsor.name.trim() !== '')
      };

      const response = await fetch(`/api/projects/edit/${id}`, {
        method: 'PUT', // Use PUT for updates
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData)
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        // Optionally redirect after successful update
        router.push(`/projects/${result.project.slug || result.project._id}`); // Redirect to view page
      } else {
        setError(result.message); // Use setError for submission errors
      }
    } catch (error) {
      console.error("Error during project update:", error);
      setError('Failed to update project. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAdmin) {
    return (
      <section className={styles.section}>
        <div className={styles.errorContainer}>
          <XCircle className={styles.errorIcon} />
          <h2 className={styles.errorTitle}>Access Denied</h2>
          <p className={styles.errorMessage}>You do not have administrative privileges to edit projects.</p>
          <Link href="/projects/manage">
            <Button variant='secondary' label='Back to Manage Projects' />
          </Link>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.loadingContainer}>
          <Loader2 className={styles.spinner} />
          <p>Loading project for editing...</p>
        </div>
      </section>
    );
  }

  // Display initial fetch errors
  if (error) {
    return (
      <section className={styles.section}>
        <div className={styles.errorContainer}>
          <XCircle className={styles.errorIcon} />
          <p>{error}</p>
          <Link href="/projects/manage">
            <Button variant='secondary' label='Back to Projects' />
          </Link>
        </div>
      </section>
    );
  }

  if (!formData) { // Should ideally be caught by error state if ID is invalid or not found
    return (
        <section className={styles.section}>
            <div className={styles.errorContainer}>
                <XCircle className={styles.errorIcon} />
                <p>Project data could not be loaded. Please ensure the project ID is valid.</p>
                <Link href="/projects/manage">
                    <Button variant='secondary' label='Back to Projects' />
                </Link>
            </div>
        </section>
    );
  }


  return (
    <section className={styles.section}>
    <div className={styles.formContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Edit Project: {formData.name}</h1>
        <p className={styles.subtitle}>Modify the details of this community project.</p>
      </div>

      {message && (
        <div className={`${styles.message} ${message.type === 'success' ? styles.successMessage : styles.errorMessage}`}>
          {message.text}
        </div>
      )}
      {/* Display errors from submission if any */}
      {error && (
        <div className={`${styles.message} ${styles.errorMessage}`}>
          {error}
        </div>
      )}


      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Basic Information */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <FileText className={styles.icon} />
            Basic Information
          </h2>

          <div className={styles.grid2Col}>
            <div>
              <label className={styles.label}>
                Project Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={styles.input}
                placeholder="Enter project name"
                required
              />
            </div>

            <div>
              <label className={styles.label}>
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className={styles.select}
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className={styles.colSpan2}>
              <label className={styles.label}>
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className={styles.textarea}
                placeholder="Describe your project..."
                required
              />
              <p className={styles.charCount}>{formData.description.length}/2000 characters</p>
            </div>
          </div>
        </div>

        {/* Location & Dates */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <MapPin className={styles.icon} />
            Location & Timeline
          </h2>

          <div className={styles.grid3Col}>
            <div>
              <label className={styles.label}>
                City *
              </label>
              <input
                type="text"
                value={formData.location.city}
                onChange={(e) => handleInputChange('location.city', e.target.value)}
                className={styles.input}
                placeholder="Enter city"
                required
              />
            </div>

            <div>
              <label className={styles.label}>
                Division
              </label>
              <input
                type="text"
                value={formData.location.division || ''} // Handle undefined
                onChange={(e) => handleInputChange('location.division', e.target.value)}
                className={styles.input}
                placeholder="Enter division"
              />
            </div>

            <div>
              <label className={styles.label}>
                Country
              </label>
              <input
                type="text"
                value={formData.location.country}
                onChange={(e) => handleInputChange('location.country', e.target.value)}
                className={styles.input}
                placeholder="Enter country"
              />
            </div>

            <div>
              <label className={styles.label}>
                Start Date *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <div>
              <label className={styles.label}>
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate || ''} // Handle undefined
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className={styles.input}
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <Tag className={styles.icon} />
            Tags
          </h2>

          {formData.tags.map((tag, index) => (
            <div key={index} className={styles.arrayItem}>
              <input
                type="text"
                value={tag}
                onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                className={styles.input}
                placeholder="Enter tag"
              />
              {formData.tags.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('tags', index)}
                  className={styles.removeButton}
                >
                  <Trash2 className={styles.iconSmall} />
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => addArrayItem('tags')}
            className={styles.addButton}
          >
            <Plus className={styles.iconSmall} />
            Add Tag
          </button>
        </div>

        {/* Images & Files */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <Image className={styles.icon} />
            Media & Documents
          </h2>

          <div className={styles.spacingY4}>
            <div>
              <label className={styles.label}>
                Thumbnail URL *
              </label>
              <input
                type="url"
                value={formData.thumbnailURL}
                onChange={(e) => handleInputChange('thumbnailURL', e.target.value)}
                className={styles.input}
                placeholder="https://example.com/thumbnail.jpg"
                required
              />
            </div>

            <div>
              <label className={styles.label}>
                Banner URL *
              </label>
              <input
                type="url"
                value={formData.bannerURL}
                onChange={(e) => handleInputChange('bannerURL', e.target.value)}
                className={styles.input}
                placeholder="https://example.com/banner.jpg"
                required
              />
            </div>

            <div>
              <label className={styles.label}>
                Gallery URLs *
              </label>
              {formData.galleryURL.map((url, index) => (
                <div key={index} className={styles.arrayItem}>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => handleArrayChange('galleryURL', index, e.target.value)}
                    className={styles.input}
                    placeholder="https://example.com/gallery1.jpg"
                  />
                  {formData.galleryURL.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('galleryURL', index)}
                      className={styles.removeButton}
                    >
                      <Trash2 className={styles.iconSmall} />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() => addArrayItem('galleryURL')}
                className={styles.addButton}
              >
                <Plus className={styles.iconSmall} />
                Add Gallery Image
              </button>
            </div>

            <div>
              <label className={styles.label}>
                Financial Record URL *
              </label>
              <input
                type="url"
                value={formData.financialRecordURL}
                onChange={(e) => handleInputChange('financialRecordURL', e.target.value)}
                className={styles.input}
                placeholder="https://example.com/financial-report.pdf"
                required
              />
            </div>
          </div>
        </div>

        {/* Impact Metrics */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <Users className={styles.icon} />
            Impact Metrics
          </h2>

          <div className={styles.grid3Col}>
            <div>
              <label className={styles.label}>
                People Served
              </label>
              <input
                type="number"
                min="0"
                value={formData.impact.peopleServed}
                onChange={(e) => handleInputChange('impact.peopleServed', parseInt(e.target.value) || 0)}
                className={styles.input}
              />
            </div>

            <div>
              <label className={styles.label}>
                Volunteers Engaged
              </label>
              <input
                type="number"
                min="0"
                value={formData.impact.volunteersEngaged}
                onChange={(e) => handleInputChange('impact.volunteersEngaged', parseInt(e.target.value) || 0)}
                className={styles.input}
              />
            </div>

            <div>
              <label className={styles.label}>
                Materials Distributed
              </label>
              <input
                type="number"
                min="0"
                value={formData.impact.materialsDistributed}
                onChange={(e) => handleInputChange('impact.materialsDistributed', parseInt(e.target.value) || 0)}
                className={styles.input}
              />
            </div>
          </div>
        </div>

        {/* Collaborators */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <Building2 className={styles.icon} />
            Collaborators
          </h2>

          {formData.collaborators.map((collaborator, index) => (
            <div key={index} className={styles.nestedFormItem}>
              <div className={styles.nestedFormHeader}>
                <h3 className={styles.nestedFormTitle}>Collaborator {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeCollaborator(index)}
                  className={styles.removeButton}
                >
                  <Trash2 className={styles.iconSmall} />
                </button>
              </div>

              <div className={styles.grid3Col}>
                <div>
                  <label className={styles.label}>Name</label>
                  <input
                    type="text"
                    value={collaborator.name}
                    onChange={(e) => handleCollaboratorChange(index, 'name', e.target.value)}
                    className={styles.input}
                    placeholder="Organization name"
                  />
                </div>

                <div>
                  <label className={styles.label}>Logo URL</label>
                  <input
                    type="url"
                    value={collaborator.logoURL || ''}
                    onChange={(e) => handleCollaboratorChange(index, 'logoURL', e.target.value)}
                    className={styles.input}
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                <div>
                  <label className={styles.label}>Website</label>
                  <input
                    type="url"
                    value={collaborator.website || ''}
                    onChange={(e) => handleCollaboratorChange(index, 'website', e.target.value)}
                    className={styles.input}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addCollaborator}
            className={styles.addButton}
          >
            <Plus className={styles.iconSmall} />
            Add Collaborator
          </button>
        </div>

        {/* Sponsors */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <DollarSign className={styles.icon} />
            Sponsors
          </h2>

          {formData.sponsors.map((sponsor, index) => (
            <div key={index} className={styles.nestedFormItem}>
              <div className={styles.nestedFormHeader}>
                <h3 className={styles.nestedFormTitle}>Sponsor {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeSponsor(index)}
                  className={styles.removeButton}
                >
                  <Trash2 className={styles.iconSmall} />
                </button>
              </div>

              <div className={styles.grid3Col}>
                <div>
                  <label className={styles.label}>Name</label>
                  <input
                    type="text"
                    value={sponsor.name}
                    onChange={(e) => handleSponsorChange(index, 'name', e.target.value)}
                    className={styles.input}
                    placeholder="Sponsor name"
                  />
                </div>

                <div>
                  <label className={styles.label}>Logo URL</label>
                  <input
                    type="url"
                    value={sponsor.logoURL || ''}
                    onChange={(e) => handleSponsorChange(index, 'logoURL', e.target.value)}
                    className={styles.input}
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                <div>
                  <label className={styles.label}>Website</label>
                  <input
                    type="url"
                    value={sponsor.website || ''}
                    onChange={(e) => handleSponsorChange(index, 'website', e.target.value)}
                    className={styles.input}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addSponsor}
            className={styles.addButton}
          >
            <Plus className={styles.iconSmall} />
            Add Sponsor
          </button>
        </div>

        {/* Settings */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <Globe className={styles.icon} />
            Project Settings
          </h2>

          <div className={styles.toggleContainer}>
            <button
              type="button"
              onClick={() => handleInputChange('isPublic', !formData.isPublic)}
              className={`${styles.toggleButton} ${formData.isPublic ? styles.togglePublic : styles.togglePrivate}`}
            >
              {formData.isPublic ? <Eye className={styles.iconSmall} /> : <EyeOff className={styles.iconSmall} />}
              {formData.isPublic ? 'Public Project' : 'Private Project'}
            </button>
            <p className={styles.toggleDescription}>
              {formData.isPublic
                ? 'This project will be visible to everyone'
                : 'This project will only be visible to authorized users'
              }
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className={styles.buttonGroup}>
          <Button
            variant='secondary'
            label='Cancel'
            onClick={() => router.back()} // Go back to previous page
          />
          <button
            type="submit"
            disabled={submitting}
            className={`${styles.submitButton} ${submitting ? styles.submitButtonLoading : ''}`}
          >
            {submitting ? (
              <>
                <div className={styles.spinner}></div>
                Updating...
              </>
            ) : (
              <>
                <CheckCircle className={styles.iconSmall} />
                Update Project
              </>
            )}
          </button>
        </div>
      </form>
    </div>
    </section>
  );
};

export default EditProjectPage;