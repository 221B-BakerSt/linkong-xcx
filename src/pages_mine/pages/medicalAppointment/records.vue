<template>
  <view class="page">
    <view class="title">我的诊疗预约</view>
    <view v-if="!loading && !records.length" class="empty">暂无诊疗预约记录</view>
    <view v-for="item in records" :key="item.appointmentId" class="card">
      <view class="row">
        <text class="room">{{ item.roomName || '诊疗室' }}</text>
        <text :class="['status', item.status === '1' ? 'active' : 'cancelled']">
          {{ item.status === '1' ? (canCancel(item) ? '已预约' : '时段已结束') : '已取消' }}
        </text>
      </view>
      <view class="line">{{ item.bookingDate }}　{{ item.timeSlot }}</view>
      <view class="line muted">{{ item.location || '位置待确认' }} · {{ item.parkName || '所属园区' }}</view>
      <view class="line muted">预约人：{{ item.userName || '-' }}　部门：{{ item.deptName || '未设置' }}</view>
      <button v-if="canCancel(item)" class="cancel-btn" :disabled="cancellingId === item.appointmentId" @click="cancel(item)">
        {{ cancellingId === item.appointmentId ? '取消中...' : '取消预约' }}
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onHide, onShow, onUnload } from '@dcloudio/uni-app';
import { medicalAppointmentApi } from '@/api/operations/medicalAppointment';

const records = ref([]);
const loading = ref(false);
const cancellingId = ref(null);
const currentTime = ref(Date.now());
let clockTimer;

function slotEndTime(item) {
  const date = String(item.bookingDate || '').match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  const slot = String(item.timeSlot || '').match(/^(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})$/);
  if (!date || !slot) return null;
  const end = new Date(Number(date[1]), Number(date[2]) - 1, Number(date[3]), Number(slot[3]), Number(slot[4]));
  return Number.isNaN(end.getTime()) ? null : end.getTime();
}

function canCancel(item) {
  const endTime = slotEndTime(item);
  return item.status === '1' && endTime !== null && currentTime.value < endTime;
}

async function load() {
  loading.value = true;
  try {
    const res = await medicalAppointmentApi.getMyAppointments({ pageNum: 1, pageSize: 100 });
    records.value = res.rows || res.data?.rows || [];
  } catch (e) {
    uni.showToast({ title: e?.msg || '记录加载失败', icon: 'none' });
  } finally {
    currentTime.value = Date.now();
    loading.value = false;
  }
}

function cancel(item) {
  currentTime.value = Date.now();
  if (cancellingId.value || !canCancel(item)) return;
  uni.showModal({
    title: '取消预约',
    content: '确定取消这条诊疗预约吗？',
    success: async (res) => {
      currentTime.value = Date.now();
      if (!res.confirm || !canCancel(item)) return;
      cancellingId.value = item.appointmentId;
      try {
        await medicalAppointmentApi.cancel(item.appointmentId);
        await load();
        uni.showToast({ title: '已取消', icon: 'success' });
      } catch (e) {
        uni.showToast({ title: e?.msg || '取消失败', icon: 'none' });
      } finally {
        cancellingId.value = null;
      }
    },
  });
}

function stopClock() {
  if (clockTimer) clearInterval(clockTimer);
  clockTimer = undefined;
}

onShow(() => {
  currentTime.value = Date.now();
  load();
  stopClock();
  // Only update the local clock; appointment inventory is not polled.
  clockTimer = setInterval(() => { currentTime.value = Date.now(); }, 30_000);
});
onHide(stopClock);
onUnload(stopClock);
</script>

<style scoped>
.page { min-height: 100vh; padding: 28rpx 24rpx; background: #f5f7f8; }
.title { margin: 8rpx 4rpx 24rpx; color: #25363a; font-size: 36rpx; font-weight: 600; }
.card { margin-bottom: 20rpx; padding: 28rpx; background: #fff; border-radius: 16rpx; }
.row { display: flex; justify-content: space-between; align-items: center; }
.room { color: #25363a; font-size: 31rpx; font-weight: 600; }
.status { padding: 7rpx 14rpx; border-radius: 999rpx; font-size: 22rpx; }
.active { color: #16806f; background: #e1f6f0; }
.cancelled { color: #9ba4a5; background: #f0f2f2; }
.line { margin-top: 16rpx; color: #536468; font-size: 25rpx; }
.muted { color: #8b9698; font-size: 23rpx; }
.cancel-btn { width: 160rpx; height: 62rpx; margin: 22rpx 0 0 auto; color: #b85e55; background: #fff3f1; border: 0; border-radius: 10rpx; font-size: 24rpx; line-height: 62rpx; }
.empty { padding: 180rpx 0; color: #a3acad; text-align: center; font-size: 27rpx; }
</style>
