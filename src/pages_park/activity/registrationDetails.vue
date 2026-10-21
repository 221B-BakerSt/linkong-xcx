<template>
    <view class="registration-details-container">
        <!-- 活动报名信息卡片 -->
        <view class="info-card">
            <view class="card-title">活动报名信息</view>
            <view class="info-row">
                <view class="info-label">活动名称</view>
                <view class="info-value">{{
                    activityInfo.assessmentName || "加载中..."
                }}</view>
            </view>
            <view class="info-row">
                <view class="info-label">所在企业</view>
                <view class="info-value">{{
                    registerInfo.companyName || "-"
                }}</view>
            </view>
            <view class="info-row">
                <view class="info-label">姓名</view>
                <view class="info-value">{{
                    registerInfo.participantName || "-"
                }}</view>
            </view>
            
            
            
            <view class="info-row">
                <view class="info-label">手机号</view>
                <view class="info-value">{{ registerInfo.phoneNum || "-" }}</view>
            </view>
            
            <view class="info-row" v-if="registerInfo.submitTime">
                <view class="info-label">提交时间</view>
                <view class="info-value">{{
                    formatDate(registerInfo.submitTime)
                }}</view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
    getActivityTaskDetail,
    getActivityRegisterList,
} from "@/api/operations/questionnaireAssessment";

// 从路由参数获取活动 ID
const assessmentId = ref("");

// 活动信息
const activityInfo = ref({
    assessmentName: "",
    endTime: "",
});

// 报名信息
const registerInfo = ref({
    companyName: "",
    participantName: "",
    phoneNum: "",
    submitTime: "",
});

// 获取活动详情
const getActivityDetailApi = async () => {
    try {
        console.log("开始调用活动详情接口，assessmentId:", assessmentId.value);
        const res = await getActivityTaskDetail(assessmentId.value);
        console.log("活动详情接口返回:", res);
        if (res && res.data) {
            activityInfo.value = {
                assessmentName: res.data.assessmentName || "",
                endTime: res.data.endTime || "",
            };
            console.log("活动信息已更新:", activityInfo.value);
        }
    } catch (e) {
        console.error("获取活动详情失败:", e);
        uni.showToast({ title: "加载失败", icon: "none" });
    }
};

// 获取报名记录
const getRegisterRecordApi = async () => {
    try {
        const res = await getActivityRegisterList({
            assessmentId: assessmentId.value,
        });

        if (res && res.data && res.data.rows && res.data.rows.length > 0) {
            const record = res.data.rows[0];
            registerInfo.value = {
                companyName: record.companyName || "-",
                participantName: record.participantName || "-",



                phoneNum: record.phoneNum || "-",

                submitTime: record.createTime || "",
            };
        }
    } catch (e) {
        console.error("获取报名记录失败:", e);
    }
};

// 格式化日期（仅显示年月日时分）
const formatDate = (timeStr) => {
    if (!timeStr) return "";
    // 替换 T 为空格，并截取到分钟
    return timeStr.replace("T", " ").substring(0, 16);
};

onMounted(() => {
    console.log("活动详情页面加载，开始初始化...");
    // 从路由参数获取 assessmentId
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const options = currentPage.options;

    console.log("路由参数:", options);

    if (options.assessmentId) {
        console.log("找到 assessmentId:", options.assessmentId);
        assessmentId.value = options.assessmentId;
        getActivityDetailApi();
        getRegisterRecordApi();
    } else {
        console.warn("未找到 assessmentId 参数");
        uni.showToast({ title: "缺少活动参数", icon: "none" });
    }
});
</script>

<style lang="scss" scoped>
/* 重置默认样式 */
page {
    margin: 0;
    padding: 0;
    width: 375px;
    height: 812px;
    background: #f5fbff;
    border-radius: 0px 0px 0px 0px;
}

.registration-details-container {
    width: 100%;
    min-height: 100vh;
    background: #f5fbff;
    padding: 16px;
    box-sizing: border-box;
}

.info-card {
    background: #ffffff;
    border-radius: 10px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-title {
    font-size: 16px;
    font-family:
        Source Han Sans-Medium,
        Source Han Sans;
    font-weight: 500;
    color: #333333;
    margin-bottom: 16px;
}

.info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
}

.info-row:last-child {
    border-bottom: none;
}

.info-label {
    font-size: 14px;
    color: #666666;
    flex: 0 0 80px;
}

.info-value {
    flex: 1;
    font-size: 14px;
    color: #333333;
    text-align: right;
}
</style>

