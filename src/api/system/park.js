import request from '@/utils/request'

// 当前登录用户实际可访问的园区范围，由后端权限决定。
export function getCurrentParkScope() {
  return request({
    url: '/system/park/scope',
    method: 'GET',
    showLoading: false
  })
}

// 后端会校验目标园区权限，并在当前会话中切换租户。
export function switchBusinessTenant(tenantId) {
  return request({
    url: `/system/tenant/dynamic/${encodeURIComponent(tenantId)}`,
    method: 'GET',
    showLoading: false
  })
}
