<template>
  <view class="submit-success-container">
    <view class="content-wrapper">
      <!-- 成功图标 -->
      <view class="success-icon">
        <image
          src="/static/images/icon/park/submit.png"
          mode="aspectFit"
          class="icon-img"
        ></image>
      </view>

      <!-- 成功文字 -->
      <view class="success-text">制冷供暖需求提交完成</view>

      <!-- 按钮容器 -->
      <view class="button-container">
        <view class="list-button" @click="handleBackToList">
          <text class="list-button-text">返回供冷制暖列表</text>
        </view>
        <view class="home-button" @click="handleBackToHome">
          <text class="home-button-text">返回首页</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
const handleBackToList = () => {
  uni.navigateTo({
    url: "/pages_asset/coolHeat/coolHeat",
  });
};

const handleBackToHome = () => {
  uni.switchTab({
    url: "/pages/index",
  });
};
</script>

<style lang="scss" scoped>
.submit-success-container {
  width: 100%;
  min-height: 100%;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100px 20px 0;
  box-sizing: border-box;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  flex: 1;
  justify-content: flex-start;
}

.button-container {
  margin-top: 40px;
  width: 100%;
  max-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.success-icon {
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-img {
  width: 120px;
  height: 120px;
}

.success-text {
  font-size: 18px;
  font-weight: 500;
  color: #333333;
  text-align: center;
  line-height: 24px;
}

.button-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 280px;
}

.list-button {
  width: 100%;
  height: 44px;
  border: 1px solid #235eff;
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
}

.list-button-text {
  font-size: 16px;
  font-weight: 500;
  color: #235eff;
  text-align: center;
}

.home-button {
  width: 100%;
  height: 44px;
  background: #235eff;
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(35, 94, 255, 0.3);
}

.home-button-text {
  font-size: 16px;
  font-weight: 500;
  color: #ffffff;
  text-align: center;
}
</style>
