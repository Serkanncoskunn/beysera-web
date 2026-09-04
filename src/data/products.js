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

export const CATEGORIES_TR = ["Tüm Ürünler", "Tuğla", "Kaplama Tuğlası", "Kültür Tuğlası", "Pres Tuğlalar", "Ateş Tuğlaları", "Yapı Kimyasalları"];
export const CATEGORIES_EN = ["All Products", "Bricks", "Facing Bricks", "Culture Bricks", "Pressed Bricks", "Fire Bricks", "Building Chemicals"];

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
