// /app/scope/page.tsx

import Link from "next/link";
import PageShell from "@/components/PageShell";

import {
  SOLACE_SCOPE_FULL,
  SOLACE_TOOL_NOTICE,
} from "@/lib/solace/safety";

export default function ScopePage() {
  return (
    <PageShell>
      <div className="w-full px-6 pb-24 pt-28 sm:px-8">
        <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col">
          <div className="mx-auto w-full max-w-3xl">
            <div className="mb-10">
              <p className="mb-3 text-sm uppercase tracking-[0.24em] text-white/45">
                Scope
              </p>

              <h1 className="text-4xl font-light tracking-[-0.03em] text-white sm:text-5xl">
                Solace boundaries
              </h1>

              <p className="mt-4 max-w-2xl text-[15px] leading-7 text-white/65 sm:text-base">
                Solace is designed to offer calm reflective tools for adults. This
                page explains clearly what Solace is, what it is not, and where its
                boundaries begin and end.
              </p>
            </div>

            <section className="rounded-[28px] border border-white/12 bg-white/6 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-6">
              <div className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-4">
                <p className="text-sm leading-6 text-white/78">{SOLACE_TOOL_NOTICE}</p>
              </div>

              <div className="mt-8 grid gap-5">
                <div className="rounded-[24px] border border-white/10 bg-black/10 p-5">
                  <h2 className="text-lg font-medium text-white">What Solace is</h2>

                  <p className="mt-3 text-[15px] leading-7 text-white/72">
                    Solace is a reflective digital environment designed to help
                    adults slow down, reduce mental noise, and see thoughts and
                    decisions more clearly.
                  </p>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-black/10 p-5">
                  <h2 className="text-lg font-medium text-white">
                    Who Solace is for
                  </h2>

                  <p className="mt-3 text-[15px] leading-7 text-white/72">
                    Solace is intended only for adults aged 18 and over.
                  </p>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-black/10 p-5">
                  <h2 className="text-lg font-medium text-white">
                    What Solace is not
                  </h2>

                  <p className="mt-3 text-[15px] leading-7 text-white/72">
                    Solace does not provide medical, psychological, coaching, legal,
                    financial, or other professional advice.
                  </p>

                  <p className="mt-3 text-[15px] leading-7 text-white/72">
                    It is not a therapy service, crisis service, diagnostic service,
                    treatment platform, or substitute for qualified professional
                    support.
                  </p>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-black/10 p-5">
                  <h2 className="text-lg font-medium text-white">
                    Crisis and severe distress
                  </h2>

                  <p className="mt-3 text-[15px] leading-7 text-white/72">
                    Solace is not equipped for crisis support. If you are dealing
                    with severe distress, suicidal thoughts, self-harm, or an urgent
                    mental health crisis, Solace is not the right tool for that
                    moment.
                  </p>

                  <p className="mt-3 text-[15px] leading-7 text-white/72">
                    Please reach out to a trusted person or a qualified professional
                    who can support you right away.
                  </p>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-black/10 p-5">
                  <h2 className="text-lg font-medium text-white">
                    Core scope statement
                  </h2>

                  <div className="mt-3 space-y-3">
                    {SOLACE_SCOPE_FULL.map((line: string, index: number) => (
                      <p
                        key={`${line}-${index}`}
                        className="text-[15px] leading-7 text-white/72"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-white/10 pt-6">
                <Link
                  href="/tools"
                  className="inline-flex rounded-full border border-white/14 bg-white/10 px-5 py-3 text-sm text-white transition hover:bg-white/14"
                >
                  Back to tools
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
