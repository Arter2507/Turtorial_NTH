/** @format */

import React from 'react';
import type { ResourceItem } from '../../../types/types';
import { TabbedInterface } from '../../ui/shared/TabbedInterface';
import { HighlightMatches } from '../../ui/shared/HighlightMatches';
import {
	CoinBagIcon,
	CoinIcon,
	GemIcon,
	StarBadgeIcon,
	BookSparklesIcon,
	FlaskIcon,
} from '../../common/icons';

interface Props {
	content: ResourceItem[];
	query: string;
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
	'Giao Tử (Ngân Phiếu)': CoinBagIcon,
	'Xu (Tiền Đồng Giao Dịch)': CoinIcon,
	'Ngọc Khóa (Văn Ngọc Khóa)': GemIcon,
	'Điểm Phong Vân Lệnh': StarBadgeIcon,
	'Nội Công (Tím/Vàng)': BookSparklesIcon,
	'Hoạt Lực': FlaskIcon,
};

export const ResourceSection: React.FC<Props> = ({ content, query }) => {
	return (
		<TabbedInterface
			items={content}
			getLabel={(item) => item['Tên Tài Nguyên']}
			getIcon={(item) => {
				const Icon = iconMap[item['Tên Tài Nguyên']] || CoinIcon;
				return <Icon className='h-5 w-5 shrink-0' />;
			}}
			renderContent={(item) => (
				<div className='bg-white/50 dark:bg-slate-800/50 p-6 rounded-lg shadow-md border border-gray-200 dark:border-slate-700'>
					<h4 className='font-bold text-lg text-sky-600 dark:text-sky-400 mb-3'>
						<HighlightMatches
							text={item['Tên Tài Nguyên']}
							query={query}
						/>
					</h4>
					<div className='space-y-2 text-sm'>
						<p>
							<strong className='font-semibold'>Cách Kiếm:</strong>{' '}
							<HighlightMatches
								text={item['Cách Kiếm']}
								query={query}
							/>
						</p>
						<p>
							<strong className='font-semibold'>Ưu Tiên:</strong>{' '}
							<HighlightMatches
								text={item['Ưu Tiên']}
								query={query}
							/>
						</p>
					</div>
				</div>
			)}
			query={query}
		/>
	);
};
