#!/usr/bin/env python3
import os
import sys
import re
import json
import shutil
import unicodedata
import openpyxl

# Workspace root directory
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Master data directory inside project
MASTER_DATA_DIR = os.path.join(PROJECT_ROOT, 'master_data')
os.makedirs(MASTER_DATA_DIR, exist_ok=True)

# Candidate Excel paths (Prioritize master_data/stoklar.xlsx)
PUBLIC_DATA_DIR = os.path.join(PROJECT_ROOT, 'public', 'data')
MASTER_EXCEL_PATH = os.path.join(PUBLIC_DATA_DIR, 'products_master.xlsx')
INTERNAL_STOKLAR_PATH = os.path.join(PUBLIC_DATA_DIR, 'stoklar.xlsx')
DESKTOP_STOKLAR_PATH = '/Users/serkancoskun/Desktop/Tuğla Dünyası/ÜRÜN LİSTESİ/stoklar.xlsx'
DESKTOP_UNIQUE_PATH = '/Users/serkancoskun/Desktop/Tuğla Dünyası/ÜRÜN LİSTESİ/Tüm_Ürün_Liste_Unique_SON.xlsx'
INTERNAL_UNIQUE_PATH = os.path.join(MASTER_DATA_DIR, 'Tüm_Ürün_Liste_Unique_SON.xlsx')

selected_excel_path = None

# Check if desktop has a newer stoklar.xlsx
if os.path.exists(DESKTOP_STOKLAR_PATH):
    if not os.path.exists(INTERNAL_STOKLAR_PATH) or os.path.getmtime(DESKTOP_STOKLAR_PATH) > os.path.getmtime(INTERNAL_STOKLAR_PATH):
        print(f"Detected newer Excel file on Desktop ({DESKTOP_STOKLAR_PATH}). Copying to master_data/stoklar.xlsx...")
        try:
            shutil.copy2(DESKTOP_STOKLAR_PATH, INTERNAL_STOKLAR_PATH)
        except Exception as e:
            print(f"Warning: Could not copy Desktop Excel: {e}")

if os.path.exists(MASTER_EXCEL_PATH):
    selected_excel_path = MASTER_EXCEL_PATH
elif os.path.exists(INTERNAL_STOKLAR_PATH):
    selected_excel_path = INTERNAL_STOKLAR_PATH
elif os.path.exists(DESKTOP_STOKLAR_PATH):
    selected_excel_path = DESKTOP_STOKLAR_PATH
elif os.path.exists(INTERNAL_UNIQUE_PATH):
    selected_excel_path = INTERNAL_UNIQUE_PATH
elif os.path.exists(DESKTOP_UNIQUE_PATH):
    selected_excel_path = DESKTOP_UNIQUE_PATH
else:
    # Search for any .xlsx inside MASTER_DATA_DIR
    for f in os.listdir(MASTER_DATA_DIR):
        if f.endswith('.xlsx') and not f.startswith('~$'):
            selected_excel_path = os.path.join(MASTER_DATA_DIR, f)
            break

if not selected_excel_path or not os.path.exists(selected_excel_path):
    print("Error: No Excel master file found in master_data or Desktop!")
    sys.exit(1)

print(f"Using Excel master source: {selected_excel_path}")

# Source image directories
IMAGES_SOURCE_DIR = os.path.join(PROJECT_ROOT, 'public', 'assets', 'products')
PROJECT_IMAGES_SOURCE_DIR = os.path.join(PROJECT_ROOT, 'public', 'assets', 'project_images')

# Destination web build assets
EXCEL_DEST_DIR = os.path.join(PROJECT_ROOT, 'public', 'data')
IMAGES_DEST_DIR = os.path.join(PROJECT_ROOT, 'public', 'assets', 'products')
PROJECT_IMAGES_DEST_DIR = os.path.join(PROJECT_ROOT, 'public', 'assets', 'project_images')
JSON_DB_PATH = os.path.join(PROJECT_ROOT, 'src', 'data', 'products_db.json')
MISSING_REPORT_PATH = os.path.join(PROJECT_ROOT, 'public', 'data', 'missing_images_report.json')

os.makedirs(EXCEL_DEST_DIR, exist_ok=True)
os.makedirs(IMAGES_DEST_DIR, exist_ok=True)
os.makedirs(PROJECT_IMAGES_DEST_DIR, exist_ok=True)
os.makedirs(os.path.dirname(JSON_DB_PATH), exist_ok=True)

# Copy master Excel file to public/data for web download reference
dst_excel = os.path.join(EXCEL_DEST_DIR, 'products_master.xlsx')
if os.path.abspath(selected_excel_path) != os.path.abspath(dst_excel):
    shutil.copy2(selected_excel_path, dst_excel)

def clean_key(s):
    if not s:
        return ''
    s = unicodedata.normalize('NFC', str(s)).upper()
    tr_map = {'İ': 'I', 'I': 'I', 'Ğ': 'G', 'Ü': 'U', 'Ş': 'S', 'Ö': 'O', 'Ç': 'C'}
    for k, v in tr_map.items():
        s = s.replace(k, v)
    s = re.sub(r'[^A-Z0-9]', '', s)
    return s

def slugify(s):
    if not s:
        return ''
    s = str(s).strip().lower()
    tr_map = {'ı': 'i', 'ş': 's', 'ğ': 'g', 'ü': 'u', 'ö': 'o', 'ç': 'c'}
    for k, v in tr_map.items():
        s = s.replace(k, v)
    s = re.sub(r'[^a-z0-9]+', '-', s)
    s = s.strip('-')
    return s

# Load Excel workbook
wb = openpyxl.load_workbook(selected_excel_path, data_only=True)
if 'Işıklar Ürün Listesi' in wb.sheetnames:
    sheet = wb['Işıklar Ürün Listesi']
