'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  PlusCircleIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Button from './Button';

export default function AdminNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const navItems = [
    { name: 'Tableau de bord', href: '/admin/dashboard', icon: HomeIcon },
    { name: 'Créer un événement', href: '/admin/events/create', icon: PlusCircleIcon },
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/admin/dashboard">
              <span className="text-2xl font-bold text-primary">Admin Evento 🎉</span>
            </Link>
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  <item.icon className="w-5 h-5 mr-2" />
                  {item.name}
                </motion.div>
              </Link>
            ))}
            <Button variant="accent" onClick={handleLogout} className="ml-4">
              <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-2" />
              Déconnexion 👋
            </Button>
          </div>

          {/* Menu Mobile Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-primary p-2"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white border-t"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center text-gray-700 hover:text-primary hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium">
                  <item.icon className="w-5 h-5 mr-2" />
                  {item.name}
                </div>
              </Link>
            ))}
            <div className="px-3 py-2">
              <Button
                variant="accent"
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full"
              >
                <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-2" />
                Déconnexion 👋
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}