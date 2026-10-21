<template>
   <view class="container">
        <!-- 预警信息 -->
        <view class="info-section">
            <view class="info-title">公寓详情</view>
            <up-line></up-line>
            <view class="info-item">
                <view class="info-label">公寓名称</view>
                <view class="info-value">{{ contractDetail.apartmentName||'-' }}</view>
            </view>
            <view class="info-item">
                <view class="info-label">面积(m²)</view>
                <view class="info-value">{{ contractDetail.area||'-' }}</view>  
            </view>
            <view class="info-item">
                <view class="info-label">所属企业</view>
                <view class="info-value">{{ contractDetail.building||'-' }}</view>
            </view>
        </view>
          <!-- 预警详情 -->
        <view class="info-section">
            <view class="info-title">预约信息</view>
            <up-line></up-line>
            <view class="info-item">
                <view class="info-label">预约人</view>
                <view class="info-value">{{ contractDetail.contact||'-' }}</view>
            </view>
            <view class="info-item">
                <view class="info-label">联系电话</view>
                <view class="info-value">{{ contractDetail.phoneNum||'-' }}</view>
            </view>
            <view class="info-item">
                <view class="info-label">预约日期</view>
                <view class="info-value">{{ contractDetail.appointmentDate||'-' }}</view>
            </view>
            <view class="info-item">
                <view class="info-label">预约时间</view>
                <view class="info-value">{{ contractDetail.appointmentTime||'-' }}</view>
            </view>
        </view>
   </view>
</template>
<script setup>
import { ref} from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getContractDetail } from '@/api/park/park';


const contractDetail = ref({});

onLoad((options) => {
  contractDetail.value = JSON.parse(options.info);

});



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