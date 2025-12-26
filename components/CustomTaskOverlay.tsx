
import React, { useState } from 'react';
import { CategoryID, EnrichmentTask, CategoryInfo } from '../types';
import { HandDrawnBox } from './HandDrawnBox';

interface CustomTaskOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryInfo[];
  onAddTask: (task: EnrichmentTask) => void;
  onAddCategory: (cat: CategoryInfo) => void;
}

export const CustomTaskOverlay: React.FC<CustomTaskOverlayProps> = ({ isOpen, onClose, categories, onAddTask, onAddCategory }) => {
  const [tab, setTab] = useState<'task' | 'category'>('task');
  
  // Task state
  const [taskText, setTaskText] = useState('');
  const [subCatText, setSubCatText] = useState('');
  const [selectedCatId, setSelectedCatId] = useState<CategoryID>(categories[0]?.id || 'sensory');

  // Category state
  const [catName, setCatName] = useState('');
  const [catIcon, setCatIcon] = useState('🌟');
  const [catColor, setCatColor] = useState('#ffed4a');

  if (!isOpen) return null;

  const handleAddTask = () => {
    if (!taskText.trim()) return;
    onAddTask({
      id: `custom-task-${Date.now()}`,
      category: selectedCatId,
      subCategory: subCatText.trim() || '我的探索',
      content: taskText,
      isCustom: true
    });
    setTaskText('');
    setSubCatText('');
    onClose();
  };

  const handleAddCategory = () => {
    if (!catName.trim()) return;
    onAddCategory({
      id: `custom-cat-${Date.now()}`,
      name: catName,
      icon: catIcon,
      color: catColor,
      x: 35 + Math.random() * 30,
      y: 35 + Math.random() * 30
    });
    setCatName('');
    setTab('task');
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md">
        <HandDrawnBox color="#fff" className="p-2">
          <div className="flex border-b border-black/10 mb-6">
            <button 
              onClick={() => setTab('task')}
              className={`flex-1 py-2 font-bold transition-all ${tab === 'task' ? 'text-black border-b-2 border-black' : 'text-gray-300'}`}
            >
              新增项目
            </button>
            <button 
              onClick={() => setTab('category')}
              className={`flex-1 py-2 font-bold transition-all ${tab === 'category' ? 'text-black border-b-2 border-black' : 'text-gray-300'}`}
            >
              新增主分类
            </button>
          </div>

          {tab === 'task' ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-2">选择所属主分类</label>
                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-1">
                  {categories.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCatId(c.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${selectedCatId === c.id ? 'border-black scale-105' : 'border-transparent opacity-50'}`}
                      style={{ backgroundColor: c.color }}
                    >
                      {c.icon} {c.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">自分类名称</label>
                <input 
                  value={subCatText} 
                  onChange={e => setSubCatText(e.target.value)}
                  className="w-full p-3 bg-gray-50 rounded-xl border border-black/10 outline-none"
                  placeholder="例如：书影音、手工制作..."
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">具体丰容任务</label>
                <textarea
                  value={taskText}
                  onChange={(e) => setTaskText(e.target.value)}
                  placeholder="这一刻，你想如何丰容自己？"
                  className="w-full h-24 p-4 bg-gray-50 rounded-xl border-2 border-dashed border-black/10 outline-none focus:border-black/30"
                />
              </div>
              <div className="flex gap-4 pt-2">
                <button onClick={onClose} className="flex-1 py-3 font-bold text-gray-400">取消</button>
                <button onClick={handleAddTask} className="flex-[2] py-3 bg-black text-white rounded-xl font-bold">发布丰容</button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">分类名称</label>
                <input 
                  value={catName} 
                  onChange={e => setCatName(e.target.value)}
                  className="w-full p-3 bg-gray-50 rounded-xl border border-black/10 outline-none"
                  placeholder="例如：精神丰容"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs font-bold text-gray-400 block mb-1">图标 (Emoji)</label>
                  <input 
                    value={catIcon} 
                    onChange={e => setCatIcon(e.target.value)}
                    className="w-full p-3 bg-gray-50 rounded-xl border border-black/10 outline-none text-center"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-bold text-gray-400 block mb-1">主题色</label>
                  <input 
                    type="color"
                    value={catColor} 
                    onChange={e => setCatColor(e.target.value)}
                    className="w-full h-12 p-1 bg-gray-50 rounded-xl border border-black/10 outline-none cursor-pointer"
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setTab('task')} className="flex-1 py-3 font-bold text-gray-400">返回</button>
                <button onClick={handleAddCategory} className="flex-[2] py-3 bg-black text-white rounded-xl font-bold">创建分类</button>
              </div>
            </div>
          )}
        </HandDrawnBox>
      </div>
    </div>
  );
};
