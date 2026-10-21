<template>
  <view class="container">
    <view id="records-content" class="content-wrapper">
    <view v-if="focusReservation" class="focus-card" @click="goDetail(focusReservation)">
      <view class="focus-head">
        <view>
          <view class="focus-title">最近班次</view>
          <view class="focus-subtitle">优先查看当前时段的预约记录</view>
        </view>
        <text class="period-tag highlight">{{ focusTagText }}</text>
      </view>
      <view class="focus-time">
        {{ focusReservation.shiftDate }} {{ focusReservation.departTime }}
        {{ focusReservation.shiftName || shiftName(focusReservation.shiftType) }}
      </view>
      <view class="focus-footer">
        <text class="focus-status" :class="statusClass(focusReservation.reservationStatus)">
          {{ statusText(focusReservation.reservationStatus) }}
        </text>
        <view class="focus-link">
          <text>查看详情</text>
          <up-icon name="arrow-right" size="12" color="#4d69cc"></up-icon>
        </view>
      </view>
    </view>

    <view v-if="list.length === 0" class="empty-card">
      <text>暂无班车预约记录</text>
    </view>

    <view v-for="item in displayList" :key="item.reservationId" class="record-item" @click="goDetail(item)">
      <view class="record-content">
        <view class="record-title">
          <view class="record-title-main">
            <text class="record-name">{{ item.shiftName || shiftName(item.shiftType) }}</text>
            <text
              v-if="periodMark(item)"
              class="period-tag"
              :class="periodMark(item).type"
            >
              {{ periodMark(item).text }}
            </text>
          </view>
          <text class="status" :class="statusClass(item.reservationStatus)">
            {{ statusText(item.reservationStatus) }}
          </text>
        </view>
        <view class="record-date">{{ item.shiftDate }} {{ item.departTime }}</view>
      </view>
      <view class="record-detail">
        <text>详情</text>
        <up-icon name="arrow-right" size="12" color="rgba(0,0,0,0.55)"></up-icon>
      </view>
    </view>

    <view v-if="finished && list.length > 0" class="finished">没有更多了</view>
    </view>
  </view>
</template>

<script setup>
import { computed, nextTick, onUnmounted, ref } from "vue";
import { onHide, onLoad, onPullDownRefresh, onReachBottom, onShow } from "@dcloudio/uni-app";
import { shuttleBusApi } from "@/api/operations/shuttleBus";

const CONTENT_SELECTOR = "#records-content";
const VIEWPORT_TOLERANCE = 8;
const LAYOUT_DELAY_MS = 40;

const list = ref([]);
const pageNum = ref(1);
const pageSize = 10;
const total = ref(0);
const finished = ref(false);
const currentTimestamp = ref(Date.now());
const loading = ref(false);
const autoFilling = ref(false);

let timer = null;

const todayString = computed(() => formatDate(new Date(currentTimestamp.value)));
const isBeforeNoon = computed(() => new Date(currentTimestamp.value).getHours() < 12);
const focusShiftType = computed(() => (isBeforeNoon.value ? "morning" : "evening"));
const focusReservation = computed(() =>
  list.value.find((item) => isSameShift(item, todayString.value, focusShiftType.value)) || null
);
const focusTagText = computed(() => (isBeforeNoon.value ? "当前上班" : "当前下班"));

const displayList = computed(() => {
  const focusId = focusReservation.value?.reservationId;
  return list.value
    .map((item, index) => ({
      item,
      index,
      departTime: getDepartTimestamp(item),
      priority: listPriority(item),
    }))
    .filter(({ item }) => item.reservationId !== focusId)
    .sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      if (a.priority === 2) {
        return a.departTime - b.departTime;
      }
      if (a.priority === 3) {
        return b.departTime - a.departTime;
      }
      return a.index - b.index;
    })
    .map(({ item }) => item);
});

onLoad(() => {
  startClock();
  refreshList();
});

onShow(() => {
  startClock();
  refreshList();
});

onHide(() => {
  clearClock();
});

onUnmounted(() => {
  clearClock();
});

onPullDownRefresh(async () => {
  await refreshList();
  uni.stopPullDownRefresh();
});

onReachBottom(() => {
  loadMore();
});

async function refreshList() {
  const loaded = await fetchPage(1, true);
  if (loaded) {
    await ensureScrollableContent();
  }
}

async function loadMore() {
  if (finished.value || loading.value || autoFilling.value) {
    return;
  }
  const loaded = await fetchPage(pageNum.value + 1, false);
  if (loaded) {
    await ensureScrollableContent();
  }
}

async function fetchPage(targetPage, reset) {
  if (loading.value) {
    return false;
  }
  if (reset) {
    finished.value = false;
  }
  loading.value = true;
  try {
    const res = await shuttleBusApi.getMyReservations({
      pageNum: targetPage,
      pageSize,
      orderByColumn: "createTime",
      isAsc: "desc",
    });
    const rows = res.rows || [];
    total.value = res.total || rows.length;
    pageNum.value = targetPage;
    list.value = reset ? rows : list.value.concat(rows);
    finished.value = list.value.length >= total.value || rows.length < pageSize;
    return true;
  } finally {
    loading.value = false;
  }
}

