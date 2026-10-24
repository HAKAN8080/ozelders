import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col bg-background px-4 py-10 text-foreground sm:px-6">
      <div className="flex w-full max-w-xl flex-col gap-6">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Özel Ders
        </h1>
        <p className="text-lg leading-relaxed text-muted">
          Veli hesabı, öğretmen başvurusu ve ders yönetimi bu uygulama
          üzerinden yürür.
        </p>
        <Button type="button" className="w-full sm:w-fit">
          Ücretsiz Tanı Sınavı
        </Button>
      </div>
    </main>
  );
}
