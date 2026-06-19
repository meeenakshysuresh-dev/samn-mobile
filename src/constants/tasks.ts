import type { ActivityItem, Task } from '../types/task.types';
import { SEED_CURRENT_USER } from '../utils/taskWorkflow';

export const TASK_CATEGORIES = [
  'Cleaning',
  'Delivery',
  'Repairs',
  'Gardening',
  'Tutoring',
  'Shopping',
  'Moving',
  'Pet Care',
] as const;

export const TASK_STATUS_LABELS = {
  open: 'Open',
  accepted: 'Accepted',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
} as const;

export const TASK_PRIORITY_OPTIONS = [
  { label: 'Low', value: 'low' as const },
  { label: 'Medium', value: 'medium' as const },
  { label: 'High', value: 'high' as const },
];

export const POSTED_TASK_FILTER_TABS = [
  { key: 'all' as const, label: 'All' },
  { key: 'open' as const, label: 'Open' },
  { key: 'accepted' as const, label: 'Accepted' },
  { key: 'in_progress' as const, label: 'In Progress' },
  { key: 'completed' as const, label: 'Completed' },
  { key: 'cancelled' as const, label: 'Cancelled' },
];

export const ACCEPTED_TASK_FILTER_TABS = [
  { key: 'all' as const, label: 'All' },
  { key: 'accepted' as const, label: 'Accepted' },
  { key: 'in_progress' as const, label: 'In Progress' },
  { key: 'completed' as const, label: 'Completed' },
];

export const TASK_ACTION_LABELS = {
  accept: 'Accept Task',
  edit: 'Edit',
  delete: 'Delete',
  start: 'Start Task',
  complete: 'Mark as Completed',
  cancelTask: 'Cancel Task',
  cancelAcceptance: 'Cancel Acceptance',
} as const;

export const NOTIFICATION_EVENT_LABELS = {
  task_posted: 'Task posted',
  task_accepted: 'Task accepted',
  task_started: 'Task started',
  task_completed: 'Task completed',
  task_cancelled: 'Task cancelled',
  task_deleted: 'Task deleted',
  acceptance_cancelled: 'Acceptance cancelled',
  chat_message: 'New message',
} as const;

const timeline = (
  status: Task['status'],
  label: string,
  timestamp: string,
  actorName?: string,
): Task['timeline'] => [
  {
    id: `${status}-1`,
    status,
    label,
    timestamp,
    actorName,
  },
];

