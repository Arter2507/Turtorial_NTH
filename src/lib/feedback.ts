/** @format */

import { useOfflineStorage } from '../hooks/useOfflineStorage';

interface FeedbackData {
	email: string;
	title: string;
	content: string;
	timestamp: number;
}

export async function submitFeedback(data: FeedbackData, endpoint: string) {
	// Kiểm tra kết nối mạng
	if (!navigator.onLine) {
		// Lưu feedback vào storage offline
		const { saveData } = useOfflineStorage<FeedbackData[]>(
			'pendingFeedbacks',
			[]
		);
		await saveData([data]);
		throw new Error('Đang offline. Feedback sẽ được gửi khi có kết nối mạng.');
	}

	// Nếu online, gửi feedback ngay
	try {
		const response = await fetch(endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			throw new Error('Failed to submit feedback');
		}

		return await response.json();
	} catch (error) {
		// Nếu gửi thất bại, lưu vào storage offline
		const { saveData } = useOfflineStorage<FeedbackData[]>(
			'pendingFeedbacks',
			[]
		);
		await saveData([data]);
		throw error;
	}
}

// Hàm để đồng bộ các feedback đang pending
export async function syncPendingFeedbacks(endpoint: string) {
	const { data: pendingFeedbacks, saveData } = useOfflineStorage<
		FeedbackData[]
	>('pendingFeedbacks', []);

	if (!pendingFeedbacks || pendingFeedbacks.length === 0) {
		return;
	}

	const successfulSyncs: number[] = [];

	// Thử gửi từng feedback một
	await Promise.all(
		pendingFeedbacks.map(async (feedback, index) => {
			try {
				await submitFeedback(feedback, endpoint);
				successfulSyncs.push(index);
			} catch (error) {
				console.error('Failed to sync feedback:', error);
			}
		})
	);

	// Xóa các feedback đã gửi thành công
	if (successfulSyncs.length > 0) {
		const remainingFeedbacks = pendingFeedbacks.filter(
			(_, index) => !successfulSyncs.includes(index)
		);
		await saveData(remainingFeedbacks);
	}

	return successfulSyncs.length;
}
