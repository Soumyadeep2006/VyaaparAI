import type { InputHTMLAttributes } from "react";
import clsx from "clsx";

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {}

export default function Input({
  className,
  ...props
}: InputProps) {
  return (
    <input
      {...props}
      className={clsx(
        "w-full rounded-xl border border-border bg-surface px-4 py-3 outline-none transition focus:border-primary",
        className
      )}
    />
  );
}