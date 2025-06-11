import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
const API_LOG = process.env.NEXT_PUBLIC_API_LOG === 'true';
const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_ADMIN_ADDRESS || '0x9a77A46f27ee0663fe44BC3b51dBba37092Cf9c0';

/**
 * Helper function to log API requests and responses if enabled
 */
function logAPI(method: string, url: string, data?: any, response?: any, error?: any) {
  if (!API_LOG) return;

  const timestamp = new Date().toISOString();
  const logStyle = error ? 'color: red' : 'color: green';

  console.group(`%c[${timestamp}] ${method} ${url}`, logStyle);

  if (data) {
    console.log('Request:', data);
  }

  if (response) {
    console.log('Response:', response);
  }

  if (error) {
    console.error('Error:', error);
  }

  console.groupEnd();
}

/**
 * Types for API requests and responses
 */
export interface Voter {
  blockchainAddress: string;
  name?: string;
  gender?: string;
  dob?: string;
  city?: string;
  state?: string;
  aadharNumber?: string;
  phoneNumber?: string;
  email?: string;
  isVerified: boolean;
  verificationDate?: string;
  rawData?: {
    name?: string;
    [key: string]: any;
  };
  encryptedData?: {
    gender?: string;
    [key: string]: any;
  };
  district?: string;
  aadharImage?: string;
  id?: string;
}

export interface AdminStats {
  id?: string;
  date?: string;
  totalRegisteredVoters: number;
  totalVerifiedVoters: number;
  dailyRegistrations: number;
  dailyVerifications: number;
  pendingVerifications: number;
  maleVoters?: number;
  femaleVoters?: number;
  otherGenderVoters?: number;
  stateWiseDistribution?: {
    [stateName: string]: number;
  };
  ageDistribution: {
    below18: number;
    age18to25: number;
    age26to35: number;
    age36to45: number;
    age46to60: number;
    above60: number;
  };
  registrationSuccess?: number;
  registrationFailure?: number;
  verificationSuccess?: number;
  verificationFailure?: number;
  totalTransactions?: number;
  gasUsed?: number;
  averageResponseTime?: number;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

/**
 * API service for making HTTP requests to the backend
 */
class ApiService {
  private adminAddress: string | null = null;

  /**
   * Set the admin address for making administrative API calls
   */
  setAdminAddress(address: string): void {
    this.adminAddress = address;
  }

  /**
   * Get the headers for an API request
   * If an admin request, includes the admin address
   */
  private getHeaders(isAdminRequest: boolean = false): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (isAdminRequest && this.adminAddress) {
      headers['x-admin-address'] = this.adminAddress;
    }

    return headers;
  }

  /**
   * Get axios config for API requests
   */
  private getRequestConfig(isAdminRequest: boolean = false) {
    return {
      headers: this.getHeaders(isAdminRequest),
      withCredentials: false,
    };
  }

  /**
   * Health check to ensure the API is running
   */
  async healthCheck() {
    try {
      const url = `${API_URL}/health`;
      logAPI('GET', url);

      const response = await axios.get(url, this.getRequestConfig());
      logAPI('GET', url, null, response.data);

      return response.data;
    } catch (error) {
      logAPI('GET', `${API_URL}/health`, null, null, error);
      console.error('Health check failed:', error);
      return { status: 'error', services: { database: false } };
    }
  }

  /**
   * Register a new voter
   */
  async registerVoter(data: {
    name: string;
    gender: string;
    dob: string;
    city: string;
    state: string;
    aadharNumber: string;
    phoneNumber: string;
    email: string;
    aadharImageUrl?: string;
  }) {
    try {
      const response = await axios.post(
        `${API_URL}/voters/register`,
        data,
        this.getRequestConfig()
      );
      return response.data;
    } catch (error) {
      console.error('Error registering voter:', error);
      throw new Error('Failed to register voter');
    }
  }

