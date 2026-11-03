<template>
  <view class="page">
    <view class="hero card"><view class="hero-title">诊疗预约</view><view class="hero-desc">A/C 园区共享诊疗室，名额按诊疗室和时段统一管理</view></view>
    <view class="card date-card">
      <view class="section-title">预约日期</view>
      <view class="field" @click="chooseDate"><text class="label">就诊日期</text><text class="value">{{ bookingDate || '请选择日期' }}</text><text class="arrow">›</text></view>
    </view>
    <template v-if="!selectedRoom">
      <view v-for="room in rooms" :key="room.medicalRoomId" class="card room-card" @click="selectRoom(room)">
      <view class="room-header">
        <view><view class="room-title">{{ room.roomName }}</view><view class="room-location">{{ room.location || '位置待确认' }}</view></view>
        <view class="room-badge">A/C 共享</view>
      </view>
      <view class="doctor-line">主治医师：{{ room.attendingDoctor || '待配置' }}</view>
      <view v-if="room.loading" class="loading-text">正在加载可预约情况...</view>
      <view v-else class="room-stats">
        <view><text>可预约时段</text><strong>{{ availableSlotCount(room) }} 个</strong></view>
        <view><text>剩余名额</text><strong>{{ availableSeatCount(room) }} 个</strong></view>
        <view><text>每时段</text><strong>{{ room.capacity }} 人</strong></view>
      </view>
      <view class="room-action">点击查看预约时间 <text>→</text></view>
      </view>
    </template>
    <view v-else class="card room-detail">
      <view class="detail-back" @click="backToRooms">‹ 返回诊疗室</view>
      <view class="room-header">
        <view><view class="room-title">{{ selectedRoom.roomName }}</view><view class="room-location">{{ selectedRoom.location || '位置待确认' }}</view></view>
        <view class="room-badge">A/C 共享</view>
      </view>
      <view class="doctor-line">主治医师：{{ selectedRoom.attendingDoctor || '待配置' }} · {{ bookingDate }}</view>
      <view v-if="selectedRoom.loading" class="loading-text">正在加载可预约时段...</view>
      <view v-else class="slot-grid">
        <view v-for="slot in selectedRoom.slots" :key="slot.timeSlot" :class="['slot', selectedSlot === slot.timeSlot && !isSlotExpired(slot) && slot.available && 'selected', (isSlotExpired(slot) || !slot.available) && 'disabled']" @click="selectSlot(selectedRoom, slot)">
          <text class="slot-time">{{ slot.timeSlot }}</text><text class="slot-count">{{ isSlotExpired(slot) ? '已结束' : slot.available ? `剩余 ${slot.remainingCount}` : '已满' }}</text>
        </view>
      </view>
    </view>
    <view v-if="selectedRoom && selectedSlot" class="card confirm-card">
      <view class="selection-title">已选择预约时段</view>
      <view class="selection-value">{{ selectedRoom.roomName }} · {{ bookingDate }} · {{ selectedSlot }}</view>
      <textarea v-model="remark" class="remark" maxlength="200" placeholder="备注（选填）" />
      <button class="primary-btn" :disabled="submitting || selectedSlotExpired" @click="submit">{{ submitting ? '提交中...' : '确认预约' }}</button>
    </view>
    <view class="card link-card" @click="goRecords"><text>查看我的诊疗预约</text><text class="arrow">›</text></view>
  </view>
</template>

