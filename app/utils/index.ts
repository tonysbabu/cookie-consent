import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...classes: ClassValue[]) => twMerge(clsx(classes));

export const loadScript = (src: string) => {
  const script = document.createElement('script');
  script.src = src;
  document.head.appendChild(script);
}