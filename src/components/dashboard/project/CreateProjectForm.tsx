import React, { useState } from 'react';
import { Plus, Trash2, MapPin, Tag, Users, Building2, DollarSign, Image, FileText, Globe, Eye, EyeOff } from 'lucide-react';
import styles from './CreateProjectForm.module.css';
import UserSearchModal from './UserSearchModal';

// Interfaces for form data structure
interface LocationData {
  city: string;
  division?: string;
}

interface ImpactData {
  peopleServed: number;
  volunteersEngaged: number;
  materialsDistributed: number;
}

// User interface for the search modal and selected volunteer
interface User {
  _id: string; // MongoDB's default ID
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

interface VolunteerData {
  volunteerUserID: string; // The backend expects this, will come from selected user _id
  volunteerEmail: string; // Will come from selected user email
  volunteeringHours?: number;
  certificateURL?: string;
  impactDescription?: string;
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

interface ProjectFormData {
  name: string;
  location: LocationData;
  startDate: string;
  endDate?: string;
  description: string;
  tags: string[];
  thumbnailURL: string;
  bannerURL: string;
  gallerySpreadsheetURL: string;
  financialRecordURL: string;
  impact: ImpactData;
  volunteers: VolunteerData[];
  collaborators: CollaboratorData[];
  sponsors: SponsorData[];
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  isPublic: boolean;
}

const CreateProjectForm: React.FC = () => {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    location: { city: '', division: '' },
    startDate: '',
    endDate: '',
    description: '',
    tags: [''],
    thumbnailURL: '',
    bannerURL: '',
    gallerySpreadsheetURL: '',
    financialRecordURL: '',
    impact: { peopleServed: 0, volunteersEngaged: 0, materialsDistributed: 0 },
    volunteers: [],
    collaborators: [],
    sponsors: [],
    status: 'Upcoming',
    isPublic: true
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showUserSearchModal, setShowUserSearchModal] = useState(false);