elif 'Unique Ürünler' in wb.sheetnames:
    sheet = wb['Unique Ürünler']
else:
    sheet = wb.active

print(f"Reading sheet: '{sheet.title}'")
rows = list(sheet.iter_rows(values_only=True))

if not rows:
    print("Error: Excel sheet is empty!")
    sys.exit(1)

header = [str(c).strip() if c is not None else '' for c in rows[0]]
print("Header columns:", header)

def find_col(candidates, default_idx):
    for idx, col_name in enumerate(header):
        c_clean = clean_key(col_name)
        for cand in candidates:
            if clean_key(cand) == c_clean:
                return idx
    return default_idx

tse_idx = find_col(['TSE', 'Tse', 'TSE Belgesi', 'TSE Belgeli'], -1)
uretim_idx = find_col(['Üretimimiz', 'Uretimimiz', 'Kendi Üretimimiz', 'Üretim'], 0)
ana_idx = find_col(['Ana Kategori', 'AnaKategori', 'Kategori'], 1)
alt_idx = find_col(['Alt Kategori', 'AltKategori', 'Grup', 'Alt Grup'], 2)
code_idx = find_col(['Stok Kodu', 'StokKodu', 'Ürün Kodu', 'Kodu'], 3)
name_idx = find_col(['Stok Adı', 'StokAdi', 'Ürün Adı', 'Adı'], 4)
desc_idx = find_col(['Açıklama', 'Aciklama', 'Stok Açıklaması'], 5)
desc2_idx = find_col(['Açıklama 2', 'Aciklama 2', 'Teknik Özellikler'], 6)
img_fname_idx = find_col(['Görsel Dosya Adı', 'Görsel Adı', 'Görsel', 'Ürün Görseli'], 7)
renk_idx = find_col(['Renk', 'Renkler', 'Renk Seçeneği', 'Renk Secenegi', 'HasColor', 'RenkVar'], -1)

data_rows = rows[1:]

# Scan product image files in master_data/Görseller/
img_files = []
if os.path.exists(IMAGES_SOURCE_DIR):
    img_files = [f for f in os.listdir(IMAGES_SOURCE_DIR) if not f.startswith('.')]
print(f"Found {len(img_files)} source product image files in Görseller directory.")

img_files_clean_map = {clean_key(os.path.splitext(f)[0]): f for f in img_files}

# Scan reference project image files in master_data/proje_görsel/
proj_img_files = []
if os.path.exists(PROJECT_IMAGES_SOURCE_DIR):
    proj_img_files = [f for f in os.listdir(PROJECT_IMAGES_SOURCE_DIR) if not f.startswith('.')]
print(f"Found {len(proj_img_files)} source reference project image files in proje_görsel directory.")

products_list = []
missing_images = []

