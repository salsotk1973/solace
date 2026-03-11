type PrincipleCard = {
  title: string;
  body: string;
};

const principles: PrincipleCard[] = [
  {
    title: "One question at a time",
    body: "Solace avoids noise by reducing each interaction to a single calm step. Less friction. Less overwhelm. More clarity.",
  },
  {
    title: "Atmosphere matters",
    body: "Digital environments affect emotional state. Solace uses gentle gradients, breathing room, and soft contrast to reduce tension.",
  },
  {
    title: "Reflection before results",
    body: "A moment of pause can change the way insight is received. Solace slows the mind before offering direction.",
  },
];

export default function PrinciplesPage() {
  return (
    <main className="solace-page-shell">
      <section className="space-y-5">
        <div className="solace-page-pill">Principles</div>

        <h1 className="solace-hero-title max-w-5xl">
          The design philosophy behind Solace.
        </h1>

        <p className="solace-body">
          Solace is built on calm interaction patterns that reduce mental
          friction and make digital tools feel more human.
        </p>
      </section>

      <section className="mt-12">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {principles.map((item) => (
            <div
              key={item.title}
              className="solace-surface-neutral min-h-[220px] p-8"
            >
              <div className="grid gap-5">
                <h2 className="text-[1.42rem] font-semibold leading-[1.08] tracking-[-0.035em] text-neutral-900">
                  {item.title}
                </h2>

                <p className="max-w-[34ch] text-[1rem] leading-8 text-neutral-600">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}