  /**
   * Verify a voter (admin only)
   */
  async verifyVoter(voterAddress: string, verificationNotes: string = '') {
    try {
      const url = `${API_URL}/voters/verify`;

      logAPI('POST', url);

      if (!this.adminAddress) {
        throw new Error("Admin address not set. Cannot verify voter.");
      }

      const data = {
        adminAddress: this.adminAddress,
        voterAddress: voterAddress,
        verificationNotes: verificationNotes || "Verified manually after document check"
      };

      const response = await axios.post(url, data, this.getRequestConfig(true));

      logAPI('POST', url, data, response.data);

      return response.data;
    } catch (error: any) {
      logAPI('POST', `${API_URL}/voters/verify`, null, null, error);
      console.error("API Error:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      throw error;
    }
  }

  /**
   * Check voter status
   */
  async checkVoterStatus(address: string) {
    try {
      const response = await axios.get(`${API_URL}/voters/status/${address}`, this.getRequestConfig());
      return response.data;
    } catch (error) {
      console.error('Error checking voter status:', error);
      throw new Error('Failed to check voter status');
    }
  }

  /**
   * Get voter details
   */
  async getVoterDetails(address: string) {
    try {
      const response = await axios.get(`${API_URL}/voters/${address}`, this.getRequestConfig());
      return response.data;
    } catch (error) {
      console.error('Error getting voter details:', error);
      throw new Error('Failed to get voter details');
    }
  }

  /**
   * List all voters (admin only)
   */
  async listVoters(options = {}) {
    try {
      // Convert options to query params
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(options)) {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      }

      const queryString = params.toString() ? `?${params.toString()}` : '';
      const url = `${API_URL}/admin/voters${queryString}`;

      logAPI('GET', url);

      const response = await axios.get(url, this.getRequestConfig(true));

      logAPI('GET', url, null, response.data);

      return response.data;
    } catch (error: any) {
      logAPI('GET', `${API_URL}/admin/voters`, null, null, error);
      console.error("API Error:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      throw error;
    }
  }

  /**
   * Get admin dashboard stats (admin only)
   */
  async getAdminStats() {
    try {
      const url = `${API_URL}/admin/stats/historical`;

      logAPI('GET', url);

      if (!this.adminAddress) {
        throw new Error("Admin address not set. Cannot fetch admin stats.");
      }

      const response = await axios.get(url, this.getRequestConfig(true));

      logAPI('GET', url, null, response.data);

      // Handle the response structure - extract the first stats object from the array
      const responseData = response.data;
      if (responseData && responseData.stats && Array.isArray(responseData.stats) && responseData.stats.length > 0) {
        return responseData.stats[0];
      }

      // Fallback: return the response data as-is if it doesn't match expected structure
      return responseData;
    } catch (error: any) {
      logAPI('GET', `${API_URL}/admin/stats`, null, null, error);
      console.error('Error getting admin stats:', error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      throw error;
    }
  }

  /**
   * Get admin logs (admin only)
   */
  async getAdminLogs(options = {}) {
    try {
      // Convert options to query params
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(options)) {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      }

      const queryString = params.toString() ? `?${params.toString()}` : '';
      const url = `${API_URL}/admin/logs${queryString}`;

      logAPI('GET', url);

      if (!this.adminAddress) {
        throw new Error("Admin address not set. Cannot fetch admin logs.");
      }

      const response = await axios.get(url, this.getRequestConfig(true));

      logAPI('GET', url, null, response.data);

      return response.data;
    } catch (error: any) {
      logAPI('GET', `${API_URL}/admin/logs`, null, null, error);
      console.error('Error getting admin logs:', error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      throw error;
    }
  }

  /**
   * Get state-wise voter distribution (admin only)
   */
  async getStateDistribution() {
    try {
      const response = await axios.get(
        `${API_URL}/admin/stats/states`,
        this.getRequestConfig(true)
      );
      return response.data;
    } catch (error) {
      console.error('Error getting state distribution:', error);
      throw error;
    }
  }

  /**
   * Get historical statistics (admin only)
   */
  async getHistoricalStats(days = 30) {
    try {
      const response = await axios.get(
        `${API_URL}/admin/stats/historical?days=${days}`,
        this.getRequestConfig(true)
      );
      return response.data;
    } catch (error) {
      console.error('Error getting historical stats:', error);
      throw error;
    }
  }

  /**
   * Upload Aadhar image
   */
  async uploadAadharImage(file: File, address: string) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('address', address);

      // For file uploads we need to modify the content type header
      const config = {
        ...this.getRequestConfig(),
        headers: {
          ...this.getRequestConfig().headers,
          'Content-Type': 'multipart/form-data',
        }
      };

      const response = await axios.post(
        `${API_URL}/upload/aadhar`,
        formData,
        config
      );

      return response.data;
    } catch (error) {
      console.error('Error uploading Aadhar image:', error);
      throw error;
    }
  }

  /**
   * Generate QR code for voter (admin only)
   */
  async generateQRCode(voterAddress: string) {
    try {
      const url = `${API_URL}/qrcode/generate/${voterAddress}`;
      logAPI('POST', url);

      if (!this.adminAddress) {
        throw new Error("Admin address not set. Cannot generate QR code.");
      }

      const response = await axios.post(url, {}, this.getRequestConfig(true));
      logAPI('POST', url, {}, response.data);
      return response.data;
    } catch (error: any) {
      logAPI('POST', `${API_URL}/qrcode/generate/${voterAddress}`, null, null, error);
      console.error("API Error:", error);
      throw error;
    }
  }

