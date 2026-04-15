import type { CSSProperties, ReactNode } from "react";
import ShellParticles from "@/components/ShellParticles";

type PageShellProps = {
  children: ReactNode;
  particles?: boolean;
  contentContainer?: boolean;
  contentClassName?: string;
  contentStyle?: CSSProperties;
  className?: string;
  style?: CSSProperties;
};

export default function PageShell({
  children,
  particles = false,
  contentContainer = true,
  contentClassName,
  contentStyle,
  className,
  style,
}: PageShellProps) {
  return (
    <main
      className={className}
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#090d14",
        color: "white",
        position: "relative",
        isolation: "isolate",
        ...style,
      }}
    >
      {particles ? <ShellParticles /> : null}

      <div
        className={contentClassName}
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: contentContainer ? "1440px" : undefined,
          margin: contentContainer ? "0 auto" : undefined,
          ...contentStyle,
        }}
      >
        {children}
      </div>
    </main>
  );
}