export const SEED_TASKS: Task[] = [
  {
    id: 'posted-open-1',
    title: 'Weekend Yard Cleanup',
    category: 'Gardening',
    description: 'Rake leaves, trim hedges, and bag yard waste.',
    location: 'Maple Street',
    budget: 60,
    preferredDateTime: 'Sat, 9:00 AM',
    priority: 'medium',
    status: 'open',
    postedDate: 'Mar 12, 2026',
    createdAt: '2026-03-12T09:00:00.000Z',
    ownerId: SEED_CURRENT_USER,
    ownerName: 'You',
    images: [],
    timeline: timeline('open', 'Task posted', 'Mar 12, 2026', 'You'),
  },
  {
    id: 'posted-accepted-1',
    title: 'Furniture Assembly',
    category: 'Repairs',
    description: 'Assemble IKEA desk and bookshelf.',
    location: 'Riverside Apt',
    budget: 45,
    preferredDateTime: 'Fri, 2:00 PM',
    priority: 'low',
    status: 'accepted',
    postedDate: 'Mar 10, 2026',
    createdAt: '2026-03-10T14:00:00.000Z',
    ownerId: SEED_CURRENT_USER,
    ownerName: 'You',
    workerId: 'user-jordan',
    workerName: 'Jordan Lee',
    images: [],
    timeline: [
      ...timeline('open', 'Task posted', 'Mar 10, 2026', 'You'),
      ...timeline('accepted', 'Task accepted', 'Mar 10, 2026', 'Jordan Lee'),
    ],
  },
  {
    id: 'posted-progress-1',
    title: 'Dog Walking',
    category: 'Pet Care',
    description: '30-minute walk for friendly golden retriever.',
    location: 'Parkview',
    budget: 20,
    preferredDateTime: 'Wed, 6:00 PM',
    priority: 'high',
    status: 'in_progress',
    postedDate: 'Mar 5, 2026',
    createdAt: '2026-03-05T18:00:00.000Z',
    ownerId: SEED_CURRENT_USER,
    ownerName: 'You',
    workerId: 'user-sam',
    workerName: 'Sam Rivera',
    images: [],
    timeline: [
      ...timeline('open', 'Task posted', 'Mar 5, 2026', 'You'),
      ...timeline('accepted', 'Task accepted', 'Mar 6, 2026', 'Sam Rivera'),
      ...timeline('in_progress', 'Task started', 'Mar 6, 2026', 'Sam Rivera'),
    ],
  },
  {
    id: 'posted-completed-1',
    title: 'Package Pickup',
    category: 'Shopping',
    description: 'Collect online order from pickup locker.',
    location: 'Mall Plaza',
    budget: 15,
    preferredDateTime: 'Thu, 12:00 PM',
    priority: 'low',
    status: 'completed',
    postedDate: 'Mar 1, 2026',
    createdAt: '2026-03-01T12:00:00.000Z',
    ownerId: SEED_CURRENT_USER,
    ownerName: 'You',
    workerId: 'user-alex',
    workerName: 'Alex Morgan',
    images: [],
    timeline: [
      ...timeline('open', 'Task posted', 'Mar 1, 2026', 'You'),
      ...timeline('accepted', 'Task accepted', 'Mar 1, 2026', 'Alex Morgan'),
      ...timeline('in_progress', 'Task started', 'Mar 2, 2026', 'Alex Morgan'),
      ...timeline('completed', 'Task completed', 'Mar 2, 2026', 'Alex Morgan'),
    ],
  },
  {
    id: 'posted-cancelled-1',
    title: 'Window Cleaning',
    category: 'Cleaning',
    description: 'Clean exterior windows on ground floor.',
    location: 'Oak Lane',
    budget: 35,
    preferredDateTime: 'Sun, 8:00 AM',
    priority: 'medium',
    status: 'cancelled',
    postedDate: 'Feb 28, 2026',
    createdAt: '2026-02-28T08:00:00.000Z',
    ownerId: SEED_CURRENT_USER,
    ownerName: 'You',
    images: [],
    timeline: [
      ...timeline('open', 'Task posted', 'Feb 28, 2026', 'You'),
      ...timeline('cancelled', 'Task cancelled', 'Feb 28, 2026', 'You'),
    ],
  },
  {
    id: 'accepted-1',
    title: 'Apartment Deep Cleaning',
    category: 'Cleaning',
    description: 'Need help with a 2-bedroom apartment deep clean before move-out.',
    location: 'Downtown, 0.8 mi',
    budget: 75,
    preferredDateTime: 'Sat, 10:00 AM',
    priority: 'medium',
    status: 'accepted',
    postedDate: '2h ago',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    ownerId: 'user-alex',
    ownerName: 'Alex Morgan',
    workerId: SEED_CURRENT_USER,
    workerName: 'You',
    distance: '0.8 mi',
    images: [],
    timeline: [
      ...timeline('open', 'Task posted', '2h ago', 'Alex Morgan'),
      ...timeline('accepted', 'Task accepted', '1h ago', 'You'),
    ],
  },
  {
    id: 'accepted-progress-1',
    title: 'Grocery Delivery',
    category: 'Delivery',
    description: 'Pick up groceries from FreshMart and deliver to my apartment.',
    location: 'Westside, 1.2 mi',
    budget: 25,
    preferredDateTime: 'Today, 4:00 PM',
    priority: 'high',
    status: 'in_progress',
    postedDate: '4h ago',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    ownerId: 'user-mia',
    ownerName: 'Mia Chen',
    workerId: SEED_CURRENT_USER,
    workerName: 'You',
    distance: '1.2 mi',
    images: [],
    timeline: [
      ...timeline('open', 'Task posted', '4h ago', 'Mia Chen'),
      ...timeline('accepted', 'Task accepted', '3h ago', 'You'),
      ...timeline('in_progress', 'Task started', '2h ago', 'You'),
    ],
  },
  {
    id: 'browse-1',
    title: 'Fix Leaky Faucet',
    category: 'Repairs',
    description: 'Kitchen faucet dripping steadily. Tools available on-site.',
    location: 'Oak Park, 1.5 mi',
    budget: 50,
    preferredDateTime: 'Sun, 11:00 AM',
    priority: 'medium',
    status: 'open',
    postedDate: '6h ago',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    ownerId: 'user-riley',
    ownerName: 'Riley Brooks',
    distance: '1.5 mi',
    images: [],
    timeline: timeline('open', 'Task posted', '6h ago', 'Riley Brooks'),
  },
  {
    id: 'browse-2',
    title: 'Math Tutoring Session',
    category: 'Tutoring',
    description: 'Help with algebra homework for high school student.',
    location: 'Campus Area, 2.0 mi',
    budget: 40,
    preferredDateTime: 'Mon, 5:30 PM',
    priority: 'low',
    status: 'open',
    postedDate: '1d ago',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    ownerId: 'user-taylor',
    ownerName: 'Taylor Kim',
    distance: '2.0 mi',
    images: [],
    timeline: timeline('open', 'Task posted', '1d ago', 'Taylor Kim'),
  },
  {
    id: 'browse-hidden-1',
    title: 'Already Accepted Task',
    category: 'Delivery',
    description: 'This task should not appear in browse.',
    location: 'Hidden',
    budget: 30,
    preferredDateTime: 'Mon, 1:00 PM',
    priority: 'medium',
    status: 'accepted',
    postedDate: '1d ago',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    ownerId: 'user-casey',
    ownerName: 'Casey Wright',
    workerId: 'user-other',
    workerName: 'Other Worker',
    images: [],
    timeline: [
      ...timeline('open', 'Task posted', '1d ago', 'Casey Wright'),
      ...timeline('accepted', 'Task accepted', '1d ago', 'Other Worker'),
    ],
  },
];

