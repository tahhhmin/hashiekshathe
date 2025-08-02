// app/projects/page.tsx
import ProjectCard from '@/components/project-page/ProjectCard';
import styles from './page.module.css';
import { connectDB } from '@/config/connectDB';
import Project from '@/models/Project';
import { HandCoins } from 'lucide-react';

// Define the Project type for TypeScript
interface Project {
    _id: string;
    name: string;
    slug: string;
    thumbnailURL: string;
    location: {
        city: string;
        division?: string;
        country?: string; // Added 'country' to match the mapping below
    };
    description: string;
    tags: string[];
}

// This is a Server Component - fetch data directly from the database
const ProjectsPage = async () => {
    let projects: Project[] = [];
    let error: string | null = null; // Correctly type the error variable

    try {
        console.log('ProjectsPage: Attempting to connect to DB...');
        await connectDB();
        console.log('ProjectsPage: DB connected successfully.');

        console.log('ProjectsPage: Attempting to find public projects...');
        const rawProjects = await Project.find({ isPublic: true }).sort({ createdAt: -1 }).lean(); // Using .lean() for performance
        console.log('ProjectsPage: Found projects count:', rawProjects.length);

        // Convert MongoDB documents to plain objects using JSON.parse(JSON.stringify())
        // This removes all MongoDB-specific methods and properties, which is necessary for server components
        // and passing data down to client components.
        projects = JSON.parse(JSON.stringify(rawProjects));

    } catch (err: unknown) { // Change 'any' to 'unknown' for type safety
        console.error("ProjectsPage: Error fetching projects:", err);
        
        // Use a type guard to safely check the error object
        if (err instanceof Error) {
            error = err.message || 'Failed to fetch projects';
        } else {
            error = 'An unexpected error occurred';
        }
    }

    return (
        <section className='section'>
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.header}>
                        <div className={styles.title}>
                           <HandCoins className={styles.icon}/> <h2>Our Projects</h2>
                        </div>
                        <h3 className={styles.subtitle}>Subtitle</h3>
                    </div>

                    <div className={styles.content}>
                        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                            Iure harum nobis placeat, facere, odit mollitia velit illo
                            dolor temporibus pariatur officia magni eius nihil accusamus
                            excepturi. Expedita quis facilis aliquid?
                        </p>
                    </div>
                </div>

                <div className={styles.content}>
                    {error && (
                        <div className={styles.error}>
                            {error}
                        </div>
                    )}

                    {projects.length === 0 && !error && (
                        <p className={styles.noProjects}>
                            No public projects found at this time.
                        </p>
                    )}

                    {projects.length > 0 && (
                        <div className={styles.projectGrid}>
                            {projects.map((project: Project) => (
                                <ProjectCard
                                    key={project._id}
                                    project={project}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProjectsPage;
