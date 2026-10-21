<template>
    <view class="page" v-if="detail">
        <view class="status-card">
            <view class="status-row">
                <text class="status-title">{{ detail.title || "-" }}</text>
                <text class="status-pill" :class="detail.status">
                    {{ STATUS_LABEL_MAP[detail.status] || detail.status }}
                </text>
            </view>
            <view class="status-desc">工单编号：{{ detail.orderNo || "-" }}</view>
        </view>

        <view class="section-card">
            <view class="section-title">基础信息</view>
            <view class="info-row"><text>工单类型</text><text>{{ ORDER_TYPE_LABEL_MAP[detail.orderType] || "-" }}</text></view>
            <view class="info-row"><text>优先级</text><text>{{ PRIORITY_LABEL_MAP[detail.priorityLevel] || "-" }}</text></view>
            <view class="info-row"><text>提报人</text><text>{{ detail.createByName || "-" }}</text></view>
            <view class="info-row"><text>联系人</text><text>{{ detail.contactName || "-" }}</text></view>
            <view class="info-row"><text>联系电话</text><text>{{ detail.contactPhone || "-" }}</text></view>
            <view class="info-row"><text>报事地点</text><text>{{ detail.location || "-" }}</text></view>
            <view class="info-row"><text>当前处理人</text><text>{{ detail.assignedUserNickName || detail.assignedUserName || "-" }}</text></view>
            <view class="info-row"><text>创建时间</text><text>{{ formatTime(detail.createTime) }}</text></view>
            <view class="info-block">
                <text class="label">工单内容</text>
                <text class="content">{{ detail.description || "-" }}</text>
            </view>
        </view>

        <view class="section-card">
            <view class="section-title">阶段信息</view>
            <view class="stage-box">
                <text class="stage-title">提报附件</text>
                <view class="attachment-list">
                    <view
                        v-for="file in applyFiles"
                        :key="file.key"
                        class="attachment-item"
                        @click="previewAttachment(file)"
                    >
                        {{ file.name }}
                    </view>
                    <text v-if="!applyFiles.length" class="empty-text">暂无附件</text>
                </view>
            </view>
            <view class="stage-box">
                <text class="stage-title">处理结果</text>
                <text class="stage-content">{{ detail.handleResult || "-" }}</text>
                <view class="attachment-list">
                    <view
                        v-for="file in handleFiles"
                        :key="file.key"
                        class="attachment-item"
                        @click="previewAttachment(file)"
                    >
                        {{ file.name }}
                    </view>
                    <text v-if="!handleFiles.length" class="empty-text">暂无附件</text>
                </view>
            </view>
            <view class="stage-box">
                <text class="stage-title">结单说明</text>
                <text class="stage-content">{{ detail.closeRemark || "-" }}</text>
                <view class="attachment-list">
                    <view
                        v-for="file in closeFiles"
                        :key="file.key"
                        class="attachment-item"
                        @click="previewAttachment(file)"
                    >
                        {{ file.name }}
                    </view>
                    <text v-if="!closeFiles.length" class="empty-text">暂无附件</text>
                </view>
            </view>
            <view
                v-if="detail.status === 'closed' || detail.evaluateScore || detail.evaluateContent || evaluateFiles.length"
                class="stage-box"
            >
                <text class="stage-title">服务评价</text>
                <view class="info-row compact">
                    <text>评价评分</text>
                    <text>{{ formatEvaluateScore(detail.evaluateScore) }}</text>
                </view>
                <view class="info-row compact">
                    <text>评价时间</text>
                    <text>{{ formatTime(detail.evaluatedTime) }}</text>
                </view>
                <text class="stage-content">{{ detail.evaluateContent || "暂未填写评价内容" }}</text>
                <view class="attachment-list">
                    <view
                        v-for="file in evaluateFiles"
                        :key="file.key"
                        class="attachment-item"
                        @click="previewAttachment(file)"
                    >
                        {{ file.name }}
                    </view>
                    <text v-if="!evaluateFiles.length" class="empty-text">暂无附件</text>
                </view>
            </view>
        </view>

        <view class="section-card">
            <view class="section-title">流转进程</view>
            <view
                v-for="flow in detail.flowList || []"
                :key="flow.flowId"
                class="timeline-item"
            >
                <view class="timeline-dot"></view>
                <view class="timeline-body">
                    <view class="timeline-head">
                        <text class="timeline-action">{{ flow.actionLabel }}</text>
                        <text class="timeline-time">{{ formatTime(flow.createTime) }}</text>
                    </view>
                    <view class="timeline-row">
                        操作人：{{ flow.operatorNickName || flow.operatorName || "-" }}
                    </view>
                    <view class="timeline-row">
                        状态：{{ STATUS_LABEL_MAP[flow.fromStatus] || flow.fromStatus || "起始" }}
                        → {{ STATUS_LABEL_MAP[flow.toStatus] || flow.toStatus || "结束" }}
                    </view>
                    <view v-if="flow.targetUserName || flow.targetUserId" class="timeline-row">
                        指向处理人：{{ flow.targetUserName || flow.targetUserId }}
                    </view>
                    <view v-if="flow.remark" class="timeline-row">
                        备注：{{ flow.remark }}
                    </view>
                    <view class="attachment-list">
                        <view
                            v-for="file in parseAttachments(flow.ossIds, flow.ossUrls, flow.ossNames)"
                            :key="file.key"
                            class="attachment-item"
                            @click="previewAttachment(file)"
                        >
                            {{ file.name }}
                        </view>
                        <text
                            v-if="!parseAttachments(flow.ossIds, flow.ossUrls, flow.ossNames).length"
                            class="empty-text"
                        >
                            无附件
                        </text>
                    </view>
                </view>
            </view>
        </view>

        <view v-if="actionButtons.length || detail.canDelete" class="section-card">
            <view class="section-title">可执行操作</view>
            <view class="action-buttons">
                <view
                    v-for="item in actionButtons"
                    :key="item.type"
                    class="action-pill"
                    :class="{ active: currentAction === item.type }"
                    @click="openAction(item.type)"
                >
                    {{ item.label }}
                </view>
            </view>
            <view
                v-if="detail.canDelete"
                class="delete-entry"
                @click="deleteRecord"
            >
                {{ deleting ? "删除中..." : "删除记录（附件会一起删除）" }}
            </view>
        </view>

        <view v-if="currentAction" class="section-card">
            <view class="section-title">{{ actionTitle }}</view>
            <view v-if="isAssignAction" class="field-item">
                <text class="field-label">维修人员</text>
                <picker :range="workerOptions" range-key="displayName" @change="handleWorkerChange">
                    <view class="picker-field">
                        {{ selectedWorkerLabel || "请选择维修人员" }}
                    </view>
                </picker>
            </view>
            <view v-if="currentAction === 'assign'" class="field-item">
                <text class="field-label">优先级</text>
                <view class="radio-row">
                    <view
                        class="radio-chip"
                        :class="{ active: actionForm.priorityLevel === 'normal' }"
                        @click="actionForm.priorityLevel = 'normal'"
                    >
                        普通
                    </view>
                    <view
                        class="radio-chip"
                        :class="{ active: actionForm.priorityLevel === 'urgent' }"
                        @click="actionForm.priorityLevel = 'urgent'"
                    >
                        紧急
                    </view>
                </view>
            </view>
            <view v-if="currentAction === 'evaluate'" class="field-item">
                <text class="field-label">服务评分</text>
                <view class="score-grid">
                    <view
                        v-for="item in evaluateScoreOptions"
                        :key="item.value"
                        class="score-item"
                        :class="{ active: actionForm.evaluateScore === item.value }"
                        @click="actionForm.evaluateScore = item.value"
                    >
                        {{ item.label }}
                    </view>
                </view>
            </view>
            <view class="field-item">
                <text class="field-label">{{ actionLabel }}</text>
                <view class="textarea-wrap">
                    <textarea
                        v-model="actionForm.remark"
                        class="textarea-field"
                        :placeholder="actionPlaceholder"
                        placeholder-style="color: #98A2B3;"
                        maxlength="1000"
                    />
                </view>
            </view>
            <view v-if="showActionUpload" class="field-item">
                <text class="field-label">附件上传</text>
                <view class="upload-actions">
                    <view class="upload-btn" @click="chooseActionImage">上传图片</view>
                    <view class="upload-btn upload-btn-secondary" @click="chooseActionFile">上传文档</view>
                </view>
                <view v-if="actionFiles.length" class="file-list">
                    <view
                        v-for="(item, index) in actionFiles"
                        :key="item.tempKey || item.ossId || index"
                        class="file-item"
                    >
                        <view class="file-main" @click="previewAttachment(item)">
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
                        <text class="file-remove" @click="removeActionFile(index)">删除</text>
                    </view>
                </view>
            </view>

            <button class="submit-btn" :disabled="submitting" @click="submitAction">
                {{ submitting ? "提交中..." : "确认提交" }}
            </button>
        </view>
    </view>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { onLoad, onShow, onUnload } from "@dcloudio/uni-app";
