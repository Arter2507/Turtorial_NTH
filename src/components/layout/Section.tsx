/** @format */

import React, { useMemo } from 'react';
import type { SectionContent } from '../../types/types';
import {
	isExecutiveSummary,
	isResource,
	isLocationData,
	isCharacterBuilds,
	isSpecialSkills,
	isCompanionData,
	isEconomyData,
	isSectJoinData,
	isDivineWeaponData,
} from '../../utils/typeguard.utils';
import { ExecutiveSummarySection } from './sections-management/ExecutiveSummarySection';
import { ResourceSection } from './sections-management/ResourceSection';
import { LocationSection } from './sections-management/LocationSection';
import { CharacterBuildsSection } from './sections-management/CharacterBuildsSection';
import { SpecialSkillsSection } from './sections-management/SpecialSkillsSection';
import { CompanionSection } from './sections-management/CompanionSection';
import { EconomySection } from './sections-management/EconomySection';
import { SectJoinSection } from './sections-management/SectJoinSection';
import { DivineWeaponSection } from './sections-management/DivineWeaponSection';
import { GenericObjectSection } from './sections-management/GenericObjectSection';
import { ClockIcon } from '../common/icons';
import { HighlightMatches } from '../ui/shared/HighlightMatches';

interface SectionProps {
	id: string;
	title: string;
	icon?: React.ReactElement<{ className?: string }>;
	content: SectionContent;
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

const ContentRenderer: React.FC<{
	content: SectionProps['content'];
	query: string;
}> = ({ content, query }) => {
	if (isExecutiveSummary(content))
		return (
			<ExecutiveSummarySection
				content={content}
				query={query}
			/>
		);
	if (isResource(content))
		return (
			<ResourceSection
				content={content}
				query={query}
			/>
		);
	if (isLocationData(content))
		return (
			<LocationSection
				content={content}
				query={query}
			/>
		);
	if (isCharacterBuilds(content))
		return (
			<CharacterBuildsSection
				content={content}
				query={query}
			/>
		);
	if (isSpecialSkills(content))
		return (
			<SpecialSkillsSection
				content={content}
				query={query}
			/>
		);
	if (isCompanionData(content))
		return (
			<CompanionSection
				content={content}
				query={query}
			/>
		);
	if (isEconomyData(content))
		return (
			<EconomySection
				content={content}
				query={query}
			/>
		);
	if (isSectJoinData(content))
		return (
			<SectJoinSection
				content={content}
				query={query}
			/>
		);
	if (isDivineWeaponData(content))
		return (
			<DivineWeaponSection
				content={content}
				query={query}
			/>
		);

	// Fallback for generic objects
	if (
		typeof content === 'object' &&
		content !== null &&
		!Array.isArray(content)
	) {
		return (
			<GenericObjectSection
				content={content}
				query={query}
			/>
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
			className='mb-12 animate-fade-in-up opacity-0'
			style={{ animationDelay: '150ms', scrollMarginTop: '80px' }}>
			<div className='border-b-2 border-amber-500/50 dark:border-amber-400/50 mb-6 pb-2'>
				<div className='flex items-center justify-between gap-4'>
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
				</div>
				<div className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-2 ml-11'>
					<ClockIcon className='h-4 w-4' />
					<span>{readingTime}</span>
				</div>
			</div>
			<ContentRenderer
				content={content}
				query={searchQuery}
			/>
		</section>
	);
};
