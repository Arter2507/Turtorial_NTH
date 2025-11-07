/** @format */

import { useState, useMemo } from 'react';
import { guideData } from './types/data';
import PWAOnlineIndicator from './components/pwa/PWAOnlineIndicator';
import type { GameGuideData } from './types/types';
import { useTheme } from './hooks/useTheme';
import { Header } from './components/layout/Header';
import { TableOfContents } from './components/navigation/TableOfContents';
import { Footer } from './components/layout/Footer';
import { Sitemap } from './components/navigation/Sitemap';
import { Section } from './components/layout/Section';
import { ScrollToTopButton } from './components/ui/ScrollToTopButton';
import FeedbackButton from './components/ui/FeedbackButton';
import { ToastProvider } from './components/ui/Toast';
import {
	ClipboardListIcon,
	BookOpenIcon,
	CollectionIcon,
	CogIcon,
	CalendarIcon,
	SparklesIcon,
	MapPinIcon,
	ShieldCheckIcon,
	HammerIcon,
	UsersIcon,
	CashIcon,
	KeyIcon,
	SwordIcon,
	ScrollIcon,
} from './components/common/icons';
import React from 'react';

const slugify = (text: string): string => {
	return text
		.toLowerCase()
		.replace(/[^^\w\s-]/g, '') // remove non-word chars
		.replace(/[\s_-]+/g, '-') // collapse whitespace and replace by -
		.replace(/^-+|-+$/g, ''); // trim -
};

const sectionIcons: Record<string, React.ReactElement> = {
	'Tóm tắt Điều hành': <ClipboardListIcon />,
	'I. Khởi Động & Cơ Chế Cốt Lõi': <BookOpenIcon />,
	'II. Hướng Dẫn Kiếm Tài Nguyên': <CollectionIcon />,
	'III. Hướng Dẫn Sử Dụng Tài Nguyên': <CogIcon />,
	'IV. Lộ Trình Nhiệm Vụ': <CalendarIcon />,
	'V. Mẹo Tăng Cấp & Sức Mạnh': <SparklesIcon />,
	'VI. Vị Trí Rương & Kỳ Ngộ': <MapPinIcon />,
	'VII. Hướng Dẫn Build Nhân Vật': <ShieldCheckIcon />,
	'VIII. Đặc Kỹ (Rèn) & Trang Bị': <HammerIcon />,
	'IX. Đồng Hành (Quần Hiệp) Tối Ưu': <UsersIcon />,
	'X. Kinh Tế & Kiếm Tiền': <CashIcon />,
	'XI. Gia Nhập Môn Phái Ẩn (Kỳ Ngộ)': <KeyIcon />,
	'XII. Kỳ Ngộ Thần Binh': <SwordIcon />,
};

// FIX: Updated `icon` type to allow passing className via cloneElement.
const DesktopTableOfContents: React.FC<{
	sections: {
		id: string;
		title: string;
		icon: React.ReactElement<{ className?: string }>;
	}[];
	className?: string;
	matchedSectionIds: Set<string>;
}> = ({ sections, className = '', matchedSectionIds }) => {
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
								<div className='flex items-center justify-between gap-2'>
									<a
										href={`#${id}`}
										className={`flex items-center gap-3 text-sm transition-colors flex-1 ${
											isMatched
												? 'font-semibold text-sky-600 dark:text-sky-400'
												: 'text-gray-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400'
										}`}>
										{React.cloneElement(icon, {
											className: 'h-5 w-5 shrink-0',
										})}
										<span>{title}</span>
									</a>
								</div>
							</li>
						);
					})}
				</ul>
			</nav>
		</aside>
	);
};

