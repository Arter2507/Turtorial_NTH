/** @format */

import React, { useRef } from 'react';

interface SitemapProps {
	sections: { id: string; title: string }[];
	onClose: () => void;
}

// English comment: Simple sitemap component that lists links to page sections.
export const Sitemap: React.FC<SitemapProps> = ({ sections, onClose }) => {
	const containerRef = useRef<HTMLDivElement | null>(null);

	// PDF export removed; downloads are handled via header download button.
	return (
		<div
			id='sitemap'
			className='p-4'
			ref={containerRef}>
			<div className='flex items-center justify-between mb-4'>
				<h2 className='text-xl font-bold'>Sơ đồ trang (Sitemap)</h2>
				<div className='flex items-center gap-3'>
					<button
						onClick={onClose}
						className='text-sm text-gray-600 dark:text-gray-300'>
						Đóng
					</button>
				</div>
			</div>

			{/* Top-down tree map */}
			<div className='overflow-auto'>
				<div className='text-center mb-6'>
					<div className='inline-block px-4 py-2 bg-gray-100 dark:bg-slate-800 rounded-lg font-semibold'>
						Nội dung tài liệu
					</div>
				</div>

				<ul className='pl-6 border-l border-gray-200 dark:border-slate-700'>
					{sections.map((s) => (
						<li
							key={s.id}
							className='mb-4 relative'>
							<a
								href={`#${s.id}`}
								onClick={onClose}
								className='flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 hover:underline'>
								<span className='absolute w-3 h-3 rounded-full bg-sky-600 dark:bg-sky-400 left-0 -translate-x-1/2 top-3' />
								<span className='pl-2'>{s.title}</span>
							</a>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default Sitemap;
