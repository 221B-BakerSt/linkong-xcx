<template>
  <view class="container">
    <!-- 详情 -->
    <view class="info-section">
      <view class="info-title">填报信息</view>
      <up-line></up-line>
      <view class="info-item">
        <view class="info-label">企业名称</view>
        <view class="info-value">{{ detailInfo.enterpriseName || '-' }}</view>
      </view>
      <view class="info-item">
        <view class="info-label">填报月份</view>
        <view class="info-value">{{ detailInfo.createTime || '-' }}</view>
      </view>
    </view>
    <view class="process-section">
      <view class="process-container">
        <view class="process-row">
          <view class="process-step active">
            <view class="step-number">1</view>
            <view class="step-label">运营情况</view>
          </view>
          <view class="process-line"></view>
          <view class="process-step" >
            <view class="step-number">2</view>
            <view class="step-label">经营信息</view>
          </view>
          <view class="process-line"></view>
          <view class="process-step" >
            <view class="step-number">3</view>
            <view class="step-label">人员信息</view>
            <view class="vertical-line"></view>
          </view>
        </view>
        <view class="process-row second-row">
          <view class="process-step">
            <view class="step-number">6</view>
            <view class="step-label">政策申报</view>
          </view>
          <view class="process-line reverse"></view>
          <view class="process-step" >
            <view class="step-number">5</view>
            <view class="step-label">技术产出</view>
          </view>
          <view class="process-line reverse"></view>
          <view class="process-step" >
            <view class="step-number">4</view>
            <view class="step-label">资质认证</view>
          </view>
        </view>
      </view>
    </view>
    <!-- 选项 -->
    <view class="info-section">
      <view class="info-title">项目投资备案证明<span class="required">*</span></view>
      <up-line></up-line>
      <view class="info-item">
        <up-radio-group v-model="detailInfo.projectInvestmentRecorded" placement="column" @change="groupChange">
          <up-radio :customStyle="{ marginBottom: '8px' }" v-for="(item, index) in radiolist1" :key="index"
            :label="item.name" :name="item.name" @change="radioChange">
          </up-radio>
        </up-radio-group>
      </view>

      <view class="info-item" v-if="detailInfo.projectInvestmentRecorded !== '已完成'">
        <view class="">预计完成时间</view>
        <view class="info-value" @click="timeShow = true">
          <text>{{ formattedTime }}</text>
          <up-icon name="calendar"></up-icon>
        </view>
      </view>

    </view>

    <!-- 消防手续办理进度 -->
    <view class="info-section">
      <view class="info-title">消防手续办理进度<span class="required">*</span></view>
      <up-line></up-line>
      <view class="info-item">
        <up-radio-group v-model="detailInfo.fireApprovalCompleted" placement="column" @change="groupChange">
          <up-radio :customStyle="{ marginBottom: '8px' }" v-for="(item, index) in radiolist1" :key="index"
            :label="item.name" :name="item.name" @change="radioChange">
          </up-radio>
        </up-radio-group>
      </view>
      <view class="info-item" v-if="detailInfo.fireApprovalCompleted !== '已完成'">
        <view class="">预计完成时间</view>
        <view class="info-value" @click="timeShow2 = true">
          <text>{{ formattedTime2 }}</text>
          <up-icon name="calendar"></up-icon>
        </view>
      </view>
    </view>

    <!-- 安评手续办理进度 -->
    <view class="info-section">
      <view class="info-title">安评手续办理进度<span class="required">*</span></view>
      <up-line></up-line>
      <view class="info-item">
        <up-radio-group v-model="detailInfo.safetyAssessmentCompleted" placement="column" @change="groupChange">
          <up-radio :customStyle="{ marginBottom: '8px' }" v-for="(item, index) in radiolist1" :key="index"
            :label="item.name" :name="item.name" @change="radioChange">
          </up-radio>
        </up-radio-group>
      </view>
      <view class="info-item" v-if="detailInfo.safetyAssessmentCompleted !== '已完成'">
        <view class="">预计完成时间</view>
        <view class="info-value" @click="timeShow3 = true">
          <text>{{ formattedTime3 }}</text>
          <up-icon name="calendar"></up-icon>
        </view>
      </view>
    </view>

    <!-- 职评手续办理进度 -->
    <view class="info-section">
      <view class="info-title">职评手续办理进度<span class="required">*</span></view>
      <up-line></up-line>
      <view class="info-item">
        <up-radio-group v-model="detailInfo.occupationalAssessmentCompleted" placement="column" @change="groupChange">
          <up-radio :customStyle="{ marginBottom: '8px' }" v-for="(item, index) in radiolist1" :key="index"
            :label="item.name" :name="item.name" @change="radioChange">
          </up-radio>
        </up-radio-group>
      </view>
      <view class="info-item" v-if="detailInfo.occupationalAssessmentCompleted !== '已完成'">
        <view class="">预计完成时间</view>
        <view class="info-value" @click="timeShow4 = true">
          <text>{{ formattedTime4 }}</text>
          <up-icon name="calendar"></up-icon>
        </view>
      </view>
    </view>

    <!-- 运营进度 -->
    <view class="info-section">
      <view class="info-title">运营进度<span class="required">*</span></view>
      <up-line></up-line>
      <view class="info-item">
        <up-radio-group v-model="detailInfo.operationStarted" placement="column" @change="groupChange">
          <up-radio :customStyle="{ marginBottom: '8px' }" v-for="(item, index) in radiolist1" :key="index"
            :label="item.name" :name="item.name" @change="radioChange">
          </up-radio>
        </up-radio-group>
      </view>
      <view class="info-item" v-if="detailInfo.operationStarted !== '已完成'">
        <view class="">预计完成时间</view>
        <view class="info-value" @click="timeShow5 = true">
          <text>{{ formattedTime5 }}</text>
          <up-icon name="calendar"></up-icon>
        </view>
      </view>
    </view>
    <!-- 企业状态 -->
    <view class="info-section">
      <view class="info-title">企业状态<span class="required">*</span></view>
      <up-line></up-line>
      <view class="info-item">
        <view class="info-label">企业状态</view>
        <view class="right" @click="changeType">
          <text>{{ detailInfo.enterpriseStatus || '' }}</text>
          <up-icon name="arrow-right"></up-icon>
        </view>
      </view>
      <view class="info-item">
        <view class="info-label">生产状态</view>
        <view class="right" @click="changeProductionType">
          <text>{{ detailInfo.productionStatus || '' }}</text>
          <up-icon name="arrow-right"></up-icon>
        </view>
      </view>
    </view>
     <!-- 下月重点申报政策 -->
    <view class="info-section">
      <view class="info-title">在园企业<span class="required">*</span></view>
      <up-line></up-line>
      <view class="policy-list">
        <view class="policy-item" v-for="(item, index) in policyCompanies" :key="index">
          <view class="company-info">
            <view class="company-name">{{ item.name }}</view>
            <view class="company-code">{{ item.code }}</view>
          </view>
          <view class="delete-btn" @click="deleteCompany(index)">
          <image src="/pages_info/static/del.svg" class="delete-icon" style="width: 32rpx; height: 32rpx;"></image>
          </view>
        </view>
        <view class="add-company" @click="showAddCompany = true">
          <image src="/pages_info/static/add.svg" class="add-icon" style="width: 32rpx; height: 32rpx;"></image>
          <text>在园企业</text>
        </view>
      </view>
    </view>
    <!-- 预约按钮 -->
        <view class="button-container">
            <button class="reserve-button" @click="navigateToSuccess">下一项</button>
        </view>
    <!-- 日期时间 -->
    <up-datetime-picker ref="datetimePickerRef" :show="timeShow" v-model="timeData" mode="date" :formatter="formatter"
      :min-date="minDate" :max-date="maxDate" @cancel="timeShow = false" @change="changeTime"
      @confirm="confirmTime"></up-datetime-picker>

    <!-- 消防手续办理进度时间 -->
    <up-datetime-picker ref="datetimePickerRef2" :show="timeShow2" v-model="timeData2" mode="date"
      :formatter="formatter" :min-date="minDate" :max-date="maxDate" @cancel="timeShow2 = false" @change="changeTime2"
      @confirm="confirmTime2"></up-datetime-picker>

    <!-- 安评手续办理进度时间 -->
    <up-datetime-picker ref="datetimePickerRef3" :show="timeShow3" v-model="timeData3" mode="date"
      :formatter="formatter" :min-date="minDate" :max-date="maxDate" @cancel="timeShow3 = false" @change="changeTime3"
      @confirm="confirmTime3"></up-datetime-picker>

    <!-- 职评手续办理进度时间 -->
    <up-datetime-picker ref="datetimePickerRef4" :show="timeShow4" v-model="timeData4" mode="date"
      :formatter="formatter" :min-date="minDate" :max-date="maxDate" @cancel="timeShow4 = false" @change="changeTime4"
      @confirm="confirmTime4"></up-datetime-picker>

    <!-- 运营进度时间 -->
    <up-datetime-picker ref="datetimePickerRef5" :show="timeShow5" v-model="timeData5" mode="date"
      :formatter="formatter" :min-date="minDate" :max-date="maxDate" @cancel="timeShow5 = false" @change="changeTime5"
      @confirm="confirmTime5"></up-datetime-picker>
    <!-- 企业状态 -->
    <up-picker :show="typeShow" :columns="columns" @change="typeChange" @confirm="confirmType" @cancel="cancelType"
      keyName="label" valueName="value"></up-picker>
    
    <!-- 生产状态选择器 -->
    <up-picker :show="productionTypeShow" :columns="productionColumns" @confirm="confirmProductionType" @cancel="cancelProductionType"
      keyName="label" valueName="value"></up-picker>
    
   
    
   <up-popup v-model:show="showAddCompany" mode="center" round="20rpx">
      <view class="popup-content">
        <view class="popup-title">新增园区企业</view>
        <view class="form-item">
          <view class="form-label">企业名称</view>
          <input type="text" v-model="newCompany.name" placeholder="请输入企业名称" class="form-input" />
        </view>
        <view class="form-item">
          <view class="form-label">信用代码</view>
          <input type="text" v-model="newCompany.code" placeholder="请输入信用代码" class="form-input" />
        </view>
        <view class="popup-buttons">
          <button class="cancel-btn" @click="cancelAddCompany">取消</button>
          <button class="confirm-btn" @click="confirmAddCompany">确定</button>
        </view>
      </view>
    </up-popup>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { onLoad } from '@dcloudio/uni-app';

