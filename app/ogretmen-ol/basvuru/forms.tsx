"use client";

import { useActionState, useState } from "react";

import { saveDemo, saveDocuments, signAgreement, submitApplication, type StepState } from "@/app/ogretmen-ol/basvuru/actions";
import { SEGMENTS, TEACHER_BRANCHES } from "@/lib/teacher";

const field =
  "h-12 w-full rounded-lg border border-border bg-background px-4 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";
const area =
  "w-full rounded-lg border border-border bg-background px-4 py-3 text-base leading-relaxed outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";
const check = "mt-1 size-5 shrink-0 accent-primary";
const submitCls =
  "self-start rounded-md bg-primary px-6 py-4 text-[17px] font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-60";

function ErrorLine({ state }: { state: StepState }) {
  return state && !state.ok ? (
    <p className="m-0 rounded-md bg-[#fdecea] px-4 py-3 text-[15px] text-destructive" role="alert">
      {state.error}
    </p>
  ) : null;
}

const GRADES = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export function ApplicationForm() {
  const [state, action, pending] = useActionState(submitApplication, null);
  const [picked, setPicked] = useState<string[]>([]);
  const levels = ["İlkokul", "Ortaokul", "Ortaokul–Lise", "Lise"] as const;

  return (
    <form action={action} className="flex flex-col gap-7">
      <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
        <legend className="mb-1 text-lg font-semibold">Hangi derslerde ders vereceksin? (en fazla 4)</legend>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
          {levels.map((lv) => (
            <div key={lv} className="flex flex-col gap-2">
              <span className="text-sm font-semibold uppercase tracking-[0.06em] text-muted">{lv}</span>
              {TEACHER_BRANCHES.filter((b) => b.level === lv).map((b) => {
                const on = picked.includes(b.code);
                return (
                  <label key={b.code} className="flex items-start gap-2.5 text-[16px]">
                    <input
                      type="checkbox"
                      name="subjects"
                      value={b.code}
                      className={check}
                      checked={on}
                      disabled={!on && picked.length >= 4}
                      onChange={(e) => setPicked(e.target.checked ? [...picked, b.code] : picked.filter((x) => x !== b.code))}
                    />
                    <span>{b.name}</span>
                  </label>
                );
              })}
            </div>
          ))}
        </div>
        <p className="m-0 text-sm text-muted">İlk seçtiğin ders ana branşın sayılır; branş testi ondan başlar.</p>
      </fieldset>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
        <label className="flex flex-col gap-1.5">
          <span className="text-[15px] font-medium">En küçük sınıf</span>
          <select name="grades_min" defaultValue={5} className={field}>
            {GRADES.map((g) => (
              <option key={g} value={g}>
                {g}. sınıf
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[15px] font-medium">En büyük sınıf</span>
          <select name="grades_max" defaultValue={8} className={field}>
            {GRADES.map((g) => (
              <option key={g} value={g}>
                {g}. sınıf
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[15px] font-medium">Öğretmenlik deneyimi (yıl)</span>
          <input name="experience_years" type="number" min={0} max={60} inputMode="numeric" className={field} />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-[15px] font-medium">Durumun</span>
        <select name="segment" defaultValue="" required className={field}>
          <option value="" disabled>
            Seç…
          </option>
          {SEGMENTS.map((s) => (
            <option key={s.code} value={s.code}>
              {s.label}
            </option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
        <label className="flex flex-col gap-1.5">
          <span className="text-[15px] font-medium">Üniversite</span>
          <input name="university" maxLength={120} className={field} autoComplete="organization" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[15px] font-medium">Bölüm</span>
          <input name="department" maxLength={120} className={field} placeholder="ör. İlköğretim Matematik Öğretmenliği" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[15px] font-medium">Mezuniyet yılı</span>
          <input name="graduation_year" type="number" min={1960} max={2035} inputMode="numeric" className={field} />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-[15px] font-medium">Kendini velilere anlat</span>
        <textarea
          name="bio"
          rows={5}
          maxLength={1200}
          required
          className={area}
          placeholder="Kaç yıldır, hangi sınıflara ders veriyorsun? Öğrenciyle nasıl çalışırsın? Bu metin onaylanırsan profilinde görünür."
        />
      </label>

      <label className="flex items-start gap-3 text-[16px] leading-relaxed">
        <input type="checkbox" name="not_civil_servant" required className={check} />
        <span>
          Kadrolu devlet memuru değilim (657 sayılı Kanun md. 28). Ücretli öğretmen, sözleşmeli personel ya da özel sektör
          çalışanıysam durumumu doğru seçtim.
        </span>
      </label>

      <ErrorLine state={state} />
      <button type="submit" disabled={pending} className={submitCls}>
        {pending ? "Gönderiliyor…" : "Başvuruyu gönder ve branş testine geç"}
      </button>
    </form>
  );
}

export function DemoForm({ availability, video }: { availability: string; video: string }) {
  const [state, action, pending] = useActionState(saveDemo, null);
  return (
    <form action={action} className="flex flex-col gap-5">
      <label className="flex flex-col gap-1.5">
        <span className="text-[15px] font-medium">Demo ders için uygun olduğun gün ve saatler</span>
        <textarea
          name="demo_availability"
          rows={3}
          maxLength={400}
          required
          defaultValue={availability}
          className={area}
          placeholder="ör. Salı ve Perşembe 18:00–21:00, Cumartesi 10:00–14:00"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-[15px] font-medium">Tanıtım videon (isteğe bağlı)</span>
        <input name="intro_video_url" defaultValue={video} inputMode="url" className={field} placeholder="https://… (YouTube liste dışı, Drive vb.)" />
        <span className="text-sm text-muted">1–2 dakikalık, kendini ve ders anlatımını tanıttığın bir video. Onaylanırsan profilinde görünür.</span>
      </label>
      <ErrorLine state={state} />
      <button type="submit" disabled={pending} className={submitCls}>
        {pending ? "Kaydediliyor…" : availability ? "Güncelle" : "Kaydet"}
      </button>
    </form>
  );
}

export function DocumentsForm() {
  const [state, action, pending] = useActionState(saveDocuments, null);
  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5">
        <label className="flex flex-col gap-1.5">
          <span className="text-[15px] font-medium">Mezun belgesi barkod numarası</span>
          <input name="diploma_barcode" required maxLength={40} className={field} autoComplete="off" />
          <span className="text-sm text-muted">e-Devlet → Yükseköğretim Mezun Belgesi Sorgulama</span>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[15px] font-medium">Adli sicil kaydı barkod numarası</span>
          <input name="criminal_record_barcode" required maxLength={40} className={field} autoComplete="off" />
          <span className="text-sm text-muted">e-Devlet → Adli Sicil Kaydı (son 30 gün içinde alınmış)</span>
        </label>
      </div>
      <label className="flex items-start gap-3 text-[16px] leading-relaxed">
        <input type="checkbox" name="criminal_record_consent" required className={check} />
        <span>
          Çocuklarla çalışacağım için adli sicil kaydımın barkodla doğrulanmasına açık rıza veriyorum. Belge kopyası
          saklanmadığını, barkodların doğrulamadan sonra silindiğini ve kaydın her yıl yenileneceğini biliyorum.
        </span>
      </label>
      <ErrorLine state={state} />
      <button type="submit" disabled={pending} className={submitCls}>
        {pending ? "Gönderiliyor…" : "Doğrulamaya gönder"}
      </button>
    </form>
  );
}

export function AgreementForm() {
  const [state, action, pending] = useActionState(signAgreement, null);
  return (
    <form action={action} className="flex flex-col gap-5">
      <fieldset className="m-0 flex flex-col gap-2.5 border-0 p-0">
        <legend className="mb-1 text-[15px] font-medium">Vergi durumun</legend>
        {[
          ["bireysel", "Bireysel (vergi mükellefi değilim)"],
          ["serbest_meslek", "Serbest meslek makbuzu kesiyorum"],
          ["sirket", "Şirketim / şahıs işletmem var"],
        ].map(([v, l]) => (
          <label key={v} className="flex items-center gap-3 text-[16px]">
            <input type="radio" name="tax_status" value={v} required className="size-5 accent-primary" />
            {l}
          </label>
        ))}
      </fieldset>
      <div className="flex flex-col gap-3.5 rounded-[10px] border border-border bg-[#f6f8f7] p-5 text-[16px] leading-relaxed">
        <label className="flex items-start gap-3">
          <input type="checkbox" name="independent_contractor" required className={check} />
          <span>
            Platformda <strong>bağımsız hizmet sağlayıcı</strong> olarak çalışıyorum; işçi–işveren ilişkisi yoktur. Ders
            saatlerimi kendim belirlerim ve önerilen öğrenciyi kabul ya da reddetme hakkım vardır. Gelirimin vergisel
            yükümlülüğü bana aittir.
          </span>
        </label>
        <label className="flex items-start gap-3">
          <input type="checkbox" name="submerchant_consent" required className={check} />
          <span>
            Ödemelerimin lisanslı ödeme kuruluşu üzerinden alınması için adıma <strong>bireysel alt hesap</strong> açılmasını
            kabul ediyorum. Kimlik numaram ve IBAN&apos;ım doğrudan ödeme kuruluşuna iletilir, ÖzelDersBul&apos;da saklanmaz.
          </span>
        </label>
        <label className="flex items-start gap-3">
          <input type="checkbox" name="contract" required className={check} />
          <span>
            Öğretmen hizmet sözleşmesini (sürüm 2026-10) okudum ve kabul ediyorum: komisyon bantları, ders başı taban
            ücret, 72 saatlik itiraz süresi, haftalık ödeme, haksız alınan ücretin sonraki ödemelerden mahsubu ve öğrenciyle
            platform dışında ücretli ders yapmama.
          </span>
        </label>
      </div>
      <ErrorLine state={state} />
      <button type="submit" disabled={pending} className={submitCls}>
        {pending ? "Gönderiliyor…" : "Onayla ve gönder"}
      </button>
    </form>
  );
}
