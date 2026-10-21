<template>
    <view class="page">
        <view class="form-card">
            <view class="section-title">基础信息</view>
            <view class="field-item">
                <text class="field-label">工单标题</text>
                <view class="field-control">
                    <input
                        v-model="form.title"
                        class="field-input"
                        placeholder="请输入工单标题"
                        placeholder-style="color: #98A2B3;"
                    />
                </view>
            </view>
            <view class="field-item">
                <text class="field-label">工单类型</text>
                <view class="radio-row">
                    <view
                        class="radio-chip"
                        :class="{ active: form.orderType === 'report' }"
                        @click="form.orderType = 'report'"
                    >
                        报事
                    </view>
                    <view
                        class="radio-chip"
                        :class="{ active: form.orderType === 'repair' }"
                        @click="form.orderType = 'repair'"
                    >
                        报修
                    </view>
                </view>
            </view>
            <view class="field-item">
                <text class="field-label">联系人</text>
                <view class="field-control">
                    <input
                        v-model="form.contactName"
                        class="field-input"
                        placeholder="请输入联系人"
                        placeholder-style="color: #98A2B3;"
                    />
                </view>
            </view>
            <view class="field-item">
                <text class="field-label">联系电话</text>
                <view class="field-control">
                    <input
                        v-model="form.contactPhone"
                        class="field-input"
                        placeholder="请输入联系电话"
                        placeholder-style="color: #98A2B3;"
                    />
                </view>
            </view>
            <view class="field-item">
                <text class="field-label">报事地点</text>
                <view class="field-control">
                    <input
                        v-model="form.location"
                        class="field-input"
                        placeholder="请输入报事地点"
                        placeholder-style="color: #98A2B3;"
                    />
                </view>
            </view>
            <view class="field-item column">
                <text class="field-label">工单内容</text>
                <view class="field-control textarea-control">
                    <textarea
                        v-model="form.description"
                        class="field-textarea"
                        maxlength="1000"
                        placeholder="请输入报事报修内容"
                        placeholder-style="color: #98A2B3;"
                    />
                </view>
            </view>
        </view>

        <view class="form-card">
            <view class="section-title">附件上传</view>
            <view class="upload-actions">
                <view class="upload-btn" @click="chooseImage">上传图片</view>
                <view class="upload-btn upload-btn-secondary" @click="chooseFile">上传文档</view>
            </view>
            <view class="upload-tip">支持图片、Word、Excel、PDF、压缩包等附件。</view>
            <view v-if="files.length" class="file-list">
                <view
                    v-for="(item, index) in files"
                    :key="item.tempKey || item.ossId || index"
                    class="file-item"
                >
                    <view class="file-main" @click="previewFile(item)">
                        <text class="file-name">{{ item.name }}</text>
                        <text class="file-status" :class="item.status">
                            {{
                                item.status === "uploading"
                                    ? "上传中"
                                    : item.status === "failed"
                                    ? "失败"
                                    : "已上传"
                            }}
                        </text>
                    </view>
                    <text class="file-remove" @click="removeFile(index)">删除</text>
                </view>
            </view>
        </view>

        <view class="submit-bar">
            <button class="draft-btn" :disabled="draftSubmitting" @click="saveDraft">
                {{ draftSubmitting ? "保存中..." : "保存草稿" }}
            </button>
            <button class="submit-btn" :disabled="submitting" @click="submitForm">
                {{ submitting ? "提交中..." : "提交工单" }}
            </button>
        </view>
    </view>
</template>

<script setup>
import { reactive, ref } from "vue";
import { onLoad, onUnload } from "@dcloudio/uni-app";
import { uploadOss } from "@/api/system/user";
import { workOrderApi } from "@/api/operations/workOrder";
import {
    buildWorkOrderUploadFormData,
    buildUploadedFile,
    getRoleFlags,
    parseAttachments,
    previewAttachment,
} from "./utils";

const roleFlags = getRoleFlags();
const form = reactive({
    workOrderId: "",
    title: "",
    orderType: "report",
    contactName: "",
    contactPhone: "",
    location: "",
    description: "",
});

