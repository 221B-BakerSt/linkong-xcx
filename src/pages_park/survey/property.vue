<template>
    <view class="property-survey-container">
        <!-- 标题 -->
        <view class="survey-header">
            <view class="survey-title">满意度调查</view>
            <view class="survey-subtitle">物业服务</view>
        </view>

        <!-- 问卷信息 -->
        <view class="section">
            <view class="info-card">
                <view class="section-title">问卷信息</view>
                <view class="info-row">
                    <view class="info-label">问卷名称</view>
                    <view class="info-value">{{
                        questionnaireInfo.assessmentName || "加载中..."
                    }}</view>
                </view>
                <view class="info-row">
                    <view class="info-label">问卷类型</view>
                    <view class="info-value">物业服务满意度调查</view>
                </view>
                <view class="info-row">
                    <view class="info-label">截至日期</view>
                    <view class="info-value">{{
                        formatDate(questionnaireInfo.endTime) || "加载中..."
                    }}</view>
                </view>
            </view>
        </view>

        <!-- 调查人信息 -->
        <view class="section">
            <view class="info-card">
                <view class="section-title">调查人信息</view>

                <view class="info-row">
                    <view class="info-label">公司名称</view>
                    <input
                        v-model="surveyorInfo.companyName"
                        class="info-value"
                        placeholder="请填写"
                        placeholder-class="input-placeholder"
                    />
                </view>
                <view class="info-row">
                    <view class="info-label">您的姓名</view>
                    <input
                        v-model="surveyorInfo.contact"
                        class="info-value"
                        placeholder="请填写"
                        placeholder-class="input-placeholder"
                    />
                </view>
                <view class="info-row">
                    <view class="info-label">联系电话</view>
                    <input
                        v-model="surveyorInfo.phoneNum"
                        class="info-value"
                        placeholder="请填写"
                        placeholder-class="input-placeholder"
                        type="number"
                    />
                </view>
            </view>
        </view>

        <!-- 满意度评分 -->
        <view class="section">
            <view class="rating-card">
                <view class="section-title">您对物业基本服务满意度</view>
                <!-- 评分项 1 -->
                <view class="rating-item">
                    <view class="rating-label">环境干净整洁</view>
                    <view class="rating-stars">
                        <image
                            v-for="i in 5"
                            :key="i"
                            :src="'/pages_park/static/star.png'"
                            :class="[
                                'star',
                                i > ratingValues[0] ? 'star-gray' : '',
                            ]"
                            @click="setRating(0, i)"
                        ></image>
                    </view>
                </view>

                <!-- 评分项 2 -->
                <view class="rating-item">
                    <view class="rating-label">人员管理工作</view>
                    <view class="rating-stars">
                        <image
                            v-for="i in 5"
                            :key="i"
                            :src="'/pages_park/static/star.png'"
                            :class="[
                                'star',
                                i > ratingValues[1] ? 'star-gray' : '',
                            ]"
                            @click="setRating(1, i)"
                        ></image>
                    </view>
                </view>

                <!-- 评分项 3 -->
                <view class="rating-item">
                    <view class="rating-label">秩序维护</view>
                    <view class="rating-stars">
                        <image
                            v-for="i in 5"
                            :key="i"
                            :src="'/pages_park/static/star.png'"
                            :class="[
                                'star',
                                i > ratingValues[2] ? 'star-gray' : '',
                            ]"
                            @click="setRating(2, i)"
                        ></image>
                    </view>
                </view>

                <!-- 评分项 4 -->
                <view class="rating-item">
                    <view class="rating-label">公共区域设施维护、使用</view>
                    <view class="rating-stars">
                        <image
                            v-for="i in 5"
                            :key="i"
                            :src="'/pages_park/static/star.png'"
                            :class="[
                                'star',
                                i > ratingValues[3] ? 'star-gray' : '',
                            ]"
                            @click="setRating(3, i)"
                        ></image>
                    </view>
                </view>

                <!-- 评分项 5 -->
                <view class="rating-item">
                    <view class="rating-label">园区绿化</view>
                    <view class="rating-stars">
                        <image
                            v-for="i in 5"
                            :key="i"
                            :src="'/pages_park/static/star.png'"
                            :class="[
                                'star',
                                i > ratingValues[4] ? 'star-gray' : '',
                            ]"
                            @click="setRating(4, i)"
                        ></image>
                    </view>
                </view>

                <view class="rating-item">
                    <view class="rating-label">蚊虫消杀</view>
                    <view class="rating-stars">
                        <image
                            v-for="i in 5"
                            :key="i"
                            :src="'/pages_park/static/star.png'"
                            :class="[
                                'star',
                                i > ratingValues[5] ? 'star-gray' : '',
                            ]"
                            @click="setRating(5, i)"
                        ></image>
                    </view>
                </view>
                <view class="rating-item">
                    <view class="rating-label">机动车停放有序</view>
                    <view class="rating-stars">
                        <image
                            v-for="i in 5"
                            :key="i"
                            :src="'/pages_park/static/star.png'"
                            :class="[
                                'star',
                                i > ratingValues[6] ? 'star-gray' : '',
                            ]"
                            @click="setRating(6, i)"
                        ></image>
                    </view>
                </view>
                <view class="rating-item">
                    <view class="rating-label">公共维修工作</view>
                    <view class="rating-stars">
                        <image
                            v-for="i in 5"
                            :key="i"
                            :src="'/pages_park/static/star.png'"
                            :class="[
                                'star',
                                i > ratingValues[7] ? 'star-gray' : '',
                            ]"
                            @click="setRating(7, i)"
                        ></image>
                    </view>
                </view>
                <view class="rating-item">
                    <view class="rating-label">客户意见是否收到重视</view>
                    <view class="rating-stars">
                        <image
                            v-for="i in 5"
                            :key="i"
                            :src="'/pages_park/static/star.png'"
                            :class="[
                                'star',
                                i > ratingValues[8] ? 'star-gray' : '',
                            ]"
                            @click="setRating(8, i)"
                        ></image>
                    </view>
                </view>
                <view class="rating-item">
                    <view class="rating-label">客户问题是否得到解决</view>
                    <view class="rating-stars">
                        <image
                            v-for="i in 5"
                            :key="i"
                            :src="'/pages_park/static/star.png'"
                            :class="[
                                'star',
                                i > ratingValues[9] ? 'star-gray' : '',
                            ]"
                            @click="setRating(9, i)"
                        ></image>
                    </view>
                </view>
            </view>
        </view>
        <view class="section">
            <view class="rating-card">
                <view class="section-title">您对园区管理服务水平满意度</view>
                <!-- 评分项 1 -->
                <view class="rating-item">
                    <view class="rating-label">服务意识</view>
                    <view class="rating-stars">
                        <image
                            v-for="i in 5"
                            :key="i"
                            :src="'/pages_park/static/star.png'"
                            :class="[
                                'star',
                                i > ratingValues[10] ? 'star-gray' : '',
                            ]"
                            @click="setRating(10, i)"
                        ></image>
                    </view>
                </view>

                <!-- 评分项 2 -->
                <view class="rating-item">
                    <view class="rating-label">工作态度</view>
                    <view class="rating-stars">
                        <image
                            v-for="i in 5"
                            :key="i"
                            :src="'/pages_park/static/star.png'"
                            :class="[
                                'star',
                                i > ratingValues[11] ? 'star-gray' : '',
                            ]"
                            @click="setRating(11, i)"
                        ></image>
                    </view>
                </view>

                <!-- 评分项 3 -->
                <view class="rating-item">
                    <view class="rating-label">专业能力</view>
                    <view class="rating-stars">
                        <image
                            v-for="i in 5"
                            :key="i"
                            :src="'/pages_park/static/star.png'"
                            :class="[
                                'star',
                                i > ratingValues[12] ? 'star-gray' : '',
                            ]"
                            @click="setRating(12, i)"
                        ></image>
                    </view>
                </view>

                <!-- 评分项 4 -->
                <view class="rating-item">
                    <view class="rating-label">解决问题的速度</view>
                    <view class="rating-stars">
                        <image
                            v-for="i in 5"
                            :key="i"
                            :src="'/pages_park/static/star.png'"
                            :class="[
                                'star',
                                i > ratingValues[13] ? 'star-gray' : '',
                            ]"
                            @click="setRating(13, i)"
                        ></image>
                    </view>
                </view>
            </view>
        </view>
        <view class="section">
            <view class="rating-card">
                <view class="section-title"
                    >您对于园区物业服务中心处理投诉的满意度</view
                >
                <!-- 评分项 1 -->
                <view class="rating-item">
                    <view class="rating-label">总体满意度</view>
                    <view class="rating-stars">
                        <image
                            v-for="i in 5"
                            :key="i"
                            :src="'/pages_park/static/star.png'"
                            :class="[
                                'star',
                                i > complaintRatingValues[0] ? 'star-gray' : '',
                            ]"
                            @click="setComplaintRating(0, i)"
                        ></image>
                    </view>
                </view>

                <!-- 评分项 2 -->
                <view class="rating-item">
                    <view class="rating-label">投诉接待态度</view>
                    <view class="rating-stars">
                        <image
                            v-for="i in 5"
                            :key="i"
                            :src="'/pages_park/static/star.png'"
                            :class="[
                                'star',
                                i > complaintRatingValues[1] ? 'star-gray' : '',
                            ]"
                            @click="setComplaintRating(1, i)"
                        ></image>
                    </view>
                </view>

                <!-- 评分项 3 -->
                <view class="rating-item">
                    <view class="rating-label">处理及时</view>
                    <view class="rating-stars">
                        <image
                            v-for="i in 5"
                            :key="i"
                            :src="'/pages_park/static/star.png'"
                            :class="[
                                'star',
                                i > complaintRatingValues[2] ? 'star-gray' : '',
                            ]"
                            @click="setComplaintRating(2, i)"
                        ></image>
                    </view>
                </view>

                <!-- 评分项 4 -->
                <view class="rating-item">
                    <view class="rating-label">回访情况</view>
                    <view class="rating-stars">
                        <image
                            v-for="i in 5"
                            :key="i"
                            :src="'/pages_park/static/star.png'"
                            :class="[
                                'star',
                                i > complaintRatingValues[3] ? 'star-gray' : '',
                            ]"
                            @click="setComplaintRating(3, i)"
                        ></image>
                    </view>
                </view>
            </view>
        </view>

        <!-- 其他建议 -->
        <view class="section">
            <view class="info-card">
                <view class="section-title">您对于园区的其他建议</view>
                <view class="suggestion-item">
                    <view class="suggestion-label"
                        >感觉目前园区管理方面不规范？</view
                    >
                    <textarea
                        v-model="managementSuggestion"
                        class="suggestion-input"
                        placeholder="请填写"
                        placeholder-class="input-placeholder"
                    />
                </view>
                <view class="suggestion-item">
                    <view class="suggestion-label"
                        >感觉目前物业服务有哪些方面存在不足需要改进？</view
                    >
                    <textarea
                        v-model="serviceImprovementSuggestion"
                        class="suggestion-input"
                        placeholder="请填写"
                        placeholder-class="input-placeholder"
                    />
                </view>
            </view>
        </view>

        <!-- 提交按钮 -->
        <view class="submit-button">
            <button type="primary" @click="submitSurvey">提交</button>
        </view>
    </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
    getQuestionnaireAssessmentDetail,
    submitAddPropertyQuest,
} from "@/api/operations/questionnaireAssessment";

