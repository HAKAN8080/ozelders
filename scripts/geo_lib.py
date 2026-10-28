"""Harita oyunları için ortak yardımcılar: projeksiyon, sadeleştirme, TS çıktısı."""
import json, math


def area(ring):
    """Standart işaretli alan (SVG koordinatlarında saat yönü pozitif değil)."""
    return 0.5 * sum(ring[i - 1][0] * ring[i][1] - ring[i][0] * ring[i - 1][1] for i in range(len(ring)))


def centroid(ring):
    A = area(ring)
    if abs(A) < 1e-9:
        xs, ys = zip(*ring)
        return sum(xs) / len(xs), sum(ys) / len(ys)
    cx = cy = 0.0
    for i in range(len(ring)):
        x0, y0 = ring[i - 1]
        x1, y1 = ring[i]
        c = x0 * y1 - x1 * y0
        cx += (x0 + x1) * c
        cy += (y0 + y1) * c
    return cx / (6 * A), cy / (6 * A)


def _dp(pts, tol):
    if len(pts) < 3:
        return pts
    keep = [False] * len(pts)
    keep[0] = keep[-1] = True
    stack = [(0, len(pts) - 1)]
    while stack:
        a, b = stack.pop()
        (x1, y1), (x2, y2) = pts[a], pts[b]
        dx, dy = x2 - x1, y2 - y1
        L = math.hypot(dx, dy)
        best, idx = -1.0, None
        for i in range(a + 1, b):
            x0, y0 = pts[i]
            d = abs(dy * x0 - dx * y0 + x2 * y1 - y2 * x1) / L if L > 1e-12 else math.hypot(x0 - x1, y0 - y1)
            if d > best:
                best, idx = d, i
        if idx is not None and best > tol:
            keep[idx] = True
            stack += [(a, idx), (idx, b)]
    return [p for p, k in zip(pts, keep) if k]


def simplify_ring(p, tol):
    """Kapalı halkayı ikiye bölüp Douglas-Peucker uygular (uçlar aynı nokta olduğu için)."""
    h = len(p) // 2
    return _dp(p[: h + 1], tol)[:-1] + _dp(p[h:], tol)


def feature_rings(geom):
    polys = geom["coordinates"] if geom["type"] == "MultiPolygon" else [geom["coordinates"]]
    return [poly[0] for poly in polys]  # yalnız dış halkalar


def build_shape(rings_xy, tol, min_area, prec=1):
    """SVG path, etiket noktası, sınır kutusu ve toplam alan döndürür."""
    parts, big, big_a, tot = [], None, 0.0, 0.0
    xs, ys = [], []
    for p in rings_xy:
        a = abs(area(p))
        tot += a
        if a > big_a:
            big_a, big = a, p
        if a < min_area:
            continue
        s = simplify_ring(p, tol)
        if len(s) < 3:
            continue
        xs += [q[0] for q in s]
        ys += [q[1] for q in s]
        parts.append("M" + "L".join(f"{x:.{prec}f},{y:.{prec}f}" for x, y in s) + "Z")
    if not parts:  # çok küçük ülke: en büyük halkayı sadeleştirmeden koru
        xs = [q[0] for q in big]
        ys = [q[1] for q in big]
        parts.append("M" + "L".join(f"{x:.{prec}f},{y:.{prec}f}" for x, y in big) + "Z")
    cx, cy = centroid(big)
    # Yakınlaştırma kutusu yalnız ana parçalardan (en büyük halkanın %20'si ve üstü):
    # Aleutlar, Fransız Guyanası gibi uzak küçük parçalar kıta görünümünü bozmasın.
    core = [q for p in rings_xy if abs(area(p)) >= 0.2 * big_a for q in p]
    cxs = [q[0] for q in core]
    cys = [q[1] for q in core]
    bbox = [round(min(cxs), 1), round(min(cys), 1), round(max(cxs), 1), round(max(cys), 1)]
    return "".join(parts), round(cx, 1), round(cy, 1), bbox, tot


def js(v):
    return json.dumps(v, ensure_ascii=False)
