import { safeGetProducts, MAIN_CATEGORIES_DATA, getSubcategories } from '../../data/products';

/**
 * Studio Environments & Architectural Scenes
 */
export const STUDIO_SURFACES = [
  {
    id: 'modern-villa',
    name: 'Modern Villa Cephesi',
    nameEn: 'Modern Villa Façade',
    tag: 'Lüks Dış Cephe',
    tagEn: 'Luxury Exterior',
    description: 'Geniş cam cepheler, antrasit doğramalar ve teraslı çağdaş mimari.',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    type: 'exterior',
    aspectRatio: '16:10',
    defaultScale: 1.0,
    supportedBonds: ['stretcher', 'stack', 'soldier', 'herringbone', 'flemish'],
    zones: [
      { id: 'all', name: 'Tüm Dış Cephe', nameEn: 'Complete Façade' },
      { id: 'entry', name: 'Giriş & Vurgu Duvarı', nameEn: 'Entrance Accent' },
      { id: 'upper', name: 'Üst Kat Konsol Paneli', nameEn: 'Upper Cantilever' }
    ]
  },
  {
    id: 'mustakil-konut',
    name: 'Müstakil Konut & Giriş',
    nameEn: 'Detached House & Porch',
    tag: 'Konut Mimarisi',
    tagEn: 'Residential',
    description: 'Sıcak aile evi, beşik çatı, peyzaj ve davetkâr tuğla girişi.',
    thumbnail: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    type: 'exterior',
    aspectRatio: '16:10',
    defaultScale: 1.0,
    supportedBonds: ['stretcher', 'flemish', 'stack', 'herringbone'],
    zones: [
      { id: 'all', name: 'Komple Dış Cephe', nameEn: 'Full Exterior' },
      { id: 'portal', name: 'Giriş Portali', nameEn: 'Front Portal' },
      { id: 'plinth', name: 'Subasman Duvarı', nameEn: 'Base Plinth' }
    ]
  },
  {
    id: 'loft-restaurant',
    name: 'Loft Restoran & Bar',
    nameEn: 'Loft Restaurant & Bar',
    tag: 'Ticari İç Mekan',
    tagEn: 'Commercial Interior',
    description: 'Endüstriyel tavan, sıcak aydınlatma ve atmosferik tuğla vurgu duvarları.',
    thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    type: 'interior',
    aspectRatio: '16:10',
    defaultScale: 1.1,
    supportedBonds: ['stretcher', 'herringbone', 'stack', 'flemish'],
    zones: [
      { id: 'all', name: 'Ana Arka Fon Duvarı', nameEn: 'Main Background' },
      { id: 'bar', name: 'Bar Bankosu Altı', nameEn: 'Bar Counter' },
      { id: 'arch', name: 'Kemer & Kolonlar', nameEn: 'Arches & Columns' }
    ]
  },
  {
    id: 'fireplace-living',
    name: 'Şömine & Salon Duvarı',
    nameEn: 'Fireplace & Living Accent',
    tag: 'İç Mekan & Şömine',
    tagEn: 'Living & Fireplace',
    description: 'Lüks şömine nişi, ahşap detaylar ve konforlu salon tuğla kaplaması.',
    thumbnail: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    type: 'interior',
    aspectRatio: '16:10',
    defaultScale: 0.95,
    supportedBonds: ['herringbone', 'stretcher', 'stack', 'soldier'],
    zones: [
      { id: 'all', name: 'Komple Şömine Duvarı', nameEn: 'Full Fireplace Wall' },
      { id: 'chimney', name: 'Sadece Şömine Bacası', nameEn: 'Chimney Breast' },
      { id: 'niche', name: 'Yan Nişler', nameEn: 'Side Niches' }
    ]
  },
  {
    id: 'garden-landscape',
    name: 'Bahçe Duvarı & Peyzaj',
    nameEn: 'Garden Wall & Landscape',
    tag: 'Peyzaj & Dış Mekan',
    tagEn: 'Landscape & Outdoor',
    description: 'Bahçe çevreleme duvarı, yeşil peyzaj ve doğal gün ışığı altında tuğla dokusu.',
    thumbnail: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    type: 'landscape',
    aspectRatio: '16:10',
    defaultScale: 1.05,
    supportedBonds: ['stretcher', 'stack', 'flemish'],
    zones: [
      { id: 'all', name: 'Tüm Bahçe Duvarı', nameEn: 'Full Garden Wall' },
      { id: 'pillars', name: 'Harpuşta & Kolonlar', nameEn: 'Pillars & Caps' }
    ]
  },
  {
    id: 'commercial-plaza',
    name: 'Plaza & Mağaza Cephesi',
    nameEn: 'Plaza & Retail Storefront',
    tag: 'Ticari & Kurumsal',
    tagEn: 'Commercial & Retail',
    description: 'Büyük vitrin pencereleri ve modern klinker mimarisi.',
    thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    type: 'exterior',
    aspectRatio: '16:10',
    defaultScale: 1.15,
    supportedBonds: ['soldier', 'stretcher', 'stack', 'herringbone'],
    zones: [
      { id: 'all', name: 'Tüm Bina Cephesi', nameEn: 'Full Building Facade' },
      { id: 'storefront', name: 'Zemin Kat Vitrini', nameEn: 'Storefront Portal' }
    ]
  }
];

