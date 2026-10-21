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
          <view class="info-value">2025年度问卷调查</view>
        </view>
        <view class="info-row">
          <view class="info-label">问卷类型</view>
          <view class="info-value">餐厅服务满意度调查</view>
        </view>
        <view class="info-row">
          <view class="info-label">截至日期</view>
          <view class="info-value">2025.12.12</view>
        </view>
      </view>
    </view>


    <!-- 选择题 -->
    <view class="section">
      <view class="info-card">
        <view class="section-title">您平均每周在园区餐厅用餐多少次？</view>
        <view class="radio-group">
          <view class="radio-item">
            <radio value="daily" /><text>不到1次</text>
          </view>
          <view class="radio-item">
            <radio value="weekly" /><text>1-3次</text>
          </view>
          <view class="radio-item">
            <radio value="monthly" /><text>4-6次</text>
          </view>
          <view class="radio-item">
            <radio value="rarely" /><text>7次以上</text>
          </view>
        </view>
      </view>
    </view>

    <view class="section">
      <view class="info-card">
        <view class="section-title">您最常使用园区餐厅的哪些餐段？(可多选)</view>
        <view class="radio-group">
          <view class="radio-item">
            <radio value="very" /><text>早餐</text>
          </view>
          <view class="radio-item">
            <radio value="rich" /><text>午餐</text>
          </view>
          <view class="radio-item">
            <radio value="general" /><text>晚餐</text>
          </view>
          <view class="radio-item">
            <radio value="poor" /><text>宵夜</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 满意度评分 -->
    <view class="section">
      <view class="rating-card">
      <view class="section-title">请对餐厅的以下方面进行评分</view>
        <!-- 评分项1 -->
        <view class="rating-item">
          <view class="rating-label">食物口味</view>
          <view class="rating-stars">
            <image 
              v-for="i in 5" 
              :key="i"
              :src="i <= 4 ? '/static/images/icon/park/star.png' : '/static/images/icon/park/star.png'"
              class="star"
              @click="setRating(0, i)"
            ></image>
          </view>
        </view>

        <!-- 评分项2 -->
        <view class="rating-item">
          <view class="rating-label">菜品多样性</view>
          <view class="rating-stars">
            <image 
              v-for="i in 5" 
              :key="i"
              :src="i <= 4 ? '/static/images/icon/park/star.png' : '/static/images/icon/park/star.png'"
              class="star"
              @click="setRating(1, i)"
            ></image>
          </view>
        </view>

        <!-- 评分项3 -->
        <view class="rating-item">
          <view class="rating-label">食材新鲜度</view>
          <view class="rating-stars">
            <image 
              v-for="i in 5" 
              :key="i"
              :src="i <= 4 ? '/static/images/icon/park/star.png' : '/static/images/icon/park/star.png'"
              class="star"
              @click="setRating(2, i)"
            ></image>
          </view>
        </view>

        <!-- 评分项4 -->
        <view class="rating-item">
          <view class="rating-label">餐食分量</view>
          <view class="rating-stars">
            <image 
              v-for="i in 5" 
              :key="i"
              :src="i <= 4 ? '/static/images/icon/park/star.png' : '/static/images/icon/park/star.png'"
              class="star"
              @click="setRating(3, i)"
            ></image>
          </view>
        </view>

        <!-- 评分项5 -->
        <view class="rating-item">
          <view class="rating-label">出餐速度</view>
          <view class="rating-stars">
            <image 
              v-for="i in 5" 
              :key="i"
              :src="i <= 4 ? '/static/images/icon/park/star.png' : '/static/images/icon/park/star.png'"
              class="star"
              @click="setRating(4, i)"
            ></image>
          </view>
        </view>
      </view>
    </view>

    <view class="section">
      <view class="rating-card">
      <view class="section-title">请对餐厅环境及服务进行评分</view>
        <!-- 评分项1 -->
        <view class="rating-item">
          <view class="rating-label">餐桌清洁度</view>
          <view class="rating-stars">
            <image 
              v-for="i in 5" 
              :key="i"
              :src="i <= 4 ? '/static/images/icon/park/star.png' : '/static/images/icon/park/star.png'"
              class="star"
              @click="setRating(0, i)"
            ></image>
          </view>
        </view>

        <!-- 评分项2 -->
        <view class="rating-item">
          <view class="rating-label">餐具卫生</view>
          <view class="rating-stars">
            <image 
              v-for="i in 5" 
              :key="i"
              :src="i <= 4 ? '/static/images/icon/park/star.png' : '/static/images/icon/park/star.png'"
              class="star"
              @click="setRating(1, i)"
            ></image>
          </view>
        </view>

        <!-- 评分项3 -->
        <view class="rating-item">
          <view class="rating-label">座位舒适度</view>
          <view class="rating-stars">
            <image 
              v-for="i in 5" 
              :key="i"
              :src="i <= 4 ? '/static/images/icon/park/star.png' : '/static/images/icon/park/star.png'"
              class="star"
              @click="setRating(2, i)"
            ></image>
          </view>
        </view>

        <!-- 评分项4 -->
        <view class="rating-item">
          <view class="rating-label">服务态度</view>
          <view class="rating-stars">
            <image 
              v-for="i in 5" 
              :key="i"
              :src="i <= 4 ? '/static/images/icon/park/star.png' : '/static/images/icon/park/star.png'"
              class="star"
              @click="setRating(3, i)"
            ></image>
          </view>
        </view>

        <!-- 评分项5 -->
        <view class="rating-item">
          <view class="rating-label">支付便利性</view>
          <view class="rating-stars">
            <image 
              v-for="i in 5" 
              :key="i"
              :src="i <= 4 ? '/static/images/icon/park/star.png' : '/static/images/icon/park/star.png'"
              class="star"
              @click="setRating(4, i)"
            ></image>
          </view>
        </view>
      </view>
    </view>

    <!-- 餐品定价满意度 -->
    <view class="section">
      <view class="info-card">
        <view class="section-title">您对当前餐品定价的满意度如何？</view>
        <view class="price-rating-info">
          1分=价格过高，10分=物超所值
        </view>
        <view class="price-rating-grid">
          <view 
            v-for="i in 10" 
            :key="i"
            :class="['price-rating-item', { 'selected': selectedPriceRating === i }]"
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
          <view class="suggestion-label">您希望餐厅改进哪些方面？</view>
          <view class="suggestion-input input-placeholder">请填写</view>
        </view>
        <view class="suggestion-item">
          <view class="suggestion-label">您最常点的菜品名称是？</view>
          <view class="suggestion-input input-placeholder">请填写</view>
        </view>
      </view>
    </view>
    <view class="section">
      <view class="info-card">
        <view class="section-title">整体而言您对园区餐厅的满意度是？</view>
        <view class="radio-group">
          <view class="radio-item">
            <radio value="very" /><text>非常满意</text>
          </view>
          <view class="radio-item">
            <radio value="rich" /><text>比较满意</text>
          </view>
          <view class="radio-item">
            <radio value="general" /><text>一般</text>
          </view>
          <view class="radio-item">
            <radio value="poor" /><text>不太满意</text>
          </view>
          <view class="radio-item">
            <radio value="poor" /><text>非常不满意</text>
          </view>
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
import { ref } from 'vue';

