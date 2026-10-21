<template>
    <view class="property-survey-container">
        <!-- 标题 -->
        <view class="survey-header">
            <view class="survey-title">满意度调查</view>
            <view class="survey-subtitle">餐饮服务</view>
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
                    <view class="info-value">餐厅服务满意度调查</view>
                </view>
                <view class="info-row">
                    <view class="info-label">截至日期</view>
                    <view class="info-value">{{
                        formatDate(questionnaireInfo.endTime) || "加载中..."
                    }}</view>
                </view>
            </view>
        </view>

        <!-- 选择题 -->
        <view class="section">
            <view class="info-card">
                <view class="section-title"
                    >您平均每周在园区餐厅用餐多少次？</view
                >
                <radio-group
                    @change="onMealFrequencyChange"
                    class="radio-group"
                >
                    <view
                        class="radio-item"
                        v-for="(option, index) in mealFrequencyOptions"
                        :key="index"
                    >
                        <radio
                            :value="option.value"
                            :checked="mealFrequency === option.value"
                        />
                        <text>{{ option.label }}</text>
                    </view>
                </radio-group>
            </view>
        </view>

        <view class="section">
            <view class="info-card">
                <view class="section-title"
                    >您最常使用园区餐厅的哪些餐段？(可多选)</view
                >
                <view class="checkbox-group">
                    <view
                        class="checkbox-item"
                        v-for="(option, index) in mealPeriodOptions"
                        :key="index"
                    >
                        <checkbox
                            :value="option.value"
                            :checked="
                                selectedMealPeriods.includes(option.value)
                            "
                            @change="toggleMealPeriod(option.value)"
                        />
                        <text>{{ option.label }}</text>
                    </view>
                </view>
            </view>
        </view>

        <!-- 满意度评分 -->
        <view class="section">
            <view class="rating-card">
                <view class="section-title">请对餐厅的以下方面进行评分</view>
                <!-- 评分项 1 -->
                <view class="rating-item">
                    <view class="rating-label">食物口味</view>
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
                    <view class="rating-label">菜品多样性</view>
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
                    <view class="rating-label">食材新鲜度</view>
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
                    <view class="rating-label">餐食分量</view>
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
                    <view class="rating-label">出餐速度</view>
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
            </view>
        </view>

        <view class="section">
            <view class="rating-card">
                <view class="section-title">请对餐厅环境及服务进行评分</view>
                <!-- 评分项 1 -->
                <view class="rating-item">
                    <view class="rating-label">餐桌清洁度</view>
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

                <!-- 评分项 2 -->
                <view class="rating-item">
                    <view class="rating-label">餐具卫生</view>
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

                <!-- 评分项 3 -->
                <view class="rating-item">
                    <view class="rating-label">座位舒适度</view>
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

                <!-- 评分项 4 -->
                <view class="rating-item">
                    <view class="rating-label">服务态度</view>
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

                <!-- 评分项 5 -->
                <view class="rating-item">
                    <view class="rating-label">支付便利性</view>
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

        <!-- 餐品定价满意度 -->
        <view class="section">
            <view class="info-card">
                <view class="section-title"
                    >您对当前餐品定价的满意度如何？</view
                >
                <view class="price-rating-info">
                    1分=价格过高，10分=物超所值
                </view>
                <view class="price-rating-grid">
                    <view
                        v-for="i in 10"
                        :key="i"
                        :class="[
                            'price-rating-item',
                            { selected: selectedPriceRating === i },
                        ]"
                        @click="selectPriceRating(i)"
                    >
                        {{ i }}分
                    </view>
                </view>
            </view>
        </view>

        <!-- 其他建议 -->
        <view class="section">
            <view class="info-card">
                <view class="section-title">您对于餐厅的其他建议</view>
                <view class="suggestion-item">
                    <view class="suggestion-label"
                        >您希望餐厅改进哪些方面？</view
                    >
                    <textarea
                        v-model="suggestions.improvement"
                        class="suggestion-input"
                        placeholder="请填写"
                        placeholder-class="input-placeholder"
                    />
                </view>
                <view class="suggestion-item">
                    <view class="suggestion-label">您最常点的菜品名称是？</view>
                    <textarea
                        v-model="suggestions.favoriteDish"
                        class="suggestion-input"
                        placeholder="请填写"
                        placeholder-class="input-placeholder"
                    />
                </view>
            </view>
        </view>
        <view class="section">
            <view class="info-card">
                <view class="section-title"
                    >整体而言您对园区餐厅的满意度是？</view
                >
                <radio-group
                    @change="onOverallSatisfactionChange"
                    class="radio-group"
                >
                    <view
                        class="radio-item"
                        v-for="(option, index) in satisfactionOptions"
                        :key="index"
                    >
                        <radio
                            :value="option.value"
                            :checked="overallSatisfaction === option.value"
                        />
                        <text>{{ option.label }}</text>
                    </view>
                </radio-group>
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
    submitRestaurantQuest,
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
    contactPerson: "",
    contactPhone: "",
});

