/** @format */

import React from 'react';

interface Feature {
	title: string;
	description: string;
	children?: Feature[];
}

const features: Feature[] = [
	{
		title: 'Tìm kiếm thông tin',
		description: 'Tìm kiếm nhanh các hướng dẫn theo từ khóa',
		children: [
			{
				title: 'Thanh tìm kiếm',
				description: 'Nhập từ khóa để tìm trong toàn bộ hướng dẫn',
			},
			{
				title: 'Highlight kết quả',
				description: 'Các kết quả tìm kiếm được làm nổi bật',
			},
		],
	},
	{
		title: 'Trợ lý âm thanh',
		description: 'Đọc nội dung hướng dẫn bằng giọng nói',
		children: [
			{
				title: 'Nút đọc',
				description: 'Nhấn nút loa bên cạnh mỗi mục để nghe',
			},
			{
				title: 'Điều khiển phát',
				description: 'Tạm dừng/tiếp tục và dừng khi đang phát',
			},
		],
	},
	{
		title: 'Chế độ PWA',
		description: 'Cài đặt như ứng dụng trên thiết bị',
		children: [
			{ title: 'Cài đặt PWA', description: 'Thêm shortcut vào màn hình chính' },
			{
				title: 'Hoạt động offline',
				description: 'Xem hướng dẫn khi không có internet',
			},
		],
	},
	{
		title: 'Giao diện',
		description: 'Tùy chỉnh hiển thị theo ý thích',
		children: [
			{
				title: 'Chế độ tối/sáng',
				description: 'Thay đổi theme phù hợp môi trường',
			},
			{ title: 'Menu điều hướng', description: 'Danh mục mục lục dễ theo dõi' },
		],
	},
	{
		title: 'Phản hồi',
		description: 'Góp ý cải thiện nội dung',
		children: [
			{ title: 'Nút feedback', description: 'Gửi góp ý trực tiếp về nội dung' },
			{
				title: 'Cập nhật liên tục',
				description: 'Nội dung được cải thiện theo phản hồi',
			},
		],
	},
];

const FeatureGuideItem: React.FC<{ feature: Feature; level?: number }> = ({
	feature,
	level = 0,
}) => {
	return (
		<div className={`ml-${level * 4}`}>
			<div className='flex items-start gap-2 mb-2'>
				<span className='mt-1.5 h-1.5 w-1.5 rounded-full bg-sky-500 dark:bg-sky-400 shrink-0'></span>
				<div>
					<h3 className='font-medium text-gray-900 dark:text-white'>
						{feature.title}
					</h3>
					<p className='text-sm text-gray-600 dark:text-gray-400'>
						{feature.description}
					</p>
				</div>
			</div>
			{feature.children && (
				<div className='ml-3 mt-2 border-l-2 border-gray-200 dark:border-gray-700'>
					{feature.children.map((child, index) => (
						<div
							key={index}
							className='ml-4 mt-2'>
							<FeatureGuideItem
								feature={child}
								level={level + 1}
							/>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

const PwaInstallGuide: React.FC = () => (
	<section className='p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg h-full'>
		<h2 className='font-bold text-lg mb-3 text-yellow-700 dark:text-yellow-300'>
			Hướng dẫn cài đặt PWA (Progressive Web App)
		</h2>
		<ol className='list-decimal ml-6 space-y-2 text-gray-700 dark:text-gray-200'>
			<li>Mở trình duyệt trên thiết bị của bạn (Chrome, Safari, Edge...)</li>
			<li>Truy cập vào trang web này</li>
			<li>
				Trên điện thoại:
				<ul className='list-disc ml-6 mt-1 space-y-1 text-sm'>
					<li>
						Chrome/Edge (Android): Nhấn nút "Thêm vào màn hình chính" từ menu
					</li>
					<li>
						Safari (iOS): Nhấn nút Chia sẻ, chọn "Thêm vào màn hình chính"
					</li>
				</ul>
			</li>
			<li>
				Trên máy tính:
				<ul className='list-disc ml-6 mt-1 space-y-1 text-sm'>
					<li>Chrome/Edge: Nhấn nút Cài đặt (✚) ở thanh địa chỉ</li>
					<li>Hoặc vào menu &gt; Công cụ &gt; Cài đặt ứng dụng</li>
				</ul>
			</li>
		</ol>
		<p className='mt-4 text-sm text-gray-500 dark:text-gray-400'>
			Sau khi cài đặt, bạn có thể:
			<ul className='list-disc ml-6 mt-2 space-y-1'>
				<li>Mở ứng dụng từ shortcut trên màn hình</li>
				<li>Sử dụng offline khi không có kết nối mạng</li>
				<li>Nhận thông báo cập nhật (nếu có)</li>
			</ul>
		</p>
	</section>
);

export const Sitemap: React.FC = () => {
	return (
		<div>
			<h1 className='text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center'>
				Hướng dẫn sử dụng
			</h1>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
				<div>
					<h2 className='text-xl font-semibold mb-4 text-sky-800 dark:text-sky-300 border-b border-gray-300 dark:border-slate-700 pb-2'>
						Sitemap
					</h2>
					<div className='space-y-6'>
						{features.map((feature, index) => (
							<FeatureGuideItem
								key={index}
								feature={feature}
							/>
						))}
					</div>
				</div>
				<div>
					<PwaInstallGuide />
				</div>
			</div>
		</div>
	);
};
