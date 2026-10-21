<template>
    <view class="page">
        <view class="hero-card">
            <view class="hero-title">工单报事报修</view>
            <view class="hero-desc">
                提报、派单、处理、结单全流程线上协同。
            </view>
        </view>

        <view class="stats-grid">
            <view
                v-for="item in statCards"
                :key="item.key"
                class="stat-card"
            >
                <text class="stat-label">{{ item.label }}</text>
                <text class="stat-value">{{ item.value }}</text>
            </view>
        </view>

        <view class="section-card">
            <view class="section-head">
                <text class="section-title">{{ roleTitle }}</text>
                <text class="section-tip">{{ roleTip }}</text>
            </view>
            <view class="action-grid">
                <view
                    v-for="item in quickActions"
                    :key="item.key"
                    class="action-card"
                    @click="handleAction(item)"
                >
                    <text class="action-name">{{ item.name }}</text>
                    <text class="action-desc">{{ item.desc }}</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { computed, reactive } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { workOrderApi } from "@/api/operations/workOrder";
import { getRoleFlags } from "./utils";

const roleFlags = reactive(getRoleFlags());
const overview = reactive({});

const totalLabel = computed(() => (roleFlags.isManager ? "全部工单" : "我的工单"));
const isApplicantOnly = computed(() => roleFlags.isApplicant);
const isManagerView = computed(() => roleFlags.isManager);
const showPendingClose = computed(() => !roleFlags.isApplicant);
const showCancelled = computed(() => roleFlags.isManager);

const toCount = (value) => Number(value || 0);

const displayOverview = computed(() => {
    const totalCount = toCount(overview.totalCount);
    const pendingAssignCount = toCount(overview.pendingAssignCount);
    const processingCount = toCount(overview.processingCount);
    const pendingCloseCount = toCount(overview.pendingCloseCount);
    const closedCount = toCount(overview.closedCount);
    const cancelledCount = toCount(overview.cancelledCount);

    if (isManagerView.value) {
        return {
            totalCount,
            pendingAssignCount,
            processingCount,
            pendingCloseCount,
            closedCount,
            cancelledCount,
        };
    }

    if (!isApplicantOnly.value) {
        return {
            totalCount: Math.max(totalCount - cancelledCount, 0),
            pendingAssignCount,
            processingCount,
            pendingCloseCount,
            closedCount,
            cancelledCount: 0,
        };
    }

    return {
        totalCount: Math.max(totalCount - cancelledCount, 0),
        pendingAssignCount,
        processingCount: processingCount + pendingCloseCount,
        pendingCloseCount: 0,
        closedCount,
        cancelledCount: 0,
    };
});

const statCards = computed(() => {
    const cards = [
        {
            key: "total",
            label: totalLabel.value,
            value: displayOverview.value.totalCount,
        },
        {
            key: "pending_assign",
            label: "待派单",
            value: displayOverview.value.pendingAssignCount,
        },
        {
            key: "processing",
            label: "处理中",
            value: displayOverview.value.processingCount,
        },
    ];

    if (showPendingClose.value) {
        cards.push({
            key: "pending_close",
            label: "待结单",
            value: displayOverview.value.pendingCloseCount,
        });
    }

    cards.push({
        key: "closed",
        label: "已结单",
        value: displayOverview.value.closedCount,
    });

    if (showCancelled.value) {
        cards.push({
            key: "cancelled",
            label: "已取消",
            value: displayOverview.value.cancelledCount,
        });
    }

    return cards;
});

const roleTitle = computed(() => {
    if (roleFlags.isManager && roleFlags.isWorker) return "管理兼处理入口";
    if (roleFlags.isManager) return "管理员入口";
    if (roleFlags.isWorker) return "维修人员入口";
    return "提报人入口";
});

const roleTip = computed(() => {
    if (roleFlags.isManager && roleFlags.isWorker) {
        return "可查看全部工单并执行派单、转派、删除等管理操作；若工单派给您本人，详情内也可直接提交处理结果。";
    }
    if (roleFlags.isManager) return "可查看全部工单，并在小程序内完成派单、转派、删除记录等管理操作。";
    if (roleFlags.isWorker) return "可查看自己提交及经手过的工单，也可发起工单、保存草稿并跟踪最新进度。";
    return "可发起工单、保存草稿，并查看自己提交的工单进度。";
});

