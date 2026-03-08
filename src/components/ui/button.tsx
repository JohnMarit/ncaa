import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/92 shadow-card hover:shadow-elevated",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border-2 border-brand-primary-500 bg-transparent text-brand-primary-700 hover:bg-brand-primary-50 hover:text-brand-primary-800",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/85 shadow-card",
        ghost: "hover:bg-muted hover:text-foreground",
        link: "text-brand-secondary-600 underline-offset-4 hover:underline",
        hero:
          "bg-gradient-hero !text-primary-foreground shadow-elevated ring-1 ring-white/20 hover:brightness-[1.08] hover:shadow-[0_28px_70px_-30px_rgba(122,86,156,0.85)] hover:-translate-y-0.5 hover:!text-primary-foreground focus-visible:ring-2 focus-visible:ring-white/70 font-bold",
        heroOutline:
          "border-2 border-white/55 bg-white/10 !text-white backdrop-blur-md shadow-soft/50 hover:bg-white/18 hover:border-white/75 hover:shadow-[0_18px_55px_-30px_rgba(255,255,255,0.55)] hover:-translate-y-0.5 hover:!text-white focus-visible:ring-2 focus-visible:ring-white/70",
        accent:
          "bg-brand-feminine-400 text-brand-feminine-foreground hover:bg-brand-feminine-500 shadow-soft hover:shadow-elevated",
        muted: "bg-muted text-muted-foreground hover:bg-muted/80",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-13 rounded-xl px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
