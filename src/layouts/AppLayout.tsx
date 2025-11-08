/** @format */

import React from 'react';
import { Header } from '../components/layout/Header';
import { TableOfContents } from '../components/navigation/TableOfContents';
import { Footer } from '../components/layout/Footer';
import { Sitemap } from '../components/navigation/Sitemap';
import { ScrollToTopButton } from '../components/ui/ScrollToTopButton';
import FeedbackButton from '../components/ui/FeedbackButton';
import PWAOnlineIndicator from '../components/pwa/PWAOnlineIndicator';
import { XIcon, ScrollIcon } from '../components/common/icons';

interface SectionInfo {
	id: string;
	title: string;
	icon: React.ReactElement<{ className?: string }>;
}

interface DesktopTOCProps {
	sections: SectionInfo[];
	className?: string;
	matchedSectionIds: Set<string>;
}

const DesktopTableOfContents: React.FC<DesktopTOCProps> = ({
	sections,
	className = '',
	matchedSectionIds,
}) => {
	return (
		<aside className={`${className} sticky top-24 self-start`}>
			<nav className='p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-slate-700 h-full'>
				<h3 className='font-bold text-lg mb-3 text-gray-900 dark:text-white'>
					Mục Lục
				</h3>
				<ul className='space-y-2'>
					{sections.map(({ id, title, icon }) => {
						const isMatched = matchedSectionIds.has(id);
						return (
							<li key={id}>
								<a
									href={`#${id}`}
									className={`flex items-center gap-3 text-sm transition-colors rounded-md px-2 py-1
                  ${
										isMatched
											? 'font-semibold text-sky-600 dark:text-sky-400'
											: 'text-gray-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400'
									}`}>
									{React.cloneElement(icon, { className: 'h-5 w-5 shrink-0' })}
									<span>{title}</span>
								</a>
							</li>
						);
					})}
				</ul>
			</nav>
		</aside>
	);
};

interface AppLayoutProps {
	children: React.ReactNode;
	guideTitle: string;
	theme: 'light' | 'dark';
	toggleTheme: () => void;
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	isMenuOpen: boolean;
	setIsMenuOpen: (isOpen: boolean) => void;
	isHelpOpen: boolean;
	setIsHelpOpen: (isOpen: boolean) => void;
	sections: SectionInfo[];
	matchedSectionIds: Set<string>;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
	children,
	guideTitle,
	theme,
	toggleTheme,
	searchQuery,
	setSearchQuery,
	isMenuOpen,
	setIsMenuOpen,
	isHelpOpen,
	setIsHelpOpen,
	sections,
	matchedSectionIds,
}) => {
	return (
		<>
			<PWAOnlineIndicator />
			<Header
				title={guideTitle}
				titleIcon={<ScrollIcon />}
				theme={theme}
				toggleTheme={toggleTheme}
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				onToggleMenu={() => setIsMenuOpen(true)}
				onOpenSitemap={() => setIsHelpOpen(true)}
			/>
			<TableOfContents
				sections={sections}
				isOpen={isMenuOpen}
				onClose={() => setIsMenuOpen(false)}
				matchedSectionIds={matchedSectionIds}
			/>
			<main className='container mx-auto px-4'>
				<div className='md:grid md:grid-cols-4 md:gap-8'>
					<div className='md:col-span-3'>{children}</div>
					<DesktopTableOfContents
						sections={sections}
						className='hidden md:block md:col-span-1'
						matchedSectionIds={matchedSectionIds}
					/>
				</div>
			</main>
			<Footer />
			{isHelpOpen && (
				<div
					className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'
					onClick={() => setIsHelpOpen(false)}>
					<div
						className='bg-white dark:bg-slate-900 rounded-lg shadow-lg max-w-lg md:max-w-4xl w-full relative p-6 max-h-[90vh] overflow-y-auto'
						onClick={(e) => e.stopPropagation()}>
						<button
							className='absolute top-2 right-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-800'
							onClick={() => setIsHelpOpen(false)}
							aria-label='Đóng sitemap'>
							<XIcon className='h-6 w-6' />
						</button>
						<Sitemap />
					</div>
				</div>
			)}
			<ScrollToTopButton />
			<FeedbackButton />
		</>
	);
};
