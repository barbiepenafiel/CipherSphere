'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  UserIcon, 
  KeyIcon, 
  ClockIcon, 
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface User {
  id: string;
  username: string;
  role: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

export default function DashboardLayout({ children, currentPage }: DashboardLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navigation = [
    { 
      name: 'Profile', 
      href: '/dashboard', 
      icon: UserIcon,
      current: currentPage === 'profile'
    },
    { 
      name: 'Cipher Tools', 
      href: '/dashboard', 
      icon: KeyIcon,
      current: currentPage === 'cipher'
    },
    { 
      name: 'History', 
      href: '/history', 
      icon: ClockIcon,
      current: currentPage === 'history'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-neutral-50 to-amber-50">
      {/* Mobile sidebar */}
      <div className={`lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black bg-opacity-30" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex w-64 flex-1 flex-col bg-white border-r border-stone-200">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500"
                onClick={() => setSidebarOpen(false)}
              >
                <XMarkIcon className="h-6 w-6 text-white" />
              </button>
            </div>
            <SidebarContent navigation={navigation} onLogout={handleLogout} />
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-grow flex-col overflow-y-auto bg-white border-r border-stone-200">
          <SidebarContent navigation={navigation} onLogout={handleLogout} />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm shadow-sm border-b border-stone-200">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              className="lg:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-stone-600 hover:text-amber-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-amber-900 capitalize">
              {currentPage}
            </h1>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ navigation, onLogout }: { 
  navigation: any[], 
  onLogout: () => void 
}) {
  return (
    <>
      <div className="flex flex-shrink-0 items-center px-6 py-4">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-gradient-to-r from-amber-800 to-orange-900 rounded-lg flex items-center justify-center">
            <KeyIcon className="h-5 w-5 text-white" />
          </div>
          <span className="ml-2 text-xl font-bold text-amber-900">CipherSphere</span>
        </div>
      </div>
      
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
              item.current
                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                : 'text-stone-600 hover:bg-stone-50 hover:text-amber-800'
            }`}
          >
            <item.icon
              className={`mr-3 h-5 w-5 ${
                item.current ? 'text-amber-700' : 'text-stone-400 group-hover:text-amber-600'
              }`}
            />
            {item.name}
          </Link>
        ))}
      </nav>
      
      <div className="flex flex-shrink-0 border-t border-stone-200 p-4">
        <button
          onClick={onLogout}
          className="group flex w-full items-center px-2 py-2 text-sm font-medium text-stone-600 rounded-md hover:bg-stone-50 hover:text-amber-800 transition-colors"
        >
          <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-stone-400 group-hover:text-amber-600" />
          Logout
        </button>
      </div>
    </>
  );
}
