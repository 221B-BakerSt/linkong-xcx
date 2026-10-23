import config from '@/config'

const apiBaseUrl = String(config.baseUrl || '').replace(/\/prod-api\/?$/, '')

/**
 * Normalize file fields returned by the backend for WeChat image/download
 * components. The backend may return an absolute URL, a root-relative path,
 * or a comma-separated file list.
 */
export function getMediaUrl(value: unknown, fallback = ''): string {
  const raw = Array.isArray(value)
    ? String(value[0] || '').trim()
    : String(value || '').split(',')[0].trim()

  if (!raw) return fallback
  if (/^(https?:|data:|wxfile:)/i.test(raw)) return raw
  if (raw.startsWith('//')) return `https:${raw}`
  if (!apiBaseUrl) return raw
  return `${apiBaseUrl}/${raw.replace(/^\/+/, '')}`
}