const store = useStore();
// 企业ID
const enterpriseId = ref(null);

onLoad((options) => {
  if (options.id) {
    enterpriseId.value = options.id;
    store.commit('setEnterpriseId', options.id);
    store.dispatch('fetchEnterpriseInfo', options.id);
  }
});

// 计算属性获取企业详情
const detailInfo = computed(() => store.getters.detailInfo);
// 计算属性获取在园企业列表
const policyCompanies = computed(() => {
  return detailInfo.value.enterpriseInfoOthers || [];
});

// 基本案列数据
const radiolist1 = reactive([
  {
    name: '已完成',
    disabled: false,
  },
  {
    name: '否',
    disabled: false,
  },
]);


const groupChange = (n) => {
  console.log('groupChange', n);
};

const radioChange = (n) => {
  console.log('radioChange', n);
};


const timeShow = ref(false);
const timeData = ref(Date.now());
const datetimePickerRef = ref(null);
const minDate = ref(Date.now());
// 计算12个月后的日期
const maxDateValue = new Date();
maxDateValue.setMonth(maxDateValue.getMonth() + 12);
const maxDate = ref(maxDateValue.getTime());

// 消防手续办理进度时间
const timeShow2 = ref(false);
const timeData2 = ref(Date.now());
const datetimePickerRef2 = ref(null);

