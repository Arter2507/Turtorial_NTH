import React, { useState, useEffect } from 'react';
import { ArrowUpIcon } from './icons';

export const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    // Show button if user has scrolled down 300px
    setIsVisible(window.scrollY > 300);
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={`
        fixed bottom-8 left-8 z-20
        p-3 rounded-full
        bg-sky-600 hover:bg-sky-700
        dark:bg-amber-500 dark:hover:bg-amber-600
        text-white dark:text-slate-900
        shadow-lg
        transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-slate-900 focus:ring-sky-500 dark:focus:ring-amber-500
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
      `}
      aria-label="Scroll to top"
      tabIndex={isVisible ? 0 : -1}
    >
      <ArrowUpIcon className="h-6 w-6" />
    </button>
  );
};
