export const URGENCY_LEVELS = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

export const URGENCY_CONFIG = {
  critical: { label: 'Critical', color: '#ef4444', icon: '🔴', weight: 4 },
  high: { label: 'High', color: '#f97316', icon: '🟠', weight: 3 },
  medium: { label: 'Medium', color: '#eab308', icon: '🟡', weight: 2 },
  low: { label: 'Low', color: '#22c55e', icon: '🟢', weight: 1 },
};

export const SENTIMENT_LEVELS = {
  ANGRY: 'angry',
  FRUSTRATED: 'frustrated',
  NEUTRAL: 'neutral',
  POSITIVE: 'positive',
};

export const SENTIMENT_CONFIG = {
  angry: { label: 'Angry', emoji: '😠', color: '#ef4444' },
  frustrated: { label: 'Frustrated', emoji: '😤', color: '#f97316' },
  neutral: { label: 'Neutral', emoji: '😐', color: '#94a3b8' },
  positive: { label: 'Positive', emoji: '😊', color: '#22c55e' },
};

export const STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  ESCALATED: 'escalated',
};

export const STATUS_CONFIG = {
  open: { label: 'Open', color: '#3b82f6' },
  in_progress: { label: 'In Progress', color: '#a855f7' },
  resolved: { label: 'Resolved', color: '#22c55e' },
  escalated: { label: 'Escalated', color: '#ef4444' },
};

export const CATEGORIES = [
  'Billing',
  'Technical',
  'Account',
  'Feature Request',
  'Bug Report',
  'Security',
  'Performance',
  'Integration',
  'General',
];

export const AGENTS = [
  { id: 'a1', name: 'Yash Dhama(Big Teeth)', avatar: '👩‍💻', role: 'Senior Agent', tickets: 12 },
  { id: 'a2', name: 'Naman Bihari', avatar: '👨‍💼', role: 'Agent', tickets: 8 },
  { id: 'a3', name: 'Shivam Discharger', avatar: '👩‍🔧', role: 'Agent', tickets: 15 },
  { id: 'a4', name: 'Deepanshu No Brush', avatar: '🧑‍💻', role: 'Junior Agent', tickets: 6 },
  { id: 'a5', name: 'Mukut Kumar', avatar: '👩‍🏫', role: 'Team Lead', tickets: 5 },
];
