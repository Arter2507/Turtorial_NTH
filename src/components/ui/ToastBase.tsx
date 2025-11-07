/** @format */

import React from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
	message: string;
	type?: ToastType;
	action?: {
		label: string;
		onClick: () => void;
	};
	onClose?: () => void;
}

export const ToastBase: React.FC<ToastProps> = ({
	message,
	type = 'info',
	action,
	onClose,
}) => {
	React.useEffect(() => {
		if (onClose) {
			const timer = setTimeout(onClose, 3500);
			return () => clearTimeout(timer);
		}
	}, [onClose]);

	return (
		<div
			className={`pointer-events-auto max-w-sm w-full rounded-md p-3 shadow-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm transition transform duration-200 ease-in-out ${
				type === 'success'
					? 'ring-1 ring-green-400'
					: type === 'error'
					? 'ring-1 ring-red-400'
					: type === 'warning'
					? 'ring-1 ring-yellow-400'
					: 'ring-1 ring-sky-400'
			}`}>
			<div className='flex items-center justify-between gap-3'>
				<div className='text-sm text-gray-800 dark:text-gray-100'>
					{message}
				</div>
				{action && (
					<button
						onClick={action.onClick}
						className='px-2 py-1 text-sm font-medium text-sky-600 dark:text-sky-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded'>
						{action.label}
					</button>
				)}
			</div>
		</div>
	);
};
