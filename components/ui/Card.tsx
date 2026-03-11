import React from "react";

type CardProps = {
  children: React.ReactNode;
};

export default function Card({ children }: CardProps) {
  return (
    <div
      className="
        w-full
        rounded-[28px]
        border
        border-neutral-200/80
        bg-white/90
        p-7
        shadow-[0_8px_30px_rgba(0,0,0,0.04)]
        backdrop-blur-sm
      "
    >
      {children}
    </div>
  );
}