// 评分值数组，初始化为 0（10 个评分项）
const ratingValues = ref(new Array(10).fill(0));

// 价格满意度评分，初始化为 9 分
const selectedPriceRating = ref(9);

// 用餐频率选项
const mealFrequencyOptions = ref([
    { value: "less_than_1", label: "不到 1 次" },
    { value: "1_to_3", label: "1-3 次" },
    { value: "4_to_6", label: "4-6 次" },
    { value: "more_than_7", label: "7 次以上" },
]);

// 用餐频率答案
const mealFrequency = ref("");

// 餐段选项（多选）
const mealPeriodOptions = ref([
    { value: "breakfast", label: "早餐" },
    { value: "lunch", label: "午餐" },
    { value: "dinner", label: "晚餐" },
    { value: "lateNight", label: "宵夜" },
]);

// 已选择的餐段（多选）
const selectedMealPeriods = ref([]);

// 其他建议
const suggestions = ref({
    improvement: "",
    favoriteDish: "",
});

// 整体满意度选项
const satisfactionOptions = ref([
    { value: "very_satisfied", label: "非常满意" },
    { value: "satisfied", label: "比较满意" },
    { value: "neutral", label: "一般" },
    { value: "dissatisfied", label: "不太满意" },
    { value: "very_dissatisfied", label: "非常不满意" },
]);

// 整体满意度
const overallSatisfaction = ref("");

// 选择题答案
const selectedAnswers = ref({
    mealFrequency: "",
    mealPeriods: [],
});

// 选择整体满意度（通过 radio-group 的 change 事件）
const onOverallSatisfactionChange = (e) => {
    overallSatisfaction.value = e.detail.value;
    console.log("整体满意度选择:", e.detail.value);
};

// 设置评分
const setRating = (index, value) => {
    ratingValues.value[index] = value;
};

// 选择用餐频率（通过 radio-group 的 change 事件）
const onMealFrequencyChange = (e) => {
    mealFrequency.value = e.detail.value;
    console.log("用餐频率选择:", e.detail.value);
};

// 切换餐段选择（多选）
const toggleMealPeriod = (value) => {
    const index = selectedMealPeriods.value.indexOf(value);
    if (index > -1) {
        // 已存在则移除
        selectedMealPeriods.value.splice(index, 1);
    } else {
        // 不存在则添加
        selectedMealPeriods.value.push(value);
    }
    console.log("已选择的餐段:", selectedMealPeriods.value);
};

