<template>
  <view class="page-container">
    <view class="hero-card">
      <view>
        <view class="hero-title">员工班车预约</view>
      </view>
      <view class="hero-badge">近三天</view>
    </view>

    <view class="notice-bar">
      <text class="notice-bar__badge">提醒</text>
      <text class="notice-bar__text">{{ noticeText }}</text>
    </view>

    <view class="quick-actions">
      <view class="quick-action" @click="refreshPageData">
        <up-icon name="reload" size="18" color="#4d69cc"></up-icon>
        <text>刷新班次</text>
      </view>
      <view class="quick-action" @click="goRecords">
        <up-icon name="order" size="18" color="#4d69cc"></up-icon>
        <text>我的预约</text>
      </view>
    </view>

    <view v-if="scheduleList.length === 0" class="empty-card">
      <text>暂无可预约班次</text>
    </view>

    <view v-for="day in groupedSchedules" :key="day.date" class="day-section">
      <view class="day-title">
        <text>{{ formatDayTitle(day.date) }}</text>
        <text class="day-date">{{ day.date }}</text>
      </view>

      <view
        v-for="item in day.items"
        :key="`${item.shiftDate}-${item.shiftType}`"
        class="schedule-card"
        :class="{ disabled: !canReserve(item) }"
      >
        <view class="schedule-main">
          <view class="schedule-time">
            <text class="depart-time">{{ item.departTime }}</text>
            <text class="shift-name">{{ item.shiftName || shiftName(item.shiftType) }}</text>
          </view>
          <view class="status-pill" :class="{ ok: canReserve(item), off: !canReserve(item) }">
            {{ scheduleStatus(item) }}
          </view>
        </view>

        <view class="meta-row">
          <text>{{ item.busName || "员工通勤班车" }}</text>
          <text v-if="item.plateNo">{{ item.plateNo }}</text>
          <text>余 {{ item.remainingCount || 0 }}/{{ item.seatCapacity || 49 }} 座</text>
        </view>

        <view class="card-footer">
          <view class="price">￥{{ money(item.amount) }}</view>
          <button class="reserve-btn" :disabled="!canReserve(item)" @click="openReserve(item)">
            {{ canReserve(item) ? "预约支付" : "不可预约" }}
          </button>
        </view>
      </view>
    </view>

    <up-popup :show="showReserve" mode="bottom" round="18" @close="showReserve = false">
      <view class="reserve-popup">
        <view class="popup-title">确认乘车信息</view>
        <view class="selected-shift" v-if="selectedSchedule">
          <text>{{ selectedSchedule.shiftDate }} {{ selectedSchedule.departTime }}</text>
          <text>{{ selectedSchedule.shiftName || shiftName(selectedSchedule.shiftType) }}</text>
        </view>
        <view class="form-item">
          <text class="form-label">乘车人</text>
          <input v-model="form.passengerName" placeholder="请输入乘车人" />
        </view>
        <view class="form-item">
          <text class="form-label">手机号</text>
          <input v-model="form.passengerPhone" type="number" placeholder="请输入手机号" />
        </view>
        <view class="form-item">
          <text class="form-label">企业简称</text>
          <input v-model="form.enterpriseShortName" maxlength="100" placeholder="请输入所在企业简称" />
        </view>
        <view class="pay-tip">提交后将锁定 1 个座位，请在 10 分钟内完成微信支付。</view>
        <button class="submit-btn" :disabled="submitting" @click="submitReserve">
          {{ submitting ? "提交中..." : submitButtonText }}
        </button>
      </view>
    </up-popup>
  </view>
</template>

<script setup>
import { computed, ref } from "vue";
import { onLoad, onPullDownRefresh, onShow } from "@dcloudio/uni-app";
import { shuttleBusApi } from "@/api/operations/shuttleBus";
import { getUserProfile } from "@/api/system/user";

const SHUTTLE_PASSENGER_CACHE_KEY = "lkShuttlePassengerForm";
const DEFAULT_NOTICE_TEXT =
  "距离发车不足 10 分钟将不再支持退款，且周六、周日班车停运，节假日调休除外。请合理安排出行时间。";

const scheduleList = ref([]);
const noticeText = ref(DEFAULT_NOTICE_TEXT);
const showReserve = ref(false);
const selectedSchedule = ref(null);
const submitting = ref(false);
const form = ref({
  passengerName: "",
  passengerPhone: "",
  enterpriseShortName: "",
});
const submitButtonText = computed(() => `提交并支付 ${priceText(selectedSchedule.value?.amount)} 元`);

const groupedSchedules = computed(() => {
  const map = {};
  sortScheduleItems(scheduleList.value).forEach((item) => {
    const date = item.shiftDate;
    if (!map[date]) {
      map[date] = [];
    }
    map[date].push(item);
  });
  return Object.keys(map)
    .sort((a, b) => `${a}`.localeCompare(`${b}`))
    .map((date) => ({
      date,
      items: sortScheduleItems(map[date]),
    }));
});

