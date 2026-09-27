// src/studio/data/groutColors.js
export const GROUT_COLORS = [
  {
    id: 'anthracite',
    nameTr: 'Antrasit / Siyah',
    nameEn: 'Anthracite / Dark',
    hex: '#262422',
    border: '#1A1817'
  },
  {
    id: 'cement-grey',
    nameTr: 'Çimento Grisi',
    nameEn: 'Cement Grey',
    hex: '#7A7571',
    border: '#65605C'
  },
  {
    id: 'beige-sand',
    nameTr: 'Bej / Doğal Kum',
    nameEn: 'Beige / Natural Sand',
    hex: '#C8BAA8',
    border: '#B3A593'
  },
  {
    id: 'ivory-white',
    nameTr: 'Kırık Beyaz / Fildişi',
    nameEn: 'Ivory White',
    hex: '#EAE6DF',
    border: '#D5D1CA'
  },
  {
    id: 'terracotta',
    nameTr: 'Kiremit / Toprak',
    nameEn: 'Terracotta Earth',
    hex: '#8C3D28',
    border: '#73301E'
  }
];

export const GROUT_WIDTHS = [
  { value: 0, label: '0 mm (Derzsiz / Kuru Yığma)', labelShort: '0 mm' },
  { value: 5, label: '5 mm (İnce Derz)', labelShort: '5 mm' },
  { value: 8, label: '8 mm (Standart Modern)', labelShort: '8 mm' },
  { value: 10, label: '10 mm (Geleneksel)', labelShort: '10 mm' },
  { value: 12, label: '12 mm (Antik Dolgulu)', labelShort: '12 mm' },
  { value: 15, label: '15 mm (Geniş Rustik)', labelShort: '15 mm' }
];

export function getGroutColorById(id) {
  return GROUT_COLORS.find(c => c.id === id) || GROUT_COLORS[2];
}
