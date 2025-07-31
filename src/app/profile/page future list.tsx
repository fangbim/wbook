'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, FC } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { Avatar } from '@mantine/core';

interface Stats {
  totalBooks: number;
  totalQuotes: number;
  totalFlashcards: number;
  readingStreak: number;
  favoriteGenre: string;
  totalPages: number;
  readingTime: number;
  averageRating: number;
  booksThisMonth: number;
  level: number;
  xp: number;
  nextLevelXp: number;
}

interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
}

interface ReadingActivity {
  date: string;
  books: number;
  pages: number;
  time: number;
}

interface Recommendation {
  title: string;
  author: string;
  reason: string;
  rating: number;
}

// --- 2. Moved Components Outside for Performance & Organization ---

// StatCard Component
interface StatCardProps {
  icon: string;
  title: string;
  value: string | number;
  subtitle: string;
  color: string;
  delay: number;
  trend?: number;
  isLoaded: boolean;
}

const StatCard: FC<StatCardProps> = ({ icon, title, value, subtitle, color, delay, trend, isLoaded }) => (
  <div 
    className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 border border-gray-100 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
    style={{ transitionDelay: `${delay}ms` }}
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${color} text-white text-2xl`}>
        {icon}
      </div>
      <div className="text-right">
        <div className="flex items-center space-x-2">
          <div className="text-3xl font-bold text-gray-800">
            {isLoaded ? value : '0'}
          </div>
          {trend && (
            <div className={`text-sm px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
            </div>
          )}
        </div>
        <div className="text-sm text-gray-500">{subtitle}</div>
      </div>
    </div>
    <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
  </div>
);

// AchievementBadge Component
interface AchievementBadgeProps {
  achievement: Achievement;
}

const AchievementBadge: FC<AchievementBadgeProps> = ({ achievement }) => (
  <div className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
    achievement.unlocked 
      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 hover:shadow-lg' 
      : 'bg-gray-50 border-gray-200'
  }`}>
    <div className="flex items-center space-x-3">
      <div className={`text-3xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
        {achievement.icon}
      </div>
      <div className="flex-1">
        <h4 className={`font-semibold ${achievement.unlocked ? 'text-gray-800' : 'text-gray-500'}`}>
          {achievement.name}
        </h4>
        <p className="text-sm text-gray-600">{achievement.description}</p>
        {!achievement.unlocked && achievement.progress && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(achievement.progress / 50) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{achievement.progress}/50</p>
          </div>
        )}
      </div>
    </div>
    {achievement.unlocked && (
      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
        <span className="text-white text-xs">✓</span>
      </div>
    )}
  </div>
);

// ReadingHeatmap Component
interface ReadingHeatmapProps {
    activityData: ReadingActivity[];
}

const ReadingHeatmap: FC<ReadingHeatmapProps> = ({ activityData }) => {
    // This is a simplified example. A real implementation would map dates to a grid.
    const getIntensity = (activityLevel: number) => {
        if (activityLevel === 0) return 'bg-gray-100';
        if (activityLevel <= 50) return 'bg-green-200';
        if (activityLevel <= 150) return 'bg-green-400';
        return 'bg-green-600';
    };

    return (
        <div className="grid grid-cols-7 gap-1">
            {/* Create a grid of 35 days for display */}
            {Array.from({ length: 35 }).map((_, index) => {
                const activity = activityData[index] || { pages: 0, date: '' };
                return (
                    <div
                        key={index}
                        className={`w-4 h-4 rounded-sm ${getIntensity(activity.pages)} hover:scale-110 transition-transform cursor-pointer`}
                        title={`${activity.date}: ${activity.pages} pages`}
                    />
                );
            })}
        </div>
    );
};


