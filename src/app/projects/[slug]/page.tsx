// app/projects/[slug]/page.tsx
// This is a Server Component, no "use client" directive needed at the top

import { notFound } from 'next/navigation'; // For handling 404 cases
import Image from 'next/image';
import styles from './page.module.css'; // Optional: Create a separate CSS module for this page
import { connectDB } from '@/config/connectDB'; // Import connectDB
import Project from '@/models/Project'; // Import Project model
import User from '@/models/User'; // Import User model (assuming you have one)

// Define the Project type (or import from a shared types file like src/types/index.ts)
interface VolunteerDetail {
  volunteerUserID: string;
  volunteerEmail: string;
  volunteeringHours: number;
  certificateURL?: string;
  impactDescription?: string;
  _id: string; // MongoDB ObjectId for the embedded document
}

interface Project {
  _id: string;
  name: string;
  slug: string;
  thumbnailURL: string;
  bannerURL?: string;
  location: {
    city: string;
    division?: string;
    country: string;
  };
  description: string;
  tags: string[];
  startDate: string;
  impact?: any;
  volunteers?: VolunteerDetail[]; // Correctly define volunteers as an array of VolunteerDetail objects
  collaborators?: { name: string; logoURL?: string; website?: string }[];
  sponsors?: { name: string; logoURL?: string; website?: string }[];
  status: string;
}

// Define the props for the dynamic page component
interface ProjectProfilePageProps {
  params: { slug: string };
}

const ProjectProfilePage = async ({ params }: ProjectProfilePageProps) => {
  const { slug } = params;

  let project: Project | null = null;
  let error: string | null = null;
  let volunteersWithUserDetails: any[] = []; // To store enriched volunteer data

  try {
    // Direct database interaction for server component
    await connectDB(); // Connect to the database
    const rawProject = await Project.findOne({ slug: slug, isPublic: true }).lean(); // Use .lean() for plain JS objects

    if (!rawProject) {
      notFound(); // If project not found or not public, trigger 404
    }

    // Convert Mongoose document to plain object for consistency and to pass to client components if needed
    // Although in this server component, we can use the lean object directly.
    project = JSON.parse(JSON.stringify(rawProject));

    // Fetch user details for each volunteer
    if (project?.volunteers && project.volunteers.length > 0) {
      const volunteerUserIDs = project.volunteers.map(v => v.volunteerUserID);
      const users = await User.find({ _id: { $in: volunteerUserIDs } }).lean();

      volunteersWithUserDetails = project.volunteers.map(vol => {
        const user = users.find(u => u._id.toString() === vol.volunteerUserID);
        return {
          ...vol,
          userName: user?.name || user?.username || 'Unknown User', // Prioritize name, then username
          userEmail: user?.email || vol.volunteerEmail, // Fallback to project's stored email
        };
      });
    }

  } catch (err: any) {
    console.error(`Error fetching project profile for slug "${slug}":`, err);
    error = err instanceof Error ? err.message : String(err);
    // If an error occurs, and project wasn't found (or another severe error), we might still want to show 404
    if (error.includes('Failed to fetch project') || error.includes('not found')) {
      notFound();
    }
  }

  if (!project) {
    return (
      <div className={styles.container}>
        <h1 className={styles.mainHeading}>Project Not Found</h1>
        {error && <p className={styles.errorMessage}>{error}</p>}
        {!error && <p className={styles.noProjectMessage}>The project you are looking for does not exist or is not public.</p>}
      </div>
    );
  }

  return (
    <section className='section'>
    <div className={styles.container}>
      {project.bannerURL && (
        <div className={styles.bannerImageWrapper}>
          <Image
            src={project.bannerURL}
            alt={`${project.name} banner`}
            layout="fill"
            objectFit="cover"
            className={styles.bannerImage}
          />
        </div>
      )}

      <div className={styles.contentWrapper}>
        <h1 className={styles.projectTitle}>{project.name}</h1>
        <p className={styles.projectLocation}>
          Location: {project.location.city}, {project.location.division ? `${project.location.division}, ` : ''}{project.location.country}
        </p>
        <p className={styles.projectDate}>
          Start Date: {new Date(project.startDate).toLocaleDateString()}
        </p>
        <p className={styles.projectStatus}>
          Status: {project.status}
        </p>

        <div className={styles.tagsContainer}>
          {project.tags.map((tag, index) => (
            <span key={index} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>

        <p className={styles.projectDescription}>{project.description}</p>

        {project.impact && (
          <div className={styles.section}>
            <h2>Impact</h2>
            {/* Render specific impact details here */}
            {project.impact.peopleServed > 0 && <p>People Served: {project.impact.peopleServed}</p>}
            {project.impact.volunteersEngaged > 0 && <p>Volunteers Engaged: {project.impact.volunteersEngaged}</p>}
            {project.impact.materialsDistributed > 0 && <p>Materials Distributed: {project.impact.materialsDistributed}</p>}
            {/* Add more impact fields as needed */}
          </div>
        )}

        {volunteersWithUserDetails.length > 0 && (
          <div className={styles.section}>
            <h2>Volunteers</h2>
            <ul className={styles.list}>
              {volunteersWithUserDetails.map((volunteer, index) => (
                <li key={volunteer._id || index}>
                  <strong>{volunteer.userName}</strong> ({volunteer.userEmail}) - {volunteer.volunteeringHours} hours
                  {volunteer.impactDescription && ` - "${volunteer.impactDescription}"`}
                </li>
              ))}
            </ul>
          </div>
        )}

        {project.collaborators && project.collaborators.length > 0 && (
          <div className={styles.section}>
            <h2>Collaborators</h2>
            <ul className={styles.list}>
              {project.collaborators.map((collaborator, index) => (
                <li key={index}>
                  {collaborator.name}
                  {collaborator.website && ` - `}
                  {collaborator.website && <a href={collaborator.website} target="_blank" rel="noopener noreferrer">{collaborator.website}</a>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {project.sponsors && project.sponsors.length > 0 && (
          <div className={styles.section}>
            <h2>Sponsors</h2>
            <ul className={styles.list}>
              {project.sponsors.map((sponsor, index) => (
                <li key={index}>
                  {sponsor.name}
                  {sponsor.website && ` - `}
                  {sponsor.website && <a href={sponsor.website} target="_blank" rel="noopener noreferrer">{sponsor.website}</a>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
    </section>
  );
};

export default ProjectProfilePage;