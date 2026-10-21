<template>
  <view class="page-container">
    <view class="meeting-list">
      <view class="meeting-item" v-for="(item, index) in meetingList" :key="index" @click="navigateToDetails(item)">
        <view class="meeting-image-container">
          <image class="meeting-image" :src="item.ossUrls && item.ossUrls.split ? item.ossUrls.split(',')[0] : ''" mode="aspectFill"></image>
         
        </view>
        <view class="meeting-info">
          <text class="meeting-name">{{ item.bankName }}</text>
          <text class="meeting-address">地址：{{ item.address }}</text>
   
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getParkBankList } from '@/api/park/park';

const meetingList = ref([]);

const getList = async () => {
  try {
    const res = await getParkBankList();
    if (res && res.rows) {
      meetingList.value = res.rows;
    }
  } catch (e) {
    uni.showToast({ title: '获取列表失败', icon: 'none' });
  }
};

onMounted(() => {
  getList();
});

function navigateToDetails(item) {
  uni.navigateTo({
    url: '/pages_home/bank/details?bankId=' + item.bankId
  })
}
</script>

<style scoped>
.page-container {
  padding: 30rpx;
  min-height: 100vh;
}

.meeting-list {
  display: flex;
  flex-direction: column;

}

.meeting-item {
  background-color: white;

  display: flex;
  padding: 20rpx;
  align-items: center;
    border-radius:20rpx;
    margin-bottom:20rpx;
}

.meeting-image-container {
  position: relative;
  width: 240rpx;
  height: 180rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.meeting-image {
  width: 100%;
  height: 100%;
  border-radius: 8rpx;
}



.meeting-info {
  flex: 1;
}

.meeting-name {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  margin-bottom: 30rpx;
  color: #000;
}

.meeting-address {
  display: block;
  font-size: 24rpx;
color: rgba(0,0,0,0.6);
  margin-bottom: 10rpx;
}
</style>