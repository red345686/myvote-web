'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmail, isAdminByEmail, testFirestore } from '../lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isRegistering, setIsRegistering] = useState(false);
    const router = useRouter();

    useEffect(() => {
        testFirestore();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Check if email is in the admin emails list
            const emailIsAdmin = await isAdminByEmail(email);

            if (!emailIsAdmin) {
                setError('Access denied. This email is not authorized for admin access.');
                setLoading(false);
                return;
            }

            let userCredential;

            if (isRegistering) {
                // Create new user account
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
                console.log('User account created successfully');
            } else {
                // Sign in existing user
                userCredential = await signInWithEmail(email, password);
            }

            const user = userCredential.user;

            // For development - simulate admin claims without Firebase Admin SDK
            await simulateAdminClaims(user.uid, email);

            // Store auth info
            localStorage.setItem('adminAuth', 'true');
            localStorage.setItem('userEmail', email);
            localStorage.setItem('loginMethod', 'firebase');
            localStorage.setItem('isAdmin', 'true');

            console.log('Authentication successful, redirecting to admin dashboard');
            router.push('/admin');

        } catch (err: any) {
            console.error('Authentication error:', err);
            if (err.code === 'auth/user-not-found' && !isRegistering) {
                setError('No account found. Try registering first.');
            } else if (err.code === 'auth/email-already-in-use' && isRegistering) {
                setError('Account already exists. Try signing in instead.');
            } else if (err.code === 'auth/wrong-password') {
                setError('Incorrect password. Please try again.');
            } else if (err.code === 'auth/invalid-email') {
                setError('Invalid email format.');
            } else if (err.code === 'auth/weak-password') {
                setError('Password should be at least 6 characters.');
            } else if (err.code === 'auth/too-many-requests') {
                setError('Too many failed attempts. Please try again later.');
            } else if (err.code === 'auth/operation-not-allowed') {
                setError('Email/password authentication is not enabled. Please contact administrator.');
            } else {
                setError(`${isRegistering ? 'Registration' : 'Login'} failed. Please try again.`);
            }
        } finally {
            setLoading(false);
        }
    };

    const simulateAdminClaims = async (uid: string, email: string) => {
        try {
            const response = await fetch('/api/auth/set-admin-claims', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ uid, email }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Response not OK:', response.status, errorText);
                throw new Error(`HTTP ${response.status}: Failed to set admin claims`);
            }

            const result = await response.json();
            console.log('Admin claims set successfully:', result);
        } catch (error) {
            console.error('Error setting admin claims:', error);
            // Don't throw error - continue with login for development
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full space-y-8"
            >
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {isRegistering ? 'Create Admin Account' : 'Admin Login'}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {isRegistering ? 'Register to access the admin dashboard' : 'Sign in to access the admin dashboard'}
                    </p>
                </div>

                <div className="flex justify-center space-x-4">
                    <button
                        type="button"
                        onClick={() => {
                            setIsRegistering(false);
                            setError(null);
                        }}
                        className={`px-4 py-2 text-sm font-medium rounded-md ${!isRegistering
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setIsRegistering(true);
                            setError(null);
                        }}
                        className={`px-4 py-2 text-sm font-medium rounded-md ${isRegistering
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Register
                    </button>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
                        >
                            {error}
                        </motion.div>
                    )}

                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete={isRegistering ? "new-password" : "current-password"}
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                minLength={6}
                            />
                        </div>
                    </div>

                    {isRegistering && (
                        <div className="text-sm text-gray-600">
                            Password must be at least 6 characters long.
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {isRegistering ? 'Creating account...' : 'Signing in...'}
                                </div>
                            ) : (
                                isRegistering ? 'Create Account' : 'Sign in'
                            )}
                        </button>
                    </div>
                </form>

                <div className="text-center">
                    <p className="text-xs text-gray-500">
                        Authorized emails: harshitbinu23090@gmail.com, harshitspotify123@gmail.com
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
