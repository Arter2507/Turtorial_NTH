/** @format */

import React from 'react';
import type { DivineWeaponGuide } from '../../../types/types';
import { ComplexDetailRenderer } from '../../ui/shared/ComplexDetailRenderer';

interface Props {
	content: DivineWeaponGuide;
	query: string;
}

export const DivineWeaponSection: React.FC<Props> = ({ content, query }) => {
	return (
		<div className='bg-white/50 dark:bg-slate-800/50 p-6 rounded-lg shadow-md border border-gray-200 dark:border-slate-700'>
			<div className='space-y-2 text-sm divide-y divide-slate-200 dark:divide-slate-700'>
				{Object.entries(content).map(([key, value]) => (
					<ComplexDetailRenderer
						key={key}
						label={key}
						value={value}
						query={query}
					/>
				))}
			</div>
		</div>
	);
};
