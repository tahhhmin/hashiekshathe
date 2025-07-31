import { NextResponse } from 'next/server';
import Project from '@/models/Project';
import { connectDB } from '@/config/connectDB';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;

  try {
    await connectDB();

    // Try to find by _id first, then by slug if it's not a valid ObjectId
    let project;
    if (slug.match(/^[0-9a-fA-F]{24}$/)) { // Check if it's a valid MongoDB ObjectId
      project = await Project.findById(slug);
    }
    if (!project) {
      project = await Project.findOne({ slug: slug });
    }

    if (!project) {
      return NextResponse.json({ success: false, message: 'Project not found.' }, { status: 404 });
    }

    // Add logic here to restrict private projects for non-admin users
    // if (!project.isPublic && !isAdmin(request)) {
    //   return NextResponse.json({ success: false, message: 'Unauthorized access to private project.' }, { status: 403 });
    // }

    return NextResponse.json({ success: true, project }, { status: 200 });
  } catch (error) {
    console.error(`Error fetching project with slug/id ${slug}:`, error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}

// You might also want PUT/PATCH for updating and DELETE for deleting
export async function PUT(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;
  try {
    await connectDB();
    // Authentication and authorization checks for admin
    // if (!isAdmin(request)) { return NextResponse.json({ message: 'Unauthorized' }, { status: 401 }); }

    const body = await request.json();
    const updatedProject = await Project.findOneAndUpdate(
      { $or: [{ _id: slug }, { slug: slug }] }, // Find by _id or slug
      body,
      { new: true, runValidators: true } // Return the updated document and run schema validators
    );

    if (!updatedProject) {
      return NextResponse.json({ success: false, message: 'Project not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, project: updatedProject }, { status: 200 });
  } catch (error) {
    console.error(`Error updating project with slug/id ${slug}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to update project.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;
  try {
    await connectDB();
    // Authentication and authorization checks for admin
    // if (!isAdmin(request)) { return NextResponse.json({ message: 'Unauthorized' }, { status: 401 }); }

    const deletedProject = await Project.findOneAndDelete({ $or: [{ _id: slug }, { slug: slug }] });

    if (!deletedProject) {
      return NextResponse.json({ success: false, message: 'Project not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Project deleted successfully.' }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting project with slug/id ${slug}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete project.' },
      { status: 500 }
    );
  }
}