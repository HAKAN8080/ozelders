"""Konu içeriği JSON'unu (scripts/icerik-semasi.md biçiminde) doğrular ve sayfalara dönüştürür.

Kullanım:
  python3 scripts/icerik_jsondan.py <icerik.json> --unite "3. Ünite" --alt "Doğal Sistemler ve Süreçler" --arka-plan kureler [--yaz]

--yaz verilmezse yalnız doğrular ve rapor verir.
Üretilenler:
  lib/games/icerik/<slug>.ts            (SEKMELER)
  app/oyunlar/<slug>/page.tsx           (sayfa)
  lib/games/icerik/uretilen.json        (katalog: konular.ts ve günün sorusu bunu okur; birleştirerek güncellenir)
"""
import json, os, re, sys, argparse

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TUR_HARF = re.compile(r"^[A-Za-zÇĞİÖŞÜçğıöşü]+$")


def slug(s):
    s = s.lower().replace("ı", "i").replace("ğ", "g").replace("ü", "u").replace("ş", "s").replace("ö", "o").replace("ç", "c")
    s = s.replace("İ".lower(), "i").replace("â", "a").replace("î", "i").replace("û", "u")
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


def dogrula(sayfa):
    h = []
    ids = set()
    for s in sayfa["sekmeler"]:
        t = s.get("tur")
        if s.get("id") in ids:
            h.append(f"{s.get('id')}: id tekrarı")
        ids.add(s.get("id"))
        for alan in ("id", "baslik", "alt", "yonerge"):
            if not s.get(alan):
                h.append(f"{s.get('id')}: '{alan}' eksik")
        if t == "eslestirme":
            c = s.get("ciftler", [])
            if len(c) < 4:
                h.append(f"{s['id']}: 4'ten az çift")
            if len({x[0] for x in c}) != len(c) or len({x[1] for x in c}) != len(c):
                h.append(f"{s['id']}: tekrar eden sol/sağ")
        elif t == "kategori":
            g = s.get("gruplar", {})
            if set(g) != set(s.get("kategoriler", [])):
                h.append(f"{s['id']}: kategoriler ile gruplar uyuşmuyor")
            hepsi = [x for v in g.values() for x in v]
            if len(hepsi) != len(set(hepsi)):
                h.append(f"{s['id']}: bir öğe birden çok kategoride")
            if len(hepsi) < 6:
                h.append(f"{s['id']}: 6'dan az öğe")
        elif t == "siralama":
            o = s.get("ogeler", [])
            if len(o) < 4:
                h.append(f"{s['id']}: 4'ten az öğe")
            if len({x[1] for x in o}) != len(o):
                h.append(f"{s['id']}: sıralama anahtarı tekrarı")
        elif t == "soru":
            for q in s.get("sorular", []):
                y = q.get("yanlislar", [])
                if len(y) != 3 or q.get("dogru") in y or len(set(y)) != 3:
                    h.append(f"{s['id']}: şık sorunu: {q.get('soru', '')[:50]}")
                if not q.get("cozum"):
                    h.append(f"{s['id']}: çözüm yok: {q.get('soru', '')[:50]}")
        elif t == "bosluk":
            for m, _ in s.get("cumleler", []):
                if not re.search(r"\{[^}]+\}", m):
                    h.append(f"{s['id']}: boşluksuz cümle: {m[:50]}")
        elif t == "bulmaca":
            k = s.get("kelimeler", [])
            for c, _ in k:
                if not TUR_HARF.match(c) or len(c) < 3:
                    h.append(f"{s['id']}: bulmacaya uygun değil: {c}")
            if len(k) < 6:
                h.append(f"{s['id']}: 6'dan az kelime")
        else:
            h.append(f"{s.get('id')}: bilinmeyen tür {t}")
    return h


