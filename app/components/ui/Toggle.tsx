import React from 'react';
import {cn} from '@/utils';

interface ToggleProps {
    checked: boolean;
    onChange?: (checked: boolean) => void;
    className?: string
    disabled?: boolean;
    "aria-label"?: string;
}

const Toggle = ({ checked, className, onChange, disabled = false, "aria-label": ariaLabel }: ToggleProps) => {
  return (
    <label
      className={cn(`inline-flex items-center gap-3 select-none ${
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      } ${className}`)}
    >
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel}
      />
      {/* 
        The 'peer' class on the input above allows this div to react to the input's states.
        We use 'after:' utilities to create the sliding thumb without needing an extra nested <span>.
      */}
      <div 
        className="relative w-11 h-6 bg-gray-300 rounded-full transition-colors duration-300
                   peer-checked:bg-blue-500 
                   peer-focus-visible:ring-2 peer-focus-visible:ring-blue-600 peer-focus-visible:ring-offset-2
                   dark:bg-gray-600 dark:peer-focus-visible:ring-offset-gray-900
                   after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                   after:bg-white after:rounded-full after:h-5 after:w-5 after:shadow-md 
                   after:transition-transform peer-checked:after:translate-x-full"
      ></div>
    </label>
  );
};

export default Toggle;