// 从路由参数获取问卷 ID
const assessmentId = ref("");

// 问卷信息
const questionnaireInfo = ref({
    assessmentName: "",
    type: "",
    endTime: "",
});

// 调查人信息
const surveyorInfo = ref({
    companyName: "",
    contact: "",
    phoneNum: "",
});

// 评分值数组，初始化为 0（14 个评分项）
const ratingValues = ref(new Array(14).fill(0));

// 投诉处理评分数组（独立的 4 个评分项）
const complaintRatingValues = ref(new Array(4).fill(0));

// 其他建议
const managementSuggestion = ref("");
const serviceImprovementSuggestion = ref("");

// 设置评分
const setRating = (index, value) => {
    ratingValues.value[index] = value;
};

// 设置投诉处理评分
const setComplaintRating = (index, value) => {
    complaintRatingValues.value[index] = value;
};

// 获取问卷详情
const getQuestionnaireDetailApi = async () => {
    try {
        console.log("开始调用问卷详情接口，assessmentId:", assessmentId.value);
        const res = await getQuestionnaireAssessmentDetail(assessmentId.value);
        console.log("问卷详情接口返回:", res);
        if (res && res.data) {
            questionnaireInfo.value = {
                assessmentName: res.data.assessmentName || "",
                type: res.data.type || "",
                endTime: res.data.endTime || "",
            };
            console.log("问卷信息已更新:", questionnaireInfo.value);
        }
    } catch (e) {
        console.error("获取问卷详情失败:", e);
        uni.showToast({ title: "加载失败", icon: "none" });
    }
};

