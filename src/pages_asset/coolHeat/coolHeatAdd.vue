<template>
  <view class="cool-heat-add-container">
    <!-- 企业信息 -->
    <view class="section">
      <view class="section-title">企业信息</view>
      <view class="form-item">
        <text class="label">企业名称</text>
        <text class="value">河南云立方科技有限公司</text>
      </view>
    </view>

    <!-- 供冷制暖需求 -->
    <view class="section">
      <view class="section-title">供冷制暖需求</view>
      <view class="form-item">
        <text class="label">供冷制暖</text>
        <text class="value">供冷 ></text>
      </view>
      <view class="form-item">
        <text class="label">位置</text>
        <text class="value">5#F101 ></text>
      </view>
      <view class="form-item">
        <text class="label">面积(m²)</text>
        <text class="value">请先选择位置</text>
      </view>
      <view class="form-item">
        <text class="label">开始日期</text>
        <text class="value">2025.12.12 ></text>
      </view>
      <view class="form-item">
        <text class="label">结束日期</text>
        <text class="value">2026.3.12 ></text>
      </view>
      <view class="form-item">
        <text class="label">天数</text>
        <text class="value">20</text>
      </view>
    </view>

    <!-- 联系人信息 -->
    <view class="section">
      <view class="section-title">联系人信息</view>
      <view class="form-item">
        <text class="label">联系人</text>
        <text class="value">请输入</text>
      </view>
      <view class="form-item">
        <text class="label">联系电话</text>
        <text class="value">请输入</text>
      </view>
    </view>

    <!-- 确认提交按钮 -->
    <view class="submit-button" @click="handleSubmit">
      <text class="button-text">确认提交</text>
    </view>
  </view>
</template>

<script setup>
const handleSubmit = () => {
  uni.navigateTo({
    url: "/pages_asset/coolHeat/coolHeatSubmit"
  });
};
</script>

<style lang="scss" scoped>
.cool-heat-add-container {
  width: 375px;
  min-height: 100vh;
  background: #F5FBFF;
  padding: 16px;
  padding-bottom: 80px;
}

.section {
  background: #FFFFFF;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  width:83%;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #F0F0F0;
}

.form-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #F0F0F0;
}

.form-item:last-child {
  border-bottom: none;
}

.label {
  font-family: Source Han Sans, Source Han Sans;
font-weight: 400;
font-size: 12px;
color: rgba(0,0,0,0.6);
line-height: 12px;
text-align: left;
font-style: normal;
text-transform: none;
}

.value {
  font-family: Source Han Sans, Source Han Sans;
font-weight: 400;
font-size: 12px;
color: rgba(0,0,0,0.9);
line-height: 12px;
text-align: left;
font-style: normal;
text-transform: none;
}

.submit-button {
  position: fixed;
  bottom: 24px;
  left: 20px;
  right: 20px;
  width: 335px;
  height: 44px;
  background: #235EFF;
  border-radius: 22px 22px 22px 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(35, 94, 255, 0.3);
}

.button-text {
  font-size: 16px;
  color: #FFFFFF;
  font-weight: 500;
  text-align: center;
}
</style>