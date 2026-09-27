// src/studio/data/patterns.js
export const PATTERNS = [
  {
    id: 'running-bond',
    nameTr: 'Yarım Kaydırmalı',
    nameEn: 'Running Bond (1/2)',
    descTr: 'Klasik yarım tuğla kaydırmalı geleneksel örgü',
    descEn: 'Classic half-stretcher running bond',
    offsetFraction: 0.5,
    orientation: 'horizontal',
    aspectRatio: 3.0
  },
  {
    id: 'one-third-bond',
    nameTr: 'Üçte Bir Kaydırmalı',
    nameEn: 'Third Bond (1/3)',
    descTr: 'Modern klinker mimarisinde tercih edilen 1/3 kaydırma',
    descEn: 'Contemporary one-third stretcher offset pattern',
    offsetFraction: 0.3333,
    orientation: 'horizontal',
    aspectRatio: 3.0
  },
  {
    id: 'stack-horizontal',
    nameTr: 'Yatay Düz (Hizalı)',
    nameEn: 'Stack Bond (Horizontal)',
    descTr: 'Derzlerin alt alta hizalandığı minimalist yatay dizilim',
    descEn: 'Minimalist horizontal stack bond with aligned joints',
    offsetFraction: 0.0,
    orientation: 'horizontal',
    aspectRatio: 3.0
  },
  {
    id: 'stack-vertical',
    nameTr: 'Dikey Düz (Hizalı)',
    nameEn: 'Stack Bond (Vertical)',
    descTr: 'Yüksek tavan ve modern cepheler için dikey dizilim',
    descEn: 'Vertical stack bond emphasizing height and modern lines',
    offsetFraction: 0.0,
    orientation: 'vertical',
    aspectRatio: 0.3333
  },
  {
    id: 'herringbone',
    nameTr: 'Balıksırtı (45°)',
    nameEn: 'Herringbone (45°)',
    descTr: 'Prestijli iç mekanlar ve şömine odak duvarları',
    descEn: 'Distinctive diagonal zigzag pattern for accent walls',
    offsetFraction: 0.0,
    orientation: 'herringbone',
    aspectRatio: 3.0
  },
  {
    id: 'flemish-bond',
    nameTr: 'Flaman Örgüsü',
    nameEn: 'Flemish Bond',
    descTr: 'Tarihi restorasyon ve antik tuğlalar için uzun-kısa ritim',
    descEn: 'Alternating headers and stretchers for authentic heritage charm',
    offsetFraction: 0.5,
    orientation: 'flemish',
    aspectRatio: 3.0
  }
];

export function getPatternById(id) {
  return PATTERNS.find(p => p.id === id) || PATTERNS[0];
}
