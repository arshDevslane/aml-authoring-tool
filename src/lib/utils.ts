import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isValueEmpty = (value: any) => {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return Object.keys(value)?.length === 0;
  }

  return Array.isArray(value)
    ? value?.length === 0
    : value === null || value === undefined || value === '';
};