for i, r in enumerate(data_rows):
    if not r or not any(r):
        continue
    
    tse_val = str(r[tse_idx]).strip() if tse_idx != -1 and len(r) > tse_idx and r[tse_idx] is not None else ''
    has_tse = tse_val in ['1', '1.0', 'True', 'true', 'EVET', 'evet', 'tse', 'TSE', 'yes', 'Yes']
    uretim_val = str(r[uretim_idx]).strip() if len(r) > uretim_idx and r[uretim_idx] is not None else ''
    is_own_production = uretim_val in ['1', '1.0', 'True', 'EVET', 'evet']
    renk_val = str(r[renk_idx]).strip() if renk_idx != -1 and len(r) > renk_idx and r[renk_idx] is not None else ''
    has_colors = renk_val in ['1', '1.0', 'True', 'true', 'EVET', 'evet', 'yes', 'Yes', 1]
    
    ana_cat = str(r[ana_idx]).strip() if len(r) > ana_idx and r[ana_idx] is not None else ''
    alt_cat = str(r[alt_idx]).strip() if len(r) > alt_idx and r[alt_idx] is not None else ''
    stok_kodu = str(r[code_idx]).strip() if len(r) > code_idx and r[code_idx] is not None else ''
    stok_adi = str(r[name_idx]).strip() if len(r) > name_idx and r[name_idx] is not None else ''
    aciklama = str(r[desc_idx]).strip() if len(r) > desc_idx and r[desc_idx] is not None else ''
    aciklama2 = str(r[desc2_idx]).strip() if len(r) > desc2_idx and r[desc2_idx] is not None else ''
    explicit_fname = str(r[img_fname_idx]).strip() if len(r) > img_fname_idx and r[img_fname_idx] is not None else ''

    if not stok_kodu or stok_kodu == 'None':
        continue
        
    c_key = clean_key(stok_kodu)
    
    # 1. Match Product Images from Görseller/
    matched_images = []
    c_code = clean_key(stok_kodu)
    stok_kodu_lower = str(stok_kodu).strip().lower()

    # Direct match by explicit filename in Excel
    if explicit_fname and explicit_fname in img_files:
        matched_images.append(explicit_fname)
        
    for f in img_files:
        if f in matched_images:
            continue
        f_base = os.path.splitext(f)[0]
        f_clean = clean_key(f_base)
        f_base_lower = f_base.lower()
        
        # Exact clean match
        if f_clean == c_code:
            matched_images.append(f)
            continue
            
        # Match with separator (_ , - , space, .) or suffix
        if f_base_lower.startswith(stok_kodu_lower):
            rem = f_base_lower[len(stok_kodu_lower):]
            if rem and rem[0] in ['_', '-', ' ', '.', '(', ')']:
                matched_images.append(f)
        else:
            if f_clean.startswith(c_code):
                suffix = f_clean[len(c_code):]
                pos = f_base_lower.find(stok_kodu_lower)
                if pos != -1:
                    after_pos = pos + len(stok_kodu_lower)
                    if after_pos < len(f_base_lower) and f_base_lower[after_pos] in ['_', '-', ' ', '.', '(', ')']:
                        matched_images.append(f)

    def sort_key(f):
        f_base = os.path.splitext(f)[0]
        f_clean = clean_key(f_base)
        if f_clean == c_code:
            return (0, 0, f)
        if explicit_fname and f == explicit_fname:
            return (0, 1, f)
        return (1, len(f), f)
        
    matched_images.sort(key=sort_key)
    
    web_images = []
    for img_name in matched_images:
        src_path = os.path.join(IMAGES_SOURCE_DIR, img_name)
        safe_filename = re.sub(r'[^a-zA-Z0-9_\-\.]', '_', img_name)
        dest_path = os.path.join(IMAGES_DEST_DIR, safe_filename)
        
        if not os.path.exists(dest_path) or os.path.getsize(dest_path) != os.path.getsize(src_path):
            shutil.copy2(src_path, dest_path)
            
        web_images.append(f"/assets/products/{safe_filename}")
        
    has_images = len(web_images) > 0
    if not has_images:
        missing_images.append({
            "stokKodu": stok_kodu,
            "stokAdi": stok_adi,
            "anaKategori": ana_cat,
            "altKategori": alt_cat
        })

    # 2. Match Reference Project Images from proje_görsel/
    matched_proj_images = []
    for pf in proj_img_files:
        pf_base = os.path.splitext(pf)[0]
        pf_clean = clean_key(pf_base)
        if pf_clean == c_key or pf_clean.startswith(c_key):
            matched_proj_images.append(pf)
            
    matched_proj_images.sort(key=lambda x: (len(x), x))

    web_proj_images = []
    for pimg_name in matched_proj_images:
        psrc_path = os.path.join(PROJECT_IMAGES_SOURCE_DIR, pimg_name)
        psafe_filename = re.sub(r'[^a-zA-Z0-9_\-\.]', '_', pimg_name)
        pdest_path = os.path.join(PROJECT_IMAGES_DEST_DIR, psafe_filename)

        if not os.path.exists(pdest_path) or os.path.getsize(pdest_path) != os.path.getsize(psrc_path):
            shutil.copy2(psrc_path, pdest_path)

        web_proj_images.append(f"/assets/project_images/{psafe_filename}")

    has_project_images = len(web_proj_images) > 0

    # Generate SEO slug
    slug = slugify(stok_kodu)
    if not slug:
        slug = f"stok-{i+1}"
        
    # Check for color image in public/assets/products/colors/
    color_img = None
    colors_dir = os.path.join(PROJECT_ROOT, "public", "assets", "products", "colors")
    if os.path.exists(colors_dir):
        for cf in os.listdir(colors_dir):
            if cf.startswith("."): continue
            cf_base = os.path.splitext(cf)[0]
            if clean_key(cf_base) == c_key or cf_base.lower() == stok_kodu.lower():
                color_img = f"/assets/products/colors/{cf}"
                break

    product_obj = {
        "id": slug,
        "stokKodu": stok_kodu,
        "stokAdi": stok_adi,
        "anaKategori": ana_cat,
        "altKategori": alt_cat,
        "aciklama": aciklama,
        "aciklama2": aciklama2,
        "renk": 1 if (has_colors or color_img is not None) else 0,
        "hasColors": bool(has_colors or color_img is not None),
        "colorImage": color_img,
        "isOwnProduction": is_own_production,
        "hasTse": has_tse,
        "images": web_images,
        "hasImages": has_images,
        "mainImage": web_images[0] if has_images else "/images/product_placeholder.png",
        "projectImages": web_proj_images,
        "hasProjectImages": has_project_images
    }
    products_list.append(product_obj)

products_with_proj_count = sum(1 for p in products_list if p["hasProjectImages"])
print(f"Successfully processed {len(products_list)} unique products from Excel ({os.path.basename(selected_excel_path)}).")
print(f"Products with matched product images: {len(products_list) - len(missing_images)}")
print(f"Products with matched reference project images: {products_with_proj_count}")

# Save products_db.json
with open(JSON_DB_PATH, 'w', encoding='utf-8') as f:
    json.dump(products_list, f, ensure_ascii=False, indent=2)

# Save missing_images_report.json
with open(MISSING_REPORT_PATH, 'w', encoding='utf-8') as f:
    json.dump({
        "totalProducts": len(products_list),
        "productsWithImages": len(products_list) - len(missing_images),
        "productsMissingImagesCount": len(missing_images),
        "missingImages": missing_images
    }, f, ensure_ascii=False, indent=2)

# Sync background images from master_data/background to public/background
MASTER_BG_DIR = os.path.join(MASTER_DATA_DIR, 'background')
PUBLIC_BG_DIR = os.path.join(PROJECT_ROOT, 'public', 'background')
BG_JSON_PATH = os.path.join(PROJECT_ROOT, 'src', 'data', 'backgrounds.json')

os.makedirs(MASTER_BG_DIR, exist_ok=True)
os.makedirs(PUBLIC_BG_DIR, exist_ok=True)

bg_files = []
if os.path.exists(MASTER_BG_DIR):
    for fname in sorted(os.listdir(MASTER_BG_DIR)):
        if fname.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
            src = os.path.join(MASTER_BG_DIR, fname)
            dest = os.path.join(PUBLIC_BG_DIR, fname)
            try:
                if not os.path.exists(dest) or (not os.path.samefile(src, dest) and os.path.getsize(dest) != os.path.getsize(src)):
                    shutil.copy2(src, dest)
            except Exception as e:
                pass
            bg_files.append(f"/background/{fname}")

# If no files in master_data/background, check public/background
if not bg_files and os.path.exists(PUBLIC_BG_DIR):
    for fname in sorted(os.listdir(PUBLIC_BG_DIR)):
        if fname.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
            bg_files.append(f"/background/{fname}")

