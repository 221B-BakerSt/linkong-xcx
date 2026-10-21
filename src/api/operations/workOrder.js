import request from "@/utils/request";

export const workOrderApi = {
    list(params = {}) {
        return request({
            url: "/operations/workOrder/list",
            method: "get",
            params,
        });
    },

    draftList(params = {}) {
        return request({
            url: "/operations/workOrder/draft/list",
            method: "get",
            params,
        });
    },

    getInfo(workOrderId) {
        return request({
            url: `/operations/workOrder/${workOrderId}`,
            method: "get",
        });
    },

    overview() {
        return request({
            url: "/operations/workOrder/overview",
            method: "get",
        });
    },

    workers() {
        return request({
            url: "/operations/workOrder/workers",
            method: "get",
        });
    },

    add(data) {
        return request({
            url: "/operations/workOrder",
            method: "post",
            data,
        });
    },

    saveDraft(data) {
        return request({
            url: "/operations/workOrder/draft/save",
            method: "post",
            data,
        });
    },

    deleteDraft(workOrderId) {
        return request({
            url: `/operations/workOrder/draft/${workOrderId}`,
            method: "delete",
        });
    },

    assign(data) {
        return request({
            url: "/operations/workOrder/assign",
            method: "post",
            data,
        });
    },

    transfer(data) {
        return request({
            url: "/operations/workOrder/transfer",
            method: "post",
            data,
        });
    },

    batchTransfer(data) {
        return request({
            url: "/operations/workOrder/batchTransfer",
            method: "post",
            data,
        });
    },

    handle(data) {
        return request({
            url: "/operations/workOrder/handle",
            method: "post",
            data,
        });
    },

    close(data) {
        return request({
            url: "/operations/workOrder/close",
            method: "post",
            data,
        });
    },

    evaluate(data) {
        return request({
            url: "/operations/workOrder/evaluate",
            method: "post",
            data,
        });
    },

    rework(data) {
        return request({
            url: "/operations/workOrder/rework",
            method: "post",
            data,
        });
    },

    cancel(data) {
        return request({
            url: "/operations/workOrder/cancel",
            method: "post",
            data,
        });
    },

    remove(workOrderId) {
        return request({
            url: `/operations/workOrder/${workOrderId}`,
            method: "delete",
        });
    },

    cleanupTempOss(ossIds = []) {
        return request({
            url: "/operations/workOrder/tempOss/cleanup",
            method: "post",
            data: { ossIds },
            showLoading: false,
        });
    },
};