async function ensureScrollableContent() {
  if (finished.value || autoFilling.value || loading.value) {
    return;
  }
  autoFilling.value = true;
  try {
    let shouldLoadMore = await shouldAutoLoadMore();
    while (shouldLoadMore && !finished.value) {
      const loaded = await fetchPage(pageNum.value + 1, false);
      if (!loaded) {
        break;
      }
      shouldLoadMore = await shouldAutoLoadMore();
    }
  } finally {
    autoFilling.value = false;
  }
}

async function shouldAutoLoadMore() {
  if (finished.value || !list.value.length) {
    return false;
  }
  await nextTick();
  await waitForLayout();
  const rect = await queryContentRect();
  if (!rect) {
    return false;
  }
  const { windowHeight } = uni.getSystemInfoSync();
  return rect.bottom <= windowHeight + VIEWPORT_TOLERANCE;
}

function waitForLayout() {
  return new Promise((resolve) => {
    setTimeout(resolve, LAYOUT_DELAY_MS);
  });
}

function queryContentRect() {
  return new Promise((resolve) => {
    const query = uni.createSelectorQuery();
    query.select(CONTENT_SELECTOR).boundingClientRect();
    query.exec((res) => {
      resolve(res?.[0] || null);
    });
  });
}

function goDetail(item) {
  uni.navigateTo({
    url: `/pages_mine/pages/shuttle/detail?id=${item.reservationId}`,
  });
}

function startClock() {
  clearClock();
  refreshClock();
  timer = setInterval(() => {
    refreshClock();
  }, 60000);
}

function clearClock() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function refreshClock() {
  currentTimestamp.value = Date.now();
}

function listPriority(item) {
  const mark = periodMark(item);
  if (mark?.type === "muted") {
    return 1;
  }
  return getDepartTimestamp(item) >= currentTimestamp.value ? 2 : 3;
}

function periodMark(item) {
  if (!item) {
    return null;
  }
  if (!isBeforeNoon.value && isSameShift(item, todayString.value, "morning")) {
    return {
      text: "上班已过",
      type: "muted",
    };
  }
  return null;
}

function isSameShift(item, date, shiftType) {
  return `${item?.shiftDate || ""}` === `${date || ""}` && `${item?.shiftType || ""}` === `${shiftType || ""}`;
}

function getDepartTimestamp(item) {
  if (!item?.shiftDate || !item?.departTime) {
    return 0;
  }
  return new Date(`${item.shiftDate.replace(/-/g, "/")} ${item.departTime}:00`).getTime();
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
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
</script>

<style scoped lang="scss">
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
}

.focus-card,
.record-item,
.empty-card {
  background-color: #fff;
  border-radius: 18rpx;
  box-shadow: 0 4rpx 14rpx rgba(0, 0, 0, 0.05);
}

.focus-card {
  padding: 28rpx;
  margin-bottom: 22rpx;
  background: linear-gradient(135deg, #f5fbf7 0%, #ffffff 100%);
  border: 1rpx solid rgba(22, 121, 76, 0.08);
}

.focus-head,
.focus-footer,
.record-item,
.record-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.focus-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #222;
}

.focus-subtitle {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #7c8a94;
}

.focus-time {
  margin: 26rpx 0 12rpx;
  font-size: 30rpx;
  font-weight: 600;
  color: #1f2b3d;
}

.record-date {
  font-size: 25rpx;
  line-height: 40rpx;
  color: #7c8a94;
}

.focus-footer {
  margin-top: 24rpx;
}

.focus-status {
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
}

.focus-link,
.record-detail,
.record-title-main {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.focus-link {
  font-size: 24rpx;
  color: #4d69cc;
}

.record-item {
  padding: 24rpx;
  margin-bottom: 18rpx;
}

.record-content {
  flex: 1;
  min-width: 0;
}

.record-title {
  margin-bottom: 12rpx;
}

.record-title-main {
  min-width: 0;
  flex-wrap: wrap;
}

.record-name {
  font-size: 30rpx;
  font-weight: 550;
  color: #333;
}

.period-tag,
.status {
  padding: 6rpx 14rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
  font-weight: 400;
}

.period-tag.highlight,
.status.success,
.focus-status.success {
  color: #16794c;
  background-color: #e8f6ef;
}

.period-tag.muted,
.status.muted,
.focus-status.muted {
  color: #8f8f8f;
  background-color: #f2f2f2;
}

.status.warning,
.focus-status.warning {
  color: #b66a00;
  background-color: #fff4df;
}

.record-detail {
  margin-left: 18rpx;
  font-size: 26rpx;
  color: rgba(0, 0, 0, 0.58);
}

.empty-card {
  height: 240rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 26rpx;
}

.finished {
  text-align: center;
  color: #aaa;
  font-size: 24rpx;
  padding: 20rpx 0 40rpx;
}
</style>