onLoad(() => {
  hydratePassengerForm();
  refreshPageData();
});

onShow(() => {
  refreshPageData();
});

onPullDownRefresh(async () => {
  await refreshPageData();
  uni.stopPullDownRefresh();
});

async function refreshPageData() {
  await Promise.all([getSchedules(), getPageConfig()]);
}

async function hydratePassengerForm() {
  const cachedForm = getCachedPassengerForm();
  try {
    const res = await getUserProfile();
    const user = res.data?.user || {};
    const cachedPhone = normalizePhoneValue(cachedForm.passengerPhone);
    const profilePhone = normalizePhoneValue(user.phonenumber) || normalizePhoneValue(user.userName);
    form.value.passengerName = cachedForm.passengerName || user.nickName || user.userName || "";
    form.value.passengerPhone = cachedPhone || profilePhone || "";
    form.value.enterpriseShortName = cachedForm.enterpriseShortName || "";
  } catch (e) {
    console.error("获取用户信息失败", e);
    form.value.passengerName = cachedForm.passengerName || "";
    form.value.passengerPhone = normalizePhoneValue(cachedForm.passengerPhone);
    form.value.enterpriseShortName = cachedForm.enterpriseShortName || "";
  }
}

function normalizePhoneValue(value) {
  const phone = `${value || ""}`.trim();
  return /^1\d{10}$/.test(phone) ? phone : "";
}

function getCachedPassengerForm() {
  try {
    return uni.getStorageSync(SHUTTLE_PASSENGER_CACHE_KEY) || {};
  } catch (e) {
    return {};
  }
}

function cachePassengerForm(payload) {
  try {
    uni.setStorageSync(SHUTTLE_PASSENGER_CACHE_KEY, payload);
  } catch (e) {
    console.error("缓存班车乘客信息失败", e);
  }
}

async function getSchedules() {
  try {
    const res = await shuttleBusApi.getSchedules();
    scheduleList.value = sortScheduleItems(res.data || []);
  } catch (e) {
    console.error("班车班次加载失败", e);
    scheduleList.value = [];
  }
}

async function getPageConfig() {
  try {
    const res = await shuttleBusApi.getConfig();
    noticeText.value = res.data?.reservationNotice || DEFAULT_NOTICE_TEXT;
  } catch (e) {
    console.error("班车配置加载失败", e);
    noticeText.value = DEFAULT_NOTICE_TEXT;
  }
}

function sortScheduleItems(list = []) {
  return [...list].sort((a, b) => {
    const dateCompare = `${a.shiftDate || ""}`.localeCompare(`${b.shiftDate || ""}`);
    if (dateCompare !== 0) {
      return dateCompare;
    }
    const shiftCompare = shiftOrder(a.shiftType) - shiftOrder(b.shiftType);
    if (shiftCompare !== 0) {
      return shiftCompare;
    }
    return `${a.departTime || ""}`.localeCompare(`${b.departTime || ""}`);
  });
}

function shiftOrder(type) {
  return type === "evening" ? 1 : 0;
}

function openReserve(item) {
  if (!canReserve(item)) {
    uni.showToast({ title: scheduleStatus(item), icon: "none" });
    return;
  }
  if (shouldShowReservationNotice(item)) {
    uni.showModal({
      title: "温馨提示",
      content: "周六、周日班车停运，节假日调休除外。确认后继续预约支付。",
      confirmText: "继续确认",
      cancelText: "取消",
      success: (res) => {
        if (res.confirm) {
          doOpenReserve(item);
        }
      },
    });
    return;
  }
  doOpenReserve(item);
}

function doOpenReserve(item) {
  selectedSchedule.value = item;
  showReserve.value = true;
}

async function submitReserve() {
  if (!selectedSchedule.value) return;
  const passengerName = (form.value.passengerName || "").trim();
  const passengerPhone = (form.value.passengerPhone || "").trim();
  const enterpriseShortName = (form.value.enterpriseShortName || "").trim();

  if (!passengerName) {
    uni.showToast({ title: "请填写乘车人", icon: "none" });
    return;
  }
  if (!/^1\d{10}$/.test(passengerPhone)) {
    uni.showToast({ title: "请填写正确手机号", icon: "none" });
    return;
  }
  if (!enterpriseShortName) {
    uni.showToast({ title: "请填写所在企业简称", icon: "none" });
    return;
  }
  if (!canReserve(selectedSchedule.value)) {
    uni.showToast({ title: "该班次已不可预约", icon: "none" });
    showReserve.value = false;
    getSchedules();
    return;
  }

  form.value.passengerName = passengerName;
  form.value.passengerPhone = passengerPhone;
  form.value.enterpriseShortName = enterpriseShortName;
  cachePassengerForm({
    passengerName,
    passengerPhone,
    enterpriseShortName,
  });

  submitting.value = true;
  try {
    const payload = {
      shiftDate: selectedSchedule.value.shiftDate,
      shiftType: selectedSchedule.value.shiftType,
      passengerName,
      passengerPhone,
      passengerDeptName: enterpriseShortName,
    };
    const res = await shuttleBusApi.reserve(payload);
    const data = res.data || {};
    if (data.needAuthorize) {
      showReserve.value = false;
      handleNeedAuthorize(data);
      return;
    }
    showReserve.value = false;
    await requestPay(data);
  } catch (e) {
    console.error("班车预约失败", e);
  } finally {
    submitting.value = false;
  }
}

