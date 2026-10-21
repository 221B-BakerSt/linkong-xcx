<template>
    <view class="page" :class="{ 'with-batch-panel': batchMode }">
        <view v-if="draftMode" class="mode-banner">
            <text class="mode-title">我的草稿</text>
            <text class="mode-desc">草稿支持继续编辑或直接删除，删除后草稿附件会一并清理。</text>
        </view>

        <template v-else>
            <view class="search-bar">
                <view class="search-field">
                    <input
                        v-model="keyword"
                        class="search-input"
                        placeholder="搜索工单编号、标题、联系人"
                        placeholder-style="color: #98A2B3;"
                        confirm-type="search"
                        @confirm="handleSearch"
                    />
                </view>
                <view class="search-btn" @click="handleSearch">查询</view>
            </view>

            <view v-if="batchMode" class="mode-banner">
                <text class="mode-title">批量转派</text>
                <text class="mode-desc">仅展示处理中工单，勾选后可一次性转派给新的维修人员。</text>
            </view>

            <scroll-view v-if="!batchMode" class="tab-scroll" scroll-x>
                <view class="tab-list">
                    <view
                        v-for="item in statusOptions"
                        :key="item.value || 'all'"
                        class="tab-item"
                        :class="{ active: currentStatus === item.value }"
                        @click="switchStatus(item.value)"
                    >
                        {{ item.label }}
                    </view>
                </view>
            </scroll-view>
        </template>

        <view v-if="list.length" class="list-wrap">
            <view
                v-for="item in list"
                :key="item.workOrderId"
                class="order-card"
                @click="handleCardClick(item)"
            >
                <view class="card-head">
                    <text class="card-title">{{ item.title || "-" }}</text>
                    <view class="card-tags">
                        <text v-if="!draftMode" class="status-tag" :class="item.status">
                            {{ STATUS_LABEL_MAP[item.status] || item.status }}
                        </text>
                        <text v-else class="status-tag draft">草稿</text>
                        <text
                            v-if="batchMode"
                            class="select-tag"
                            :class="{ active: isSelected(item.workOrderId) }"
                        >
                            {{ isSelected(item.workOrderId) ? "已选" : "选择" }}
                        </text>
                    </view>
                </view>
                <view class="card-row">
                    <text>编号：{{ item.orderNo || "-" }}</text>
                    <text>{{ ORDER_TYPE_LABEL_MAP[item.orderType] || "-" }}</text>
                </view>
                <view class="card-row">
                    <text>联系人：{{ item.contactName || "-" }}</text>
                    <text>{{ item.contactPhone || "-" }}</text>
                </view>
                <view class="card-row single">地点：{{ item.location || "-" }}</view>
                <view v-if="draftMode" class="card-row">
                    <text>最近保存：{{ formatTime(item.updateTime || item.createTime) }}</text>
                    <text>{{ PRIORITY_LABEL_MAP[item.priorityLevel] || "-" }}</text>
                </view>
                <view v-else class="card-row">
                    <text>当前处理人：{{ item.assignedUserNickName || item.assignedUserName || "-" }}</text>
                    <text>{{ formatTime(item.createTime) }}</text>
                </view>
                <view v-if="draftMode" class="draft-actions">
                    <view class="mini-action primary" @click.stop="editDraft(item)">继续编辑</view>
                    <view class="mini-action danger" @click.stop="removeDraft(item)">删除草稿</view>
                </view>
            </view>
        </view>

        <view v-else-if="!loading" class="empty-wrap">
            <text>{{ draftMode ? "暂无草稿" : "暂无工单" }}</text>
        </view>

        <view v-if="loading" class="loading-wrap">
            <text>加载中...</text>
        </view>
        <view v-else-if="finished && list.length" class="loading-wrap">
            <text>没有更多了</text>
        </view>

        <view v-if="batchMode" class="batch-panel">
            <view class="batch-summary">已选 {{ selectedIds.length }} 条工单</view>
            <picker :range="workerOptions" range-key="displayName" @change="handleWorkerChange">
                <view class="picker-field">
                    {{ selectedWorkerLabel || "请选择维修人员" }}
                </view>
            </picker>
            <view class="batch-input-wrap">
                <input
                    v-model="batchRemark"
                    class="batch-input"
                    maxlength="1000"
                    placeholder="可选填写批量转派备注"
                    placeholder-style="color: #98A2B3;"
                />
            </view>
            <view
                class="batch-submit"
                :class="{ disabled: batchSubmitting }"
                @click="submitBatchTransfer"
            >
                {{ batchSubmitting ? "提交中..." : "确认批量转派" }}
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref } from "vue";
import {
    onLoad,
    onPullDownRefresh,
    onReachBottom,
} from "@dcloudio/uni-app";
import { workOrderApi } from "@/api/operations/workOrder";
import {
    STATUS_OPTIONS,
    STATUS_LABEL_MAP,
    ORDER_TYPE_LABEL_MAP,
    PRIORITY_LABEL_MAP,
    formatTime,
    getRoleFlags,
} from "./utils";

