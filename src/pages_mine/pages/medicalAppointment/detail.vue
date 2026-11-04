<template>
  <view class="page">
    <view v-if="loading" class="empty">正在加载预约详情...</view>
    <view v-else-if="!appointment" class="empty">预约记录不存在或无权查看</view>
    <view v-else class="card">
      <view class="header">
        <text class="room">{{ appointment.roomName || '诊疗室' }}</text>
        <text class="status">{{ appointment.status === '1' ? '已预约' : '已取消' }}</text>
      </view>
      <view class="row"><text>诊疗室位置</text><text>{{ appointment.location || '位置待确认' }}</text></view>
      <view class="row"><text>就诊日期</text><text>{{ appointment.bookingDate }}</text></view>
      <view class="row"><text>预约时段</text><text>{{ appointment.timeSlot }}</text></view>
      <view class="row"><text>预约园区</text><text>{{ appointment.parkName || '-' }}</text></view>
      <view class="row"><text>预约人</text><text>{{ appointment.userName || '-' }}</text></view>
      <view class="row"><text>所属部门</text><text>{{ appointment.deptName || '未设置' }}</text></view>
      <view class="remark-title">预约备注</view>
      <view class="remark">{{ appointment.remark || '无备注' }}</view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { medicalAppointmentApi } from '@/api/operations/medicalAppointment';

const appointment = ref(null);
const loading = ref(true);

onLoad(async (options) => {
  try {
    const res = await medicalAppointmentApi.getAppointment(options.appointmentId);
    appointment.value = res.data || null;
  } catch (error) {
    uni.showToast({ title: error?.msg || '详情加载失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.page { min-height: 100vh; padding: 24rpx; background: #f5f7f8; }
.card { padding: 30rpx; background: #fff; border-radius: 18rpx; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20rpx; }
.room { color: #25363a; font-size: 34rpx; font-weight: 600; }
.status { color: #16806f; font-size: 24rpx; }
.row { display: flex; justify-content: space-between; gap: 20rpx; padding: 19rpx 0; border-bottom: 1rpx solid #eef1f2; color: #526a72; font-size: 26rpx; }
.row text:last-child { color: #25363a; text-align: right; }
.remark-title { margin-top: 32rpx; color: #25363a; font-size: 28rpx; font-weight: 600; }
.remark { margin-top: 16rpx; min-height: 90rpx; padding: 22rpx; color: #526a72; background: #f7faf9; border-radius: 12rpx; font-size: 26rpx; overflow-wrap: anywhere; }
.empty { padding: 180rpx 0; color: #a3acad; text-align: center; font-size: 27rpx; }
</style>
