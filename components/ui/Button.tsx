"use client";

import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
};

export default function Button({
  children,
  onClick,
  disabled = false,
  variant = "primary",
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50";

  const variantClasses =
    variant === "primary"
      ? "border border-neutral-300 bg-white/90 text-neutral-900 shadow-sm hover:border-neutral-400 hover:bg-white"
      : "border border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-300 hover:bg-white";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses}`}
    >
      {children}
    </button>
  );
}