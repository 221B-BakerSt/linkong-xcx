<template>
    <view class="satisfaction-container">
        <!-- 活动列表 -->
        <view class="survey-list">
            <view
                v-for="item in activityList"
                :key="item.assessmentId"
                class="survey-item"
                @click="handleActivityClick(item)"
            >
                <view class="survey-header">
                    <view class="survey-title">{{ item.assessmentName }}</view>
                    <view
                        class="survey-status"
                        :class="getStatusClass(item.taskStatus)"
                    >
                        {{ getStatusText(item.taskStatus) }}
                    </view>
                </view>
                <view class="survey-footer">
                    <view class="survey-deadline-label">截至日期：</view>
                    <view class="survey-deadline-date">{{
                        formatDate(item.endTime)
                    }}</view>
                </view>
            </view>

            <!-- 空状态提示 -->
            <view v-if="activityList.length === 0" class="empty-state">
                <text>暂无活动</text>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getActivityTaskList } from "@/api/operations/questionnaireAssessment";

// 活动列表数据
const activityList = ref([]);

// 获取活动列表
const getActivityListApi = async () => {
    try {
        const res = await getActivityTaskList();
        if (res && res.data) {
            activityList.value = res.data;
        }
    } catch (e) {
        console.error("获取活动列表失败:", e);
        uni.showToast({ title: "加载失败", icon: "none" });
    }
};

// 根据 taskStatus 返回对应的 CSS 类名
const getStatusClass = (taskStatus) => {
    if (!taskStatus) return "pending";

    switch (taskStatus) {
        case "submitted": // 已提交
            return "submitted";
        case "expired": // 已截止
            return "expired";
        case "pending": // 待提交
        default:
            return "pending";
    }
};

// 根据 taskStatus 返回对应的文本
const getStatusText = (taskStatus) => {
    if (!taskStatus) return "待提交";

    switch (taskStatus) {
        case "submitted":
            return "已提交";
        case "expired":
            return "已截至";
        case "pending":
        default:
            return "待提交";
    }
};

// 格式化日期（仅显示年月日）
const formatDate = (timeStr) => {
    if (!timeStr) return "";
    return timeStr.split(" ")[0];
};

// 处理活动项点击
const handleActivityClick = (item) => {
    console.log("点击了活动项:", item);

    // 已提交和已截止不让用户点击跳转
    if (item.taskStatus === "submitted" || item.taskStatus === "expired") {
        return;
    }

    // 待提交 - 跳转到报名页面
    if (item.taskStatus === "pending") {
        uni.navigateTo({
            url: `/pages_park/activity/registrationAdd?assessmentId=${item.assessmentId}`,
            success: () => {
                console.log("导航到活动报名页面成功");
            },
            fail: (err) => {
                console.log("导航到活动报名页面失败:", err);
            },
        });
    }
};

onMounted(() => {
    getActivityListApi();
});
</script>

<style lang="scss" scoped>
/* 重置默认样式 */
page {
    margin: 0;
    padding: 0;
    background: #f5f5f5;
    border-radius: 0px 0px 0px 0px;
}

.satisfaction-container {
    width: 100%;
    min-height: 100vh;
    background: #f5fbff;
    padding: 16px;
    box-sizing: border-box;
}

.survey-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.survey-item {
    width: 100%;
    height: auto;
    background: #ffffff;
    border-radius: 10px 10px 10px 10px;
    padding: 16px;
    box-sizing: border-box;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.3s ease;
}

.survey-item:active {
    transform: scale(0.98);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.survey-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
}

.survey-title {
    flex: 1;
    margin-right: 10px;
    font-family:
        Source Han Sans,
        Source Han Sans;
    font-weight: 500;
    font-size: 14px;
    color: #333333;
    line-height: normal;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.survey-status {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 4px;
    font-family:
        Source Han Sans,
        Source Han Sans;
    font-weight: 400;
    font-size: 12px;
    line-height: normal;
    text-align: right;
    font-style: normal;
    text-transform: none;
}

.survey-status::after {
    content: " >";
    vertical-align: middle;
}

.survey-status.submitted {
    color: #2fc25b;
    vertical-align: middle;
}

.survey-status.pending {
    color: #ea0000;
    vertical-align: middle;
}

.survey-status.expired {
    color: rgba(0, 0, 0, 0.6);
    vertical-align: middle;
}

.survey-footer {
    display: flex;
    align-items: center;
}

.survey-deadline-label {
    height: 12px;
    font-family:
        Source Han Sans,
        Source Han Sans;
    font-weight: 400;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.6);
    line-height: 12px;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.survey-deadline-date {
    height: 12px;
    font-family:
        Source Han Sans,
        Source Han Sans;
    font-weight: 400;
    font-size: 12px;
    color: #3b63ff;
    line-height: 12px;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.empty-state {
    text-align: center;
    padding: 40px 0;
    color: #999999;
    font-size: 14px;
}
</style>
