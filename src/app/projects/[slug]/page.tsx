// app/projects/[slug]/page.tsx
// This is a Server Component, no "use client" directive needed at the top

import { notFound } from 'next/navigation'; // For handling 404 cases
import Image from 'next/image';
import styles from './page.module.css'; // Optional: Create a separate CSS module for this page
import { connectDB } from '@/config/connectDB'; // Import connectDB
import Project from '@/models/Project'; // Import Project model
import User from '@/models/User'; // Import User model (assuming you have one)
import { Types } from 'mongoose'; // Import Mongoose Types for ObjectId conversion

// Define the VolunteerDetail type
interface VolunteerDetail {
    volunteerUserID: string;
    volunteerEmail: string;
    volunteeringHours: number;
    certificateURL?: string;
    impactDescription?: string;
    _id: string; // MongoDB ObjectId for the embedded document
}

// Define the User type for data fetched with .lean()
interface LeanUser {
    _id: string;
    name?: string;
    username?: string;
    email?: string;
}

// Define the Impact type based on the rendering logic
interface Impact {
    peopleServed?: number;
    volunteersEngaged?: number;
    materialsDistributed?: number;
}

// Define the Project type (or import from a shared types file like src/types/index.ts)
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
    impact?: Impact; // Correctly typed
    volunteers?: VolunteerDetail[]; // Correctly define volunteers as an array of VolunteerDetail objects
    collaborators?: { name: string; logoURL?: string; website?: string }[];
    sponsors?: { name: string; logoURL?: string; website?: string }[];
    status: string;
    isPublic: boolean;
}

// Define the props for the dynamic page component
interface ProjectProfilePageProps {
    params: { slug: string };
}

// Define the type for the enriched volunteer data
interface EnrichedVolunteerDetail extends VolunteerDetail {
    userName: string;
    userEmail: string;
}

const ProjectProfilePage = async ({ params }: ProjectProfilePageProps) => {
    const { slug } = params;

    let project: Project | null = null;
    let error: string | null = null;
    let volunteersWithUserDetails: EnrichedVolunteerDetail[] = []; // Now correctly typed

    try {
        // Direct database interaction for server component
        await connectDB(); // Connect to the database
        const rawProject = await Project.findOne({ slug: slug, isPublic: true }).lean(); // Use .lean() for plain JS objects

        if (!rawProject) {
            notFound(); // If project not found or not public, trigger 404
        }

        // Convert Mongoose document to plain object for consistency and to pass to client components if needed
        // `JSON.parse(JSON.stringify(rawProject))` is a simple way to serialize and deserialize,
        // which converts Mongoose objects and dates to their plain JSON representations.
        project = JSON.parse(JSON.stringify(rawProject)) as Project;

        // Fetch user details for each volunteer
        if (project?.volunteers && project.volunteers.length > 0) {
            // Get unique volunteer IDs to query the User collection efficiently
            const volunteerUserIDs = project.volunteers.map(v => new Types.ObjectId(v.volunteerUserID));
            const users = (await User.find({ _id: { $in: volunteerUserIDs } }).lean()) as LeanUser[];

            volunteersWithUserDetails = project.volunteers.map(vol => {
                const user = users.find(u => u._id === vol.volunteerUserID);
                return {
                    ...vol,
                    // Use a fallback for the user's name
                    userName: user?.name || user?.username || 'Unknown User',
                    // Use the fetched email, or fallback to the one stored in the project if the user's email isn't available
                    userEmail: user?.email || vol.volunteerEmail,
                };
            });
        }

    } catch (err: unknown) { // Use 'unknown' instead of 'any' for type safety
        console.error(`Error fetching project profile for slug "${slug}":`, err);

        // Safely check if the error is an instance of Error to get its message
        if (err instanceof Error) {
            error = err.message;
        } else {
            // If the error is not an Error object, convert it to a string
            error = String(err);
        }

        // If a specific error indicates a 404 condition, we can still call notFound()
        if (error.includes('Failed to fetch project') || error.includes('not found')) {
            notFound();
        }
    }

    if (!project) {
        // This block is technically unreachable now because of the `notFound()` call above,
        // but it's good practice to keep it for defensive programming.
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
                            {project.impact.peopleServed && project.impact.peopleServed > 0 && <p>People Served: {project.impact.peopleServed}</p>}
                            {project.impact.volunteersEngaged && project.impact.volunteersEngaged > 0 && <p>Volunteers Engaged: {project.impact.volunteersEngaged}</p>}
                            {project.impact.materialsDistributed && project.impact.materialsDistributed > 0 && <p>Materials Distributed: {project.impact.materialsDistributed}</p>}
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