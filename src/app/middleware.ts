import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if the request is for admin routes
    if (pathname.startsWith('/admin')) {
        // Check for admin authentication
        const adminAuth = request.cookies.get('adminAuth')?.value;
        const userEmail = request.cookies.get('userEmail')?.value;

        // If not authenticated, redirect to login
        if (!adminAuth || adminAuth !== 'true') {
            const loginUrl = new URL('/Login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*']
};
