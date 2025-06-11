'use client';

import { useEffect, useState } from 'react';
import { adminService } from '../../lib/admin-service';
import { motion } from 'framer-motion';
import { ChartBarIcon, UsersIcon, CheckCircleIcon, ClockIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import type { AdminStats } from '../../lib/api';

export default function AdminStatistics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAdmin = async () => {
      await adminService.initialize();
      loadStats();
    };

    setTimeout(() => {
      initAdmin();
    }, 800);
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const statsData = await adminService.getAdminStats();
      setStats(statsData);
      setError(null);
    } catch (err) {
      console.error('Error loading stats:', err);
      setError('Failed to load admin statistics');
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to calculate percentage
  const calcPercentage = (value: number, total: number): string => {
    if (total === 0) return '0%';
    return ((value / total) * 100).toFixed(1) + '%';
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
            Admin Dashboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-2 text-sm text-gray-700"
          >
            Key statistics and voter data
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
                Loading...
              </>
            ) : (
              <>
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Statistics
              </>
            )}
          </button>
        </motion.div>
      </div>

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
            <p className="mt-4 text-gray-600 animate-pulse">Loading statistics...</p>
          </div>
        </div>
      ) : stats ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {/* Total Voters Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white overflow-hidden shadow-card rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UsersIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Voters</dt>
                      <dd>
                        <div className="text-lg font-semibold text-gray-900">{stats.totalRegisteredVoters || 0}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <div className="font-medium text-blue-600 hover:text-blue-700">
                    {stats.dailyRegistrations || 0} new registrations today
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Verified Voters Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white overflow-hidden shadow-card rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Verified Voters</dt>
                      <dd>
                        <div className="text-lg font-semibold text-gray-900">{stats.totalVerifiedVoters || 0}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <div className="font-medium text-green-600 hover:text-green-700">
                    {stats.dailyVerifications || 0} verifications today
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Pending Verification Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white overflow-hidden shadow-card rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ClockIcon className="h-6 w-6 text-yellow-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Pending Verification</dt>
                      <dd>
                        <div className="text-lg font-semibold text-gray-900">{stats.pendingVerifications || 0}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <a href="/admin/verify-users" className="font-medium text-yellow-600 hover:text-yellow-700">
                    View pending verifications
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Verification Rate Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white overflow-hidden shadow-card rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ArrowTrendingUpIcon className="h-6 w-6 text-blue-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Verification Rate</dt>
                      <dd>
                        <div className="text-lg font-semibold text-gray-900">
                          {stats.totalRegisteredVoters > 0
                            ? `${((stats.totalVerifiedVoters / stats.totalRegisteredVoters) * 100).toFixed(1)}%`
                            : '0%'}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="relative bg-gray-50 px-5 py-3">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                  <div
                    style={{
                      width: stats.totalRegisteredVoters > 0
                        ? `${((stats.totalVerifiedVoters / stats.totalRegisteredVoters) * 100).toFixed(1)}%`
                        : '0%'
                    }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                  ></div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Gender Distribution Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white rounded-lg shadow-card p-4 sm:p-6"
          >
            <h2 className="text-lg font-medium text-gray-900 mb-4">Gender Distribution</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {stats.maleVoters !== undefined && stats.femaleVoters !== undefined && stats.otherGenderVoters !== undefined ? (
                [
                  { gender: 'male', count: stats.maleVoters },
                  { gender: 'female', count: stats.femaleVoters },
                  { gender: 'other', count: stats.otherGenderVoters }
                ].map(({ gender, count }, index) => (
                  <div key={gender} className="flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-500 capitalize">{gender}</span>
                      <span className="text-sm font-medium text-gray-900">{count}</span>
                    </div>
                    <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: calcPercentage(count, stats.totalRegisteredVoters || 0) }}
                        transition={{ duration: 1, delay: 0.1 * index }}
                        className={`absolute h-full ${gender === 'male' ? 'bg-blue-500' : gender === 'female' ? 'bg-pink-500' : 'bg-purple-500'
                          }`}
                      />
                    </div>
                    <span className="mt-1 text-xs text-gray-500">
                      {calcPercentage(count, stats.totalRegisteredVoters || 0)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-sm text-gray-500 py-4">
                  Gender distribution data is not available.
                </div>
              )}
            </div>
          </motion.div>

          {/* Age Distribution Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white rounded-lg shadow-card p-4 sm:p-6"
          >
            <h2 className="text-lg font-medium text-gray-900 mb-4">Age Distribution</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(stats.ageDistribution).map(([ageGroup, count], index) => {
                const ageLabel = ageGroup
                  .replace('below', 'Below ')
                  .replace('above', 'Above ')
                  .replace('age', '')
                  .replace('to', '-')
                  .replace(/(\d+)/g, ' $1 ');

                return (
                  <div key={ageGroup} className="flex flex-col sm:flex-row sm:items-center">
                    <div className="w-full sm:w-24 text-sm text-gray-600 mb-1 sm:mb-0">{ageLabel}</div>
                    <div className="flex-1 sm:ml-2">
                      <div className="relative h-8 bg-gray-100 rounded-r-md">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: calcPercentage(count, stats.totalRegisteredVoters || 0) }}
                          transition={{ duration: 1, delay: 0.1 * index }}
                          className="absolute h-full bg-indigo-500 rounded-r-md"
                        >
                          <span className="absolute right-1 text-white text-xs font-medium h-full flex items-center">
                            {count}
                          </span>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* State Distribution Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-white rounded-lg shadow-card overflow-hidden"
          >
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">State Distribution</h2>
              <p className="mt-1 text-sm text-gray-500">Voter distribution by state</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      State
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.stateWiseDistribution && Object.entries(stats.stateWiseDistribution).map(([stateName, count], index) => (
                    <motion.tr
                      key={stateName}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {stateName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-1 w-32 bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-blue-500 h-2.5 rounded-full"
                              style={{ width: calcPercentage(count as number, stats.totalRegisteredVoters || 0) }}
                            ></div>
                          </div>
                          <span className="ml-2 text-xs text-gray-500">
                            {calcPercentage(count as number, stats.totalRegisteredVoters || 0)}
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            <div className="bg-white overflow-hidden shadow-card rounded-lg hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <a href="/admin/verify-users" className="font-medium text-gray-900 hover:text-gray-600">
                      Verify Users
                    </a>
                    <p className="text-sm text-gray-500">
                      Review and verify pending user registrations
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-card rounded-lg hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <a href="/admin/schedule-elections" className="font-medium text-gray-900 hover:text-gray-600">
                      Schedule Elections
                    </a>
                    <p className="text-sm text-gray-500">
                      Create and manage upcoming elections
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-card rounded-lg hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ChartBarIcon className="h-6 w-6 text-purple-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <a href="/admin/logs" className="font-medium text-gray-900 hover:text-gray-600">
                      Activity Logs
                    </a>
                    <p className="text-sm text-gray-500">
                      View detailed admin activity logs
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-8 rounded-lg shadow-card flex flex-col items-center justify-center"
        >
          <svg className="h-16 w-16 text-gray-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900">No statistics available</h3>
          <p className="mt-1 text-sm text-gray-500">There was a problem loading the statistics.</p>
          <button
            onClick={loadStats}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try Again
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}