# Save backgrounds.json
with open(BG_JSON_PATH, 'w', encoding='utf-8') as f:
    json.dump(bg_files, f, ensure_ascii=False, indent=2)

print(f"Background slider sync finished: {len(bg_files)} images registered.")

# Sync PDF catalog from master_data/katalog to public/assets/catalog/katalog.pdf
MASTER_KATALOG_DIR = os.path.join(MASTER_DATA_DIR, 'katalog')
PUBLIC_KATALOG_DIR = os.path.join(PROJECT_ROOT, 'public', 'assets', 'catalog')

os.makedirs(MASTER_KATALOG_DIR, exist_ok=True)
os.makedirs(PUBLIC_KATALOG_DIR, exist_ok=True)

if os.path.exists(MASTER_KATALOG_DIR):
    pdf_files = [f for f in os.listdir(MASTER_KATALOG_DIR) if f.lower().endswith('.pdf')]
    if pdf_files:
        pdf_files.sort(key=lambda x: os.path.getmtime(os.path.join(MASTER_KATALOG_DIR, x)), reverse=True)
        latest_pdf = pdf_files[0]
        src_pdf = os.path.join(MASTER_KATALOG_DIR, latest_pdf)
        dest_pdf = os.path.join(PUBLIC_KATALOG_DIR, 'katalog.pdf')
        try:
            if not os.path.exists(dest_pdf) or (not os.path.samefile(src_pdf, dest_pdf) and os.path.getsize(dest_pdf) != os.path.getsize(src_pdf)):
                shutil.copy2(src_pdf, dest_pdf)
            print(f"Catalog PDF sync finished: Synced '{latest_pdf}' -> public/assets/catalog/katalog.pdf")
            try:
                import fitz
                doc = fitz.open(dest_pdf)
                page = doc[0]
                pix = page.get_pixmap(dpi=150)
                cover_dest = os.path.join(PROJECT_ROOT, 'public', 'images', 'catalog_cover.png')
                os.makedirs(os.path.dirname(cover_dest), exist_ok=True)
                pix.save(cover_dest)
                print(f"Catalog Cover Image generated from Page 1 ({len(doc)} pages) -> public/images/catalog_cover.png")
            except Exception as ce:
                print(f"Note: Catalog cover render skipped: {ce}")
        except Exception as e:
            print(f"Warning: Could not sync catalog PDF: {e}")

# Sync Certificates from master_data/belgeler/görseller to public/assets/belgeler
MASTER_BELGELER_DIR = os.path.join(PROJECT_ROOT, 'public', 'assets', 'belgeler')
PUBLIC_BELGELER_DIR = os.path.join(PROJECT_ROOT, 'public', 'assets', 'belgeler')
CERTS_JSON_PATH = os.path.join(PROJECT_ROOT, 'src', 'data', 'certificates_db.json')

os.makedirs(MASTER_BELGELER_DIR, exist_ok=True)
os.makedirs(PUBLIC_BELGELER_DIR, exist_ok=True)

certs_db = []

if os.path.exists(MASTER_BELGELER_DIR):
    master_filenames = set(f for f in os.listdir(MASTER_BELGELER_DIR) if not f.startswith('.'))
    for pf in os.listdir(PUBLIC_BELGELER_DIR):
        if pf not in master_filenames and not pf.startswith('.'):
            try:
                os.remove(os.path.join(PUBLIC_BELGELER_DIR, pf))
            except Exception:
                pass

    for idx, fname in enumerate(sorted(os.listdir(MASTER_BELGELER_DIR))):
        if fname.startswith('.') or not fname.lower().endswith(('.png', '.jpg', '.jpeg', '.webp', '.svg')):
            continue
        src = os.path.join(MASTER_BELGELER_DIR, fname)
        dest = os.path.join(PUBLIC_BELGELER_DIR, fname)
        try:
            shutil.copy2(src, dest)
        except Exception:
            pass

        fname_lower = fname.lower()
        if 'tse' in fname_lower:
            category = 'TSE Belgelerimiz'
        else:
            category = 'Kalite Sertifikalarımız'

        base_name = os.path.splitext(fname)[0]
        readable_title = base_name.replace('_', ' ').replace('-', ' ').title()
        
        title_overrides = {
            'tse_belgesi_yapistirici': 'Yapıştırıcı TSE Türk Standartlarına Uygunluk Belgesi (TS EN 12004-1)',
            'tse_belgesi_derz': 'Derz Dolgu TSE Türk Standartlarına Uygunluk Belgesi (TS EN 13888-1)',
            'tse_belgesi_kultur_tuglasi': 'Kültür Tuğlası TSE Türk Standartlarına Uygunluk Belgesi (TS 7047)',
            'tse_belgesi_levha_yapistirici': 'Levha Yapıştırıcı TSE Türk Standartlarına Uygunluk Belgesi (TS 13566)',
            'kalite_sertifikasi_iso9001_1': 'IQR ISO 9001:2015 Kalite Yönetim Sistemi Belgesi (Tuğla / Kaplama)',
            'kalite_sertifikasi_iso9001_2': 'IQR ISO 9001:2015 Kalite Yönetim Sistemi Belgesi (Yapı Malzemeleri)',
            'kalite_sertifikasi_iso45001_1': 'IQR ISO 45001:2018 İş Sağlığı ve Güvenliği Sertifikası',
            'kalite_sertifikasi_iso45001_2': 'IQR ISO 45001:2018 İş Sağlığı ve Güvenliği Sertifikası (Tesisler)',
            'kalite_sertifikasi_ce_1': 'BELCERT CE Uygunluk Beyanı Sertifikası (Kültür Tuğlaları)',
            'kalite_sertifikasi_ce_2': 'BELCERT CE Uygunluk Beyanı Sertifikası (Tuğla Kaplamalar)',
            'kalite_sertifikasi_ce_3': 'BELCERT CE Uygunluk Beyanı Sertifikası (Derz & Yapıştırıcılar)'
        }
        title = title_overrides.get(base_name, readable_title)

        certs_db.append({
            "id": f"cert-{idx+1}",
            "filename": fname,
            "title": title,
            "category": category,
            "image": f"/assets/belgeler/{fname}",
            "thumb": f"/assets/belgeler/{fname}"
        })

