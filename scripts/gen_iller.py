"""Turkiye il sinirlari GeoJSON -> SVG path verisi (lib/games/tr-iller.ts)."""
import json, math, sys

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

def simplify(pts, tol=0.9):
    """Douglas-Peucker."""
    if len(pts) < 4:
        return pts
    def rec(a, b):
        (x1, y1), (x2, y2) = pts[a], pts[b]
        dx, dy = x2 - x1, y2 - y1
        L = math.hypot(dx, dy) or 1e-9
        best, idx = -1, None
        for i in range(a + 1, b):
            x0, y0 = pts[i]
            d = abs(dy * x0 - dx * y0 + x2 * y1 - y2 * x1) / L
            if d > best:
                best, idx = d, i
        if best > tol and idx is not None:
            return rec(a, idx)[:-1] + rec(idx, b)
        return [pts[a], pts[b]]
    return rec(0, len(pts) - 1)

def area(ring):
    return 0.5 * sum(ring[i][0]*ring[i-1][1] - ring[i-1][0]*ring[i][1] for i in range(len(ring)))

rows = []
for f in data["features"]:
    name = f["properties"]["name"]
    kod, ad, bolge = ILLER[name]
    g = f["geometry"]
    polys = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
    parts, big, big_a = [], None, 0
    for poly in polys:
        for ring in poly[:1]:  # outer ring only
            p = [proj(x, y) for x, y in ring]
            a = abs(area(p))
            if a < 0.8:  # tiny islets
                continue
            # Kapalı halka: uçlar aynı nokta olduğu için ikiye bölüp sadeleştir
            h = len(p) // 2
            s = simplify(p[: h + 1])[:-1] + simplify(p[h:])
            if len(s) < 3:
                continue
            if a > big_a:
                big_a, big = a, p
            parts.append("M" + "L".join(f"{x:.1f},{y:.1f}" for x, y in s) + "Z")
    # label point: centroid of largest ring
    A = -area(big)  # area() işareti ters; centroid formülü standart (x_i-1*y_i - x_i*y_i-1)
    cx = sum((big[i-1][0]+big[i][0])*(big[i-1][0]*big[i][1]-big[i][0]*big[i-1][1]) for i in range(len(big)))/(6*A)
    cy = sum((big[i-1][1]+big[i][1])*(big[i-1][0]*big[i][1]-big[i][0]*big[i-1][1]) for i in range(len(big)))/(6*A)
    rows.append((kod, ad, bolge, "".join(parts), round(cx, 1), round(cy, 1)))

rows.sort()
assert len(rows) == 81
with open(out, "w", encoding="utf-8") as o:
    o.write("// Otomatik üretildi (scripts/gen_iller.py). Elle düzenlemeyin.\n")
    o.write("// İl sınırları: github.com/cihadturhan/tr-geojson, sadeleştirilmiş.\n\n")
    o.write('export type Bolge =\n  | "Marmara"\n  | "Ege"\n  | "Akdeniz"\n  | "İç Anadolu"\n  | "Karadeniz"\n  | "Doğu Anadolu"\n  | "Güneydoğu Anadolu";\n\n')
    o.write("export type Il = { kod: number; ad: string; bolge: Bolge; d: string; cx: number; cy: number };\n\n")
    o.write(f"export const HARITA_GENISLIK = {int(W)};\nexport const HARITA_YUKSEKLIK = {H};\n\n")
    o.write("export const ILLER: Il[] = [\n")
    for kod, ad, bolge, d, cx, cy in rows:
        o.write(f'  {{ kod: {kod}, ad: "{ad}", bolge: "{bolge}", cx: {cx}, cy: {cy}, d: "{d}" }},\n')
    o.write("];\n")
print("ok", H)
