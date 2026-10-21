<template>
  <view class="container">
    <!-- 详情 -->
    <view class="info-section">
      <view class="info-title">填报信息</view>
      <up-line></up-line>
      <view class="info-item">
        <view class="info-label" style="text-align: left;">企业名称</view>
        <view class="info-value">{{ enterpriseName }}</view>
      </view>
      <view class="info-item">
        <view class="info-label" style="text-align: left;">填报月份</view>
        <view class="info-value">{{ reportMonth }}</view>
      </view>
    </view>
    <view class="process-section">
      <view class="process-container">
        <view class="process-row">
          <view class="process-step complete">
            <view class="step-number">1</view>
            <view class="step-label">运营情况</view>
          </view>
          <view class="process-line"></view>
          <view class="process-step complete">
            <view class="step-number">2</view>
            <view class="step-label">经营信息</view>
          </view>
          <view class="process-line"></view>
          <view class="process-step complete">
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
          <view class="process-step">
            <view class="step-number">5</view>
            <view class="step-label">技术产出</view>
          </view>
          <view class="process-line reverse"></view>
          <view class="process-step active">
            <view class="step-number">4</view>
            <view class="step-label">资质认证</view>
          </view>
        </view>
      </view>
    </view>
    <view class="info-section">
      <view class="info-title">国家科技型中小企业认定情况<span class="required">*</span></view>
      <up-line></up-line>
      <view class="info-item">
        <up-radio-group v-model="radiovalue1" placement="column" @change="groupChange">
          <up-radio :customStyle="{ marginBottom: '8px' }" v-for="(item, index) in radiolist1" :key="index"
            :label="item.name" :name="item.name" @change="radioChange">
          </up-radio>
        </up-radio-group>
      </view>
    </view>

    <view class="info-section">
      <view class="info-title">郑州市科技型企业企业认定情况<span class="required">*</span></view>
      <up-line></up-line>
      <view class="info-item">
        <up-radio-group v-model="radiovalue2" placement="column" @change="groupChange">
          <up-radio :customStyle="{ marginBottom: '8px' }" v-for="(item, index) in radiolist1" :key="index"
            :label="item.name" :name="item.name" @change="radioChange">
          </up-radio>
        </up-radio-group>
      </view>
    </view>

    <view class="info-section">
      <view class="info-title">高新技术企业认定情况<span class="required">*</span></view>
      <up-line></up-line>
      <view class="info-item">
        <up-radio-group v-model="radiovalue3" placement="column" @change="groupChange">
          <up-radio :customStyle="{ marginBottom: '8px' }" v-for="(item, index) in radiolist1" :key="index"
            :label="item.name" :name="item.name" @change="radioChange">
          </up-radio>
        </up-radio-group>
      </view>
    </view>

    <view class="info-section">
      <view class="info-title">专精特新认定情况<span class="required">*</span></view>
      <up-line></up-line>
      <view class="info-item">
        <up-radio-group v-model="radiovalue4" placement="column" @change="groupChange">
          <up-radio :customStyle="{ marginBottom: '8px' }" v-for="(item, index) in radiolist2" :key="index"
            :label="item.name" :name="item.name" @change="radioChange">
          </up-radio>
        </up-radio-group>
      </view>
    </view>

    <view class="info-section">
      <view class="info-title">研发平台认定情况<span class="required">*</span></view>
      <up-line></up-line>
      <view class="info-item">
        <up-radio-group v-model="radiovalue5" placement="column" @change="groupChange">
          <up-radio :customStyle="{ marginBottom: '8px' }" v-for="(item, index) in radiolist2" :key="index"
            :label="item.name" :name="item.name" @change="radioChange">
          </up-radio>
        </up-radio-group>
      </view>
      <view class="info-item" style="display: block;">
        <view style="margin-bottom: 30rpx;color: #666666;font-size: 28rpx;">平台名称(如有)</view>
        <up-textarea v-model="value1" placeholder="请填写"></up-textarea>
      </view>
    </view>

    

    <view class="info-section">
      <view class="info-title">规上企业认定情况<span class="required">*</span></view>
      <up-line></up-line>
      <view class="info-item">
        <up-radio-group v-model="radiovalue6" placement="column" @change="groupChange">
          <up-radio :customStyle="{ marginBottom: '8px' }" v-for="(item, index) in radiolist1" :key="index"
            :label="item.name" :name="item.name" @change="radioChange">
          </up-radio>
        </up-radio-group>
      </view>
    </view>

    <view class="info-section">
      <view class="info-title">本年度是否计划入规</view>
      <up-line></up-line>
      <view class="info-item">
        <up-radio-group v-model="radiovalue7" placement="column" @change="groupChange">
          <up-radio :customStyle="{ marginBottom: '8px' }" v-for="(item, index) in radiolist1" :key="index"
            :label="item.name" :name="item.name" @change="radioChange">
          </up-radio>
        </up-radio-group>
      </view>
    </view>

    <!-- 按钮 -->
    <view class="button-container">
      <button class="prev-button" @click="navigateToPrev">上一项</button>
      <button class="next-button" @click="navigateToNext">下一项</button>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useStore } from 'vuex';
