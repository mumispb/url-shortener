import { Slot } from "@radix-ui/react-slot";
import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const buttonVariants = tv({
  base: "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-base disabled:pointer-events-none",

  variants: {
    variant: {
      primary:
        "bg-blue-base text-gray-scale-0 text-md rounded px-4 py-4 hover:bg-blue-dark hover:border-blue-dark rounded-lg disabled:bg-blue-base disabled:opacity-50 disabled:cursor-not-allowed",
      secondary:
        "border border-transparent text-xs bg-gray-scale-200 text-gray-scale-600 rounded gap-2 px-4 py-2 hover:border-blue-base disabled:border-transparent disabled:bg-gray-scale-200",
      icon: "border border-transparent p-1.75 bg-gray-scale-200 text-gray-scale-600 rounded hover:border-blue-base disabled:border-transparent",
    },
  },

  defaultVariants: {
    variant: "primary",
  },
});

type ButtonProps = ComponentProps<"button"> &
  Omit<VariantProps<typeof buttonVariants>, "withIcon"> & {
    asChild?: boolean;
    leftIcon?: React.ReactNode;
  };

export function Button({
  variant,
  className,
  asChild,
  leftIcon,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : "button";

  const iconClass =
    variant === "secondary" && disabled ? "text-gray-scale-500" : "";

  const textClass =
    variant === "secondary" && disabled ? "text-gray-scale-400" : "";

  return (
    <Component
      className={buttonVariants({
        variant,
        className,
      })}
      disabled={disabled}
      {...props}
    >
      {leftIcon && <span className={iconClass}>{leftIcon}</span>}
      {variant !== "icon" && <span className={textClass}>{children}</span>}
    </Component>
  );
}
