<template>
  <view class="container">
    <view v-for="item in contractList" :key="item.id" class="warning-item" @click="handleDetailClick(item)">
      <view class="warning-content">
        <view class="warning-title">
          <text>{{ item.contractName }}</text>
          <!-- <text :class="['warning-tag', item.type === 'heTong' ? 'heTong-tag' : 'zhangDan-tag']">{{ item.tag }}</text> -->
          <text class="warning-tag heTong-tag">合同预警</text>

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
import { getContractList, getZhangDanList } from '@/api/park/park';

const warningList = ref([
  {
    id: 1,
    title: '2025年4月账单',
    type: 'zhangDan',
    tag: '账单预警',
    date: '2025.12.12'
  },
  {
    id: 2,
    title: '合同名称1',
    type: 'heTong',
    tag: '合同预警',
    date: '2025.12.12'
  },
  {
    id: 3,
    title: '2025年5月账单',
    type: 'zhangDan',
    tag: '账单预警',
    date: '2025.12.10'
  },

]);
const contractList = ref([]);

// 获取合同列表
function getContract() {
  getContractList({
    pageNum: 1,
    pageSize: 100,
  }).then((res) => {
    contractList.value = res.rows;
  });
}

// 获取账单预警列表
function getZhangDan() {
  getZhangDanList({},{
    pageNum: 1,
    pageSize: 10,
  }).then((res) => {
    warningList.value = res.data.voList;
  });
}

// 处理详情点击事件
const handleDetailClick = (item) => {
  // if (item.type === 'heTong') {
  //   uni.navigateTo({
  //     url: '/pages_info/warning/heTong'
  //   });
  // }else if (item.type === 'zhangDan') {
  //   uni.navigateTo({
  //     url: '/pages_info/warning/zhangDan'
  //   });
  // }
  uni.navigateTo({
    url: '/pages_info/warning/heTong?id=' + item.alertId
  });
}
onMounted(() => {
  getContract();
  // getZhangDan();
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

.warning-tag {
  font-size: 24rpx;
  color: #fff;
  background-color: #4A90E2;
  padding: 6rpx 12rpx;
  border-radius: 8rpx;
  line-height: 1;
}

.heTong-tag {
  background-color: #A11ECD;
}

.zhangDan-tag {
  background-color: #235EFF;
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