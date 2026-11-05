<template>
  <view class="page">
    <view class="hero card"><view class="hero-title">诊疗预约</view></view>
    <view v-if="notices.length" class="notice-strip card" @click="showClosureNotice(notices[0])">
      <text class="notice-badge">停用公告</text>
      <view class="notice-window"><view class="notice-track"><view v-for="copy in 2" :key="copy" class="notice-copy"><text v-for="notice in notices" :key="copy + '-' + notice.closureId" @click.stop="showClosureNotice(notice)">{{ notice.noticeTitle }} · {{ notice.roomName }}　　</text></view></view></view>
      <text class="notice-detail" @click.stop="showClosureNotice(notices[0])">详情 ›</text>
    </view>
    <view class="card date-card">
      <picker mode="date" :value="bookingDate" :start="today()" :end="maxDate()" @change="chooseDate">
        <view class="date-field"><text class="date-label">就诊日期：</text><text class="date-value">{{ bookingDate || '请选择日期' }}</text><text class="date-arrow">›</text></view>
      </picker>
    </view>
    <template v-if="!selectedRoom">
      <view v-for="room in rooms" :key="room.medicalRoomId" class="card room-card" @click="selectRoom(room)">
      <view class="room-header">
        <view class="room-title">{{ room.roomName }}</view>
        <view class="room-location">{{ room.location || '位置待确认' }}</view>
      </view>
      <view class="doctor-line">主治医师：{{ room.attendingDoctor || '待配置' }}</view>
      <view v-if="room.loading" class="loading-text">正在加载可预约情况...</view>
      <view v-else>
        <view class="current-remaining">当前时段余号：<strong>{{ currentSlotRemaining(room) }}</strong></view>
        <view class="room-stats">
          <view><text>可预约时段</text><strong>{{ availableSlotCount(room) }} 个</strong></view>
          <view><text>剩余名额</text><strong>{{ availableSeatCount(room) }} 个</strong></view>
          <view><text>每时段</text><strong>{{ room.capacity }} 人</strong></view>
        </view>
      </view>
      <view class="room-action">点击查看预约时间 <text>→</text></view>
      </view>
    </template>
    <view v-else class="card room-detail">
      <view class="detail-back" @click="backToRooms">‹ 返回诊疗室</view>
      <view class="room-header">
        <view class="room-title">{{ selectedRoom.roomName }}</view>
        <view class="room-location">{{ selectedRoom.location || '位置待确认' }}</view>
      </view>
      <view class="doctor-line">主治医师：{{ selectedRoom.attendingDoctor || '待配置' }} · {{ bookingDate }}</view>
      <view v-if="selectedRoom.loading" class="loading-text">正在加载可预约时段...</view>
      <view v-else class="slot-grid">
        <view v-for="slot in selectedRoom.slots" :key="slot.timeSlot" :class="['slot', selectedSlot === slot.timeSlot && !isSlotExpired(slot) && slot.available && 'selected', (isSlotExpired(slot) || !slot.available) && 'disabled']" @click="selectSlot(selectedRoom, slot)">
          <text class="slot-time">{{ slot.timeSlot }}</text><text class="slot-count">{{ slot.disabledReason || (isSlotExpired(slot) ? "已结束" : slot.available ? "剩余 " + slot.remainingCount : "已满") }}</text>
        </view>
      </view>
      <view v-if="canManage" class="room-action" @click="goManagedRecords(selectedRoom.medicalRoomId)">查看该诊疗室预约情况 <text>→</text></view>
    </view>
    <view v-if="selectedRoom && selectedSlot" class="card confirm-card">
      <view class="selection-title">已选择预约时段</view>
      <view class="selection-value">{{ selectedRoom.roomName }} · {{ bookingDate }} · {{ selectedSlot }}</view>
      <textarea v-model="remark" class="remark" maxlength="200" placeholder="备注（选填）" />
      <button class="primary-btn" :disabled="submitting || selectedSlotExpired" @click="submit">{{ submitting ? '提交中...' : '确认预约' }}</button>
    </view>
    <view class="card link-card" @click="goRecords"><text>查看我的诊疗预约</text><text class="arrow">›</text></view>
    <view v-if="canManage" class="card link-card" @click="goManagedRecords()"><text>查看所有园区预约情况</text><text class="arrow">›</text></view>
  </view>
</template>

