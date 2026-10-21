<template>
  <view class="container">
    <view v-for="item in contractList" :key="item.id" class="warning-item" @click="handleDetailClick(item)">
      <view class="warning-content">
        <view class="warning-title">
          <text>{{ item.roomName }}</text>
        </view>
        <text class="warning-date">{{ item.createTime }}</text>
      </view>
      <view class="warning-detail">
        <text>详情</text>
        <up-icon  name="arrow-right" size="12" color="rgba(0,0,0,0.6)"></up-icon>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {  getHouseReserveList } from '@/api/park/park';

const contractList = ref([]);

// 获取房源预约列表
function getList() {
  getHouseReserveList({
    orderByColumn: 'createTime',
    isAsc: 'desc',
  }).then((res) => {
    contractList.value = res.rows;
  });
}



// 处理详情点击事件
const handleDetailClick = (item) => {
  uni.navigateTo({
    url: '/pages_home/house/appointmentDetails?id=' + item.id
  });
}
onMounted(() => {
  getList();
});
</script>

<style scoped lang="scss">
.container {
  flex: 1;
  background-color: #f5f5f5;
  min-height: 100vh;
  padding: 20rpx;
}

.warning-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.warning-content {
  flex: 1;
}

.warning-title {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
}

.warning-title text:first-child {
font-size: 28rpx;
  font-weight: 550;
  color: #333;
  margin-right: 16rpx;
}



.warning-date {
  font-size: 28rpx;
  color: #999;
}

.warning-detail {
  display: flex;
  align-items: center;
  color: #999;
  font-size: 28rpx;
}


</style>