<template>
  <view class="cool-heat-container">
    <!-- 需求列表 -->
    <view class="需求列表" v-for="(item, index) in demandList" :key="index">
      <view class="demand-card">
        <text class="detail-text" @click="handleDetailClick">详情 ></text>
        <view class="card-content">
          <view class="card-header">
            <text class="content-title">{{ item.title }}</text>
          </view>
          <view class="card-footer">
            <text class="date-text">{{ item.date }}</text>
            <text class="status-text">{{ item.status }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-button" @click="handleAddClick">
      <text class="button-text">+ 新增需求</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";

const demandList = ref([
  { title: "供暖", date: "2025.12.12"},
  { title: "供暖", date: "2025.12.12"},
  { title: "供暖", date: "2025.12.12"},
  { title: "供暖", date: "2025.12.12"},
]);

const handleDetailClick = () => {
  uni.navigateTo({
    url: "/pages_asset/coolHeat/coolHeatDetail"
  });
};

const handleAddClick = () => {
  uni.navigateTo({
    url: "/pages_asset/coolHeat/coolHeatAdd"
  });
};
</script>

<style lang="scss" scoped>
.cool-heat-container {
  width: 375px;
  min-height: 812px;
  background: #F5FBFF;
  border-radius: 0px 0px 0px 0px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 80px;
}

.demand-card {
  width: 83%;
  height: 42px;
  background: #FFFFFF;
  border-radius: 10px 10px 10px 10px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: relative;
}

.card-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-text {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
}

.content-title {
  width: 28px;
  height: 12px;
  font-family: Source Han Sans, Source Han Sans;
  font-weight: 500;
  font-size: 14px;
  color: #333333;
  line-height: 12px;
  text-align: left;
  font-style: normal;
  text-transform: none;
}

.detail-text {
  width: 40px;
  height: 12px;
  font-family: Source Han Sans, Source Han Sans;
  font-weight: 400;
  font-size: 12px;
  color: rgba(0,0,0,0.6);
  line-height: 12px;
  text-align: right;
  font-style: normal;
  text-transform: none;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.date-text {
  width: 60px;
  height: 12px;
  font-family: Source Han Sans, Source Han Sans;
  font-weight: 400;
  font-size: 12px;
  color: rgba(0,0,0,0.6);
  line-height: 12px;
  text-align: left;
  font-style: normal;
  text-transform: none;
}

.status-text {
  font-family: Source Han Sans, Source Han Sans;
  font-weight: 400;
  font-size: 12px;
  color: rgba(0,0,0,0.6);
  line-height: 12px;
  text-align: right;
  font-style: normal;
  text-transform: none;
}

.bottom-button {
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
  font-family: Source Han Sans, Source Han Sans;
  font-weight: 400;
  font-size: 14px;
  color: #FFFFFF;
  line-height: 14px;
  text-align: center;
  font-style: normal;
  text-transform: none;
}
</style>