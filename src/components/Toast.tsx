/** @format */

import React, { useCallback, useState } from 'react';
import { ToastContext, ToastType, Toast } from '../lib/toast';

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const show = useCallback((message: string, type: ToastType = 'info') => {
		const id = String(Date.now()) + Math.random().toString(36).slice(2, 8);
		const toast: Toast = { id, message, type };
		setToasts((s) => [...s, toast]);
		// auto-dismiss
		setTimeout(() => {
			setToasts((s) => s.filter((t) => t.id !== id));
		}, 3500);
	}, []);

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
