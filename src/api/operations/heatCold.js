import request from '@/utils/request'

/**
 * 查询供暖制冷需求列表
 * @param {Object} params 查询参数
 */
export function getHeatColdList(params) {
  return request({
    url: '/operations/matchingHeatCold/list',
    method: 'GET',
    params
  })
}

/**
 * 获取供暖制冷需求详情
 * @param {Number} heatColdId 主键
 */
export function getHeatColdDetail(heatColdId) {
  return request({
    url: `/operations/matchingHeatCold/${heatColdId}`,
    method: 'GET'
  })
}

/**
 * 新增供暖制冷需求
 * @param {Object} data 表单数据
 * @param {String} data.companyName 公司名称
 * @param {String} data.address     地址（位置）
 * @param {String} data.area        面积
 * @param {String} data.type        需求类型（供冷/供暖）
 * @param {String} data.startDate   开始日期
 * @param {String} data.endDate     结束日期
 * @param {Number} data.daysNum     天数
 * @param {String} data.phoneNum    联系电话
 * @param {String} data.contact     联系人
 */
export function addHeatCold(data) {
  return request({
    url: '/operations/matchingHeatCold',
    method: 'POST',
    data
  })
}

/**
 * 修改供暖制冷需求
 * @param {Object} data 表单数据（需包含 heatColdId）
 */
export function updateHeatCold(data) {
  return request({
    url: '/operations/matchingHeatCold',
    method: 'PUT',
    data
  })
}

/**
 * 删除供暖制冷需求
 * @param {Array} heatColdIds 主键数组
 */
export function deleteHeatCold(heatColdIds) {
  return request({
    url: `/operations/matchingHeatCold/${heatColdIds.join(',')}`,
    method: 'DELETE'
  })
}
