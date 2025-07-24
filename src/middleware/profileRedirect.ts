// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

// Define your protected routes
const protectedRoutes = ['/user/profile']; // Add other paths like /dashboard if needed

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Check if the current path is one of the protected routes
    if (protectedRoutes.includes(path)) {
        const token = request.cookies.get('token')?.value;

        if (!token) {
            // No token found, redirect to login page
            console.log(`Middleware: No token found for protected route ${path}. Redirecting to /login-combined.`);
            return NextResponse.redirect(new URL('/login-combined', request.url));
        }

        try {
            // Verify the token
            // IMPORTANT: Make sure process.env.JWT_SECRET is accessible here.
            // In Next.js middleware, environment variables are available.
            jwt.verify(token, process.env.JWT_SECRET!);
            // If verification is successful, proceed to the requested route
            console.log(`Middleware: Token valid for protected route ${path}.`);
            return NextResponse.next();
        } catch (error) {
            // Token is invalid or expired
            console.error(`Middleware: Invalid or expired token for protected route ${path}:`, error);
            // Clear the invalid token cookie and redirect to login
            const response = NextResponse.redirect(new URL('/login-combined', request.url));
            response.cookies.set('token', '', { httpOnly: true, expires: new Date(0) }); // Clear invalid token
            return response;
        }
    }

    // For non-protected routes, allow the request to proceed
    return NextResponse.next();
}

// Optionally, you can configure which paths the middleware applies to
// This is an alternative to the `if (protectedRoutes.includes(path))` check
// but `matcher` is more efficient for Next.js to optimize.
// For this example, we'll keep the `includes` check for clarity,
// but for production, `matcher` is often preferred.
/*
export const config = {
  matcher: ['/user/profile', '/dashboard'], // Add all protected paths here
};
*/
