<template>
   <view class="container">
        <!-- 预警信息 -->
        <view class="info-section">
            <view class="info-title">预警信息</view>
            <up-line></up-line>
            <view class="info-item">
                <view class="info-label">企业名称</view>
                <view class="info-value">{{ contractDetail.companyName||'-' }}</view>
            </view>
            <view class="info-item">
                <view class="info-label">预警类型</view>
                <view class="info-value">合同预警</view>
            </view>
            <view class="info-item">
                <view class="info-label">预警时间</view>
                <view class="info-value">{{ contractDetail.createTime||'-' }}</view>
            </view>
        </view>
          <!-- 预警详情 -->
        <view class="info-section">
            <view class="info-title">预警详情</view>
            <up-line></up-line>
            <view class="info-item">
                <view class="info-label">合同名称</view>
                <view class="info-value">{{ contractDetail.contractName||'-' }}</view>
            </view>
            <view class="info-item">
                <view class="info-label">距离到期(天)</view>
                <view class="info-value">{{ contractDetail.remainingDays||'-' }}</view>
            </view>
            <view class="info-item">
                <view class="info-label">到期时间</view>
                <view class="info-value">{{ contractDetail.expireTime||'-' }}</view>
            </view>
            <view class="info-item">
                <view class="info-label">预警内容</view>
                <view class="info-value">{{ contractDetail.alertContent||'-' }}</view>
            </view>
        </view>
   </view>
</template>
<script setup>
import { ref} from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getContractDetail } from '@/api/park/park';

const alertId = ref('');
const contractDetail = ref({});

onLoad((options) => {
  alertId.value = options.id;
  getDetail();

});
function getDetail() {
  getContractDetail(alertId.value).then((res) => {
    contractDetail.value = res.data;
  });
}


</script>
<style scoped lang="scss">
.container {
    flex: 1;
    background-color: #f5f5f5;
    min-height: 100vh;
    padding-bottom: 100rpx;

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
            image{
                width: 150rpx;
                height: 150rpx;
                margin-right: 20rpx;
                border-radius: 10rpx;
            }
        }


    }
    
 
}
</style>