function handleNeedAuthorize(data) {
  uni.showModal({
    title: "需要微信授权",
    content: data.authorizeMessage || "当前手机号未完成微信授权，请先授权后再预约支付。",
    confirmText: "去授权",
    cancelText: "稍后",
    success: (res) => {
      if (res.confirm) {
        authorizeWechatOpenId();
      }
    },
  });
}

function authorizeWechatOpenId() {
  uni.login({
    provider: "weixin",
    success: async (loginRes) => {
      if (!loginRes.code) {
        uni.showToast({ title: "微信授权失败", icon: "none" });
        return;
      }
      try {
        await shuttleBusApi.authorizeWechat({
          code: loginRes.code,
          phone: form.value.passengerPhone,
        });
        uni.showToast({ title: "授权成功，请继续支付", icon: "success" });
        showReserve.value = true;
      } catch (e) {
        console.error("微信授权失败", e);
      }
    },
    fail: () => {
      uni.showToast({ title: "微信授权失败", icon: "none" });
    },
  });
}

function requestPay(data) {
  const reservationId = data.reservation?.reservationId;
  if (!data.payConfigured || data.payParams?.mock) {
    uni.showModal({
      title: "支付未配置",
      content: data.payMessage || "微信支付参数未配置，暂无法拉起真实支付。",
      confirmText: "查看订单",
      success: () => {
        if (reservationId) {
          goDetail(reservationId);
        }
      },
    });
    return Promise.resolve();
  }

  const payParams = data.payParams || {};
  return new Promise((resolve) => {
    uni.requestPayment({
      provider: "wxpay",
      timeStamp: payParams.timeStamp,
      nonceStr: payParams.nonceStr,
      package: payParams.package,
      signType: payParams.signType || "RSA",
      paySign: payParams.paySign,
      success: () => {
        uni.showToast({ title: "支付成功", icon: "success" });
        if (reservationId) {
          setTimeout(() => goDetail(reservationId), 600);
        }
        resolve();
      },
      fail: () => {
        uni.showToast({ title: "支付未完成，可在我的预约继续查看", icon: "none" });
        if (reservationId) {
          setTimeout(() => goDetail(reservationId), 800);
        }
        resolve();
      },
    });
  });
}

function canReserve(item) {
  return Boolean(item?.canReserve) && !isDeparted(item) && Number(item.remainingCount || 0) > 0;
}

function isDeparted(item) {
  if (!item?.shiftDate || !item?.departTime) return false;
  const depart = new Date(`${item.shiftDate.replace(/-/g, "/")} ${item.departTime}:00`).getTime();
  return Date.now() >= depart;
}

function scheduleStatus(item) {
  if (isDeparted(item)) return "已发车";
  if (Number(item.remainingCount || 0) <= 0) return "座位已满";
  if (!item.canReserve) return item.disabledReason || "不可预约";
  return "可预约";
}

function shiftName(type) {
  return type === "evening" ? "下班" : "上班";
}

function shouldShowReservationNotice(item) {
  return [0, 6].includes(getWeekdayIndex(item?.shiftDate));
}

function getWeekdayIndex(dateText) {
  if (!dateText) return -1;
  const weekday = new Date(`${dateText.replace(/-/g, "/")} 00:00:00`).getDay();
  return Number.isNaN(weekday) ? -1 : weekday;
}

function formatDayTitle(date) {
  const today = formatDate(new Date());
  const tomorrow = formatDate(addDays(new Date(), 1));
  const afterTomorrow = formatDate(addDays(new Date(), 2));
  if (date === today) return "今天";
  if (date === tomorrow) return "明天";
  if (date === afterTomorrow) return "后天";
  return "班次";
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function money(amount) {
  return ((Number(amount || 0) / 100) || 0).toFixed(2);
}

function priceText(amount) {
  const value = money(amount);
  return value.endsWith(".00") ? value.slice(0, -3) : value;
}

function goRecords() {
  uni.navigateTo({ url: "/pages_mine/pages/shuttle/records" });
}

function goDetail(reservationId) {
  uni.navigateTo({ url: `/pages_mine/pages/shuttle/detail?id=${reservationId}` });
}
</script>

<style scoped lang="scss">
.page-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
  padding-bottom: 80rpx;
}

