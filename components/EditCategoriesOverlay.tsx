
import React, { useState } from 'react';
import { CategoryInfo, EnrichmentTask } from '../types';
import { HandDrawnBox } from './HandDrawnBox';

interface EditCategoriesOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  customCategories: CategoryInfo[];
  customTasks: EnrichmentTask[];
  onDeleteCategory: (id: string) => void;
  onUpdateCategory: (id: string, name: string) => void;
  onUpdateTask: (id: string, updates: Partial<EnrichmentTask>) => void;
  onDeleteTask: (id: string) => void;
}

export const EditCategoriesOverlay: React.FC<EditCategoriesOverlayProps> = ({ 
  isOpen, 
  onClose, 
  customCategories, 
  customTasks,
  onUpdateCategory,
  onUpdateTask,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");
  const [editingField, setEditingField] = useState<"cat" | "sub" | "content" | null>(null);

  if (!isOpen) return null;

  const startEditing = (id: string, value: string, field: "cat" | "sub" | "content") => {
    setEditingId(id);
    setTempValue(value);
    setEditingField(field);
  };

  const saveEdit = () => {
    if (!editingId) return;
    const val = tempValue.trim();
    if (val) {
      if (editingField === "cat") {
        onUpdateCategory(editingId, val);
      } else if (editingField === "sub") {
        onUpdateTask(editingId, { subCategory: val });
      } else if (editingField === "content") {
        onUpdateTask(editingId, { content: val });
      }
    }
    setEditingId(null);
    setEditingField(null);
  };

  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl">
        <HandDrawnBox color="#fff" className="p-2 shadow-2xl">
          <div className="flex justify-between items-center mb-6 border-b border-black/10 pb-2">
            <h2 className="text-xl font-bold">管理自定义分类与任务</h2>
            <button onClick={onClose} className="text-2xl font-bold p-2 hover:bg-gray-100 rounded-full transition-colors">×</button>
          </div>

          <div className="max-h-[70vh] overflow-y-auto space-y-6 p-1">
            {customCategories.length === 0 ? (
              <p className="text-center py-8 text-gray-400 italic">暂无自定义分类</p>
            ) : (
              customCategories.map(cat => (
                <div key={cat.id} className="p-4 bg-gray-50 rounded-2xl border border-black/5 space-y-4">
                  <div className="flex items-center justify-between gap-2 border-b border-black/5 pb-2">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">{cat.icon}</span>
                      {editingId === cat.id && editingField === "cat" ? (
                        <input 
                          autoFocus
                          className="flex-1 bg-white border-2 border-black/20 px-2 py-1 rounded font-bold outline-none focus:border-black"
                          value={tempValue}
                          onChange={e => setTempValue(e.target.value)}
                          onBlur={saveEdit}
                          onKeyDown={e => e.key === 'Enter' && saveEdit()}
                        />
                      ) : (
                        <span className="font-bold text-lg">{cat.name}</span>
                      )}
                      {editingId !== cat.id && (
                        <button 
                          onClick={() => startEditing(cat.id, cat.name, "cat")}
                          className="text-xs text-blue-500 hover:text-blue-700 underline"
                        >
                          修改名称
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Tasks for this category */}
                  <div className="pl-4 space-y-3">
                    {customTasks.filter(t => t.category === cat.id).map(task => (
                      <div key={task.id} className="bg-white p-3 rounded-xl border border-black/5 flex flex-col gap-2 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">自分类:</span>
                            {editingId === task.id && editingField === "sub" ? (
                              <input 
                                autoFocus
                                className="text-xs bg-gray-50 border border-black/20 px-1 py-0.5 rounded outline-none focus:border-black"
                                value={tempValue}
                                onChange={e => setTempValue(e.target.value)}
                                onBlur={saveEdit}
                                onKeyDown={e => e.key === 'Enter' && saveEdit()}
                              />
                            ) : (
                              <span className="text-xs font-bold text-gray-600">{task.subCategory}</span>
                            )}
                            {editingId !== task.id && (
                              <button onClick={() => startEditing(task.id, task.subCategory, "sub")} className="text-[10px] text-blue-400">📝</button>
                            )}
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          {editingId === task.id && editingField === "content" ? (
                            <textarea 
                              autoFocus
                              className="flex-1 text-sm bg-gray-50 border border-black/20 px-2 py-1 rounded leading-relaxed min-h-[60px] outline-none focus:border-black"
                              value={tempValue}
                              onChange={e => setTempValue(e.target.value)}
                              onBlur={saveEdit}
                              onKeyDown={e => (e.key === 'Enter' && !e.shiftKey) && saveEdit()}
                            />
                          ) : (
                            <p className="text-sm font-medium leading-relaxed flex-1 text-gray-700">{task.content}</p>
                          )}
                          {editingId !== task.id && (
                            <button onClick={() => startEditing(task.id, task.content, "content")} className="text-xs text-blue-400 hover:underline">编辑内容</button>
                          )}
                        </div>
                      </div>
                    ))}
                    {customTasks.filter(t => t.category === cat.id).length === 0 && (
                      <p className="text-xs text-gray-400 italic">该分类下暂无任务</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-6">
            <button 
              onClick={onClose}
              className="w-full py-4 bg-black text-white rounded-xl font-bold active:scale-95 transition-all shadow-lg hover:bg-gray-900"
            >
              完成并关闭
            </button>
          </div>
        </HandDrawnBox>
      </div>
    </div>
  );
};
