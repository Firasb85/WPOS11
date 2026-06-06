import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
export function StatsCard({ title, value, change, icon, status }: { title: string; value: string | number; change?: number; icon?: React.ReactNode; status?: 'good' | 'warning' | 'critical' }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
            {change !== undefined && (
              <span className={`flex items-center text-xs font-medium ${change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                {change > 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : change < 0 ? <TrendingDown className="w-3 h-3 mr-0.5" /> : <Minus className="w-3 h-3 mr-0.5" />}
                {Math.abs(change)}%
              </span>
            )}
          </div>
        </div>
        {icon && <div className={`p-3 rounded-lg ${status === 'critical' ? 'bg-red-100 dark:bg-red-900/30' : status === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>{icon}</div>}
      </div>
    </div>
  );
}