const files = ref([]);
const submitting = ref(false);
const draftSubmitting = ref(false);
const pageUnloaded = ref(false);
const shouldCleanupTempFiles = ref(true);
const removedTempKeys = new Set();

const chooseImage = () => {
    const remain = Math.max(0, 10 - files.value.length);
    if (!remain) {
        uni.showToast({ title: "最多上传10个附件", icon: "none" });
        return;
    }
    uni.chooseImage({
        count: remain,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
            (res.tempFilePaths || []).forEach((path) => {
                uploadSingleFile(path, fileNameFromPath(path));
            });
        },
    });
};

const chooseFile = () => {
    const remain = Math.max(0, 10 - files.value.length);
    if (!remain) {
        uni.showToast({ title: "最多上传10个附件", icon: "none" });
        return;
    }
    const chooseApi =
        uni.chooseMessageFile ||
        (typeof wx !== "undefined" ? wx.chooseMessageFile : null);
    if (!chooseApi) {
        uni.showToast({ title: "当前环境不支持选择文件", icon: "none" });
        return;
    }
    chooseApi({
        count: remain,
        type: "file",
        extension: ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "zip"],
        success: (res) => {
            const tempFiles = res.tempFiles || [];
            tempFiles.forEach((file) => {
                uploadSingleFile(file.path || file.tempFilePath, file.name || fileNameFromPath(file.path || ""));
            });
        },
    });
};

const uploadSingleFile = (filePath, fileName) => {
    const tempKey = `${Date.now()}-${Math.random()}`;
    files.value.push({
        tempKey,
        name: fileName,
        url: filePath,
        status: "uploading",
        sessionUploaded: true,
        persisted: false,
    });
    uploadOss({
        filePath,
        name: "file",
        formData: buildWorkOrderUploadFormData(
            "apply",
            form.title || form.workOrderId || "new"
        ),
    })
        .then((res) => {
            const uploadedFile = {
                ...buildUploadedFile(res, fileName),
                tempKey,
                sessionUploaded: true,
                persisted: false,
            };
            if (pageUnloaded.value || removedTempKeys.has(tempKey)) {
                removedTempKeys.delete(tempKey);
                cleanupTempOssIds([uploadedFile.ossId]);
                return;
            }
            replaceFileByTempKey(tempKey, uploadedFile);
        })
        .catch(() => {
            removedTempKeys.delete(tempKey);
            replaceFileByTempKey(tempKey, (current) => ({
                ...current,
                status: "failed",
            }));
        });
};

const replaceFileByTempKey = (tempKey, nextValue) => {
    const index = files.value.findIndex((item) => item.tempKey === tempKey);
    if (index < 0) return;
    files.value[index] =
        typeof nextValue === "function" ? nextValue(files.value[index]) : nextValue;
};

const removeFile = (index) => {
    const target = files.value[index];
    files.value.splice(index, 1);
    if (!target) return;
    if (target.status === "uploading" && target.tempKey) {
        removedTempKeys.add(target.tempKey);
        return;
    }
    if (target.status === "success" && target.sessionUploaded && !target.persisted && target.ossId) {
        cleanupTempOssIds([target.ossId]);
    }
};

const previewFile = (item) => {
    previewAttachment(item);
};

const hasUploading = () => files.value.some((item) => item.status === "uploading");

const buildOssIds = () =>
    files.value
        .filter((item) => item.status === "success" && item.ossId)
        .map((item) => item.ossId)
        .join(",");

const buildPayload = () => ({
    workOrderId: form.workOrderId || undefined,
    title: form.title,
    orderType: form.orderType,
    contactName: form.contactName,
    contactPhone: form.contactPhone,
    location: form.location,
    description: form.description,
    applyOssIds: buildOssIds(),
});

