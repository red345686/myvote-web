import { apiService } from './api';
import { auth, checkAdminClaims, getIdToken, onAuthStateChange, signOutUser } from './firebase';

/**
 * Admin Service for managing administrative operations
 */
class AdminService {
    private adminAddress: string | null = null;
    private currentAddress: string | null = null;
    private isAdminFlag: boolean = false;
    private devMode: boolean = false;
    private firebaseUser: any = null;

    /**
     * Initialize the admin service
     */
    async initialize(): Promise<boolean> {
        try {
            // Check if user is authenticated with Firebase
            const user = auth.currentUser;
            if (!user) {
                console.log('No authenticated user found');
                return false;
            }

            // Check if user has admin claims
            const hasAdminClaims = await checkAdminClaims();
            if (!hasAdminClaims) {
                console.log('User does not have admin claims');
                return false;
            }

            // Set admin properties
            this.firebaseUser = user;
            this.adminAddress = '0x9a77A46f27ee0663fe44BC3b51dBba37092Cf9c0';
            this.currentAddress = this.adminAddress;
            this.isAdminFlag = true;
            this.devMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true';

            // Get Firebase ID token and set it for API calls
            const idToken = await getIdToken();
            if (idToken) {
                apiService.setFirebaseToken(idToken);
            }

            apiService.setAdminAddress(this.adminAddress);
            console.log('Admin service initialized with Firebase Auth');
            return true;

        } catch (error) {
            console.error('Error initializing admin service:', error);
            return false;
        }
    }

    /**
     * Check if current user is admin
     */
    isAdmin(): boolean {
        return this.isAdminFlag;
    }

    /**
     * Check if we're in development mode
     */
    isDevMode(): boolean {
        return this.devMode;
    }

    /**
     * Get current address
     */
    getCurrentAddress(): string | null {
        return this.currentAddress;
    }

    /**
     * Get admin address
     */
    getAdminAddress(): string | null {
        return this.adminAddress;
    }

    /**
     * Get current user
     */
    getCurrentUser() {
        return this.firebaseUser;
    }

    /**
     * Listen to auth state changes
     */
    onAuthStateChange(callback: (user: any) => void) {
        return onAuthStateChange(callback);
    }

    /**
     * List voters with pagination and filtering
     */
    async listVoters(options: any = {}) {
        try {
            return await apiService.listVoters(options);
        } catch (error) {
            console.error('Error listing voters:', error);
            throw error;
        }
    }

    /**
     * Verify a voter
     */
    async verifyVoter(voterId: string, notes: string = '') {
        try {
            return await apiService.verifyVoter(voterId, notes);
        } catch (error) {
            console.error('Error verifying voter:', error);
            throw error;
        }
    }

    /**
     * Get admin statistics
     */
    async getAdminStats() {
        try {
            return await apiService.getAdminStats();
        } catch (error) {
            console.error('Error getting admin stats:', error);
            throw error;
        }
    }

    /**
     * Get admin logs
     */
    async getAdminLogs(options: any = {}) {
        try {
            return await apiService.getAdminLogs(options);
        } catch (error) {
            console.error('Error getting admin logs:', error);
            throw error;
        }
    }

    /**
     * Generate QR code for voter
     */
    async generateQRCode(voterAddress: string) {
        try {
            return await apiService.generateQRCode(voterAddress);
        } catch (error) {
            console.error('Error generating QR code:', error);
            throw error;
        }
    }

    /**
     * Generate voting QR code using Aadhar
     */
    async generateVotingQR(aadharNumber: string) {
        try {
            return await apiService.generateVotingQR(aadharNumber);
        } catch (error) {
            console.error('Error generating voting QR:', error);
            throw error;
        }
    }

    /**
     * Get voting statistics
     */
    async getVotingStats() {
        try {
            return await apiService.getVotingStats();
        } catch (error) {
            console.error('Error getting voting stats:', error);
            throw error;
        }
    }

    /**
     * Get summary statistics
     */
    async getSummaryStats() {
        try {
            return await apiService.getSummaryStats();
        } catch (error) {
            console.error('Error getting summary stats:', error);
            throw error;
        }
    }

    /**
     * Check API health
     */
    async checkHealth() {
        try {
            return await apiService.healthCheck();
        } catch (error) {
            console.error('Error checking health:', error);
            throw error;
        }
    }

    /**
     * Logout admin
     */
    async logout() {
        try {
            await signOutUser();
            this.firebaseUser = null;
            this.isAdminFlag = false;
            this.adminAddress = null;
            this.currentAddress = null;
            localStorage.removeItem('adminAuth');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('loginMethod');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }
}

// Create and export singleton instance
export const adminService = new AdminService();
