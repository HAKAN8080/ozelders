export default function Home() {
  return (
    <main className="flex flex-1 flex-col bg-background px-4 py-10 text-foreground sm:px-6">
      <section className="max-w-xl rounded-2xl border border-border bg-primary-soft px-5 py-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Özel Ders
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Veli hesabı, öğretmen başvurusu ve ders yönetimi bu uygulama
          üzerinden yürür.
        </p>
      </section>
    </main>
  );
}
