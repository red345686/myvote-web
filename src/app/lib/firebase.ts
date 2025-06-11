import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'; // Added setDoc

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Fixed admin Ethereum addresses - these cannot be changed without code update
export const ADMIN_ETH_ADDRESSES = [
    '0x9a77A46f27ee0663fe44BC3b51dBba37092Cf9c0', // Replace with your actual admin addresses
    // Add more fixed admin Ethereum addresses here
];
export const ADMIN_EMAILS = [
    'harshitbinu23090@gmail.com',
    'harshitspotify123@gmail.com'
];

// Dynamic admin emails - fetch from Firestore, fallback to hardcoded if empty
export const getAdminEmails = async () => {
    try {
        console.log('Fetching admin emails from Firestore...');
        const adminDocRef = doc(db, 'config', 'adminEmails');
        console.log('Document reference created');

        const adminDoc = await getDoc(adminDocRef);
        console.log('Document fetch completed, exists:', adminDoc.exists());

        if (adminDoc.exists()) {
            const data = adminDoc.data();
            console.log('Admin document data:', data);
            const emails = data?.emails || [];
            console.log('Admin emails fetched from Firestore:', emails);

            // If Firestore returns empty array, use hardcoded emails
            if (emails.length === 0) {
                console.log('Firestore emails array is empty, using hardcoded emails');
                return ADMIN_EMAILS;
            }

            return emails;
        } else {
            console.log('No admin emails config found - document does not exist, using hardcoded emails');
            return ADMIN_EMAILS;
        }
    } catch (error) {
        console.error('Error fetching admin emails:', error);

        // Check if it's a permission error
        if (typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === 'permission-denied') {
            console.error('PERMISSION DENIED: Check your Firestore security rules!');
        }

        console.log('Falling back to hardcoded emails due to error');
        return ADMIN_EMAILS;
    }
};

// Check if user is admin by email
export const isAdminByEmail = async (email: string): Promise<boolean> => {
    const adminEmails = await getAdminEmails();
    return adminEmails.includes(email);
};

// Check if user is admin by Ethereum address
export const isAdminByEthAddress = (ethAddress: string): boolean => {
    return ADMIN_ETH_ADDRESSES.includes(ethAddress.toLowerCase());
};

// Combined admin check - returns true if user is admin by either method
export const isAdmin = async (email?: string, ethAddress?: string): Promise<boolean> => {
    if (ethAddress && isAdminByEthAddress(ethAddress)) return true;
    if (email && await isAdminByEmail(email)) return true;
    return false;
};

// Function to add admin email
export const addAdminEmail = async (email: string) => {
    try {
        const adminDocRef = doc(db, 'config', 'adminEmails');
        const adminDoc = await getDoc(adminDocRef);
        const currentEmails = adminDoc.exists() ? adminDoc.data()?.emails || [] : [];

        if (!currentEmails.includes(email)) {
            await setDoc(adminDocRef, {
                emails: [...currentEmails, email],
                lastUpdated: new Date().toISOString()
            });
        }
    } catch (error) {
        console.error('Error adding admin email:', error);
        throw error;
    }
};

// Add this to firebase.ts for testing
export const testFirestore = async () => {
    try {
        console.log('Testing Firestore connection...');
        const emails = await getAdminEmails();
        console.log('Admin emails found:', emails);
        return emails;
    } catch (error) {
        console.error('Firestore test failed:', error);
        return null;
    }
};

export default app;