  // Generic handler for input changes, including nested objects (e.g., location.city)
  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => {
      const updatedData = { ...prev };
      if (field.includes('.')) {
        const [parent, child] = field.split('.') as [keyof ProjectFormData, string];
        // Safely access the nested object and update the child property
        if (updatedData[parent] && typeof updatedData[parent] === 'object' && child) {
          (updatedData[parent] as any)[child] = value;
        }
      } else {
        // Update top-level property
        (updatedData as any)[field] = value;
      }
      return updatedData;
    });
  };

  // Handler for changes in array fields (tags)
  const handleArrayChange = (field: 'tags', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  // Function to add a new item to an array field
  const addArrayItem = (field: 'tags') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  // Function to remove an item from an array field
  const removeArrayItem = (field: 'tags', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // Handler for changes in nested object arrays (collaborators, sponsors, volunteers)
  const handleNestedArrayChange = <T extends CollaboratorData | SponsorData | VolunteerData>(
    field: 'collaborators' | 'sponsors' | 'volunteers',
    index: number,
    subField: keyof T,
    value: string | number
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) =>
        i === index ? { ...item, [subField]: value } : item
      ) as T[]
    }));
  };

  // Functions for adding/removing collaborators
  const addCollaborator = () => {
    setFormData(prev => ({
      ...prev,
      collaborators: [...prev.collaborators, { name: '', logoURL: '', website: '' }]
    }));
  };

  const removeCollaborator = (index: number) => {
    setFormData(prev => ({
      ...prev,
      collaborators: prev.collaborators.filter((_, i) => i !== index)
    }));
  };

  // Functions for adding/removing sponsors
  const addSponsor = () => {
    setFormData(prev => ({
      ...prev,
      sponsors: [...prev.sponsors, { name: '', logoURL: '', website: '' }]
    }));
  };

  const removeSponsor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sponsors: prev.sponsors.filter((_, i) => i !== index)
    }));
  };

  const handleOpenUserSearchModal = () => {
    setShowUserSearchModal(true);
  };

  const handleCloseUserSearchModal = () => {
    setShowUserSearchModal(false);
  };

  const handleUserSelectedAsVolunteer = (user: User) => {
    setFormData(prev => {
      const isAlreadyVolunteer = prev.volunteers.some(
        (v) => v.volunteerUserID === user._id
      );

      if (isAlreadyVolunteer) {
        setMessage({ type: 'error', text: `${user.firstName} ${user.lastName} is already a volunteer for this project.` });
        return prev;
      }

      const newVolunteer: VolunteerData = {
        volunteerUserID: user._id,
        volunteerEmail: user.email,
        volunteeringHours: 0,
        certificateURL: '',
        impactDescription: '',
      };

      return {
        ...prev,
        volunteers: [...prev.volunteers, newVolunteer],
      };
    });
    setMessage(null);
    handleCloseUserSearchModal();
  };

  const removeVolunteer = (index: number) => {
    setFormData(prev => ({
      ...prev,
      volunteers: prev.volunteers.filter((_, i) => i !== index)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const cleanedData = {
        ...formData,
        tags: formData.tags.filter(tag => tag.trim() !== ''),
        collaborators: formData.collaborators.filter(collab => collab.name.trim() !== ''),
        sponsors: formData.sponsors.filter(sponsor => sponsor.name.trim() !== ''),
      };

      const response = await fetch('/api/projects/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData)
      });

      const result = await response.json();

      if (response.ok) { // Check for successful response status code
        setMessage({ type: 'success', text: result.message });
        setFormData({
          name: '',
          location: { city: '', division: '' },
          startDate: '',
          endDate: '',
          description: '',
          tags: [''],
          thumbnailURL: '',
          bannerURL: '',
          gallerySpreadsheetURL: '',
          financialRecordURL: '',
          impact: { peopleServed: 0, volunteersEngaged: 0, materialsDistributed: 0 },
          volunteers: [],
          collaborators: [],
          sponsors: [],
          status: 'Upcoming',
          isPublic: true
        });
      } else {
        setMessage({ type: 'error', text: result.message || 'An unexpected error occurred.' });
      }
    } catch (error) {
      console.error('Submission error:', error);
      setMessage({ type: 'error', text: 'Failed to create project. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Create New Project</h1>
        <p className={styles.subtitle}>Fill out the form below to create a new community project.</p>
      </div>

      {message && (
        <div className={`${styles.message} ${message.type === 'success' ? styles.successMessage : styles.errorMessage}`}>
          {message.text}
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
              <label className={styles.label}>Project Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={styles.input}
                placeholder="Enter project name"
                maxLength={100}
                required
              />
              <p className={styles.charCount}>{formData.name.length}/100 characters</p>
            </div>
            <div>
              <label className={styles.label}>Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value as 'Upcoming' | 'Ongoing' | 'Completed')}
                className={styles.select}
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className={styles.colSpan2}>
              <label className={styles.label}>Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className={styles.textarea}
                placeholder="Describe your project..."
                maxLength={2000}
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
              <label className={styles.label}>City *</label>
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
              <label className={styles.label}>Division</label>
              <input
                type="text"
                value={formData.location.division || ''}
                onChange={(e) => handleInputChange('location.division', e.target.value)}
                className={styles.input}
                placeholder="Enter division"
              />
            </div>
            <div>
              <label className={styles.label}>Start Date *</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className={styles.input}
                required
              />
            </div>
            <div>
              <label className={styles.label}>End Date</label>
              <input
                type="date"
                value={formData.endDate || ''}
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
                required={formData.tags.length === 1 && tag.trim() === ''}
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
              <label className={styles.label}>Thumbnail URL *</label>
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
              <label className={styles.label}>Banner URL *</label>
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
              <label className={styles.label}>Gallery Spreadsheet URL *</label>
              <input
                type="url"
                value={formData.gallerySpreadsheetURL}
                onChange={(e) => handleInputChange('gallerySpreadsheetURL', e.target.value)}
                className={styles.input}
                placeholder="https://example.com/gallery_spreadsheet.xlsx"
                required
              />
            </div>
            <div>
              <label className={styles.label}>Financial Record URL *</label>
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
              <label className={styles.label}>People Served</label>
              <input
                type="number"
                min="0"
                value={formData.impact.peopleServed}
                onChange={(e) => handleInputChange('impact.peopleServed', parseInt(e.target.value) || 0)}
                className={styles.input}
              />
            </div>
            <div>
              <label className={styles.label}>Volunteers Engaged</label>
              <input
                type="number"
                min="0"
                value={formData.impact.volunteersEngaged}
                onChange={(e) => handleInputChange('impact.volunteersEngaged', parseInt(e.target.value) || 0)}
                className={styles.input}
              />
            </div>
            <div>
              <label className={styles.label}>Materials Distributed</label>
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

        {/* Volunteers */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <Users className={styles.icon} />
            Volunteers
          </h2>
          {formData.volunteers.map((volunteer, index) => (
            <div key={index} className={styles.nestedFormItem}>
              <div className={styles.nestedFormHeader}>
                <h3 className={styles.nestedFormTitle}>
                  Volunteer: {volunteer.volunteerEmail}
                </h3>
                <button
                  type="button"
                  onClick={() => removeVolunteer(index)}
                  className={styles.removeButton}
                >
                  <Trash2 className={styles.iconSmall} />
                </button>
              </div>
              <div className={styles.grid2Col}>
                <div>
                  <label className={styles.label}>Volunteer User ID</label>
                  <input
                    type="text"
                    value={volunteer.volunteerUserID}
                    className={styles.input}
                    readOnly
                    disabled
                  />
                </div>
                <div>
                  <label className={styles.label}>Volunteer Email</label>
                  <input
                    type="email"
                    value={volunteer.volunteerEmail}
                    className={styles.input}
                    readOnly
                    disabled
                  />
                </div>
                <div>
                  <label className={styles.label}>Volunteering Hours</label>
                  <input
                    type="number"
                    min="0"
                    value={volunteer.volunteeringHours || 0}
                    onChange={(e) => handleNestedArrayChange<VolunteerData>('volunteers', index, 'volunteeringHours', parseInt(e.target.value) || 0)}
                    className={styles.input}
                    placeholder="0"
                  />
                </div>
                <div className={styles.colSpan2}>
                  <label className={styles.label}>Certificate URL</label>
                  <input
                    type="url"
                    value={volunteer.certificateURL || ''}
                    onChange={(e) => handleNestedArrayChange<VolunteerData>('volunteers', index, 'certificateURL', e.target.value)}
                    className={styles.input}
                    placeholder="https://example.com/certificate.pdf"
                  />
                </div>
                <div className={styles.colSpan2}>
                  <label className={styles.label}>Impact Description</label>
                  <textarea
                    value={volunteer.impactDescription || ''}
                    onChange={(e) => handleNestedArrayChange<VolunteerData>('volunteers', index, 'impactDescription', e.target.value)}
                    rows={2}
                    className={styles.textarea}
                    placeholder="Describe their impact..."
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleOpenUserSearchModal}
            className={styles.addButton}
          >
            <Plus className={styles.iconSmall} />
            Add Volunteer from List
          </button>
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
                  <label className={styles.label}>Name *</label>
                  <input
                    type="text"
                    value={collaborator.name}
                    onChange={(e) => handleNestedArrayChange<CollaboratorData>('collaborators', index, 'name', e.target.value)}
                    className={styles.input}
                    placeholder="Organization name"
                    required
                  />
                </div>
                <div>
                  <label className={styles.label}>Logo URL</label>
                  <input
                    type="url"
                    value={collaborator.logoURL || ''}
                    onChange={(e) => handleNestedArrayChange<CollaboratorData>('collaborators', index, 'logoURL', e.target.value)}
                    className={styles.input}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <div>
                  <label className={styles.label}>Website</label>
                  <input
                    type="url"
                    value={collaborator.website || ''}
                    onChange={(e) => handleNestedArrayChange<CollaboratorData>('collaborators', index, 'website', e.target.value)}
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
                  <label className={styles.label}>Name *</label>
                  <input
                    type="text"
                    value={sponsor.name}
                    onChange={(e) => handleNestedArrayChange<SponsorData>('sponsors', index, 'name', e.target.value)}
                    className={styles.input}
                    placeholder="Sponsor name"
                    required
                  />
                </div>
                <div>
                  <label className={styles.label}>Logo URL</label>
                  <input
                    type="url"
                    value={sponsor.logoURL || ''}
                    onChange={(e) => handleNestedArrayChange<SponsorData>('sponsors', index, 'logoURL', e.target.value)}
                    className={styles.input}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <div>
                  <label className={styles.label}>Website</label>
                  <input
                    type="url"
                    value={sponsor.website || ''}
                    onChange={(e) => handleNestedArrayChange<SponsorData>('sponsors', index, 'website', e.target.value)}
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
                ? 'This project will be visible to everyone.'
                : 'This project will only be visible to authorized users.'
              }
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={() => {
              setFormData({
                name: '',
                location: { city: '', division: '' },
                startDate: '',
                endDate: '',
                description: '',
                tags: [''],
                thumbnailURL: '',
                bannerURL: '',
                gallerySpreadsheetURL: '',
                financialRecordURL: '',
                impact: { peopleServed: 0, volunteersEngaged: 0, materialsDistributed: 0 },
                volunteers: [],
                collaborators: [],
                sponsors: [],
                status: 'Upcoming',
                isPublic: true
              });
              setMessage(null);
            }}
            className={styles.resetButton}
          >
            Reset Form
          </button>
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
              <>
                <Plus className={styles.iconSmall} />
                Create Project
              </>
            )}
          </button>
        </div>
      </form>

      {/* User Search Modal */}
      {showUserSearchModal && (
        <UserSearchModal
          onSelectUser={handleUserSelectedAsVolunteer}
          onClose={handleCloseUserSearchModal}
        />
      )}
    </div>
  );
};

export default CreateProjectForm;