const roleFlags = getRoleFlags();
const statusOptions = STATUS_OPTIONS;
const list = ref([]);
const loading = ref(false);
const finished = ref(false);
const pageNum = ref(1);
const pageSize = ref(10);
const currentStatus = ref("");
const keyword = ref("");
const draftMode = ref(false);
const batchMode = ref(false);
const selectedIds = ref([]);
const workerOptions = ref([]);
const selectedWorkerId = ref("");
const selectedWorkerLabel = ref("");
const batchRemark = ref("");
const batchSubmitting = ref(false);

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

const fetchList = async (reset = false) => {
    if (loading.value) return;
    if (reset) {
        pageNum.value = 1;
        finished.value = false;
        if (batchMode.value) {
            selectedIds.value = [];
        }
    }
    if (finished.value && !reset) return;
    loading.value = true;
    try {
        const res = draftMode.value
            ? await workOrderApi.draftList({
                  pageNum: pageNum.value,
                  pageSize: pageSize.value,
              })
            : await workOrderApi.list({
                  pageNum: pageNum.value,
                  pageSize: pageSize.value,
                  status: batchMode.value ? "processing" : currentStatus.value,
                  keyword: keyword.value,
              });
        const rows = res.rows || [];
        if (reset) {
            list.value = rows;
        } else {
            list.value = list.value.concat(rows);
        }
        finished.value = rows.length < pageSize.value;
        if (!finished.value) {
            pageNum.value += 1;
        }
    } catch (error) {
        if (reset) {
            list.value = [];
        }
        uni.showToast({
            title: draftMode.value ? "草稿列表加载失败" : "工单列表加载失败",
            icon: "none",
        });
    } finally {
        loading.value = false;
        uni.stopPullDownRefresh();
    }
};

const loadWorkers = async () => {
    if (!roleFlags.isManager) return;
    try {
        const res = await workOrderApi.workers();
        workerOptions.value = (res.data || []).map((item) => ({
            ...item,
            displayName: `${item.nickName || item.userName}${item.phonenumber ? `（${item.phonenumber}）` : ""}`,
        }));
    } catch (error) {
        workerOptions.value = [];
        uni.showToast({
            title: "维修人员加载失败",
            icon: "none",
        });
    }
};

const switchStatus = (status) => {
    if (currentStatus.value === status) return;
    currentStatus.value = status;
    fetchList(true);
};

const handleSearch = () => {
    fetchList(true);
};

const handleCardClick = (item) => {
    if (draftMode.value) {
        editDraft(item);
        return;
    }
    if (batchMode.value) {
        toggleSelect(item.workOrderId);
        return;
    }
    uni.navigateTo({
        url: `/pages_services/workOrder/detail?workOrderId=${item.workOrderId}`,
    });
};

const editDraft = (item) => {
    uni.navigateTo({
        url: `/pages_services/workOrder/create?workOrderId=${item.workOrderId}`,
    });
};

