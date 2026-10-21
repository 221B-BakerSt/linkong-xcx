<template>
  <view class="container">
     <!-- 详情 -->
        <view class="info-section">
            <view class="info-title">填报信息</view>
            <up-line></up-line>
            <view class="info-item">
                <view class="info-label" style="text-align: left;">企业名称</view>
                <view class="info-value" >{{ detailInfo.enterpriseName || '-' }}</view>
            </view>
              <view class="info-item">
                <view class="info-label" style="text-align: left;">填报月份</view>
                <view class="info-value">{{ detailInfo.reportMonth || '-' }}</view>
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
          <view class="process-step  complete">
            <view class="step-number">2</view>
            <view class="step-label">经营信息</view>
          </view>
          <view class="process-line"></view>
          <view class="process-step active">
            <view class="step-number">3</view>
            <view class="step-label">人员信息</view>
            <view class="vertical-line"></view>
          </view>
        </view>
        <view class="process-row second-row">
          <view class="process-step" >
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
    <!-- 职工信息 -->
       <view class="info-section">
      <view class="info-title">职工信息<span class="required">*</span></view>
      <up-line></up-line>
      <view class="info-item">
        <view class="info-label">总人数</view>
        <view class="input-container">
          <input type="number" placeholder="请填写" class="info-input" v-model="detailInfo.totalEmployees"  />
          <view class="unit">人</view>
        </view>
      </view>
      <view class="info-item">
        <view class="info-label">男职工</view>
        <view class="input-container">
          <input type="number" placeholder="请填写" class="info-input" v-model="detailInfo.maleEmployees" />
          <view class="unit">人</view>
        </view>
      </view>
      <view class="info-item">
        <view class="info-label">女职工</view>
        <view class="input-container">
          <input type="number" placeholder="请填写" class="info-input" v-model="detailInfo.femaleEmployees" />
          <view class="unit">人</view>
        </view>
      </view>
      <view class="info-item">
        <view class="info-label">博士学历职工</view>
        <view class="input-container">
          <input type="number" placeholder="请填写" class="info-input" v-model="detailInfo.doctorEmployees" />
          <view class="unit">人</view>
        </view>
      </view><view class="info-item">
        <view class="info-label">硕士学历职工</view>
        <view class="input-container">
          <input type="number" placeholder="请填写" class="info-input" v-model="detailInfo.masterEmployees" />
          <view class="unit">人</view>
        </view>
      </view><view class="info-item">
        <view class="info-label">本科学历职工</view>
        <view class="input-container">
          <input type="number" placeholder="请填写" class="info-input" v-model="detailInfo.bachelorEmployees" />
          <view class="unit">人</view>
        </view>
      </view><view class="info-item">
        <view class="info-label">大专学历职工</view>
        <view class="input-container">
          <input type="number" placeholder="请填写" class="info-input" v-model="detailInfo.collegeEmployees" />
          <view class="unit">人</view>
        </view>
      </view><view class="info-item">
        <view class="info-label">应届毕业生</view>
        <view class="input-container">
          <input type="number" placeholder="请填写" class="info-input" v-model="detailInfo.freshGraduates" />
          <view class="unit">人</view>
        </view>
      </view>
    
    </view>
    <!-- 党员信息 -->
     <view class="info-section">
      <view class="info-title">党员信息<span class="required">*</span></view>
      <up-line></up-line>
      <view class="info-item">
        <view class="info-label">党员人数</view>
        <view class="input-container">
          <input type="number" placeholder="请填写" class="info-input" style="width: 390rpx;" v-model="detailInfo.partyMembers" />
          <view class="unit">人</view>
        </view>
      </view>
       <view class="info-item">
        <view class="info-label">28岁以下非党员</view>
        <view class="input-container">
          <input type="number" placeholder="请填写" class="info-input" style="width: 390rpx;" v-model="detailInfo.under28NonParty" />
          <view class="unit">人</view>
        </view>
      </view>
    </view>
     <!-- 实际在园人数 -->
     <view class="info-section">
      <view class="info-title">实际在园人数<span class="required">*</span></view>
      <up-line></up-line>
      <view class="info-item">
        <view class="info-label">在园职工</view>
        <view class="input-container">
          <input type="number" placeholder="请填写" class="info-input" style="width: 420rpx;" v-model="detailInfo.actualEmployeesInPark" />
          <view class="unit">人</view>
        </view>
      </view>
       <view class="info-item">
        <view class="info-label">男职工</view>
        <view class="input-container">
          <input type="number" placeholder="请填写" class="info-input" style="width: 420rpx;" v-model="detailInfo.actualMaleEmployeesInPark" />
          <view class="unit">人</view>
        </view>
      </view>
       <view class="info-item">
        <view class="info-label">女职工</view>
        <view class="input-container">
          <input type="number" placeholder="请填写" class="info-input" style="width: 420rpx;" v-model="detailInfo.actualFemaleEmployeesInPark" />
          <view class="unit">人</view>
        </view>
      </view>
      <view class="info-item">
        <view class="info-label">博士学历职工</view>
        <view class="input-container">
          <input type="number" placeholder="请填写" class="info-input" style="width: 420rpx;" v-model="detailInfo.actualDoctorEmployeesInPark" />
          <view class="unit">人</view>
        </view>
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
import { ref, computed } from 'vue';
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

const navigateToPrev = () => {
  uni.navigateBack({
    delta: 1
  });
};
const navigateToNext = () => {
  uni.navigateTo({
    url: `/pages_info/info/report4?id=${enterpriseId.value}`
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