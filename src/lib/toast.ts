/** @format */

import { createContext, useContext } from 'react';

export type ToastType = 'success' | 'error' | 'info';
export type Toast = { id: string; message: string; type?: ToastType };

// Shared context for the toast system. Kept in a separate module to avoid
// Fast Refresh warnings when exporting non-component helpers from a component file.
export const ToastContext = createContext<{
	show: (message: string, type?: ToastType) => void;
} | null>(null);

export const useToast = () => {
	const ctx = useContext(ToastContext);
	if (!ctx) throw new Error('useToast must be used within ToastProvider');
	return ctx.show;
};

export default useToast;