with open(CERTS_JSON_PATH, 'w', encoding='utf-8') as f:
    json.dump(certs_db, f, ensure_ascii=False, indent=2)

print(f"Certificates sync finished: {len(certs_db)} certificate images synced from master_data/belgeler/görseller -> src/data/certificates_db.json")

# Sync Videos from master_data/mimari_video to public/assets/videos
MASTER_VIDEO_DIR = os.path.join(PROJECT_ROOT, 'public', 'assets', 'videos')
PUBLIC_VIDEO_DIR = os.path.join(PROJECT_ROOT, 'public', 'assets', 'videos')
VIDEOS_JSON_PATH = os.path.join(PROJECT_ROOT, 'src', 'data', 'videos_db.json')

# os.makedirs(MASTER_VIDEO_DIR, exist_ok=True)
# os.makedirs(PUBLIC_VIDEO_DIR, exist_ok=True)

videos_db = []

if os.path.exists(MASTER_VIDEO_DIR):
    master_vids = set(f for f in os.listdir(MASTER_VIDEO_DIR) if not f.startswith('.'))
    for pv in os.listdir(PUBLIC_VIDEO_DIR):
        if pv not in master_vids and not pv.startswith('.'):
            try:
                os.remove(os.path.join(PUBLIC_VIDEO_DIR, pv))
            except Exception:
                pass

    for idx, fname in enumerate(sorted(os.listdir(MASTER_VIDEO_DIR))):
        if fname.startswith('.') or not fname.lower().endswith(('.mp4', '.webm', '.mov', '.ogg')):
            continue
        src = os.path.join(MASTER_VIDEO_DIR, fname)
        dest = os.path.join(PUBLIC_VIDEO_DIR, fname)
        try:
            if not os.path.exists(dest) or os.path.getsize(dest) != os.path.getsize(src):
                shutil.copy2(src, dest)
        except Exception:
            pass

        base_name = os.path.splitext(fname)[0]
        clean_title_raw = re.sub(r'^\d+[\._\-\s]*', '', base_name).replace('_', ' ').replace('-', ' ').title()
        
        video_overrides = {
            '01_el_yapimi_antik_tugla_dokulari': {
                'title': 'El Yapımı Antik Tuğla Dokusu & Dış Cephe Mimarisi',
                'titleEn': 'Handmade Antique Brick Texture & Facade Architecture',
                'category': 'Dış Cephe Mimarisi',
                'duration': '0:16'
            },
            '02_klinker_kaplama_ve_derz_iscligi': {
                'title': 'Klinker Kaplama Tuğlası & Detaylı Derz İşçiliği',
                'titleEn': 'Klinker Brick Slips & Precision Grout Craftsmanship',
                'category': 'Klinker & Derz Uygulaması',
                'duration': '0:18'
            },
            '03_restorasyon_ve_harman_tuglalari': {
                'title': 'Tarihi Restorasyon & Harman Tuğla Dokuları',
                'titleEn': 'Historical Restoration & Traditional Brick Masonry',
                'category': 'Restorasyon & Kültür Mirası',
                'duration': '0:15'
            },
            '04_ic_mekan_kultur_tuglasi_tasarimlari': {
                'title': 'İç Mekan Mimari Kültür Tuğlası Tasarımları',
                'titleEn': 'Interior Architectural Cultured Brick Designs',
                'category': 'İç Mekan Mimarisi',
                'duration': '0:20'
            }
        }

        override_info = video_overrides.get(base_name, {})
        title = override_info.get('title', clean_title_raw)
        title_en = override_info.get('titleEn', clean_title_raw)
        category = override_info.get('category', 'Mimari Ürün Uygulaması')
        duration = override_info.get('duration', '0:15')

        videos_db.append({
            "id": f"vid-{idx+1}",
            "filename": fname,
            "title": title,
            "titleEn": title_en,
            "category": category,
            "duration": duration,
            "videoUrl": f"/assets/videos/{fname}",
            "poster": "/images/project_galata_restoration.png"
        })

with open(VIDEOS_JSON_PATH, 'w', encoding='utf-8') as f:
    json.dump(videos_db, f, ensure_ascii=False, indent=2)

print(f"Videos sync finished: {len(videos_db)} videos synced from master_data/mimari_video -> src/data/videos_db.json")

# Sync Projects & Videos from master_data/projeler
MASTER_PROJ_DIR = os.path.join(PROJECT_ROOT, 'public', 'assets', 'projects')
PUBLIC_PROJ_IMG_DIR = os.path.join(PROJECT_ROOT, 'public', 'assets', 'projects')
PUBLIC_PROJ_VID_DIR = os.path.join(PROJECT_ROOT, 'public', 'assets', 'projects', 'videos')
PROJECTS_JSON_PATH = os.path.join(PROJECT_ROOT, 'src', 'data', 'projects_db.json')

os.makedirs(MASTER_PROJ_DIR, exist_ok=True)
os.makedirs(PUBLIC_PROJ_IMG_DIR, exist_ok=True)
os.makedirs(PUBLIC_PROJ_VID_DIR, exist_ok=True)

