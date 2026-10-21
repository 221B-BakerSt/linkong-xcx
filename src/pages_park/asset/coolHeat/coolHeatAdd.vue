<template>
  <view class="cool-heat-add-container">
    <!-- 企业信息 -->
    <view class="section">
      <view class="section-title">企业信息</view>
      <view class="form-item">
        <text class="label">企业名称</text>
        <input
          class="input-value"
          v-model="form.companyName"
          placeholder="请输入企业名称"
          placeholder-style="color:rgba(0,0,0,0.3)"
        />
      </view>
    </view>

    <!-- 供冷制暖需求 -->
    <view class="section">
      <view class="section-title">供冷制暖需求</view>
      <view class="form-item" @click="showTypePicker">
        <text class="label">供冷制暖</text>
        <text class="value arrow">{{ typeLabel }} ></text>
      </view>
      <view class="form-item">
        <text class="label">位置</text>
        <input
          class="input-value"
          v-model="form.address"
          placeholder="请输入位置"
          placeholder-style="color:rgba(0,0,0,0.3)"
        />
      </view>
      <view class="form-item">
        <text class="label">面积(m²)</text>
        <input
          class="input-value"
          v-model="form.area"
          placeholder="请输入面积"
          placeholder-style="color:rgba(0,0,0,0.3)"
          type="digit"
        />
      </view>
      <view class="form-item">
        <text class="label">开始日期</text>
        <picker mode="date" :value="form.startDate" @change="(e) => onDateChange(e, 'startDate')">
          <text class="value arrow">{{ form.startDate || '请选择' }} ></text>
        </picker>
      </view>
      <view class="form-item">
        <text class="label">结束日期</text>
        <picker mode="date" :value="form.endDate" @change="(e) => onDateChange(e, 'endDate')">
          <text class="value arrow">{{ form.endDate || '请选择' }} ></text>
        </picker>
      </view>
      <view class="form-item">
        <text class="label">天数</text>
        <text class="value">{{ computedDays }}</text>
      </view>
    </view>

    <!-- 联系人信息 -->
    <view class="section">
      <view class="section-title">联系人信息</view>
      <view class="form-item">
        <text class="label">联系人</text>
        <input
          class="input-value"
          v-model="form.contact"
          placeholder="请输入"
          placeholder-style="color:rgba(0,0,0,0.3)"
        />
      </view>
      <view class="form-item">
        <text class="label">联系电话</text>
        <input
          class="input-value"
          v-model="form.phoneNum"
          placeholder="请输入"
          placeholder-style="color:rgba(0,0,0,0.3)"
          type="number"
        />
      </view>
    </view>

    <!-- 确认提交按钮 -->
    <view class="submit-button" @click="handleSubmit">
      <text class="button-text">确认提交</text>
    </view>

    <!-- 需求类型选择器 -->
    <uni-popup ref="typePopup" type="bottom">
      <view class="picker-panel">
        <view class="picker-header">
          <text class="picker-cancel" @click="typePopup.close()">取消</text>
          <text class="picker-title">选择需求类型</text>
          <text class="picker-confirm" @click="confirmType">确认</text>
        </view>
        <picker-view class="picker-view" :value="pickerTypeIndex" @change="onTypeChange">
          <picker-view-column>
            <view class="picker-item" v-for="t in typeOptions" :key="t.value">{{ t.label }}</view>
          </picker-view-column>
        </picker-view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, computed } from "vue";
import { addHeatCold } from "@/api/operations/heatCold";

const form = ref({
  companyName: "",
  address: "",
  area: "",
  type: "",
  startDate: "",
  endDate: "",
  phoneNum: "",
  contact: "",
});

// 需求类型选项
const typeOptions = [
  { label: "制冷", value: "1" },
  { label: "供暖", value: "0" },
];
const pickerTypeIndex = ref([0]);
const tempTypeIndex = ref(0);
const typePopup = ref(null);

const typeLabel = computed(() => {
  const found = typeOptions.find((t) => t.value === form.value.type);
  return found ? found.label : "请选择";
});

