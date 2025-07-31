'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { Avatar } from '@mantine/core';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Mock data - replace with actual API calls
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalQuotes: 0,
    totalFlashcards: 0,
    readingStreak: 0,
    favoriteGenre: 'Fiction'
  });

  // Animation states
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [status, router]);

  useEffect(() => {
    // Simulate loading stats with animation
    if (status === 'authenticated') {
      const timer = setTimeout(() => {
        setStats({
          totalBooks: 24,
          totalQuotes: 186,
          totalFlashcards: 342,
          readingStreak: 12,
          favoriteGenre: 'Science Fiction'
        });
        setIsLoaded(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [status]);

  // Tampilkan pesan loading selagi sesi diverifikasi
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg text-gray-600">Memuat data pengguna...</p>
        </div>
      </div>
    );
  }

  const handleSignOut = () => {
    signOut({ redirect: false }).then(() => {
      router.push("/signin");
    });
  };

  type StatCardProps = {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    subtitle: string;
    color: string;
    delay: number;
  };

  const StatCard = ({ icon, title, value, subtitle, color, delay }: StatCardProps) => (
    <div 
      className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 border border-gray-100 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color} text-white text-2xl`}>
          {icon}
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-800 mb-1">
            {isLoaded ? value : '0'}
          </div>
          <div className="text-sm text-gray-500">{subtitle}</div>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
    </div>
  );

  if (status === 'authenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <Navbar user={{ name: session.user?.name || undefined, avatarUrl: "/avatars/fajar.jpg" }} />
        
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className={`text-center mb-12 transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="relative inline-block mb-6">
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="User Avatar"
                  width={120}
                  height={120}
                  className="rounded-full border-4 border-white shadow-lg"
                />
              ) : (
                <Avatar 
                  src={null} 
                  alt="no image here" 
                  color="indigo" 
                  size={120}
                  className="border-4 border-white shadow-lg"
                />
              )}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {session.user?.name}
            </h1>
            <p className="text-lg text-gray-600 mb-2">{session.user?.email}</p>
            <p className="text-sm text-gray-400">
              Member since {new Date().getFullYear()}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard
              icon="📚"
              title="Total Books"
              value={stats.totalBooks}
              subtitle="Added"
              color="bg-gradient-to-r from-blue-500 to-blue-600"
              delay={100}
            />
            <StatCard
              icon="💭"
              title="Total Quotes"
              value={stats.totalQuotes}
              subtitle="saved"
              color="bg-gradient-to-r from-purple-500 to-purple-600"
              delay={200}
            />
            <StatCard
              icon="🗂️"
              title="Total Flashcards"
              value={stats.totalFlashcards}
              subtitle="created"
              color="bg-gradient-to-r from-emerald-500 to-emerald-600"
              delay={300}
            />
            <StatCard
              icon="🔥"
              title="Reading Streak"
              value={`${stats.readingStreak} days`}
              subtitle="current streak"
              color="bg-gradient-to-r from-orange-500 to-orange-600"
              delay={400}
            />
          </div>

          {/* Additional Info Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Recent Activity */}
            <div className={`bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                 style={{ transitionDelay: '500ms' }}>
              <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    📖
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Finished reading &ldquo;The Midnight Library&ldquo;</p>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    💭
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Added 5 new quotes</p>
                    <p className="text-sm text-gray-500">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                    🗂️
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Created 12 flashcards</p>
                    <p className="text-sm text-gray-500">3 days ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reading Goals */}
            <div className={`bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                 style={{ transitionDelay: '600ms' }}>
              <h3 className="text-xl font-bold text-gray-800 mb-6">Reading Goals 2025</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Annual Goal</span>
                    <span className="text-gray-600">{stats.totalBooks}/50 books</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000"
                         style={{ width: `${(stats.totalBooks / 50) * 100}%` }}></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">{stats.favoriteGenre}</p>
                    <p className="text-sm text-gray-500">Favorite Genre</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">4.2</p>
                    <p className="text-sm text-gray-500">Avg Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sign Out Button */}
          <div className={`text-center transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
               style={{ transitionDelay: '700ms' }}>
            <button
              onClick={handleSignOut}
              className="px-8 py-3 font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-4 focus:ring-red-200 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}