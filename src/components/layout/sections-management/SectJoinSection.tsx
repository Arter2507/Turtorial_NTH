/** @format */

import React from 'react';
import type { SectJoinGuide } from '../../../types/types';
import { TabbedInterface } from '../../ui/shared/TabbedInterface';
import { ComplexDetailRenderer } from '../../ui/shared/ComplexDetailRenderer';
import { HighlightMatches } from '../../ui/shared/HighlightMatches';
import { UsersIcon, CoinBagIcon, KeyIcon } from '../../common/icons';

interface Props {
	content: SectJoinGuide[];
	query: string;
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
	'Tương Tư Môn': UsersIcon,
	'Cái Bang': CoinBagIcon,
};

export const SectJoinSection: React.FC<Props> = ({ content, query }) => {
	return (
		<TabbedInterface
			items={content}
			getLabel={(item) => item['Môn Phái']}
			getIcon={(item) => {
				const Icon = iconMap[item['Môn Phái']] || KeyIcon;
				return <Icon className='h-5 w-5 shrink-0' />;
			}}
			renderContent={(item) => (
				<div className='bg-white/50 dark:bg-slate-800/50 p-6 rounded-lg shadow-md border border-gray-200 dark:border-slate-700'>
					<h4 className='font-bold text-lg text-sky-600 dark:text-sky-400 mb-3'>
						<HighlightMatches
							text={item['Môn Phái']}
							query={query}
						/>
					</h4>
					<div className='space-y-2 text-sm divide-y divide-slate-200 dark:divide-slate-700'>
						{Object.entries(item)
							.filter(([k]) => k !== 'Môn Phái')
							.map(([key, value]) => (
								<ComplexDetailRenderer
									key={key}
									label={key}
									value={value}
									query={query}
								/>
							))}
					</div>
				</div>
			)}
			query={query}
		/>
	);
};