// 格式化日期（仅显示年月日）
const formatDate = (timeStr) => {
    if (!timeStr) return "";
    return timeStr.split(" ")[0];
};

// 提交调查
const submitSurvey = async () => {
    // 构建提交数据（匹配  实体类字段）
    const submitData = {
        assessmentId: assessmentId.value, // 直接使用字符串，避免精度丢失
        // 基本服务满意度
        environment: ratingValues.value[0], // 环境干净整洁
        personnelManagement: ratingValues.value[1], // 人员管理工作
        orderMaintenance: ratingValues.value[2], // 秩序维护
        facilitiesMaintenance: ratingValues.value[3], // 公共区域设施维护、使用
        greening: ratingValues.value[4], // 园区绿化
        disinfect: ratingValues.value[5], // 蚊虫消杀
        vehicleOrder: ratingValues.value[6], // 机动车停放有序
        publicMaintenance: ratingValues.value[7], // 公共维修工作
        customerSatisfaction: ratingValues.value[8], // 客户意见是否收到重视
        problemResolution: ratingValues.value[9], // 客户问题是否得到解决
        // 园区服务水平
        serviceAwareness: ratingValues.value[10], // 服务意识
        workAttitude: ratingValues.value[11], // 工作态度
        professionalAbility: ratingValues.value[12], // 专业能力
        problemSolvingSpeed: ratingValues.value[13], // 解决问题的速度
        // 物业服务中心投诉处理
        overallSatisfaction: complaintRatingValues.value[0], // 总体满意度
        complaintAttitude: complaintRatingValues.value[1], // 投诉接待态度
        handleTimely: complaintRatingValues.value[2], // 处理及时
        followUp: complaintRatingValues.value[3], // 回访情况
        // 调查人信息
        companyName: surveyorInfo.value.companyName, // 公司名称
        contact: surveyorInfo.value.contact, // 联系人
        phoneNum: surveyorInfo.value.phoneNum, // 联系电话
        // 建议反馈
        managementSuggestion: managementSuggestion.value, // 园区管理规范性建议
        serviceImprovementSuggestion: serviceImprovementSuggestion.value, // 物业服务改进建议
    };

    console.log("提交的数据:", submitData);

    try {
        await submitAddPropertyQuest(submitData);

        uni.showToast({
            title: "提交成功",
            icon: "success",
        });

        // 跳转到满意度提交结果页面
        setTimeout(() => {
            uni.navigateTo({
                url: "/pages_park/survey/satisfactionSubmit",
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
    // 从路由参数获取 assessmentId
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const options = currentPage.options;

    if (options.assessmentId) {
        assessmentId.value = options.assessmentId;
        getQuestionnaireDetailApi();
    }
});
</script>

<style lang="scss" scoped>
/* 重置默认样式 */
page {
    margin: 0;
    padding: 0;
    width: 375px;
    height: 2845px;
    background: #f5fbff;
    border-radius: 0px 0px 0px 0px;
}

.property-survey-container {
    width: 100%;
    min-height: 100vh;
    background: #f5fbff;
    padding: 16px;
    box-sizing: border-box;
}

.survey-header {
    text-align: center;
    margin-bottom: 24px;
}

.survey-title {
    font-size: 18px;
    font-weight: 700;
    color: #333333;
    margin-bottom: 8px;
}

.survey-subtitle {
    font-size: 14px;
    color: #666666;
}

.section {
    margin-bottom: 24px;
}

.section-title {
    width: 300px;
    height: auto;
    font-family:
        Source Han Sans,
        Source Han Sans;
    font-weight: 500;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.9);
    line-height: 1.5;
    text-align: left;
    font-style: normal;
    text-transform: none;
    margin-bottom: 12px;
}

.info-card {
    background: #ffffff;
    border-radius: 10px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;
}

.info-row:last-child {
    border-bottom: none;
}

.info-label {
    width: 48px;
    height: 40px;
    font-family:
        Source Han Sans,
        Source Han Sans;
    font-weight: 400;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.6);
    line-height: 40px;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.info-value {
    flex: 1;
    min-height: 40px; height: auto;
    font-family:
        Source Han Sans,
        Source Han Sans;
    font-weight: 400;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.9);
    line-height: 1.5; padding: 11px 0;
    text-align: right;
    font-style: normal;
    text-transform: none;
    margin-left: 16px;
}

.input-placeholder {
    color: #999999;
}

.suggestion-item {
    margin-bottom: 16px;
}

.suggestion-item:last-child {
    margin-bottom: 0;
}

.suggestion-label {
    width: 100%;
    height: 12px;
    font-family:
        Source Han Sans,
        Source Han Sans;
    font-weight: 400;
    font-size: 12px;
    color: #666666;
    line-height: 12px;
    text-align: left;
    font-style: normal;
    text-transform: none;
    margin-bottom: 8px;
}

.suggestion-input {
    width: 343px;
    height: 126px;
    background: #ffffff;
    border-radius: 10px 10px 10px 10px;
    padding: 12px;
    box-sizing: border-box;
    font-size: 14px;
    color: #999999;
    line-height: 1.4;
}

.rating-card {
    background: #ffffff;
    border-radius: 10px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.rating-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
    gap: 8px;
}

.rating-item:last-child {
    border-bottom: none;
}

.rating-label {
    flex: 1;
    font-size: 14px;
    color: #333333;
    line-height: 1.4;
}

.rating-stars {
    display: flex;
    gap: 8px;
}

.star {
    width: 20px;
    height: 20px;
    cursor: pointer;
}

/* 灰色星星滤镜 */
.star-gray {
    filter: grayscale(100%);
    opacity: 0.5;
}

.submit-button {
    margin-top: 24px;
    display: flex;
    justify-content: center;
}

.submit-button button {
    width: 343px;
    height: 40px;
    background: #235eff;
    color: #ffffff;
    border-radius: 20px 20px 20px 20px;
    font-size: 16px;
    font-weight: 500;
}
</style>