// 选择价格满意度评分
const selectPriceRating = (value) => {
    selectedPriceRating.value = value;
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

// 计算总体满意率（基于价格满意度）
const calculateSatisfactionRate = () => {
    // 使用价格满意度评分（1-10分）
    const priceRating = selectedPriceRating.value;

    if (priceRating === 0) {
        return 0;
    }

    // 计算满意率（乘以100并取整）
    const rate = (priceRating / 10) * 100;
    return Math.round(rate);
};

// 提交调查
const submitSurvey = async () => {
    // 计算价格满意度相关值
    const priceRating = selectedPriceRating.value;
    const priceSatisfactionRate = calculateSatisfactionRate();

    // 构建提交数据（匹配后端 API 字段）
    const submitData = {
        assessmentId: assessmentId.value, // 直接使用字符串，避免精度丢失
        // 食物相关评分
        foodTaste: ratingValues.value[0], // 食物口味
        foodDiversity: ratingValues.value[1], // 菜品多样性
        foodFresh: ratingValues.value[2], // 食材新鲜度
        foodSize: ratingValues.value[3], // 餐食分量
        foodSpeed: ratingValues.value[4], // 出餐速度
        // 环境相关评分
        tableCleaning: ratingValues.value[5], // 餐桌清洁度
        tablewareCleaning: ratingValues.value[6], // 餐具卫生
        seatComfort: ratingValues.value[7], // 座位舒适度
        // 服务相关评分
        serviceAttitude: ratingValues.value[8], // 服务态度
        paymentConvenience: ratingValues.value[9], // 支付便利性
        // 价格满意度相关
        priceTotalScore: priceRating, // 价格满意度总分（1-10分）
        priceSatisfactionRate: priceSatisfactionRate, // 价格满意率（已乘以100）
        // 其他信息
        mealFrequency: mealFrequency.value, // 用餐频率
        mealTime: selectedMealPeriods.value.join(","), // 餐段（逗号分隔）
        // 联系人信息
        companyName: surveyorInfo.companyName || "餐厅满意度调查", // 公司名
        contact: surveyorInfo.contactPerson || "匿名用户", // 联系人
        phoneNum: surveyorInfo.contactPhone || "", // 联系方式
    };

    console.log("提交的数据:", submitData);

    try {
        await submitRestaurantQuest(submitData);

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
    console.log("餐厅问卷页面加载，开始初始化...");
    // 从路由参数获取 assessmentId
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const options = currentPage.options;

    console.log("路由参数:", options);

    if (options.assessmentId) {
        console.log("找到 assessmentId:", options.assessmentId);
        assessmentId.value = options.assessmentId;
        getQuestionnaireDetailApi();
    } else {
        console.warn("未找到 assessmentId 参数");
        uni.showToast({ title: "缺少问卷参数", icon: "none" });
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
    width: 192px;
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

/* 单选按钮组样式 */
.radio-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.radio-item {
    display: flex;
    align-items: center;
    gap: 8px;
}

.radio-item text {
    font-size: 14px;
    color: #333333;
}

/* 多选按钮组样式 */
.checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.checkbox-item {
    display: flex;
    align-items: center;
    gap: 8px;
}

.checkbox-item text {
    font-size: 14px;
    color: #333333;
}

/* 满意度等级样式 */
.satisfaction-levels {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.level-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.level-label {
    font-size: 14px;
    color: #333333;
}

.level-bar {
    width: 100%;
    height: 12px;
    background: #f0f0f0;
    border-radius: 6px;
    overflow: hidden;
}

.level-fill {
    height: 100%;
    background: #235eff;
    border-radius: 6px;
}

/* 价格满意度评分样式 */
.price-rating-info {
    font-size: 14px;
    color: #666666;
    margin-bottom: 16px;
}

.price-rating-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
}

.price-rating-item {
    width: 100%;
    height: 40px;
    background: #f0f0f0;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #333333;
    cursor: pointer;
    transition: all 0.3s ease;
}

.price-rating-item.selected {
    background: #235eff;
    color: #ffffff;
}

.satisfaction-rate {
    font-size: 24px;
    font-weight: 700;
    color: #235eff;
    text-align: center;
    margin-top: 16px;
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
