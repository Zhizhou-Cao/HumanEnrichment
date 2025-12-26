
import { EnrichmentTask, CategoryID } from './types';

export const CATEGORIES: Record<CategoryID, { name: string; color: string; icon: string; x: number; y: number }> = {
  cognitive: { name: '认知丰容', color: '#FFF59D', icon: '🧠', x: 50, y: 28 },
  sensory: { name: '感知丰容', color: '#90CAF9', icon: '🎨', x: 30, y: 45 },
  physical: { name: '物理环境', color: '#A5D6A7', icon: '🏠', x: 70, y: 45 },
  food: { name: '食物丰容', color: '#F48FB1', icon: '🍓', x: 38, y: 68 },
  social: { name: '社群丰容', color: '#CE93D8', icon: '🤝', x: 62, y: 68 },
};

export const SUBCAT_OFFSETS: Record<string, { dx: number; dy: number }> = {
  // 感知
  '触觉': { dx: -10, dy: -4 },
  '视觉': { dx: -8, dy: 6 },
  '听觉': { dx: -4, dy: 10 },
  '嗅觉/味觉': { dx: 6, dy: 8 },
  // 物理
  '家/我的小窝': { dx: 10, dy: -4 },
  '生活功能拓展': { dx: 8, dy: 6 },
  '独处的专属角': { dx: 12, dy: 2 },
  '环境/气候场景': { dx: 4, dy: 10 },
  // 认知
  '尝试全新活动': { dx: -8, dy: -6 },
  '日常脑力锻炼': { dx: 8, dy: -6 },
  // 食物
  '新奇食物': { dx: -8, dy: 8 },
  '烹饪与环境': { dx: 8, dy: 8 },
  // 社群
  '同类群体': { dx: -8, dy: 8 },
  '短暂交集': { dx: 8, dy: 8 },
  '跨物种互动': { dx: 0, dy: 12 },
  '老己': { dx: 10, dy: -2 },
};

