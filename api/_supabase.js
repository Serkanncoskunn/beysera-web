/* global process */
// Supabase REST çağrıları için ortak yardımcı. Yalnızca sunucuda çalışır.
// Gerekli ortam değişkenleri (Vercel > Settings > Environment Variables):
//   SUPABASE_URL               örn. https://xxxx.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY  Supabase > Project Settings > API > service_role (gizli tutun)
export function supabaseAyarlari() {
  const url = process.env.SUPABASE_URL;
  const anahtar = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !anahtar) return null;
  return { url: url.replace(/\/+$/, ''), anahtar };
}

export function supabaseIstek(ayar, yol, govde) {
  return fetch(`${ayar.url}/rest/v1/${yol}`, {
    method: 'POST',
    headers: {
      apikey: ayar.anahtar,
      Authorization: `Bearer ${ayar.anahtar}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(govde),
  });
}
