import type { ReactNode } from "react"
import Container from "./Container"

type ToolShellProps = {
  title: string
  subtitle: string
  children: ReactNode
}

export default function ToolShell({
  title,
  subtitle,
  children,
}: ToolShellProps) {
  return (
    <main className="min-h-screen text-[#2b2621]">
      <section className="border-b border-black/10 pb-10 pt-16">
        <Container>
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex rounded-full border border-[#d9c4af] bg-[rgba(255,255,255,0.58)] px-4 py-2 text-sm text-black/55 backdrop-blur">
              Calm digital tools for clearer thinking
            </div>

            <h1 className="text-5xl font-semibold tracking-[-0.04em] text-[#2b2621]">
              {title}
            </h1>

            <p className="mt-5 max-w-2xl text-xl leading-relaxed text-black/65">
              {subtitle}
            </p>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="rounded-[32px] border border-[#ddcbbc] bg-[rgba(255,255,255,0.62)] p-8 shadow-[0_24px_60px_rgba(125,88,58,0.10)] backdrop-blur-xl">
            {children}
          </div>
        </Container>
      </section>

      <footer className="border-t border-black/10 py-10">
        <Container>
          <p className="text-sm text-black/50">Built for calm clarity.</p>
        </Container>
      </footer>
    </main>
  )
}