import { uploadOss } from "@/api/system/user";
import { workOrderApi } from "@/api/operations/workOrder";
import {
    STATUS_LABEL_MAP,
    ORDER_TYPE_LABEL_MAP,
    PRIORITY_LABEL_MAP,
    buildWorkOrderUploadFormData,
    parseAttachments,
    previewAttachment,
    formatTime,
    buildUploadedFile,
    getRoleFlags,
} from "./utils";

const roleFlags = getRoleFlags();
const workOrderId = ref("");
const detail = ref(null);
const currentAction = ref("");
const workerOptions = ref([]);
const actionFiles = ref([]);
const submitting = ref(false);
const deleting = ref(false);
const selectedWorkerLabel = ref("");
const pageUnloaded = ref(false);
const removedActionTempKeys = new Set();

const actionForm = reactive({
    assignedUserId: "",
    priorityLevel: "",
    remark: "",
    evaluateScore: 5,
});

const applyFiles = computed(() =>
    parseAttachments(detail.value?.applyOssIds, detail.value?.applyOssUrls, detail.value?.applyOssNames)
);
const handleFiles = computed(() =>
    parseAttachments(detail.value?.handleOssIds, detail.value?.handleOssUrls, detail.value?.handleOssNames)
);
const closeFiles = computed(() =>
    parseAttachments(detail.value?.closeOssIds, detail.value?.closeOssUrls, detail.value?.closeOssNames)
);
const evaluateFiles = computed(() =>
    parseAttachments(detail.value?.evaluateOssIds, detail.value?.evaluateOssUrls, detail.value?.evaluateOssNames)
);
const evaluateScoreOptions = [
    { value: 5, label: "5分 很满意" },
    { value: 4, label: "4分 满意" },
    { value: 3, label: "3分 一般" },
    { value: 2, label: "2分 待改进" },
    { value: 1, label: "1分 不满意" },
];

