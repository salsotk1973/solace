"use client";

import { useState } from "react";

type ComposerProps = {
  onSubmit: (input: string) => Promise<void> | void;
  disabled?: boolean;
};

export default function Composer({ onSubmit, disabled }: ComposerProps) {
  const [value, setValue] = useState("");

  async function handleSubmit() {
    if (!value.trim() || disabled) return;

    const input = value.trim();
    setValue("");

    await onSubmit(input);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="space-y-3">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Write what’s on your mind…"
        disabled={disabled}
        className="w-full rounded-xl border border-white/20 bg-white/5 p-4 text-white placeholder-white/40 outline-none"
        rows={3}
      />

      <button
        onClick={handleSubmit}
        disabled={disabled}
        className="rounded-xl bg-white/10 px-4 py-2 text-white hover:bg-white/20 disabled:opacity-40"
      >
        Reflect
      </button>
    </div>
  );
}