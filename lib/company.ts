/**
 * Yasal sayfalarda geçen şirket bilgileri. Tek kaynak burası.
 * `null` alanlar henüz girilmedi: sayfada "eklenecek" uyarısıyla görünür; yayına almadan önce doldurulmalı.
 */
export const COMPANY = {
  legalName: "Thorius Eğitim ve Danışmanlık Limited Şirketi",
  brand: "ÖzelDersBul",
  site: "ozelders.thorius.com.tr",
  address: "Mecidiye Mah. Sandalcı Mecit Sk. No: 9 İç Kapı No: 1, Beşiktaş / İstanbul" as string | null,
  mersis: "0843090202300001" as string | null,
  tradeRegistry: "İstanbul Ticaret Sicili 1085795",
  taxOffice: "Beşiktaş" as string | null,
  taxNo: "8430902023" as string | null,
  kep: null as string | null, // KEP adresi (varsa)
  supportEmail: "destek@thorius.com.tr",
  kvkkEmail: "kvkk@thorius.com.tr",
  phone: "+90 543 132 35 03" as string | null,
  supportHours: "Hafta içi 09:00–18:00",
};

export const LEGAL_VERSION = "2026-10";
export const LEGAL_UPDATED = "25 Ekim 2026";

export function companyValue(v: string | null): string {
  return v ?? "[eklenecek]";
}
