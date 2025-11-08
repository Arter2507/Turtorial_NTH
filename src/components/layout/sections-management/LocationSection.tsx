/** @format */

import React, { useState } from 'react';
import type {
	LocationsData,
	ChestLocation,
	EncounterLocation,
	TamThanhSonChest,
} from '../../../types/types';
import { TabbedInterface } from '../../ui/shared/TabbedInterface';
import { HighlightMatches } from '../../ui/shared/HighlightMatches';
import { useToast } from '../../../lib/toast';
import {
	MountainIcon,
	BuildingIcon,
	BridgeIcon,
	GateIcon,
	PagodaIcon,
	VillageIcon,
	MapPinIcon,
	ClipboardIcon,
	CheckIcon,
} from '../../common/icons';

interface Props {
	content: LocationsData;
	query: string;
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
	'Tam Thanh Sơn': MountainIcon,
	'Biện Kinh': BuildingIcon,
	'Hàng Châu': BridgeIcon,
	'Nhạn Môn Quan': GateIcon,
	'Từ Châu': PagodaIcon,
	'Đào Khê Thôn': VillageIcon,
};

export const LocationSection: React.FC<Props> = ({ content, query }) => {
	const [copiedCoord, setCopiedCoord] = useState<string | null>(null);
	const showToast = useToast();

	const handleCopy = async (coord: string) => {
		try {
			await navigator.clipboard.writeText(coord);
			setCopiedCoord(coord);
			showToast('Sao chép tọa độ thành công', 'success');
			setTimeout(() => setCopiedCoord(null), 2000);
		} catch (err) {
			console.error('Failed to copy text: ', err);
			showToast('Không thể sao chép tọa độ', 'error');
		}
	};

	const locationEntries = Object.entries(content);

	return (
		<TabbedInterface
			items={locationEntries}
			getLabel={([name]) => name.replace(/ \(\d+ Rương\)/, '')}
			getIcon={([name]) => {
				const key = Object.keys(iconMap).find((k) => name.startsWith(k));
				const Icon = key ? iconMap[key] : MapPinIcon;
				return <Icon className='h-5 w-5 shrink-0' />;
			}}
			renderContent={([locationName, items]) => (
				<div>
					<h3 className='text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b border-gray-300 dark:border-slate-700'>
						<HighlightMatches
							text={locationName}
							query={query}
						/>
					</h3>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						{(
							items as (ChestLocation | EncounterLocation | TamThanhSonChest)[]
						).map((item, index) => (
							<div
								key={index}
								className='bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg border border-gray-200 dark:border-slate-700'>
								<div className='font-semibold text-sky-600 dark:text-sky-400 mb-2'>
									{'Tên Kỳ Ngộ' in item ? (
										<HighlightMatches
											text={item['Tên Kỳ Ngộ']}
											query={query}
										/>
									) : (
										<HighlightMatches
											text={item['Vị trí']}
											query={query}
										/>
									)}
								</div>
								<div className='flex items-center justify-between text-sm text-gray-600 dark:text-gray-400'>
									<div className='flex items-center gap-2'>
										<span className='font-medium'>Tọa độ:</span>{' '}
										<HighlightMatches
											text={item['Tọa độ']}
											query={query}
										/>
									</div>
									<button
										onClick={() => handleCopy(item['Tọa độ'])}
										className='p-1.5 rounded-md text-gray-500 hover:text-sky-600 hover:bg-sky-100 dark:hover:bg-sky-900/30 dark:hover:text-sky-400 transition-colors'
										title='Copy coordinates'>
										{copiedCoord === item['Tọa độ'] ? (
											<CheckIcon className='h-4 w-4' />
										) : (
											<ClipboardIcon className='h-4 w-4' />
										)}
									</button>
								</div>
								<p className='text-sm text-gray-600 dark:text-gray-400'>
									<span className='font-medium'>
										{'Cơ chế' in item ? 'Cơ chế' : 'Yêu cầu'}:
									</span>
									<HighlightMatches
										text={'Cơ chế' in item ? item['Cơ chế'] : item['Yêu cầu']}
										query={query}
									/>
								</p>
							</div>
						))}
					</div>
				</div>
			)}
			query={query}
		/>
	);
};
