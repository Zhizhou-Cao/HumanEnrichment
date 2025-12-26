
import React from 'react';
import { HandDrawnBox } from './HandDrawnBox';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
      <div className="w-full max-w-sm animate-in zoom-in duration-300">
        <HandDrawnBox color="#fff" className="p-4 shadow-2xl border-2 border-red-500">
          <div className="text-center space-y-4">
            <div className="text-5xl">⚠️</div>
            <h2 className="text-2xl font-bold text-red-600">确定要重新开始吗？</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              这将会清除所有已完成的丰容记录、自定义任务和分类，让一切回到最初。此操作不可撤销。
            </p>
          </div>

          <div className="flex gap-4 mt-8">
            <button 
              onClick={onClose}
              className="flex-1 py-3 px-4 border-2 border-black rounded-xl hover:bg-gray-50 font-bold"
              style={{ borderRadius: '15px 45px 15px 45px / 45px 15px 45px 15px' }}
            >
              保留现状
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 py-3 px-4 bg-red-500 text-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all font-bold"
              style={{ borderRadius: '45px 15px 45px 15px / 15px 45px 15px 45px' }}
            >
              确定清除
            </button>
          </div>
        </HandDrawnBox>
      </div>
    </div>
  );
};