project_presets = [
    {'file': '1.jpeg', 'title': 'Bodrum Yalıkavak Villa Projesi', 'titleEn': 'Bodrum Yalıkavak Luxury Villa Project', 'category': 'Müstakil Konut & Villa', 'categoryEn': 'Residential Villa', 'location': 'Bodrum, Muğla', 'year': '2025', 'architect': 'Erginoğlu & Çalışlar Mimarlık', 'description': 'Ege sahil şeridinde inşa edilen bu çağdaş villada, doğal eskitme harman kaplama tuğlaları ile akdeniz mimarisinin zamansız dokusu bütünleştirilmiştir.', 'descriptionEn': 'Contemporary Aegean coastal villa featuring handmade antique facing bricks for seamless landscape integration.'},
    {'file': '2.jpeg', 'title': 'Galata Restorasyon & Kültür Evi', 'titleEn': 'Galata Landmark Restoration & Culture House', 'category': 'Restorasyon & Tarihi Dokular', 'categoryEn': 'Historical Restoration', 'location': 'Beyoğlu / Galata, İstanbul', 'year': '2024', 'architect': 'Kültür Varlıkları Restorasyon Grubu', 'description': '19. yüzyıl tarihi yapısının aslına uygun restorasyonunda, özel harman fırınlama antik kaplama tuğlaları tercih edilmiştir.', 'descriptionEn': 'Historical landmark brickwork restoration using custom hand-fired heritage facing bricks.'},
    {'file': '3.jpeg', 'title': 'Alaçatı Taş & Tuğla Konsept Otel', 'titleEn': 'Alaçatı Stone & Brick Boutique Hotel', 'category': 'Otel & Ticari Yapılar', 'categoryEn': 'Hospitality & Hotel', 'location': 'Alaçatı, İzmir', 'year': '2024', 'architect': 'Atölye Mimarlık & Tasarım', 'description': 'Geleneksel taş ve antik tuğla dokularının harmanlandığı butik otel projesinde sıcak ve otantik bir atmosfer oluşturulmuştur.', 'descriptionEn': 'Boutique hotel in Alaçatı blending traditional stone with antique brick facade elements.'},
    {'file': '4.jpeg', 'title': 'Levent Prestij Tasarım Ofisi', 'titleEn': 'Levent Prestige Architectural Studio', 'category': 'İç Mekan & Konsept Duvarlar', 'categoryEn': 'Interior Concept', 'location': 'Levent, İstanbul', 'year': '2025', 'architect': 'DB Mimarlık', 'description': 'Modern mimari tasarım ofisinin iç mekan vurgu duvarlarında doğal harman eskitme tuğla kaplaması tercih edilmiştir.', 'descriptionEn': 'Modern design office interior feature wall created using rustic handmade terracotta brick slips.'},
    {'file': '6.jpeg', 'title': 'Kemerburgaz Orman Villaları', 'titleEn': 'Kemerburgaz Forest Residences', 'category': 'Müstakil Konut & Villa', 'categoryEn': 'Residential Villa', 'location': 'Eyüpsultan, İstanbul', 'year': '2025', 'architect': 'MİMARİSTİK Tasarım', 'description': 'Doğa ile iç içe konsept villa projesinde yüksek mukavemetli klinker pres tuğla kaplamaları ile cephede zamansız koruma sağlanmıştır.', 'descriptionEn': 'Luxury forest residences protected with weather-resistant klinker brick slips.'},
    {'file': '7.jpeg', 'title': 'Karaköy Loft & Kafe Projesi', 'titleEn': 'Karaköy Industrial Loft & Cafe', 'category': 'Otel & Ticari Yapılar', 'categoryEn': 'Hospitality & Commercial', 'location': 'Karaköy, İstanbul', 'year': '2024', 'architect': 'Karaköy Studio', 'description': 'Endüstriyel loft mimarisinin temsilcisi olan projede kırmızı harman ve antrasit kaplama tuğlaları ikonik bir görünüm sunar.', 'descriptionEn': 'Iconic industrial loft project in Karaköy featuring red blend brick slips and dark accent masonry.'},
    {'file': '8.jpeg', 'title': 'Tarabya Sahil Yalı Projesi', 'titleEn': 'Tarabya Waterfront Villa Restoration', 'category': 'Restorasyon & Tarihi Dokular', 'categoryEn': 'Historical Restoration', 'location': 'Sarıyer, İstanbul', 'year': '2024', 'architect': 'Boğaziçi Mimarlık', 'description': 'Boğaz hattındaki yalı restorasyonunda deniz suyuna, dona ve nem şoklarına tam dayanıklı el yapımı antik tuğlalar kullanılmıştır.', 'descriptionEn': 'Waterfront mansion restoration using salt and moisture resistant antique handmade bricks.'},
    {'file': '9.jpeg', 'title': 'Urla Bağ Evi & Şaraphanesi', 'titleEn': 'Urla Vineyard Estate & Winery', 'category': 'Otel & Ticari Yapılar', 'categoryEn': 'Hospitality & Commercial', 'location': 'Urla, İzmir', 'year': '2025', 'architect': 'Ege Mimarlık', 'description': 'Doğal taş ve pişmiş toprak ürünlerin mükemmel uyumuyla tasarlanan bağ evi projesi akdeniz ruhunu yansıtmaktadır.', 'descriptionEn': 'Vineyard estate in Urla showcasing terracotta brick vaults and authentic clay masonry.'},
    {'file': '10.jpeg', 'title': 'Kuzguncuk Tarihi Doku Restorasyonu', 'titleEn': 'Kuzguncuk Heritage Facade Restoration', 'category': 'Restorasyon & Tarihi Dokular', 'categoryEn': 'Historical Restoration', 'location': 'Üsküdar, İstanbul', 'year': '2024', 'architect': 'Kuzguncuk Atölye', 'description': 'Tarihi sokak dokusuna sadık kalınarak gerçekleştirilen koruma ve restorasyon çalışmasında orijinal tuğla formları uygulanmıştır.', 'descriptionEn': 'Preservation and restoration of historic street facade using original blend clay bricks.'},
    {'file': '11.jpeg', 'title': 'Zekeriyaköy Modern Konsept Villa', 'titleEn': 'Zekeriyaköy Modern Concept Residence', 'category': 'Mimari Cephe & Klinker', 'categoryEn': 'Facade & Klinker', 'location': 'Zekeriyaköy, İstanbul', 'year': '2025', 'architect': 'Aydın Mimarlık', 'description': 'Brüt beton ve klinker pres tuğla birlikteliği ile cephede heykelsi ve güçlü bir mimari kütle oluşturulmuştur.', 'descriptionEn': 'Modern residential architecture combining exposed concrete with raw terracotta klinker bricks.'},
    {'file': '12.jpeg', 'title': 'Kadıköy Sanat Galerisi & Atölye', 'titleEn': 'Kadıköy Art Gallery & Design Studio', 'category': 'İç Mekan & Konsept Duvarlar', 'categoryEn': 'Interior Concept', 'location': 'Kadıköy, İstanbul', 'year': '2024', 'architect': 'Moda Mimarlık', 'description': 'İç mekan sergi duvarlarında akustik ses dağılımı ve sıcak doku sağlayan özel eskitme kaplama ürünleri tercih edilmiştir.', 'descriptionEn': 'Interior gallery space highlighting warm textured facing bricks for acoustic and visual depth.'},
    {'file': '13.jpeg', 'title': 'Sapanca Doğa Evleri', 'titleEn': 'Sapanca Lakeside Nature Residences', 'category': 'Müstakil Konut & Villa', 'categoryEn': 'Residential Villa', 'location': 'Sapanca, Sakarya', 'year': '2025', 'architect': 'Sakarya Tasarım Stüdyosu', 'description': 'Yüksek ısı yalıtımına sahip cephe kaplama tuğlaları ile dört mevsim yüksek konfor sağlanan müstakil yaşam projesi.', 'descriptionEn': 'Lakeside villa project built with high thermal efficiency clay cladding systems.'},
    {'file': '14.jpeg', 'title': 'Nişantaşı Concept Store', 'titleEn': 'Nişantaşı Luxury Concept Store', 'category': 'Otel & Ticari Yapılar', 'categoryEn': 'Hospitality & Commercial', 'location': 'Şişli, İstanbul', 'year': '2025', 'architect': 'Nişantaşı Mimarlık', 'description': 'Lüks perakende mağaza konseptinde tuğlanın doğal ham dokusu ile bronz ve ahşap detaylar buluşturulmuştur.', 'descriptionEn': 'Luxury boutique interior blending natural raw clay brick textures with brass and timber.'},
    {'file': '15.jpeg', 'title': 'Balat Kültür Evi Restorasyonu', 'titleEn': 'Balat Heritage House Restoration', 'category': 'Restorasyon & Tarihi Dokular', 'categoryEn': 'Historical Restoration', 'location': 'Fatih, İstanbul', 'year': '2024', 'architect': 'Tarih & Yapı Grubu', 'description': 'Tarihi Balat semtinde zamana meydan okuyan yapının dış cephesi orijinal harman tuğlalarla yeniden ihya edilmiştir.', 'descriptionEn': 'Historic Balat townhouse facade revived using authentic hand-fired clay facing bricks.'},
    {'file': '16.jpeg', 'title': 'Çeşme Marina Residence', 'titleEn': 'Çeşme Marina Coastal Residence', 'category': 'Mimari Cephe & Klinker', 'categoryEn': 'Facade & Klinker', 'location': 'Çeşme, İzmir', 'year': '2025', 'architect': 'Ege Mimarlık', 'description': 'Sahil şeridinde tuzlu deniz havasına ve direkt güneş ışınlarına dayanıklı klinker pres kaplama tuğlaları tercih edilmiştir.', 'descriptionEn': 'Coastal residence built with salt and UV resistant klinker facing bricks.'},
    {'file': '17.jpeg', 'title': 'Göktürk Loft Konut Projesi', 'titleEn': 'Göktürk Modern Loft Complex', 'category': 'Müstakil Konut & Villa', 'categoryEn': 'Residential Villa', 'location': 'Eyüpsultan, İstanbul', 'year': '2025', 'architect': 'Göktürk Mimarlık', 'description': 'Geniş cam cepheler ve kırmızı-kahve tonlarında doğal tuğla kaplaması ile modern konsept konut mimarisi.', 'descriptionEn': 'Modern residential complex featuring large glazed openings framed in warm terracotta bricks.'}
]

