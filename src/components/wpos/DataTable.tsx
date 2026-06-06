import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';

interface Column<T> { key: string; label: string; sortable?: boolean; render?: (item: T) => React.ReactNode; }

export function DataTable<T extends Record<string, any>>({ columns, data, isLoading, onRowClick, pageSize = 20 }: { columns: Column<T>[]; data: T[]; isLoading?: boolean; onRowClick?: (item: T) => void; pageSize?: number }) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = search ? data.filter(item => Object.values(item).some(val => String(val).toLowerCase().includes(search.toLowerCase()))) : data;
  const sorted = sortKey ? [...filtered].sort((a, b) => { const av = a[sortKey], bv = b[sortKey]; return (av < bv ? -1 : av > bv ? 1 : 0) * (sortOrder === 'asc' ? 1 : -1); }) : filtered;
  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (isLoading) return <div className="bg-white dark:bg-gray-900 rounded-xl border p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div></div>;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-4">
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Search..." className="bg-transparent border-none outline-none text-sm text-gray-600 dark:text-gray-300 placeholder-gray-400 w-full" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              {columns.map(col => (
                <th key={col.key} className={`px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-left ${col.sortable ? 'cursor-pointer hover:text-gray-700' : ''}`} onClick={() => { if (col.sortable) { sortKey === col.key ? setSortOrder(o => o === 'asc' ? 'desc' : 'asc') : setSortKey(col.key); }}}>
                  <div className="flex items-center gap-1">{col.label}{col.sortable && sortKey === col.key && (sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {paginated.length === 0 ? (
              <tr><td colSpan={columns.length} className="px-4 py-12 text-center text-gray-400">No data found</td></tr>
            ) : paginated.map((item, i) => (
              <tr key={item.id || i} className={`${onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50' : ''} transition-colors`} onClick={() => onRowClick?.(item)}>
                {columns.map(col => <td key={col.key} className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{col.render ? col.render(item) : item[col.key]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t flex items-center justify-between">
          <span className="text-sm text-gray-500">Total {sorted.length} records</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
            <span className="text-sm text-gray-600">{currentPage} / {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