export const INITIAL_TASKS: EnrichmentTask[] = [
  // 1. 感知丰容
  { id: 's1', category: 'sensory', subCategory: '触觉', content: '尝试 DIY 陶艺，感受不同粘土材质' },
  { id: 's2', category: 'sensory', subCategory: '触觉', content: '去大自然中拥抱一棵大树，触摸天然材质' },
  { id: 's3', category: 'sensory', subCategory: '触觉', content: '撸猫撸狗，感受毛茸茸的治愈' },
  { id: 's4', category: 'sensory', subCategory: '触觉', content: '触摸不同表面的物品（如羊毛毯、金属工艺品等）' },
  { id: 's5', category: 'sensory', subCategory: '视觉', content: '看一场电影或纪录片' },
  { id: 's6', category: 'sensory', subCategory: '视觉', content: '去逛线下画展或摄影展' },
  { id: 's7', category: 'sensory', subCategory: '视觉', content: '观察不同的城市建筑、街头人文' },
  { id: 's8', category: 'sensory', subCategory: '视觉', content: '捕捉大自然或城市夜景的风光' },
  { id: 's9', category: 'sensory', subCategory: '听觉', content: '探索一种从未听过的音乐类型' },
  { id: 's10', category: 'sensory', subCategory: '听觉', content: '去户外听雨声、鸟鸣或树叶沙沙声' },
  { id: 's11', category: 'sensory', subCategory: '听觉', content: '听一期有趣的播客或听书' },
  { id: 's12', category: 'sensory', subCategory: '嗅觉/味觉', content: '品鉴一杯高品质的咖啡、茶或红酒' },
  { id: 's13', category: 'sensory', subCategory: '嗅觉/味觉', content: '闻一闻香氛、精油或香薰' },
  { id: 's14', category: 'sensory', subCategory: '嗅觉/味觉', content: '感受大自然的气味（如雨后泥土、桂花香）' },
  { id: 's15', category: 'sensory', subCategory: '嗅觉/味觉', content: '尝试一种从未吃过的美食' },

  // 2. 物理环境丰容
  { id: 'p1', category: 'physical', subCategory: '家/我的小窝', content: '调整优化家具布局，换个心情' },
  { id: 'p2', category: 'physical', subCategory: '家/我的小窝', content: '给家里添置挂画、绿植等软装，保持新鲜感' },
  { id: 'p3', category: 'physical', subCategory: '家/我的小窝', content: '进行一次深度断舍离或日常维护清洁' },
  { id: 'p4', category: 'physical', subCategory: '生活功能拓展', content: '在家里布置一个专属健身角或书架' },
  { id: 'p5', category: 'physical', subCategory: '生活功能拓展', content: '在阳台搭建一个花架，满足绿植需求' },
  { id: 'p6', category: 'physical', subCategory: '生活功能拓展', content: '布置一张拼图桌或积木书桌' },
  { id: 'p7', category: 'physical', subCategory: '独处的专属角', content: '在角落创造一个独处的专属空间' },
  { id: 'p8', category: 'physical', subCategory: '独处的专属角', content: '给自己 15 分钟的“空白页”时间，什么都不做' },
  { id: 'p9', category: 'physical', subCategory: '环境/气候场景', content: '去体验四季：春季野餐、夏季水上、秋季观景、冬季滑雪' },
  { id: 'p10', category: 'physical', subCategory: '环境/气候场景', content: '在特殊环境下放松：去海边、森林或村庄' },
  { id: 'p11', category: 'physical', subCategory: '环境/气候场景', content: '感受不同的天气：雨天赏雨、晴天晒太阳、微风放风筝' },

  // 3. 认知丰容
  { id: 'c1', category: 'cognitive', subCategory: '尝试全新活动', content: '体验一种新的生活方式（如旅居、极简生活）' },
  { id: 'c2', category: 'cognitive', subCategory: '尝试全新活动', content: '学习一项新技能（如潜水、编程、乐器）' },
  { id: 'c3', category: 'cognitive', subCategory: '尝试全新活动', content: '来一场说走就走的旅行，去往未知场景' },
  { id: 'c4', category: 'cognitive', subCategory: '尝试全新活动', content: '参加一类从未体验过的团购体验课' },
  { id: 'c5', category: 'cognitive', subCategory: '日常脑力锻炼', content: '进行深度阅读或跨学科学习' },
  { id: 'c6', category: 'cognitive', subCategory: '日常脑力锻炼', content: '玩一局逻辑类游戏' },
  { id: 'c7', category: 'cognitive', subCategory: '日常脑力锻炼', content: '做一次思维训练或复盘笔记' },
  { id: 'c8', category: 'cognitive', subCategory: '日常脑力锻炼', content: '学习一句新的外语' },
  { id: 'c9', category: 'cognitive', subCategory: '日常脑力锻炼', content: '尝试用非惯用手刷牙，或走一条上班的新路线' },

  // 4. 食物丰容
  { id: 'f1', category: 'food', subCategory: '新奇食物', content: '去吃一个从未去过国家/地区的特色美食' },
  { id: 'f2', category: 'food', subCategory: '新奇食物', content: '尝试一种从未见过的食材或小众水果' },
  { id: 'f3', category: 'food', subCategory: '新奇食物', content: '去便利店买一款口味最奇怪的零食' },
  { id: 'f4', category: 'food', subCategory: '烹饪与环境', content: '亲手制作一种食材（如手作果酱、泡菜）' },
  { id: 'f5', category: 'food', subCategory: '烹饪与环境', content: '去父母或朋友家“蹭饭”，感受不同的家庭味道' },
  { id: 'f6', category: 'food', subCategory: '烹饪与环境', content: '布置一个漂亮的餐桌环境，增加用餐仪式感' },
  { id: 'f7', category: 'food', subCategory: '烹饪与环境', content: '尝试一种新的饮食方式（如地中海饮食、间歇性饮食）' },

  // 5. 社群丰容
  { id: 'sc1', category: 'social', subCategory: '同类群体', content: '找老朋友聊天、小聚' },
  { id: 'sc2', category: 'social', subCategory: '同类群体', content: '和家人团聚，享受亲情时光' },
  { id: 'sc3', category: 'social', subCategory: '同类群体', content: '参加同好间的活动（如徒步团、研讨社）' },
  { id: 'sc4', category: 'social', subCategory: '同类群体', content: '与不同年龄段的人交流' },
  { id: 'sc5', category: 'social', subCategory: '短暂交集', content: '与咖啡店店员、快递员或社区工作者简短聊聊天' },
  { id: 'sc6', category: 'social', subCategory: '短暂交集', content: '在公园闲聊，或参加一日志愿者活动' },
  { id: 'sc7', category: 'social', subCategory: '短暂交集', content: '给远方的朋友写一封信（笔友模式）' },
  { id: 'sc8', category: 'social', subCategory: '跨物种互动', content: '观察并照料家里的宠物' },
  { id: 'sc9', category: 'social', subCategory: '跨物种互动', content: '去户外观察野鸟或照顾流浪动物' },
  { id: 'sc10', category: 'social', subCategory: '跨物种互动', content: '给家里的绿植浇水、修剪' },
  { id: 'sc11', category: 'social', subCategory: '老己', content: '做自己的“饲养员”：保证规律作息和健身' },
  { id: 'sc12', category: 'social', subCategory: '老己', content: '进行一次心理调节或理财学习' },
];
