/** @format */

import React from 'react';

export const HighlightMatches: React.FC<{
	text: string | null | undefined;
	query: string;
}> = ({ text, query }) => {
	if (!text) return null;
	if (!query.trim()) {
		return <>{text}</>;
	}
	const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	if (escapedQuery === '') {
		return <>{text}</>;
	}
	const regex = new RegExp(`(${escapedQuery})`, 'gi');
	const parts = text.split(regex);
	return (
		<>
			{parts.filter(Boolean).map((part, i) =>
				part.toLowerCase() === query.toLowerCase() ? (
					<mark
						key={i}
						className='bg-amber-300 dark:bg-amber-500 text-slate-900 rounded-sm px-1 py-0.5'>
						{part}
					</mark>
				) : (
					<React.Fragment key={i}>{part}</React.Fragment>
				)
			)}
		</>
	);
};
