/** @format */
import React from 'react';

const formatDate = () => {
	const now = new Date();
	return `${String(now.getMonth() + 1).padStart(2, '0')}/${String(
		now.getDate()
	).padStart(2, '0')}/${now.getFullYear()} - ${String(now.getHours()).padStart(
		2,
		'0'
	)}:${String(now.getMinutes()).padStart(2, '0')}:${String(
		now.getSeconds()
	).padStart(2, '0')}`;
};

export const Footer: React.FC = () => {
	const [time, setTime] = React.useState(formatDate());

	React.useEffect(() => {
		const timer = setInterval(() => {
			setTime(formatDate());
		}, 1000);
		return () => clearInterval(timer);
	}, []);

	return (
		<footer className='w-full py-4 px-6 flex items-center justify-between text-sm bg-gray-100 dark:bg-slate-900 border-t dark:border-slate-800 mt-8'>
			<div className='text-gray-700 dark:text-gray-300'>
				© {new Date().getFullYear()} <strong>Created by AI.</strong> All rights
				reserved. Exclusively for use and sharing within the Justice Online
				(Nghịch Thủy Hàn) Community
			</div>
			<div className='text-gray-500 dark:text-gray-400'>{time}</div>
		</footer>
	);
};
