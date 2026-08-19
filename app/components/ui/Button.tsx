import { cn } from "@/utils";
import { cva, type VariantProps } from "class-variance-authority";
import React, { type RefObject } from 'react';



const buttonVariants = cva(
  // Base styles applied to ALL buttons (Layout, Typography, Focus ring, Disabled behavior)
  "inline-flex items-center justify-center font-medium transition-colors cursor-pointer select-none whitespace-nowrap rounded-md text-sm px-4 py-2.5 focus:outline-2 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
    "disabled:pointer-events-none disabled:bg-background-disabled disabled:text-content-muted",
  {
    variants: {
      intent: {
        primary: ["bg-brand-primary", "hover:bg-brand-primary-emphasize", "focus:bg-brand-primary-emphasize", "focus:outline-ring-brand-primary", "text-primary"],
        secondary: ["bg-primary", "border-border-primary", "shadow-button", "border-button"],
        tertiary: ["bg-brand-destructive", "hover:bg-brand-destructive-emphasize","focus:bg-brand-destructive-emphasize", "focus:outline-ring-brand-destructive", "text-primary"],
      },
      size: {
        small: "",
        regular: "",
        large: "",
      },
    },

    defaultVariants: {
      intent: "primary",
      size: "regular",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Optional prop to render as a different element if needed (e.g., Slot pattern) */
  ref?: RefObject<HTMLButtonElement>;
}

export const Button =({
  intent,
  size,
  className,
  ref,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(buttonVariants({ intent, size }), className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
};
