
import React from 'react';
import { EnrichmentTask, CategoryInfo } from '../types';
import { HandDrawnBox } from './HandDrawnBox';

interface TaskModalProps {
  task: EnrichmentTask | null;
  category: CategoryInfo | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ task, category, onConfirm, onCancel }) => {
  if (!task || !category) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm transition-opacity duration-300">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-300">
        <HandDrawnBox color="#fff" className="p-2 shadow-2xl">
          <div className="text-center mb-6">
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 border border-black/20" style={{ backgroundColor: category.color }}>
              {category.name} · {task.subCategory}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 leading-relaxed px-4">
              {task.content}
            </h2>
          </div>

          <div className="flex gap-4 mt-8">
            <button 
              onClick={onCancel}
              className="flex-1 py-3 px-4 border-2 border-black rounded-xl hover:bg-gray-50 active:translate-y-1 transition-all font-bold text-gray-600"
              style={{ borderRadius: '15px 45px 15px 45px / 45px 15px 45px 15px' }}
            >
              再等等
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 py-3 px-4 border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 active:scale-95 transition-all font-bold text-gray-800"
              style={{ 
                borderRadius: '45px 15px 45px 15px / 15px 45px 15px 45px',
                backgroundColor: category.color 
              }}
            >
              完成！
            </button>
          </div>
        </HandDrawnBox>
      </div>
    </div>
  );
};
