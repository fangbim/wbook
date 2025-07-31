'use client';

import { useState } from 'react';
import { IoSearch } from "react-icons/io5";

export default function DemoPage() {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Browser Window Container */}
      <div className="max-w-6xl mx-auto">
        {/* Left Browser Window - Initial State */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
            {/* Browser Header */}
            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <span className="text-sm text-gray-600 font-medium">Navbar</span>
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            </div>
            
            {/* Browser Content */}
            <div className="relative h-96 bg-white">
              {/* Main Content Area */}
              <div className="absolute inset-4 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <span className="text-gray-500 text-lg">Content</span>
              </div>
              
              {/* Floating Search Bar */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                <div className="bg-green-300 rounded-full px-6 py-3 flex items-center gap-3 shadow-lg border border-green-400">
                  <span className="text-gray-700 font-medium">Search</span>
                  <IoSearch className="w-5 h-5 text-gray-700" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center mb-8">
          <div className="text-4xl text-gray-600">→</div>
        </div>

        {/* Right Browser Window - Expanded State */}
        <div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
            {/* Browser Header */}
            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <span className="text-sm text-gray-600 font-medium">Navbar</span>
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            </div>
            
            {/* Browser Content with Expanded Search */}
            <div className="relative h-96 bg-white">
              {/* Expanded Search Overlay */}
              <div className="absolute inset-4 bg-green-200 rounded-lg">
                {/* Search Bar at Top */}
                <div className="p-4">
                  <div className="bg-green-300 rounded-full px-6 py-3 flex items-center gap-3 shadow-lg border border-green-400">
                    <span className="text-gray-700 font-medium">Search</span>
                    <IoSearch className="w-5 h-5 text-gray-700" />
                  </div>
                </div>
                
                {/* Content Area Below Search */}
                <div className="mx-4 mb-4 h-64 bg-green-100 rounded-lg flex items-center justify-center border-2 border-dashed border-green-400">
                  <span className="text-gray-600 text-lg">Content</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Demo Section */}
      <div className="max-w-4xl mx-auto mt-16">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Interactive Demo</h2>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          {/* Browser Header */}
          <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <span className="text-sm text-gray-600 font-medium">Navbar</span>
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
          </div>
          
          {/* Interactive Content */}
          <div className="relative h-96 bg-white overflow-hidden">
            {/* Main Content */}
            <div className={`absolute inset-4 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 transition-all duration-500 ${isSearchExpanded ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              <span className="text-gray-500 text-lg">Content</span>
            </div>
            
            {/* Search Overlay */}
            <div className={`absolute inset-4 bg-green-200 rounded-lg transition-all duration-500 ${isSearchExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
              <div className="p-4">
                <div className="bg-green-300 rounded-full px-6 py-3 flex items-center gap-3 shadow-lg border border-green-400">
                  <input
                    type="text"
                    placeholder="Search"
                    className="bg-transparent text-gray-700 font-medium outline-none flex-1"
                    onBlur={() => setIsSearchExpanded(false)}
                    autoFocus={isSearchExpanded}
                  />
                  <IoSearch className="w-5 h-5 text-gray-700" />
                </div>
              </div>
              
              <div className="mx-4 mb-4 h-64 bg-green-100 rounded-lg flex items-center justify-center border-2 border-dashed border-green-400">
                <span className="text-gray-600 text-lg">Content</span>
              </div>
            </div>
            
            {/* Floating Search Button */}
            <div className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 transition-all duration-500 ${isSearchExpanded ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
              <button
                onClick={() => setIsSearchExpanded(true)}
                className="bg-green-300 rounded-full px-6 py-3 flex items-center gap-3 shadow-lg border border-green-400 hover:bg-green-400 transition-colors"
              >
                <span className="text-gray-700 font-medium">Search</span>
                <IoSearch className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
        
        <p className="text-center text-gray-600 mt-4">
          Click the search button to see the expansion effect
        </p>
      </div>
    </div>
  );
}