const removeDraft = async (item) => {
    const confirmed = await confirmAction("删除草稿后，草稿附件也会一并删除，是否继续？");
    if (!confirmed) return;
    try {
        await workOrderApi.deleteDraft(item.workOrderId);
        uni.showToast({
            title: "草稿删除成功",
            icon: "success",
        });
        fetchList(true);
    } catch (error) {
        uni.showToast({
            title: "草稿删除失败",
            icon: "none",
        });
    }
};

const isSelected = (workOrderId) => selectedIds.value.includes(workOrderId);

const toggleSelect = (workOrderId) => {
    const exists = selectedIds.value.includes(workOrderId);
    if (exists) {
        selectedIds.value = selectedIds.value.filter((item) => item !== workOrderId);
        return;
    }
    selectedIds.value = selectedIds.value.concat(workOrderId);
};

const handleWorkerChange = (event) => {
    const target = workerOptions.value[event.detail.value];
    if (!target) return;
    selectedWorkerId.value = target.userId;
    selectedWorkerLabel.value = target.displayName;
};

const submitBatchTransfer = async () => {
    if (batchSubmitting.value) return;
    if (!selectedIds.value.length) {
        uni.showToast({
            title: "请先选择工单",
            icon: "none",
        });
        return;
    }
    if (!selectedWorkerId.value) {
        uni.showToast({
            title: "请选择维修人员",
            icon: "none",
        });
        return;
    }
    const confirmed = await confirmAction("确认将选中的工单批量转派给该维修人员吗？");
    if (!confirmed) return;
    batchSubmitting.value = true;
    try {
        await workOrderApi.batchTransfer({
            workOrderIds: selectedIds.value,
            assignedUserId: selectedWorkerId.value,
            remark: batchRemark.value,
        });
        uni.showToast({
            title: "批量转派成功",
            icon: "success",
        });
        batchRemark.value = "";
        selectedIds.value = [];
        fetchList(true);
    } catch (error) {
        uni.showToast({
            title: "批量转派失败",
            icon: "none",
        });
    } finally {
        batchSubmitting.value = false;
    }
};

onLoad((options) => {
    draftMode.value = options.draftMode === "1";
    batchMode.value = options.batchMode === "1";
    currentStatus.value = batchMode.value ? "processing" : options.status || "";
    if (options.label) {
        uni.setNavigationBarTitle({
            title: options.label,
        });
    }
    if (batchMode.value && !roleFlags.isManager) {
        uni.showToast({
            title: "当前账号无权批量转派",
            icon: "none",
        });
        return;
    }
    if (batchMode.value) {
        loadWorkers();
    }
    fetchList(true);
});

onPullDownRefresh(() => {
    fetchList(true);
});

onReachBottom(() => {
    fetchList(false);
});
</script>

<style scoped lang="scss">
.page {
    min-height: 100vh;
    background: #f4f7fb;
    padding: 24rpx;
}

.page.with-batch-panel {
    padding-bottom: 320rpx;
}

.mode-banner {
    margin-bottom: 18rpx;
    padding: 24rpx;
    border-radius: 22rpx;
    background: linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%);
    border: 1rpx solid #d9e7ff;
}

.mode-title {
    display: block;
    font-size: 28rpx;
    font-weight: 600;
    color: #0f172a;
}

.mode-desc {
    display: block;
    margin-top: 10rpx;
    font-size: 22rpx;
    line-height: 1.7;
    color: #667085;
}

.search-bar {
    display: flex;
    align-items: center;
    gap: 16rpx;
    margin-bottom: 18rpx;
}

.search-field {
    flex: 1;
    height: 88rpx;
    padding: 0 24rpx;
    border-radius: 18rpx;
    background: #ffffff;
    border: 1rpx solid #e6edf5;
    box-sizing: border-box;
}

.search-input {
    width: 100%;
    height: 88rpx;
    min-height: 88rpx;
    line-height: 88rpx;
    font-size: 26rpx;
    color: #101828;
    background: transparent;
    box-sizing: border-box;
}

.search-btn {
    height: 80rpx;
    line-height: 80rpx;
    padding: 0 28rpx;
    border-radius: 18rpx;
    background: #175cd3;
    color: #ffffff;
    font-size: 26rpx;
}

