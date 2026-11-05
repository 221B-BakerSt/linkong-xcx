<template>
  <view class="page">
    <view v-if="loading" class="state">正在加载公告详情…</view>
    <view v-else-if="!notices.length" class="state">当前没有正在生效的停诊公告</view>
    <view v-else v-for="notice in notices" :key="notice.closureId" class="notice-card">
      <view class="notice-heading">
        <text class="notice-mark">停诊公告</text>
        <text class="notice-status active">生效中</text>
      </view>
      <view class="notice-title">{{ notice.noticeTitle || '诊疗室暂停接诊通知' }}</view>
      <view class="room-name">{{ notice.roomName || '诊疗室' }}</view>
      <view class="info-row"><text class="label">诊疗室位置</text><text class="value">{{ notice.location || '位置待确认' }}</text></view>
      <view class="info-row"><text class="label">主治医师</text><text class="value">{{ notice.attendingDoctor || '待配置' }}</text></view>
      <view class="info-row"><text class="label">暂停接诊时间</text><text class="value">{{ timingText }}</text></view>
      <view class="reason-title">暂停原因</view>
      <view class="reason-content">{{ notice.noticeContent || '请留意后续公告。' }}</view>
      <view class="apology">由此给您带来的不便，敬请谅解。</view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { medicalAppointmentApi } from '@/api/operations/medicalAppointment';

const notices = ref([]);
const loading = ref(true);
function timingText(item) {
  const start = item.startDate || '立即';
  const end = item.endDate ? '至 ' + item.endDate : '起，持续生效';
  if (item.closureType === 'WEEKLY') {
    const days = ['一', '二', '三', '四', '五', '六', '日'];
    const weekdays = (item.weekdays || []).map((day) => days[Number(day) - 1]).filter(Boolean).join('、');
    return weekdays ? '每周' + weekdays + '，' + start + end : start + end;
  }
  if (item.closureType === 'MONTHLY') return '每月' + (item.monthDays || []).join('日、') + '日，' + start + end;
  if (item.closureType === 'DATES') {
    const dates = (item.closureDates || []).join('、');
    return item.endDate ? dates + '（公告有效期：' + start + '至 ' + item.endDate + '）' : dates;
  }
  return start + end;
}

onLoad(async () => {
  try {
    const result = await medicalAppointmentApi.getClosures();
    notices.value = result.data || result || [];
  } catch (error) {
    uni.showToast({ title: error?.msg || '公告详情加载失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.page { min-height: 100vh; box-sizing: border-box; padding: 28rpx 24rpx; background: #f5f7f8; }
.notice-card { margin-bottom: 22rpx; padding: 32rpx 28rpx; background: #fff; border-radius: 18rpx; box-shadow: 0 8rpx 24rpx rgba(42, 64, 78, .05); }
.notice-heading { display: flex; align-items: center; justify-content: space-between; }
.notice-mark { padding: 8rpx 14rpx; color: #fff; background: #e34b4b; border-radius: 8rpx; font-size: 22rpx; }
.notice-status { font-size: 23rpx; }
.notice-status.active { color: #c53a3a; }
.notice-status.inactive { color: #8b9698; }
.notice-title { margin-top: 28rpx; color: #25363a; font-size: 34rpx; font-weight: 700; line-height: 1.5; }
.room-name { margin: 30rpx 0 12rpx; color: #25363a; font-size: 30rpx; font-weight: 600; }
.info-row { display: flex; justify-content: space-between; gap: 24rpx; padding: 20rpx 0; border-bottom: 1rpx solid #eef1f2; font-size: 25rpx; }
.label { flex-shrink: 0; color: #879294; }
.value { color: #25363a; text-align: right; }
.reason-title { margin-top: 30rpx; color: #25363a; font-size: 27rpx; font-weight: 600; }
.reason-content { margin-top: 14rpx; padding: 22rpx; color: #a62c2c; background: #fff5f5; border-radius: 12rpx; font-size: 26rpx; line-height: 1.7; overflow-wrap: anywhere; }
.apology { margin-top: 24rpx; color: #879294; text-align: center; font-size: 23rpx; }
.state { padding: 180rpx 20rpx; color: #879294; text-align: center; font-size: 27rpx; }
</style>
