import request from '@/utils/request'

/**
 * 查询政策超市列表
 * @param {Object} params 查询参数
 */
export function getPolicySupermarketList(params) {
  return request({
    url: '/operations/policySupermarket/list',
    method: 'GET',
    params
  })
}

/**
 * 获取政策超市详情
 * @param {Number} id 主键
 */
export function getPolicySupermarketDetail(id) {
  return request({
    url: `/operations/policySupermarket/${id}`,
    method: 'GET'
  })
}

/**
 * 查询服务机构列表
 * @param {Object} params 查询参数
 */
export function getServiceOrganizationList(params) {
  return request({
    url: '/operations/organizationServe/list',
    method: 'GET',
    params
  })
}

/**
 * 获取服务机构详情
 * @param {Number} id 主键
 */
export function getServiceOrganizationDetail(id) {
  return request({
    url: `/operations/organizationServe/${id}`,
    method: 'GET'
  })
}

