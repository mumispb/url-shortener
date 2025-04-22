import { Warning } from "@phosphor-icons/react";
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
  base: "flex-grow w-full bg-white rounded-lg border border-gray-scale-300 p-4 text-gray-scale-500 focus:outline-none transition-colors",
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
  base: "block mb-2 text-sm font-medium",
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
          <div className="flex items-center mt-1 text-error text-sm gap-1">
            <Warning size={16} />
            {error}
          </div>
        )}
      </div>
    );
  }
);
