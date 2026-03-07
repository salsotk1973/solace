import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  background?: string;
};

export default function SolaceButton({
  variant = "primary",
  background,
  style,
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={`solace-button ${variant === "secondary" ? "solace-button--secondary" : ""}`.trim()}
      style={{
        ...(background && variant === "primary" ? { background } : {}),
        ...style,
      }}
    />
  );
}