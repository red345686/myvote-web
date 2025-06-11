import { apiService } from './api';

/**
 * Admin Service for managing administrative operations
 */
class AdminService {
    private adminAddress: string | null = null;
    private currentAddress: string | null = null;
    private isAdminFlag: boolean = false;
    private devMode: boolean = false;

    /**
     * Initialize the admin service
     */
    async initialize(): Promise<boolean> {
        try {
            // Hardcoded admin address from the attachment
            this.adminAddress = '0x9a77A46f27ee0663fe44BC3b51dBba37092Cf9c0';
            this.currentAddress = this.adminAddress;
            this.isAdminFlag = true;
            this.devMode = false; // No longer in dev mode since we're using hardcoded admin

            apiService.setAdminAddress(this.adminAddress);
            console.log('Admin service initialized with hardcoded admin address:', this.adminAddress);
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
    logout() {
        // For demo purposes, don't actually logout
        console.log('Logout called - but admin remains authenticated for demo');
    }
}

// Create and export singleton instance
export const adminService = new AdminService();
