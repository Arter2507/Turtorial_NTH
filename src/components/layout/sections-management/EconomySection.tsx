/** @format */

import React from 'react';
import type { EconomyData } from '../../../types/types';
import { HighlightMatches } from '../../ui/shared/HighlightMatches';

interface Props {
	content: EconomyData;
	query: string;
}

export const EconomySection: React.FC<Props> = ({ content, query }) => {
	return (
		<div className='bg-white/50 dark:bg-slate-800/50 p-6 rounded-lg shadow-md border border-gray-200 dark:border-slate-700 space-y-4'>
			{Object.entries(content).map(([key, value]) => (
				<div key={key}>
					<h4 className='font-semibold text-md text-sky-600 dark:text-sky-400 mb-2'>
						<HighlightMatches
							text={key}
							query={query}
						/>
					</h4>
					<ul className='list-disc list-inside space-y-2 pl-2'>
						{Array.isArray(value) &&
							value.map((item, index) =>
								typeof item === 'string' ? (
									<li key={index}>
										<HighlightMatches
											text={item}
											query={query}
										/>
									</li>
								) : (
									<li key={item.Tên}>
										<strong>
											<HighlightMatches
												text={item.Tên}
												query={query}
											/>
											:
										</strong>{' '}
										<HighlightMatches
											text={item['Vai Trò']}
											query={query}
										/>
									</li>
								)
							)}
					</ul>
				</div>
			))}
		</div>
	);
};
