"""Turkiye il sinirlari GeoJSON -> SVG path verisi (lib/games/tr-iller.ts)."""
import json, math, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from geo_lib import build_shape, feature_rings, js

src, out = sys.argv[1], sys.argv[2]

# kod, resmi ad, bolge (7 cografi bolge)
ILLER = {
 "Adana": (1,"Adana","Akdeniz"), "Adıyaman": (2,"Adıyaman","Güneydoğu Anadolu"),
 "Afyon": (3,"Afyonkarahisar","Ege"), "Ağrı": (4,"Ağrı","Doğu Anadolu"),
 "Amasya": (5,"Amasya","Karadeniz"), "Ankara": (6,"Ankara","İç Anadolu"),
 "Antalya": (7,"Antalya","Akdeniz"), "Artvin": (8,"Artvin","Karadeniz"),
 "Aydın": (9,"Aydın","Ege"), "Balıkesir": (10,"Balıkesir","Marmara"),
 "Bilecik": (11,"Bilecik","Marmara"), "Bingöl": (12,"Bingöl","Doğu Anadolu"),
 "Bitlis": (13,"Bitlis","Doğu Anadolu"), "Bolu": (14,"Bolu","Karadeniz"),
 "Burdur": (15,"Burdur","Akdeniz"), "Bursa": (16,"Bursa","Marmara"),
 "Çanakkale": (17,"Çanakkale","Marmara"), "Çankırı": (18,"Çankırı","İç Anadolu"),
 "Çorum": (19,"Çorum","Karadeniz"), "Denizli": (20,"Denizli","Ege"),
 "Diyarbakır": (21,"Diyarbakır","Güneydoğu Anadolu"), "Edirne": (22,"Edirne","Marmara"),
 "Elazığ": (23,"Elazığ","Doğu Anadolu"), "Erzincan": (24,"Erzincan","Doğu Anadolu"),
 "Erzurum": (25,"Erzurum","Doğu Anadolu"), "Eskişehir": (26,"Eskişehir","İç Anadolu"),
 "Gaziantep": (27,"Gaziantep","Güneydoğu Anadolu"), "Giresun": (28,"Giresun","Karadeniz"),
 "Gümüşhane": (29,"Gümüşhane","Karadeniz"), "Hakkari": (30,"Hakkari","Doğu Anadolu"),
 "Hatay": (31,"Hatay","Akdeniz"), "Isparta": (32,"Isparta","Akdeniz"),
 "Mersin": (33,"Mersin","Akdeniz"), "İstanbul": (34,"İstanbul","Marmara"),
 "İzmir": (35,"İzmir","Ege"), "Kars": (36,"Kars","Doğu Anadolu"),
 "Kastamonu": (37,"Kastamonu","Karadeniz"), "Kayseri": (38,"Kayseri","İç Anadolu"),
 "Kırklareli": (39,"Kırklareli","Marmara"), "Kırşehir": (40,"Kırşehir","İç Anadolu"),
 "Kocaeli": (41,"Kocaeli","Marmara"), "Konya": (42,"Konya","İç Anadolu"),
 "Kütahya": (43,"Kütahya","Ege"), "Malatya": (44,"Malatya","Doğu Anadolu"),
 "Manisa": (45,"Manisa","Ege"), "Kahramanmaraş": (46,"Kahramanmaraş","Akdeniz"),
 "Mardin": (47,"Mardin","Güneydoğu Anadolu"), "Muğla": (48,"Muğla","Ege"),
 "Muş": (49,"Muş","Doğu Anadolu"), "Nevşehir": (50,"Nevşehir","İç Anadolu"),
 "Niğde": (51,"Niğde","İç Anadolu"), "Ordu": (52,"Ordu","Karadeniz"),
 "Rize": (53,"Rize","Karadeniz"), "Sakarya": (54,"Sakarya","Marmara"),
 "Samsun": (55,"Samsun","Karadeniz"), "Siirt": (56,"Siirt","Güneydoğu Anadolu"),
 "Sinop": (57,"Sinop","Karadeniz"), "Sivas": (58,"Sivas","İç Anadolu"),
 "Tekirdağ": (59,"Tekirdağ","Marmara"), "Tokat": (60,"Tokat","Karadeniz"),
 "Trabzon": (61,"Trabzon","Karadeniz"), "Tunceli": (62,"Tunceli","Doğu Anadolu"),
 "Şanlıurfa": (63,"Şanlıurfa","Güneydoğu Anadolu"), "Uşak": (64,"Uşak","Ege"),
 "Van": (65,"Van","Doğu Anadolu"), "Yozgat": (66,"Yozgat","İç Anadolu"),
 "Zonguldak": (67,"Zonguldak","Karadeniz"), "Aksaray": (68,"Aksaray","İç Anadolu"),
 "Bayburt": (69,"Bayburt","Karadeniz"), "Karaman": (70,"Karaman","İç Anadolu"),
 "Kırıkkale": (71,"Kırıkkale","İç Anadolu"), "Batman": (72,"Batman","Güneydoğu Anadolu"),
 "Şırnak": (73,"Şırnak","Güneydoğu Anadolu"), "Bartın": (74,"Bartın","Karadeniz"),
 "Ardahan": (75,"Ardahan","Doğu Anadolu"), "Iğdır": (76,"Iğdır","Doğu Anadolu"),
 "Yalova": (77,"Yalova","Marmara"), "Karabük": (78,"Karabük","Karadeniz"),
 "Kilis": (79,"Kilis","Güneydoğu Anadolu"), "Osmaniye": (80,"Osmaniye","Akdeniz"),
 "Düzce": (81,"Düzce","Karadeniz"),
}

