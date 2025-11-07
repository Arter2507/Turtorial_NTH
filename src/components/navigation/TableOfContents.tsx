/** @format */

import React, { useRef, useState } from 'react';
// Text-to-speech controls

import { XIcon } from '../common/icons';

interface TOCProps {
	// FIX: Updated type to allow passing className via cloneElement.
	sections: {
		id: string;
		title: string;
		icon: React.ReactElement<{ className?: string }>;
	}[];
	isOpen: boolean;
	onClose: () => void;
	matchedSectionIds: Set<string>;
}

export const TableOfContents: React.FC<TOCProps> = ({
	sections,
	isOpen,
	onClose,
	matchedSectionIds,
}) => {
	return (
		<>
			{/* Overlay */}
			<div
				className={`fixed inset-0 bg-black/50 z-30 transition-opacity md:hidden ${
					isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
				}`}
				onClick={onClose}
				aria-hidden='true'></div>

			{/* Sidebar */}
			<aside
				className={`fixed top-0 left-0 w-72 h-full bg-gray-50 dark:bg-slate-900 z-40 shadow-xl transition-transform transform md:hidden ${
					isOpen ? 'translate-x-0' : '-translate-x-full'
				}`}>
				<div className='p-4 flex justify-between items-center border-b dark:border-slate-800'>
					<h3 className='font-bold text-lg text-gray-900 dark:text-white'>
						Mục Lục
					</h3>
					<button
						onClick={onClose}
						className='p-2 -mr-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-800'
						aria-label='Close menu'>
						<XIcon className='h-6 w-6' />
					</button>
				</div>
				<nav className='p-4'>
					<ul className='space-y-2'>
						{sections.map(({ id, title, icon }) => {
							const isMatched = matchedSectionIds.has(id);
							return (
								<li key={id}>
									<div className='flex items-center justify-between gap-2'>
										<a
											href={`#${id}`}
											onClick={onClose}
											className={`flex items-center gap-3 py-1 text-sm transition-colors ${
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
		</>
	);
};
