<template>
  <view class="detail-container">
    <!-- 企业信息 -->
    <view class="section">
      <view class="section-title">企业信息</view>
      <view class="form-item">
        <text class="label">企业名称</text>
        <text class="value">{{ detail.companyName || '' }}</text>
      </view>
    </view>

    <!-- 供冷制暖需求 -->
    <view class="section">
      <view class="section-title">供冷制暖需求</view>
      <view class="form-item">
        <text class="label">供冷制暖</text>
        <text class="value arrow">{{ typeMap[detail.type] || '' }} ></text>
      </view>
      <view class="form-item">
        <text class="label">位置</text>
        <text class="value arrow">{{ detail.address || '' }} ></text>
      </view>
      <view class="form-item">
        <text class="label">面积(m²)</text>
        <text class="value">{{ detail.area || '' }}</text>
      </view>
      <view class="form-item">
        <text class="label">开始日期</text>
        <text class="value arrow">{{ detail.startDate || '' }} ></text>
      </view>
      <view class="form-item">
        <text class="label">结束日期</text>
        <text class="value arrow">{{ detail.endDate || '' }} ></text>
      </view>
      <view class="form-item">
        <text class="label">天数</text>
        <text class="value">{{ detail.daysNum != null ? detail.daysNum : '' }}</text>
      </view>
    </view>

    <!-- 联系人信息 -->
    <view class="section">
      <view class="section-title">联系人信息</view>
      <view class="form-item">
        <text class="label">联系人</text>
        <text class="value">{{ detail.contact || '' }}</text>
      </view>
      <view class="form-item">
        <text class="label">联系电话</text>
        <text class="value">{{ detail.phoneNum || '' }}</text>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="submit-button" @click="handleAddClick">
      <text class="button-text">添加制冷供暖需求</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getHeatColdDetail } from "@/api/operations/heatCold";

const detail = ref({});

const typeMap = {
  0: "供暖",
  1: "制冷",
};

const fetchDetail = async () => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const heatColdId = currentPage.options?.heatColdId;

  if (!heatColdId) return;

  try {
    const res = await getHeatColdDetail(heatColdId);
    if (res && res.data) {
      detail.value = res.data;
    } else if (res) {
      detail.value = res;
    }
  } catch (e) {
    uni.showToast({ title: '获取详情失败', icon: 'none' });
  }
};

onMounted(() => {
  fetchDetail();
});

const handleAddClick = () => {
  uni.navigateTo({
    url: "/pages_park/asset/coolHeat/coolHeatAdd",
  });
};
</script>

<style lang="scss" scoped>
.detail-container {
  width: 100%;
  min-height: 100vh;
  background: #f5fbff;
  padding: 16px;
  padding-bottom: 80px;
}

.section {
  background: #ffffff;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  width: 83%;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.form-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.form-item:last-child {
  border-bottom: none;
}

.label {
  font-family: Source Han Sans, Source Han Sans;
  font-weight: 400;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
  line-height: 12px;
  text-align: left;
  font-style: normal;
  text-transform: none;
}

.value {
  font-family: Source Han Sans, Source Han Sans;
  font-weight: 400;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.9);
  line-height: 12px;
  text-align: right;
  font-style: normal;
  text-transform: none;
}

.arrow {
  color: rgba(0, 0, 0, 0.9);
}

.submit-button {
  position: fixed;
  bottom: 24px;
  left: 20px;
  right: 20px;
  width: 335px;
  height: 44px;
  background: #235eff;
  border-radius: 22px 22px 22px 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(35, 94, 255, 0.3);
}

.button-text {
  font-size: 16px;
  color: #ffffff;
  font-weight: 500;
  text-align: center;
}
</style>