// 计算天数
const computedDays = computed(() => {
  if (!form.value.startDate || !form.value.endDate) return "--";
  const start = new Date(form.value.startDate);
  const end = new Date(form.value.endDate);
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : "--";
});

// 显示类型选择器
const showTypePicker = () => {
  const idx = typeOptions.findIndex((t) => t.value === form.value.type);
  pickerTypeIndex.value = [idx >= 0 ? idx : 0];
  tempTypeIndex.value = idx >= 0 ? idx : 0;
  typePopup.value.open();
};

const onTypeChange = (e) => {
  tempTypeIndex.value = e.detail.value[0];
};

const confirmType = () => {
  form.value.type = typeOptions[tempTypeIndex.value].value;
  typePopup.value.close();
};

// 日期选择回调
const onDateChange = (e, field) => {
  form.value[field] = e.detail.value;
};

// 提交
const handleSubmit = async () => {
  if (!form.value.companyName) {
    return uni.showToast({ title: "请填写企业名称", icon: "none" });
  }
  if (!form.value.type) {
    return uni.showToast({ title: "请选择供冷制暖类型", icon: "none" });
  }
  if (!form.value.startDate || !form.value.endDate) {
    return uni.showToast({ title: "请选择日期", icon: "none" });
  }
  if (!form.value.contact) {
    return uni.showToast({ title: "请填写联系人", icon: "none" });
  }
  if (!form.value.phoneNum) {
    return uni.showToast({ title: "请填写联系电话", icon: "none" });
  }

  const days = computedDays.value;
  const params = {
    ...form.value,
    daysNum: days === "--" ? 0 : Number(days),
  };

  uni.showLoading({ title: "提交中..." });
  try {
    await addHeatCold(params);
    uni.hideLoading();
    uni.navigateTo({
      url: "/pages_park/asset/coolHeat/coolHeatSubmit",
    });
  } catch (e) {
    uni.hideLoading();
    uni.showToast({ title: "提交失败，请重试", icon: "none" });
  }
};
</script>

<style lang="scss" scoped>
.cool-heat-add-container {
  width: 100%;
  min-height: 100vh;
  background: #F5FBFF;
  padding: 16px;
  padding-bottom: 80px;
}

.section {
  background: #FFFFFF;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  width:83%;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #F0F0F0;
}

.form-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #F0F0F0;
}

.form-item:last-child {
  border-bottom: none;
}

.label {
  font-family: Source Han Sans, Source Han Sans;
font-weight: 400;
font-size: 12px;
color: rgba(0,0,0,0.6);
line-height: 12px;
text-align: left;
font-style: normal;
text-transform: none;
}

.value {
  font-family: Source Han Sans, Source Han Sans;
font-weight: 400;
font-size: 12px;
color: rgba(0,0,0,0.9);
line-height: 12px;
text-align: left;
font-style: normal;
text-transform: none;
}

.submit-button {
  position: fixed;
  bottom: 24px;
  left: 20px;
  right: 20px;
  width: 335px;
  height: 44px;
  background: #235EFF;
  border-radius: 22px 22px 22px 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(35, 94, 255, 0.3);
}

.button-text {
  font-size: 16px;
  color: #FFFFFF;
  font-weight: 500;
  text-align: center;
}

.input-value {
  flex: 1;
  font-family: Source Han Sans, Source Han Sans;
  font-weight: 400;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.9);
  line-height: 12px;
  text-align: right;
}

.arrow {
  color: rgba(0, 0, 0, 0.9);
}

.picker-panel {
  background: #FFFFFF;
  border-radius: 16px 16px 0 0;
  padding-bottom: 40px;
}

.picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #F0F0F0;
}

.picker-cancel {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.5);
}

.picker-title {
  font-size: 16px;
  font-weight: 500;
  color: #333333;
}

.picker-confirm {
  font-size: 14px;
  color: #235EFF;
}

.picker-view {
  width: 100%;
  height: 200px;
}

.picker-item {
  text-align: center;
  line-height: 44px;
  font-size: 16px;
  color: #333333;
}
</style>