data = json.load(open(src, encoding="utf-8"))
LAT0 = 39.0
K = math.cos(math.radians(LAT0))
W = 1000.0
LON_MIN, LON_MAX, LAT_MIN, LAT_MAX = 25.6, 44.9, 35.75, 42.15
sx = W / ((LON_MAX - LON_MIN) * K)
H = round((LAT_MAX - LAT_MIN) * sx)


def proj(lon, lat):
    return ((lon - LON_MIN) * K * sx, (LAT_MAX - lat) * sx)


BOLGELER = ["Marmara", "Ege", "Akdeniz", "İç Anadolu", "Karadeniz", "Doğu Anadolu", "Güneydoğu Anadolu"]

rows = []
for f in data["features"]:
    kod, ad, bolge = ILLER[f["properties"]["name"]]
    rings = [[proj(x, y) for x, y in r] for r in feature_rings(f["geometry"])]
    d, cx, cy, bbox, _ = build_shape(rings, tol=0.6, min_area=0.8)
    rows.append((kod, {"id": str(kod), "ad": ad, "grup": bolge, "kod": f"{kod:02d}", "cx": cx, "cy": cy, "bbox": bbox, "d": d}))

rows.sort(key=lambda r: r[0])
assert len(rows) == 81
with open(out, "w", encoding="utf-8") as o:
    o.write("// Otomatik üretildi (scripts/gen_iller.py). Elle düzenlemeyin.\n")
    o.write("// İl sınırları: github.com/cihadturhan/tr-geojson, sadeleştirilmiş.\n\n")
    o.write('import type { HaritaVerisi } from "@/lib/games/harita-tipleri";\n\n')
    o.write("export const TURKIYE_ILLERI: HaritaVerisi = {\n")
    o.write(f"  genislik: {int(W)},\n  yukseklik: {H},\n  gruplar: {js(BOLGELER)},\n  alanlar: [\n")
    for _, r in rows:
        o.write("    " + js(r) + ",\n")
    o.write("  ],\n};\n")
print("ok", H)

# Hafif liste: kategori oyunları için (sınır çizgisi yok)
liste = out.replace(".ts", "-liste.ts")
with open(liste, "w", encoding="utf-8") as o:
    o.write("// Otomatik üretildi (scripts/gen_iller.py). Elle düzenlemeyin.\n\n")
    o.write("export const TURKIYE_ILLERI_LISTE: { ad: string; bolge: string; plaka: string }[] = [\n")
    for _, r in rows:
        o.write("  " + js({"ad": r["ad"], "bolge": r["grup"], "plaka": r["kod"]}) + ",\n")
    o.write("];\n")
