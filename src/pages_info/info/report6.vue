<template>
  <view class="container">
     <!-- 详情 -->
        <view class="info-section">
            <view class="info-title">填报信息</view>
            <up-line></up-line>
            <view class="info-item">
                <view class="info-label" style="text-align: left;">企业名称</view>
                <view class="info-value" >{{ detailInfo.enterpriseName||'-' }}</view>
            </view>
              <view class="info-item">
                <view class="info-label" style="text-align: left;">填报月份</view>
                <view class="info-value">{{ detailInfo.reportMonth ||'-' }}</view>
            </view>
        </view>
    <view class="process-section">
      <view class="process-container">
        <view class="process-row">
          <view class="process-step complete" >
            <view class="step-number">1</view>
            <view class="step-label">运营情况</view>
          </view>
          <view class="process-line"></view>
          <view class="process-step complete">
            <view class="step-number">2</view>
            <view class="step-label">经营信息</view>
          </view>
          <view class="process-line"></view>
          <view class="process-step complete" >
            <view class="step-number">3</view>
            <view class="step-label">人员信息</view>
            <view class="vertical-line"></view>
          </view>
        </view>
        <view class="process-row second-row">
          <view class="process-step active" >
            <view class="step-number">6</view>
            <view class="step-label">政策申报</view>
          </view>
          <view class="process-line reverse"></view>
          <view class="process-step complete" >
            <view class="step-number">5</view>
            <view class="step-label">技术产出</view>
          </view>
          <view class="process-line reverse"></view>
          <view class="process-step complete" >
            <view class="step-number">4</view>
            <view class="step-label">资质认证</view>
          </view>
        </view>
      </view>
    </view>
       <!-- 本月政策奖补资金情况 -->
       <view class="info-section">
      <view class="info-title">本月政策奖补资金情况<span class="required">*</span></view>
      <up-line></up-line>
      <view class="info-item">
        <view class="info-label">获得奖补资金</view>
        <view class="input-container">
          <input type="number" placeholder="请填写" class="info-input" v-model="detailInfo.policySubsidyReceived"  />
          <view class="unit">万元</view>
        </view>
      </view>
      <view class="info-item">
        <view class="info-label">实际获得奖补资金</view>
        <view class="input-container">
          <input type="number" placeholder="请填写" class="info-input" v-model="detailInfo.actualSubsidyReceived" />
          <view class="unit">万元</view>
        </view>
      </view>
    </view>
    <!-- 本月已申报政策 -->
    <view class="info-section">
      <view class="info-title">本月已申报政策</view>
      <up-line></up-line>
      <view class="policy-list">
        <view class="policy-item" v-for="(item, index) in monthlyPolicies" :key="index">
          <view class="policy-name">{{ item.name ||'-' }}</view>
          <view class="policy-status">
            <text>{{ item.status ||'-' }}</text>
            <image src="/pages_info/static/del.svg" class="delete-icon" style="width: 32rpx; height: 32rpx; margin-left: 20rpx;" @click="deleteMonthlyPolicy(index)"></image>
          </view>
        </view>
        <view class="add-policy" @click="showAddMonthlyPolicy = true">
          <text>+ 新增数据</text>
        </view>
      </view>
    </view>

    <!-- 下月重点申报政策 -->
    <view class="info-section">
      <view class="info-title">下月重点申报政策</view>
      <up-line></up-line>
      <view class="policy-list">
        <view class="policy-item" v-for="(item, index) in nextMonthPolicies" :key="index">
          <view class="policy-name">{{ item.name ||'-' }}</view>
          <view class="policy-status">
            <text>{{ item.date ||'-' }}</text>  
            <image src="/pages_info/static/del.svg" class="delete-icon" style="width: 32rpx; height: 32rpx; margin-left: 20rpx;" @click="deleteNextMonthPolicy(index)"></image>
          </view>
        </view>
        <view class="add-policy" @click="showAddNextMonthPolicy = true">
          <text>+ 新增数据</text>
        </view>
      </view>
    </view>

    <!-- 按钮 -->
  <view class="button-container">
      <button class="prev-button" @click="navigateToPrev">上一项</button>
      <button class="next-button" @click="navigateToNext">保存提交</button>
    </view>

    <!-- 新增本月政策弹窗 -->
    <up-popup v-model:show="showAddMonthlyPolicy" mode="center" round="20rpx">
      <view class="popup-content">
        <view class="popup-title">新增本月已申报政策</view>
        <view class="form-item">
          <view class="form-label">政策名称</view>
          <input type="text" v-model="newMonthlyPolicy.name" placeholder="请输入政策名称" class="form-input" />
        </view>
        <view class="form-item">
          <view class="form-label">申报状态</view>
          <view class="radio-group-container">
            <up-radio-group v-model="newMonthlyPolicy.status" placement="column">
              <up-radio label="已申报" name="已申报" :customStyle="{ marginBottom: '16rpx' }"></up-radio>
              <up-radio label="申报中" name="申报中"></up-radio>
            </up-radio-group>
          </view>
        </view>
        <view class="popup-buttons">
          <button class="popup-cancel" @click="showAddMonthlyPolicy = false">取消</button>
          <button class="popup-confirm" @click="confirmAddMonthlyPolicy">确定</button>
        </view>
      </view>
    </up-popup>

    <!-- 新增下月政策弹窗 -->
    <up-popup v-model:show="showAddNextMonthPolicy" mode="center" round="20rpx">
      <view class="popup-content">
        <view class="popup-title">新增下月重点申报政策</view>
        <view class="form-item">
          <view class="form-label">政策名称</view>
          <input type="text" v-model="newNextMonthPolicy.name" placeholder="请输入政策名称" class="form-input" />
        </view>
        <view class="form-item">
          <view class="form-label">申报日期</view>
          <view class="date-picker" @click="timeShow6 = true">
            <text>{{ formattedDate }}</text>
          </view>
        </view>
        <view class="popup-buttons">
          <button class="popup-cancel" @click="showAddNextMonthPolicy = false">取消</button>
          <button class="popup-confirm" @click="confirmAddNextMonthPolicy">确定</button>
        </view>
      </view>
    </up-popup>

    <!-- 申报日期选择器 -->
    <up-datetime-picker ref="datetimePickerRef6" :show="timeShow6" v-model="timeData6" mode="date" :formatter="formatter"
      :min-date="minDate" :max-date="maxDate" @cancel="timeShow6 = false" @change="changeTime6"
      @confirm="confirmTime6"></up-datetime-picker>
  </view>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { onLoad } from '@dcloudio/uni-app';
