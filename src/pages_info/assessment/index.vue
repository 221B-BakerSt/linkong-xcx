<template>
  <view class="container">
    <view class="list">
      <view
        v-for="item in infoList"
        :key="item.assessmentId"
        class="item"
        @click="navigateToReport(item)"
      >
        <view class="item-content">
          <view class="item-title">{{ item.assessmentTitle }}</view>
          <view class="item-time">填报时间：<text class="time-text">{{ formatDate(item.createTime) }}</text></view>
        </view>
        <view class="item-status" :class="{ 'status-pending': !item.isSubmitted, 'status-completed': item.isSubmitted }">
          {{ item.isSubmitted ? '已申报' : '未申报' }}
          <up-icon name="arrow-right"></up-icon>
        </view>
      </view>

      <!-- 空状态提示 -->
      <view v-if="infoList.length === 0" class="empty-state">
        <text>暂无任务</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getEnterpriseAssessmentList } from '@/api/info/assessment';

// 任务列表数据
const infoList = ref([]);

// 分页参数
const pageNum = ref(1);
const pageSize = ref(10);

// 获取任务列表
const getTaskListApi = async () => {
  try {
    const res = await getEnterpriseAssessmentList({
      pageNum: pageNum.value,
      pageSize: pageSize.value
    });

    if (res && res.rows) {
      infoList.value = res.rows.map(item => ({
        ...item,
        isSubmitted: !!item.submitTime  // 根据提交时间判断是否已申报
      }));
    }
  } catch (e) {
    console.error('获取任务列表失败:', e);
    uni.showToast({ title: '加载失败', icon: 'none' });
  }
};

// 格式化日期（仅显示年月日时分）
const formatDate = (timeStr) => {
  if (!timeStr) return '';
  // 替换 T 为空格，并截取到分钟
  return timeStr.replace('T', ' ').substring(0, 16);
};

// 点击跳转
const navigateToReport = (item) => {
  console.log('点击了任务项:', item);

  if (!item.isSubmitted) {
    // 未申报 - 跳转到填报页面
    uni.navigateTo({
      url: `/pages_info/assessment/add?assessmentId=${item.assessmentId}`,
      success: () => {
        console.log('导航到填报页面成功');
      },
      fail: (err) => {
        console.log('导航到填报页面失败:', err);
      }
    });
  } else {
    // 已申报 - 跳转到详情页面
    uni.navigateTo({
      url: `/pages_info/assessment/details?assessmentId=${item.assessmentId}`,
      success: () => {
        console.log('导航到详情页面成功');
      },
      fail: (err) => {
        console.log('导航到详情页面失败:', err);
      }
    });
  }
};

onMounted(() => {
  getTaskListApi();
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
  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    .item-content {
      flex: 1;
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
    .item-status {
      display: flex;
      align-items: center;
      font-size: 14px;

      &.status-pending {
        color: #EA0000;
      }
      &.status-completed {
        color: #2FC25B;
      }
    }
  }

  .empty-state {
    text-align: center;
    padding: 40px 0;
    color: #999999;
    font-size: 14px;
  }
}
</style>
