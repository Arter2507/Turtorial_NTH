/** @format */

import React from 'react';
import type { ExecutiveSummaryItem } from '../../../types/types';
import { HighlightMatches } from '../../ui/shared/HighlightMatches';

interface Props {
	content: ExecutiveSummaryItem[];
	query: string;
}

export const ExecutiveSummarySection: React.FC<Props> = ({
	content,
	query,
}) => {
	return (
		<ol className='list-decimal list-inside space-y-4'>
			{content.map((item, index) => (
				<li
					key={index}
					className='text-gray-700 dark:text-gray-300 pl-2'>
					<span className='font-semibold text-gray-800 dark:text-gray-200'>
						<HighlightMatches
							text={item['Mô tả']}
							query={query}
						/>
					</span>
				</li>
			))}
		</ol>
	);
};
