<template>
  <view class="page">
    <view class="title">诊疗预约记录</view>
    <view v-if="canManage" class="tabs">
      <view :class="['tab', tab === 'mine' && 'selected']" @click="changeTab('mine')">我的预约</view>
      <view :class="['tab', tab === 'managed' && 'selected']" @click="changeTab('managed')">所有园区预约</view>
    </view>
    <view v-if="tab === 'managed'" class="filters card">
      <picker mode="date" :value="filterDate" @change="changeDate">
        <view class="filter-row"><text>就诊日期</text><text>{{ filterDate || '全部日期' }}　›</text></view>
      </picker>
      <view v-if="filterDate" class="filter-row" @click="clearDate"><text>日期范围</text><text>查看全部日期</text></view>
      <picker :range="roomOptions" range-key="roomName" @change="changeRoom">
        <view class="filter-row"><text>诊疗室</text><text>{{ selectedRoomName }}　›</text></view>
      </picker>
    </view>
    <view v-if="!loading && !records.length" class="empty">暂无诊疗预约记录</view>
    <view v-for="item in records" :key="item.appointmentId" class="card record" @click="openDetail(item)">
      <view class="row">
        <text class="room">{{ item.roomName || '诊疗室' }}</text>
        <text :class="['status', item.status === '1' && canCancel(item) ? 'active' : 'ended']">
          {{ item.status === '1' ? (canCancel(item) ? '已预约' : '时段已结束') : '已取消' }}
        </text>
      </view>
      <view class="line">{{ item.bookingDate }}　{{ item.timeSlot }}</view>
      <view class="line muted">{{ item.location || '位置待确认' }} · {{ item.parkName || '所属园区' }}</view>
      <view class="line muted">预约人：{{ item.userName || '-' }}　部门：{{ item.deptName || '未设置' }}</view>
      <view v-if="item.cancelReason" class="cancel-warning">{{ item.cancelReason }}</view>
      <view class="detail-link">查看详情与备注　›</view>
      <button v-if="tab === 'mine' && canCancel(item)" class="cancel-btn" :disabled="cancellingId === item.appointmentId" @click.stop="cancel(item)">
        {{ cancellingId === item.appointmentId ? '取消中...' : '取消预约' }}
      </button>
    </view>
    <view v-if="loading" class="load-state">正在加载...</view>
    <view v-else-if="records.length" class="load-state">
      已显示 {{ records.length }} / {{ total }} 条
      <text v-if="hasMore" class="more-link" @click="loadMore">　加载更多 ›</text>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue';
import { onHide, onLoad, onPullDownRefresh, onReachBottom, onShow, onUnload } from '@dcloudio/uni-app';
import { medicalAppointmentApi } from '@/api/operations/medicalAppointment';

const records = ref([]);
const loading = ref(false);
const cancellingId = ref(null);
const currentTime = ref(Date.now());
const canManage = ref(false);
const tab = ref('mine');
const filterDate = ref('');
const selectedRoomId = ref(null);
const roomOptions = ref([{ medicalRoomId: null, roomName: '全部诊疗室' }]);
const selectedRoomName = computed(() => roomOptions.value.find(room => String(room.medicalRoomId) === String(selectedRoomId.value))?.roomName || (selectedRoomId.value ? '当前诊疗室' : '全部诊疗室'));
const pageNum = ref(1);
const hasMore = ref(false);
const total = ref(0);
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

async function loadMore() {
  if (loading.value || (pageNum.value > 1 && !hasMore.value)) return;
  loading.value = true;
  try {
    const params = { pageNum: pageNum.value, pageSize: 50 };
    if (tab.value === 'managed') {
      if (filterDate.value) params.bookingDate = filterDate.value;
      if (selectedRoomId.value) params.medicalRoomId = selectedRoomId.value;
    }
    const res = tab.value === 'managed'
      ? await medicalAppointmentApi.getAppointments(params)
      : await medicalAppointmentApi.getMyAppointments(params);
    const rows = res.rows || res.data?.rows || [];
    records.value = pageNum.value === 1 ? rows : [...records.value, ...rows];
    total.value = Number(res.total ?? res.data?.total ?? rows.length);
    hasMore.value = records.value.length < total.value;
    pageNum.value += 1;
  } catch (error) {
    uni.showToast({ title: error?.msg || '记录加载失败', icon: 'none' });
  } finally {
    currentTime.value = Date.now();
    loading.value = false;
  }
}

