import productsDb from "./products_db.json";

const defaultProducts = Array.isArray(productsDb) ? productsDb : [];

export function safeGetProducts() {
  return defaultProducts;
}

export const PRODUCTS = defaultProducts;

export function getAllProducts() {
  return defaultProducts;
}

export function getProductByStockCode(codeOrId) {
  if (!codeOrId) return null;
  const target = String(codeOrId).trim().toLowerCase();
  
  return defaultProducts.find((p) => {
    if (!p) return false;
    const idMatch = p.id && String(p.id).toLowerCase() === target;
    const codeMatch = p.stokKodu && String(p.stokKodu).trim().toLowerCase() === target;
    const cleanCodeMatch = p.stokKodu && String(p.stokKodu).replace(/[^a-zA-Z0-9]/g, "").toLowerCase() === target.replace(/[^a-zA-Z0-9]/g, "");
    return idMatch || codeMatch || cleanCodeMatch;
  }) || null;
}

export function getMainCategories() {
  const cats = new Set();
  defaultProducts.forEach((p) => {
    if (p && p.anaKategori) cats.add(String(p.anaKategori).trim());
  });
  return Array.from(cats).sort();
}

export const MAIN_CATEGORIES_DATA = [
  { id: "PRES TUĞLALAR", nameTr: "Pres Tuğlalar", nameEn: "Pressed Bricks & Pavers" },
  { id: "KAPLAMA TUĞLASI", nameTr: "Kaplama Tuğlası", nameEn: "Facing & Cladding Bricks" },
  { id: "BLOK TUĞLALAR VE BACALAR", nameTr: "Blok Tuğlalar ve Bacalar", nameEn: "Block Bricks & Chimneys" },
  { id: "KAPLAMA TAŞI", nameTr: "Kaplama Taşı", nameEn: "Veneer & Culture Stones" },
  { id: "YAPI KİMYASALLARI", nameTr: "Yapı Kimyasalları", nameEn: "Building Chemicals & Grouts" },
  { id: "RESTORASYON ÜRÜNLERİ", nameTr: "Restorasyon Ürünleri", nameEn: "Restoration & Heritage Products" },
  { id: "KİREMİTLER", nameTr: "Kiremitler", nameEn: "Roof Tiles & Accessories" },
  { id: "BETON ÜRÜNLER", nameTr: "Beton Ürünler", nameEn: "Concrete Architectural Elements" },
  { id: "FIRIN MALZEMELERİ", nameTr: "Fırın Malzemeleri", nameEn: "Oven Materials & Firebricks" },
  { id: "FIRIN VE BARBEKÜLER", nameTr: "Fırın ve Barbeküler", nameEn: "Prefab Ovens & BBQs" },
  { id: "TİCARİ ÜRÜNLER", nameTr: "Ticari Ürünler", nameEn: "Commercial Products" }
];

export const CATEGORIES_TR = ["Tüm Ürünler", ...MAIN_CATEGORIES_DATA.map(c => c.nameTr)];
export const CATEGORIES_EN = ["All Products", ...MAIN_CATEGORIES_DATA.map(c => c.nameEn)];

export function getRelatedProducts(product, limit = 4) {
  if (!product) return [];
  return defaultProducts
    .filter((p) => p && p.stokKodu !== product.stokKodu && (p.anaKategori === product.anaKategori || p.altKategori === product.altKategori))
    .slice(0, limit);
}

export function getSubcategories(anaKategori = "Tümü") {
  const subCats = new Set();
  defaultProducts.forEach((p) => {
    if (!p) return;
    const matchesMain = !anaKategori || anaKategori === "Tümü" || anaKategori === "All" || p.anaKategori === anaKategori;
    if (matchesMain && p.altKategori) {
      subCats.add(String(p.altKategori).trim());
    }
  });
  return Array.from(subCats).sort();
}

export function getStockCodes(anaKategori = "Tümü", altKategori = "Tümü") {
  const codeMap = new Map();
  defaultProducts.forEach((p) => {
    if (!p || !p.stokKodu) return;
    const matchesMain = !anaKategori || anaKategori === "Tümü" || anaKategori === "All" || p.anaKategori === anaKategori;
    const matchesSub = !altKategori || altKategori === "Tümü" || altKategori === "All" || p.altKategori === altKategori;
    if (matchesMain && matchesSub) {
      const code = String(p.stokKodu).trim();
      if (!codeMap.has(code)) {
        codeMap.set(code, {
          stokKodu: code,
          stokAdi: p.stokAdi ? String(p.stokAdi).trim() : code
        });
      }
    }
  });
  return Array.from(codeMap.values()).sort((a, b) => a.stokKodu.localeCompare(b.stokKodu));
}

export function filterProducts({ anaKategori = "Tümü", altKategori = "Tümü", stokKodu = "Tümü", searchQuery = "" }) {
  return defaultProducts.filter((p) => {
    if (!p) return false;
    const matchesMain = !anaKategori || anaKategori === "Tümü" || anaKategori === "All" || p.anaKategori === anaKategori;
    const matchesSub = !altKategori || altKategori === "Tümü" || altKategori === "All" || p.altKategori === altKategori;
    const matchesCode = !stokKodu || stokKodu === "Tümü" || stokKodu === "All" || p.stokKodu === stokKodu;

    let matchesQuery = true;
    if (searchQuery && searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      const nameMatch = p.stokAdi && String(p.stokAdi).toLowerCase().includes(q);
      const codeMatch = p.stokKodu && String(p.stokKodu).toLowerCase().includes(q);
      const descMatch = p.aciklama && String(p.aciklama).toLowerCase().includes(q);
      matchesQuery = nameMatch || codeMatch || descMatch;
    }

    return matchesMain && matchesSub && matchesCode && matchesQuery;
  });
}

export function getTopCategories(limit = 6) {
  const catCounts = {};
  defaultProducts.forEach((p) => {
    if (!p) return;
    const cat = p.altKategori || p.anaKategori;
    if (cat) {
      catCounts[cat] = (catCounts[cat] || 0) + 1;
    }
  });

  return Object.entries(catCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
}