export const RECENT_ACTIVITY: ActivityItem[] = [
  {
    id: 'act-1',
    title: 'Jordan accepted Furniture Assembly',
    subtitle: 'Your posted task now has a worker',
    timestamp: '30 min ago',
    icon: 'users',
  },
  {
    id: 'act-2',
    title: 'Grocery Delivery in progress',
    subtitle: 'You started an accepted task',
    timestamp: '2h ago',
    icon: 'clock',
  },
  {
    id: 'act-3',
    title: 'Package Pickup completed',
    subtitle: 'Task marked as completed',
    timestamp: 'Yesterday',
    icon: 'check',
  },
  {
    id: 'act-4',
    title: 'New open task nearby',
    subtitle: 'Fix Leaky Faucet posted 1.5 mi away',
    timestamp: 'Yesterday',
    icon: 'mapPin',
  },
];

export const formatBudget = (amount: number) => `$${amount.toFixed(0)}`;

export const mapSeedTasksForUser = (tasks: Task[], userId: string, userName: string): Task[] =>
  tasks.map(task => ({
    ...task,
    ownerId: task.ownerId === SEED_CURRENT_USER ? userId : task.ownerId,
    ownerName: task.ownerId === SEED_CURRENT_USER ? userName : task.ownerName,
    workerId: task.workerId === SEED_CURRENT_USER ? userId : task.workerId,
    workerName: task.workerId === SEED_CURRENT_USER ? userName : task.workerName,
    timeline: task.timeline.map(event => ({
      ...event,
      actorName:
        event.actorName === 'You' && task.ownerId === SEED_CURRENT_USER
          ? userName
          : event.actorName,
    })),
  }));

// Backward-compatible exports used by dashboard until wired to store
export const NEARBY_TASKS = SEED_TASKS.filter(task => task.status === 'open' && task.distance);
export const MY_TASKS = SEED_TASKS.filter(task => task.ownerId === SEED_CURRENT_USER);
