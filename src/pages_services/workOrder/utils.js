import store from "@/store";

export const STATUS_OPTIONS = [
    { label: "全部", value: "" },
    { label: "待派单", value: "pending_assign" },
    { label: "处理中", value: "processing" },
    { label: "待结单", value: "pending_close" },
    { label: "已结单", value: "closed" },
    { label: "已取消", value: "cancelled" },
];

export const STATUS_LABEL_MAP = {
    pending_assign: "待派单",
    processing: "处理中",
    pending_close: "待结单",
    closed: "已结单",
    cancelled: "已取消",
};

export const ORDER_TYPE_LABEL_MAP = {
    report: "报事",
    repair: "报修",
};

export const PRIORITY_LABEL_MAP = {
    normal: "普通",
    urgent: "紧急",
};

export function getRoleFlags() {
    const roles = store.state.user.roles || [];
    const managerKeys = [
        "superadmin",
        "work_order_admin",
    ];
    const isManager = roles.some((item) => managerKeys.includes(item));
    const isWorker = roles.includes("work_order_worker");
    return {
        roles,
        isManager,
        isWorker,
        isApplicant: !isManager && !isWorker,
        isMultiRole: [isManager, isWorker].filter(Boolean).length > 1,
        roleType: isManager ? "manager" : isWorker ? "worker" : "applicant",
    };
}

export function splitText(value) {
    if (!value) return [];
    return String(value)
        .replace(/^\[|\]$/g, "")
        .split(",")
        .map((item) => item.replace(/['"`]/g, "").trim())
        .filter(Boolean);
}

export function parseAttachments(ossIds, ossUrls, ossNames) {
    const ids = splitText(ossIds);
    const urls = splitText(ossUrls);
    const names = splitText(ossNames);
    return ids
        .map((id, index) => ({
            key: `${id}-${index}`,
            ossId: id,
            url: urls[index] || urls[0] || "",
            name: names[index] || `附件${index + 1}`,
        }))
        .filter((item) => item.url);
}

export function buildWorkOrderUploadFormData(scene, label) {
    return {
        bizType: "work_order",
        bizScene: scene || "apply",
        bizLabel: normalizeUploadLabel(label),
    };
}

export function isImageFile(file) {
    const target = file?.name || file?.url || "";
    return /\.(png|jpe?g|gif|bmp|webp)$/i.test(target);
}

export function previewAttachment(file) {
    if (!file?.url) return;
    if (isImageFile(file)) {
        uni.previewImage({
            urls: [file.url],
            current: file.url,
        });
        return;
    }
    uni.showLoading({ title: "打开中" });
    uni.downloadFile({
        url: file.url,
        success: (res) => {
            if (res.statusCode === 200) {
                uni.openDocument({
                    filePath: res.tempFilePath,
                    showMenu: true,
                    fail: () => {
                        uni.showToast({
                            title: "文档打开失败",
                            icon: "none",
                        });
                    },
                });
                return;
            }
            uni.showToast({
                title: "附件下载失败",
                icon: "none",
            });
        },
        fail: () => {
            uni.showToast({
                title: "附件下载失败",
                icon: "none",
            });
        },
        complete: () => {
            uni.hideLoading();
        },
    });
}

export function formatTime(value) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hour}:${minute}`;
}

export function buildUploadedFile(res, fallbackName) {
    const data = res.data || {};
    const ossId = data.ossId == null ? "" : String(data.ossId);
    return {
        ossId,
        url: data.url,
        name: data.fileName || data.originalName || fallbackName || "附件",
        status: "success",
    };
}

function normalizeUploadLabel(label) {
    if (!label) return "";
    return String(label).trim().slice(0, 24);
}