def donustur(s):
    ortak = {k: s[k] for k in ("id", "baslik", "alt", "yonerge") if k in s}
    if s.get("turSecenekleri"):
        ortak["turSecenekleri"] = s["turSecenekleri"]
    t = s["tur"]
    if t == "eslestirme":
        return {**ortak, "tur": t, "solBaslik": s.get("solBaslik", "Kavram"), "sagBaslik": s.get("sagBaslik", "Tanım"),
                "ciftler": [{"id": slug(a) or f"c{i}", "sol": a, "sag": b} for i, (a, b) in enumerate(s["ciftler"])]}
    if t == "kategori":
        return {**ortak, "tur": t, "kategoriler": s["kategoriler"],
                "ogeler": [{"id": f"{slug(k)}--{slug(x)}", "ad": x, "kategori": k} for k, v in s["gruplar"].items() for x in v]}
    if t == "siralama":
        o = {**ortak, "tur": t, "ogeler": [{"id": f"s{i}", "ad": a, "anahtar": n, "etiket": e} for i, (a, n, e) in enumerate(s["ogeler"])]}
        if s.get("uclar"):
            o["uclar"] = s["uclar"]
        return o
    if t == "soru":
        return {**ortak, "tur": t, "sorular": [{"soru": q["soru"], "secenekler": [q["dogru"], *q["yanlislar"]], "dogru": 0, "cozum": q["cozum"]} for q in s["sorular"]]}
    if t == "bosluk":
        return {**ortak, "tur": t, "cumleler": [{"metin": m, "kaynak": k} for m, k in s["cumleler"]]}
    if t == "bulmaca":
        return {**ortak, "tur": t, "kelimeler": [{"cevap": c, "ipucu": i} for c, i in s["kelimeler"]]}
    raise ValueError(t)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("girdi")
    ap.add_argument("--unite", required=True)
    ap.add_argument("--alt", default="")
    ap.add_argument("--arka-plan", default="harita")
    ap.add_argument("--yaz", action="store_true")
    a = ap.parse_args()
    veri = json.load(open(a.girdi, encoding="utf-8"))
    toplam_hata = 0
    for sayfa in veri:
        h = dogrula(sayfa)
        toplam_hata += len(h)
        print(f"== {sayfa['slug']} ({len(sayfa['sekmeler'])} sekme): {'TAMAM' if not h else str(len(h)) + ' sorun'}")
        for x in h:
            print("   -", x)
    if not a.yaz:
        return
    katalog_yolu = os.path.join(KOK, "lib/games/icerik/uretilen.json")
    katalog = json.load(open(katalog_yolu, encoding="utf-8")) if os.path.exists(katalog_yolu) else []
    for sayfa in veri:
        if dogrula(sayfa):
            print("ATLANDI (sorunlu):", sayfa["slug"])
            continue
        sl = sayfa["slug"]
        sekmeler = [donustur(s) for s in sayfa["sekmeler"]]
        ts = (
            f"/**\n * 9. sınıf Coğrafya — {sayfa.get('kitapBolum', '')} {sayfa['baslik']}\n"
            f" * Kaynak: MEB Coğrafya 9. Sınıf Ders Kitabı (TYMM), s.{sayfa.get('sayfalar', '')}.\n"
            f" * scripts/icerik_jsondan.py ile üretildi; bilgiler kitaptan, çoktan seçmeli yanlış şıklar soruyu kurmak için yazıldı.\n */\n\n"
            'import type { KonuSekmesi } from "@/components/oyun/konu-oyunlari";\n\n'
            f"export const SEKMELER: KonuSekmesi[] = {json.dumps(sekmeler, ensure_ascii=False, indent=2)};\n"
        )
        open(os.path.join(KOK, f"lib/games/icerik/{sl}.ts"), "w", encoding="utf-8").write(ts)
        os.makedirs(os.path.join(KOK, f"app/oyunlar/{sl}"), exist_ok=True)
        baslik = sayfa["baslik"].replace('"', "'")
        aciklama = sayfa.get("aciklama", "").replace('"', "'")
        sayfa_ts = f'''import type {{ Metadata }} from "next";

import {{ KonuOyunlari }} from "@/components/oyun/konu-oyunlari";
import {{ OyunSayfasi }} from "@/components/oyun/oyun-sayfasi";
import {{ SEKMELER }} from "@/lib/games/icerik/{sl}";

export const metadata: Metadata = {{
  title: "{baslik} Oyunları — ÖzelDersBul",
  description: "{aciklama} Ücretsiz oyunlar.",
}};

export default function Page() {{
  return (
    <OyunSayfasi konu="{sl}" arkaPlan="{a.arka_plan}" baslik="{baslik}" aciklama="{aciklama}">
      <KonuOyunlari sekmeler={{SEKMELER}} />
    </OyunSayfasi>
  );
}}
'''
        open(os.path.join(KOK, f"app/oyunlar/{sl}/page.tsx"), "w", encoding="utf-8").write(sayfa_ts)
        katalog = [k for k in katalog if k["slug"] != sl]
        katalog.append({
            "slug": sl, "baslik": sayfa["baslik"], "unite": a.unite, "uniteAlt": a.alt,
            "kitapBolum": sayfa.get("kitapBolum", ""), "aciklama": sayfa.get("aciklama", ""),
            "oyunSayisi": len(sekmeler),
        })
        print("YAZILDI:", sl)
    def sira(k):
        sayilar = [int(x) for x in re.findall(r"\d+", k.get("kitapBolum") or "")]
        return sayilar[:3] if sayilar else [99]
    katalog.sort(key=sira)
    json.dump(katalog, open(katalog_yolu, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    # Günün sorusu için sekmeleri de içeren dizin
    satirlar = ["// scripts/icerik_jsondan.py ile üretildi. Elle düzenlemeyin.\n", 'import type { KonuSekmesi } from "@/components/oyun/konu-oyunlari";']
    for i, k in enumerate(katalog):
        satirlar.append(f'import {{ SEKMELER as S{i} }} from "@/lib/games/icerik/{k["slug"]}";')
    satirlar.append("\nexport const URETILEN_KONULAR: { href: string; baslik: string; sekmeler: KonuSekmesi[] }[] = [")
    for i, k in enumerate(katalog):
        satirlar.append(f'  {{ href: "/oyunlar/{k["slug"]}", baslik: {json.dumps(k["baslik"], ensure_ascii=False)}, sekmeler: S{i} }},')
    satirlar.append("];\n")
    open(os.path.join(KOK, "lib/games/icerik/uretilen.ts"), "w", encoding="utf-8").write("\n".join(satirlar))
    sys.exit(1 if toplam_hata else 0)


if __name__ == "__main__":
    main()
