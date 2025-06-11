'use client';

import { useEffect, useState } from 'react';
import { adminService } from '../../lib/admin-service';
import { motion } from 'framer-motion';
import {
  WrenchIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  CubeIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../../../contexts/LanguageContext';

export default function AdminSettings() {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [apiStatus, setApiStatus] = useState<'connected' | 'disconnected'>('disconnected');
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [devMode, setDevMode] = useState(false);
  const [apiUrl, setApiUrl] = useState<string>('');
  const [apiTestResult, setApiTestResult] = useState<string | null>(null);
  const [apiTesting, setApiTesting] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<{ [key: string]: string }>({});
  const { translate, currentLanguage } = useLanguage();

  useEffect(() => {
    const initAdmin = async () => {
      const connected = await adminService.initialize();
      setIsConnected(connected);

      if (connected) {
        setAdminAuthenticated(true);
        setIsAdmin(adminService.isAdmin());
        setDevMode(adminService.isDevMode());

        // Check API connectivity
        try {
          const healthResult = await fetch('/api/health');
          if (healthResult.ok) {
            setApiStatus('connected');
          }
        } catch (error) {
          console.error('API health check failed:', error);
          setApiStatus('disconnected');
        }

        // Get API URL from environment
        setApiUrl(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api');
      }

      setLoading(false);
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
      title: 'Admin Settings',
      subtitle: 'Configure application settings and connections',
      blockchainConnection: 'Blockchain Connection',
      ethereumSettings: 'Ethereum blockchain connection settings',
      apiConfiguration: 'API Configuration',
      backendApiSettings: 'Backend API connection settings',
      environmentVariables: 'Environment Variables',
      envConfigDesc: 'Current environment configuration',
      connectionStatus: 'Connection Status',
      connected: 'Connected',
      disconnected: 'Disconnected',
      currentAddress: 'Current Address',
      adminAddress: 'Admin Address',
      adminStatus: 'Admin Status',
      adminRightsActive: 'Admin Rights Active',
      notAdmin: 'Not Admin',
      reconnectWallet: 'Reconnect Wallet',
      apiStatus: 'API Status',
      apiUrl: 'API URL',
      developmentMode: 'Development Mode',
      enabled: 'Enabled',
      disabled: 'Disabled',
      testApiConnection: 'Test API Connection',
      testingConnection: 'Testing Connection...',
      loadingSettings: 'Loading settings...',
      notConnected: 'Not connected',
      notConfigured: 'Not configured',
      envConfigured: 'The following environment variables are configured:',
      notSet: '(not set)',
      configured: '(configured)',
      updateEnvFile: 'To change these values, update your .env.local file in the project root.',
      restartRequired: 'These settings can be configured by updating environment variables in your .env.local file. After changing environment variables, you need to restart the application.',
      blockchainNotEstablished: 'Blockchain connection not established. Please install MetaMask or another web3 provider.',
      notAdminWallet: 'Your current wallet address is not the admin wallet. Admin address:'
    };

    const translated: { [key: string]: string } = {};
    for (const [key, text] of Object.entries(textsToTranslate)) {
      translated[key] = await translate(text);
    }
    setTranslatedContent(translated);
  };

  const testApiConnection = async () => {
    setApiTesting(true);
    setApiTestResult(null);

    try {
      const response = await fetch(`${apiUrl}/health`);

      if (response.ok) {
        const data = await response.json();
        setApiStatus('connected');
        setApiTestResult(`API connection successful: ${JSON.stringify(data)}`);
      } else {
        setApiStatus('disconnected');
        setApiTestResult(`API connection failed with status: ${response.status}`);
      }
    } catch (error) {
      setApiStatus('disconnected');
      setApiTestResult(`API connection error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setApiTesting(false);
    }
  };

  const reconnect = async () => {
    setLoading(true);
    const connected = await adminService.initialize();
    setIsConnected(connected);

    if (connected) {
      setAdminAuthenticated(true);
      setIsAdmin(adminService.isAdmin());
    }

    setLoading(false);
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
            {translatedContent.title || 'Admin Settings'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-2 text-sm text-gray-700"
          >
            {translatedContent.subtitle || 'Configure application settings and connections'}
          </motion.p>
        </div>
      </div>

      {!isConnected && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r shadow-sm"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                {translatedContent.blockchainNotEstablished || 'Blockchain connection not established. Please install MetaMask or another web3 provider.'}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {!isAdmin && isConnected && (
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
                {translatedContent.notAdminWallet || 'Your current wallet address is not the admin wallet. Admin address:'} {adminService.getAdminAddress()}
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
            <p className="mt-4 text-gray-600 animate-pulse">
              {translatedContent.loadingSettings || 'Loading settings...'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white shadow-card rounded-lg overflow-hidden"
          >
            <div className="px-4 py-5 sm:px-6 bg-blue-50">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <CubeIcon className="h-5 w-5 mr-2 text-blue-500" />
                {translatedContent.blockchainConnection || 'Blockchain Connection'}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {translatedContent.ethereumSettings || 'Ethereum blockchain connection settings'}
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 lg:grid-cols-2">
                <div className="lg:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    {translatedContent.connectionStatus || 'Connection Status'}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 flex items-center">
                    {apiStatus === 'connected' ? (
                      <>
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                        {translatedContent.connected || 'Connected'}
                      </>
                    ) : (
                      <>
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                        {translatedContent.disconnected || 'Disconnected'}
                      </>
                    )}
                  </dd>
                </div>
                <div className="lg:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    {translatedContent.currentAddress || 'Current Address'}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 font-mono break-all">
                    {adminService.getCurrentAddress() || translatedContent.notConnected}
                  </dd>
                </div>
                <div className="lg:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    {translatedContent.adminAddress || 'Admin Address'}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 font-mono break-all">
                    {adminService.getAdminAddress() || translatedContent.notConfigured}
                  </dd>
                </div>
                <div className="lg:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    {translatedContent.adminStatus || 'Admin Status'}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 flex items-center">
                    {isAdmin ? (
                      <>
                        <ShieldCheckIcon className="h-5 w-5 text-green-500 mr-2" />
                        {translatedContent.adminRightsActive || 'Admin Rights Active'}
                      </>
                    ) : (
                      <>
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                        {translatedContent.notAdmin || 'Not Admin'}
                      </>
                    )}
                  </dd>
                </div>
                <div className="lg:col-span-2 pt-2">
                  <button
                    type="button"
                    onClick={reconnect}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <ArrowPathIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    {translatedContent.reconnectWallet || 'Reconnect Wallet'}
                  </button>
                </div>
              </dl>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white shadow-card rounded-lg overflow-hidden"
          >
            <div className="px-4 py-5 sm:px-6 bg-green-50">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <WrenchIcon className="h-5 w-5 mr-2 text-green-500" />
                {translatedContent.apiConfiguration || 'API Configuration'}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {translatedContent.backendApiSettings || 'Backend API connection settings'}
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 lg:grid-cols-2">
                <div className="lg:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    {translatedContent.apiStatus || 'API Status'}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 flex items-center">
                    {apiStatus === 'connected' ? (
                      <>
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                        {translatedContent.connected || 'Connected'}
                      </>
                    ) : (
                      <>
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                        {translatedContent.disconnected || 'Disconnected'}
                      </>
                    )}
                  </dd>
                </div>
                <div className="lg:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    {translatedContent.apiUrl || 'API URL'}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 font-mono break-all">
                    {apiUrl}
                  </dd>
                </div>
                <div className="lg:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    {translatedContent.developmentMode || 'Development Mode'}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {devMode ? translatedContent.enabled : translatedContent.disabled}
                  </dd>
                </div>
                <div className="lg:col-span-2 pt-2">
                  <button
                    type="button"
                    onClick={testApiConnection}
                    disabled={apiTesting}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    {apiTesting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {translatedContent.testingConnection || 'Testing Connection...'}
                      </>
                    ) : (
                      <>
                        <ArrowPathIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        {translatedContent.testApiConnection || 'Test API Connection'}
                      </>
                    )}
                  </button>
                </div>
                {apiTestResult && (
                  <div className="lg:col-span-2 bg-gray-50 p-3 rounded-md">
                    <p className="text-sm font-mono whitespace-pre-wrap break-all">{apiTestResult}</p>
                  </div>
                )}
              </dl>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white shadow-card rounded-lg overflow-hidden"
          >
            <div className="px-4 py-5 sm:px-6 bg-purple-50">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <ShieldCheckIcon className="h-5 w-5 mr-2 text-purple-500" />
                {translatedContent.environmentVariables || 'Environment Variables'}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {translatedContent.envConfigDesc || 'Current environment configuration'}
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-700 mb-2">
                  {translatedContent.envConfigured}
                </p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                  <li className="break-words">
                    <span className="font-mono font-medium">NEXT_PUBLIC_API_URL</span>:
                    <span className="ml-2 font-mono break-all">{process.env.NEXT_PUBLIC_API_URL || translatedContent.notSet}</span>
                  </li>
                  <li className="break-words">
                    <span className="font-mono font-medium">NEXT_PUBLIC_ADMIN_ADDRESS</span>:
                    <span className="ml-2 font-mono break-all">{process.env.NEXT_PUBLIC_ADMIN_ADDRESS || translatedContent.notSet}</span>
                  </li>
                  <li className="break-words">
                    <span className="font-mono font-medium">NEXT_PUBLIC_DEV_MODE</span>:
                    <span className="ml-2 font-mono">{process.env.NEXT_PUBLIC_DEV_MODE || translatedContent.notSet}</span>
                  </li>
                  <li className="break-words">
                    <span className="font-mono font-medium">NEXT_PUBLIC_DUMMY_CONTRACT</span>:
                    <span className="ml-2 font-mono break-all">{process.env.NEXT_PUBLIC_DUMMY_CONTRACT || translatedContent.notSet}</span>
                  </li>
                  <li className="break-words">
                    <span className="font-mono font-medium">NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY</span>:
                    <span className="ml-2 font-mono break-all">{process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY ? translatedContent.configured : translatedContent.notSet}</span>
                  </li>
                </ul>
                <p className="text-sm text-gray-700 mt-4">
                  {translatedContent.updateEnvFile}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-gray-50 rounded-lg p-6"
          >
            <p className="text-sm text-gray-600">
              {translatedContent.restartRequired}
            </p>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}