const CURRENT_PARK_KEY = 'CurrentPark'
const TENANT_ID_KEY = 'TenantId'

export function getCurrentPark() {
  return uni.getStorageSync(CURRENT_PARK_KEY) || null
}

export function getCurrentParkId() {
  const park = getCurrentPark()
  return park && park.parkId ? String(park.parkId) : ''
}

export function getCurrentTenantId() {
  const storedTenantId = uni.getStorageSync(TENANT_ID_KEY)
  if (storedTenantId) {
    // GROUP 只是登录入口，后端登录会使用默认租户承载集团账号。
    return String(storedTenantId) === 'GROUP' ? '000000' : String(storedTenantId)
  }
  const park = getCurrentPark()
  return park && park.tenantId ? String(park.tenantId) : ''
}

export function setCurrentPark(park) {
  if (!park || !park.parkId) return
  uni.setStorageSync(CURRENT_PARK_KEY, park)
  if (park.tenantId) uni.setStorageSync(TENANT_ID_KEY, String(park.tenantId))
}

export function clearCurrentPark() {
  uni.removeStorageSync(CURRENT_PARK_KEY)
}
