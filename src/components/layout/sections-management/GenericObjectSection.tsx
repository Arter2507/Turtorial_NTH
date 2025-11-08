/** @format */

import React from 'react';
import { HighlightMatches } from '../../ui/shared/HighlightMatches';
import { ChevronRightIcon } from '../../common/icons';

interface Props {
	content: Record<string, unknown>;
	query: string;
}

export const GenericObjectSection: React.FC<Props> = ({ content, query }) => {
	return (
		<ul className='space-y-4'>
			{Object.entries(content).map(([key, value]) => (
				<li
					key={key}
					className='p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-slate-700'>
					<h4 className='font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2'>
						<ChevronRightIcon className='h-5 w-5 text-sky-500' />
						<HighlightMatches
							text={key}
							query={query}
						/>
					</h4>
					<p className='text-gray-700 dark:text-gray-300 mt-1 pl-7'>
						<HighlightMatches
							text={String(value)}
							query={query}
						/>
					</p>
				</li>
			))}
		</ul>
	);
};