import { onLoad } from '@dcloudio/uni-app';

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
// 企业名称、填报月份
const enterpriseName = computed(() => detailInfo.value.enterpriseName || '');
const reportMonth = computed(() => detailInfo.value.createTime || '');

// 计算属性获取各项认证状态
const radiovalue1 = computed({
  get: () => detailInfo.value.nationalTechSme || '是',
  set: (value) => store.commit('setDetailInfo', { ...detailInfo.value, nationalTechSme: value })
});

const radiovalue2 = computed({
  get: () => detailInfo.value.zhengzhouTechSme || '是',
  set: (value) => store.commit('setDetailInfo', { ...detailInfo.value, zhengzhouTechSme: value })
});

const radiovalue3 = computed({
  get: () => detailInfo.value.highTechEnterprise || '是',
  set: (value) => store.commit('setDetailInfo', { ...detailInfo.value, highTechEnterprise: value })
});

const radiovalue4 = computed({
  get: () => detailInfo.value.specializationIdentification || '省级',
  set: (value) => store.commit('setDetailInfo', { ...detailInfo.value, specializationIdentification: value })
});

const radiovalue5 = computed({
  get: () => detailInfo.value.rdpPlatformIdentification || '省级',
  set: (value) => store.commit('setDetailInfo', { ...detailInfo.value, rdpPlatformIdentification: value })
});

const value1 = computed({
  get: () => detailInfo.value.platformName || '',
  set: (value) => store.commit('setDetailInfo', { ...detailInfo.value, platformName: value })
});

const radiovalue6 = computed({
  get: () => detailInfo.value.aboveScaleIdentification || '是',
  set: (value) => store.commit('setDetailInfo', { ...detailInfo.value, aboveScaleIdentification: value })
});

const radiovalue7 = computed({
  get: () => detailInfo.value.planToEnterScaleThisYear || '是',
  set: (value) => store.commit('setDetailInfo', { ...detailInfo.value, planToEnterScaleThisYear: value })
});

// 基本案列数据
const radiolist1 = reactive([
  {
    name: '是',
    disabled: false,
  },
  {
    name: '否',
    disabled: false,
  },
]);

const radiolist2 = reactive([
  {
    name: '省级',
    disabled: false,
  },
  {
    name: '市级',
    disabled: false,
  },
  {
    name: '无',
    disabled: false,
  },
]);

const groupChange = (n) => {
  console.log('groupChange', n);
};

const radioChange = (n) => {
  console.log('radioChange', n);
};

const navigateToPrev = () => {
  uni.navigateBack({
    delta: 1
  });
};
const navigateToNext = () => {
  uni.navigateTo({
    url: `/pages_info/info/report5?id=${enterpriseId.value}`
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
        width: 420rpx;
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