const actionButtons = computed(() => {
    if (!detail.value) return [];
    const buttons = [];
    if (detail.value.canAssign) buttons.push({ type: "assign", label: "派单" });
    if (detail.value.canTransfer) buttons.push({ type: "transfer", label: "转派" });
    if (detail.value.canHandle) buttons.push({ type: "handle", label: "提交处理结果" });
    if (detail.value.canClose) buttons.push({ type: "close", label: "结单" });
    if (detail.value.canEvaluate) buttons.push({ type: "evaluate", label: "服务评价" });
    if (detail.value.canRework) buttons.push({ type: "rework", label: "退回处理" });
    if (detail.value.canCancel) buttons.push({ type: "cancel", label: "取消工单" });
    return buttons;
});

const isAssignAction = computed(
    () => currentAction.value === "assign" || currentAction.value === "transfer"
);
const showActionUpload = computed(() =>
    ["handle", "close", "evaluate", "rework", "cancel"].includes(currentAction.value)
);
const actionTitle = computed(() => {
    return {
        assign: "派单处理",
        transfer: "转派处理",
        handle: "提交处理结果",
        close: "结单处理",
        evaluate: "服务评价",
        rework: "退回处理",
        cancel: "取消工单",
    }[currentAction.value];
});
const actionLabel = computed(() => {
    if (currentAction.value === "handle") return "处理结果";
    if (currentAction.value === "close") return "结单说明";
    if (currentAction.value === "evaluate") return "评价内容";
    if (currentAction.value === "rework") return "退回说明";
    if (currentAction.value === "cancel") return "取消原因";
    return "备注说明";
});
const actionPlaceholder = computed(() => {
    if (currentAction.value === "handle") return "请输入处理结果，可上传图片、文档等附件";
    if (currentAction.value === "close") return "请输入结单说明";
    if (currentAction.value === "evaluate") return "请输入评价内容，可选上传图片、文档等附件";
    if (currentAction.value === "rework") return "请输入退回原因";
    if (currentAction.value === "cancel") return "请输入取消原因";
    return "请输入备注说明";
});

