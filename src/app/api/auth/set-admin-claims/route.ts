import { NextRequest, NextResponse } from 'next/server';

// For now, we'll simulate setting admin claims since we don't have Firebase Admin SDK set up
export async function POST(request: NextRequest) {
    try {
        const { uid, email } = await request.json();

        if (!uid || !email) {
            return NextResponse.json(
                { error: 'UID and email are required' },
                { status: 400 }
            );
        }

        // Check if email is in allowed admin emails
        const ADMIN_EMAILS = [
            'harshitbinu23090@gmail.com',
            'harshitspotify123@gmail.com'
        ];

        if (!ADMIN_EMAILS.includes(email)) {
            return NextResponse.json(
                { error: 'Email not authorized for admin access' },
                { status: 403 }
            );
        }

        // For development, we'll just return success
        // In production, you would use Firebase Admin SDK here
        console.log(`Setting admin claims for user ${uid} with email ${email}`);

        return NextResponse.json({
            success: true,
            message: 'Admin claims set successfully',
            claims: {
                admin: true,
                email: email,
                role: 'admin'
            }
        });

    } catch (error) {
        console.error('Error setting admin claims:', error);
        return NextResponse.json(
            { error: 'Failed to set admin claims' },
            { status: 500 }
        );
    }
}