import { addCorporateOld } from '@/api/park/park.js';

const store = useStore();
const enterpriseId = ref(null);

onLoad((options) => {
  if (options.id) {
    enterpriseId.value = options.id;
    store.commit('setEnterpriseId', options.id);
    // 只有当store中没有数据时才请求
    if (!store.getters.detailInfo.enterpriseName) {
      store.dispatch('fetchEnterpriseInfo', options.id);
    }
  }
});

// 计算属性获取企业详情
const detailInfo = computed(() => store.getters.detailInfo);
// 计算属性获取本月已申报政策
const monthlyPolicies = computed(() => store.getters.monthlyPolicies);
// 计算属性获取下月重点申报政策
const nextMonthPolicies = computed(() => store.getters.nextMonthPolicies);

// 监听detailInfo变化，在第六个页面打印数据
watch(() => detailInfo.value, (newValue) => {
  if (newValue.enterpriseName) {
    console.log('第六个页面数据:', newValue);
  }
}, { deep: true });

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}.${month}.${day}`;
};

// 新增本月政策
const showAddMonthlyPolicy = ref(false);
const newMonthlyPolicy = ref({
  name: '',
  status: '已申报'
});

// 新增下月政策
const showAddNextMonthPolicy = ref(false);
const newNextMonthPolicy = ref({
  name: '',
  date: ''
});

// 日期选择器相关
const timeShow6 = ref(false);
const timeData6 = ref(Date.now());
const datetimePickerRef6 = ref(null);
const minDate = ref(Date.now());
const maxDateValue = new Date();
maxDateValue.setMonth(maxDateValue.getMonth() + 12);
const maxDate = ref(maxDateValue.getTime());

// 格式化日期显示
const formattedDate = computed(() => {
  const date = new Date(timeData6.value);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}.${month}.${day}`;
});

// 日期格式化方法
const formatter = (type, value) => {
  if (type === 'year') {
    return `${value}年`;
  }
  if (type === 'month') {
    return `${value}月`;
  }
  if (type === 'day') {
    return `${value}日`;
  }
  return value;
};

// 生命周期
onMounted(() => {
  if (datetimePickerRef6.value) {
    datetimePickerRef6.value.setFormatter(formatter);
  }
});

