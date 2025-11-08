/** @format */

import React from 'react';
import { HighlightMatches } from './HighlightMatches';

export const ComplexDetailRenderer: React.FC<{
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
