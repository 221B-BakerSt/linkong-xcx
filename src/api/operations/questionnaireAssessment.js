import request from "@/utils/request";

/**
 * 查询问卷调查任务列表
 * @param params 请求参数
 * @returns {Promise<ResponseData<unknown>>}
 */
export function getQuestionnaireAssessmentList(params) {
    return request({
        url: "/operations/questionnaireAssessment/list",
        method: "get",
        params,
    });
}

/**
 * 获取问卷调查任务详细信息
 * @param assessmentId 主键
 * @returns {Promise<ResponseData<unknown>>}
 */
export function getQuestionnaireAssessmentDetail(assessmentId) {
    return request({
        url: "/operations/questionnaireAssessment/" + assessmentId,
        method: "get",
    });
}

// ==================== 餐厅问卷 ====================

/**
 * 查询餐厅问卷任务列表（手机端）
 * @param type 问卷类型（可选，传 'restaurant' 则只查餐厅类，不传查全部）
 * @returns {Promise<ResponseData<unknown>>}
 */
export function getRestaurantQuestTaskList(type) {
    return request({
        url: "/app/restaurantQuest/taskList",
        method: "get",
        params: type ? { type } : {},
    });
}

/**
 * 分页查询当前部门已提交的餐厅问卷列表
 * @param params 请求参数
 * @returns {Promise<ResponseData<unknown>>}
 */
export function getRestaurantQuestList(params) {
    return request({
        url: "/app/restaurantQuest/list",
        method: "get",
        params,
    });
}

/**
 * 提交餐厅问卷调查（新增）- 手机端
 * @param data 提交的数据（LkRestaurantQuestBo）
 * @returns {Promise<ResponseData<unknown>>}
 */
export function submitRestaurantQuest(data) {
    return request({
        url: "/app/restaurantQuest",
        method: "post",
        data,
    });
}

/**
 * 修改餐厅问卷调查
 * @param data 提交的数据（LkRestaurantQuestBo）
 * @returns {Promise<ResponseData<unknown>>}
 */
export function updateRestaurantQuest(data) {
    return request({
        url: "/app/restaurantQuest",
        method: "put",
        data,
    });
}

/**
 * 删除餐厅问卷
 * @param restaurantQuestIds 主键数组
 * @returns {Promise<ResponseData<unknown>>}
 */
export function deleteRestaurantQuest(restaurantQuestIds) {
    return request({
        url: "/app/restaurantQuest/" + restaurantQuestIds.join(","),
        method: "delete",
    });
}

/**
 * 餐厅问卷数据统计
 * @param assessmentId 任务 ID
 * @returns {Promise<ResponseData<unknown>>}
 */
export function statRestaurantQuest(assessmentId) {
    return request({
        url: "/app/restaurantQuest/stat/" + assessmentId,
        method: "get",
    });
}

// ==================== 物业问卷 ====================

/**
 * 查询物业问卷任务列表（手机端）
 * @param type 问卷类型（可选，传 'property' 则只查物业类，不传查全部）
 * @returns {Promise<ResponseData<unknown>>}
 */
export function getPropertyQuestTaskList(type) {
    return request({
        url: "/app/propertyQuest/taskList",
        method: "get",
        params: type ? { type } : {},
    });
}

/**
 * 分页查询当前部门已提交的物业问卷列表
 * @param params 请求参数
 * @returns {Promise<ResponseData<unknown>>}
 */
export function getPropertyQuestList(params) {
    return request({
        url: "/app/propertyQuest/list",
        method: "get",
        params,
    });
}

/**
 * 提交物业问卷调查（新增）- 手机端
 * @param data 提交的数据（LkPropertyQuestBo）
 * @returns {Promise<ResponseData<unknown>>}
 */
export function submitAddPropertyQuest(data) {
    return request({
        url: "/app/propertyQuest",
        method: "post",
        data,
    });
}

export function submitPropertyQuest(data) {
    return request({
        url: "/operations/propertyQuest",
        method: "post",
        data,
    });
}

// ==================== 活动报名 ====================

/**
 * 查询活动任务列表（手机端）
 * @returns {Promise<ResponseData<unknown>>}
 */
export function getActivityTaskList() {
    return request({
        url: "/app/activityRegister/taskList",
        method: "get",
    });
}

/**
 * 查询活动任务详情（手机端）
 * @param assessmentId 活动 ID
 * @returns {Promise<ResponseData<unknown>>}
 */
export function getActivityTaskDetail(assessmentId) {
    return request({
        url: "/app/activityRegister/task/" + assessmentId,
        method: "get",
    });
}

/**
 * 分页查询当前用户的报名记录
 * @param params 请求参数
 * @returns {Promise<ResponseData<unknown>>}
 */
export function getActivityRegisterList(params) {
    return request({
        url: "/app/activityRegister/list",
        method: "get",
        params,
    });
}

/**
 * 提交活动报名（新增）- 手机端
 * @param data 提交的数据（LkActivityRegisterBo）
 * @returns {Promise<ResponseData<unknown>>}
 */
export function submitActivityRegister(data) {
    return request({
        url: "/app/activityRegister",
        method: "post",
        data,
    });
}