.tab-scroll {
    white-space: nowrap;
    margin-bottom: 18rpx;
}

.tab-list {
    display: inline-flex;
    gap: 16rpx;
}

.tab-item {
    padding: 14rpx 26rpx;
    border-radius: 999rpx;
    background: #ffffff;
    color: #475467;
    font-size: 24rpx;
}

.tab-item.active {
    background: #175cd3;
    color: #ffffff;
}

.order-card {
    background: #ffffff;
    border-radius: 22rpx;
    padding: 26rpx;
    margin-bottom: 18rpx;
    box-shadow: 0 14rpx 36rpx rgba(15, 23, 42, 0.05);
}

.card-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20rpx;
}

.card-title {
    flex: 1;
    font-size: 30rpx;
    font-weight: 600;
    color: #101828;
    line-height: 1.5;
}

.card-tags {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10rpx;
}

.status-tag,
.select-tag {
    padding: 8rpx 16rpx;
    border-radius: 999rpx;
    font-size: 22rpx;
}

.status-tag {
    background: #eef2ff;
    color: #4338ca;
}

.status-tag.pending_assign {
    background: #fff4e5;
    color: #b54708;
}

.status-tag.processing {
    background: #eef4ff;
    color: #175cd3;
}

.status-tag.pending_close,
.status-tag.closed {
    background: #ecfdf3;
    color: #027a48;
}

.status-tag.cancelled {
    background: #fff1f3;
    color: #c01048;
}

.status-tag.draft {
    background: #f2f4f7;
    color: #475467;
}

.select-tag {
    border: 1rpx solid #d0d5dd;
    color: #667085;
    background: #ffffff;
}

.select-tag.active {
    border-color: #175cd3;
    background: #eef4ff;
    color: #175cd3;
}

.card-row {
    display: flex;
    justify-content: space-between;
    gap: 20rpx;
    margin-top: 14rpx;
    font-size: 24rpx;
    color: #667085;
    line-height: 1.6;
}

.card-row.single {
    display: block;
}

.draft-actions {
    display: flex;
    gap: 16rpx;
    margin-top: 20rpx;
}

.mini-action {
    flex: 1;
    height: 72rpx;
    line-height: 72rpx;
    border-radius: 16rpx;
    text-align: center;
    font-size: 24rpx;
}

.mini-action.primary {
    background: #eef4ff;
    color: #175cd3;
}

.mini-action.danger {
    background: #fff1f3;
    color: #c01048;
}

.empty-wrap,
.loading-wrap {
    padding: 120rpx 0;
    text-align: center;
    color: #98a2b3;
    font-size: 26rpx;
}

.batch-panel {
    position: fixed;
    left: 24rpx;
    right: 24rpx;
    bottom: 24rpx;
    padding: 24rpx;
    border-radius: 24rpx;
    background: rgba(255, 255, 255, 0.98);
    box-shadow: 0 20rpx 44rpx rgba(15, 23, 42, 0.12);
}

.batch-summary {
    font-size: 24rpx;
    color: #344054;
    margin-bottom: 14rpx;
}

.picker-field,
.batch-input-wrap {
    width: 100%;
    box-sizing: border-box;
    border-radius: 18rpx;
    background: #f8fafc;
    font-size: 24rpx;
    color: #101828;
    border: 1rpx solid #e6edf5;
}

.picker-field {
    min-height: 88rpx;
    padding: 0 24rpx;
    display: flex;
    align-items: center;
}

.batch-input-wrap {
    margin-top: 14rpx;
    padding: 0 24rpx;
}

.batch-input {
    width: 100%;
    height: 88rpx;
    min-height: 88rpx;
    line-height: 88rpx;
    font-size: 24rpx;
    color: #101828;
    background: transparent;
    box-sizing: border-box;
}

.batch-submit {
    margin-top: 16rpx;
    height: 82rpx;
    line-height: 82rpx;
    text-align: center;
    border-radius: 999rpx;
    background: #175cd3;
    color: #ffffff;
    font-size: 28rpx;
}

.batch-submit.disabled {
    opacity: 0.6;
}
</style>
