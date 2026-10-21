<template>
   <view class="container">
        <!-- 预警信息 -->
        <view class="info-section">
            <view class="info-title">房源详情</view>
            <up-line></up-line>
            <view class="info-item">
                <view class="info-label">房源名称</view>
                <view class="info-value">{{ contractDetail.roomName||'-' }}</view>
            </view>
            <view class="info-item">
                <view class="info-label">房源区域</view>
                <view class="info-value">{{ contractDetail.regionName||'-' }}</view>
            </view>
            <view class="info-item">
                <view class="info-label">房源楼栋</view>
                <view class="info-value">{{ contractDetail.buildingName||'-' }}</view>
            </view>
            <view class="info-item">
                <view class="info-label">房源楼层</view>
                <view class="info-value">{{ contractDetail.floorName||'-' }}</view>
            </view>
            
        </view>
          <!-- 详情 -->
        <view class="info-section">
            <view class="info-title">预约信息</view>
            <up-line></up-line> 
            <view class="info-item">
                <view class="info-label">预约人</view>
                <view class="info-value">{{ contractDetail.reservedBy||'-' }}</view>
            </view>
            <view class="info-item">
                <view class="info-label">联系电话</view>
                <view class="info-value">{{ contractDetail.number||'-' }}</view>
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
import { getHouseReserveDetail } from '@/api/park/park';

const dataId = ref('');
const contractDetail = ref({});

onLoad((options) => {
  dataId.value = options.id;
  getDetail();

});
function getDetail() {
  getHouseReserveDetail(dataId.value).then((res) => {
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