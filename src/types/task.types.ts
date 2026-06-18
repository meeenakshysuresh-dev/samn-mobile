export type TaskStatus = 'open' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';

export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskCategory =
  | 'Cleaning'
  | 'Delivery'
  | 'Repairs'
  | 'Gardening'
  | 'Tutoring'
  | 'Shopping'
  | 'Moving'
  | 'Pet Care';

export type TaskTimelineEvent = {
  id: string;
  status: TaskStatus;
  label: string;
  timestamp: string;
  actorName?: string;
};

export type Task = {
  id: string;
  title: string;
  category: TaskCategory;
  description: string;
  location: string;
  budget: number;
  preferredDateTime: string;
  priority: TaskPriority;
  status: TaskStatus;
  postedDate: string;
  createdAt: string;
  ownerId: string;
  ownerName: string;
  workerId?: string;
  workerName?: string;
  images: string[];
  distance?: string;
  timeline: TaskTimelineEvent[];
};

export type PostedTaskFilterTab = 'all' | TaskStatus;
export type AcceptedTaskFilterTab = 'all' | 'accepted' | 'in_progress' | 'completed';
export type MyTasksSection = 'posted' | 'accepted';
export type TaskScreenTab = 'myTasks' | 'incoming';

export type TaskHubTab = 'available' | 'posted' | 'accepted';

export type CreateTaskInput = {
  title: string;
  category: TaskCategory;
  description: string;
  location: string;
  budget: number;
  preferredDateTime: string;
  priority: TaskPriority;
  images?: string[];
};

export type UpdateTaskInput = Partial<CreateTaskInput>;

export type ActivityItem = {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  icon: string;
};

export type TaskViewerRole = 'owner' | 'worker' | 'viewer';

export type TaskActionKey =
  | 'accept'
  | 'edit'
  | 'delete'
  | 'start'
  | 'complete'
  | 'cancelTask'
  | 'cancelAcceptance';
