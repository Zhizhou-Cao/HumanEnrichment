
import React, { useMemo } from 'react';
import { AppState, EnrichmentTask, CategoryID, CategoryInfo } from '../types';

interface AchievementSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  state: AppState;
  allTasks: EnrichmentTask[];
  categories: CategoryInfo[];
  onUpdateCount: (taskId: string, delta: number) => void;
}

export const AchievementSidebar: React.FC<AchievementSidebarProps> = ({ 
  isOpen, 
  onClose, 
  state, 
  allTasks,
  categories,
  onUpdateCount
}) => {
  const groupedData = useMemo(() => {
    const groups: Record<CategoryID, { task: EnrichmentTask; record: any }[]> = {};
    categories.forEach(c => groups[c.id] = []);

    state.completedTasks.forEach(record => {
      const task = allTasks.find(t => t.id === record.taskId);
      if (task) {
        if (!groups[task.category]) groups[task.category] = [];
        groups[task.category].push({ task, record });
      }
    });

    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => b.record.count - a.record.count);
    });

    return groups;
  }, [state.completedTasks, allTasks, categories]);

  return (
    <div className={`fixed inset-y-0 left-0 w-full max-w-sm bg-white z-[90] shadow-2xl transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="h-full flex flex-col p-8 overflow-y-auto font-sans">
        <div className="flex justify-between items-center mb-10 border-b-2 border-black pb-4">
          <h2 className="text-3xl font-bold font-['ZCOOL_KuaiLe'] text-gray-800 tracking-wider">丰容成就馆</h2>
          <button onClick={onClose} className="text-4xl hover:rotate-90 transition-transform">×</button>
        </div>

        <div className="space-y-12">
          {categories.map(cat => {
            const group = groupedData[cat.id] || [];
            if (group.length === 0) return null;

            return (
              <div key={cat.id} className="animate-in slide-in-from-left duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl p-2 bg-gray-50 rounded-xl border border-black/5">{cat.icon}</span>
                  <h3 className="text-xl font-bold text-gray-800">{cat.name}</h3>
                </div>
                <div className="space-y-4">
                  {group.map(({ task, record }) => (
                    <div key={task.id} className="flex justify-between items-center gap-4 bg-[#fdfaf5] p-4 rounded-2xl border border-black/10 shadow-sm">
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-800 leading-tight">{task.content}</p>
                        <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-widest">{task.subCategory}</p>
                      </div>
                      <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-full border border-black/5">
                        <button onClick={() => onUpdateCount(task.id, -1)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400">-</button>
                        <span className="text-sm font-black w-4 text-center">{record.count}</span>
                        <button onClick={() => onUpdateCount(task.id, 1)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-black">+</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {state.completedTasks.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center opacity-30 py-20">
            <div className="text-7xl mb-6">🏜️</div>
            <p className="text-lg italic font-medium">荒野之中，静候丰容</p>
          </div>
        )}
      </div>
    </div>
  );
};
