/** @format */

import React from 'react';
import type { SpecialSkillData } from '../../../types/types';
import { TabbedInterface } from '../../ui/shared/TabbedInterface';
import { HighlightMatches } from '../../ui/shared/HighlightMatches';
import {
	SwordIcon,
	ShieldCheckIcon,
	CollectionIcon,
	GemIcon,
	HammerIcon,
} from '../../common/icons';

interface Props {
	content: SpecialSkillData;
	query: string;
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
	'Đặc Kỹ Vũ Khí (Rèn)': SwordIcon,
	'Đặc Kỹ Áo': ShieldCheckIcon,
	'Trang Bị Khuyên Dùng': CollectionIcon,
	'Khảm Ngọc': GemIcon,
};

export const SpecialSkillsSection: React.FC<Props> = ({ content, query }) => {
	const skillEntries = Object.entries(content);

	return (
		<TabbedInterface
			items={skillEntries}
			getLabel={([key]) => key}
			getIcon={([key]) => {
				const Icon = iconMap[key] || HammerIcon;
				return <Icon className='h-5 w-5 shrink-0' />;
			}}
			renderContent={([key, value]) => (
				<div className='bg-white/50 dark:bg-slate-800/50 p-6 rounded-lg shadow-md border border-gray-200 dark:border-slate-700'>
					<h4 className='font-bold text-lg text-sky-600 dark:text-sky-400 mb-3'>
						<HighlightMatches
							text={key}
							query={query}
						/>
					</h4>
					{Array.isArray(value) ? (
						<ul className='space-y-4'>
							{value.map((item, index) =>
								typeof item === 'string' ? (
									<li
										key={index}
										className='list-disc list-inside'>
										<HighlightMatches
											text={item}
											query={query}
										/>
									</li>
								) : (
									<li key={item.Tên}>
										<strong className='block text-gray-800 dark:text-gray-200'>
											<HighlightMatches
												text={item.Tên}
												query={query}
											/>
										</strong>
										<div className='pl-4 mt-1 text-gray-700 dark:text-gray-300'>
											<HighlightMatches
												text={item['Hiệu Quả']}
												query={query}
											/>
											{item.Nguồn && (
												<span className='block text-xs italic text-gray-500 dark:text-gray-400 mt-1'>
													(Nguồn:{' '}
													<HighlightMatches
														text={item.Nguồn}
														query={query}
													/>
													)
												</span>
											)}
										</div>
									</li>
								)
							)}
						</ul>
					) : (
						<p className='text-gray-700 dark:text-gray-300'>
							<HighlightMatches
								text={String(value)}
								query={query}
							/>
						</p>
					)}
				</div>
			)}
			query={query}
		/>
	);
};
