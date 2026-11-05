import request from "@/utils/request";

/**
 * 查询企业诉求列表
 * @param bo 请求参数
 * @param pageQuery 分页参数
 * @returns {Promise<ResponseData<unknown>>}
 */
export function getInteractionDemandList(bo, pageQuery) {
    return request({
        url: "/operations/interactionDemand/list",
        method: "get",
        params: {
            ...bo,
            ...pageQuery,
        },
    });
}

/**
 * 导出企业诉求列表
 * @param bo 请求参数
 * @returns {Promise<Blob>}
 */
export function exportInteractionDemand(bo) {
    return request({
        url: "/operations/interactionDemand/export",
        method: "post",
        params: bo,
        responseType: "blob",
    });
}

/**
 * 获取企业诉求详细信息
 * @param demandId 主键
 * @returns {Promise<ResponseData<unknown>>}
 */
export function getInteractionDemandDetail(demandId) {
    return request({
        url: "/operations/interactionDemand/" + demandId,
        method: "get",
    });
}

/**
 * 新增企业诉求
 * @param bo 提交的数据
 * @returns {Promise<ResponseData<unknown>>}
 */
export function addInteractionDemand(bo) {
    return request({
        url: "/operations/interactionDemand",
        method: "post",
        data: bo,
    });
}

/**
 * 修改企业诉求
 * @param bo 提交的数据
 * @returns {Promise<ResponseData<unknown>>}
 */
export function updateInteractionDemand(bo) {
    return request({
        url: "/operations/interactionDemand",
        method: "put",
        data: bo,
    });
}

/**
 * 删除企业诉求
 * @param demandIds 主键数组
 * @returns {Promise<ResponseData<unknown>>}
 */
export function deleteInteractionDemand(demandIds) {
    return request({
        url: "/operations/interactionDemand/" + demandIds.join(","),
        method: "delete",
    });
}