const cleanupTempOssIds = (ossIds = []) => {
    const targetIds = Array.from(
        new Set(
            ossIds
                .map((item) => (item == null ? "" : String(item).trim()))
                .filter((item) => /^\d+$/.test(item))
        )
    );
    if (!targetIds.length) return Promise.resolve();
    return workOrderApi.cleanupTempOss(targetIds).catch(() => undefined);
};

const collectCurrentTempOssIds = () =>
    files.value
        .filter((item) => item.status === "success" && item.sessionUploaded && !item.persisted && item.ossId)
        .map((item) => item.ossId);

const disableTempCleanup = () => {
    shouldCleanupTempFiles.value = false;
    files.value = files.value.map((item) => ({
        ...item,
        persisted: true,
    }));
};

const fillForm = (data = {}) => {
    form.workOrderId = data.workOrderId || "";
    form.title = data.title || "";
    form.orderType = data.orderType || "report";
    form.contactName = data.contactName || "";
    form.contactPhone = data.contactPhone || "";
    form.location = data.location || "";
    form.description = data.description || "";
};

const fillFiles = (data = {}) => {
    files.value = parseAttachments(data.applyOssIds, data.applyOssUrls, data.applyOssNames).map((item) => ({
        ...item,
        status: "success",
        sessionUploaded: false,
        persisted: true,
    }));
};

const redirectAfterDraft = () => {
    uni.redirectTo({
        url: "/pages_services/workOrder/list?draftMode=1&label=我的草稿",
    });
};

const redirectAfterSubmit = () => {
    const targetUrl = roleFlags.isManager
        ? "/pages_services/workOrder/list?label=全部工单"
        : "/pages_services/workOrder/list?label=我的工单";
    uni.redirectTo({
        url: targetUrl,
    });
};

const submitForm = async () => {
    if (!form.title) {
        uni.showToast({ title: "请输入工单标题", icon: "none" });
        return;
    }
    if (!form.contactName) {
        uni.showToast({ title: "请输入联系人", icon: "none" });
        return;
    }
    if (!form.contactPhone) {
        uni.showToast({ title: "请输入联系电话", icon: "none" });
        return;
    }
    if (!form.location) {
        uni.showToast({ title: "请输入报事地点", icon: "none" });
        return;
    }
    if (!form.description) {
        uni.showToast({ title: "请输入工单内容", icon: "none" });
        return;
    }
    if (hasUploading()) {
        uni.showToast({ title: "附件仍在上传中", icon: "none" });
        return;
    }
    submitting.value = true;
    try {
        await workOrderApi.add(buildPayload());
        disableTempCleanup();
        uni.showToast({ title: "提交成功", icon: "success" });
        setTimeout(() => {
            redirectAfterSubmit();
        }, 500);
    } catch (error) {
        uni.showToast({ title: "提交失败", icon: "none" });
    } finally {
        submitting.value = false;
    }
};

const saveDraft = async () => {
    if (hasUploading()) {
        uni.showToast({ title: "附件仍在上传中", icon: "none" });
        return;
    }
    draftSubmitting.value = true;
    try {
        const res = await workOrderApi.saveDraft(buildPayload());
        form.workOrderId = res.data || form.workOrderId;
        disableTempCleanup();
        uni.showToast({ title: "草稿保存成功", icon: "success" });
        setTimeout(() => {
            redirectAfterDraft();
        }, 500);
    } catch (error) {
        uni.showToast({ title: "草稿保存失败", icon: "none" });
    } finally {
        draftSubmitting.value = false;
    }
};

const fileNameFromPath = (path) => {
    if (!path) return "附件";
    const parts = String(path).split("/");
    return parts[parts.length - 1] || "附件";
};

const loadDraftDetail = async (workOrderId) => {
    if (!workOrderId) return;
    uni.showLoading({ title: "加载中" });
    try {
        const res = await workOrderApi.getInfo(workOrderId);
        const data = res.data || {};
        fillForm(data);
        fillFiles(data);
    } catch (error) {
        uni.showToast({ title: "草稿加载失败", icon: "none" });
    } finally {
        uni.hideLoading();
    }
};

