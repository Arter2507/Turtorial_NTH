/** @format */

import React, { useMemo, useState } from 'react';
import { useToast } from '../../lib/toast';
import type {
	ExecutiveSummaryItem,
	ResourceItem,
	ChestLocation,
	EncounterLocation,
	TamThanhSonChest,
	LocationsData,
	CharacterBuild,
	SpecialSkillData,
	CompanionData,
	EconomyData,
	SectJoinGuide,
	DivineWeaponGuide,
} from '../../types/types';
import {
	ClockIcon,
	ChevronRightIcon,
	// Class Icons
	LeafIcon,
	GhostIcon,
	SpearIcon,
	DaggerIcon,
	MusicIcon,
	FistIcon,
	// Resource Icons
	CoinBagIcon,
	CoinIcon,
	GemIcon,
	StarBadgeIcon,
	BookSparklesIcon,
	FlaskIcon,
	// Location Icons
	MountainIcon,
	BuildingIcon,
	BridgeIcon,
	GateIcon,
	PagodaIcon,
	VillageIcon,
	// FIX: Import missing icons.
	MapPinIcon,
	ShieldCheckIcon,
	ClipboardIcon,
	CheckIcon,
	SwordIcon,
	CollectionIcon,
	HammerIcon,
} from '../common/icons';

const slugify = (text: string): string => {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '');
};

interface SectionProps {
	id: string;
	title: string;
	icon?: React.ReactElement<{ className?: string }>;
	content: unknown; // Allow any content type from GameGuideData
	searchQuery: string;
}

const countWords = (content: unknown): number => {
	let totalWords = 0;
	if (typeof content === 'string') {
		return content.split(/\s+/).filter(Boolean).length;
	}
	if (Array.isArray(content)) {
		content.forEach((item) => {
			totalWords += countWords(item);
		});
	} else if (typeof content === 'object' && content !== null) {
		Object.values(content).forEach((value) => {
			totalWords += countWords(value);
		});
	}
	return totalWords;
};

const calculateReadingTime = (wordCount: number): string => {
	const wordsPerMinute = 225;
	const minutes = Math.ceil(wordCount / wordsPerMinute);
	if (minutes < 1) {
		return 'dưới 1 phút đọc';
	}
	return `${minutes} phút đọc`;
};

// Type Guards
const isExecutiveSummary = (item: unknown): item is ExecutiveSummaryItem =>
	typeof item === 'object' &&
	item !== null &&
	'Ưu tiên' in item &&
	'Mô tả' in item;
// FIX: Correct type guard to check for an array of ResourceItem.
const isResource = (item: unknown): item is ResourceItem[] =>
	Array.isArray(item) &&
	item.length > 0 &&
	typeof item[0] === 'object' &&
	'Tên Tài Nguyên' in item[0];
const isLocationData = (c: unknown): c is LocationsData => {
	if (typeof c !== 'object' || c === null || Array.isArray(c)) return false;
	const firstValue = Object.values(c)[0];
	return (
		Array.isArray(firstValue) &&
		firstValue.length > 0 &&
		typeof firstValue[0] === 'object' &&
		'Tọa độ' in firstValue[0]
	);
};
const isCharacterBuilds = (c: unknown): c is CharacterBuild[] =>
	Array.isArray(c) && c.length > 0 && 'Môn Phái' in c[0];
const isSpecialSkills = (c: unknown): c is SpecialSkillData =>
	typeof c === 'object' && c !== null && 'Đặc Kỹ Vũ Khí (Rèn)' in c;
const isCompanionData = (c: unknown): c is CompanionData =>
	typeof c === 'object' && c !== null && 'Tên Đồng Hành' in c;
const isEconomyData = (c: unknown): c is EconomyData =>
	typeof c === 'object' && c !== null && 'Phân Loại Tiền Tệ' in c;
const isSectJoinData = (c: unknown): c is SectJoinGuide[] =>
	Array.isArray(c) && c.length > 0 && 'Kích Hoạt Kỳ Ngộ' in c[0];
const isDivineWeaponData = (c: unknown): c is DivineWeaponGuide =>
	typeof c === 'object' && c !== null && 'Kích Hoạt & Khởi Đầu' in c;

