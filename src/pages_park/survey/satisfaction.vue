<template>
    <view class="satisfaction-container">
        <!-- 调查列表 -->
        <view class="survey-list">
            <view
                v-for="item in surveyList"
                :key="item.assessmentId"
                class="survey-item"
                @click="handleSurveyClick(item)"
            >
                <view class="survey-header">
                    <view class="survey-title">{{ item.assessmentName }}</view>
                    <view
                        class="survey-status"
                        :class="getStatusClass(item.taskStatus)"
                        >{{ getStatusText(item.taskStatus) }}</view
                    >
                </view>
                <view class="survey-footer">
                    <view class="survey-deadline-label">截至日期：</view>
                    <view class="survey-deadline-date">{{
                        formatDate(item.endTime)
                    }}</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getPropertyQuestTaskList } from "@/api/operations/questionnaireAssessment";

// 调查列表数据
const surveyList = ref([]);

// 获取调查列表
const getSurveyListApi = async () => {
    try {
        const res = await getPropertyQuestTaskList();
        if (res && res.data) {
            // 过滤掉 type 为 activity 的数据
            surveyList.value = res.data.filter(
                (item) => item.type !== "activity",
            );
        }
    } catch (e) {
        console.error("获取调查列表失败:", e);
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
        case "pending": // 未提交
        default:
            return "pending";
    }
};

// 根据 taskStatus 返回对应的文本
const getStatusText = (taskStatus) => {
    if (!taskStatus) return "未提交";

    switch (taskStatus) {
        case "submitted":
            return "已提交";
        case "expired":
            return "已截止";
        case "pending":
        default:
            return "未提交";
    }
};

// 格式化日期（仅显示年月日）
const formatDate = (timeStr) => {
    if (!timeStr) return "";
    return timeStr.split(" ")[0];
};

// 处理调查项点击
const handleSurveyClick = (item) => {
    // 已提交和已截止不让用户点击跳转
    if (item.taskStatus === "submitted" || item.taskStatus === "expired") {
        return;
    }

    // 根据问卷类型跳转到不同页面（后端返回字段为 type）
    if (item.type === "property") {
        // 物业服务
        uni.navigateTo({
            url: `/pages_park/survey/property?assessmentId=${item.assessmentId}`,
            success: () => {
                console.log("导航到物业调查页面成功");
            },
            fail: (err) => {
                console.log("导航到物业调查页面失败:", err);
            },
        });
    } else if (item.type === "restaurant") {
        // 餐饮服务
        uni.navigateTo({
            url: `/pages_park/survey/restaurant?assessmentId=${item.assessmentId}`,
            success: () => {
                console.log("导航到餐厅调查页面成功");
            },
            fail: (err) => {
                console.log("导航到餐厅调查页面失败:", err);
            },
        });
    } else {
        uni.showToast({
            title: "未知的问卷类型：" + item.type,
            icon: "none",
        });
    }
};

onMounted(() => {
    getSurveyListApi();
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
    flex: 1; margin-right: 12px;
    height: auto;
    font-family:
        Source Han Sans,
        Source Han Sans;
    font-weight: 500;
    font-size: 14px;
    color: #333333;
    line-height: 1.5;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.survey-status {
    display: flex;
    align-items: center;
    gap: 4px;
    font-family:
        Source Han Sans,
        Source Han Sans;
    font-weight: 400;
    font-size: 12px;
    line-height: 12px;
    text-align: right;
    font-style: normal;
    text-transform: none;
}

.survey-status::after {
    width: 20%;
    content: " >";
    vertical-align: middle;
}

.survey-status.submitted {
    width: 20%;
    color: #2fc25b;
    vertical-align: middle;
}

.survey-status.pending {
    width: 20%;
    color: #ea0000;
    vertical-align: middle;
}

.survey-status.expired {
    width: 20%;
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
</style>
