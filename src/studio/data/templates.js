// src/studio/data/templates.js
import { TemplateLoader } from '../engine/TemplateLoader.js';

export const TEMPLATE_CATEGORIES = [
  { id: 'all', nameTr: 'Tüm Şablonlar', nameEn: 'All Scenes' },
  { id: 'exterior', nameTr: 'Dış Cephe & Bina', nameEn: 'Exterior & Architecture' },
  { id: 'interior', nameTr: 'İç Mekan & Salon', nameEn: 'Interior & Living' },
  { id: 'commercial', nameTr: 'Ticari & Mutfak', nameEn: 'Commercial & Kitchen' }
];

export const ARCHITECTURAL_TEMPLATES = [
  {
    id: 'modern-commercial-corner',
    nameTr: 'Bina — Çok Katlı Köşe Cephe',
    nameEn: 'Building — Multi-Story Corner Facade',
    category: 'exterior',
    tagTr: 'DIŞ CEPHE',
    tagEn: 'EXTERIOR',
    descriptionTr: 'Geniş pencereli, 4 katlı modern mimari köşe bina cephe uygulaması.',
    descriptionEn: 'Contemporary 4-story corner architectural building with grid window openings.',
    glbPath: '/assets/studio/isiklar/glb/place-bina.glb',
    previewGradient: 'linear-gradient(135deg, #2b333c 0%, #151b21 100%)',
    aspectRatio: 16 / 9,
    canvas: { width: 2400, height: 1350 },
    quality: { recommended: true, minWidth: 1600, idealWidth: 2400 },
    asset: {
      baseImage: '/assets/studio/isiklar/places/xx-bina.jpg',
      previewImage: '/assets/studio/isiklar/places/xx-bina.jpg',
      shadowLayer: null,
      geometryJson: null
    },
    defaultPattern: 'running-bond',
    defaultScale: 1.0,
    defaultGroutWidth: 8,
    defaultGroutColor: 'cement-grey',
    surfaces: [
      {
        id: 'main-corner-facade',
        nameTr: 'Ana Köşe Cephe',
        nameEn: 'Main Corner Facade',
        type: 'facade',
        polygon: [[350, 150], [1450, 150], [1450, 1250], [350, 1250]],
        perspective: { enabled: true },
        cutouts: []
      }
    ]
  },
  {
    id: 'modern-living-room',
    nameTr: 'Salon — Modern Loft & TV Duvarı',
    nameEn: 'Living Room — Loft & TV Wall',
    category: 'interior',
    tagTr: 'İÇ MEKAN',
    tagEn: 'INTERIOR',
    descriptionTr: 'Gömme bioethanol şömine nişine ve ahşap parkeye sahip ferah loft salon odak duvarı.',
    descriptionEn: 'Spacious loft living room with bioethanol fireplace niche and hardwood floor.',
    glbPath: '/assets/studio/isiklar/glb/place-salon.glb',
    previewGradient: 'linear-gradient(135deg, #2b231d 0%, #16120f 100%)',
    aspectRatio: 16 / 9,
    canvas: { width: 2400, height: 1350 },
    quality: { recommended: true, minWidth: 1600, idealWidth: 2400 },
    asset: {
      baseImage: '/assets/studio/isiklar/places/xx-salon.jpg',
      previewImage: '/assets/studio/isiklar/places/xx-salon.jpg',
      shadowLayer: null,
      geometryJson: null
    },
    defaultPattern: 'running-bond',
    defaultScale: 1.0,
    defaultGroutWidth: 8,
    defaultGroutColor: 'anthracite',
    surfaces: [
      {
        id: 'fireplace-focus-wall',
        nameTr: 'Şömine & TV Odak Duvarı',
        nameEn: 'Fireplace & Accent Wall',
        type: 'fireplace',
        polygon: [[480, 220], [1920, 220], [1920, 1240], [480, 1240]],
        perspective: { enabled: false },
        cutouts: []
      }
    ]
  },
  {
    id: 'modern-villa-01',
    nameTr: 'Villa — Müstakil Giriş & Teras',
    nameEn: 'Villa — Private Entry & Terrace',
    category: 'exterior',
    tagTr: 'VİLLA / DIŞ CEPHE',
    tagEn: 'VILLA',
    descriptionTr: 'Konsol saçaklı, cam giriş portalına ve peyzaj terasına sahip 2 katlı villa.',
    descriptionEn: 'Two-story private villa with cantilevered roof trim and entrance portal.',
    glbPath: '/assets/studio/isiklar/glb/place-villa.glb',
    previewGradient: 'linear-gradient(135deg, #1e242c 0%, #101317 100%)',
    aspectRatio: 16 / 9,
    canvas: { width: 2400, height: 1350 },
    quality: { recommended: true, minWidth: 1600, idealWidth: 2400 },
    asset: {
      baseImage: '/assets/studio/isiklar/places/xx-villa.jpg',
      previewImage: '/assets/studio/isiklar/places/xx-villa.jpg',
      shadowLayer: null,
      geometryJson: null
    },
    defaultPattern: 'running-bond',
    defaultScale: 1.0,
    defaultGroutWidth: 10,
    defaultGroutColor: 'beige-sand',
    surfaces: [
      {
        id: 'main-facade',
        nameTr: 'Ön Giriş Duvarı',
        nameEn: 'Main Entry Facade',
        type: 'facade',
        polygon: [[280, 320], [1560, 320], [1560, 1280], [280, 1280]],
        perspective: { enabled: false },
        cutouts: []
      }
    ]
  },
  {
    id: 'modern-hotel',
    nameTr: 'Otel — Butik Otel Cephesi',
    nameEn: 'Hotel — Boutique Hotel Facade',
    category: 'exterior',
    tagTr: 'OTEL / TİCARİ',
    tagEn: 'HOTEL',
    descriptionTr: 'Prestijli otel ve konaklama yapıları için modern tuğla cephe uygulaması.',
    descriptionEn: 'Contemporary brick facade application for hospitality and hotels.',
    glbPath: '/assets/studio/isiklar/glb/place-otel.glb',
    previewGradient: 'linear-gradient(135deg, #2a2522 0%, #12100f 100%)',
    aspectRatio: 16 / 9,
    canvas: { width: 2400, height: 1350 },
    quality: { recommended: true, minWidth: 1600, idealWidth: 2400 },
    asset: {
      baseImage: '/assets/studio/isiklar/places/xx-otel.jpg',
      previewImage: '/assets/studio/isiklar/places/xx-otel.jpg',
      shadowLayer: null,
      geometryJson: null
    },
    defaultPattern: 'running-bond',
    defaultScale: 1.0,
    defaultGroutWidth: 8,
    defaultGroutColor: 'cement-grey',
    surfaces: [
      {
        id: "main-facade",
        nameTr: "Ana Mimari Cephe",
        nameEn: "Main Facade Area",
        type: "facade",
        polygon: [[200, 160], [2200, 160], [2200, 1280], [200, 1280]],
        perspective: { enabled: false },
        cutouts: []
      }
    ]
  },
  {
    id: 'modern-plaza',
    nameTr: 'Plaza — Ticari İş Merkezi',
    nameEn: 'Plaza — Commercial Center',
    category: 'exterior',
    tagTr: 'PLAZA / TİCARİ',
    tagEn: 'PLAZA',
    descriptionTr: 'Büyük ölçekli ofis ve iş merkezi mimari tuğla kaplama uygulaması.',
    descriptionEn: 'Large-scale commercial office plaza brick facade visualization.',
    glbPath: '/assets/studio/isiklar/glb/place-plaza.glb',
    previewGradient: 'linear-gradient(135deg, #242930 0%, #101418 100%)',
    aspectRatio: 16 / 9,
    canvas: { width: 2400, height: 1350 },
    quality: { recommended: true, minWidth: 1600, idealWidth: 2400 },
    asset: {
      baseImage: '/assets/studio/isiklar/places/xx-plaza.jpg',
      previewImage: '/assets/studio/isiklar/places/xx-plaza.jpg',
      shadowLayer: null,
      geometryJson: null
    },
    defaultPattern: 'one-third-bond',
    defaultScale: 1.0,
    defaultGroutWidth: 10,
    defaultGroutColor: 'cement-grey',
    surfaces: [
      {
        id: "main-facade",
        nameTr: "Ana Mimari Cephe",
        nameEn: "Main Facade Area",
        type: "facade",
        polygon: [[200, 160], [2200, 160], [2200, 1280], [200, 1280]],
        perspective: { enabled: false },
        cutouts: []
      }
    ]
  },
  {
    id: 'modern-factory',
    nameTr: 'Fabrika — Endüstriyel Yapı',
    nameEn: 'Factory — Industrial Architecture',
    category: 'exterior',
    tagTr: 'ENDÜSTRİYEL',
    tagEn: 'INDUSTRIAL',
    descriptionTr: 'Endüstriyel tesisler ve yönetim binaları için klinker cephe.',
    descriptionEn: 'Industrial facility and administrative headquarters brick cladding.',
    glbPath: '/assets/studio/isiklar/glb/place-fabrika.glb',
    previewGradient: 'linear-gradient(135deg, #282422 0%, #13100e 100%)',
    aspectRatio: 16 / 9,
    canvas: { width: 2400, height: 1350 },
    quality: { recommended: true, minWidth: 1600, idealWidth: 2400 },
    asset: {
      baseImage: '/assets/studio/isiklar/places/xx-fabrika.jpg',
      previewImage: '/assets/studio/isiklar/places/xx-fabrika.jpg',
      shadowLayer: null,
      geometryJson: null
    },
    defaultPattern: 'running-bond',
    defaultScale: 1.0,
    defaultGroutWidth: 10,
    defaultGroutColor: 'beige-sand',
    surfaces: [
      {
        id: "main-facade",
        nameTr: "Ana Mimari Cephe",
        nameEn: "Main Facade Area",
        type: "facade",
        polygon: [[200, 160], [2200, 160], [2200, 1280], [200, 1280]],
        perspective: { enabled: false },
        cutouts: []
      }
    ]
  },
  {
    id: 'modern-university',
    nameTr: 'Üniversite — Kampüs Binası',
    nameEn: 'University — Campus Building',
    category: 'exterior',
    tagTr: 'EĞİTİM / KAMU',
    tagEn: 'CAMPUS',
    descriptionTr: 'Eğitim yapıları ve üniversite kampüsleri için zamansız tuğla mimarisi.',
    descriptionEn: 'Educational and university campus institutional brick architecture.',
    glbPath: '/assets/studio/isiklar/glb/place-university.glb',
    previewGradient: 'linear-gradient(135deg, #1f2722 0%, #0d120f 100%)',
    aspectRatio: 16 / 9,
    canvas: { width: 2400, height: 1350 },
    quality: { recommended: true, minWidth: 1600, idealWidth: 2400 },
    asset: {
      baseImage: '/assets/studio/isiklar/places/xx-university.jpg',
      previewImage: '/assets/studio/isiklar/places/xx-university.jpg',
      shadowLayer: null,
      geometryJson: null
    },
    defaultPattern: 'running-bond',
    defaultScale: 1.0,
    defaultGroutWidth: 10,
    defaultGroutColor: 'beige-sand',
    surfaces: [
      {
        id: "main-facade",
        nameTr: "Ana Mimari Cephe",
        nameEn: "Main Facade Area",
        type: "facade",
        polygon: [[200, 160], [2200, 160], [2200, 1280], [200, 1280]],
        perspective: { enabled: false },
        cutouts: []
      }
    ]
  },
  {
    id: 'modern-logistics',
    nameTr: 'Lojistik — Depolama Merkezi',
    nameEn: 'Logistics — Warehouse Center',
    category: 'exterior',
    tagTr: 'LOJİSTİK',
    tagEn: 'LOGISTICS',
    descriptionTr: 'Lojistik merkezleri ve modern depolama tesisleri.',
    descriptionEn: 'Logistics parks and contemporary distribution centers.',
    glbPath: '/assets/studio/isiklar/glb/place-lojistik.glb',
    previewGradient: 'linear-gradient(135deg, #2b2723 0%, #141210 100%)',
    aspectRatio: 16 / 9,
    canvas: { width: 2400, height: 1350 },
    quality: { recommended: true, minWidth: 1600, idealWidth: 2400 },
    asset: {
      baseImage: '/assets/studio/isiklar/places/xx-lojistik.jpg',
      previewImage: '/assets/studio/isiklar/places/xx-lojistik.jpg',
      shadowLayer: null,
      geometryJson: null
    },
    defaultPattern: 'running-bond',
    defaultScale: 1.0,
    defaultGroutWidth: 10,
    defaultGroutColor: 'beige-sand',
    surfaces: [
      {
        id: "main-facade",
        nameTr: "Ana Mimari Cephe",
        nameEn: "Main Facade Area",
        type: "facade",
        polygon: [[200, 160], [2200, 160], [2200, 1280], [200, 1280]],
        perspective: { enabled: false },
        cutouts: []
      }
    ]
  }
];

export function getTemplateById(id) {
  return (
    ARCHITECTURAL_TEMPLATES.find((t) => t.id === id) ||
    ARCHITECTURAL_TEMPLATES[0]
  );
}

export function validateAllTemplates() {
  return ARCHITECTURAL_TEMPLATES.map((tmpl) => ({
    id: tmpl.id,
    ...TemplateLoader.validateTemplate(tmpl)
  }));
}
