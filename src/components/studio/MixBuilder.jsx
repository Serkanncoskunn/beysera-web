import React from 'react';
import { Sparkles, Trash2, Plus, AlertCircle } from 'lucide-react';

export default function MixBuilder({
  lang = 'TR',
  isMixActive,
  onToggleMix,
  mixProducts = [],
  onUpdateMixProducts,
  onSwitchToProductsTab
}) {
  const isEn = lang === 'EN';

  // Handle slider change with proportional rebalancing
  const handleSliderChange = (code, newVal) => {
    const targetVal = Math.max(5, Math.min(90, parseInt(newVal, 10) || 10));
    if (mixProducts.length <= 1) return;

    if (mixProducts.length === 2) {
      const otherItem = mixProducts.find(p => p.product.stokKodu !== code);
      const updated = mixProducts.map(p => {
        if (p.product.stokKodu === code) return { ...p, percentage: targetVal };
        return { ...p, percentage: 100 - targetVal };
      });
      onUpdateMixProducts(updated);
      return;
    }

    // 3 items rebalancing
    const currentItem = mixProducts.find(p => p.product.stokKodu === code);
    const otherItems = mixProducts.filter(p => p.product.stokKodu !== code);
    const remainder = 100 - targetVal;
    const currentOtherSum = otherItems.reduce((acc, it) => acc + it.percentage, 0) || 1;

    const updatedOthers = otherItems.map((it, idx) => {
      if (idx === otherItems.length - 1) {
        // Last item gets exact remainder to guarantee 100% total
        const prevAssigned = otherItems.slice(0, -1).reduce((acc, prev) => acc + Math.round((prev.percentage / currentOtherSum) * remainder), 0);
        return { ...it, percentage: Math.max(5, remainder - prevAssigned) };
      }
      return { ...it, percentage: Math.max(5, Math.round((it.percentage / currentOtherSum) * remainder)) };
    });

    const finalMix = mixProducts.map(p => {
      if (p.product.stokKodu === code) return { ...p, percentage: targetVal };
      return updatedOthers.find(o => o.product.stokKodu === p.product.stokKodu);
    });

    onUpdateMixProducts(finalMix);
  };

  const handleRemoveItem = (code) => {
    if (mixProducts.length <= 1) return;
    const filtered = mixProducts.filter(p => p.product.stokKodu !== code);
    const perItem = Math.floor(100 / filtered.length);
    const rebalanced = filtered.map((it, idx) => ({
      ...it,
      percentage: idx === filtered.length - 1 ? 100 - perItem * (filtered.length - 1) : perItem
    }));
    onUpdateMixProducts(rebalanced);
  };

  const totalPercentage = mixProducts.reduce((acc, p) => acc + (p.percentage || 0), 0);

  return (
    <div className="mix-builder-wrap">
      <div className="section-intro-header">
        <div>
          <h4>{isEn ? '5. Multi-Product MIX Blend' : '5. Çoklu Ürün MIX (Karışım)'}</h4>
          <p>{isEn ? 'Combine 2-3 brick models with custom distribution.' : 'Farklı tuğla renklerini belirlediğiniz oranlarda tek cephede harmanlayın.'}</p>
        </div>
        <button
          className={`mix-toggle-switch ${isMixActive ? 'active' : ''}`}
          onClick={onToggleMix}
        >
          {isMixActive ? (isEn ? 'MIX ON' : 'AÇIK') : (isEn ? 'MIX OFF' : 'KAPALI')}
        </button>
      </div>

      {!isMixActive ? (
        <div className="mix-inactive-card">
          <Sparkles size={28} className="sparkle-icon" />
          <h5>{isEn ? 'MIX Mode is Deactivated' : 'MIX Modu Kapalı'}</h5>
          <p>{isEn ? 'Activate MIX to combine multiple bricks seamlessly across the facade.' : 'Yukarıdaki butona basarak MIX modunu etkinleştirebilir ve mimarinizde birden fazla tuğla rengini harmanlayabilirsiniz.'}</p>
          <button className="btn-enable-mix" onClick={onToggleMix}>
            {isEn ? 'Enable MIX Mode' : 'MIX Modunu Etkinleştir'}
          </button>
        </div>
      ) : (
        <div className="mix-active-card">
          {/* Percentage Sum Check */}
          <div className="mix-total-status-bar">
            <span>{isEn ? 'Total Composition:' : 'Toplam Karışım Oranı:'}</span>
            <span className={`total-pct ${totalPercentage === 100 ? 'valid' : 'adjust'}`}>
              %{totalPercentage}
            </span>
          </div>

          <div className="mix-products-list">
            {mixProducts.map((item) => (
              <div key={item.product?.stokKodu || item.product?.id} className="mix-row-item">
                <div className="mix-thumb-area">
                  <img
                    src={item.product?.studioImg || item.product?.gorsel || '/assets/brand/hero-bg.jpg'}
                    alt={item.product?.stokAdi}
                    className="mix-img"
                  />
                  <div className="mix-text-meta">
                    <span className="mix-code-label">{item.product?.stokKodu}</span>
                    <h5 className="mix-name-label">{item.product?.stokAdi}</h5>
                  </div>
                </div>

                <div className="mix-slider-area">
                  <div className="pct-badge-display">%{item.percentage}</div>
                  <input
                    type="range"
                    min="5"
                    max="90"
                    step="5"
                    value={item.percentage}
                    onChange={(e) => handleSliderChange(item.product?.stokKodu, e.target.value)}
                    className="studio-slider-input"
                  />
                </div>

                {mixProducts.length > 1 && (
                  <button
                    className="btn-delete-mix"
                    onClick={() => handleRemoveItem(item.product?.stokKodu)}
                    title={isEn ? 'Remove from MIX' : 'Karışımdan Çıkar'}
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {mixProducts.length < 3 && (
            <button className="btn-add-more-prods" onClick={onSwitchToProductsTab}>
              <Plus size={14} />
              <span>{isEn ? 'Select More Products from Catalog' : 'Katalogdan Başka Tuğla Ekle'}</span>
            </button>
          )}
        </div>
      )}

      <style>{`
        .mix-builder-wrap {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .section-intro-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }
        .section-intro-header h4 {
          font-size: 1rem;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 3px 0;
          font-family: var(--font-heading);
        }
        .section-intro-header p {
          font-size: 0.78rem;
          color: #A8A29E;
          margin: 0;
          line-height: 1.35;
        }
        .mix-toggle-switch {
          padding: 6px 14px;
          border-radius: 20px;
          border: 1.5px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.05);
          color: #A8A29E;
          font-size: 0.72rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .mix-toggle-switch.active {
          background: var(--accent-terracotta);
          border-color: var(--accent-terracotta);
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(224, 90, 48, 0.3);
        }

        .mix-inactive-card {
          background: #201D1A;
          border: 1px dashed rgba(255, 255, 255, 0.15);
          border-radius: 10px;
          padding: 24px 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .sparkle-icon {
          color: var(--accent-terracotta);
        }
        .mix-inactive-card h5 {
          font-size: 0.95rem;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0;
        }
        .mix-inactive-card p {
          font-size: 0.8rem;
          color: #A8A29E;
          margin: 0;
          line-height: 1.4;
        }
        .btn-enable-mix {
          padding: 8px 18px;
          background: var(--accent-terracotta);
          border: none;
          color: #FFFFFF;
          font-weight: 700;
          font-size: 0.82rem;
          border-radius: 6px;
          cursor: pointer;
          margin-top: 4px;
        }

        .mix-active-card {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .mix-total-status-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #201D1A;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 0.78rem;
          color: #D6D3D1;
        }
        .total-pct.valid {
          color: #22C55E;
          font-weight: 800;
        }

        .mix-products-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .mix-row-item {
          background: #201D1A;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 10px 12px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .mix-thumb-area {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 130px;
          flex-shrink: 0;
        }
        .mix-img {
          width: 38px;
          height: 38px;
          border-radius: 4px;
          object-fit: contain;
          background: #FFFFFF;
          padding: 2px;
        }
        .mix-text-meta {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .mix-code-label {
          font-size: 0.65rem;
          color: var(--accent-terracotta);
          font-weight: 700;
        }
        .mix-name-label {
          font-size: 0.76rem;
          color: #FFFFFF;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .mix-slider-area {
          flex-grow: 1;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .pct-badge-display {
          font-size: 0.8rem;
          font-weight: 800;
          color: var(--accent-terracotta);
          width: 36px;
        }
        .studio-slider-input {
          width: 100%;
          accent-color: var(--accent-terracotta);
          cursor: pointer;
        }
        .btn-delete-mix {
          background: none;
          border: none;
          color: #EF4444;
          cursor: pointer;
          padding: 4px;
          transition: transform 0.2s ease;
        }
        .btn-delete-mix:hover {
          transform: scale(1.15);
        }

        .btn-add-more-prods {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px dashed rgba(255, 255, 255, 0.15);
          color: #D6D3D1;
          font-size: 0.78rem;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-add-more-prods:hover {
          border-color: var(--accent-terracotta);
          color: #FFFFFF;
          background: rgba(224, 90, 48, 0.08);
        }
      `}</style>
    </div>
  );
}