const loadDetail = async () => {
    if (!workOrderId.value) return;
    uni.showLoading({ title: "加载中" });
    try {
        const res = await workOrderApi.getInfo(workOrderId.value);
        detail.value = res.data || null;
    } catch (error) {
        uni.showToast({ title: "详情加载失败", icon: "none" });
    } finally {
        uni.hideLoading();
    }
};

const loadWorkers = async () => {
    try {
        const res = await workOrderApi.workers();
        workerOptions.value = (res.data || []).map((item) => ({
            ...item,
            displayName: `${item.nickName || item.userName}${item.phonenumber ? `（${item.phonenumber}）` : ""}`,
        }));
    } catch (error) {
        workerOptions.value = [];
    }
};

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

const collectPendingActionOssIds = (targetFiles = actionFiles.value) =>
    targetFiles
        .filter((item) => item.status === "success" && item.sessionUploaded && !item.persisted && item.ossId)
        .map((item) => item.ossId);

const discardActionDraft = () => {
    const currentFiles = actionFiles.value.slice();
    currentFiles.forEach((item) => {
        if (item.status === "uploading" && item.tempKey) {
            removedActionTempKeys.add(item.tempKey);
        }
    });
    actionFiles.value = [];
    return cleanupTempOssIds(collectPendingActionOssIds(currentFiles));
};

const openAction = async (type) => {
    await discardActionDraft();
    currentAction.value = type;
    actionForm.assignedUserId = detail.value?.assignedUserId || "";
    actionForm.priorityLevel = type === "assign" ? "" : detail.value?.priorityLevel || "";
    actionForm.remark = "";
    actionForm.evaluateScore = detail.value?.evaluateScore || 5;
    actionFiles.value = [];
    selectedWorkerLabel.value =
        detail.value?.assignedUserNickName || detail.value?.assignedUserName || "";
    if ((type === "assign" || type === "transfer") && !workerOptions.value.length) {
        await loadWorkers();
    }
};

const handleWorkerChange = (event) => {
    const index = event.detail.value;
    const target = workerOptions.value[index];
    if (!target) return;
    actionForm.assignedUserId = target.userId;
    selectedWorkerLabel.value = target.displayName;
};

const chooseActionImage = () => {
    const remain = Math.max(0, 10 - actionFiles.value.length);
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
                uploadActionFile(path, fileNameFromPath(path));
            });
        },
    });
};

const chooseActionFile = () => {
    const remain = Math.max(0, 10 - actionFiles.value.length);
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
                uploadActionFile(file.path || file.tempFilePath, file.name || fileNameFromPath(file.path || ""));
            });
        },
    });
};

