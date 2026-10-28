"""Natural Earth 1:50m ülke sınırları -> lib/games/dunya-ulkeler.ts

Kullanım: python3 scripts/gen_dunya.py ne_50m_admin_0_countries.geojson lib/games/dunya-ulkeler.ts
Kaynak: github.com/nvkelso/natural-earth-vector (kamu malı).
"""
import json, math, os, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from geo_lib import build_shape, feature_rings, js

src, out = sys.argv[1], sys.argv[2]

KITA = {
    "Africa": "Afrika",
    "Asia": "Asya",
    "Europe": "Avrupa",
    "North America": "Kuzey Amerika",
    "South America": "Güney Amerika",
    "Oceania": "Okyanusya",
}
# Natural Earth "Seven seas" altında duran ada ülkeleri
KITA_ELLE = {"MUS": "Afrika", "SYC": "Afrika", "MDV": "Asya", "IOT": "Asya", "SHN": "Afrika", "ATF": "Afrika", "SGS": "Güney Amerika", "HMD": "Okyanusya"}

# Soru olarak sorulan ülkeler: BM üyeleri + Filistin + Kosova
EK_OYNANIR = {"AUS", "CHN", "DNK", "FIN", "FRA", "GBR", "NLD", "NZL", "USA", "ISR", "KOS", "PSX"}
# Çizilir, sorulmaz (siyasi statüsü tartışmalı ya da ayrı karar gerektiren)
OYNANMAZ = {"CYN", "SOL", "TWN", "CYP"}

AD_DUZELT = {"CHN": "Çin", "CZE": "Çekya", "BLR": "Belarus", "PSX": "Filistin", "ISR": "İsrail", "CYN": "Kuzey Kıbrıs", "CYP": "Kıbrıs", "TWN": "Tayvan"}

# İki kıtaya yayılan ülkeler her iki kıta filtresinde de sorulur
EK_GRUP = {"RUS": ["Asya"], "TUR": ["Avrupa"]}

# Kıta seçilince gösterilecek alan (boylam, enlem)
KITA_KUTU = {
    "Avrupa": (-25, 34, 50, 71),
    "Asya": (25, -11, 150, 78),
    "Afrika": (-26, -36, 60, 38),
    "Kuzey Amerika": (-169, 5, -50, 84),
    "Güney Amerika": (-92, -57, -30, 13),
    "Okyanusya": (110, -48, 191, 10),
}

W = 1000.0
LON_MIN, LON_MAX = -169.0, 191.0  # Bering'i sağa sar: Çukotka Rusya'nın yanında kalır
LAT_MIN, LAT_MAX = -57.0, 83.7


def miller(lat):
    r = math.radians(lat)
    return 1.25 * math.log(math.tan(math.pi / 4 + 0.4 * r))


sx = W / math.radians(LON_MAX - LON_MIN)
Y_TOP = miller(LAT_MAX)
H = round((Y_TOP - miller(LAT_MIN)) * sx)


def proj_ring(ring):
    lons = [x for x, _ in ring]
    shift = 360.0 if max(lons) < LON_MIN + 1 else 0.0  # tamamen -169'un batısındaki halka sağa
    pts = []
    for lon, lat in ring:
        lon = lon + shift
        lat = max(min(lat, LAT_MAX), LAT_MIN)
        pts.append((math.radians(lon - LON_MIN) * sx, (Y_TOP - miller(lat)) * sx))
    return pts


def kutu(lon0, lat0, lon1, lat1):
    x0 = math.radians(lon0 - LON_MIN) * sx
    x1 = math.radians(lon1 - LON_MIN) * sx
    return [round(x0, 1), round((Y_TOP - miller(lat1)) * sx, 1), round(x1, 1), round((Y_TOP - miller(lat0)) * sx, 1)]


data = json.load(open(src, encoding="utf-8"))
rows = []
for f in data["features"]:
    p = f["properties"]
    a3 = p["ADM0_A3"]
    if p["CONTINENT"] == "Antarctica":
        continue
    kita = KITA_ELLE.get(a3) or KITA.get(p["CONTINENT"])
    if not kita:
        continue
    oynanir = (p["TYPE"] in ("Sovereign country", "Sovereignty") or a3 in EK_OYNANIR) and a3 not in OYNANMAZ
    rings_ll = feature_rings(f["geometry"])
    if a3 == "KIR":  # başkent Tarawa'nın olduğu batı adaları; doğu adaları haritanın dışında kalır
        rings_ll = [r for r in rings_ll if min(x for x, _ in r) > 0]
    rings = [proj_ring(r) for r in rings_ll]
    d, cx, cy, bbox, _ = build_shape(rings, tol=0.22, min_area=0.12 if oynanir else 0.6)
    r = {"id": a3, "ad": AD_DUZELT.get(a3, p["NAME_TR"]), "grup": kita, "cx": cx, "cy": cy, "bbox": bbox}
    if a3 in EK_GRUP:
        r["ekGruplar"] = EK_GRUP[a3]
    if not oynanir:
        r["oynanir"] = False
    r["d"] = d
    rows.append(r)

rows.sort(key=lambda r: r["ad"])
oyn = [r for r in rows if r.get("oynanir", True)]
print("toplam", len(rows), "oynanir", len(oyn), "H", H)

with open(out, "w", encoding="utf-8") as o:
    o.write("// Otomatik üretildi (scripts/gen_dunya.py). Elle düzenlemeyin.\n")
    o.write("// Ülke sınırları: Natural Earth 1:50m (kamu malı), sadeleştirilmiş.\n\n")
    o.write('import type { HaritaVerisi } from "@/lib/games/harita-tipleri";\n\n')
    o.write("export const DUNYA_ULKELERI: HaritaVerisi = {\n")
    o.write(f"  genislik: {int(W)},\n  yukseklik: {H},\n")
    o.write(f"  gruplar: {js(['Avrupa', 'Asya', 'Afrika', 'Kuzey Amerika', 'Güney Amerika', 'Okyanusya'])},\n")
    o.write(f"  grupKutulari: {js({k: kutu(*v) for k, v in KITA_KUTU.items()})},\n  alanlar: [\n")
    for r in rows:
        o.write("    " + js(r) + ",\n")
    o.write("  ],\n};\n")

# Hafif liste: kategori oyunları için (sınır çizgisi yok)
liste = out.replace(".ts", "-liste.ts")
with open(liste, "w", encoding="utf-8") as o:
    o.write("// Otomatik üretildi (scripts/gen_dunya.py). Elle düzenlemeyin.\n\n")
    o.write("export const DUNYA_ULKELERI_LISTE: { id: string; ad: string; kita: string; ekKitalar?: string[] }[] = [\n")
    for r in oyn:
        x = {"id": r["id"], "ad": r["ad"], "kita": r["grup"]}
        if r.get("ekGruplar"):
            x["ekKitalar"] = r["ekGruplar"]
        o.write("  " + js(x) + ",\n")
    o.write("];\n")