// 日期选择事件
const changeTime6 = (e) => {
  timeData6.value = e.detail.value;
};

// 日期确认事件
const confirmTime6 = () => {
  newNextMonthPolicy.value.date = formattedDate.value;
  timeShow6.value = false;
};

// 删除本月政策
const deleteMonthlyPolicy = (index) => {
  store.commit('deleteMonthlyPolicy', index);
  store.commit('updateDetailInfoPolicies');
};

// 删除下月政策
const deleteNextMonthPolicy = (index) => {
  store.commit('deleteNextMonthPolicy', index);
  store.commit('updateDetailInfoPolicies');
};

// 确认添加本月政策
const confirmAddMonthlyPolicy = () => {
  if (newMonthlyPolicy.value.name) {
    const newPolicy = {
      id: monthlyPolicies.value.length + 1,
      name: newMonthlyPolicy.value.name,
      status: newMonthlyPolicy.value.status
    };
    store.commit('addMonthlyPolicy', newPolicy);
    store.commit('updateDetailInfoPolicies');
    newMonthlyPolicy.value = {
      name: '',
      status: '已申报'
    };
    showAddMonthlyPolicy.value = false;
  }
};

// 确认添加下月政策
const confirmAddNextMonthPolicy = () => {
  if (newNextMonthPolicy.value.name) {
    // 如果date为空，使用当前选择的日期作为默认值
    const date = newNextMonthPolicy.value.date || formattedDate.value;
    const newPolicy = {
      id: nextMonthPolicies.value.length + 1,
      name: newNextMonthPolicy.value.name,
      date: date
    };
    store.commit('addNextMonthPolicy', newPolicy);
    store.commit('updateDetailInfoPolicies');
    newNextMonthPolicy.value = {
      name: '',
      date: ''
    };
    showAddNextMonthPolicy.value = false;
  }
};

// 导航方法
const navigateToPrev = () => {
  uni.navigateBack({
    delta: 1
  });
};

const navigateToNext = () => {
  // 新增企业基础信息
  addCorporateOld(detailInfo.value).then(res => {
    if (res.code === 200) {
      uni.showToast({
        title: '新增成功',
        icon: 'success'
      });
      // 新增成功后，跳转到成功页面
      uni.navigateTo({
        url: '/pages_info/info/success'
      });
    } else {
      uni.showToast({
        title: res.msg || '新增失败',
        icon: 'none'
      });
    }
  });
};
</script>

<style scoped lang="scss">
.container {
  flex: 1;
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 100rpx;

}
 .button-container {
        padding: 0 30rpx;
        margin-top: 36px;
        display: flex;
        flex-direction: column;
        gap: 20rpx;

        .prev-button,
        .next-button {
            width: 100%;
            height: 80rpx;
            border-radius: 40rpx;
            font-size: 16px;
            border: none;
        }
        .prev-button {
            background-color: #fff;
            color: #235EFF;
            border: 1px solid #235EFF;
        }
        .next-button {
            background-color: #235EFF;
            color: #ffffff;
        }
    }
  .info-section {
        width: 85%;
        margin: 30rpx auto;
        background-color: #fff;
        border-radius: 20rpx;
        padding: 30rpx;

        .info-title {
            font-size: 28rpx;
            font-weight: bold;
            color: rgba(0, 0, 0, 0.9);
            padding: 0rpx 0rpx 20rpx 0;

            .required {
                color: #EA0000;
            }
        }

        .info-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 30rpx 0;
            color: rgba(0, 0, 0, 0.9);
            font-size: 24rpx;

            .info-label {
                font-size: 24rpx;
                color: rgba(0, 0, 0, 0.6);
                text-align: right;
                flex: 1;
                margin-right: 20rpx;
            }

            .info-value {
                display: flex;
                align-items: center;
                font-size: 24rpx;
                color: rgba(0, 0, 0, 0.9);
            }
            
            .input-container {
                display: flex;
                align-items: center;
                gap: 10rpx;
                .info-input {
                    width: 350rpx;
                    height: 60rpx;
                    padding: 0 15rpx;
                    font-size: 24rpx;
                }
                .unit {
                    font-size: 24rpx;
                    color: #666;
                }
            }
        }


    }

/* 政策列表样式 */
.policy-list {
  .policy-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1px solid #f0f0f0;
    &:last-child {
      border-bottom: none;
    }
    .policy-name {
      font-size: 24rpx;
      color: #333;
      flex: 1;
    }
    .policy-status {
      display: flex;
      align-items: center;
      font-size: 24rpx;
      color: #666;
    }
    .delete-btn {
      color: #EA0000;
    }
  }
  .add-policy {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20rpx 0;
    color: #235EFF;
    font-size: 24rpx;
  }
}