.hero-card {
  background: linear-gradient(135deg, #4d69cc 0%, #2d48a8 100%);
  border-radius: 20rpx;
  padding: 34rpx 30rpx;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  box-shadow: 0 12rpx 24rpx rgba(77, 105, 204, 0.2);
}

.hero-title {
  font-size: 36rpx;
  font-weight: 600;
  margin-bottom: 12rpx;
}

.hero-subtitle {
  font-size: 24rpx;
  opacity: 0.9;
}

.hero-badge {
  font-size: 22rpx;
  padding: 8rpx 18rpx;
  border-radius: 999rpx;
  background-color: rgba(255, 255, 255, 0.18);
}

.notice-bar {
  margin-top: 18rpx;
  margin-bottom: 18rpx;
  padding: 18rpx 22rpx;
  border-radius: 16rpx;
  border: 1rpx solid #d8e2f7;
  border-left: 6rpx solid #4d69cc;
  background: #ffffff;
  box-shadow: 0 4rpx 12rpx rgba(31, 67, 153, 0.05);
  display: flex;
  align-items: center;
  gap: 14rpx;
}

.notice-bar__badge {
  flex-shrink: 0;
  padding: 4rpx 12rpx;
  border-radius: 999rpx;
  background: #eef3ff;
  color: #3353bf;
  font-size: 20rpx;
  font-weight: 600;
  line-height: 30rpx;
  text-align: center;
}

.notice-bar__text {
  color: #5a6784;
  font-size: 24rpx;
  line-height: 36rpx;
  flex: 1;
}

.quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
  margin: 20rpx 0;
}

.quick-action {
  height: 88rpx;
  background-color: #fff;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  font-size: 26rpx;
  color: #333;
}

.empty-card {
  height: 220rpx;
  background-color: #fff;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 26rpx;
}

.day-section {
  margin-top: 26rpx;
}

.day-title {
  display: flex;
  align-items: baseline;
  gap: 16rpx;
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 16rpx;
}

.day-date {
  font-size: 24rpx;
  color: #999;
  font-weight: 400;
}

.schedule-card {
  background-color: #fff;
  border-radius: 18rpx;
  padding: 26rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.schedule-card.disabled {
  opacity: 0.72;
}

.schedule-main,
.card-footer,
.meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.schedule-time {
  display: flex;
  align-items: baseline;
  gap: 14rpx;
}

.depart-time {
  font-size: 44rpx;
  font-weight: 700;
  color: #222;
}

.shift-name {
  font-size: 26rpx;
  color: #666;
}

.status-pill {
  padding: 8rpx 18rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
}

.status-pill.ok {
  color: #16794c;
  background-color: #e8f6ef;
}

.status-pill.off {
  color: #999;
  background-color: #f2f2f2;
}

.meta-row {
  color: #999;
  font-size: 22rpx;
  padding-top: 14rpx;
  border-top: 1rpx solid #f2f2f2;
}

.card-footer {
  margin-top: 22rpx;
}

.price {
  color: #f05a28;
  font-size: 34rpx;
  font-weight: 700;
}

.reserve-btn,
.submit-btn {
  margin: 0;
  background-color: #235eff;
  color: #fff;
  border-radius: 999rpx;
  font-size: 26rpx;
}

.reserve-btn {
  width: 190rpx;
  height: 66rpx;
  line-height: 66rpx;
}

.reserve-btn[disabled] {
  background-color: #d8d8d8;
  color: #fff;
}

.reserve-btn::after,
.submit-btn::after {
  border: none;
}

.reserve-popup {
  padding: 34rpx 30rpx 54rpx;
  background-color: #fff;
}

.popup-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #222;
  margin-bottom: 20rpx;
}

.selected-shift {
  display: flex;
  justify-content: space-between;
  background-color: #f5f7ff;
  color: #4d69cc;
  border-radius: 14rpx;
  padding: 20rpx;
  margin-bottom: 18rpx;
  font-size: 26rpx;
}

.form-item {
  display: flex;
  align-items: center;
  padding: 22rpx 0;
  border-bottom: 1rpx solid #f1f1f1;
}

.form-label {
  width: 150rpx;
  color: #666;
  font-size: 26rpx;
}

.form-item input {
  flex: 1;
  text-align: right;
  font-size: 26rpx;
  color: #333;
}

.pay-tip {
  color: #999;
  font-size: 22rpx;
  margin: 22rpx 0;
}

.submit-btn {
  width: 100%;
  height: 82rpx;
  line-height: 82rpx;
}
</style>
