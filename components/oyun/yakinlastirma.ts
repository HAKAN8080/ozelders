"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as RPointerEvent } from "react";

export type Kutu = { x: number; y: number; w: number; h: number };

const MAKS_YAKINLIK = 8;

/**
 * SVG harita için yakınlaştırma ve kaydırma:
 * + / − düğmeleri, fareyle ya da parmakla sürükleme, iki parmakla yakınlaştırma.
 * (Fare tekerleği sayfayı kaydırmaya devam eder.)
 * Sürükleme sonrası gelen tıklama yutulur (yanlışlıkla il seçilmesin diye).
 */
export function useYakinlastirma(temel: Kutu) {
  const [gorus, setGorus] = useState<Kutu>(temel);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [ekranGenisligi, setEkranGenisligi] = useState(1000);
  const isaretciler = useRef(new Map<number, { x: number; y: number }>());
  const baslangic = useRef<{ gorus: Kutu; mesafe: number; merkez: { x: number; y: number } } | null>(null);
  const suruklendi = useRef(false);
  const toplamHareket = useRef(0);

  // Bölge değişince temel görünüme dön (render sırasında türetilmiş durum sıfırlama)
  const [oncekiTemel, setOncekiTemel] = useState(temel);
  if (oncekiTemel !== temel) {
    setOncekiTemel(temel);
    setGorus(temel);
  }

  // SVG'nin ekrandaki genişliği: etiket ve nokta boyutlarını piksele göre ayarlamak için
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const g = () => setEkranGenisligi(el.getBoundingClientRect().width || 1000);
    g();
    const ro = new ResizeObserver(g);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const sinirla = useCallback(
    (k: Kutu): Kutu => {
      const w = Math.min(Math.max(k.w, temel.w / MAKS_YAKINLIK), temel.w);
      const h = (w * temel.h) / temel.w;
      const x = Math.min(Math.max(k.x, temel.x), temel.x + temel.w - w);
      const y = Math.min(Math.max(k.y, temel.y), temel.y + temel.h - h);
      return { x, y, w, h };
    },
    [temel],
  );

  const olcekle = useCallback(
    (carpan: number, merkez?: { x: number; y: number }) => {
      setGorus((g) => {
        const m = merkez ?? { x: g.x + g.w / 2, y: g.y + g.h / 2 };
        const w = g.w / carpan;
        const h = g.h / carpan;
        return sinirla({ x: m.x - ((m.x - g.x) * w) / g.w, y: m.y - ((m.y - g.y) * h) / g.h, w, h });
      });
    },
    [sinirla],
  );

  /** Ekran koordinatını SVG koordinatına çevirir. */
  const svgNoktasi = (cx: number, cy: number, g: Kutu) => {
    const r = svgRef.current!.getBoundingClientRect();
    return { x: g.x + ((cx - r.left) / r.width) * g.w, y: g.y + ((cy - r.top) / r.height) * g.h };
  };

  const onPointerDown = (e: RPointerEvent<SVGSVGElement>) => {
    isaretciler.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    suruklendi.current = false;
    toplamHareket.current = 0;
    const p = [...isaretciler.current.values()];
    const mesafe = p.length >= 2 ? Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y) : 0;
    const merkez = p.length >= 2 ? { x: (p[0].x + p[1].x) / 2, y: (p[0].y + p[1].y) / 2 } : p[0];
    baslangic.current = { gorus, mesafe, merkez };
  };

  const onPointerMove = (e: RPointerEvent<SVGSVGElement>) => {
    if (!isaretciler.current.has(e.pointerId) || !baslangic.current || !svgRef.current) return;
    const onceki = isaretciler.current.get(e.pointerId)!;
    toplamHareket.current += Math.hypot(e.clientX - onceki.x, e.clientY - onceki.y);
    isaretciler.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (toplamHareket.current > 6) {
      suruklendi.current = true;
      // Sürüklerken tıklamanın hedefi değişmesin diye işaretçiyi yakala
      if (!svgRef.current.hasPointerCapture(e.pointerId)) svgRef.current.setPointerCapture(e.pointerId);
    }
    if (!suruklendi.current) return;

    const p = [...isaretciler.current.values()];
    const b = baslangic.current;
    const r = svgRef.current.getBoundingClientRect();
    if (p.length >= 2 && b.mesafe > 0) {
      const mesafe = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
      const merkezEkran = { x: (p[0].x + p[1].x) / 2, y: (p[0].y + p[1].y) / 2 };
      const carpan = mesafe / b.mesafe;
      const w = b.gorus.w / carpan;
      const h = b.gorus.h / carpan;
      const mSvg = svgNoktasi(b.merkez.x, b.merkez.y, b.gorus);
      const fx = (merkezEkran.x - r.left) / r.width;
      const fy = (merkezEkran.y - r.top) / r.height;
      setGorus(sinirla({ x: mSvg.x - fx * w, y: mSvg.y - fy * h, w, h }));
    } else if (p.length === 1) {
      const dx = ((p[0].x - b.merkez.x) / r.width) * b.gorus.w;
      const dy = ((p[0].y - b.merkez.y) / r.height) * b.gorus.h;
      setGorus(sinirla({ ...b.gorus, x: b.gorus.x - dx, y: b.gorus.y - dy }));
    }
  };

  const onPointerUp = (e: RPointerEvent<SVGSVGElement>) => {
    isaretciler.current.delete(e.pointerId);
    const p = [...isaretciler.current.values()];
    // Bir parmak kalırsa kaldığı yerden kaydırmaya devam
    baslangic.current = p.length ? { gorus, mesafe: 0, merkez: p[0] } : null;
  };

  /** Sürükleme sonrası tetiklenen tıklamayı yut. Tıklama işleyicileri bunu çağırır. */
  const tiklamaGecerli = () => !suruklendi.current;

  const yakinlik = temel.w / gorus.w;
  /** 1 ekran pikselinin SVG birimindeki karşılığı */
  const piksel = gorus.w / ekranGenisligi;

  return {
    gorus,
    svgRef,
    piksel,
    yakinlik,
    yakinlas: () => olcekle(1.6),
    uzaklas: () => olcekle(1 / 1.6),
    sifirla: () => setGorus(temel),
    tiklamaGecerli,
    svgOlaylari: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onPointerLeave: (e: RPointerEvent<SVGSVGElement>) => {
        if (e.pointerType === "mouse") onPointerUp(e);
      },
    },
  };
}
