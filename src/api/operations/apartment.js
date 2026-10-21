import request from '@/utils/request'

/**
 * 获取园区配套宿舍详情
 * @param apartmentId 公寓ID
 */
export function getApartmentDetail(apartmentId) {
    return request({
        url: `/operations/matchingApartment/${apartmentId}`,
        method: 'GET'
    })
}

/**
 * 查询园区配套宿舍列表
 * @param params 查询参数
 */
export function getApartmentList(params) {
    return request({
        url: '/operations/matchingApartment/list',
        method: 'GET',
        params
    })
}

/**
 * 提交公寓预约
 * @param data 预约信息
 */
export function addApartmentBooking(data) {
    return request({
        url: '/app/apartmentBooking',
        method: 'POST',
        data
    })
}