const uploadActionFile = (filePath, fileName) => {
    const tempKey = `${Date.now()}-${Math.random()}`;
    actionFiles.value.push({
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
            currentAction.value,
            detail.value?.orderNo || detail.value?.title || workOrderId.value
        ),
    })
        .then((res) => {
            const uploadedFile = {
                ...buildUploadedFile(res, fileName),
                tempKey,
                sessionUploaded: true,
                persisted: false,
            };
            if (pageUnloaded.value || removedActionTempKeys.has(tempKey)) {
                removedActionTempKeys.delete(tempKey);
                cleanupTempOssIds([uploadedFile.ossId]);
                return;
            }
            replaceActionFileByTempKey(tempKey, uploadedFile);
        })
        .catch(() => {
            removedActionTempKeys.delete(tempKey);
            replaceActionFileByTempKey(tempKey, (current) => ({
                ...current,
                status: "failed",
            }));
        });
};

const replaceActionFileByTempKey = (tempKey, nextValue) => {
    const index = actionFiles.value.findIndex((item) => item.tempKey === tempKey);
    if (index < 0) return;
    actionFiles.value[index] =
        typeof nextValue === "function" ? nextValue(actionFiles.value[index]) : nextValue;
};

const removeActionFile = (index) => {
    const target = actionFiles.value[index];
    actionFiles.value.splice(index, 1);
    if (!target) return;
    if (target.status === "uploading" && target.tempKey) {
        removedActionTempKeys.add(target.tempKey);
        return;
    }
    if (target.status === "success" && target.sessionUploaded && !target.persisted && target.ossId) {
        cleanupTempOssIds([target.ossId]);
    }
};

const buildActionOssIds = () =>
    actionFiles.value
        .filter((item) => item.status === "success" && item.ossId)
        .map((item) => item.ossId)
        .join(",");

const hasUploading = () =>
    actionFiles.value.some((item) => item.status === "uploading");

const validateAction = () => {
    if (isAssignAction.value && !actionForm.assignedUserId) {
        uni.showToast({ title: "请选择维修人员", icon: "none" });
        return false;
    }
    if (currentAction.value === "assign" && !actionForm.priorityLevel) {
        uni.showToast({ title: "请选择优先级", icon: "none" });
        return false;
    }
    if (currentAction.value === "evaluate" && !actionForm.evaluateScore) {
        uni.showToast({ title: "请选择评分", icon: "none" });
        return false;
    }
    if (["handle", "close", "rework", "cancel"].includes(currentAction.value) && !actionForm.remark) {
        uni.showToast({ title: "请填写说明内容", icon: "none" });
        return false;
    }
    if (hasUploading()) {
        uni.showToast({ title: "附件仍在上传中", icon: "none" });
        return false;
    }
    return true;
};

const confirmCancelAction = () =>
    new Promise((resolve) => {
        uni.showModal({
            title: "确认取消",
            content: "确认取消当前工单吗？",
            success: (res) => {
                resolve(res.confirm);
            },
        });
    });

const confirmAction = (content) =>
    new Promise((resolve) => {
        uni.showModal({
            title: "提示",
            content,
            success: (res) => {
                resolve(!!res.confirm);
            },
            fail: () => resolve(false),
        });
    });

const submitAction = async () => {
    if (!validateAction()) return;
    if (currentAction.value === "cancel") {
        const confirmed = await confirmCancelAction();
        if (!confirmed) return;
    }
    submitting.value = true;
    try {
        const payload = buildPayload();
        const api = selectActionApi();
        await api(payload);
        uni.showToast({ title: "操作成功", icon: "success" });
        actionFiles.value = [];
        removedActionTempKeys.clear();
        currentAction.value = "";
        await loadDetail();
    } catch (error) {
        uni.showToast({ title: "操作失败", icon: "none" });
    } finally {
        submitting.value = false;
    }
};

const selectActionApi = () => {
    if (currentAction.value === "assign") return workOrderApi.assign;
    if (currentAction.value === "transfer") return workOrderApi.transfer;
    if (currentAction.value === "handle") return workOrderApi.handle;
    if (currentAction.value === "close") return workOrderApi.close;
    if (currentAction.value === "evaluate") return workOrderApi.evaluate;
    if (currentAction.value === "rework") return workOrderApi.rework;
    return workOrderApi.cancel;
};

