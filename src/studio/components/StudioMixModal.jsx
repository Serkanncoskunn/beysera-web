// src/studio/components/StudioMixModal.jsx
import React, { useState, useMemo, useRef } from "react";
import { 
  X, Layers, Check, Plus, Trash2, Search, Sliders, ChevronLeft, ChevronRight, 
  Filter, Grid, SplitSquareVertical, SplitSquareHorizontal, Shuffle, Columns
} from "lucide-react";
import { getMainCategories } from "../../data/products";

const BLEND_MODES = [
  {
    id: "random",
    nameTr: "Rastgele Harman",
    nameEn: "Random Kiln Blend",
    descTr: "Tuğlalar belirlenen yüzdelere göre cepheye bire bir serpiştirilir.",
    icon: Shuffle
  },
  {
    id: "alternating",
    nameTr: "Ard Arda / Sıralı",
    nameEn: "Alternating Courses",
    descTr: "Satır satır ard arda dizilim.",
    icon: SplitSquareVertical
  },
  {
    id: "split-left-right",
    nameTr: "Sol / Sağ Bölünmüş",
    nameEn: "Split Left / Right",
    descTr: "Sol taraf 1. tuğla, sağ taraf 2. tuğla.",
    icon: SplitSquareHorizontal
  },
  {
    id: "split-top-bottom",
    nameTr: "Alt / Üst Bölünmüş",
    nameEn: "Split Top / Bottom",
    descTr: "Alt kat baza 1. tuğla, üst katlar 2. tuğla.",
    icon: Columns
  },
  {
    id: "accent-pillar",
    nameTr: "Merkez / Kolon Vurgusu",
    nameEn: "Pillar Feature",
    descTr: "Merkez kolon 1. tuğla, dış cephe 2. tuğla.",
    icon: Grid
  }
];