function reload() {
  pageNum.value = 1;
  hasMore.value = false;
  total.value = 0;
  records.value = [];
  return loadMore();
}

async function loadScope() {
  try {
    const res = await medicalAppointmentApi.getManagementScope();
    canManage.value = res.data === true;
    if (!canManage.value) tab.value = 'mine';
    if (canManage.value) {
      try {
        const rooms = await medicalAppointmentApi.getRooms();
        roomOptions.value = [{ medicalRoomId: null, roomName: '全部诊疗室' }, ...(rooms.data || [])];
      } catch (error) {
        roomOptions.value = [{ medicalRoomId: null, roomName: '全部诊疗室' }];
      }
    }
  } catch (error) {
    canManage.value = false;
    tab.value = 'mine';
  }
}

function changeTab(nextTab) { if (tab.value !== nextTab) { tab.value = nextTab; reload(); } }
function changeDate(event) { filterDate.value = event.detail.value; reload(); }
function clearDate() { if (filterDate.value) { filterDate.value = ''; reload(); } }
function changeRoom(event) { selectedRoomId.value = roomOptions.value[Number(event.detail.value)]?.medicalRoomId ?? null; reload(); }
function openDetail(item) { uni.navigateTo({ url: `/pages_mine/pages/medicalAppointment/detail?appointmentId=${item.appointmentId}` }); }

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
        await reload();
        uni.showToast({ title: '已取消', icon: 'success' });
      } catch (error) {
        uni.showToast({ title: error?.msg || '取消失败', icon: 'none' });
      } finally {
        cancellingId.value = null;
      }
    },
  });
}

function stopClock() { if (clockTimer) clearInterval(clockTimer); clockTimer = undefined; }
onLoad((options) => {
  if (options.mode === 'managed') tab.value = 'managed';
  if (options.medicalRoomId) selectedRoomId.value = options.medicalRoomId;
});
onShow(async () => {
  currentTime.value = Date.now();
  await loadScope();
  await reload();
  stopClock();
  clockTimer = setInterval(() => { currentTime.value = Date.now(); }, 30_000);
});
onPullDownRefresh(async () => { await reload(); uni.stopPullDownRefresh(); });
onReachBottom(() => { if (hasMore.value) loadMore(); });
onHide(stopClock);
onUnload(stopClock);
</script>

<style scoped>
.page { min-height: 100vh; padding: 28rpx 24rpx; background: #f5f7f8; }
.title { margin: 8rpx 4rpx 24rpx; color: #25363a; font-size: 36rpx; font-weight: 600; }
.card { margin-bottom: 20rpx; padding: 28rpx; background: #fff; border-radius: 16rpx; }
.tabs { display: flex; gap: 16rpx; margin-bottom: 20rpx; }
.tab { flex: 1; padding: 20rpx 10rpx; text-align: center; color: #526a72; background: #fff; border-radius: 12rpx; font-size: 26rpx; }
.tab.selected { color: #fff; background: #188c7b; font-weight: 600; }
.filter-row { display: flex; justify-content: space-between; padding: 18rpx 0; color: #526a72; font-size: 25rpx; border-bottom: 1rpx solid #eef1f2; }
.filter-row:last-child { border-bottom: 0; }
.row { display: flex; justify-content: space-between; align-items: center; gap: 12rpx; }
.room { color: #25363a; font-size: 31rpx; font-weight: 600; }
.status { padding: 7rpx 14rpx; border-radius: 999rpx; font-size: 22rpx; white-space: nowrap; }
.active { color: #16806f; background: #e1f6f0; }
.ended { color: #9ba4a5; background: #f0f2f2; }
.line { margin-top: 16rpx; color: #536468; font-size: 25rpx; }
.muted { color: #8b9698; font-size: 23rpx; }
.detail-link { margin-top: 20rpx; color: #16806f; font-size: 24rpx; text-align: right; }
.cancel-warning { margin-top: 14rpx; padding: 16rpx 18rpx; color: #b42318; background: #fff1f0; border: 1rpx solid #ffd6d2; border-radius: 10rpx; font-size: 24rpx; }
.cancel-btn { width: 160rpx; height: 62rpx; margin: 22rpx 0 0 auto; color: #b85e55; background: #fff3f1; border: 0; border-radius: 10rpx; font-size: 24rpx; line-height: 62rpx; }
.empty, .load-state { padding: 50rpx 0; color: #a3acad; text-align: center; font-size: 27rpx; }
.more-link { color: #16806f; }
</style>
