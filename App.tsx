
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MapCanvas } from './components/MapCanvas';
import { TaskModal } from './components/TaskModal';
import { AchievementSidebar } from './components/AchievementSidebar';
import { CustomTaskOverlay } from './components/CustomTaskOverlay';
import { EditCategoriesOverlay } from './components/EditCategoriesOverlay';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { AppState, CategoryID, EnrichmentTask, UserTaskRecord, CategoryInfo } from './types';
import { INITIAL_TASKS, CATEGORIES } from './constants';

const LOCAL_STORAGE_KEY = 'human_enrichment_v4';

const DEFAULT_CATS: CategoryInfo[] = Object.entries(CATEGORIES).map(([id, info]) => ({
  id,
  ...info
}));

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return {
      completedTasks: [],
      customTasks: [],
      customCategories: [],
      visitorCount: Math.floor(Math.random() * 500) + 2048,
      categoryPositions: {}
    };
  });

  const [activeTask, setActiveTask] = useState<EnrichmentTask | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);

  // Computed views based on current state
  const allCategories = useMemo(() => [...DEFAULT_CATS, ...state.customCategories], [state.customCategories]);
  const allTasks = useMemo(() => [...INITIAL_TASKS, ...state.customTasks], [state.customTasks]);

  const activeCategory = useMemo(() => {
    if (!activeTask) return null;
    return allCategories.find(c => c.id === activeTask.category) || null;
  }, [activeTask, allCategories]);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('has_visited');
    if (!hasVisited) {
      setState(prev => ({ ...prev, visitorCount: prev.visitorCount + 1 }));
      sessionStorage.setItem('has_visited', 'true');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const startRandomization = useCallback((targetTasks: EnrichmentTask[]) => {
    if (targetTasks.length === 0) return;
    setIsRandomizing(true);
    const startTime = Date.now();
    const duration = 3000;
    
    const allNodeIds = [
      ...allCategories.map(c => c.id),
      ...Array.from(new Set(allTasks.map(t => t.subCategory)))
    ];

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed < duration) {
        setHighlightedNodeId(allNodeIds[Math.floor(Math.random() * allNodeIds.length)]);
      } else {
        clearInterval(timer);
        const finalTask = targetTasks[Math.floor(Math.random() * targetTasks.length)];
        setHighlightedNodeId(finalTask.category);
        setTimeout(() => {
          setIsRandomizing(false);
          setHighlightedNodeId(null);
          setActiveTask(finalTask);
        }, 500);
      }
    }, 120);
  }, [allTasks, allCategories]);

  const handleTaskConfirm = useCallback(() => {
    if (!activeTask) return;
    
    // Increased distance significantly to ensure the label sits well outside any parent box
    // Min 15% distance, Max 28% distance from parent node center
    const angle = Math.random() * Math.PI * 2;
    const distance = 15 + Math.random() * 13; 
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    setState(prev => {
      const existing = prev.completedTasks.find(t => t.taskId === activeTask.id);
      let nextCompleted: UserTaskRecord[];
      if (existing) {
        nextCompleted = prev.completedTasks.map(t => 
          t.taskId === activeTask.id ? { ...t, count: t.count + 1, completedAt: Date.now() } : t
        );
      } else {
        nextCompleted = [...prev.completedTasks, { taskId: activeTask.id, count: 1, completedAt: Date.now(), dx, dy }];
      }
      return { ...prev, completedTasks: nextCompleted };
    });
    setActiveTask(null);
  }, [activeTask]);

  const handleDeleteCategory = (catId: string) => {
    setState(prev => {
      const nextCustomCategories = prev.customCategories.filter(c => c.id !== catId);
      const nextCustomTasks = prev.customTasks.filter(t => t.category !== catId);
      const pool = [...INITIAL_TASKS, ...prev.customTasks];
      const nextCompletedTasks = prev.completedTasks.filter(record => {
        const task = pool.find(t => t.id === record.taskId);
        return task && task.category !== catId;
      });
      const nextPositions = { ...prev.categoryPositions };
      delete nextPositions[catId];

      return {
        ...prev,
        customCategories: nextCustomCategories,
        customTasks: nextCustomTasks,
        completedTasks: nextCompletedTasks,
        categoryPositions: nextPositions
      };
    });
  };

  const handleUpdateCategory = (id: string, name: string) => {
    setState(prev => ({
      ...prev,
      customCategories: prev.customCategories.map(c => c.id === id ? { ...c, name } : c)
    }));
  };

  const handleUpdateTask = (id: string, updates: Partial<EnrichmentTask>) => {
    setState(prev => ({
      ...prev,
      customTasks: prev.customTasks.map(t => t.id === id ? { ...t, ...updates } : t)
    }));
  };

  const handleDeleteTask = (taskId: string) => {
    setState(prev => ({
      ...prev,
      customTasks: prev.customTasks.filter(t => t.id !== taskId),
      completedTasks: prev.completedTasks.filter(r => r.taskId !== taskId)
    }));
  };

  const handleReset = () => {
    setState(prev => ({
      ...prev,
      completedTasks: [],
      customTasks: [],
      customCategories: [],
      categoryPositions: {}
    }));
    setIsResetOpen(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#fdfaf5]">
      {isRandomizing && <div className="fixed inset-0 bg-black/60 z-[45] transition-opacity duration-500" />}

      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-40 text-center w-full pointer-events-none select-none">
        <div className="inline-block px-6 py-2 bg-white/40 backdrop-blur-sm rounded-full border border-black/5 shadow-sm">
          <p className="text-gray-500 text-xs tracking-[0.2em] font-['ZCOOL_XiaoWei'] uppercase">
            你是第 <span className="font-bold text-gray-800 text-lg mx-1 tabular-nums">{state.visitorCount}</span> 位丰容的人类
          </p>
        </div>
      </div>

      <div className="fixed top-6 left-6 z-50 flex flex-col gap-4">
        <button
          onClick={() => setIsSidebarOpen(true)}
          title="成就馆"
          className="w-14 h-14 bg-white border-2 border-black rounded-2xl flex items-center justify-center text-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 active:scale-95 transition-all hand-drawn"
        >
          🏅
        </button>
        <button
          onClick={() => setIsEditOpen(true)}
          title="管理分类"
          className="w-14 h-14 bg-white border-2 border-black rounded-2xl flex items-center justify-center text-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 active:scale-95 transition-all hand-drawn"
        >
          ⚙️
        </button>
        <button
          onClick={() => setIsResetOpen(true)}
          title="重新开始"
          className="w-14 h-14 bg-white border-2 border-black rounded-2xl flex items-center justify-center text-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 active:scale-95 transition-all hand-drawn text-red-500"
        >
          🔄
        </button>
      </div>

      <MapCanvas 
        completedTasks={state.completedTasks} 
        allTasks={allTasks}
        categories={allCategories}
        categoryPositions={state.categoryPositions}
        onSelectNode={(cat, sub) => {
          if (isRandomizing) return;
          const filtered = allTasks.filter(t => t.category === cat && (!sub || t.subCategory === sub));
          startRandomization(filtered);
        }}
        onUpdateCategoryPos={(id, x, y) => {
          setState(prev => ({
            ...prev,
            categoryPositions: { ...prev.categoryPositions, [id]: { x, y } }
          }));
        }}
        highlightedNodeId={highlightedNodeId}
      />

      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-6 z-40">
        <button
          onClick={() => startRandomization(allTasks)}
          disabled={isRandomizing}
          className={`px-12 py-5 bg-[#ffed4a] border-2 border-black rounded-full text-2xl font-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] 
            hover:shadow-none hover:translate-x-2 hover:translate-y-2 active:scale-95 transition-all
            ${isRandomizing ? 'opacity-50' : 'animate-bounce-slow'}`}
          style={{ borderRadius: '40px 100px 40px 100px / 100px 40px 100px 40px' }}
        >
          {isRandomizing ? '捕捉灵感中...' : '🎲 随机抽取'}
        </button>
        
        <button
          onClick={() => setIsCustomOpen(true)}
          className="w-16 h-16 bg-white border-2 border-black rounded-full flex flex-col items-center justify-center shadow-lg hover:bg-gray-50 active:scale-90 transition-all hand-drawn"
        >
          <span className="text-2xl">✍️</span>
          <span className="text-[10px] font-bold">创造</span>
        </button>
      </div>

      <TaskModal 
        task={activeTask} 
        category={activeCategory}
        onConfirm={handleTaskConfirm} 
        onCancel={() => setActiveTask(null)} 
      />
      
      <AchievementSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        state={state}
        allTasks={allTasks}
        categories={allCategories}
        onUpdateCount={(tid, delta) => {
          setState(prev => ({
            ...prev,
            completedTasks: prev.completedTasks.map(t => 
              t.taskId === tid ? { ...t, count: Math.max(0, t.count + delta) } : t
            ).filter(t => t.count > 0)
          }));
        }}
      />

      <CustomTaskOverlay 
        isOpen={isCustomOpen} 
        onClose={() => setIsCustomOpen(false)} 
        categories={allCategories}
        onAddTask={(task) => setState(prev => ({ ...prev, customTasks: [...prev.customTasks, task] }))}
        onAddCategory={(cat) => setState(prev => ({ ...prev, customCategories: [...prev.customCategories, cat] }))}
      />

      <EditCategoriesOverlay 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        customCategories={state.customCategories}
        customTasks={state.customTasks}
        onDeleteCategory={handleDeleteCategory}
        onUpdateCategory={handleUpdateCategory}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
      />

      <ResetConfirmModal 
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onConfirm={handleReset}
      />

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default App;
