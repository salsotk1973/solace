import { FormHTMLAttributes, ReactNode } from "react";

type AIToolInputSectionProps = {
  beforeFields?: ReactNode;
  prompt: ReactNode;
  trustLine: ReactNode;
  input: ReactNode;
  primaryAction?: ReactNode;
  showPrimaryAction?: boolean;
  formOffsetTop: number;
} & Omit<FormHTMLAttributes<HTMLFormElement>, "children">;

const formBaseStyle = {
  width: "100%",
  maxWidth: "760px",
} as const;

const inputShellStyle = {
  width: "100%",
  maxWidth: "760px",
  margin: "0 auto",
} as const;

const initialActionsStyle = {
  display: "flex",
  gap: "14px",
  justifyContent: "center",
  flexWrap: "wrap" as const,
  marginTop: "18px",
} as const;

export default function AIToolInputSection({
  beforeFields,
  prompt,
  trustLine,
  input,
  primaryAction,
  showPrimaryAction = true,
  formOffsetTop,
  style,
  ...formProps
}: AIToolInputSectionProps) {
  return (
    <form
      {...formProps}
      style={{
        ...formBaseStyle,
        marginTop: `${formOffsetTop}px`,
        ...style,
      }}
    >
      {beforeFields}
      {prompt}
      {trustLine}

      <div style={inputShellStyle}>{input}</div>

      {showPrimaryAction && primaryAction ? <div style={initialActionsStyle}>{primaryAction}</div> : null}
    </form>
  );
}