const buildPayload = () => {
    const ossIds = buildActionOssIds();
    if (currentAction.value === "assign" || currentAction.value === "transfer") {
        if (currentAction.value === "assign") {
            return {
                workOrderId: workOrderId.value,
                assignedUserId: actionForm.assignedUserId,
                priorityLevel: actionForm.priorityLevel,
                remark: actionForm.remark,
            };
        }
        return {
            workOrderId: workOrderId.value,
            assignedUserId: actionForm.assignedUserId,
            remark: actionForm.remark,
        };
    }
    if (currentAction.value === "handle") {
        return {
            workOrderId: workOrderId.value,
            handleResult: actionForm.remark,
            handleOssIds: ossIds,
        };
    }
    if (currentAction.value === "close") {
        return {
            workOrderId: workOrderId.value,
            closeRemark: actionForm.remark,
            closeOssIds: ossIds,
        };
    }
    if (currentAction.value === "evaluate") {
        return {
            workOrderId: workOrderId.value,
            evaluateScore: actionForm.evaluateScore,
            evaluateContent: actionForm.remark,
            evaluateOssIds: ossIds,
        };
    }
    return {
        workOrderId: workOrderId.value,
        remark: actionForm.remark,
        ossIds,
    };
};

const formatEvaluateScore = (score) => {
    if (!score) return "暂未评价";
    return `${score}分`;
};

const fileNameFromPath = (path) => {
    if (!path) return "附件";
    const parts = String(path).split("/");
    return parts[parts.length - 1] || "附件";
};

const deleteRecord = async () => {
    if (!detail.value?.canDelete || deleting.value) return;
    const confirmed = await confirmAction("删除记录后，工单附件和流转附件会一并删除，是否继续？");
    if (!confirmed) return;
    deleting.value = true;
    try {
        await workOrderApi.remove(workOrderId.value);
        uni.showToast({
            title: "删除成功",
            icon: "success",
        });
        setTimeout(() => {
            uni.redirectTo({
                url: roleFlags.isManager
                    ? "/pages_services/workOrder/list?label=全部工单"
                    : "/pages_services/workOrder/list?label=我的工单",
            });
        }, 500);
    } catch (error) {
        uni.showToast({
            title: "删除失败",
            icon: "none",
        });
    } finally {
        deleting.value = false;
    }
};

onLoad((options) => {
    workOrderId.value = options.workOrderId || "";
});

onShow(() => {
    loadDetail();
});

onUnload(() => {
    pageUnloaded.value = true;
    cleanupTempOssIds(collectPendingActionOssIds());
});
</script>

<style scoped lang="scss">
.page {
    min-height: 100vh;
    background: #f4f7fb;
    padding: 24rpx 24rpx 60rpx;
}

.status-card,
.section-card {
    background: #ffffff;
    border-radius: 24rpx;
    padding: 28rpx;
    box-shadow: 0 16rpx 40rpx rgba(15, 23, 42, 0.05);
    margin-bottom: 20rpx;
}

.status-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20rpx;
}

.status-title {
    flex: 1;
    font-size: 32rpx;
    font-weight: 600;
    color: #101828;
    line-height: 1.5;
}

.status-pill {
    padding: 10rpx 18rpx;
    border-radius: 999rpx;
    font-size: 22rpx;
    background: #eef4ff;
    color: #175cd3;
}

.status-pill.pending_assign {
    background: #fff4e5;
    color: #b54708;
}

.status-pill.pending_close,
.status-pill.closed {
    background: #ecfdf3;
    color: #027a48;
}

.status-pill.cancelled {
    background: #fff1f3;
    color: #c01048;
}

.status-desc {
    margin-top: 12rpx;
    font-size: 24rpx;
    color: #667085;
}

.section-title {
    font-size: 30rpx;
    font-weight: 600;
    color: #101828;
    margin-bottom: 16rpx;
}

.info-row {
    display: flex;
    justify-content: space-between;
    gap: 20rpx;
    padding: 18rpx 0;
    border-bottom: 1rpx solid #eef2f7;
    font-size: 24rpx;
    color: #475467;
    line-height: 1.6;
}

