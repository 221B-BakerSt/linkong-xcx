import request from '@/utils/request'

/**
 * 获取企业基础信息详情
 * @param id 主键ID
 */
export function getEnterpriseBaseInfo(id) {
    return request({
        url: `/operations/enterpriseBaseInfo/${id}`,
        method: 'GET'
    })
}

/**
 * 新增企业基础信息
 * @param data 企业基础信息数据
 */
export function addEnterpriseBaseInfo(data) {
    return request({
        url: '/operations/enterpriseBaseInfo',
        method: 'POST',
        data
    })
}

/**
 * 修改企业基础信息
 * @param data 企业基础信息数据
 */
export function updateEnterpriseBaseInfo(data) {
    return request({
        url: '/operations/enterpriseBaseInfo',
        method: 'PUT',
        data
    })
}
