/** @format */

import React from 'react';
import type { CharacterBuild } from '../../../types/types';
import { TabbedInterface } from '../../ui/shared/TabbedInterface';
import { ComplexDetailRenderer } from '../../ui/shared/ComplexDetailRenderer';
import { HighlightMatches } from '../../ui/shared/HighlightMatches';
import {
	LeafIcon,
	GhostIcon,
	SpearIcon,
	DaggerIcon,
	MusicIcon,
	FistIcon,
	ShieldCheckIcon,
} from '../../common/icons';

interface Props {
	content: CharacterBuild[];
	query: string;
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
	'Tố Vấn (Healer/Hỗ Trợ)': LeafIcon,
	'Cửu Linh (DPS Tầm Xa)': GhostIcon,
	'Huyết Hà (DPS Cận Chiến)': SpearIcon,
	'Toái Mộng (Sát Thủ Cơ Động)': DaggerIcon,
	'Thần Tương (DPS Tầm Xa)': MusicIcon,
	'Thiết Y (Tanker/DPS)': FistIcon,
};

export const CharacterBuildsSection: React.FC<Props> = ({ content, query }) => {
	return (
		<div className='space-y-6'>
			<TabbedInterface
				items={content}
				getLabel={(item) => item['Môn Phái']}
				getIcon={(item) => {
					const Icon = iconMap[item['Môn Phái']] || ShieldCheckIcon;
					return <Icon className='h-5 w-5 shrink-0' />;
				}}
				renderContent={(item) => (
					<div className='bg-white/50 dark:bg-slate-800/50 p-6 rounded-lg shadow-md border border-gray-200 dark:border-slate-700'>
						<div className='flex items-center justify-between mb-3'>
							<h4 className='font-bold text-lg text-sky-600 dark:text-sky-400'>
								<HighlightMatches
									text={item['Môn Phái']}
									query={query}
								/>
							</h4>
						</div>
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
		</div>
	);
};
