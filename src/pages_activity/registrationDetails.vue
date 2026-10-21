<template>
  <view class="registration-details-container">
    <!-- 活动报名信息卡片 -->
    <view class="info-card">
      <view class="card-title">活动报名信息</view>
      <view class="info-row">
        <view class="info-label">活动名称</view>
        <view class="info-value">活动1</view>
      </view>
      <view class="info-row">
        <view class="info-label">所在企业</view>
        <view class="info-value">河南云立科技有限公司</view>
      </view>
      <view class="info-row">
        <view class="info-label">姓名</view>
        <view class="info-value">张XX</view>
      </view>
      
      
      
      <view class="info-row">
        <view class="info-label">手机号</view>
        <view class="info-value">17630531212</view>
      </view>
      
      <view class="info-row">
        <view class="info-label">提交时间</view>
        <view class="info-value">2025.12.12 12:00</view>
      </view>
    </view>
  </view>
</template>

<script setup>
// 页面逻辑
</script>

<style lang="scss" scoped>
/* 重置默认样式 */
page {
  margin: 0;
  padding: 0;
  width: 375px;
  height: 812px;
  background: #F5FBFF;
  border-radius: 0px 0px 0px 0px;
}

.registration-details-container {
  width: 100%;
  min-height: 100vh;
  background: #F5FBFF;
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
  font-family: Source Han Sans-Medium, Source Han Sans;
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
