<template>
  <view class="container">

    <view class="list">
      <view v-if="infoList.length === 0" class="empty-state">
        <up-empty mode="data">
        </up-empty>
      </view>
      <view v-else class="item" v-for="(item, index) in infoList" :key="index">
        <view class="item-content" >
          <view class="item-title">{{ item.enterpriseName }}</view>
          <view class="item-time">租赁日期：<text class="time-text">
              {{ item.leaseDate }}
            </text></view>
        </view>
        <view class="item-actions">
          <view class="action-btn report-btn" @click="navigateToReport(item)">
            <text>开始填报</text>
            <up-icon name="arrow-right"></up-icon>
          </view>
          <view class="action-btn record-btn" @click="viewReportRecords(item)">
            <text>填报记录</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 填报记录弹窗 -->
    <up-popup v-model:show="showRecordPopup" mode="bottom" round="20rpx" height="80vh">
      <view class="popup-header">
        <text class="popup-title">{{ currentEnterpriseName }} - 填报记录</text>
        <up-icon name="close" class="close-icon" @click="showRecordPopup = false"></up-icon>
      </view>
      <view class="record-list">
        <view v-if="reportRecords.length === 0" class="empty-record">
          <up-empty mode="data" text="暂无填报记录"></up-empty>
        </view>
        <view v-else class="record-item" v-for="(record, index) in reportRecords" :key="index" @click="detailRecord(record)">
          <view class="record-content">
            <view class="record-title">{{ formatRecordTitle(record.createTime) }}</view>
            <view class="record-time">填报时间：{{ record.createTime || '-' }}</view>
            <view class="record-status" :class="{'status-completed': record.status === '已完成', 'status-pending': record.status === '待完成'}">
              {{ record.status || '-' }}
            </view>
          </view>
        </view>
      </view>
    </up-popup>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { onShow } from '@dcloudio/uni-app';

import { corporateList,getCorporateList } from '@/api/park/park';

const infoList = ref([]);
const showRecordPopup = ref(false);
const currentEnterpriseName = ref('');
const reportRecords = ref([]);

const navigateToReport = (item) => {
  uni.navigateTo({
    url: '/pages_info/info/report1?id=' + item.id
  })
};

// 详情
const detailRecord = (record) => {
  uni.navigateTo({
    url: '/pages_info/info/detail?id=' + record.id
  })
}



// 格式化记录标题
const formatRecordTitle = (createTime) => {
  if (!createTime) return '填报记录';
  
  // 处理 iOS 兼容性问题，将 "yyyy-MM-dd HH:mm:ss" 格式转换为 "yyyy/MM/dd HH:mm:ss"
  const iosCompatibleTime = createTime.replace(/-/g, '/');
  const date = new Date(iosCompatibleTime);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  
  return `${year}年${month}月 填报记录`;
};

// 查看填报记录
const viewReportRecords = async (item) => {
  try {
    const res = await getCorporateList({
      enterpriseId: item.id
    });
    currentEnterpriseName.value = item.enterpriseName;
    reportRecords.value = res.rows || [];
  } catch (e) {
    uni.showToast({ title: '获取填报记录失败', icon: 'none' });
  } finally {
    showRecordPopup.value = true;
  }
};

//查询企业基础信息列表
const fetchInfoList = async () => {
  try {
    const res = await corporateList();
    infoList.value = res.rows || [];
  } catch (e) {
    uni.showToast({ title: '获取企业基础信息失败', icon: 'none' });
  }
};
onMounted(() => {
  fetchInfoList();
});
onShow(() => {
  fetchInfoList();
});
</script>

<style scoped lang="scss">
.container {
  flex: 1;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.list {
  padding: 16px;

  .empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

    .empty-text {
      font-size: 14px;
      color: #999;
    }
  }

  .item {
    background-color: #fff;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

    .item-content {
      margin-bottom: 12px;
      cursor: pointer;

      .item-title {
        font-size: 16px;
        font-weight: 500;
        color: #333;
        margin-bottom: 8px;
      }

      .item-time {
        font-size: 14px;
        color: #999;

        .time-text {
          font-size: 14px;
          color: #235EFF;
        }
      }
    }

    .item-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding-top: 12px;
      border-top: 1px solid #f0f0f0;

      .action-btn {
        display: flex;
        align-items: center;
        padding: 6px 12px;
        border-radius: 4px;
        font-size: 14px;
        cursor: pointer;

        &.report-btn {
          background-color: #e6f1ff;
          color: #235EFF;

          .up-icon {
            margin-left: 4px;
          }
        }

        &.record-btn {
          background-color: #f5f5f5;
          color: #666;
        }
      }
    }
  }
}

/* 填报记录弹窗样式 */
.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  border-bottom: 1px solid #f0f0f0;

  .popup-title {
    font-size: 28rpx;
    font-weight: 500;
    color: #333;
  }

  .close-icon {
    font-size: 32rpx;
    color: #999;
    cursor: pointer;
  }
}

.record-list {
  padding: 20rpx;
  height: calc(80vh - 80rpx);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  .empty-record {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300rpx;
  }

  .record-item {
    background-color: #f9f9f9;
    padding: 20rpx;
    border-radius: 8rpx;
    margin-bottom: 16rpx;

    .record-content {
      .record-title {
        font-size: 26rpx;
        font-weight: 500;
        color: #333;
        margin-bottom: 8rpx;
      }

      .record-time {
        font-size: 22rpx;
        color: #999;
        margin-bottom: 8rpx;
      }

      .record-status {
        font-size: 22rpx;
        padding: 4rpx 12rpx;
        border-radius: 12rpx;
        display: inline-block;

        &.status-completed {
          background-color: rgba(47, 194, 91, 0.1);
          color: #2FC25B;
        }

        &.status-pending {
          background-color: rgba(234, 0, 0, 0.1);
          color: #EA0000;
        }
      }
    }
  }
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 20rpx 70rpx 20rpx;
  background-color: #FFF;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  border-radius: 20rpx;

  .btn-primary {
    width: 100%;
    height: 80rpx;
    background-color: #235EFF;
    color: #FFFFFF;
    font-size: 28rpx;
    border-radius: 36rpx;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn-primary::after {
    border: none;
  }
}
</style>
