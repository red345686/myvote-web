'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { HomeIcon, UsersIcon, CalendarIcon, UserPlusIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import { LanguageProvider } from '../../../contexts/LanguageContext';
interface AdminLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'User Verification', href: '/admin/verify-users', icon: UsersIcon },
  { name: 'Schedule Elections', href: '/admin/schedule-elections', icon: CalendarIcon },
  { name: 'Manage Candidates', href: '/admin/manage-candidates', icon: UserPlusIcon },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <LanguageProvider>
      <div className="min-h-screen flex bg-gray-50">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
          </div>
        )}

        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-800 to-blue-600 text-white shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
          <div className="flex items-center justify-between h-16 px-6 lg:hidden">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h1 className="text-lg font-bold">MyVote Admin</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6 hidden lg:block">
            <div className="flex items-center space-x-2 mb-8">
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold">MyVote Admin</h1>
            </div>
          </div>

          <nav className="px-6 pb-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${isActive
                    ? 'bg-white text-blue-600 shadow-md transform scale-102'
                    : 'text-white hover:bg-blue-700 hover:shadow'
                    }`}
                >
                  <item.icon className={`h-5 w-5 transition-transform ${isActive ? 'text-blue-600' : 'text-white'}`} aria-hidden="true" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="px-6 py-4 mt-auto">
            <div className="bg-blue-700 rounded-lg p-4 text-sm">
              <h3 className="font-semibold mb-2">Admin Status</h3>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse"></div>
                <span className="text-xs text-blue-100">Authenticated</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col lg:ml-0">
          <header className="bg-white shadow-sm z-10 transition-all duration-300 ease-in-out">
            <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="text-gray-500 hover:text-gray-600 lg:hidden mr-4"
                >
                  <Bars3Icon className="h-6 w-6" />
                </button>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 relative">
                  MyVote Administration
                  <span className="absolute -bottom-1 left-0 w-12 h-1 bg-blue-600 rounded"></span>
                </h1>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="hidden sm:block text-sm text-gray-600">
                  <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-1 animate-pulse"></span>
                  Active Session
                </div>
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                  A
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 overflow-auto animate-fadeIn">
            {children}
          </main>
          <footer className="bg-white shadow-inner p-4 text-center text-gray-500 text-xs sm:text-sm transition-all duration-300 ease-in-out">
            <div className="flex items-center justify-center">
              <span className="text-blue-600 mr-2">©</span>
              {new Date().getFullYear()} MyVote Administration Platform
            </div>
          </footer>
        </div>
      </div>
    </LanguageProvider>
  );
}