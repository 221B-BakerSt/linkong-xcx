<template>
  <view v-if="pageMode === 'verify'" class="verify-container">
    <view class="ticket-card">
      <view class="ticket-head">
        <view>
          <view class="ticket-title">班车核销凭证</view>
          <view class="ticket-subtitle">请在乘车时向现场工作人员出示本页</view>
        </view>
        <text class="ticket-badge">可核销</text>
      </view>

      <view class="clock-panel">
        <view class="clock-label">实时时间</view>
        <view class="clock-time">{{ timeText }}</view>
        <view class="clock-date">{{ dateText }}</view>
      </view>

      <view class="ticket-code">{{ detail.reservationNo || "-" }}</view>
      <view class="ticket-note">退款成功后，本凭证会立即失效</view>
    </view>

    <view class="verify-info-card">
      <view class="info-title">班次信息</view>
      <view class="info-item">
        <text class="info-label">班次</text>
        <text class="info-value">{{ detail.shiftName || shiftName(detail.shiftType) }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">发车时间</text>
        <text class="info-value">{{ detail.shiftDate || "-" }} {{ detail.departTime || "" }}</text>
      </view>
    </view>

    <view class="verify-info-card">
      <view class="info-title">车辆信息</view>
      <view class="info-item">
        <text class="info-label">车辆</text>
        <text class="info-value">{{ detail.busName || "员工通勤班车" }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">已锁座位</text>
        <text class="info-value">{{ lockedSeatCount }} / {{ detail.seatCapacity || 49 }}</text>
      </view>
    </view>

    <view class="verify-info-card">
      <view class="info-title">乘车人信息</view>
      <view class="info-item">
        <text class="info-label">乘车人</text>
        <text class="info-value">{{ detail.passengerName || "-" }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">手机号</text>
        <text class="info-value">{{ detail.passengerPhone || "-" }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">企业简称</text>
        <text class="info-value">{{ detail.passengerDeptName || "-" }}</text>
      </view>
    </view>
  </view>

  <view v-else class="container">
    <view class="hero-card">
      <view>
        <view class="hero-title">班车预约详情</view>
        <view class="hero-subtitle">支付成功后可查看核销凭证，退款后凭证立即失效</view>
      </view>
      <text class="status" :class="statusClass(detail.reservationStatus)">
        {{ statusText(detail.reservationStatus) }}
      </text>
    </view>

    <view class="info-section">
      <view class="info-title">预约信息</view>
      <view class="amount-row">
        <text class="amount-label">预约金额</text>
        <text class="amount">￥{{ money(detail.amount) }}</text>
      </view>
      <view class="info-item">
        <view class="info-label">预约编号</view>
        <view class="info-value">{{ detail.reservationNo || "-" }}</view>
      </view>
      <view class="info-item">
        <view class="info-label">下单时间</view>
        <view class="info-value">{{ detail.createTime || "-" }}</view>
      </view>
      <view class="info-item">
        <view class="info-label">支付时间</view>
        <view class="info-value">{{ detail.paidTime || "-" }}</view>
      </view>
    </view>

    <view class="info-section">
      <view class="info-title">班次信息</view>
      <view class="info-item">
        <view class="info-label">班次</view>
        <view class="info-value">{{ detail.shiftName || shiftName(detail.shiftType) }}</view>
      </view>
      <view class="info-item">
        <view class="info-label">发车时间</view>
        <view class="info-value">{{ detail.shiftDate || "-" }} {{ detail.departTime || "" }}</view>
      </view>
    </view>

    <view class="info-section">
      <view class="info-title">车辆信息</view>
      <view class="info-item">
        <view class="info-label">车辆</view>
        <view class="info-value">{{ detail.busName || "员工通勤班车" }}</view>
      </view>
      <view class="info-item">
        <view class="info-label">已锁座位</view>
        <view class="info-value">{{ lockedSeatCount }} / {{ detail.seatCapacity || 49 }}</view>
      </view>
    </view>

    <view class="info-section">
      <view class="info-title">乘车人信息</view>
      <view class="info-item">
        <view class="info-label">乘车人</view>
        <view class="info-value">{{ detail.passengerName || "-" }}</view>
      </view>
      <view class="info-item">
        <view class="info-label">手机号</view>
        <view class="info-value">{{ detail.passengerPhone || "-" }}</view>
      </view>
      <view class="info-item">
        <view class="info-label">企业简称</view>
        <view class="info-value">{{ detail.passengerDeptName || "-" }}</view>
      </view>
    </view>

    <view v-if="canOperate" class="button-section">
      <button v-if="canContinuePay" class="action-btn primary" @click="continuePay">继续支付</button>
      <button v-if="canVerify" class="action-btn primary" @click="goVerify">查看核销</button>
      <button v-if="canRefund" class="action-btn warn" @click="refundOrder">申请退款</button>
      <button v-if="canCancel" class="action-btn muted" @click="cancelOrder">取消预约</button>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from "vue";
import { onHide, onLoad, onShow, onUnload } from "@dcloudio/uni-app";
import { shuttleBusApi } from "@/api/operations/shuttleBus";

const reservationId = ref("");
const detail = ref({});
const pageMode = ref("detail");
const timeText = ref("");
const dateText = ref("");

let timer = null;

const canCancel = computed(() => detail.value.reservationStatus === "WAIT_PAY");
const canContinuePay = computed(() => detail.value.reservationStatus === "WAIT_PAY");
const canVerify = computed(() => isVerifyAvailable(detail.value));
const canRefund = computed(() => detail.value.reservationStatus === "PAID" && beforeRefundDeadline());
const canOperate = computed(() => canCancel.value || canContinuePay.value || canVerify.value || canRefund.value);
const lockedSeatCount = computed(() => detail.value.lockedCount ?? detail.value.seatCount ?? 1);

onLoad((options) => {
  reservationId.value = options.id || "";
  pageMode.value = options.mode === "verify" ? "verify" : "detail";
  updatePageTitle();
  if (pageMode.value === "verify") {
    startClock();
  }
  getDetail();
});

onShow(() => {
  if (pageMode.value === "verify") {
    startClock();
  }
  if (reservationId.value) {
    getDetail();
  }
});

onHide(() => {
  clearClock();
});

onUnload(() => {
  clearClock();
});

async function getDetail() {
  if (!reservationId.value) return;
  const res = await shuttleBusApi.getReservationInfo(reservationId.value);
  const data = res.data || {};
  if (pageMode.value === "verify" && !isVerifyAvailable(data)) {
    closeVerifyPage("当前时段不可查看核销页");
    return;
  }
  if (pageMode.value === "verify" && data.reservationStatus !== "PAID") {
    closeVerifyPage("当前预约不可查看核销页");
    return;
  }
  detail.value = data;
}

function goVerify() {
  if (!isVerifyAvailable(detail.value)) {
    uni.showToast({ title: "当前时段不可查看核销页", icon: "none" });
    return;
  }
  if (!canVerify.value) {
    uni.showToast({ title: "当前预约不可核销", icon: "none" });
    return;
  }
  uni.navigateTo({
    url: `/pages_mine/pages/shuttle/detail?id=${reservationId.value}&mode=verify`,
  });
}

function isVerifyAvailable(data) {
  if (!data || data.reservationStatus !== "PAID") {
    return false;
  }
  const deadline = Number(data.verifyAvailableUntilTs || 0);
  if (deadline > 0 && Date.now() >= deadline) {
    return false;
  }
  return data.verifyAvailable !== false;
}

async function continuePay() {
  if (!canContinuePay.value) {
    uni.showToast({ title: "当前预约不可继续支付", icon: "none" });
    return;
  }
  try {
    const res = await shuttleBusApi.payReservation(reservationId.value);
    const data = res.data || {};
    if (data.needAuthorize) {
      handleNeedAuthorize(data);
      return;
    }
    await requestPay(data);
    await getDetail();
  } catch (e) {
    console.error("继续支付失败", e);
    await getDetail();
  }
}

function cancelOrder() {
  uni.showModal({
    title: "取消预约",
    content: "确认取消该待支付预约并释放座位吗？",
    success: async (res) => {
      if (!res.confirm) return;
      await shuttleBusApi.cancelReservation(reservationId.value);
      uni.showToast({ title: "已取消", icon: "success" });
      getDetail();
    },
  });
}

function refundOrder() {
  uni.showModal({
    title: "申请退款",
    content: "发车前 10 分钟内不可退款，确认提交退款申请吗？",
    success: async (res) => {
      if (!res.confirm) return;
      await shuttleBusApi.refundReservation(reservationId.value);
      uni.showToast({ title: "退款申请已提交", icon: "success" });
      getDetail();
    },
  });
}

function beforeRefundDeadline() {
  if (!detail.value.shiftDate || !detail.value.departTime) return false;
  const depart = new Date(`${detail.value.shiftDate.replace(/-/g, "/")} ${detail.value.departTime}:00`).getTime();
  return Date.now() < depart - 10 * 60 * 1000;
}

function handleNeedAuthorize(data) {
  uni.showModal({
    title: "需要微信授权",
    content: data.authorizeMessage || "当前手机号未完成微信授权，请先授权后再继续支付。",
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
          phone: detail.value.passengerPhone,
        });
        uni.showToast({ title: "授权成功，请继续支付", icon: "success" });
        await continuePay();
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
  if (!data.payConfigured || data.payParams?.mock) {
    uni.showModal({
      title: "支付未配置",
      content: data.payMessage || "微信支付参数未配置，暂无法拉起真实支付。",
      confirmText: "查看订单",
      success: () => {
        getDetail();
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
      success: async () => {
        uni.showToast({ title: "支付成功", icon: "success" });
        await getDetail();
        resolve();
      },
      fail: async () => {
        uni.showToast({ title: "支付未完成，可稍后继续支付", icon: "none" });
        await getDetail();
        resolve();
      },
    });
  });
}

function startClock() {
  clearClock();
  refreshClock();
  timer = setInterval(() => {
    refreshClock();
  }, 1000);
}

function clearClock() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function refreshClock() {
  if (pageMode.value === "verify" && detail.value?.reservationStatus && !isVerifyAvailable(detail.value)) {
    closeVerifyPage("当前时段不可查看核销页");
    return;
  }
  const now = new Date();
  const weekMap = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  const hour = `${now.getHours()}`.padStart(2, "0");
  const minute = `${now.getMinutes()}`.padStart(2, "0");
  const second = `${now.getSeconds()}`.padStart(2, "0");
  timeText.value = `${hour}:${minute}:${second}`;
  dateText.value = `${year}-${month}-${day} ${weekMap[now.getDay()]}`;
}

function closeVerifyPage(message) {
  clearClock();
  uni.showToast({ title: message, icon: "none" });
  setTimeout(() => {
    const pages = getCurrentPages();
    if (pages.length > 1) {
      uni.navigateBack();
      return;
    }
    uni.reLaunch({ url: "/pages_mine/pages/shuttle/records" });
  }, 800);
}

function updatePageTitle() {
  uni.setNavigationBarTitle({
    title: pageMode.value === "verify" ? "班车核销凭证" : "班车预约详情",
  });
}

function shiftName(type) {
  return type === "evening" ? "下班" : "上班";
}

function statusText(status) {
  const map = {
    WAIT_PAY: "待支付",
    PAID: "已预约",
    REFUNDING: "退款中",
    REFUNDED: "已退款",
    CANCELLED: "已取消",
    EXPIRED: "已超时",
  };
  return map[status] || status || "-";
}

function statusClass(status) {
  if (status === "PAID") return "success";
  if (status === "WAIT_PAY" || status === "REFUNDING") return "warning";
  return "muted";
}

function money(amount) {
  return ((Number(amount || 0) / 100) || 0).toFixed(2);
}
</script>

<style scoped lang="scss">
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
  padding-bottom: 130rpx;
}

.hero-card,
.info-section,
.ticket-card,
.verify-info-card {
  background-color: #fff;
  border-radius: 18rpx;
  box-shadow: 0 4rpx 14rpx rgba(0, 0, 0, 0.05);
}

.hero-card {
  padding: 30rpx;
  margin-bottom: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.hero-title,
.ticket-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #222;
}

.hero-subtitle,
.ticket-subtitle {
  margin-top: 10rpx;
  font-size: 24rpx;
  line-height: 38rpx;
  color: #7c8a94;
  max-width: 420rpx;
}

.info-section,
.verify-info-card {
  padding: 28rpx;
  margin-bottom: 18rpx;
}

.info-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #222;
  margin-bottom: 8rpx;
}

.amount-row,
.info-item,
.ticket-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.amount-row {
  padding: 20rpx 0 10rpx;
}

.amount-label,
.info-label {
  color: #7c8a94;
  font-size: 24rpx;
}

.amount {
  color: #f05a28;
  font-size: 38rpx;
  font-weight: 700;
}

.info-item {
  padding: 24rpx 0;
  border-top: 1rpx solid #f3f4f6;
  font-size: 25rpx;
}

.info-value {
  max-width: 430rpx;
  text-align: right;
  word-break: break-all;
  color: #1f2b3d;
}

.status,
.ticket-badge {
  padding: 8rpx 18rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
}

.status.success,
.ticket-badge {
  color: #16794c;
  background-color: #e8f6ef;
}

.status.warning {
  color: #b66a00;
  background-color: #fff4df;
}

.status.muted {
  color: #999;
  background-color: #f2f2f2;
}

.button-section {
  display: flex;
  gap: 18rpx;
  margin-top: 8rpx;
}

.action-btn {
  flex: 1;
  height: 84rpx;
  line-height: 84rpx;
  border-radius: 999rpx;
  font-size: 28rpx;
}

.action-btn::after {
  border: none;
}

.action-btn.primary {
  background-color: #235eff;
  color: #fff;
}

.action-btn.warn {
  background-color: #fff4df;
  color: #b66a00;
}

.action-btn.muted {
  background-color: #fff;
  color: #666;
}

.verify-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #eef3ff 0%, #f5f5f5 220rpx);
  padding: 20rpx;
}

.ticket-card {
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.clock-panel {
  margin: 28rpx 0;
  padding: 28rpx;
  border-radius: 16rpx;
  background: linear-gradient(135deg, #4d69cc 0%, #2d48a8 100%);
  color: #fff;
  text-align: center;
}

.clock-label {
  font-size: 22rpx;
  opacity: 0.9;
}

.clock-time {
  margin: 14rpx 0 10rpx;
  font-size: 54rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
}

.clock-date {
  font-size: 24rpx;
  opacity: 0.92;
}

.ticket-code {
  text-align: center;
  font-size: 42rpx;
  font-weight: 700;
  color: #1f2b3d;
  letter-spacing: 2rpx;
}

.ticket-note {
  margin-top: 16rpx;
  text-align: center;
  font-size: 24rpx;
  color: #7c8a94;
}
</style>
