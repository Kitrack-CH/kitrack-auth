"use client";

import clsx from "clsx";
import * as React from "react";

type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "subtle"
  | "danger"
  | "badgeSelect"
  | "toggle"
  | "switch";
type Size = "sm" | "md" | "lg" | "icon";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  asChild?: boolean;
  active?: boolean;
  toggleColor?: "blue" | "dark";
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export default function Button({
  variant = "primary",
  size = "md",
  className,
  loading = false,
  asChild = false,
  children,
  disabled,
  type = "button",
  active = false,
  toggleColor = "blue",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const base =
    "appearance-none select-none inline-flex items-center justify-center gap-2 " +
    "rounded-[var(--radius-card)] font-medium " +
    "transition-all duration-150 ease-out " +
    "focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] " +
    "focus:ring-offset-[var(--focus-ring-offset)] " +
    "disabled:opacity-70 disabled:cursor-not-allowed";

  const sizes: Record<Size, string> = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4",
    lg: "h-11 px-5 text-base",
    icon: "h-9 w-9",
  };

  const variants: Record<Exclude<Variant, "switch">, string> = {
    primary:
      "bg-[var(--color-kitrack-blue)] text-white border border-[var(--color-kitrack-blue)] hover:brightness-95 active:translate-y-px",
    secondary:
      "bg-[var(--surface-1)] text-[var(--text-primary)] border border-[var(--border-default)] hover:bg-[var(--surface-2)] active:translate-y-px",
    ghost:
      "bg-transparent text-[var(--text-primary)] border border-transparent hover:bg-[var(--surface-2)] active:translate-y-px",
    outline:
      "bg-transparent text-[var(--text-primary)] border border-[var(--border-default)] hover:bg-[var(--surface-2)] active:translate-y-px",
    subtle:
      "bg-[var(--surface-2)] text-[var(--text-primary)] border border-transparent hover:brightness-95 active:translate-y-px",
    danger:
      "bg-[var(--color-kitrack-orangeLight)]/20 text-[var(--color-kitrack-orangeDark)] border border-[var(--color-kitrack-orange)] hover:brightness-95 active:translate-y-px",
    badgeSelect:
      "rounded-full bg-[var(--color-kitrack-blueLight)]/20 text-[var(--color-kitrack-blue)] border border-[var(--color-kitrack-blue)] hover:brightness-95 active:translate-y-px",
    toggle: clsx(
      "border transition-all duration-150 active:translate-y-px",
      active
        ? toggleColor === "dark"
          ? "bg-[var(--color-kitrack-blueDark)] text-white border-[var(--color-kitrack-blueDark)]"
          : "bg-[var(--color-kitrack-blue)] text-white border-[var(--color-kitrack-blue)]"
        : "bg-[var(--surface-1)] text-[var(--text-primary)] border border-[var(--border-default)] hover:bg-[var(--surface-2)]"
    ),
  };

  if (variant === "switch") {
    return (
      <button
        type="button"
        {...props}
        disabled={isDisabled}
        onClick={() => props.onCheckedChange?.(!props.checked)}
        aria-checked={props.checked}
        role="switch"
        className={clsx(
          "relative inline-flex h-5 w-12 items-center rounded-full transition-colors duration-300 ease-out",
          "focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-[var(--focus-ring-offset)]",
          props.checked
            ? "bg-[var(--color-kitrack-blue)] hover:brightness-95"
            : "bg-[var(--surface-2)] hover:brightness-95",
          className
        )}
      >
        <span
          className={clsx(
            "inline-block h-6 w-6 transform rounded-full bg-[var(--surface-0)] shadow-md transition-transform duration-300 ease-out",
            props.checked ? "translate-x-5" : "translate-x-1"
          )}
        />
      </button>
    );
  }

  const classes = clsx(
    base,
    sizes[size],
    variants[variant as Exclude<Variant, "switch">],
    { "pointer-events-none": isDisabled },
    className
  );

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{ className?: string } & Record<string, unknown>>;
    return React.cloneElement(child, {
      className: clsx(classes, (child.props as { className?: string }).className),
      "aria-busy": loading || undefined,
      "aria-disabled": isDisabled || undefined,
      ...(props as Record<string, unknown>),
    });
  }

  return (
    <button
      type={type}
      {...props}
      className={classes}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      aria-pressed={variant === "toggle" ? active : undefined}
    >
      {loading ? <span className="inline-block animate-pulse">…</span> : null}
      {children}
    </button>
  );
}