<script setup>
import { computed, ref } from "vue";
import { onHide, onLoad, onShow, onUnload } from "@dcloudio/uni-app";
import { medicalAppointmentApi } from "@/api/operations/medicalAppointment";
const rooms = ref([]); const bookingDate = ref(""); const roomId = ref(""); const selectedSlot = ref(""); const remark = ref(""); const submitting = ref(false);
const currentTime = ref(Date.now());
const canManage = ref(false);
const notices = ref([]);
let clockTimer;
const selectedRoom = computed(() => rooms.value.find((room) => String(room.medicalRoomId) === String(roomId.value)));
const selectedSlotExpired = computed(() => {
  const slot = selectedRoom.value?.slots?.find((item) => item.timeSlot === selectedSlot.value);
  return !slot || isSlotExpired(slot);
});
function today() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }
async function loadClosures() { try { const res = await medicalAppointmentApi.getClosures(); notices.value = res.data || res || []; } catch (e) { notices.value = []; } }
function showClosureNotice(notice) {
  const days = notice.closureType === 'WEEKLY' ? '每周' + (notice.weekdays || []).map((day) => ['一', '二', '三', '四', '五', '六', '日'][day - 1] + '、').join('').replace(/、$/, '') :
    notice.closureType === 'MONTHLY' ? '每月' + (notice.monthDays || []).join('日、') + '日' :
    notice.closureType === 'DATES' ? (notice.closureDates || []).join('、') : '立即停用';
  const range = notice.startDate ? '\n生效日期：' + notice.startDate + (notice.endDate ? ' 至 ' + notice.endDate : ' 起') : '';
  uni.showModal({ title: notice.noticeTitle || '诊疗室停用公告', content: (notice.roomName || '') + (notice.location ? '（' + notice.location + '）' : '') + '\n停用日期：' + days + range + '\n' + (notice.noticeContent || ''), showCancel: false, confirmText: '知道了' });
}
function maxDate() { const d = new Date(); d.setDate(d.getDate() + 7); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
async function loadRooms() { try { const res = await medicalAppointmentApi.getRooms(); rooms.value = (res.data || res || []).map((room) => ({ ...room, slots: [], loading: false })); await loadSchedules(); } catch (e) { uni.showToast({ title: e?.msg || "诊疗室加载失败", icon: "none" }); } }
async function loadSchedules() { if (!bookingDate.value) return; await Promise.all(rooms.value.map(async (room) => { room.loading = true; try { const res = await medicalAppointmentApi.getSlots(room.medicalRoomId, bookingDate.value); room.slots = res.data || res || []; } catch (e) { room.slots = []; uni.showToast({ title: e?.msg || `${room.roomName}时段加载失败`, icon: "none" }); } finally { room.loading = false; } })); }
async function chooseDate(event) {
  const date = event.detail.value;
  if (!date || date < today() || date === bookingDate.value) return;
  bookingDate.value = date;
  roomId.value = "";
  selectedSlot.value = "";
  await loadSchedules();
}
function isSlotExpired(slot) {
  if (slot.expired || bookingDate.value !== today()) return Boolean(slot.expired);
  const match = String(slot.timeSlot || '').match(/^(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})$/);
  if (!match) return false;
  const now = new Date(currentTime.value);
  const endMinutes = Number(match[3]) * 60 + Number(match[4]);
  return now.getHours() * 60 + now.getMinutes() >= endMinutes;
}
function availableSlotCount(room) { return room.slots.filter((slot) => slot.available && !isSlotExpired(slot)).length; }
function availableSeatCount(room) { return room.slots.reduce((totalSeats, slot) => totalSeats + (slot.available && !isSlotExpired(slot) ? Number(slot.remainingCount || 0) : 0), 0); }
function currentSlotRemaining(room) {
  if (bookingDate.value !== today()) return '非今日预约';
  const now = new Date(currentTime.value);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const slot = room.slots.find((item) => {
    const match = String(item.timeSlot || '').match(/^(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})$/);
    if (!match) return false;
    const start = Number(match[1]) * 60 + Number(match[2]);
    const end = Number(match[3]) * 60 + Number(match[4]);
    return currentMinutes >= start && currentMinutes < end;
  });
  if (!slot) return '暂无当前时段';
  return slot.disabledReason || (slot.available && slot.remainingCount > 0 ? `${slot.remainingCount} 个` : '已满');
}
function selectRoom(room) { roomId.value = room.medicalRoomId; selectedSlot.value = ""; }
function backToRooms() { roomId.value = ""; selectedSlot.value = ""; }
function selectSlot(room, slot) { if (slot.expired || isSlotExpired(slot) || !slot.available) return; roomId.value = room.medicalRoomId; selectedSlot.value = slot.timeSlot; }
async function submit() { if (!bookingDate.value || !roomId.value || !selectedSlot.value) { uni.showToast({ title: "请选择日期、诊疗室和时段", icon: "none" }); return; } submitting.value = true; try { await medicalAppointmentApi.reserve({ medicalRoomId: roomId.value, bookingDate: bookingDate.value, timeSlot: selectedSlot.value, remark: remark.value }); uni.showToast({ title: "预约成功", icon: "success" }); selectedSlot.value = ""; remark.value = ""; await loadSchedules(); } catch (e) { uni.showToast({ title: e?.msg || "名额已被预约，请刷新后重试", icon: "none" }); await loadSchedules(); } finally { submitting.value = false; } }
function goRecords() { uni.navigateTo({ url: "/pages_mine/pages/medicalAppointment/records" }); }
function goManagedRecords(medicalRoomId) {
  const roomQuery = medicalRoomId ? `&medicalRoomId=${medicalRoomId}` : '';
  uni.navigateTo({ url: `/pages_mine/pages/medicalAppointment/records?mode=managed${roomQuery}` });
}
async function loadManagementScope() {
  try {
    const res = await medicalAppointmentApi.getManagementScope();
    canManage.value = res.data === true;
  } catch (error) {
    canManage.value = false;
  }
}
function stopClock() { if (clockTimer) clearInterval(clockTimer); clockTimer = undefined; }
onLoad(() => { bookingDate.value = today(); loadRooms(); loadClosures(); });
onShow(() => {
  currentTime.value = Date.now();
  loadManagementScope();
  loadClosures();
  if (bookingDate.value && rooms.value.length) loadSchedules();
  stopClock();
  // Update the displayed current slot locally without polling inventory.
  clockTimer = setInterval(() => { currentTime.value = Date.now(); }, 30_000);
});
onHide(stopClock);
onUnload(stopClock);
</script>

