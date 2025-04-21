import { Slot } from "@radix-ui/react-slot";
import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const buttonVariants = tv({
  base: "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-base",

  variants: {
    variant: {
      primary:
        "bg-blue-base text-gray-scale-0 hover:bg-blue-dark disabled:bg-blue-base/50",
      secondary:
        "bg-gray-scale-200 text-gray-scale-600 border border-gray-scale-300 hover:border-blue-base disabled:text-gray-scale-400 disabled:bg-gray-scale-200 disabled:border-gray-scale-300",
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-8 px-3 text-sm",
      icon: "h-10 w-10 p-2",
      "icon-sm": "h-8 w-8 p-1.5",
    },
    withIcon: {
      true: "inline-flex items-center gap-2",
    },
  },

  defaultVariants: {
    variant: "primary",
    size: "default",
  },
});

type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
  };

export function Button({
  variant,
  size,
  className,
  asChild,
  leftIcon,
  rightIcon,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : "button";
  const withIcon = !!(leftIcon || rightIcon);

  return (
    <Component
      className={buttonVariants({ variant, size, withIcon, className })}
      disabled={disabled}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </Component>
  );
}
