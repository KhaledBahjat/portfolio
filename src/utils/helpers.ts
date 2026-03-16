import { format, formatDistanceToNow } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

export const formatDate = (date: Date | string | Timestamp | undefined): string => {
  if (!date) return '';
  if (date instanceof Timestamp) return format(date.toDate(), 'MMM d, yyyy');
  return format(new Date(date), 'MMM d, yyyy');
};

export const formatRelative = (date: Date | string | Timestamp | undefined): string => {
  if (!date) return '';
  if (date instanceof Timestamp) return formatDistanceToNow(date.toDate(), { addSuffix: true });
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const slugify = (str: string): string =>
  str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

export const truncate = (str: string, length = 100): string =>
  str.length > length ? str.slice(0, length) + '...' : str;

export const getInitials = (name: string): string =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
