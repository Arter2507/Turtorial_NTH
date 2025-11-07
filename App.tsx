import React, { useState, useMemo } from 'react';
import { guideData } from './data';
import type { GameGuideData } from './types';
import { useTheme } from './hooks/useTheme';
import { Header } from './components/Header';
import { TableOfContents } from './components/TableOfContents';
import { Section } from './components/Section';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { 
    ClipboardListIcon,
    BookOpenIcon,
    CollectionIcon,
    CogIcon,
    CalendarIcon,
    SparklesIcon,
    MapPinIcon,
    ShieldCheckIcon,
    HammerIcon,
    UsersIcon,
    CashIcon,
    KeyIcon,
    SwordIcon,
    ScrollIcon,
} from './components/icons';

const slugify = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // remove non-word chars
      .replace(/[\s_-]+/g, '-') // collapse whitespace and replace by -
      .replace(/^-+|-+$/g, ''); // trim -
};

const sectionIcons: Record<string, React.ReactElement> = {
  "Tóm tắt Điều hành": <ClipboardListIcon />,
  "I. Khởi Động & Cơ Chế Cốt Lõi": <BookOpenIcon />,
  "II. Hướng Dẫn Kiếm Tài Nguyên": <CollectionIcon />,
  "III. Hướng Dẫn Sử Dụng Tài Nguyên": <CogIcon />,
  "IV. Lộ Trình Nhiệm Vụ": <CalendarIcon />,
  "V. Mẹo Tăng Cấp & Sức Mạnh": <SparklesIcon />,
  "VI. Vị Trí Rương & Kỳ Ngộ": <MapPinIcon />,
  "VII. Hướng Dẫn Build Nhân Vật": <ShieldCheckIcon />,
  "VIII. Đặc Kỹ (Rèn) & Trang Bị": <HammerIcon />,
  "IX. Đồng Hành (Quần Hiệp) Tối Ưu": <UsersIcon />,
  "X. Kinh Tế & Kiếm Tiền": <CashIcon />,
  "XI. Gia Nhập Môn Phái Ẩn (Kỳ Ngộ)": <KeyIcon />,
  "XII. Kỳ Ngộ Thần Binh": <SwordIcon />,
};

// FIX: Updated `icon` type to allow passing className via cloneElement.
const DesktopTableOfContents: React.FC<{ 
  sections: { id: string, title: string, icon: React.ReactElement<{ className?: string }> }[], 
  className?: string,
  matchedSectionIds: Set<string> 
}> = ({ sections, className = '', matchedSectionIds }) => {
  return (
    <aside className={`${className} sticky top-24 self-start`}>
      <nav className="p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-slate-700 h-full">
        <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">Mục Lục</h3>
        <ul className="space-y-2">
          {sections.map(({ id, title, icon }) => {
            const isMatched = matchedSectionIds.has(id);
            return (
              <li key={id}>
                <a href={`#${id}`} className={`flex items-center gap-3 text-sm transition-colors ${
                  isMatched 
                    ? 'font-semibold text-sky-600 dark:text-sky-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400'
                }`}>
                   {React.cloneElement(icon, { className: "h-5 w-5 shrink-0" })}
                   <span>{title}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

const App: React.FC = () => {
  const [theme, toggleTheme] = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const sections = useMemo(() => {
    return Object.keys(guideData)
      .filter(key => key !== 'Tên Tài Liệu')
      .map(key => ({ 
          id: slugify(key), 
          title: key,
          icon: sectionIcons[key] || <BookOpenIcon />
      }));
  }, []);
  
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) {
      return guideData;
    }

    const lowercasedQuery = searchQuery.toLowerCase();
    const newFilteredData: Partial<GameGuideData> = { "Tên Tài Liệu": guideData["Tên Tài Liệu"] };

    for (const [key, value] of Object.entries(guideData)) {
      if (key === 'Tên Tài Liệu') continue;

      // Check if section title matches
      if (key.toLowerCase().includes(lowercasedQuery)) {
        newFilteredData[key as keyof GameGuideData] = value as any;
        continue;
      }
      
      // Check if section content matches
      if (typeof value === 'object' && value !== null) {
          const stringifiedValue = JSON.stringify(value).toLowerCase();
          if (stringifiedValue.includes(lowercasedQuery)) {
             // If content matches, include the *entire* original section value.
             // Highlighting within the Section component will show the user where the matches are.
             newFilteredData[key as keyof GameGuideData] = value as any;
          }
      }
    }
    return newFilteredData as GameGuideData;
  }, [searchQuery]);
  
  const matchedSectionIds = useMemo(() => {
    if (!searchQuery.trim()) {
      return new Set<string>();
    }
    const keys = Object.keys(filteredData).filter(key => key !== 'Tên Tài Liệu');
    return new Set(keys.map(slugify));
  }, [searchQuery, filteredData]);


  const sectionsToRender = Object.entries(filteredData).filter(([key]) => key !== 'Tên Tài Liệu');

  return (
    <>
      <Header 
        title={guideData['Tên Tài Liệu']}
        titleIcon={<ScrollIcon />}
        theme={theme}
        toggleTheme={toggleTheme}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onToggleMenu={() => setIsMenuOpen(true)}
      />
      <TableOfContents 
        sections={sections}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        matchedSectionIds={matchedSectionIds}
      />
      <main className="container mx-auto px-4">
        <div className="md:grid md:grid-cols-4 md:gap-8">
          <div className="md:col-span-3">
            {sectionsToRender.length > 0 ? (
              sectionsToRender.map(([key, content]) => (
                <Section
                  key={key}
                  id={slugify(key)}
                  title={key}
                  icon={sectionIcons[key]}
                  content={content as any}
                  searchQuery={searchQuery}
                />
              ))
            ) : (
                <div className="text-center py-16">
                    <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">Không tìm thấy kết quả</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Hãy thử một từ khóa tìm kiếm khác.</p>
                </div>
            )}
          </div>
          <DesktopTableOfContents 
            sections={sections} 
            className="hidden md:block md:col-span-1"
            matchedSectionIds={matchedSectionIds}
          />
        </div>
      </main>
      <footer className="text-center py-8 mt-12 border-t border-gray-200 dark:border-slate-800">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Tạo bởi AI cho cộng đồng Nghịch Thủy Hàn.
        </p>
      </footer>
      <ScrollToTopButton />
    </>
  );
};

export default App;