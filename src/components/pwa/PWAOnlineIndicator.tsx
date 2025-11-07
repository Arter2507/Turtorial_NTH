/** @format */

import React, { useState } from 'react';

const PWAOnlineIndicator: React.FC = () => {
	const [isOnline, setIsOnline] = useState(navigator.onLine);

	React.useEffect(() => {
		const handleOnline = () => setIsOnline(true);
		const handleOffline = () => setIsOnline(false);

		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', handleOffline);

		return () => {
			window.removeEventListener('online', handleOnline);
			window.removeEventListener('offline', handleOffline);
		};
	}, []);

	return (
		<div className='fixed top-4 right-4 z-50 flex items-center gap-2'>
			<div
				className={`h-3 w-3 rounded-full ${
					isOnline ? 'bg-green-500' : 'bg-red-500'
				} transition-colors`}
			/>
			<span className='text-xs text-gray-600 dark:text-gray-400'>
				{isOnline ? 'Online' : 'Offline'}
			</span>
		</div>
	);
};

export default PWAOnlineIndicator;
