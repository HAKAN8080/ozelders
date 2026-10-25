/**
 * Yasal sayfalarda geçen şirket bilgileri. Tek kaynak burası.
 * `null` alanlar henüz girilmedi: sayfada "eklenecek" uyarısıyla görünür; yayına almadan önce doldurulmalı.
 */
export const COMPANY = {
  legalName: "Thorius Eğitim ve Danışmanlık Limited Şirketi",
  brand: "ÖzelDersBul",
  site: "ozeldersbul.com.tr",
  address: null as string | null, // Tam adres (mahalle, cadde, no, ilçe/il)
  mersis: null as string | null,
  taxOffice: null as string | null,
  taxNo: null as string | null,
  kep: null as string | null, // KEP adresi (varsa)
  supportEmail: "destek@ozeldersbul.com.tr",
  kvkkEmail: "kvkk@ozeldersbul.com.tr",
  phone: null as string | null,
  supportHours: "Hafta içi 09:00–18:00",
};

export const LEGAL_VERSION = "2026-10";
export const LEGAL_UPDATED = "25 Ekim 2026";

export function companyValue(v: string | null): string {
  return v ?? "[eklenecek]";
}