video_presets = [
    {'file': 'vid1.mp4', 'title': 'Mimari Tuğla Örme & Ustalarımızdan Şantiye Çekimleri', 'titleEn': 'Architectural Bricklaying & Site Craftsmanship', 'category': 'Şantiye & Uygulama', 'categoryEn': 'Site Craftsmanship', 'duration': '0:18', 'poster': '/assets/projects/1.jpeg'},
    {'file': 'vid2.mp4', 'title': 'Klinker Pres Tuğla Cephe Kaplama Süreci', 'titleEn': 'Klinker Brick Slips Facade Installation', 'category': 'Klinker & Cephe', 'categoryEn': 'Facade Installation', 'duration': '0:22', 'poster': '/assets/projects/2.jpeg'},
    {'file': 'vid3.mp4', 'title': 'Tarihi Restorasyon & El Yapımı Antik Tuğla İşçiliği', 'titleEn': 'Historical Restoration & Handmade Brick Artistry', 'category': 'Restorasyon & Kültür', 'categoryEn': 'Heritage Restoration', 'duration': '0:16', 'poster': '/assets/projects/3.jpeg'},
    {'file': 'vid4.mp4', 'title': 'İç Mekan Dekoratif Tuğla Kaplama Detayları', 'titleEn': 'Interior Decorative Brick Wall Detailing', 'category': 'İç Mekan Uygulaması', 'categoryEn': 'Interior Application', 'duration': '0:15', 'poster': '/assets/projects/4.jpeg'},
    {'file': 'vid5.mp4', 'title': 'Dış Cephe Derz Dolgu & Yüzey Temizleme İşlemleri', 'titleEn': 'Exterior Grout Application & Surface Finishing', 'category': 'Derz & Yüzey Temizliği', 'categoryEn': 'Grout & Finishing', 'duration': '0:19', 'poster': '/assets/projects/6.jpeg'},
    {'file': 'vid6.mp4', 'title': 'Şantiye Tamamlanma & Mimari Proje Kapanış Çekimi', 'titleEn': 'Completed Site Tour & Architectural Showcase', 'category': 'Proje Kapanış', 'categoryEn': 'Completed Showcase', 'duration': '0:25', 'poster': '/assets/projects/7.jpeg'}
]