const HighlightMatches: React.FC<{
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

const ComplexDetailRenderer: React.FC<{
	label: string;
	value: unknown;
	query: string;
	level?: number;
}> = ({ label, value, query, level = 0 }) => {
	const renderValue = (val: unknown) => {
		if (typeof val === 'string') {
			return (
				<HighlightMatches
					text={val}
					query={query}
				/>
			);
		}
		if (Array.isArray(val)) {
			const isSimpleArray = val.every((item) => typeof item === 'string');
			if (isSimpleArray) {
				return (
					<ul className='mt-1 list-disc list-inside space-y-1'>
						{val.map((item, index) => (
							<li key={index}>
								<HighlightMatches
									text={item as string}
									query={query}
								/>
							</li>
						))}
					</ul>
				);
			} else {
				return (
					<div className='mt-2 space-y-3'>
						{val.map((item, index) => (
							<div
								key={index}
								className='p-3 bg-gray-100 dark:bg-slate-700/60 rounded-lg border border-gray-200 dark:border-slate-600'>
								{renderValue(item)}
							</div>
						))}
					</div>
				);
			}
		}
		if (typeof val === 'object' && val !== null) {
			return (
				<div
					className={`mt-2 space-y-3 ${
						level > 0
							? 'pl-4 border-l-2 border-slate-300 dark:border-slate-600 ml-1'
							: ''
					}`}>
					{Object.entries(val).map(([k, v]) => (
						<div key={k}>
							<strong className='font-semibold text-gray-800 dark:text-gray-200'>
								<HighlightMatches
									text={k}
									query={query}
								/>
								:
							</strong>
							<div className='pl-4 text-gray-700 dark:text-gray-300'>
								{renderValue(v)}
							</div>
						</div>
					))}
				</div>
			);
		}
		return (
			<HighlightMatches
				text={String(val)}
				query={query}
			/>
		);
	};

	return (
		<div className='py-3'>
			<strong className='text-gray-800 dark:text-gray-200'>
				<HighlightMatches
					text={label}
					query={query}
				/>
				:
			</strong>
			<div className='text-gray-700 dark:text-gray-300 mt-1'>
				{renderValue(value)}
			</div>
		</div>
	);
};

const TabbedInterface = <T extends object>({
	items,
	getLabel,
	getIcon,
	renderContent,
	query,
}: {
	items: T[];
	getLabel: (item: T) => string;
	getIcon: (item: T) => React.ReactNode;
	renderContent: (item: T) => React.ReactNode;
	query: string;
}) => {
	const [activeTab, setActiveTab] = useState(0);
	const activeItem = items[activeTab];
	if (!activeItem) return null;

	return (
		<div>
			<div className='flex flex-wrap border-b border-gray-300 dark:border-slate-700 mb-6 -mx-4 px-2'>
				{items.map((item, index) => {
					const isActive = index === activeTab;
					return (
						<button
							key={getLabel(item)}
							onClick={() => setActiveTab(index)}
							role='tab'
							aria-selected={isActive}
							className={`flex items-center gap-2 px-3 sm:px-4 py-3 font-semibold text-sm transition-colors duration-200 ease-in-out -mb-px border-b-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-t-md
                                ${
																	isActive
																		? 'text-sky-600 dark:text-sky-400 border-sky-600 dark:border-sky-400'
																		: 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-400 dark:hover:border-slate-500'
																}
                            `}>
							{getIcon(item)}
							<span className='text-left'>
								<HighlightMatches
									text={getLabel(item)}
									query={query}
								/>
							</span>
						</button>
					);
				})}
			</div>

			<div
				className='animate-fade-in-up opacity-0 duration-300'
				key={getLabel(activeItem)}>
				{renderContent(activeItem)}
			</div>
		</div>
	);
};

const ResourceTabs: React.FC<{ resources: ResourceItem[]; query: string }> = ({
	resources,
	query,
}) => {
	const iconMap: Record<string, React.FC<{ className?: string }>> = {
		'Giao Tử (Ngân Phiếu)': CoinBagIcon,
		'Xu (Tiền Đồng Giao Dịch)': CoinIcon,
		'Ngọc Khóa (Văn Ngọc Khóa)': GemIcon,
		'Điểm Phong Vân Lệnh': StarBadgeIcon,
		'Nội Công (Tím/Vàng)': BookSparklesIcon,
		'Hoạt Lực': FlaskIcon,
	};

	return (
		<TabbedInterface
			items={resources}
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

const LocationTabs: React.FC<{ locations: LocationsData; query: string }> = ({
	locations,
	query,
}) => {
	const [copiedCoords, setCopiedCoords] = useState<string | null>(null);
	const showToast = useToast();

	const copyToClipboard = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopiedCoords(text);
			try {
				showToast('Sao chép tọa độ thành công', 'success');
			} catch (e) {
				console.warn(e);
			}
			setTimeout(() => setCopiedCoords(null), 2000);
		} catch (err) {
			console.error('Failed to copy text: ', err);
			try {
				showToast('Không thể sao chép tọa độ', 'error');
			} catch (e) {
				console.warn(e);
			}
		}
	};

	const iconMap: Record<string, React.FC<{ className?: string }>> = {
		'Tam Thanh Sơn': MountainIcon,
		'Biện Kinh': BuildingIcon,
		'Hàng Châu': BridgeIcon,
		'Nhạn Môn Quan': GateIcon,
		'Từ Châu': PagodaIcon,
		'Đào Khê Thôn': VillageIcon,
	};

	const locationEntries = Object.entries(locations);

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
										onClick={() => copyToClipboard(item['Tọa độ'])}
										className='p-1.5 rounded-md text-gray-500 hover:text-sky-600 hover:bg-sky-100 dark:hover:bg-sky-900/30 dark:hover:text-sky-400 transition-colors'
										title='Copy coordinates'>
										{copiedCoords === item['Tọa độ'] ? (
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

const CharacterBuildsTabs: React.FC<{
	builds: CharacterBuild[];
	query: string;
}> = ({ builds, query }) => {
	const iconMap: Record<string, React.FC<{ className?: string }>> = {
		'Tố Vấn (Healer/Hỗ Trợ)': LeafIcon,
		'Cửu Linh (DPS Tầm Xa)': GhostIcon,
		'Huyết Hà (DPS Cận Chiến)': SpearIcon,
		'Toái Mộng (Sát Thủ Cơ Động)': DaggerIcon,
		'Thần Tương (DPS Tầm Xa)': MusicIcon,
		'Thiết Y (Tanker/DPS)': FistIcon,
	};

	const handleSectLink = (monPhai: string) => {
		const sectElement = document.getElementById(
			slugify(`gia-nhap-mon-phai-an-ky-ngo-${monPhai}`)
		);
		if (sectElement) {
			sectElement.scrollIntoView({ behavior: 'smooth' });
		}
	};

	return (
		<div className='space-y-6'>
			<TabbedInterface
				items={builds}
				getLabel={(item) => item['Môn Phái']}
				getIcon={(item) => {
					const Icon = iconMap[item['Môn Phái']] || ShieldCheckIcon;
					return <Icon className='h-5 w-5 shrink-0' />;
				}}
				renderContent={(item) => (
					<div className='bg-white/50 dark:bg-slate-800/50 p-6 rounded-lg shadow-md border border-gray-200 dark:border-slate-700'>
						<div className='flex items-center justify-between mb-3'>
							<h4 className='font-bold text-lg text-sky-600 dark:text-sky-400'>
								<button
									onClick={() => handleSectLink(item['Môn Phái'])}
									aria-label={`Xem hướng dẫn ${item['Môn Phái']}`}
									className='hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 rounded'>
									<HighlightMatches
										text={item['Môn Phái']}
										query={query}
									/>
								</button>
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

const SpecialSkillsTabs: React.FC<{
	skills: SpecialSkillData;
	query: string;
}> = ({ skills, query }) => {
	const iconMap: Record<string, React.FC<{ className?: string }>> = {
		'Đặc Kỹ Vũ Khí (Rèn)': SwordIcon,
		'Đặc Kỹ Áo': ShieldCheckIcon,
		'Trang Bị Khuyên Dùng': CollectionIcon,
		'Khảm Ngọc': GemIcon,
	};

	const skillEntries = Object.entries(skills);

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

const SubTOC: React.FC<{ items: { id: string; title: string }[] }> = ({
	items,
}) => {
	if (items.length <= 1) return null;
	return (
		<div className='mb-8 p-4 border border-sky-200 dark:border-sky-800 bg-sky-50/50 dark:bg-slate-800/50 rounded-lg'>
			<h3 className='font-semibold text-base text-sky-800 dark:text-sky-300 mb-2'>
				Trên trang này
			</h3>
			<ul className='space-y-1'>
				{items.map((item) => (
					<li key={item.id}>
						<a
							href={`#${item.id}`}
							className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors'>
							<ChevronRightIcon className='h-4 w-4 shrink-0' />
							<span>{item.title}</span>
						</a>
					</li>
				))}
			</ul>
		</div>
	);
};

const ContentRenderer: React.FC<{
	content: SectionProps['content'];
	query: string;
	parentId: string;
}> = ({ content, query, parentId }) => {
	const subTocItems = useMemo(() => {
		if (
			isCharacterBuilds(content) ||
			isResource(content) ||
			isLocationData(content) ||
			isSpecialSkills(content)
		) {
			return []; // No sub-TOC for tabbed views
		}
		if (isSectJoinData(content)) {
			return content.map((sect) => ({
				id: slugify(`${parentId}-${sect['Môn Phái']}`),
				title: sect['Môn Phái'],
			}));
		}
		if (isSpecialSkills(content)) {
			return Object.keys(content).map((key) => ({
				id: slugify(`${parentId}-${key}`),
				title: key,
			}));
		}
		return [];
	}, [content, parentId]);

	const renderContent = () => {
		// Executive Summary
		if (
			Array.isArray(content) &&
			content.length > 0 &&
			isExecutiveSummary(content[0])
		) {
			return (
				<ol className='list-decimal list-inside space-y-4'>
					{(content as ExecutiveSummaryItem[]).map((item, index) => (
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
		}

		// Resources -> Tabs
		if (isResource(content)) {
			return (
				<ResourceTabs
					resources={content}
					query={query}
				/>
			);
		}

		// Locations -> Tabs
		if (isLocationData(content)) {
			return (
				<LocationTabs
					locations={content}
					query={query}
				/>
			);
		}

		// Character Builds -> Tabs
		if (isCharacterBuilds(content)) {
			return (
				<CharacterBuildsTabs
					builds={content}
					query={query}
				/>
			);
		}

		// Special Skills
		if (isSpecialSkills(content)) {
			return (
				<SpecialSkillsTabs
					skills={content}
					query={query}
				/>
			);
		}

		// Single object data (Companion, Divine Weapon, Economy etc.)
		if (
			isCompanionData(content) ||
			isDivineWeaponData(content) ||
			isEconomyData(content)
		) {
			const dataToRender = content;
			if (isEconomyData(content)) {
				return (
					<div className='bg-white/50 dark:bg-slate-800/50 p-6 rounded-lg shadow-md border border-gray-200 dark:border-slate-700 space-y-4'>
						{Object.entries(dataToRender as EconomyData).map(([key, value]) => (
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
			}
			return (
				<div className='bg-white/50 dark:bg-slate-800/50 p-6 rounded-lg shadow-md border border-gray-200 dark:border-slate-700'>
					<div className='space-y-2 text-sm divide-y divide-slate-200 dark:divide-slate-700'>
						{Object.entries(dataToRender).map(([key, value]) => (
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
		}

		// Sects
		if (isSectJoinData(content)) {
			return (
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
					{(content as SectJoinGuide[]).map((sect) => (
						<div
							key={sect['Môn Phái']}
							id={slugify(`${parentId}-${sect['Môn Phái']}`)}
							className='scroll-mt-20 bg-white/50 dark:bg-slate-800/50 p-6 rounded-lg shadow-md border border-gray-200 dark:border-slate-700'>
							<h4 className='font-bold text-lg text-sky-600 dark:text-sky-400 mb-3'>
								<HighlightMatches
									text={sect['Môn Phái']}
									query={query}
								/>
							</h4>
							<div className='space-y-2 text-sm divide-y divide-slate-200 dark:divide-slate-700'>
								{Object.entries(sect)
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
					))}
				</div>
			);
		}

		// Generic Object
		if (typeof content === 'object' && content !== null) {
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
		}

		return (
			<p className='text-gray-700 dark:text-gray-300'>
				<HighlightMatches
					text={String(content)}
					query={query}
				/>
			</p>
		);
	};

	return (
		<>
			<SubTOC items={subTocItems} />
			{renderContent()}
		</>
	);
};

export const Section: React.FC<SectionProps> = ({
	id,
	title,
	icon,
	content,
	searchQuery,
}) => {
	const readingTime = useMemo(() => {
		const words = countWords(content);
		return calculateReadingTime(words);
	}, [content]);

	return (
		<section
			id={id}
			className='mb-12 animate-fade-in-up opacity-0 delay-150 scroll-mt-20'>
			<div className='border-b-2 border-amber-500/50 dark:border-amber-400/50 mb-6 pb-2'>
				<div className='flex items-center gap-3'>
					{icon &&
						React.cloneElement(icon, {
							className: 'h-8 w-8 text-amber-500 dark:text-amber-400',
						})}
					<h2 className='text-2xl md:text-3xl font-bold text-gray-900 dark:text-white'>
						<HighlightMatches
							text={title}
							query={searchQuery}
						/>
					</h2>
				</div>
				<div className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-2 ml-11'>
					<ClockIcon className='h-4 w-4' />
					<span>{readingTime}</span>
				</div>
			</div>
			<ContentRenderer
				content={content}
				query={searchQuery}
				parentId={id}
			/>
		</section>
	);
};