/* 弹窗样式 */
.popup-content {
  width: 500rpx;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  .popup-title {
    font-size: 28rpx;
    font-weight: bold;
    color: #333;
    text-align: center;
    margin-bottom: 30rpx;
  }
  .form-item {
    margin-bottom: 20rpx;
    .form-label {
      font-size: 24rpx;
      color: #666;
      margin-bottom: 10rpx;
    }
    .form-input {
      width: 100%;
      height: 80rpx;
      padding: 0 20rpx;
      border: 1px solid #e5e5e5;
      border-radius: 10rpx;
      font-size: 24rpx;
      box-sizing: border-box;
    }
    .date-picker {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 80rpx;
      padding: 0 20rpx;
      border: 1px solid #e5e5e5;
      border-radius: 10rpx;
      font-size: 24rpx;
      box-sizing: border-box;
      background-color: #fff;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        border-color: #235EFF;
      }
      
      text {
        color: #333;
      }
      
      .calendar-icon {
        margin-left: 10rpx;
      }
    }
    
    .radio-group-container {
      padding: 10rpx 0;
      
      :deep(.up-radio) {
        font-size: 24rpx;
        color: #333;
        
        :deep(.up-radio__icon) {
          width: 32rpx;
          height: 32rpx;
          
          &.up-radio__icon--active {
            border-color: #235EFF;
            background-color: #235EFF;
          }
        }
        
        :deep(.up-radio__label) {
          margin-left: 12rpx;
        }
      }
    }
  }
  .popup-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 40rpx;
    .popup-cancel,
    .popup-confirm {
      width: 48%;
      border: none;
      border-radius: 10rpx;
      font-size: 24rpx;
    }
    .popup-cancel {
      background-color: #fff;
      color: #235EFF;
      border: 1px solid #235EFF;
    }
    .popup-confirm {
      background-color: #235EFF;
      color: #fff;
    }
  }
}

/* 弹窗安全区域样式 */
::v-deep(.up-popup ){
  .u-popup__content{
.u-safe-bottom {
    height: 0rpx !important;
  }
  }
  // .popup-confirm{
  //   height: 0 !important;
  // }
  // .popup-cancel{
  //   height: 0 !important;
  // }
  
}

.process-section {
  width: 85%;
  margin: 30rpx auto;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  .process-container {
    position: relative;

    .process-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 100rpx;

      &.second-row {
        margin-bottom: 0;
      }

      .process-step {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
        position: relative;

        .step-number {
          width: 48rpx;
          height: 48rpx;
          background-color: #e5e5e5;
          color: #999;
          font-size: 24rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16rpx;
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        }

        .step-label {
          font-size: 22rpx;
          color: #666;
          text-align: center;
          line-height: 1.4;
        }

        &.complete {
          .step-number {
            background: rgba(47, 194, 91, 0.2);
            color: #2FC25B;
          }

        }

        &.active {
          .step-number {
            background-color: #2FC25B;
            color: #fff;
          }

          .step-label {
            color: #2FC25B;
          }
        }
      }

      .process-line {
        flex: 2;
        height: 4rpx;
        background-color: transparent;
        position: relative;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4rpx;
          background-image: repeating-linear-gradient(90deg, #e9faf3 0rpx, #e9faf3 12rpx, transparent 12rpx, transparent 24rpx);
        }

        &::after {
          content: '';
          position: absolute;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
          border-top: 8rpx solid transparent;
          border-bottom: 8rpx solid transparent;
          border-left: 14rpx solid #e9faf3;
        }

        &.reverse {
          &::after {
            left: 0;
            right: auto;
            border-left: none;
            border-right: 14rpx solid #e9faf3;
          }
        }
      }

      .vertical-line {
        position: absolute;
        top: calc(100% + 16rpx);
        left: 50%;
        transform: translateX(-50%);
        width: 4rpx;
        height: 80rpx;
        background-image: repeating-linear-gradient(180deg, #e9faf3 0rpx, #e9faf3 12rpx, transparent 12rpx, transparent 24rpx);

        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          border-left: 8rpx solid transparent;
          border-right: 8rpx solid transparent;
          border-top: 14rpx solid #e9faf3;
        }
      }
    }
  }
}
</style>