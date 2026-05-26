export default function DeveloperPage() {
  return (
    <section className="grid gap-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Developer Mode
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Test what users will see by pasting ABI fragments and calldata, then
          reviewing generated risk recommendations.
        </p>
      </header>

      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-700">
          This folder is wired for developer tooling. Next step is to connect a
          custom ABI parser and extend the risk engine with project-specific
          rules.
        </p>
      </article>
    </section>
  );
}