export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // --- 3. State Typed with Interfaces ---
  const [stats, setStats] = useState<Stats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [readingActivity, setReadingActivity] = useState<ReadingActivity[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [status, router]);

  // --- 4. Replaced Hardcoded Data with a Simulated API Fetch ---
  useEffect(() => {
    if (status === 'authenticated') {
      const fetchProfileData = async () => {
        // TODO: Replace this with your actual API call
        // const response = await fetch('/api/user/profile');
        // const data = await response.json();

        // Simulating API response
        const data = {
          stats: {
            totalBooks: 47, totalQuotes: 238, totalFlashcards: 542, readingStreak: 28,
            favoriteGenre: 'Science Fiction', totalPages: 12450, readingTime: 186,
            averageRating: 4.2, booksThisMonth: 4, level: 8, xp: 2340, nextLevelXp: 3000
          },
          achievements: [
            { id: 1, name: 'Speed Reader', description: 'Read 10 books in a month', icon: '🏃‍♂️', unlocked: true },
            { id: 2, name: 'Quote Master', description: 'Save 200+ quotes', icon: '💭', unlocked: true },
            { id: 3, name: 'Streak Legend', description: '30 day reading streak', icon: '🔥', unlocked: false, progress: 28 },
            { id: 4, name: 'Genre Explorer', description: 'Read from 10 different genres', icon: '🗺️', unlocked: true },
            { id: 5, name: 'Night Owl', description: 'Read after midnight 50 times', icon: '🦉', unlocked: false, progress: 33 }
          ],
          readingActivity: [
            { date: '2025-07-23', books: 1, pages: 89, time: 2.5 },
            { date: '2025-07-22', books: 0, pages: 156, time: 3.2 },
            { date: '2025-07-21', books: 1, pages: 234, time: 4.1 },
            { date: '2025-07-20', books: 0, pages: 78, time: 1.8 },
            { date: '2025-07-19', books: 0, pages: 203, time: 3.7 }
          ],
          recommendations: [
            { title: 'Project Hail Mary', author: 'Andy Weir', reason: 'Based on your love for sci-fi', rating: 4.6 },
            { title: 'The Seven Husbands of Evelyn Hugo', author: 'Taylor Jenkins Reid', reason: 'Popular among readers like you', rating: 4.3 },
            { title: 'Klara and the Sun', author: 'Kazuo Ishiguro', reason: 'Similar themes to your recent reads', rating: 4.1 }
          ]
        };

        setStats(data.stats);
        setAchievements(data.achievements);
        setReadingActivity(data.readingActivity);
        setRecommendations(data.recommendations);
        
        // Simulate loading time for animations
        setTimeout(() => setIsLoaded(true), 100);
      };

      fetchProfileData();
    }
  }, [status]);

  if (status === 'loading' || !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg text-gray-600">Loading your reading universe...</p>
        </div>
      </div>
    );
  }

  const handleSignOut = () => {
    signOut({ redirect: false }).then(() => {
      router.push("/signin");
    });
  };

  if (status === 'authenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <Navbar user={{ name: session.user?.name || undefined, avatarUrl: session.user?.image || undefined }} />
        
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Enhanced Header Section */}
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
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-4 border-white flex flex-col items-center justify-center">
                <span className="text-white text-xs font-bold">{stats.level}</span>
                <span className="text-white text-xs">LVL</span>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {session.user?.name}
            </h1>
            <p className="text-lg text-gray-600 mb-2">{session.user?.email}</p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <span>📚 Reading Level {stats.level}</span>
              <span>•</span>
              <span>🏆 {achievements.filter(a => a.unlocked).length} Achievements</span>
              <span>•</span>
              <span>⏱️ {stats.readingTime}h total</span>
            </div>
            
            {/* XP Progress Bar */}
            <div className="max-w-md mx-auto mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>XP: {stats.xp}</span>
                <span>Next Level: {stats.nextLevelXp}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000"
                     style={{ width: `${(stats.xp / stats.nextLevelXp) * 100}%` }}></div>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
            <StatCard
              icon="📚"
              title="Total Books"
              value={stats.totalBooks}
              subtitle="completed"
              color="bg-gradient-to-r from-blue-500 to-blue-600"
              delay={100}
              trend={12}
              isLoaded={isLoaded}
            />
            <StatCard
              icon="💭"
              title="Quotes Saved"
              value={stats.totalQuotes}
              subtitle="inspirations"
              color="bg-gradient-to-r from-purple-500 to-purple-600"
              delay={200}
              trend={8}
              isLoaded={isLoaded}
            />
            <StatCard
              icon="🗂️"
              title="Flashcards"
              value={stats.totalFlashcards}
              subtitle="created"
              color="bg-gradient-to-r from-emerald-500 to-emerald-600"
              delay={300}
              trend={25}
              isLoaded={isLoaded}
            />
            <StatCard
              icon="🔥"
              title="Streak"
              value={`${stats.readingStreak} days`}
              subtitle="current"
              color="bg-gradient-to-r from-orange-500 to-orange-600"
              delay={400}
              trend={15}
              isLoaded={isLoaded}
            />
            <StatCard
              icon="📖"
              title="Pages Read"
              value={stats.totalPages.toLocaleString()}
              subtitle="total pages"
              color="bg-gradient-to-r from-teal-500 to-teal-600"
              delay={500}
              trend={7}
              isLoaded={isLoaded}
            />
            <StatCard
              icon="⭐"
              title="Avg Rating"
              value={stats.averageRating}
              subtitle="stars"
              color="bg-gradient-to-r from-yellow-500 to-yellow-600"
              delay={600}
              trend={3}
              isLoaded={isLoaded}
            />
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Reading Activity Heatmap */}
            <div className={`bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                 style={{ transitionDelay: '700ms' }}>
              <h3 className="text-xl font-bold text-gray-800 mb-6">Reading Activity</h3>
              <p className="text-sm text-gray-600 mb-4">Last 5 weeks</p>
              <ReadingHeatmap activityData={readingActivity} />
              <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
                <span>Less</span>
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
                  <div className="w-3 h-3 bg-green-200 rounded-sm"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
                  <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
                </div>
                <span>More</span>
              </div>
            </div>

            {/* Smart Recommendations */}
            <div className={`bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                 style={{ transitionDelay: '800ms' }}>
              <h3 className="text-xl font-bold text-gray-800 mb-6">📍 You Might Like</h3>
              <div className="space-y-4">
                {recommendations.map((book, index) => (
                  <div key={index} className="p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 hover:shadow-md transition-all">
                    <h4 className="font-semibold text-gray-800 mb-1">{book.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                    <p className="text-xs text-purple-600 mb-2">{book.reason}</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex text-yellow-400">
                        {'⭐'.repeat(Math.floor(book.rating))}
                      </div>
                      <span className="text-sm text-gray-600">{book.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity Feed */}
            <div className={`bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                 style={{ transitionDelay: '900ms' }}>
              <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {readingActivity.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div>
                      <p className="font-medium text-gray-800">{new Date(day.date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-500">{day.pages} pages • {day.time}h</p>
                    </div>
                    <div className="text-right">
                      {day.books > 0 && (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          ✓
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements Section */}
          <div className={`mb-8 transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
               style={{ transitionDelay: '1000ms' }}>
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">🏆 Achievements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <AchievementBadge key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </div>

          {/* Enhanced Reading Goals */}
          <div className={`bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8 transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
               style={{ transitionDelay: '1100ms' }}>
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">🎯 2025 Reading Goals</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Annual Target</span>
                  <span className="text-gray-600">{stats.totalBooks}/60 books</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-1000"
                       style={{ width: `${(stats.totalBooks / 60) * 100}%` }}></div>
                </div>
                
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">This Month</span>
                  <span className="text-gray-600">{stats.booksThisMonth}/5 books</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full transition-all duration-1000"
                       style={{ width: `${(stats.booksThisMonth / 5) * 100}%` }}></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-800">{stats.favoriteGenre}</p>
                  <p className="text-sm text-gray-500">Favorite Genre</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-800">{stats.averageRating}★</p>
                  <p className="text-sm text-gray-500">Avg Rating</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-800">{Math.round(stats.totalPages/stats.totalBooks)}</p>
                  <p className="text-sm text-gray-500">Avg Pages/Book</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-800">{Math.round(stats.readingTime/stats.totalBooks)}h</p>
                  <p className="text-sm text-gray-500">Avg Time/Book</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sign Out Button */}
          <div className={`text-center transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
               style={{ transitionDelay: '1200ms' }}>
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