/**
 * Masonry Bond / Layout Patterns
 */
export const STUDIO_PATTERNS = [
  {
    id: 'stretcher',
    name: 'Yatay Yarım Örgü',
    nameEn: 'Stretcher Bond',
    description: 'Geleneksel 1/2 kaydırmalı yatay tuğla dizilimi.',
    supportedRotations: [0, 90],
    isCompatible: (p) => true
  },
  {
    id: 'stack',
    name: 'Düz Sıra (İstifleme)',
    nameEn: 'Stack Bond',
    description: 'Derzlerin dikey ve yatay hizalandığı modern geometrik dizilim.',
    supportedRotations: [0, 90],
    isCompatible: (p) => true
  },
  {
    id: 'soldier',
    name: 'Dikey (Dik Asker)',
    nameEn: 'Soldier / Vertical Bond',
    description: 'Tuğlaların dik konumlandırıldığı çağdaş cephe dizilimi.',
    supportedRotations: [0, 90],
    isCompatible: (p) => !p?.anaKategori?.includes('KAPLAMA TAŞI')
  },
  {
    id: 'herringbone',
    name: 'Balıksırtı (45° / 90°)',
    nameEn: 'Herringbone Pattern',
    description: '45 derecelik açıyla zikzak oluşturan prestijli örgü.',
    supportedRotations: [0, 45],
    isCompatible: (p) => !p?.anaKategori?.includes('BLOK')
  },
  {
    id: 'flemish',
    name: 'Flaman Örgüsü',
    nameEn: 'Flemish Bond',
    description: 'Uzun ve kısa tuğla başlarının dönüşümlü dizildiği tarihi karakterli örgü.',
    supportedRotations: [0],
    isCompatible: (p) => !p?.anaKategori?.includes('KAPLAMA TAŞI')
  }
];

/**
 * Mortar / Grout Colors with realistic depth
 */
export const STUDIO_MORTARS = [
  { id: 'white', name: 'Krem / Beyaz Harç', hex: '#EDE8E1', darkHex: '#C9C2B7', shadow: 'rgba(0,0,0,0.18)' },
  { id: 'light-gray', name: 'Açık Gri Harç', hex: '#C4BDB7', darkHex: '#9E978F', shadow: 'rgba(0,0,0,0.22)' },
  { id: 'medium-gray', name: 'Klasik Çimento Grisi', hex: '#8C857F', darkHex: '#69625D', shadow: 'rgba(0,0,0,0.28)' },
  { id: 'dark-graphite', name: 'Koyu Grafit', hex: '#4A4643', darkHex: '#302D2A', shadow: 'rgba(0,0,0,0.35)' },
  { id: 'anthracite-black', name: 'Antrasit Siyah Harç', hex: '#242220', darkHex: '#121110', shadow: 'rgba(0,0,0,0.45)' }
];

