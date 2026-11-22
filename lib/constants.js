export const CATEGORIES = [
  'Smartphone',
  'Laptop & PC',
  'AC',
  'Refrigerator',
  'TV',
  'Washing Machine',
  'Electrical',
];

export const SERVICE_MODES = ['Home Visit', 'Shop Drop-off'];

export const BOOKING_STATUSES = [
  'requested',
  'accepted',
  'rejected',
  'in-progress',
  'completed',
  'cancelled',
];

export const TECHNICIAN_STATUSES = ['requested', 'accepted', 'in-progress', 'completed'];

export const ACTIVE_STATUSES = ['requested', 'accepted', 'in-progress'];

export const PAYMENT_STATUSES = ['unpaid', 'paid'];

export const ROLES = ['customer', 'technician', 'admin'];

export const APPROVAL_STATUSES = ['pending', 'approved', 'rejected'];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

export const STATUS_STYLES = {
  requested: 'bg-primary/10 text-primary border border-primary/20',
  accepted: 'bg-primary/10 text-primary border border-primary/20',
  'in-progress': 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 dark:border dark:border-amber-900/30 border-amber-100',
  completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border dark:border-emerald-900/30 border-emerald-100',
  rejected: 'bg-rose-100 text-rose-800 dark:bg-rose-900/20 dark:text-rose-300 dark:border dark:border-rose-900/30 border-rose-100',
  cancelled: 'bg-muted text-muted-foreground border border-border',
  unpaid: 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 dark:border dark:border-amber-900/30 border-amber-100',
  paid: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border dark:border-emerald-900/30 border-emerald-100',
};

export const STATUS_LABELS = {
  requested: 'Requested',
  accepted: 'Accepted',
  rejected: 'Rejected',
  'in-progress': 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const PAYMENT_STATUS_LABELS = {
  unpaid: 'Unpaid',
  paid: 'Paid',
};

export const APPROVAL_STATUS_LABELS = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
};

export const DEFAULT_AVATAR_COLORS = [
  'bg-teal-600',
  'bg-amber-500',
  'bg-indigo-600',
  'bg-rose-500',
  'bg-emerald-600',
  'bg-violet-600',
];
