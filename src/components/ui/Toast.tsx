/** @format */

import React, { useCallback, useState } from 'react';
import type { Toast as ToastType } from '../../lib/toast';
import { ToastContext } from '../../lib/toast';

interface ToastProps {
	message: string;
	type?: ToastType;
	duration?: number;
	action?: {
		label: string;
		onClick: () => void;
	};
	onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
	message,
	type = 'info',
	duration = 3500,
	action,
	onClose,
}) => {
	React.useEffect(() => {
		if (duration && onClose) {
			const timer = setTimeout(onClose, duration);
			return () => clearTimeout(timer);
		}
	}, [duration, onClose]);

	return (
		<div
			className={`pointer-events-auto max-w-sm w-full rounded-md p-3 shadow-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm transition transform duration-200 ease-in-out ${
				type === 'success'
					? 'ring-1 ring-green-400'
					: type === 'error'
					? 'ring-1 ring-red-400'
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

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [toasts, setToasts] = useState<ToastType[]>([]);

	const show = useCallback(
		(message: string, type: ToastType['type'] = 'info') => {
			const id = String(Date.now()) + Math.random().toString(36).slice(2, 8);
			const toast: ToastType = { id, message, type };
			setToasts((s) => [...s, toast]);
			// auto-dismiss
			setTimeout(() => {
				setToasts((s) => s.filter((t) => t.id !== id));
			}, 3500);
		},
		[]
	);

	return (
		<ToastContext.Provider value={{ show }}>
			{children}
			<div className='fixed z-60 right-6 bottom-6 flex flex-col items-end gap-2 pointer-events-none'>
				{toasts.map((t) => (
					<div
						key={t.id}
						className={`pointer-events-auto max-w-sm w-full rounded-md p-3 shadow-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm transition transform duration-200 ease-in-out ${
							t.type === 'success'
								? 'ring-1 ring-green-400'
								: t.type === 'error'
								? 'ring-1 ring-red-400'
								: 'ring-1 ring-sky-400'
						}`}>
						<div className='flex items-center justify-between gap-3'>
							<div className='text-sm text-gray-800 dark:text-gray-100'>
								{t.message}
							</div>
						</div>
					</div>
				))}
			</div>
		</ToastContext.Provider>
	);
};

export default ToastProvider;