const App: React.FC = () => {
	const [theme, toggleTheme] = useTheme();
	const [searchQuery, setSearchQuery] = useState('');
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isSitemapOpen, setIsSitemapOpen] = useState(false);

	const sections = useMemo(() => {
		return Object.keys(guideData)
			.filter((key) => key !== 'Tên Tài Liệu')
			.map((key) => ({
				id: slugify(key),
				title: key,
				icon: sectionIcons[key] || <BookOpenIcon />,
			}));
	}, []);

	const filteredData = useMemo(() => {
		if (!searchQuery.trim()) {
			return guideData;
		}

		const lowercasedQuery = searchQuery.toLowerCase();
		// Use a loose record during filtering to avoid complex indexed-assignment type issues.
		const newFilteredData: Record<string, unknown> = {
			'Tên Tài Liệu': guideData['Tên Tài Liệu'],
		};

		for (const [key, value] of Object.entries(guideData)) {
			if (key === 'Tên Tài Liệu') continue;

			// Check if section title matches
			if (key.toLowerCase().includes(lowercasedQuery)) {
				newFilteredData[key as keyof GameGuideData] =
					value as unknown as GameGuideData[keyof GameGuideData];
				continue;
			}

			// Check if section content matches
			if (typeof value === 'object' && value !== null) {
				const stringifiedValue = JSON.stringify(value).toLowerCase();
				if (stringifiedValue.includes(lowercasedQuery)) {
					// If content matches, include the *entire* original section value.
					// Highlighting within the Section component will show the user where the matches are.
					newFilteredData[key as keyof GameGuideData] =
						value as unknown as GameGuideData[keyof GameGuideData];
				}
			}
		}
		return newFilteredData as unknown as GameGuideData;
	}, [searchQuery]);

	const matchedSectionIds = useMemo(() => {
		if (!searchQuery.trim()) {
			return new Set<string>();
		}
		const keys = Object.keys(filteredData).filter(
			(key) => key !== 'Tên Tài Liệu'
		);
		return new Set(keys.map(slugify));
	}, [searchQuery, filteredData]);

	const sectionsToRender = Object.entries(filteredData).filter(
		([key]) => key !== 'Tên Tài Liệu'
	);

	return (
		<ToastProvider>
			<>
				<PWAOnlineIndicator />
				<Header
					title={guideData['Tên Tài Liệu']}
					titleIcon={<ScrollIcon />}
					theme={theme}
					toggleTheme={toggleTheme}
					searchQuery={searchQuery}
					setSearchQuery={setSearchQuery}
					onToggleMenu={() => setIsMenuOpen(true)}
					onOpenSitemap={() => setIsSitemapOpen(true)}
				/>
				<TableOfContents
					sections={sections}
					isOpen={isMenuOpen}
					onClose={() => setIsMenuOpen(false)}
					matchedSectionIds={matchedSectionIds}
				/>
				<main className='container mx-auto px-4'>
					<div className='md:grid md:grid-cols-4 md:gap-8'>
						<div className='md:col-span-3'>
							{sectionsToRender.length > 0 ? (
								sectionsToRender.map(([key, content]) => (
									<Section
										key={key}
										id={slugify(key)}
										title={key}
										icon={sectionIcons[key]}
										content={content as unknown}
										searchQuery={searchQuery}
									/>
								))
							) : (
								<div className='text-center py-16'>
									<h2 className='text-2xl font-semibold text-gray-700 dark:text-gray-300'>
										Không tìm thấy kết quả
									</h2>
									<p className='text-gray-500 dark:text-gray-400 mt-2'>
										Hãy thử một từ khóa tìm kiếm khác.
									</p>
								</div>
							)}
						</div>
						<DesktopTableOfContents
							sections={sections}
							className='hidden md:block md:col-span-1'
							matchedSectionIds={matchedSectionIds}
						/>
					</div>
				</main>
				<Footer />
				{isSitemapOpen && (
					<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
						<div className='bg-white dark:bg-slate-900 rounded-lg shadow-lg max-w-lg md:max-w-4xl w-full relative p-6 max-h-[90vh] overflow-y-auto'>
							<button
								className='absolute top-2 right-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-800'
								onClick={() => setIsSitemapOpen(false)}
								aria-label='Đóng sitemap'>
								<span className='text-xl'>×</span>
							</button>
							<Sitemap />
						</div>
					</div>
				)}
				<ScrollToTopButton />
				<FeedbackButton />
			</>
		</ToastProvider>
	);
};

export default App;
