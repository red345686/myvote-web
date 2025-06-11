'use client';

import { useEffect, useState } from 'react';
import { adminService } from '../lib/admin-service';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { UsersIcon, CalendarIcon, ClockIcon, ChartBarIcon, LockClosedIcon, DocumentTextIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { Election } from '../lib/web3';
import { useLanguage } from '../../../contexts/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';

type DashboardUser = {
  id: string;
  name: string;
  isVerified: boolean;
};

export default function AdminDashboard() {
  const [elections, setElections] = useState<Election[]>([]);
  const [pendingUsers, setPendingUsers] = useState<DashboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [translatedContent, setTranslatedContent] = useState<{ [key: string]: string }>({});
  const { translate, currentLanguage } = useLanguage();

  useEffect(() => {
    const initAdmin = async () => {
      await adminService.initialize();
      loadDashboardData();
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
      subtitle: 'Manage your blockchain voting platform',
      loadingText: 'Loading dashboard...',
      adminAccess: 'Admin access granted with hardcoded address:',
      devModeTitle: 'Development Mode Active',
      devModeDesc: 'Your application is running in development mode. Admin checks are bypassed and blockchain integration is simulated.',
      verifyVoters: 'Verify Voters',
      verifyVotersDesc: 'Approve voter registrations and verify identity documents',
      scheduleElections: 'Schedule Elections',
      scheduleElectionsDesc: 'Create and manage elections, schedule dates and times',
      statistics: 'Statistics',
      statisticsDesc: 'View detailed voter demographics and platform statistics',
      activityLogs: 'Activity Logs',
      activityLogsDesc: 'Review all admin actions and system activity',
      pendingVerification: 'Pending Verification',
      pendingVerificationDesc: 'Manage queue of unverified voter registrations',
      adminSettings: 'Admin Settings',
      adminSettingsDesc: 'Manage blockchain connection and environment settings'
    };

    const translated: { [key: string]: string } = {};
    for (const [key, text] of Object.entries(textsToTranslate)) {
      translated[key] = await translate(text);
    }
    setTranslatedContent(translated);
  };

  const loadDashboardData = async () => {
    // Load users
    const usersData = await adminService.listVoters({
      page: 1,
      limit: 5
    });

    if (usersData?.voters) {
      setPendingUsers(usersData.voters.map((voter: any) => ({
        id: voter.blockchainAddress || voter.id || '',
        name: voter.rawData?.name || voter.name || 'Unknown',
        isVerified: voter.isVerified || false
      })));
    }

    setLoading(false);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const adminModules = [
    {
      title: translatedContent.verifyVoters || 'Verify Voters',
      description: translatedContent.verifyVotersDesc || 'Approve voter registrations and verify identity documents',
      icon: <UsersIcon className="h-8 w-8 text-blue-500" />,
      href: '/admin/verify-users',
      color: 'bg-blue-100 hover:bg-blue-200'
    },
    {
      title: translatedContent.scheduleElections || 'Schedule Elections',
      description: translatedContent.scheduleElectionsDesc || 'Create and manage elections, schedule dates and times',
      icon: <CalendarIcon className="h-8 w-8 text-indigo-500" />,
      href: '/admin/schedule-elections',
      color: 'bg-indigo-100 hover:bg-indigo-200'
    },
    {
      title: translatedContent.statistics || 'Statistics',
      description: translatedContent.statisticsDesc || 'View detailed voter demographics and platform statistics',
      icon: <ChartBarIcon className="h-8 w-8 text-green-500" />,
      href: '/admin/statistics',
      color: 'bg-green-100 hover:bg-green-200'
    },
    {
      title: translatedContent.activityLogs || 'Activity Logs',
      description: translatedContent.activityLogsDesc || 'Review all admin actions and system activity',
      icon: <DocumentTextIcon className="h-8 w-8 text-amber-500" />,
      href: '/admin/logs',
      color: 'bg-amber-100 hover:bg-amber-200'
    },
    {
      title: translatedContent.pendingVerification || 'Pending Verification',
      description: translatedContent.pendingVerificationDesc || 'Manage queue of unverified voter registrations',
      icon: <ClockIcon className="h-8 w-8 text-rose-500" />,
      href: '/admin/verify-users',
      color: 'bg-rose-100 hover:bg-rose-200'
    },
    {
      title: translatedContent.adminSettings || 'Admin Settings',
      description: translatedContent.adminSettingsDesc || 'Manage blockchain connection and environment settings',
      icon: <ShieldCheckIcon className="h-8 w-8 text-purple-500" />,
      href: '/admin/settings',
      color: 'bg-purple-100 hover:bg-purple-200'
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-10"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 sm:mb-8"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="text-center flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              {translatedContent.title || 'Admin Dashboard'}
            </h1>
            <p className="mt-2 text-base sm:text-lg text-gray-600 px-4 sm:px-0">
              {translatedContent.subtitle || 'Manage your blockchain voting platform'}
            </p>
          </div>
          <div className="ml-4">
            <LanguageSelector />
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-8 sm:py-12">
          <div className="text-center">
            <div className="inline-block animate-spin-slow">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="mt-4 text-sm sm:text-base text-gray-600 animate-pulse">
              {translatedContent.loadingText || 'Loading dashboard...'}
            </p>
          </div>
        </div>
      ) : (
        <>
          {!loading && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-green-50 border-l-4 border-green-400 p-3 sm:p-4 mb-4 sm:mb-6 rounded-r shadow-sm mx-1 sm:mx-0"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-xs sm:text-sm text-green-700 break-all sm:break-normal">
                    {translatedContent.adminAccess || 'Admin access granted with hardcoded address:'} {adminService.getAdminAddress()}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {adminModules.map((module, index) => (
              <motion.div
                key={module.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="w-full"
              >
                <Link href={module.href} className="block h-full">
                  <div className={`h-full p-4 sm:p-5 lg:p-6 rounded-lg shadow-sm ${module.color} transition-all duration-300 transform hover:scale-105 hover:shadow-md cursor-pointer min-h-[140px] sm:min-h-[160px]`}>
                    <div className="mb-3 sm:mb-4 flex justify-center sm:justify-start">{module.icon}</div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 text-center sm:text-left mb-2">{module.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left leading-relaxed">{module.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {adminService.isDevMode() && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-6 sm:mt-8 p-3 sm:p-4 bg-gray-100 rounded-lg mx-1 sm:mx-0"
            >
              <div className="flex items-start sm:items-center">
                <div className="flex-shrink-0 mt-1 sm:mt-0">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM6.293 6.293a1 1 0 011.414 0L9 7.586l1.293-1.293a1 1 0 111.414 1.414L10.414 9l1.293 1.293a1 1 0 01-1.414 1.414L9 10.414l-1.293 1.293a1 1 0 01-1.414-1.414L7.586 9 6.293 7.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-xs sm:text-sm text-gray-700 font-medium">
                    {translatedContent.devModeTitle || 'Development Mode Active'}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed">
                {translatedContent.devModeDesc || 'Your application is running in development mode. Admin checks are bypassed and blockchain integration is simulated.'}
              </p>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
}

// Animation components
function CountAnimation({ value }: { value: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (value === 0) return;

    let start = 0;
    const end = value;
    const duration = 1000;
    const increment = Math.ceil(end / (duration / 16));

    const timer = setInterval(() => {
      start += increment;
      if (start > end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <>{count}</>;
}