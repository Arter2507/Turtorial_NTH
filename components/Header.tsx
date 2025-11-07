import React from 'react';
import { SunIcon, MoonIcon, SearchIcon, MenuIcon } from './icons';

interface HeaderProps {
  title: string;
  // FIX: Updated type to allow passing className via cloneElement.
  titleIcon?: React.ReactElement<{ className?: string }>;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onToggleMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, titleIcon, theme, toggleTheme, searchQuery, setSearchQuery, onToggleMenu }) => {
  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm mb-8">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button
            onClick={onToggleMenu}
            className="p-2 -ml-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-800 md:hidden"
            aria-label="Open menu"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-3 min-w-0">
            {titleIcon && React.cloneElement(titleIcon, { className: "h-7 w-7 text-sky-600 dark:text-sky-400 hidden sm:block shrink-0" })}
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate">
              {title}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 justify-end">
          <div className="relative w-full max-w-xs sm:max-w-sm md:w-64">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-200 dark:bg-slate-800 text-gray-900 dark:text-gray-200 border border-transparent focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
            />
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-slate-900 focus:ring-sky-500 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6 text-amber-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};