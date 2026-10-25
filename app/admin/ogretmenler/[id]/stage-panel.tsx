"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  activateTeacher,
  approveTeacher,
  rejectApplication,
  scheduleDemo,
  scoreDemo,
  verifyDocuments,
  type AdminResult,
} from "@/app/admin/ogretmenler/actions";
import { DEMO_PASS, DEMO_RUBRIC, demoScore } from "@/lib/teacher";

const field =
  "h-11 w-full rounded-lg border border-border bg-background px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";
const btn = "rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-60";
const box = "flex flex-col gap-4 rounded-[10px] border border-border bg-background p-6";

type App = {
  id: string;
  stage: string;
  demo_availability: string | null;
  demo_scheduled_at: string | null;
  demo_meeting_url: string | null;
  diploma_barcode: string | null;
  criminal_record_barcode: string | null;
  criminal_record_consent_at: string | null;
  id_verified: boolean;
  diploma_verified: boolean;
  criminal_verified: boolean;
  contract_signed: boolean;
};

/** datetime-local değeri (İstanbul saati, UTC+3 sabit) */
function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(new Date(iso).getTime() + 3 * 3600000);
  return d.toISOString().slice(0, 16);
}

export function StagePanel({ app, displayDefault }: { app: App; displayDefault: string }) {
  const [msg, setMsg] = useState<AdminResult | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();
  const run = (fn: () => Promise<AdminResult>) => {
    setMsg(null);
    start(async () => {
      try {
        const res = await fn();
        setMsg(res);
        if (res.ok) router.refresh();
      } catch {
        setMsg({ ok: false, error: "İşlem yapılamadı. Sayfayı yenileyip yeniden dene." });
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {msg ? (
        <p
          role={msg.ok ? "status" : "alert"}
          className={`m-0 rounded-md px-4 py-3 text-[15px] ${msg.ok ? "bg-primary-soft text-primary" : "bg-[#fdecea] text-destructive"}`}
        >
          {msg.ok ? msg.message : msg.error}
        </p>
      ) : null}

      {app.stage === "test" ? (
        <section className={box}>
          <h2 className="m-0 text-lg font-semibold">Branş testi bekleniyor</h2>
          <p className="m-0 text-[15px] text-muted">
            Başvuran testi kendi sayfasından çözüp sonucunu işler; %85 ve üstü otomatik olarak demo aşamasına geçer. Branşı için
            yayında branş testi yoksa Sınavlar ekranından “Öğretmen branş testi” kullanımlı bir sınav yayınla.
          </p>
        </section>
      ) : null}

      {app.stage === "demo" ? <DemoPanel app={app} pending={pending} run={run} /> : null}
      {app.stage === "belge" ? <DocsPanel app={app} pending={pending} run={run} /> : null}

      {app.stage === "oryantasyon" ? (
        <ApprovePanel app={app} pending={pending} run={run} displayDefault={displayDefault} />
      ) : null}

      {app.stage === "golge" ? (
        <section className={box}>
          <h2 className="m-0 text-lg font-semibold">Gölge dönem</h2>
          <p className="m-0 text-[15px] text-muted">İlk 3 dersin kayıtları kıdemli öğretmenle incelendikten sonra aktif yap.</p>
          <button type="button" disabled={pending} onClick={() => run(() => activateTeacher(app.id))} className={`${btn} self-start`}>
            Aktif yap
          </button>
        </section>
      ) : null}

      {app.stage !== "golge" && app.stage !== "aktif" ? <RejectPanel id={app.id} pending={pending} run={run} /> : null}
    </div>
  );
}

type PanelProps = { app: App; pending: boolean; run: (fn: () => Promise<AdminResult>) => void };

function DemoPanel({ app, pending, run }: PanelProps) {
  const [at, setAt] = useState(toLocalInput(app.demo_scheduled_at));
  const [url, setUrl] = useState(app.demo_meeting_url ?? "");
  const [r, setR] = useState<Record<string, number>>({});
  const [idOk, setIdOk] = useState(app.id_verified);
  const [note, setNote] = useState("");
  const complete = DEMO_RUBRIC.every((c) => r[c.code]);
  const score = complete ? demoScore(r) : null;

  return (
    <>
      <section className={box}>
        <h2 className="m-0 text-lg font-semibold">1. Demo dersi planla</h2>
        <p className="m-0 text-[15px]">
          Başvuranın uygun saatleri: <strong>{app.demo_availability ?? "henüz girmedi"}</strong>
        </p>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-[15px] font-medium">Tarih ve saat (İstanbul)</span>
            <input type="datetime-local" value={at} onChange={(e) => setAt(e.target.value)} className={field} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[15px] font-medium">Görüşme bağlantısı</span>
            <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://meet.google.com/…" className={field} />
          </label>
        </div>
        <button
          type="button"
          disabled={pending || !at}
          onClick={() => run(() => scheduleDemo(app.id, `${at}:00+03:00`, url.trim()))}
          className={`${btn} self-start`}
        >
          {app.demo_scheduled_at ? "Saati güncelle" : "Planla"}
        </button>
      </section>

      <section className={box}>
        <h2 className="m-0 text-lg font-semibold">2. Demo dersi puanla</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-[15px]">
            <thead>
              <tr className="border-b border-border text-muted">
                <th className="py-2 pr-4 font-semibold">Ölçüt (ağırlık)</th>
                {[1, 2, 3, 4, 5].map((n) => (
                  <th key={n} className="w-12 py-2 text-center font-semibold">
                    {n}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DEMO_RUBRIC.map((c) => (
                <tr key={c.code} className="border-b border-[#eef2ef]">
                  <td className="py-2.5 pr-4">
                    {c.label} <span className="text-muted">({c.weight})</span>
                  </td>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <td key={n} className="text-center">
                      <input
                        type="radio"
                        name={`r-${c.code}`}
                        aria-label={`${c.label}: ${n}`}
                        checked={r[c.code] === n}
                        onChange={() => setR({ ...r, [c.code]: n })}
                        className="size-5 accent-primary"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <label className="flex flex-col gap-1.5">
          <span className="text-[15px] font-medium">Not (iç kullanım)</span>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} maxLength={600} className="rounded-lg border border-border p-3" />
        </label>
        <label className="flex items-center gap-3 text-[15px]">
          <input type="checkbox" checked={idOk} onChange={(e) => setIdOk(e.target.checked)} className="size-5 accent-primary" />
          Görüşmede kimliği görüntülü doğrulandı
        </label>
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-[17px]">
            Puan: <strong className="tabular-nums">{score ?? "—"}</strong> / 100 · baraj {DEMO_PASS}
            {score !== null ? (score >= DEMO_PASS ? " → belge aşamasına geçer" : " → başvuru sonuçlanır") : ""}
          </span>
          <button
            type="button"
            disabled={pending || !complete}
            onClick={() => run(() => scoreDemo(app.id, r, idOk, note))}
            className={btn}
          >
            Puanı kaydet
          </button>
        </div>
      </section>
    </>
  );
}

function DocsPanel({ app, pending, run }: PanelProps) {
  const [id, setId] = useState(app.id_verified);
  const [dip, setDip] = useState(app.diploma_verified);
  const [cr, setCr] = useState(app.criminal_verified);
  const [crDate, setCrDate] = useState("");
  if (!app.criminal_record_consent_at) {
    return (
      <section className={box}>
        <h2 className="m-0 text-lg font-semibold">Belge bekleniyor</h2>
        <p className="m-0 text-[15px] text-muted">Başvuran barkod numaralarını henüz girmedi.</p>
      </section>
    );
  }
  return (
    <section className={box}>
      <h2 className="m-0 text-lg font-semibold">Belgeleri doğrula</h2>
      <p className="m-0 text-[15px] text-muted">
        Barkodu e-Devlet&apos;in “Barkodlu Belge Doğrulama” hizmetinde sorgula; belgedeki ad soyadın başvuranla aynı olduğunu
        kontrol et. Üçü de tamamlanınca barkodlar silinir ve başvuru sözleşme aşamasına geçer.
      </p>
      <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 font-mono text-[15px]">
        <dt className="font-sans text-muted">Mezun belgesi</dt>
        <dd className="m-0">{app.diploma_barcode ?? "—"}</dd>
        <dt className="font-sans text-muted">Adli sicil</dt>
        <dd className="m-0">{app.criminal_record_barcode ?? "—"}</dd>
      </dl>
      <div className="flex flex-col gap-2.5 text-[15px]">
        <label className="flex items-center gap-3">
          <input type="checkbox" checked={id} disabled={app.id_verified} onChange={(e) => setId(e.target.checked)} className="size-5 accent-primary" />
          Kimlik doğrulandı (demo derste görüntülü)
        </label>
        <label className="flex items-center gap-3">
          <input type="checkbox" checked={dip} disabled={app.diploma_verified} onChange={(e) => setDip(e.target.checked)} className="size-5 accent-primary" />
          Mezun belgesi doğrulandı, branşla uyumlu
        </label>
        <label className="flex flex-wrap items-center gap-3">
          <input type="checkbox" checked={cr} disabled={app.criminal_verified} onChange={(e) => setCr(e.target.checked)} className="size-5 accent-primary" />
          Adli sicil kaydı doğrulandı, kayıt yok · belge tarihi
          <input
            type="date"
            value={crDate}
            onChange={(e) => setCrDate(e.target.value)}
            disabled={app.criminal_verified}
            className="h-10 rounded-md border border-border px-2"
          />
        </label>
      </div>
      <button
        type="button"
        disabled={pending}
        onClick={() => run(() => verifyDocuments(app.id, { id, diploma: dip, criminal: cr && !app.criminal_verified, criminalDate: crDate }))}
        className={`${btn} self-start`}
      >
        Kaydet
      </button>
    </section>
  );
}

function ApprovePanel({ app, pending, run, displayDefault }: PanelProps & { displayDefault: string }) {
  const [name, setName] = useState(displayDefault);
  return (
    <section className={box}>
      <h2 className="m-0 text-lg font-semibold">Onay</h2>
      {app.contract_signed ? (
        <>
          <p className="m-0 text-[15px] text-muted">
            Sözleşme ve beyanlar onaylandı. Onaylayınca öğretmen kaydı gölge dönemde, başlangıç bandında (%30) açılır; ödeme
            hesabı “bekliyor” durumunda oluşturulur.
          </p>
          <label className="flex max-w-[360px] flex-col gap-1.5">
            <span className="text-[15px] font-medium">Vitrin adı (velilerin göreceği)</span>
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} className={field} />
          </label>
          <button type="button" disabled={pending} onClick={() => run(() => approveTeacher(app.id, name))} className={`${btn} self-start`}>
            Öğretmeni onayla
          </button>
        </>
      ) : (
        <p className="m-0 text-[15px] text-muted">Başvuran sözleşmeyi ve beyanları henüz onaylamadı.</p>
      )}
    </section>
  );
}

function RejectPanel({ id, pending, run }: { id: string; pending: boolean; run: (fn: () => Promise<AdminResult>) => void }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  return (
    <section className="flex flex-col gap-3 rounded-[10px] border border-[#f1c9c4] bg-background p-6">
      {open ? (
        <>
          <label className="flex flex-col gap-1.5">
            <span className="text-[15px] font-medium">Başvurana gösterilecek gerekçe</span>
            <input value={reason} onChange={(e) => setReason(e.target.value)} maxLength={300} className={field} />
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              disabled={pending}
              onClick={() => run(() => rejectApplication(id, reason))}
              className="rounded-md bg-destructive px-5 py-3 font-semibold text-white disabled:opacity-60"
            >
              Başvuruyu sonuçlandır
            </button>
            <button type="button" onClick={() => setOpen(false)} className="rounded-md border border-border px-5 py-3 font-semibold">
              Vazgeç
            </button>
          </div>
        </>
      ) : (
        <button type="button" onClick={() => setOpen(true)} className="self-start font-semibold text-destructive hover:underline">
          Başvuruyu reddet…
        </button>
      )}
    </section>
  );
}