<script setup>
import { computed, ref } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { medicalAppointmentApi } from "@/api/operations/medicalAppointment";
const rooms = ref([]); const bookingDate = ref(""); const roomId = ref(""); const selectedSlot = ref(""); const remark = ref(""); const submitting = ref(false);
const selectedRoom = computed(() => rooms.value.find((room) => String(room.medicalRoomId) === String(roomId.value)));
const selectedSlotExpired = computed(() => {
  const slot = selectedRoom.value?.slots?.find((item) => item.timeSlot === selectedSlot.value);
  return !slot || isSlotExpired(slot);
});
function today() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }
async function loadRooms() { try { const res = await medicalAppointmentApi.getRooms(); rooms.value = (res.data || res || []).map((room) => ({ ...room, slots: [], loading: false })); await loadSchedules(); } catch (e) { uni.showToast({ title: e?.msg || "诊疗室加载失败", icon: "none" }); } }
async function loadSchedules() { if (!bookingDate.value) return; await Promise.all(rooms.value.map(async (room) => { room.loading = true; try { const res = await medicalAppointmentApi.getSlots(room.medicalRoomId, bookingDate.value); room.slots = res.data || res || []; } catch (e) { room.slots = []; uni.showToast({ title: e?.msg || `${room.roomName}时段加载失败`, icon: "none" }); } finally { room.loading = false; } })); }
function chooseDate() { uni.showActionSheet({ itemList: ["今天", "明天", "后天"] }).then(async ({ tapIndex }) => { const d = new Date(); d.setDate(d.getDate() + tapIndex); bookingDate.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; roomId.value = ""; selectedSlot.value = ""; await loadSchedules(); }).catch(() => {}); }
function isSlotExpired(slot) {
  if (slot.expired || bookingDate.value !== today()) return Boolean(slot.expired);
  const match = String(slot.timeSlot || '').match(/^(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})$/);
  if (!match) return false;
  const now = new Date();
  const endMinutes = Number(match[3]) * 60 + Number(match[4]);
  return now.getHours() * 60 + now.getMinutes() >= endMinutes;
}
function availableSlotCount(room) { return room.slots.filter((slot) => slot.available && !isSlotExpired(slot)).length; }
function availableSeatCount(room) { return room.slots.reduce((totalSeats, slot) => totalSeats + (isSlotExpired(slot) ? 0 : Number(slot.remainingCount || 0)), 0); }
function selectRoom(room) { roomId.value = room.medicalRoomId; selectedSlot.value = ""; }
function backToRooms() { roomId.value = ""; selectedSlot.value = ""; }
function selectSlot(room, slot) { if (slot.expired || isSlotExpired(slot) || !slot.available) return; roomId.value = room.medicalRoomId; selectedSlot.value = slot.timeSlot; }
async function submit() { if (!bookingDate.value || !roomId.value || !selectedSlot.value) { uni.showToast({ title: "请选择日期、诊疗室和时段", icon: "none" }); return; } submitting.value = true; try { await medicalAppointmentApi.reserve({ medicalRoomId: roomId.value, bookingDate: bookingDate.value, timeSlot: selectedSlot.value, remark: remark.value }); uni.showToast({ title: "预约成功", icon: "success" }); selectedSlot.value = ""; remark.value = ""; await loadSchedules(); } catch (e) { uni.showToast({ title: e?.msg || "名额已被预约，请刷新后重试", icon: "none" }); await loadSchedules(); } finally { submitting.value = false; } }
function goRecords() { uni.navigateTo({ url: "/pages_mine/pages/medicalAppointment/records" }); }
onLoad(() => { bookingDate.value = today(); loadRooms(); }); onShow(() => { if (bookingDate.value && rooms.value.length) loadSchedules(); });
</script>

<style scoped>
.page { min-height: 100vh; padding: 24rpx; background: #f5f7f8; box-sizing: border-box; }
.card { background: #fff; border-radius: 18rpx; margin-bottom: 20rpx; box-shadow: 0 8rpx 24rpx rgba(42, 64, 78, .05); }
.hero { padding: 34rpx 30rpx; color: #fff; background: linear-gradient(135deg, #278d82, #40b39b); }.hero-title { font-size: 40rpx; font-weight: 600; }.hero-desc { margin-top: 12rpx; opacity: .88; font-size: 24rpx; }
.date-card { padding: 30rpx; }
.date-card .field { padding: 26rpx 0 8rpx; }
.room-card { padding: 30rpx; }
.room-header { display: flex; align-items: flex-start; justify-content: space-between; }
.room-title { color: #25363a; font-size: 33rpx; font-weight: 600; }
.room-location { margin-top: 10rpx; color: #788588; font-size: 24rpx; }
.room-badge { padding: 8rpx 14rpx; color: #16806f; background: #e1f6f0; border-radius: 999rpx; font-size: 22rpx; }
.doctor-line { margin-top: 20rpx; padding: 16rpx 18rpx; color: #526a72; background: #f7fafc; border-radius: 8rpx; font-size: 24rpx; }
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
