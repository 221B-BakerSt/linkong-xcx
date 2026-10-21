<template>
  <view class="satisfaction-container">
    <!-- 调查列表 -->
    <view class="survey-list">
      <!-- 2025园区马拉松 -->
      <view
        class="survey-item"
        :data-status="'expired'"
        @click="handleSurveyClick"
      >
        <view class="survey-header">
          <view class="survey-title">公告标题1</view>
          <view class="survey-status expired">详情 ></view>
        </view>
        <view class="survey-footer">
          <view class="survey-deadline-date">2025.12.12</view>
        </view>
      </view>

      <!-- 2025园区马拉松 -->
      <view
        class="survey-item"
        :data-status="'expired'"
        @click="handleSurveyClick"
      >
        <view class="survey-header">
          <view class="survey-title">公告标题1</view>
          <view class="survey-status expired">详情 ></view>
        </view>
        <view class="survey-footer">
          <view class="survey-deadline-date">2025.12.12</view>
        </view>
      </view>

      <!-- 2023年度问卷调查 -->
      <view
        class="survey-item"
        :data-status="'expired'"
        @click="handleSurveyClick"
      >
        <view class="survey-header">
          <view class="survey-title">公告标题1</view>
          <view class="survey-status expired">详情 ></view>
        </view>
        <view class="survey-footer">
          <view class="survey-deadline-date">2025.12.12</view>
        </view>
      </view>

      <!-- 2022年度问卷调查 -->
      <view
        class="survey-item"
        :data-status="'expired'"
        @click="handleSurveyClick"
      >
        <view class="survey-header">
          <view class="survey-title">公告标题1</view>
          <view class="survey-status expired">详情 ></view>
        </view>
        <view class="survey-footer">
          <view class="survey-deadline-date">2025.12.12</view>
        </view>
      </view>

      <!-- 2021年度问卷调查 -->
      <view
        class="survey-item"
        :data-status="'expired'"
        @click="handleSurveyClick"
      >
        <view class="survey-header">
          <view class="survey-title">公告标题1</view>
          <view class="survey-status expired">详情 ></view>
        </view>
        <view class="survey-footer">
          <view class="survey-deadline-date">2025.12.12</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
// 页面逻辑

// 处理调查项点击
const handleSurveyClick = (event) => {
  uni.navigateTo({
    url: "/pages_notice/noticeDetails",
    success: () => {
      console.log("导航成功");
    },
    fail: (err) => {
      console.log("导航失败:", err);
    },
  });
};
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
  color: rgba(0, 0, 0, 0.6);
  line-height: 12px;
  text-align: left;
  font-style: normal;
  text-transform: none;
}
</style>
