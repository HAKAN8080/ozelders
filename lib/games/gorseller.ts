/**
 * Oyun kartlarının görselleri. Tamamı ücretsiz Unsplash lisanslı (Unsplash+ değil);
 * fotoğrafçılar /oyunlar sayfasının altında anılır. Anahtar: oyun sayfasının slug'ı.
 */
export type Gorsel = {
  url: string;
  alt: string;
  by: string;
  byUrl: string;
  page: string;
};

export const GORSELLER: Record<string, Gorsel> = {
  "cografyanin-konusu-ve-bolumleri": {
    url: "https://images.unsplash.com/photo-1693760682016-7c581e36a1fb",
    alt: "Adrasan'da dağların denizle buluştuğu kıyı manzarası",
    by: "Ferit Çiçek",
    byUrl: "https://unsplash.com/@ferrit",
    page: "https://unsplash.com/photos/a-large-body-of-water-with-a-mountain-in-the-background-Ut8LYnhkKk8",
  },
  "cografya-biliminin-gelisimi": {
    url: "https://images.unsplash.com/photo-1723306744533-bed5a4f696dc",
    alt: "1736 tarihli antika dünya haritası",
    by: "The New York Public Library",
    byUrl: "https://unsplash.com/@nypl",
    page: "https://unsplash.com/photos/an-antique-world-map-showing-continents-and-oceans-RoDSZoVzBVs",
  },
  "harita-ve-olcek": {
    url: "https://images.unsplash.com/photo-1519992599773-1e1d4029929d",
    alt: "Kâğıt harita üzerinde cetvelli pusula",
    by: "Hendrik Morkel",
    byUrl: "https://unsplash.com/@hendrikmorkel",
    page: "https://unsplash.com/photos/clear-and-white-compass-with-ruler-on-map-illustration--eAtOTvnkQI",
  },
  "koordinatlar-ve-saat-dilimleri": {
    url: "https://images.unsplash.com/photo-1531266752426-aad472b7bbf4",
    alt: "Yakından çekilmiş masa küresi",
    by: "Juliana Kozoski",
    byUrl: "https://unsplash.com/@jkozoski",
    page: "https://unsplash.com/photos/selective-focus-photo-of-terrestrial-desk-globe-IoQioGLrz3Y",
  },
  "haritalama-teknikleri-ve-yer-sekilleri": {
    url: "https://images.unsplash.com/photo-1736117704452-46670dd0c81f",
    alt: "Eş yükselti eğrileri gösteren topografya haritası",
    by: "Etienne Girardet",
    byUrl: "https://unsplash.com/@etiennegirardet",
    page: "https://unsplash.com/photos/a-map-of-the-area-of-a-mountain-PtpRmtsh6A0",
  },
  "turkiyenin-cografi-konumu": {
    url: "https://images.unsplash.com/photo-1561575548-3796543640cb",
    alt: "İstanbul Boğazı ve köprünün havadan görünümü",
    by: "Ümit Yıldırım",
    byUrl: "https://unsplash.com/@umityildirim",
    page: "https://unsplash.com/photos/s5hJI5B1Dg8",
  },
  "mekansal-bilgi-teknolojileri": {
    url: "https://images.unsplash.com/photo-1722082839841-45473f5a15cf",
    alt: "Landsat uydusundan çekilmiş kıyı ve şehir görüntüsü",
    by: "USGS",
    byUrl: "https://unsplash.com/@usgs",
    page: "https://unsplash.com/photos/aerial-view-of-a-city-with-a-canal-system-ScopIGGJAQ4",
  },
  "hava-olaylari": {
    url: "https://images.unsplash.com/photo-1429552077091-836152271555",
    alt: "Koyu fırtına bulutlarından düşen şimşek",
    by: "Brandon Morgan",
    byUrl: "https://unsplash.com/@littleppl85",
    page: "https://unsplash.com/photos/lightning-bolt-in-dark-storm-3qucB7U2l7I",
  },
  "iklim-sistemi": {
    url: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa",
    alt: "Uzaydan görülen okyanus ve bulutlar",
    by: "NASA",
    byUrl: "https://unsplash.com/@nasa",
    page: "https://unsplash.com/photos/view-of-earth-and-satellite-yZygONrUBe8",
  },
  "iklim-sistemi-sicaklik": {
    url: "https://images.unsplash.com/photo-1740560516658-5a94b0b715ed",
    alt: "Mavi gökyüzü altında kuma saplanmış termometre",
    by: "Immo Wegmann",
    byUrl: "https://unsplash.com/@tinkerman",
    page: "https://unsplash.com/photos/a-thermometer-in-the-sand-with-a-blue-sky-in-the-background-V2AMRkAUCnA",
  },
  "iklim-sistemi-basinc-ruzgar-yagis": {
    url: "https://images.unsplash.com/photo-1515344905723-babc01aac23d",
    alt: "Kolza tarlasında rüzgâr türbinleri",
    by: "Zbynek Burival",
    byUrl: "https://unsplash.com/@zburival",
    page: "https://unsplash.com/photos/windmills-on-grass-field-at-daytime-4NhqyQeErP8",
  },
  "iklim-turleri": {
    url: "https://images.unsplash.com/photo-1776708242389-9bb573724a9f",
    alt: "Palmiyelerin arasından görünen karlı dağ zirvesi",
    by: "Tyler Hardie",
    byUrl: "https://unsplash.com/@tylersphotographyus",
    page: "https://unsplash.com/photos/snow-covered-mountain-peak-seen-between-palm-trees-SIx0MwPq2ZU",
  },
  "iklim-degisiklikleri": {
    url: "https://images.unsplash.com/photo-1465917566611-efba2904dd8a",
    alt: "Perito Moreno buzulunun suya uzanan buz duvarı",
    by: "Agustín Lautaro",
    byUrl: "https://unsplash.com/@agustinl",
    page: "https://unsplash.com/photos/ice-cliff-near-on-body-of-water-SH_oYiwg224",
  },
  "nufusun-tarihsel-degisimi": {
    url: "https://images.unsplash.com/photo-1714064732324-3b962a4adcd8",
    alt: "Bir avluda toplanan kalabalığın havadan görünümü",
    by: "Drew Walker",
    byUrl: "https://unsplash.com/@dbwalkerr",
    page: "https://unsplash.com/photos/L16ih0CMLi8",
  },
  "nufusun-dagilisi-ve-hareketleri": {
    url: "https://images.unsplash.com/photo-1446776899648-aa78eefe8ed0",
    alt: "Uydudan görülen şehir ışıkları",
    by: "NASA",
    byUrl: "https://unsplash.com/@nasa",
    page: "https://unsplash.com/photos/satellite-view-of-earths-surface-_SFJhRPzJHs",
  },
  "demografik-donusum-ve-nufus-piramitleri": {
    url: "https://images.unsplash.com/photo-1685449068033-684173da51a5",
    alt: "Beyaz zemin üzerinde uzun gölgeli kâğıt insan figürleri",
    by: "Rafael AS Martins",
    byUrl: "https://unsplash.com/@rafael_as_martins",
    page: "https://unsplash.com/photos/paper-cutout-figures-on-white-surface-ZsALpTRPyh4",
  },
  "nufus-politikalari": {
    url: "https://images.unsplash.com/photo-1499750264616-eca69646ae17",
    alt: "Konut mahallesinin havadan görünümü",
    by: "Derek Liang",
    byUrl: "https://unsplash.com/@derekrliang",
    page: "https://unsplash.com/photos/aerial-photography-of-city-during-daytime-IZypSha074U",
  },
  "ekonomik-faaliyetler": {
    url: "https://images.unsplash.com/photo-1590497008432-598f04441de8",
    alt: "Konteynerler ve vinçlerle dolu yük limanı",
    by: "Timelab",
    byUrl: "https://unsplash.com/@timelabpro",
    page: "https://unsplash.com/photos/shipping-port-with-containers-and-cranes-sWOvgOOFk1g",
  },
  "tehlike-risk-ve-afet": {
    url: "https://images.unsplash.com/photo-1475776408506-9a5371e7a068",
    alt: "Sinabung Yanardağı'ndan yükselen kül bulutu",
    by: "Yosh Ginsu",
    byUrl: "https://unsplash.com/@yoshginsu",
    page: "https://unsplash.com/photos/volcano-eruption-during-daytime-qexZLgMcbPc",
  },
  "afet-turleri": {
    url: "https://images.unsplash.com/photo-1567654007013-3d64876fe8dd",
    alt: "Bulutlu gökyüzü altında sel suları arasında kalan evler",
    by: "Nguyen Kiet",
    byUrl: "https://unsplash.com/@kietbeo778",
    page: "https://unsplash.com/photos/houses-surrounded-with-water-under-cloudy-sky-OGp18qMyq-k",
  },
  "butuncul-afet-yonetimi": {
    url: "https://images.unsplash.com/photo-1624638760852-8ede1666ab07",
    alt: "Malzemelerle dolu açık kırmızı ilk yardım çantası",
    by: "Mathurin NAPOLY",
    byUrl: "https://unsplash.com/@matnapo",
    page: "https://unsplash.com/photos/open-red-medical-bag-with-supplies-MaKsx8JNbiI",
  },
  "bolge-ve-bolge-sinirlari": {
    url: "https://images.unsplash.com/photo-1560198927-b31ef30c5867",
    alt: "Sınırları belirgin teraslı tarlaların havadan görünümü",
    by: "Ivan Bandura",
    byUrl: "https://unsplash.com/@unstable_affliction",
    page: "https://unsplash.com/photos/aerial-view-of-green-field-gkzByAvMki8",
  },
  sozluk: {
    url: "https://images.unsplash.com/photo-1543165796-5426273eaab3",
    alt: "Açık duran bir sözlük sayfası",
    by: "Waldemar Brandt",
    byUrl: "https://unsplash.com/@waldemarbrandt67w",
    page: "https://unsplash.com/photos/open-dictionary-U3Ptj3jafX8",
  },
  "turkiye-illeri": {
    url: "https://images.unsplash.com/photo-1584816152587-382580af2d85",
    alt: "Ankara şehir merkezinin havadan görünümü",
    by: "ekrem osmanoglu",
    byUrl: "https://unsplash.com/@konevi",
    page: "https://unsplash.com/photos/aerial-view-of-city-buildings-during-daytime-S9ULqp6XWps",
  },
  "iller-ve-bolgeler": {
    url: "https://images.unsplash.com/photo-1599424010719-581072ca8d80",
    alt: "Karadeniz'de yeşil dağlarla çevrili Uzungöl",
    by: "Emre",
    byUrl: "https://unsplash.com/@reo",
    page: "https://unsplash.com/photos/green-mountains-near-body-of-water-during-daytime-m-XmW9bqzZ4",
  },
  "ulkeler-ve-kitalar": {
    url: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2",
    alt: "Avrupa, Afrika ve Orta Doğu'yu gösteren masa küresi",
    by: "Kyle Glenn",
    byUrl: "https://unsplash.com/@kylejglenn",
    page: "https://unsplash.com/photos/desk-globe-on-table-nXt5HtLmlgE",
  },
  "dunya-ulkeleri": {
    url: "https://images.unsplash.com/photo-1650526087824-163941841b52",
    alt: "Üzerinde renkli raptiyeler olan dünya haritası",
    by: "Leandro Barreto",
    byUrl: "https://unsplash.com/@lpbarreto",
    page: "https://unsplash.com/photos/a-map-of-the-world-with-pins-on-it-nomAp6_KVXU",
  },
};

export function gorselSrc(url: string, w = 640): string {
  return `${url}?fm=jpg&q=70&w=${w}&auto=format&fit=crop`;
}
