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
          <view class="info-value">2025年度问卷调查</view>
        </view>
        <view class="info-row">
          <view class="info-label">问卷类型</view>
          <view class="info-value">物业服务满意度调查</view>
        </view>
        <view class="info-row">
          <view class="info-label">截至日期</view>
          <view class="info-value">2025.12.12</view>
        </view>
      </view>
    </view>

    <!-- 调查人信息 -->
    <view class="section">
      <view class="info-card">
      <view class="section-title">调查人信息</view>

        <view class="info-row">
          <view class="info-label">公司名称</view>
          <view class="info-value input-placeholder">请填写</view>
        </view>
        <view class="info-row">
          <view class="info-label">您的姓名</view>
          <view class="info-value input-placeholder">请填写</view>
        </view>
        <view class="info-row">
          <view class="info-label">联系电话</view>
          <view class="info-value input-placeholder">请填写</view>
        </view>
      </view>
    </view>

    <!-- 满意度评分 -->
    <view class="section">
      <view class="rating-card">
      <view class="section-title">您对物业基本服务满意度</view>
        <!-- 评分项1 -->
        <view class="rating-item">
          <view class="rating-label">环境干净整洁</view>
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
          <view class="rating-label">人员管理工作</view>
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
          <view class="rating-label">秩序维护</view>
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
          <view class="rating-label">公共区域设施维护、使用</view>
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
          <view class="rating-label">园区绿化</view>
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

        <view class="rating-item">
          <view class="rating-label">蚊虫消杀</view>
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
        <view class="rating-item">
          <view class="rating-label">机动车停放有序</view>
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
        <view class="rating-item">
          <view class="rating-label">公共维修工作</view>
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
        <view class="rating-item">
          <view class="rating-label">客户意见是否收到重视</view>
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
        <view class="rating-item">
          <view class="rating-label">客户问题是否得到解决</view>
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
      <view class="section-title">您对园区管理服务水平满意度</view>
        <!-- 评分项1 -->
        <view class="rating-item">
          <view class="rating-label">服务意识</view>
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
          <view class="rating-label">工作态度</view>
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
          <view class="rating-label">专业能力</view>
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
          <view class="rating-label">解决问题的速度</view>
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
      </view>
    </view>
    <view class="section">
      <view class="rating-card">
      <view class="section-title">您对于园区物业服务中心处理投诉的满意度</view>
        <!-- 评分项1 -->
        <view class="rating-item">
          <view class="rating-label">总体满意度</view>
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
          <view class="rating-label">投诉接待态度</view>
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
          <view class="rating-label">处理及时</view>
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
          <view class="rating-label">回访情况</view>
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

      </view>
    </view>

    <!-- 其他建议 -->
    <view class="section">
      <view class="info-card">
        <view class="section-title">您对于园区的其他建议</view>
        <view class="suggestion-item">
          <view class="suggestion-label">感觉目前园区管理方面不规范？</view>
          <view class="suggestion-input input-placeholder">请填写</view>
        </view>
        <view class="suggestion-item">
          <view class="suggestion-label">感觉目前物业服务有哪些方面存在不足需要改进？</view>
          <view class="suggestion-input input-placeholder">请填写</view>
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

// 评分值数组，初始化为0
const ratingValues = ref(new Array(5).fill(0));

// 设置评分
const setRating = (index, value) => {
  ratingValues.value[index] = value;
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