// 安评手续办理进度时间
const timeShow3 = ref(false);
const timeData3 = ref(Date.now());
const datetimePickerRef3 = ref(null);

// 职评手续办理进度时间
const timeShow4 = ref(false);
const timeData4 = ref(Date.now());
const datetimePickerRef4 = ref(null);

// 运营进度时间
const timeShow5 = ref(false);
const timeData5 = ref(Date.now());
const datetimePickerRef5 = ref(null);

// 格式化时间显示
const formattedTime = computed(() => {
  const date = new Date(timeData.value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day} `;
});

const formattedTime2 = computed(() => {
  const date = new Date(timeData2.value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day} `;
});

const formattedTime3 = computed(() => {
  const date = new Date(timeData3.value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day} `;
});

const formattedTime4 = computed(() => {
  const date = new Date(timeData4.value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day} `;
});

const formattedTime5 = computed(() => {
  const date = new Date(timeData5.value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day} `;
});

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
onMounted(() => {
  if (datetimePickerRef.value) {
    datetimePickerRef.value.setFormatter(formatter);
  }
  if (datetimePickerRef2.value) {
    datetimePickerRef2.value.setFormatter(formatter);
  }
  if (datetimePickerRef3.value) {
    datetimePickerRef3.value.setFormatter(formatter);
  }
  if (datetimePickerRef4.value) {
    datetimePickerRef4.value.setFormatter(formatter);
  }
  if (datetimePickerRef5.value) {
    datetimePickerRef5.value.setFormatter(formatter);
  }
});
// 选择时间后触发事件
const changeTime = (e) => {
  timeData.value = e.detail.value;
}

const changeTime2 = (e) => {
  timeData2.value = e.detail.value;
}

const changeTime3 = (e) => {
  timeData3.value = e.detail.value;
}

const changeTime4 = (e) => {
  timeData4.value = e.detail.value;
}

const changeTime5 = (e) => {
  timeData5.value = e.detail.value;
}

// 确认预约时间
const confirmTime = (e) => {
  timeShow.value = false;
}

const confirmTime2 = (e) => {
  timeShow2.value = false;
}

const confirmTime3 = (e) => {
  timeShow3.value = false;
}

const confirmTime4 = (e) => {
  timeShow4.value = false;
}

const confirmTime5 = (e) => {
  timeShow5.value = false;
}


const typeShow = ref(false);
const columns = ref([[{
  value: '正常运营',
  label: '正常运营'
},
{
  value: '筹备中',
  label: '筹备中'
},{
  value: '暂停运营',
  label: '暂停运营'
}
]

]);
const selectedType = ref('');

const changeType = (e) => {
  typeShow.value = true;
}

const typeChange = (e) => {
  console.log('typeChange', e);
}

const confirmType = (e) => {
  typeShow.value = false;
  console.log(e);
  detailInfo.value.enterpriseStatus = e.value[0].label;
}

const cancelType = (e) => {
  typeShow.value = false;
}

// 生产状态
const productionTypeShow = ref(false);
const productionColumns = ref([[{
  value: '量产中',
  label: '量产中'
},
{
  value: '试生产',
  label: '试生产'
},
{
  value: '研发阶段',
  label: '研发阶段'
},
]

]);
const selectedProductionType = ref('');

const changeProductionType = (e) => {
  productionTypeShow.value = true;
}

const confirmProductionType = (e) => {
  productionTypeShow.value = false;
  console.log(e);
  detailInfo.value.productionStatus = e.value[0].label;
}

const cancelProductionType = (e) => {
  productionTypeShow.value = false;
}



const showAddCompany = ref(false);
const newCompany = ref({
  name: '',
  code: ''
});

const deleteCompany = (index) => {
  // 复制一份在园企业列表
  const updatedCompanies = [...policyCompanies.value];
  updatedCompanies.splice(index, 1);
  // 更新store中的在园企业列表
  store.commit('setDetailInfo', {
    ...detailInfo.value,
    enterpriseInfoOthers: updatedCompanies
  });
};

const cancelAddCompany = () => {
  showAddCompany.value = false;
};
const confirmAddCompany = () => {
  if (newCompany.value.name && newCompany.value.code) {
    // 复制一份在园企业列表
    const updatedCompanies = [...policyCompanies.value];
    updatedCompanies.push({ ...newCompany.value });
    // 更新store中的在园企业列表
    store.commit('setDetailInfo', {
      ...detailInfo.value,
      enterpriseInfoOthers: updatedCompanies
    });
    newCompany.value = { name: '', code: '' };
    showAddCompany.value = false;
  }
};
const navigateToSuccess = () => {
    uni.navigateTo({
        url: `/pages_info/info/report2?id=${enterpriseId.value}`
    });
}
</script>

<style scoped lang="scss">
.container {
  flex: 1;
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 100rpx;
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
      margin-left: 8rpx;
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
    }

    .info-value {
      display: flex;
      align-items: center;
      font-size: 24rpx;
      color: rgba(0, 0, 0, 0.9);
    }

    .right {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      width: 60%;
    }
  }


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

/* 下月重点申报政策样式 */
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
    .company-info {
      flex: 1;
    }
    .company-name {
      font-size: 24rpx;
      color: #333;
      margin-bottom: 8rpx;
    }
    .company-code {
      font-size: 20rpx;
      color: #999;
    }
    .delete-btn {
      color: #EA0000;
    }
  }
  .add-company {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20rpx 0;
    color: #235EFF;
    font-size: 24rpx;
    .uni-icon {
      margin-right: 8rpx;
    }
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
  }
  .popup-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 40rpx;
    .cancel-btn,
    .confirm-btn {
      width: 48%;
      border: none;
      border-radius: 10rpx;
      font-size: 24rpx;
    }
    .cancel-btn {
      background-color: #fff;
      color: #235EFF;
      border: 1px solid #235EFF;
    }
    .confirm-btn {
      background-color: #235EFF;
      color: #fff;
    }
    
  }
}
 .button-container {
        padding: 0 30rpx;
        margin-top: 36px;

        .reserve-button {
            width: 100%;
            height: 80rpx;
            background-color: #235EFF;
            color: #ffffff;
            border-radius: 40rpx;
            font-size: 16px;
            border: none;
        }
    }
/* 右侧箭头样式 */
.right {
  display: flex;
  align-items: center;
  color: #999;
  .uni-icon {
    margin-left: 8rpx;
  }
}

/* 弹窗安全区域样式 */
::v-deep(.up-popup ){
  .u-popup__content{
.u-safe-bottom {
    height: 0rpx !important;
  }
  }
  
}
</style>