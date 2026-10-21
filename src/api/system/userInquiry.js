import request from "@/utils/request";

// 查询用户咨询列表
export function listUserConsult(params) {
    return request({
        url: "/operations/userConsult/list",
        method: "get",
        params,
    });
}
//  查询用户咨询详细
export function getUserConsultDetail(consultId) {
    return request({
        url: "/operations/userConsult/" + consultId,
        method: "get",
    });
}

// 新增用户咨询
export function addUserConsult(data) {
    return request({
        url: "/operations/userConsult",
        method: "post",
        data,
    });
}

// 更新用户咨询
export function updateUserConsult(data) {
    return request({
        url: `/operations/userConsult`,
        method: "put",
        data,
    });
}

// 删除用户咨询
export function deleteUserConsult(consultIds) {
    return request({
        url: `/operations/userConsult/${consultIds}`,
        method: "delete",
    });
}