.info-row.compact {
    padding: 10rpx 0;
}

.info-block {
    padding-top: 18rpx;
}

.info-block .label,
.stage-title,
.field-label {
    display: block;
    font-size: 24rpx;
    color: #667085;
    margin-bottom: 10rpx;
}

.info-block .content,
.stage-content {
    font-size: 24rpx;
    color: #101828;
    line-height: 1.8;
}

.stage-box {
    padding: 20rpx 0;
    border-bottom: 1rpx solid #eef2f7;
}

.attachment-list {
    display: flex;
    flex-wrap: wrap;
    gap: 14rpx;
    margin-top: 12rpx;
}

.attachment-item {
    padding: 10rpx 18rpx;
    border-radius: 999rpx;
    background: #eef4ff;
    color: #175cd3;
    font-size: 22rpx;
    line-height: 1.5;
}

.empty-text {
    font-size: 22rpx;
    color: #98a2b3;
}

.timeline-item {
    display: flex;
    gap: 18rpx;
    margin-bottom: 22rpx;
}

.timeline-dot {
    width: 20rpx;
    height: 20rpx;
    border-radius: 50%;
    background: #175cd3;
    margin-top: 12rpx;
    flex-shrink: 0;
}

.timeline-body {
    flex: 1;
    padding: 20rpx;
    border-radius: 20rpx;
    background: #f8fbff;
    border: 1rpx solid #d9e7ff;
}

.timeline-head {
    display: flex;
    justify-content: space-between;
    gap: 20rpx;
    font-size: 24rpx;
    color: #101828;
}

.timeline-action {
    font-weight: 600;
}

.timeline-time,
.timeline-row {
    margin-top: 10rpx;
    font-size: 22rpx;
    line-height: 1.7;
    color: #667085;
}

.action-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
}

.action-pill {
    padding: 14rpx 22rpx;
    border-radius: 999rpx;
    background: #f2f4f7;
    color: #475467;
    font-size: 24rpx;
}

.action-pill.active {
    background: #175cd3;
    color: #ffffff;
}

.delete-entry {
    margin-top: 20rpx;
    padding: 18rpx 22rpx;
    border-radius: 18rpx;
    background: #fff1f3;
    color: #c01048;
    text-align: center;
    font-size: 24rpx;
}

.field-item {
    margin-bottom: 20rpx;
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

.picker-field,
.textarea-wrap {
    width: 100%;
    box-sizing: border-box;
    border-radius: 18rpx;
    background: #f8fafc;
    color: #101828;
    border: 1rpx solid #e6edf5;
}

.picker-field {
    min-height: 96rpx;
    padding: 0 24rpx;
    display: flex;
    align-items: center;
    font-size: 26rpx;
}

.textarea-wrap {
    padding: 24rpx;
}

.textarea-field {
    width: 100%;
    height: 320rpx;
    min-height: 320rpx;
    display: block;
    box-sizing: border-box;
    background: transparent;
    color: #101828;
    font-size: 26rpx;
    line-height: 1.7;
    text-align: left;
}

.upload-actions {
    display: flex;
    gap: 16rpx;
}

.score-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16rpx;
}

.score-item {
    padding: 20rpx;
    border-radius: 18rpx;
    background: #f8fafc;
    border: 1rpx solid #e4e7ec;
    font-size: 24rpx;
    color: #344054;
    text-align: center;
}

.score-item.active {
    border-color: #175cd3;
    background: #eef4ff;
    color: #175cd3;
}

.upload-btn {
    flex: 1;
    height: 78rpx;
    line-height: 78rpx;
    text-align: center;
    border-radius: 18rpx;
    background: #175cd3;
    color: #ffffff;
    font-size: 24rpx;
}

.upload-btn-secondary {
    background: #0f4c81;
}

.file-list {
    margin-top: 16rpx;
}

.file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20rpx;
    padding: 18rpx 0;
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

.submit-btn {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    border-radius: 999rpx;
    background: #175cd3;
    color: #ffffff;
    font-size: 30rpx;
    margin-top: 12rpx;
}
</style>
