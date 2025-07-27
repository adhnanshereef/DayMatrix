export interface Task {
  id: string;
  task: string;
  description: string;
  completed: boolean;
  due: string|null;
  quadrant: string;
  created_at: string;
  updated_at: string;
}

export interface TaskInput {
  task: string;
  description?: string;
  due?: string|null;
  quadrant?: string;
}

export type QuadrantKey = 't1' | 't2' | 't3' | 't4';