/**
 * Mortar Thickness Options
 */
export const STUDIO_MORTAR_WIDTHS = [
  { id: 5, label: '5 mm', name: 'İnce Derz' },
  { id: 8, label: '8 mm', name: 'Standart İnce' },
  { id: 10, label: '10 mm', name: 'Mimari Standart' },
  { id: 12, label: '12 mm', name: 'Geniş Rustik' },
  { id: 15, label: '15 mm', name: 'Ekstra Derin' }
];

/**
 * Adapter layer: Maps raw products from products_db.json into studio format with physical brick metrics
 */
export function getStudioProducts() {
  const rawList = safeGetProducts();
  return rawList.map((p) => {
    let unitWidthMm = 215;
    let unitHeightMm = 65;

    if (p.stokKodu?.startsWith('DCK')) {
      unitWidthMm = 240;
      unitHeightMm = 70;
    } else if (p.anaKategori?.includes('PRES')) {
      unitWidthMm = 215;
      unitHeightMm = 65;
    } else if (p.anaKategori?.includes('KAPLAMA TAŞI')) {
      unitWidthMm = 280;
      unitHeightMm = 90;
    }

    const mainImg = p.mainImage || (p.images && p.images[0]) || p.gorsel || '/assets/brand/hero-bg.jpg';

    return {
      ...p,
      studioImg: mainImg,
      unitWidthMm,
      unitHeightMm,
      aspectRatio: unitWidthMm / unitHeightMm,
      colorHex: p.renkHex || '#A63A22'
    };
  });
}

/**
 * Encode current studio design state to shareable URL query string
 */
export function encodeDesignToUrl(design) {
  try {
    const payload = {
      s: design.surface?.id,
      p: design.primaryProduct?.stokKodu,
      b: design.pattern?.id,
      r: design.rotation || 0,
      m: design.mortar?.id,
      w: design.mortarWidth?.id,
      sc: design.scale || 1,
      z: design.zone?.id,
      mx: design.isMixActive ? (design.mixProducts || []).map(item => `${item.product?.stokKodu}:${item.percentage}`).join(';') : null
    };
    const jsonStr = JSON.stringify(payload);
    return btoa(encodeURIComponent(jsonStr));
  } catch (e) {
    return '';
  }
}

/**
 * Decode shared URL query string back to design state
 */
export function decodeDesignFromUrl(encodedStr, allProducts = []) {
  try {
    const jsonStr = decodeURIComponent(atob(encodedStr));
    const payload = JSON.parse(jsonStr);

    const surface = STUDIO_SURFACES.find(s => s.id === payload.s) || STUDIO_SURFACES[0];
    const primaryProduct = allProducts.find(p => p.stokKodu === payload.p) || allProducts[0];
    const pattern = STUDIO_PATTERNS.find(b => b.id === payload.b) || STUDIO_PATTERNS[0];
    const mortar = STUDIO_MORTARS.find(m => m.id === payload.m) || STUDIO_MORTARS[1];
    const mortarWidth = STUDIO_MORTAR_WIDTHS.find(w => w.id === payload.w) || STUDIO_MORTAR_WIDTHS[2];
    const zone = surface.zones.find(z => z.id === payload.z) || surface.zones[0];

    let isMixActive = false;
    let mixProducts = [];

    if (payload.mx) {
      isMixActive = true;
      const parts = payload.mx.split(';');
      mixProducts = parts.map(part => {
        const [code, pct] = part.split(':');
        const prod = allProducts.find(p => p.stokKodu === code);
        return prod ? { product: prod, percentage: parseInt(pct, 10) || 50 } : null;
      }).filter(Boolean);
    }

    return {
      surface,
      primaryProduct,
      pattern,
      rotation: payload.r || 0,
      mortar,
      mortarWidth,
      scale: payload.sc || 1,
      zone,
      isMixActive,
      mixProducts: mixProducts.length > 0 ? mixProducts : [{ product: primaryProduct, percentage: 100 }]
    };
  } catch (e) {
    return null;
  }
}
