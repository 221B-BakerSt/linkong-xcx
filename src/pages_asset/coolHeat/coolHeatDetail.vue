<template>
  <view class="cooling-heating-container">
    <!-- 顶部卡片 -->
    <view class="top-card">
      <view class="top-card-title">餐饮中心</view>
      <view class="top-card-content">
        <text
          >营业时间：晚餐 17:00-18:30；早餐 07:30-09:00；午餐
          11:30-13:00，位于B地块南区1号楼裙房，建筑面积2166㎡，餐位约300个，由郑州航发时代酒店管理有限公司委托运营，服务期5年。提供工作日三餐及周末节假日就餐服务，日均用餐约500人次，采用自助餐形式，设有15元、25元标准及特色档口。</text
        >
      </view>
    </view>

    <!-- 底部卡片 -->
    <view class="bottom-card">
      <view class="info-item">
        <text class="info-label">材料附件：</text>
        <text class="info-value">营业执照1.PDF</text>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-button" @click="handleAddClick">
      <text class="button-text">添加制冷供暖需求</text>
    </view>
  </view>
</template>

<script setup>
const handleAddClick = () => {
  uni.navigateTo({
    url: "/pages_asset/coolHeat/coolHeatAdd",
  });
};
</script>

<style lang="scss" scoped>
.cooling-heating-container {
  width: 375px;
  min-height: 812px;
  background: #f5fbff;
  border-radius: 0px 0px 0px 0px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.top-card {
  background: #ffffff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  width: 81%;
}

.top-card-title {
  width: 307px;
  height: 24px;
  font-family:
    Source Han Sans,
    Source Han Sans;
  font-weight: 400;
  font-size: 18px;
  color: rgba(0, 0, 0, 0.898);
  line-height: 24px;
  text-align: center;
  font-style: normal;
  text-transform: none;
  margin-bottom: 16px;
}

.top-card-content {
  width: 100%;
  font-family:
    Source Han Sans,
    Source Han Sans;
  font-weight: 400;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.898);
  line-height: 24px;
  text-align: left;
  font-style: normal;
  text-transform: none;
  white-space: pre-line;
}

.bottom-card {
  background: #ffffff;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  width: 83%;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-label {
  width: 70px;
  height: 14px;
  font-family:
    Source Han Sans,
    Source Han Sans;
  font-weight: 400;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.9);
  line-height: 14px;
  text-align: left;
  font-style: normal;
  text-transform: none;
}

.info-value {
  width: 94px;
  height: 14px;
  font-family:
    Source Han Sans,
    Source Han Sans;
  font-weight: 400;
  font-size: 14px;
  color: #3b63ff;
  line-height: 14px;
  text-align: left;
  font-style: normal;
  text-transform: none;
  white-space: nowrap;
}

.bottom-button {
  position: fixed;
  bottom: 24px;
  left: 20px;
  right: 20px;
  width: 335px;
  height: 36px;
  background: #235eff;
  border-radius: 18px 18px 18px 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(35, 94, 255, 0.3);
}

.button-text {
  width: 112px;
  height: 14px;
  font-family:
    Source Han Sans,
    Source Han Sans;
  font-weight: 400;
  font-size: 14px;
  color: #ffffff;
  line-height: 14px;
  text-align: center;
  font-style: normal;
  text-transform: none;
}
</style>