# Read from projeler.xlsx if available
excel_candidates = [
    os.path.join(MASTER_PROJ_DIR, 'projeler.xlsx'),
    '/Users/serkancoskun/Desktop/Tuğla İşler/projeler.xlsx'
]

proj_excel_path = None
for cand in excel_candidates:
    if os.path.exists(cand):
        proj_excel_path = cand
        break

if proj_excel_path:
    try:
        wb_p = openpyxl.load_workbook(proj_excel_path, data_only=True)
        if 'Projeler' in wb_p.sheetnames:
            ws_p = wb_p['Projeler']
            p_rows = list(ws_p.iter_rows(values_only=True))
            if len(p_rows) > 1:
                read_p = []
                for r in p_rows[1:]:
                    if not r or len(r) < 2 or not r[1]: continue
                    fname = str(r[1]).strip()
                    title = str(r[2]).strip() if len(r) > 2 and r[2] else fname
                    title_en = str(r[3]).strip() if len(r) > 3 and r[3] else title
                    cat = str(r[4]).strip() if len(r) > 4 and r[4] else 'Referans Proje'
                    cat_en = str(r[5]).strip() if len(r) > 5 and r[5] else cat
                    loc = str(r[6]).strip() if len(r) > 6 and r[6] else ''
                    year = str(r[7]).strip() if len(r) > 7 and r[7] else ''
                    arch = str(r[8]).strip() if len(r) > 8 and r[8] else ''
                    desc = str(r[9]).strip() if len(r) > 9 and r[9] else ''
                    desc_en = str(r[10]).strip() if len(r) > 10 and r[10] else desc
                    read_p.append({
                        'file': fname, 'title': title, 'titleEn': title_en,
                        'category': cat, 'categoryEn': cat_en, 'location': loc,
                        'year': year, 'architect': arch, 'description': desc,
                        'descriptionEn': desc_en
                    })
                if read_p: project_presets = read_p

        if 'Videolar' in wb_p.sheetnames:
            ws_v = wb_p['Videolar']
            v_rows = list(ws_v.iter_rows(values_only=True))
            if len(v_rows) > 1:
                read_v = []
                for r in v_rows[1:]:
                    if not r or len(r) < 2 or not r[1]: continue
                    fname = str(r[1]).strip()
                    title = str(r[2]).strip() if len(r) > 2 and r[2] else fname
                    title_en = str(r[3]).strip() if len(r) > 3 and r[3] else title
                    cat = str(r[4]).strip() if len(r) > 4 and r[4] else 'Şantiye & Uygulama'
                    cat_en = str(r[5]).strip() if len(r) > 5 and r[5] else cat
                    dur = str(r[6]).strip() if len(r) > 6 and r[6] else '0:18'
                    poster = str(r[7]).strip() if len(r) > 7 and r[7] else '/assets/projects/1.jpeg'
                    read_v.append({
                        'file': fname, 'title': title, 'titleEn': title_en,
                        'category': cat, 'categoryEn': cat_en, 'duration': dur,
                        'poster': poster
                    })
                if read_v: video_presets = read_v
        print(f"Dynamic Project Excel sync successfully read from {proj_excel_path} ({len(project_presets)} projects, {len(video_presets)} videos)!")
    except Exception as e:
        print(f"Error reading project excel {proj_excel_path}: {e}")

proj_db_items = []
for idx, p in enumerate(project_presets):
    fname = p['file']
    src = os.path.join(MASTER_PROJ_DIR, fname)
    dst = os.path.join(PUBLIC_PROJ_IMG_DIR, fname)
    if os.path.exists(src):
        try:
            if not os.path.exists(dst) or os.path.getsize(dst) != os.path.getsize(src):
                shutil.copy2(src, dst)
        except Exception:
            pass
        p['id'] = f"project-{idx+1}"
        p['mainImage'] = f"/assets/projects/{fname}"
        p['gallery'] = [f"/assets/projects/{fname}"]
        proj_db_items.append(p)

proj_vid_db_items = []
for idx, v in enumerate(video_presets):
    fname = v['file']
    src = os.path.join(MASTER_PROJ_DIR, fname)
    dst = os.path.join(PUBLIC_PROJ_VID_DIR, fname)
    if os.path.exists(src):
        try:
            if not os.path.exists(dst) or os.path.getsize(dst) != os.path.getsize(src):
                shutil.copy2(src, dst)
        except Exception:
            pass
        v['id'] = f"proj-vid-{idx+1}"
        v['videoUrl'] = f"/assets/projects/videos/{fname}"
        proj_vid_db_items.append(v)

full_projects_data = {
    "projects": proj_db_items,
    "videos": proj_vid_db_items
}

with open(PROJECTS_JSON_PATH, 'w', encoding='utf-8') as f:
    json.dump(full_projects_data, f, ensure_ascii=False, indent=2)

print(f"Projects & Project Videos sync finished: {len(proj_db_items)} projects and {len(proj_vid_db_items)} videos synced from master_data/projeler -> src/data/projects_db.json")

print("Dynamic product sync finished: All additions, updates, and deletions applied cleanly!")
