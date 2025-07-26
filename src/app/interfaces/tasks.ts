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
