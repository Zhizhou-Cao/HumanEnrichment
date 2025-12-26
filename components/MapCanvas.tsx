
import React, { useMemo, useState, useRef } from 'react';
import { CategoryID, UserTaskRecord, EnrichmentTask, CategoryInfo } from '../types';
import { SUBCAT_OFFSETS } from '../constants';

interface MapCanvasProps {
  completedTasks: UserTaskRecord[];
  allTasks: EnrichmentTask[];
  categories: CategoryInfo[];
  categoryPositions: Record<CategoryID, { x: number; y: number }>;
  onSelectNode: (cat: CategoryID, sub?: string) => void;
  onUpdateCategoryPos: (id: CategoryID, x: number, y: number) => void;
  highlightedNodeId: string | null;
}

// Simple hash to get stable deterministic offsets for custom subcategories
const getStableOffset = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const dx = ((Math.abs(hash) % 20) - 10); // range -10 to 10
  const dy = ((Math.abs(hash >> 5) % 20) - 10); 
  return { dx, dy };
};

export const MapCanvas: React.FC<MapCanvasProps> = ({ 
  completedTasks, 
  allTasks, 
  categories,
  categoryPositions,
  onSelectNode,
  onUpdateCategoryPos,
  highlightedNodeId
}) => {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragStartTime, setDragStartTime] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const backgroundDots = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: categories[i % categories.length]?.color || '#ffd700',
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 12
    }));
  }, [categories]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const scaleFactor = 0.1;
    const direction = e.deltaY > 0 ? -1 : 1;
    setZoom(prev => Math.max(0.3, Math.min(3, prev + direction * scaleFactor)));
  };

  const handleMouseDown = (e: React.MouseEvent, id?: string) => {
    setDragStartTime(Date.now());
    if (id) {
      setDraggedNode(id);
    } else {
      setIsPanning(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedNode) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const x = ((e.clientX - rect.left - offset.x) / zoom / rect.width) * 100;
        const y = ((e.clientY - rect.top - offset.y) / zoom / rect.height) * 100;
        onUpdateCategoryPos(draggedNode, x, y);
      }
    } else if (isPanning) {
      setOffset(prev => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY
      }));
    }
  };

  const handleMouseUp = (e: React.MouseEvent, id?: string, isSub?: boolean, catId?: string) => {
    const dragDuration = Date.now() - dragStartTime;
    // If it was a quick click and not a drag, trigger sampling
    if (dragDuration < 200) {
      if (isSub && catId) {
        onSelectNode(catId, id);
      } else if (id && !isSub) {
        onSelectNode(id);
      }
    }
    setIsPanning(false);
    setDraggedNode(null);
  };

  // Helper to check if a category or subcategory has been activated
  const isNodeActive = (catId: string, subName?: string) => {
    return completedTasks.some(record => {
      const task = allTasks.find(t => t.id === record.taskId);
      if (!task) return false;
      if (subName) return task.category === catId && task.subCategory === subName;
      return task.category === catId;
    });
  };

  const subNodes = useMemo(() => {
    const subs: { name: string; catId: CategoryID; x: number; y: number; color: string; active: boolean }[] = [];
    categories.forEach(cat => {
      const pos = categoryPositions[cat.id] || { x: cat.x, y: cat.y };
      const catSubCats = Array.from(new Set(allTasks.filter(t => t.category === cat.id).map(t => t.subCategory)));
      catSubCats.forEach(scName => {
        // Use deterministic offset to prevent "shivering" when parent moves
        const off = SUBCAT_OFFSETS[scName] || getStableOffset(scName);
        subs.push({
          name: scName,
          catId: cat.id,
          x: pos.x + off.dx,
          y: pos.y + off.dy,
          color: cat.color,
          active: isNodeActive(cat.id, scName)
        });
      });
    });
    return subs;
  }, [allTasks, categories, categoryPositions, completedTasks]);

  const getHighlightPos = () => {
    if (!highlightedNodeId) return null;
    const catPos = categoryPositions[highlightedNodeId];
    if (catPos) return catPos;
    const sub = subNodes.find(n => n.name === highlightedNodeId);
    if (sub) return { x: sub.x, y: sub.y };
    return null;
  };

  const spotlightPos = getHighlightPos();

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-[#fdfaf5] cursor-grab active:cursor-grabbing"
      onWheel={handleWheel}
      onMouseMove={handleMouseMove}
      onMouseDown={(e) => handleMouseDown(e)}
      onMouseUp={(e) => handleMouseUp(e)}
      onMouseLeave={() => { setIsPanning(false); setDraggedNode(null); }}
    >
      <div 
        className="absolute inset-0 transition-transform duration-75 ease-out origin-center"
        style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` }}
      >
        {/* Unopened Tasks (Floating Dots) */}
        {backgroundDots.map(dot => (
          <div 
            key={dot.id}
            className="absolute w-3 h-3 rounded-full opacity-60 drift-animation shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            style={{
              left: `${dot.x}%`,
              top: `${dot.y}%`,
              backgroundColor: dot.color,
              animationDelay: `-${dot.delay}s`,
              animationDuration: `${dot.duration}s`
            }}
          />
        ))}

        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Main Connections */}
          {categories.map(cat => {
            const pos = categoryPositions[cat.id] || { x: cat.x, y: cat.y };
            const catActive = isNodeActive(cat.id);
            return (
              <g key={`lines-${cat.id}`}>
                <line 
                  x1="50" y1="50" x2={pos.x} y2={pos.y} 
                  stroke="black" strokeWidth="0.15" strokeDasharray="1,2" 
                  className={`transition-opacity duration-1000 ${catActive ? 'opacity-30' : 'opacity-10'}`} 
                />
                {subNodes.filter(n => n.catId === cat.id).map(sub => (
                  <line 
                    key={sub.name} 
                    x1={pos.x} y1={pos.y} x2={sub.x} y2={sub.y} 
                    stroke="black" strokeWidth="0.1" 
                    className={`transition-opacity duration-1000 ${sub.active ? 'opacity-20' : 'opacity-5'}`} 
                  />
                ))}
              </g>
            );
          })}

          {/* Neuron Connections (Completed Tasks follow their parents) */}
          {completedTasks.map((record, i) => {
            const task = allTasks.find(t => t.id === record.taskId);
            if (!task) return null;
            const cat = categories.find(c => c.id === task.category);
            const parentPos = subNodes.find(n => n.name === task.subCategory) || (cat ? (categoryPositions[cat.id] || {x: cat.x, y: cat.y}) : { x: 50, y: 50 });
            const taskX = parentPos.x + record.dx;
            const taskY = parentPos.y + record.dy;
            
            return (
              <g key={`complete-${i}`}>
                <path 
                  d={`M ${parentPos.x} ${parentPos.y} Q ${(parentPos.x + taskX)/2} ${(parentPos.y + taskY)/2} ${taskX} ${taskY}`} 
                  stroke={cat?.color || '#ccc'} 
                  strokeWidth="0.2" 
                  fill="none" 
                  className="opacity-50"
                />
                <circle cx={taskX} cy={taskY} r="0.4" fill={cat?.color || '#ccc'} />
              </g>
            );
          })}
        </svg>

        {/* Center Hub */}
        <div className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 z-20 planetary-slow">
          <div className="hand-drawn bg-white border-4 border-black p-4 rounded-full w-28 h-28 flex items-center justify-center text-center shadow-xl">
            <span className="text-xl font-bold leading-tight">人类<br/>丰容</span>
          </div>
        </div>

        {/* Categories (Main Nodes) */}
        {categories.map((cat, i) => {
          const pos = categoryPositions[cat.id] || { x: cat.x, y: cat.y };
          return (
            <div 
              key={cat.id} 
              onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, cat.id); }}
              onMouseUp={(e) => { e.stopPropagation(); handleMouseUp(e, cat.id); }}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer planetary"
              style={{ 
                left: `${pos.x}%`, 
                top: `${pos.y}%`, 
                animationDelay: `${i * 0.4}s`,
                animationDuration: `${6 + (i % 3)}s` 
              }}
            >
              <div className="hand-drawn bg-white border-2 border-black px-5 py-3 rounded-xl shadow-md hover:scale-110 transition-all" style={{ backgroundColor: cat.color + 'CC' }}>
                <div className="text-2xl mb-1 text-center pointer-events-none">{cat.icon}</div>
                <div className="text-sm font-bold whitespace-nowrap pointer-events-none">{cat.name}</div>
              </div>
            </div>
          );
        })}

        {/* Subcategories */}
        {subNodes.map((sub, i) => (
          <div 
            key={sub.name} 
            onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, sub.name); }}
            onMouseUp={(e) => { e.stopPropagation(); handleMouseUp(e, sub.name, true, sub.catId); }}
            className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer planetary-fast transition-all duration-700 ${sub.active ? 'opacity-100 grayscale-0' : 'opacity-40 grayscale-[80%]'}`}
            style={{ 
              left: `${sub.x}%`, 
              top: `${sub.y}%`, 
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${4 + (i % 2)}s`
            }}
          >
            <div className="hand-drawn bg-white border-2 border-black/40 px-3 py-1.5 rounded-lg text-[13px] font-bold text-gray-700 shadow-sm hover:scale-110 transition-transform">
              {sub.name}
            </div>
          </div>
        ))}

        {/* Completed Task Labels - Ensure these are positioned far enough via App.tsx logic, 
            but also given z-40 and a clear background to stay readable. */}
        {completedTasks.map((record, i) => {
          const task = allTasks.find(t => t.id === record.taskId);
          if (!task) return null;
          const parentPos = subNodes.find(n => n.name === task.subCategory) || categories.find(c => c.id === task.category) || { x: 50, y: 50 };
          const taskX = (parentPos as any).x + record.dx;
          const taskY = (parentPos as any).y + record.dy;

          return (
            <div 
              key={`label-${i}`} 
              className="absolute z-40 -translate-x-1/2 -translate-y-1/2 pointer-events-none planetary-slowest"
              style={{ 
                left: `${taskX}%`, 
                top: `${taskY}%`, 
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${15 + (i % 10)}s`
              }}
            >
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-gray-700 font-bold font-sans whitespace-nowrap bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border-2 border-black/10 shadow-[0_2px_10px_rgba(0,0,0,0.1)] ring-1 ring-white/50">
                  {task.content.length > 18 ? task.content.substring(0, 16) + '...' : task.content}
                </span>
              </div>
            </div>
          );
        })}

        {/* Spotlight */}
        {spotlightPos && (
          <div 
            className="absolute z-50 pointer-events-none transition-all duration-150 ease-out"
            style={{ 
              left: `${spotlightPos.x}%`, 
              top: `${spotlightPos.y}%`,
              width: '130px',
              height: '130px',
              transform: 'translate(-50%, -50%)',
              border: '4px dashed #ffeb3b',
              borderRadius: '50%',
              boxShadow: '0 0 50px rgba(255, 235, 59, 0.6)'
            }}
          />
        )}
      </div>

      <style>{`
        @keyframes drift {
          from { transform: translate(0, 0); }
          25% { transform: translate(12px, -18px); }
          50% { transform: translate(-18px, 12px); }
          75% { transform: translate(18px, 25px); }
          to { transform: translate(0, 0); }
        }
        .drift-animation { animation: drift linear infinite; }

        @keyframes planetary {
          0%, 100% { transform: translate(-50%, -50%) translate(0, 0); }
          33% { transform: translate(-50%, -50%) translate(4px, -5px); }
          66% { transform: translate(-50%, -50%) translate(-3px, 4px); }
        }
        .planetary { animation: planetary 7s ease-in-out infinite; }
        .planetary-slow { animation: planetary 14s ease-in-out infinite; }
        .planetary-fast { animation: planetary 5s ease-in-out infinite; }
        .planetary-slowest { animation: planetary 22s ease-in-out infinite; }
      `}</style>
    </div>
  );
};