export default function StudioMixModal({
  isOpen,
  onClose,
  allProducts = [],
  currentProduct = null,
  onApplyMix,
  isEn
}) {
  const [selectedBricks, setSelectedBricks] = useState(() => {
    const prod1 = currentProduct || allProducts[0] || null;
    const prod2 = allProducts.find(p => p.stokKodu !== prod1?.stokKodu) || allProducts[1] || allProducts[0];
    return [
      { product: prod1, ratio: 50, slotLabel: "1. Tuğla" },
      { product: prod2, ratio: 50, slotLabel: "2. Tuğla" }
    ];
  });

  const [blendMode, setBlendMode] = useState("random");
  const [activeSlotIndex, setActiveSlotIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  const carouselRef = useRef(null);

  const categories = useMemo(() => {
    return ["Tümü", ...getMainCategories()];
  }, []);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      const matchCat =
        selectedCategory === "Tümü" ||
        (p.anaKategori && p.anaKategori.toLowerCase().includes(selectedCategory.toLowerCase())) ||
        (p.altKategori && p.altKategori.toLowerCase().includes(selectedCategory.toLowerCase()));

      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        (p.stokKodu && p.stokKodu.toLowerCase().includes(q)) ||
        (p.stokAdi && p.stokAdi.toLowerCase().includes(q));

      return matchCat && matchSearch;
    });
  }, [allProducts, selectedCategory, searchQuery]);

  if (!isOpen) return null;

  const scrollCarousel = (direction) => {
    if (!carouselRef.current) return;
    const distance = 320;
    carouselRef.current.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth"
    });
  };

  // 100% Linked Ratio Logic
  const handleRatioChange = (index, rawValue) => {
    const updated = selectedBricks.map(b => ({ ...b }));
    const val = Math.max(5, Math.min(95, Math.round(Number(rawValue))));

    if (updated.length === 2) {
      const otherIdx = index === 0 ? 1 : 0;
      updated[index].ratio = val;
      updated[otherIdx].ratio = 100 - val;
    } else {
      const oldVal = updated[index].ratio;
      const diff = val - oldVal;
      updated[index].ratio = val;
      const others = updated.filter((_, i) => i !== index);
      if (others.length > 0) {
        const perOther = diff / others.length;
        updated.forEach((it, i) => {
          if (i !== index) {
            it.ratio = Math.max(5, Math.round(it.ratio - perOther));
          }
        });
        const sum = updated.reduce((s, it) => s + it.ratio, 0);
        if (sum !== 100) {
          const lastIdx = updated.findLastIndex((_, i) => i !== index);
          if (lastIdx !== -1) updated[lastIdx].ratio += (100 - sum);
        }
      }
    }
    setSelectedBricks(updated);
  };

  const handleSelectProductForSlot = (prod) => {
    const updated = [...selectedBricks];
    if (updated[activeSlotIndex]) {
      updated[activeSlotIndex].product = prod;
    } else {
      updated.push({ product: prod, ratio: 30 });
    }
    setSelectedBricks(updated);
  };

  const handleAddBrick = () => {
    if (selectedBricks.length >= 3) return;
    const count = selectedBricks.length + 1;
    const newRatio = Math.floor(100 / count);
    const updated = selectedBricks.map(b => ({ ...b, ratio: newRatio }));
    const unusedProd = allProducts.find(
      (p) => !selectedBricks.some((b) => b.product && b.product.stokKodu === p.stokKodu)
    ) || allProducts[0];

    updated.push({
      product: unusedProd,
      ratio: 100 - (newRatio * (count - 1)),
      slotLabel: `${count}. Tuğla`
    });

    setSelectedBricks(updated);
    setActiveSlotIndex(updated.length - 1);
  };

  const handleRemoveBrick = (index) => {
    if (selectedBricks.length <= 2) return;
    const updated = selectedBricks.filter((_, i) => i !== index);
    const sum = updated.reduce((s, it) => s + it.ratio, 0);
    updated.forEach(it => {
      it.ratio = Math.round((it.ratio / sum) * 100);
    });
    const finalSum = updated.reduce((s, it) => s + it.ratio, 0);
    if (finalSum !== 100) updated[0].ratio += (100 - finalSum);

    setSelectedBricks(updated);
    setActiveSlotIndex(0);
  };

  const handleApply = () => {
    if (onApplyMix) {
      onApplyMix({
        items: selectedBricks,
        mode: blendMode
      });
    }
    onClose();
  };

  return (
    <div className="studio-mix-modal-overlay" onClick={onClose}>
      <div className="compact-mix-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* 1. COMPACT HEADER */}
        <div className="compact-mix-header">
          <div className="header-left-title">
            <div className="icon-badge-terracotta">
              <Layers size={18} />
            </div>
            <div>
              <h3 className="mix-modal-main-title">Karışım Hazırla</h3>
              <span className="mix-modal-sub-desc">Tuğlaları seçin, oranları ve yerleşim biçimini belirleyin</span>
            </div>
          </div>
          <button className="btn-close-compact-modal" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* 2. COMPACT BODY */}
        <div className="compact-mix-body">
          {/* LAYOUT MODES ROW */}
          <div className="compact-section">
            <label className="compact-section-label">1. Cephe Dağılım Biçimi</label>
            <div className="compact-modes-row">
              {BLEND_MODES.map((mode) => {
                const IconComp = mode.icon;
                const isSelected = blendMode === mode.id;

                return (
                  <button
                    key={mode.id}
                    className={`compact-mode-btn ${isSelected ? "active" : ""}`}
                    onClick={() => setBlendMode(mode.id)}
                    title={mode.descTr}
                  >
                    <IconComp size={15} />
                    <span>{mode.nameTr}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SLOTS & 100% SLIDERS */}
          <div className="compact-section">
            <div className="section-label-flex">
              <label className="compact-section-label">2. Seçili Tuğlalar & Harman Oranları (Toplam %100)</label>
              <span className="active-slot-tip">Seçili Yuva: #{activeSlotIndex + 1} (Alttan tuğlaya tıklayarak değiştirin)</span>
            </div>

            <div className="compact-slots-row">
              {selectedBricks.map((item, idx) => {
                const prod = item.product;
                const imgSrc = prod?.mainImage || (prod?.images && prod.images[0]) || "/assets/products/ANT01.jpg";
                const isActive = activeSlotIndex === idx;

                return (
                  <div
                    key={idx}
                    className={`compact-slot-card ${isActive ? "active-slot" : ""}`}
                    onClick={() => setActiveSlotIndex(idx)}
                  >
                    <div className="slot-top-bar">
                      <span className="slot-num-badge">#{idx + 1}</span>
                      <span className="slot-title-text">{prod?.stokAdi || "Tuğla Seçin"}</span>
                      {selectedBricks.length > 2 && (
                        <button
                          className="btn-trash-slot"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveBrick(idx);
                          }}
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>

                    <div className="slot-content-row">
                      <div className="slot-image-thumb">
                        <img src={imgSrc} alt={prod?.stokAdi || "Tuğla"} />
                      </div>

                      <div className="slot-slider-group" onClick={(e) => e.stopPropagation()}>
                        <div className="slider-val-row">
                          <span>Harman Payı:</span>
                          <strong>%{item.ratio}</strong>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max="95"
                          step="1"
                          value={item.ratio}
                          onChange={(e) => handleRatioChange(idx, e.target.value)}
                          className="compact-slider"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              {selectedBricks.length < 3 && blendMode === "random" && (
                <button className="btn-add-compact-slot" onClick={handleAddBrick}>
                  <Plus size={16} />
                  <span>3. Tuğla Ekle</span>
                </button>
              )}
            </div>
          </div>

          {/* QUICK BOTTOM PRODUCT SELECTOR */}
          <div className="compact-section">
            <div className="catalog-header-flex">
              <label className="compact-section-label">3. Tuğla Seçin (Seçili #{activeSlotIndex + 1}. yuvaya atanır)</label>
              
              <div className="compact-search-box">
                <Search size={13} className="search-icon-gray" />
                <input
                  type="text"
                  placeholder="Ürün ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="compact-carousel-wrap">
              <button className="carousel-btn left" onClick={() => scrollCarousel("left")}>
                <ChevronLeft size={16} />
              </button>

              <div className="compact-carousel-track" ref={carouselRef}>
                {filteredProducts.map((p) => {
                  const imgSrc = p.mainImage || (p.images && p.images[0]) || "/assets/products/ANT01.jpg";
                  const isCurrentSlot = selectedBricks[activeSlotIndex]?.product?.stokKodu === p.stokKodu;

                  return (
                    <div
                      key={p.stokKodu}
                      className={`compact-prod-swatch ${isCurrentSlot ? "picked" : ""}`}
                      onClick={() => handleSelectProductForSlot(p)}
                    >
                      <div className="swatch-frame">
                        <img src={imgSrc} alt={p.stokAdi} loading="lazy" />
                        {isCurrentSlot && (
                          <div className="picked-badge">
                            <Check size={11} strokeWidth={3} />
                          </div>
                        )}
                      </div>
                      <span className="swatch-name">{p.stokAdi}</span>
                    </div>
                  );
                })}
              </div>

              <button className="carousel-btn right" onClick={() => scrollCarousel("right")}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* 3. COMPACT FOOTER */}
        <div className="compact-mix-footer">
          <button className="btn-cancel-modal" onClick={onClose}>
            Vazgeç
          </button>
          <button className="btn-apply-modal" onClick={handleApply}>
            <Check size={15} />
            <span>Karışımı Uygula</span>
          </button>
        </div>
      </div>
    </div>
  );
}