const quickActions = computed(() => {
    if (roleFlags.isManager) {
        return [
            {
                key: "pending_assign",
                name: "待派单工单",
                desc: "优先处理新提交工单",
                route: "/pages_services/workOrder/list?status=pending_assign&label=待派单工单",
            },
            {
                key: "all",
                name: "全部工单",
                desc: "查看所有工单及进程",
                route: "/pages_services/workOrder/list?label=全部工单",
            },
            {
                key: "processing",
                name: "处理中工单",
                desc: "跟进当前处理进度",
                route: "/pages_services/workOrder/list?status=processing&label=处理中工单",
            },
            {
                key: "pending_close",
                name: "待结单工单",
                desc: "审核处理结果并结单",
                route: "/pages_services/workOrder/list?status=pending_close&label=待结单工单",
            },
            {
                key: "draft",
                name: "我的草稿",
                desc: "继续编辑自己的暂存工单",
                route: "/pages_services/workOrder/list?draftMode=1&label=我的草稿",
            },
            {
                key: "batch_transfer",
                name: "批量转派",
                desc: "批量调整处理中工单",
                route: "/pages_services/workOrder/list?batchMode=1&label=批量转派&status=processing",
            },
            {
                key: "create",
                name: "发起新工单",
                desc: "补录或代录工单",
                route: "/pages_services/workOrder/create",
            },
        ];
    }
    if (roleFlags.isWorker) {
        return [
            {
                key: "processing",
                name: "处理中",
                desc: "处理并提交结果",
                route: "/pages_services/workOrder/list?status=processing&label=处理中工单",
            },
            {
                key: "pending_close",
                name: "已提交待结单",
                desc: "查看待结单工单",
                route: "/pages_services/workOrder/list?status=pending_close&label=待结单工单",
            },
            {
                key: "all",
                name: "我的工单",
                desc: "查看自己提交及经手过的工单",
                route: "/pages_services/workOrder/list?label=我的工单",
            },
            {
                key: "draft",
                name: "我的草稿",
                desc: "继续编辑未提交内容",
                route: "/pages_services/workOrder/list?draftMode=1&label=我的草稿",
            },
            {
                key: "create",
                name: "发起工单",
                desc: "提交新的报事报修工单",
                route: "/pages_services/workOrder/create",
            },
        ];
    }
    return [
        {
            key: "create",
            name: "发起工单",
            desc: "提交报事报修工单",
            route: "/pages_services/workOrder/create",
        },
        {
            key: "all",
            name: "我的工单",
            desc: "查看自己工单的最新进度",
            route: "/pages_services/workOrder/list?label=我的工单",
        },
        {
            key: "draft",
            name: "我的草稿",
            desc: "继续编辑未提交内容",
            route: "/pages_services/workOrder/list?draftMode=1&label=我的草稿",
        },
        {
            key: "closed",
            name: "已结单记录",
            desc: "查看已结单工单",
            route: "/pages_services/workOrder/list?status=closed&label=已结单记录",
        },
    ];
});

const fetchOverview = async () => {
    try {
        const res = await workOrderApi.overview();
        Object.assign(overview, res.data || {});
    } catch (error) {
        Object.assign(overview, {});
    }
};

const handleAction = (item) => {
    uni.navigateTo({
        url: item.route,
    });
};

onShow(() => {
    Object.assign(roleFlags, getRoleFlags());
    fetchOverview();
});
</script>

<style scoped lang="scss">
.page {
    min-height: 100vh;
    padding: 24rpx;
    background: linear-gradient(180deg, #f4f7fb 0%, #eef2f8 100%);
}

.hero-card,
.section-card {
    background: #ffffff;
    border-radius: 24rpx;
    padding: 30rpx;
    box-shadow: 0 16rpx 40rpx rgba(15, 23, 42, 0.06);
}

.hero-card {
    background: linear-gradient(135deg, #0f4c81 0%, #175cd3 100%);
}

.hero-title {
    font-size: 36rpx;
    font-weight: 600;
    color: #ffffff;
}

.hero-desc {
    margin-top: 16rpx;
    font-size: 24rpx;
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.88);
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18rpx;
    margin-top: 20rpx;
}

.stat-card {
    background: #ffffff;
    border-radius: 20rpx;
    padding: 24rpx;
    box-shadow: 0 12rpx 30rpx rgba(15, 23, 42, 0.04);
}

.stat-label {
    display: block;
    font-size: 24rpx;
    color: #667085;
}

.stat-value {
    display: block;
    margin-top: 12rpx;
    font-size: 42rpx;
    font-weight: 700;
    color: #101828;
}

.section-card {
    margin-top: 20rpx;
}

.section-head {
    margin-bottom: 20rpx;
}

.section-title {
    display: block;
    font-size: 30rpx;
    font-weight: 600;
    color: #101828;
}

.section-tip {
    display: block;
    margin-top: 10rpx;
    font-size: 24rpx;
    line-height: 1.7;
    color: #667085;
}

.action-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18rpx;
}

.action-card {
    min-height: 150rpx;
    padding: 24rpx;
    border-radius: 20rpx;
    background: linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%);
    border: 1rpx solid #d9e7ff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.action-name {
    font-size: 28rpx;
    font-weight: 600;
    color: #0f172a;
}

.action-desc {
    margin-top: 14rpx;
    font-size: 22rpx;
    line-height: 1.6;
    color: #667085;
}
</style>
