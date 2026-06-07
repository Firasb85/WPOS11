import { Menu, Search, Bell, User, Globe } from 'lucide-react';
import { useLanguage } from '@/lib/wpos/context/LanguageContext';

export function Header({ onMenuToggle }: { onMenuToggle: () => void }) {
  const { lang, setLang, t } = useLanguage();

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"><Menu className="w-5 h-5 text-gray-600" /></button>
        <div className="hidden md:flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2"><Search className="w-4 h-4 text-gray-400" /><input type="text" placeholder={t('Search...','بحث...')} className="bg-transparent border-none outline-none text-sm text-gray-600 dark:text-gray-300 placeholder-gray-400 w-64" /></div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm text-gray-600"
        >
          <Globe className="w-4 h-4" />
          <span className="font-medium">{lang === 'en' ? 'AR' : 'EN'}</span>
        </button>
        <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><Bell className="w-5 h-5 text-gray-600" /><span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span></button>
        <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-700">
          <div className="hidden md:block text-right"><p className="text-sm font-medium text-gray-900 dark:text-white">Ahmad Ali</p><p className="text-xs text-gray-500">Super Admin</p></div>
          <button className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center"><User className="w-5 h-5 text-white" /></button>
        </div>
      </div>
    </header>
  );
}
