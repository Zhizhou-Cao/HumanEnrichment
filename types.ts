
export type CategoryID = string; // Support dynamic categories

export interface CategoryInfo {
  id: CategoryID;
  name: string;
  color: string;
  icon: string;
  x: number;
  y: number;
}

export interface EnrichmentTask {
  id: string;
  category: CategoryID;
  subCategory: string;
  content: string;
  isCustom?: boolean;
}

export interface UserTaskRecord {
  taskId: string;
  count: number;
  completedAt: number;
  // Offset relative to the parent sub-node or category node
  dx: number;
  dy: number;
}

export interface AppState {
  completedTasks: UserTaskRecord[];
  customTasks: EnrichmentTask[];
  customCategories: CategoryInfo[];
  visitorCount: number;
  categoryPositions: Record<CategoryID, { x: number, y: number }>;
}
