export default function ToolIntro({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-12 max-w-2xl">
      <h1 className="mb-4 text-4xl font-semibold tracking-tight text-neutral-900 md:text-5xl">
        {title}
      </h1>

      <p className="text-lg leading-8 text-neutral-600">
        {subtitle}
      </p>
    </div>
  );
}