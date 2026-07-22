import * as React from "react";

import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

export const inputVariants = cva(
  "flex w-full rounded-lg transition-colors backdrop-blur-sm duration-200 ease-out bg-primary/20 shadow-sm border border-white/20 text-white text-sm placeholder:text-white/60 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-neutral-500 disabled:cursor-not-allowed disabled:opacity-50 px-3 py-2",
);

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input"> & { asChild?: boolean }>(
  ({ className, type, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "input";
    return (
      <Comp
        type={type}
        className={cn(inputVariants(), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