const initPage = async (options) => {
    if (options.workOrderId) {
        uni.setNavigationBarTitle({
            title: "编辑草稿",
        });
        form.workOrderId = options.workOrderId;
        await loadDraftDetail(options.workOrderId);
        return;
    }
    uni.setNavigationBarTitle({
        title: "发起工单",
    });
};

onLoad((options) => {
    initPage(options || {});
});

onUnload(() => {
    pageUnloaded.value = true;
    if (!shouldCleanupTempFiles.value) {
        return;
    }
    cleanupTempOssIds(collectCurrentTempOssIds());
});
</script>

<style scoped lang="scss">
.page {
    min-height: 100vh;
    padding: 24rpx 24rpx 180rpx;
    background: #f4f7fb;
}

.form-card {
    background: #ffffff;
    border-radius: 24rpx;
    padding: 28rpx;
    box-shadow: 0 16rpx 40rpx rgba(15, 23, 42, 0.05);
    margin-bottom: 20rpx;
}

.section-title {
    font-size: 30rpx;
    font-weight: 600;
    color: #101828;
    margin-bottom: 18rpx;
}

.field-item {
    padding: 24rpx 0;
    border-bottom: 1rpx solid #eef2f7;
}

.field-item.column {
    border-bottom: none;
}

.field-label {
    display: block;
    font-size: 26rpx;
    color: #344054;
    margin-bottom: 12rpx;
}

.field-control {
    width: 100%;
    border-radius: 18rpx;
    background: #f8fafc;
    font-size: 26rpx;
    box-sizing: border-box;
    border: 1rpx solid #e6edf5;
    padding: 0 24rpx;
}

.textarea-control {
    padding: 24rpx;
}

.field-input,
.field-textarea {
    width: 100%;
    box-sizing: border-box;
    display: block;
    background: transparent;
    color: #101828;
    font-size: 28rpx;
}

.field-input {
    height: 96rpx;
    min-height: 96rpx;
    line-height: 96rpx;
}

.field-textarea {
    height: 320rpx;
    min-height: 320rpx;
    line-height: 1.7;
    text-align: left;
}

.radio-row {
    display: flex;
    gap: 18rpx;
}

.radio-chip {
    min-width: 160rpx;
    height: 72rpx;
    line-height: 72rpx;
    text-align: center;
    border-radius: 999rpx;
    background: #f2f4f7;
    color: #475467;
    font-size: 24rpx;
}

.radio-chip.active {
    background: #175cd3;
    color: #ffffff;
}

.upload-actions {
    display: flex;
    gap: 16rpx;
}

.upload-btn {
    flex: 1;
    height: 78rpx;
    line-height: 78rpx;
    text-align: center;
    border-radius: 18rpx;
    background: #175cd3;
    color: #ffffff;
    font-size: 26rpx;
}

.upload-btn-secondary {
    background: #0f4c81;
}

.upload-tip {
    margin-top: 14rpx;
    color: #667085;
    font-size: 22rpx;
}

.file-list {
    margin-top: 18rpx;
}

.file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20rpx;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #eef2f7;
}

.file-main {
    flex: 1;
}

.file-name {
    display: block;
    font-size: 24rpx;
    color: #101828;
    line-height: 1.6;
}

.file-status {
    display: block;
    margin-top: 8rpx;
    font-size: 22rpx;
    color: #12b76a;
}

.file-status.uploading {
    color: #175cd3;
}

.file-status.failed {
    color: #f04438;
}

.file-remove {
    font-size: 24rpx;
    color: #c01048;
}

.submit-bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    gap: 18rpx;
    padding: 20rpx 24rpx 36rpx;
    background: rgba(244, 247, 251, 0.96);
}

.draft-btn,
.submit-btn {
    flex: 1;
    height: 88rpx;
    line-height: 88rpx;
    border-radius: 999rpx;
    font-size: 30rpx;
}

.draft-btn {
    background: #eef4ff;
    color: #175cd3;
}

.submit-btn {
    background: #175cd3;
    color: #ffffff;
}
</style>
