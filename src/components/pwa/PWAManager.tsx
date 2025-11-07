/** @format */

import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { ToastBase } from '../ui/ToastBase';

export function PWAManager() {
	const [showUpdateToast, setShowUpdateToast] = useState(false);
	const [showOfflineToast, setShowOfflineToast] = useState(false);
	const [isOnline, setIsOnline] = useState(navigator.onLine);

	// Xử lý đăng ký service worker và cập nhật
	const {
		needRefresh: [needRefresh],
		updateServiceWorker,
	} = useRegisterSW({
		onRegistered(registration) {
			console.log('SW đã được đăng ký:', registration?.scope);
		},
		onRegisterError(error: unknown) {
			console.error('Lỗi SW:', error);
		},
	});

	// Theo dõi trạng thái kết nối
	useEffect(() => {
		const handleOnline = () => {
			setIsOnline(true);
			setShowOfflineToast(false);
		};

		const handleOffline = () => {
			setIsOnline(false);
			setShowOfflineToast(true);
		};

		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', handleOffline);

		return () => {
			window.removeEventListener('online', handleOnline);
			window.removeEventListener('offline', handleOffline);
		};
	}, []);

	// Hiển thị thông báo khi có cập nhật
	useEffect(() => {
		if (needRefresh) {
			setShowUpdateToast(true);
		}
	}, [needRefresh]);

	const handleUpdate = () => {
		updateServiceWorker(true);
		setShowUpdateToast(false);
	};

	return (
		<>
			{/* Thông báo cập nhật */}
			{showUpdateToast && (
				<ToastBase
					message='Đã có phiên bản mới! Cập nhật ngay?'
					type='info'
					action={{
						label: 'Cập nhật',
						onClick: handleUpdate,
					}}
					onClose={() => setShowUpdateToast(false)}
				/>
			)}

			{/* Thông báo offline */}
			{showOfflineToast && (
				<ToastBase
					message='Bạn đang ở chế độ ngoại tuyến. Một số tính năng có thể bị hạn chế.'
					type='warning'
					onClose={() => setShowOfflineToast(false)}
				/>
			)}

			{/* Indicator trạng thái kết nối */}
			<div
				className={`fixed bottom-4 right-4 p-2 rounded-full ${
					isOnline ? 'bg-green-500' : 'bg-red-500'
				}`}>
				<div className='w-2 h-2' />
			</div>
		</>
	);
}