// 评分值数组，初始化为0（现在有8个评分项）
const ratingValues = ref(new Array(8).fill(0));

// 价格满意度评分，初始化为9分
const selectedPriceRating = ref(9);

// 设置评分
const setRating = (index, value) => {
  ratingValues.value[index] = value;
};

// 选择价格满意度评分
const selectPriceRating = (value) => {
  selectedPriceRating.value = value;
};

// 提交调查
const submitSurvey = () => {
  // 这里可以添加提交逻辑
  uni.showToast({
    title: '提交成功',
    icon: 'success'
  });
  // 跳转到满意度页面
  uni.navigateTo({
    url: '/pages_survey/satisfactionSubmit'
  });
};
</script>

<style lang="scss" scoped>
/* 重置默认样式 */
page {
  margin: 0;
  padding: 0;
  width: 375px;
  height: 2845px;
  background: #F5FBFF;
  border-radius: 0px 0px 0px 0px;
}

.property-survey-container {
  width: 100%;
  min-height: 100vh;
  background: #F5FBFF;
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
  font-family: Source Han Sans, Source Han Sans;
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
  font-family: Source Han Sans, Source Han Sans;
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
  font-family: Source Han Sans, Source Han Sans;
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
  font-family: Source Han Sans, Source Han Sans;
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
  background: #FFFFFF;
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
  background: #235EFF;
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
  background: #235EFF;
  color: #ffffff;
}

.submit-button {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

.submit-button button {
  width: 343px;
  height: 40px;
  background: #235EFF;
  color: #ffffff;
  border-radius: 20px 20px 20px 20px;
  font-size: 16px;
  font-weight: 500;
}
</style>