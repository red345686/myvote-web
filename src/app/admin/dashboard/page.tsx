'use client';

import { useEffect, useState } from 'react';
import { adminService } from '../../lib/admin-service';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  UserGroupIcon,
  CheckBadgeIcon,
  ClockIcon,
  UserIcon,
  MapPinIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import type { AdminStats } from '../../lib/api';
import { useLanguage } from '../../../../contexts/LanguageContext';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [translatedContent, setTranslatedContent] = useState<{ [key: string]: string }>({});
  const { translate, currentLanguage } = useLanguage();

  useEffect(() => {
    const initAdmin = async () => {
      await adminService.initialize();
      loadStats();
    };

    setTimeout(() => {
      initAdmin();
    }, 800);
  }, []);

  useEffect(() => {
    translatePageContent();
  }, [currentLanguage]);

  const translatePageContent = async () => {
    const textsToTranslate = {
      title: 'Admin Dashboard',
      subtitle: 'Overview of the voting platform statistics',
      refreshData: 'Refresh Data',
      loading: 'Loading...',
      loadingStats: 'Loading statistics...',
      adminAccess: 'Admin access granted with hardcoded address:',
      totalVoters: 'Total Voters',
      verifiedVoters: 'Verified Voters',
      pendingVerification: 'Pending Verification',
      verificationRate: 'Verification Rate',
      genderDistribution: 'Gender Distribution',
      stateDistribution: 'State Distribution',
      male: 'Male',
      female: 'Female',
      other: 'Other',
      state: 'State',
      total: 'Total',
      percentage: 'Percentage',
      newRegistrations: 'new registrations today',
      verifications: 'verifications today',
      viewPending: 'View pending verifications',
      verifyUsers: 'Verify Users',
      scheduleElections: 'Schedule Elections',
      activityLogs: 'Activity Logs',
      verifyUsersDesc: 'Approve new voter registrations',
      scheduleElectionsDesc: 'Create and manage elections',
      activityLogsDesc: 'View recent admin activities',
      noStateData: 'No state distribution data available',
      genderNotAvailable: 'Gender distribution data is not available.'
    };

    const translated: { [key: string]: string } = {};
    for (const [key, text] of Object.entries(textsToTranslate)) {
      translated[key] = await translate(text);
    }
    setTranslatedContent(translated);
  };

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAdminStats();
      setStats(response);
      setError(null);
    } catch (err) {
      console.error('Error loading stats:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  // Function to calculate percentage with one decimal place
  const calculatePercentage = (value: number, total: number): string => {
    if (total === 0) return '0.0';
    return ((value / total) * 100).toFixed(1);
  };

  // Helper function to get gender distribution data
  const getGenderData = () => {
    if (!stats) return { male: 0, female: 0, other: 0 };

    // Fallback to old format if available
    return {
      male: (stats as any).maleVoters || 0,
      female: (stats as any).femaleVoters || 0,
      other: (stats as any).otherGenderVoters || 0
    };
  };

  // Helper functions to get consistent data
  const getTotalVoters = (): number => {
    if (!stats) return 0;
    return stats.totalRegisteredVoters || 0;
  };

  const getVerifiedVoters = (): number => {
    if (!stats) return 0;
    return stats.totalVerifiedVoters || 0;
  };

  const getPendingVerification = (): number => {
    if (!stats) return 0;
    return stats.pendingVerifications || 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl font-semibold text-gray-900"
          >
            {translatedContent.title || 'Admin Dashboard'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-2 text-sm text-gray-700"
          >
            {translatedContent.subtitle || 'Overview of the voting platform statistics'}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <button
            onClick={loadStats}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {translatedContent.loading || 'Loading...'}
              </>
            ) : (
              <>
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {translatedContent.refreshData || 'Refresh Data'}
              </>
            )}
          </button>
        </motion.div>
      </div>

      {!loading && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-r shadow-sm"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                {translatedContent.adminAccess} {adminService.getAdminAddress()}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r shadow-sm"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin-slow">
              <svg className="w-16 h-16 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="mt-4 text-gray-600 animate-pulse">{translatedContent.loadingStats || 'Loading statistics...'}</p>
          </div>
        </div>
      ) : (
        <>
          {stats && (
            <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
              {/* Card 1 - Total Voters */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex items-center p-4 bg-white rounded-lg shadow-card transition-all duration-300 hover:shadow-card-hover"
              >
                <div className="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full">
                  <UserGroupIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-600">{translatedContent.totalVoters || 'Total Voters'}</p>
                  <p className="text-lg font-semibold text-gray-700">{getTotalVoters()}</p>
                  <p className="text-xs text-blue-500">
                    {stats.dailyRegistrations || 0} {translatedContent.newRegistrations}
                  </p>
                </div>
              </motion.div>

              {/* Card 2 - Verified Voters */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="flex items-center p-4 bg-white rounded-lg shadow-card transition-all duration-300 hover:shadow-card-hover"
              >
                <div className="p-3 mr-4 text-green-500 bg-green-100 rounded-full">
                  <CheckBadgeIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-600">{translatedContent.verifiedVoters || 'Verified Voters'}</p>
                  <p className="text-lg font-semibold text-gray-700">
                    {getVerifiedVoters()}
                    <span className="ml-2 text-sm font-normal text-green-500">
                      ({calculatePercentage(getVerifiedVoters(), getTotalVoters())}%)
                    </span>
                  </p>
                  <p className="text-xs text-green-500">
                    {stats.dailyVerifications || 0} {translatedContent.verifications}
                  </p>
                </div>
              </motion.div>

              {/* Card 3 - Pending Verification */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="flex items-center p-4 bg-white rounded-lg shadow-card transition-all duration-300 hover:shadow-card-hover"
              >
                <div className="p-3 mr-4 text-amber-500 bg-amber-100 rounded-full">
                  <ClockIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-600">{translatedContent.pendingVerification || 'Pending Verification'}</p>
                  <p className="text-lg font-semibold text-gray-700">{getPendingVerification()}</p>
                  <p className="text-xs text-amber-500">{translatedContent.viewPending}</p>
                </div>
              </motion.div>

              {/* Card 4 - Verification Rate */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="flex items-center p-4 bg-white rounded-lg shadow-card transition-all duration-300 hover:shadow-card-hover"
              >
                <div className="p-3 mr-4 text-purple-500 bg-purple-100 rounded-full">
                  <ChartBarIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-600">{translatedContent.verificationRate || 'Verification Rate'}</p>
                  <p className="text-lg font-semibold text-gray-700">
                    {getTotalVoters() > 0
                      ? `${((getVerifiedVoters() / getTotalVoters()) * 100).toFixed(1)}%`
                      : '0%'}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div
                      className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width: getTotalVoters() > 0
                          ? `${((getVerifiedVoters() / getTotalVoters()) * 100).toFixed(1)}%`
                          : '0%'
                      }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {stats && (
            <div className="grid gap-6 mb-8 md:grid-cols-2">
              {/* Gender Distribution */}
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-white p-5 rounded-lg shadow-card transition-all duration-300 hover:shadow-card-hover"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    <UserIcon className="h-5 w-5 mr-2 text-blue-500" />
                    {translatedContent.genderDistribution || 'Gender Distribution'}
                  </h2>
                </div>

                <div className="flex flex-col">
                  {stats.maleVoters !== undefined && stats.femaleVoters !== undefined && stats.otherGenderVoters !== undefined ? (
                    [
                      { gender: translatedContent.male || 'Male', count: stats.maleVoters, color: 'bg-blue-600' },
                      { gender: translatedContent.female || 'Female', count: stats.femaleVoters, color: 'bg-pink-500' },
                      { gender: translatedContent.other || 'Other', count: stats.otherGenderVoters, color: 'bg-purple-500' }
                    ].map(({ gender, count, color }, index) => (
                      <div key={gender} className={index < 2 ? "mb-4" : ""}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-600">{gender}</span>
                          <span className="text-sm font-medium text-gray-800">
                            {count}
                            <span className="text-gray-500 ml-1">
                              ({calculatePercentage(count, getTotalVoters())}%)
                            </span>
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`${color} h-2.5 rounded-full transition-all duration-500`}
                            style={{ width: `${calculatePercentage(count, getTotalVoters())}%` }}
                          ></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-sm text-gray-500 py-4">
                      {translatedContent.genderNotAvailable}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* State Distribution */}
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-white p-5 rounded-lg shadow-card transition-all duration-300 hover:shadow-card-hover"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    <MapPinIcon className="h-5 w-5 mr-2 text-green-500" />
                    {translatedContent.stateDistribution || 'State Distribution'}
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  {stats.stateWiseDistribution ? (
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{translatedContent.state || 'State'}</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{translatedContent.total || 'Total'}</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{translatedContent.percentage || 'Percentage'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {Object.entries(stats.stateWiseDistribution).map(([stateName, count], index) => (
                          <tr key={stateName} className="hover:bg-gray-50">
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-800">{stateName}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">{count as number}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                              {calculatePercentage(count as number, getTotalVoters())}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center text-sm text-gray-500 py-4">
                      {translatedContent.noStateData}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <Link href="/admin/verify-users" className="bg-white p-4 rounded-lg shadow-card transition-all duration-300 hover:shadow-card-hover flex items-center">
              <div className="rounded-full p-3 bg-blue-100 text-blue-600 mr-4">
                <CheckBadgeIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-gray-800 font-medium">{translatedContent.verifyUsers || 'Verify Users'}</h3>
                <p className="text-gray-500 text-sm">{translatedContent.verifyUsersDesc || 'Approve new voter registrations'}</p>
              </div>
            </Link>

            <Link href="/admin/schedule-elections" className="bg-white p-4 rounded-lg shadow-card transition-all duration-300 hover:shadow-card-hover flex items-center">
              <div className="rounded-full p-3 bg-purple-100 text-purple-600 mr-4">
                <CalendarDaysIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-gray-800 font-medium">{translatedContent.scheduleElections || 'Schedule Elections'}</h3>
                <p className="text-gray-500 text-sm">{translatedContent.scheduleElectionsDesc || 'Create and manage elections'}</p>
              </div>
            </Link>

            <Link href="/admin/logs" className="bg-white p-4 rounded-lg shadow-card transition-all duration-300 hover:shadow-card-hover flex items-center">
              <div className="rounded-full p-3 bg-amber-100 text-amber-600 mr-4">
                <ChartBarIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-gray-800 font-medium">{translatedContent.activityLogs || 'Activity Logs'}</h3>
                <p className="text-gray-500 text-sm">{translatedContent.activityLogsDesc || 'View recent admin activities'}</p>
              </div>
            </Link>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}