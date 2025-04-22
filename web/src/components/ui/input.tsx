import {
  type InputHTMLAttributes,
  type ReactNode,
  forwardRef,
  useState,
  useLayoutEffect,
  useRef,
} from "react";
import { tv } from "tailwind-variants";

const inputVariants = tv({
  base: "flex-grow w-full bg-white rounded-lg border border-gray-scale-300 px-3 py-2 text-gray-scale-500 focus:outline-none transition-colors",
  variants: {
    state: {
      default: "border-gray-scale-300",
      active: "border-blue-base",
      error: "border-error",
    },
  },
  defaultVariants: {
    state: "default",
  },
});

const labelVariants = tv({
  base: "block mb-1 text-sm font-medium",
  variants: {
    state: {
      default: "text-gray-scale-600",
      active: "text-blue-base",
      error: "text-error",
    },
  },
  defaultVariants: {
    state: "default",
  },
});

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  state?: "default" | "active" | "error";
  className?: string;
  labelClassName?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  prefix?: string;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  fullWidth?: boolean;
  id?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      state = "default",
      className,
      labelClassName,
      error,
      icon,
      iconPosition = "right",
      fullWidth = true,
      id,
      prefix,
      ...props
    },
    ref
  ) => {
    const inputClasses = inputVariants({ state, className });
    const labelClasses = labelVariants({ state, className: labelClassName });
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const prefixRef = useRef<HTMLSpanElement>(null);
    const [prefixWidth, setPrefixWidth] = useState(0);

    useLayoutEffect(() => {
      if (prefixRef.current) {
        setPrefixWidth(prefixRef.current.getBoundingClientRect().width);
      }
    }, [prefix]);

    // Dynamic left padding when we have icon or prefix. We favour prefix because in this
    // UI we won't render prefix and icon simultaneously on the left.
    const hasLeftAdornment = !!prefix || (icon && iconPosition === "left");
    const leftPaddingClass = icon && iconPosition === "left" ? "pl-9" : "";
    const rightPaddingClass = icon && iconPosition === "right" ? "pr-9" : "";
    const inputStyle = prefix ? { paddingLeft: prefixWidth + 12 } : undefined;

    return (
      <div className={fullWidth ? "w-full" : ""}>
        {label && (
          <label htmlFor={inputId} className={labelClasses}>
            {label}
          </label>
        )}
        <div className="relative">
          {prefix && (
            <span
              ref={prefixRef}
              className="absolute left-3 top-1/2 -translate-y-1/2 select-none text-gray-scale-400"
            >
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`${inputClasses} ${leftPaddingClass} ${rightPaddingClass}`}
            style={inputStyle}
            {...props}
          />
          {icon && (
            <div
              className={`absolute top-1/2 -translate-y-1/2 text-gray-scale-500 ${
                iconPosition === "left" ? "left-3" : "right-3"
              }`}
            >
              {icon}
            </div>
          )}
        </div>
        {error && state === "error" && (
          <div className="flex items-center mt-1 text-error text-sm">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <title>Error Icon</title>
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}
      </div>
    );
  }
);
