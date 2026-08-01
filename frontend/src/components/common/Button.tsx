import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export default function Button({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        "flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-medium transition-all duration-200",

        variant === "primary"
          ? "bg-primary text-white hover:bg-primary-dark"
          : "border border-border bg-surface text-text-primary hover:bg-surface-2",

        className
      )}
    >
      {children}
    </button>
  );
}