import request from "@/utils/request";

/**
 * 查询企业考核任务列表
 * @param params 请求参数
 * @returns {Promise<ResponseData<unknown>>}
 */
export function getEnterpriseAssessmentList(params) {
    return request({
        url: "/operations/assessment/list",
        method: "get",
        params,
    });
}

/**
 * 导出企业考核任务列表
 * @param params 请求参数
 * @returns {Promise<Blob>}
 */
export function exportEnterpriseAssessment(params) {
    return request({
        url: "/operations/assessment/export",
        method: "post",
        params,
        responseType: "blob",
    });
}

/**
 * 获取企业考核任务详细信息
 * @param assessmentId 主键
 * @returns {Promise<ResponseData<unknown>>}
 */
export function getEnterpriseAssessmentDetail(assessmentId) {
    return request({
        url: "/operations/assessment/" + assessmentId,
        method: "get",
    });
}

/**
 * 新增企业考核任务
 * @param data 提交的数据（LkEnterpriseAssessmentBo）
 * @returns {Promise<ResponseData<unknown>>}
 */
export function addEnterpriseAssessment(data) {
    return request({
        url: "/operations/assessment",
        method: "post",
        data,
    });
}

export function addEnterpriseAssessmentDetail(data) {
    return request({
        url: "/operations/assessmentDetail",
        method: "post",
        data,
    });
}

/**
 * 修改企业考核任务
 * @param data 提交的数据（LkEnterpriseAssessmentBo）
 * @returns {Promise<ResponseData<unknown>>}
 */
export function updateEnterpriseAssessment(data) {
    return request({
        url: "/operations/assessment",
        method: "put",
        data,
    });
}

export function updateEnterpriseAssessmentDetail(data) {
    return request({
        url: "/operations/assessmentDetail",
        method: "put",
        data,
    });
}

/**
 * 删除企业考核任务
 * @param assessmentIds 主键数组
 * @returns {Promise<ResponseData<unknown>>}
 */
export function deleteEnterpriseAssessment(assessmentIds) {
    return request({
        url: "/operations/assessment/" + assessmentIds.join(","),
        method: "delete",
    });
}
