import upload from "@/utils/upload";
import request from "@/utils/request";

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
    const data = {
        oldPassword,
        newPassword,
    };
    return request({
        url: "/system/user/profile/updatePwd",
        method: "PUT",
        params: data,
    });
}

// 查询用户个人信息
export function getUserProfile() {
    return request({
        url: "/system/user/profile",
        method: "GET",
    });
}

// 修改用户个人信息
export function updateUserProfile(data) {
    return request({
        url: "/system/user/profile",
        method: "PUT",
        data: data,
    });
}

// 用户头像上传
export function uploadAvatar(data) {
    return upload({
        url: "/system/user/profile/avatar",
        name: data.name,
        filePath: data.filePath,
    });
}

//字典
export function getDict(type) {
    return request({
        url: "/system/dict/" + type,
        method: "GET",
    });
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
    return request({
        url: "/system/dict/data/type/" + dictType,
        method: "get",
    });
}

export function uploadOss(data) {
    return upload({
        url: "/resource/oss/upload",
        name: data.name,
        filePath: data.filePath,
        formData: data.formData || {},
    });
}
