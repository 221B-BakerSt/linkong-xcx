<template>
    <view class="registration-container">
        <!-- 活动信息卡片 -->
        <view class="info-card">
            <view class="card-title">活动信息</view>
            <view class="info-row">
                <view class="info-label">活动名称</view>
                <view class="info-value">{{
                    activityInfo.assessmentName || "加载中..."
                }}</view>
            </view>
            <view class="info-row">
                <view class="info-label">截止日期</view>
                <view class="info-value">{{
                    formatDate(activityInfo.endTime) || "加载中..."
                }}</view>
            </view>
        </view>

        <!-- 个人信息卡片 -->
        <view class="info-card">
            <view class="card-title">个人信息</view>
            <view class="info-row">
                <view class="info-label">所在企业</view>
                <input
                    v-model="formData.companyName"
                    class="info-input"
                    placeholder="请填写"
                    placeholder-class="input-placeholder"
                />
            </view>
            <view class="info-row">
                <view class="info-label">姓名</view>
                <input
                    v-model="formData.realName"
                    class="info-input"
                    placeholder="请填写"
                    placeholder-class="input-placeholder"
                />
            </view>
            
            
            
            <view class="info-row">
                <view class="info-label">手机号</view>
                <input
                    v-model="formData.phoneNum"
                    class="info-input"
                    type="number"
                    maxlength="11"
                    placeholder="请填写"
                    placeholder-class="input-placeholder"
                />
            </view>
            
        </view>

        <!-- 确认报名按钮 -->
        <view class="submit-button">
            <button type="primary" @click="confirmRegistration">
                确认报名
            </button>
        </view>
    </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
    getActivityTaskDetail,
    submitActivityRegister,
} from "@/api/operations/questionnaireAssessment";

// 从路由参数获取活动 ID
const assessmentId = ref("");

// 活动信息
const activityInfo = ref({
    assessmentName: "",
    endTime: "",
});

// 表单数据
const formData = ref({
    companyName: "",
    realName: "",
    phoneNum: "",
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

// 格式化日期（仅显示年月日）
const formatDate = (timeStr) => {
    if (!timeStr) return "";
    return timeStr.split(" ")[0];
};

// 确认报名
const confirmRegistration = async () => {
    // 校验必填项
    if (!formData.value.companyName) {
        uni.showToast({ title: "请填写所在企业", icon: "none" });
        return;
    }
    if (!formData.value.realName) {
        uni.showToast({ title: "请填写姓名", icon: "none" });
        return;
    }
    if (!formData.value.phoneNum) {
        uni.showToast({ title: "请填写手机号", icon: "none" });
        return;
    }

    // 构建提交数据
    const submitData = {
        assessmentId: assessmentId.value, // 字符串，避免精度丢失
        companyName: formData.value.companyName,
        realName: formData.value.realName,
        phoneNum: formData.value.phoneNum,
    };

    console.log("提交的数据:", submitData);

    try {
        await submitActivityRegister(submitData);

        uni.showToast({
            title: "报名成功",
            icon: "success",
        });

        // 跳转到成功页面
        setTimeout(() => {
            uni.navigateTo({
                url: "/pages_park/activity/registrationSubmit",
            });
        }, 500);
    } catch (e) {
        console.error("提交失败:", e);
        uni.showToast({
            title: e.message || "提交失败",
            icon: "none",
        });
    }
};

onMounted(() => {
    console.log("活动报名页面加载，开始初始化...");
    // 从路由参数获取 assessmentId
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const options = currentPage.options;

    console.log("路由参数:", options);

    if (options.assessmentId) {
        console.log("找到 assessmentId:", options.assessmentId);
        assessmentId.value = options.assessmentId;
        getActivityDetailApi();
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

.registration-container {
    width: 100%;
    min-height: 100vh;
    background: #f5fbff;
    padding: 16px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 16px;
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

.info-input {
    flex: 1;
    font-size: 14px;
    color: #333333;
    text-align: right;
    padding: 8px 0;
}

.input-placeholder {
    color: #999999;
}

.info-value {
    flex: 1;
    font-size: 14px;
    color: #333333;
    text-align: right;
}

.selectable {
    color: #235eff;
    cursor: pointer;
}

.submit-button {
    margin-top: 24px;
    margin-bottom: 32px;
}

.submit-button button {
    width: 100%;
    height: 48px;
    background: #235eff;
    color: #ffffff;
    border-radius: 24px;
    font-size: 16px;
    font-weight: 500;
}
</style>


