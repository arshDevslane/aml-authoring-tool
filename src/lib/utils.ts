import { Question } from '@/models/entities/Question';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import CryptoJS from 'crypto-js';

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

export type CacheAPIResponse = {
  [key: string]: {
    result: string[];
    totalCount: number;
  };
};

export type QuestionOrderType = Pick<
  Question,
  | 'identifier'
  | 'description'
  | 'question_type'
  | 'taxonomy'
  | 'question_body'
  | 'x_id'
>;

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

export const calculateMD5 = (input: string) => CryptoJS.MD5(input).toString();
