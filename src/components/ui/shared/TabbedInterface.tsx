/** @format */

import React, { useState, useEffect } from 'react';
import { HighlightMatches } from './HighlightMatches';

// Define the props interface with a generic type T
interface TabbedInterfaceProps<T extends object> {
	items: T[];
	getLabel: (item: T) => string;
	getIcon: (item: T) => React.ReactNode;
	renderContent: (item: T) => React.ReactNode;
	query: string;
}

// Define the component as a generic function
export function TabbedInterface<T extends object>({
	items,
	getLabel,
	getIcon,
	renderContent,
	query,
}: TabbedInterfaceProps<T>): React.ReactElement | null {
	const [activeTab, setActiveTab] = useState(0);

	// Effect to reset active tab if it becomes out of bounds (e.g. from filtering)
	useEffect(() => {
		if (activeTab >= items.length && items.length > 0) {
			setActiveTab(0);
		}
	}, [items.length, activeTab]);

	// Handle case where there are no items to render
	if (items.length === 0) {
		return null;
	}

	// This ensures we don't try to access an index that is temporarily out of bounds
	// while the useEffect is still pending to update the state.
	const safeActiveTab = Math.min(activeTab, items.length - 1);
	const activeItem = items[safeActiveTab];

	if (!activeItem) {
		return null;
	}

	return (
		<div>
			<div className='flex flex-wrap border-b border-gray-300 dark:border-slate-700 mb-6 -mx-4 px-2'>
				{items.map((item, index) => {
					const isActive = index === safeActiveTab;
					return (
						<button
							key={`${getLabel(item)}-${index}`} // Add index to key to prevent issues with duplicate labels
							onClick={() => setActiveTab(index)}
							role='tab'
							aria-selected={isActive}
							className={`flex items-center gap-2 px-3 sm:px-4 py-3 font-semibold text-sm transition-colors duration-200 ease-in-out -mb-px border-b-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-t-md
                                ${
																	isActive
																		? 'text-sky-600 dark:text-sky-400 border-sky-600 dark:border-sky-400'
																		: 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-400 dark:hover:border-slate-500'
																}
                            `}>
							{getIcon(item)}
							<span className='text-left'>
								<HighlightMatches
									text={getLabel(item)}
									query={query}
								/>
							</span>
						</button>
					);
				})}
			</div>

			<div
				className='animate-fade-in-up opacity-0'
				style={{ animationDuration: '0.3s' }}
				key={getLabel(activeItem)}>
				{renderContent(activeItem)}
			</div>
		</div>
	);
}
