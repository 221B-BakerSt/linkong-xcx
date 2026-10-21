<template>
  <view class="registration-container">
    <!-- 活动信息卡片 -->
    <view class="info-card">
      <view class="card-title">活动信息</view>
      <view class="info-row">
        <view class="info-label">活动名称</view>
        <view class="info-value">2025园区马拉松</view>
      </view>
      <view class="info-row">
        <view class="info-label">截止日期</view>
        <view class="info-value">2025.12.12</view>
      </view>
    </view>

    <!-- 个人信息卡片 -->
    <view class="info-card">
      <view class="card-title">个人信息</view>
      <view class="info-row">
        <view class="info-label">所在企业</view>
        <view class="info-input placeholder">请填写</view>
      </view>
      <view class="info-row">
        <view class="info-label">姓名</view>
        <view class="info-value">张XX</view>
      </view>
      
      
      
      <view class="info-row">
        <view class="info-label">手机号</view>
        <view class="info-input placeholder">请填写</view>
      </view>
      
    </view>

    <!-- 确认报名按钮 -->
    <view class="submit-button">
      <button type="primary" @click="confirmRegistration">确认报名</button>
    </view>
  </view>
</template>

<script setup>
// 确认报名
const confirmRegistration = () => {
  // 这里可以添加提交逻辑
  uni.showToast({
    title: '报名成功',
    icon: 'success'
  });
  // 可以跳转到成功页面或返回上一页
  uni.navigateTo({
      url: "/pages_activity/registrationSubmit",
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
  width: 375px;
  height: 812px;
  background: #F5FBFF;
  border-radius: 0px 0px 0px 0px;
}

.registration-container {
  width: 100%;
  min-height: 100vh;
  background: #F5FBFF;
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

.info-input {
  flex: 1;
  font-size: 14px;
  color: #333333;
  text-align: right;
  padding: 8px 0;
}

.placeholder {
  color: #999999;
}

.selectable {
  color: #235EFF;
  cursor: pointer;
}

.submit-button {
  margin-top: 24px;
  margin-bottom: 32px;
}

.submit-button button {
  width: 100%;
  height: 48px;
  background: #235EFF;
  color: #ffffff;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 500;
}
</style>