  /**
   * Generate voting QR code using Aadhar (admin only)
   */
  async generateVotingQR(aadharNumber: string) {
    try {
      const url = `${API_URL}/voters/generate-voting-qr/${aadharNumber}`;
      logAPI('POST', url);

      if (!this.adminAddress) {
        throw new Error("Admin address not set. Cannot generate voting QR code.");
      }

      const response = await axios.post(url, {}, this.getRequestConfig(true));
      logAPI('POST', url, {}, response.data);
      return response.data;
    } catch (error: any) {
      logAPI('POST', `${API_URL}/voters/generate-voting-qr/${aadharNumber}`, null, null, error);
      console.error("API Error:", error);
      throw error;
    }
  }

  /**
   * Get QR code by Aadhar hash
   */
  async getQRCodeByAadhar(aadharHash: string) {
    try {
      const url = `${API_URL}/qrcode/aadhar/${aadharHash}`;
      logAPI('GET', url);

      const response = await axios.get(url, this.getRequestConfig());
      logAPI('GET', url, null, response.data);
      return response.data;
    } catch (error: any) {
      logAPI('GET', `${API_URL}/qrcode/aadhar/${aadharHash}`, null, null, error);
      console.error("API Error:", error);
      throw error;
    }
  }

  /**
   * Verify QR code
   */
  async verifyQRCode(qrData: string) {
    try {
      const url = `${API_URL}/qrcode/verify`;
      logAPI('POST', url);

      const response = await axios.post(url, { qrData }, this.getRequestConfig());
      logAPI('POST', url, { qrData }, response.data);
      return response.data;
    } catch (error: any) {
      logAPI('POST', `${API_URL}/qrcode/verify`, { qrData }, null, error);
      console.error("API Error:", error);
      throw error;
    }
  }

  /**
   * Get voting statistics (admin only)
   */
  async getVotingStats() {
    try {
      const url = `${API_URL}/voters/admin/voting-stats`;
      logAPI('GET', url);

      if (!this.adminAddress) {
        throw new Error("Admin address not set. Cannot fetch voting stats.");
      }

      const response = await axios.get(url, this.getRequestConfig(true));
      logAPI('GET', url, null, response.data);
      return response.data;
    } catch (error: any) {
      logAPI('GET', `${API_URL}/voters/admin/voting-stats`, null, null, error);
      console.error('Error getting voting stats:', error);
      throw error;
    }
  }

  /**
   * Get summary statistics (admin only)
   */
  async getSummaryStats() {
    try {
      const url = `${API_URL}/voters/admin/stats/summary`;
      logAPI('GET', url);

      if (!this.adminAddress) {
        throw new Error("Admin address not set. Cannot fetch summary stats.");
      }

      const response = await axios.get(url, this.getRequestConfig(true));
      logAPI('GET', url, null, response.data);
      return response.data;
    } catch (error: any) {
      logAPI('GET', `${API_URL}/voters/admin/stats/summary`, null, null, error);
      console.error('Error getting summary stats:', error);
      throw error;
    }
  }

  /**
   * Register voter with Aadhar
   */
  async registerVoterWithAadhar(data: {
    aadharNumber: string;
    fullName: string;
    dateOfBirth: string;
    address: string;
    phoneNumber: string;
    email: string;
    gender: string;
  }) {
    try {
      const url = `${API_URL}/voters/register-aadhar`;
      logAPI('POST', url);

      const response = await axios.post(url, data, this.getRequestConfig());
      logAPI('POST', url, data, response.data);
      return response.data;
    } catch (error: any) {
      logAPI('POST', `${API_URL}/voters/register-aadhar`, data, null, error);
      console.error('Error registering voter with Aadhar:', error);
      throw error;
    }
  }

  /**
   * Check voter status by Aadhar
   */
  async checkVoterStatusByAadhar(aadharNumber: string) {
    try {
      const url = `${API_URL}/voters/status/aadhar/${aadharNumber}`;
      logAPI('GET', url);

      const response = await axios.get(url, this.getRequestConfig());
      logAPI('GET', url, null, response.data);
      return response.data;
    } catch (error: any) {
      logAPI('GET', `${API_URL}/voters/status/aadhar/${aadharNumber}`, null, null, error);
      console.error('Error checking voter status by Aadhar:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();