<style scoped>
.page { min-height: 100vh; padding: 24rpx; background: #f5f7f8; box-sizing: border-box; }
.card { background: #fff; border-radius: 18rpx; margin-bottom: 20rpx; box-shadow: 0 8rpx 24rpx rgba(42, 64, 78, .05); }
.hero { padding: 34rpx 30rpx; color: #fff; background: linear-gradient(135deg, #278d82, #40b39b); }.hero-title { font-size: 40rpx; font-weight: 600; }
.notice-strip { display: flex; align-items: center; gap: 14rpx; padding: 20rpx 24rpx; overflow: hidden; color: #a62c2c; background: #fff5f5; }
.notice-badge { flex-shrink: 0; padding: 5rpx 10rpx; color: #fff; background: #e34b4b; border-radius: 6rpx; font-size: 21rpx; }
.notice-window { flex: 1; overflow: hidden; white-space: nowrap; }
.notice-track { display: inline-flex; width: max-content; animation: notice-scroll 16s linear infinite; font-size: 24rpx; }
.notice-copy { display: inline-flex; flex-shrink: 0; }
.notice-detail { flex-shrink: 0; color: #c53a3a; font-size: 22rpx; }
@keyframes notice-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.date-card { padding: 30rpx; }
.date-field { display: flex; align-items: center; min-height: 54rpx; font-size: 30rpx; }
.date-label { color: #526a72; }
.date-value { margin-left: 12rpx; color: #25363a; font-weight: 600; }
.date-arrow { margin-left: auto; color: #9ba6a8; }
.room-card { padding: 30rpx; }
.room-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 18rpx; }
.room-title { color: #25363a; font-size: 33rpx; font-weight: 600; }
.room-location { max-width: 60%; color: #25363a; font-size: 31rpx; font-weight: 600; text-align: right; overflow-wrap: anywhere; }
.doctor-line { margin-top: 20rpx; padding: 16rpx 18rpx; color: #526a72; background: #f7fafc; border-radius: 8rpx; font-size: 24rpx; }
.current-remaining { display: flex; justify-content: space-between; margin-top: 22rpx; color: #526a72; font-size: 25rpx; }
.current-remaining strong { color: #188c7b; font-size: 28rpx; }
.room-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12rpx; padding: 24rpx 0 20rpx; }
.room-stats view { padding-right: 10rpx; border-right: 1rpx solid #e7eeee; }
.room-stats view:last-child { border-right: 0; }
.room-stats text, .room-stats strong { display: block; }
.room-stats text { color: #879294; font-size: 21rpx; }
.room-stats strong { margin-top: 8rpx; color: #188c7b; font-size: 28rpx; }
.room-action { padding-top: 18rpx; color: #188c7b; border-top: 1rpx solid #e7eeee; font-size: 24rpx; }
.room-action text { float: right; font-size: 32rpx; }
.room-detail { padding: 30rpx; }
.detail-back { margin-bottom: 22rpx; color: #188c7b; font-size: 25rpx; }
.loading-text { padding: 34rpx 0 10rpx; color: #9ba6a8; text-align: center; font-size: 24rpx; }
.slot-grid { margin-top: 20rpx; }
.slot { display: flex; min-height: 92rpx; flex-direction: column; align-items: center; justify-content: center; gap: 8rpx; padding: 0; }
.slot-time { font-size: 27rpx; font-weight: 600; }
.slot.disabled { color: #a8afb5; background: #f4f5f6; border-color: #e4e7ed; }
.slot.disabled .slot-count { color: #a8afb5; }
.slot.selected { color: #fff; background: #188c7b; border-color: #188c7b; }
.confirm-card { padding: 30rpx; }
.selection-title { color: #697579; font-size: 25rpx; }
.selection-value { margin-top: 12rpx; color: #188c7b; font-size: 29rpx; font-weight: 600; }
</style>
