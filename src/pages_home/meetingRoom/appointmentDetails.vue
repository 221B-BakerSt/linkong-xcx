<template>
   <view class="container">
        <!-- 预警信息 -->
        <view class="info-section">
            <view class="info-title">会议室详情</view>
            <up-line></up-line>
            <view class="info-item">
                <view class="info-label">名称</view>
                <view class="info-value">{{ contractDetail.meetingRoomName||'-' }}</view>
            </view>
            <view class="info-item">
                <view class="info-label">编号</view>
                <view class="info-value">{{ contractDetail.bookingId||'-' }}</view>
            </view>
              <view class="info-item">
                <view class="info-label">类型</view>
               
                <view class="info-value">{{ contractDetail.meetingRoomType==='small'?'小型会议室':contractDetail.meetingRoomType==='large'?'大型会议室':contractDetail.meetingRoomType==='multimediaum'?'多媒体会议室':'报告厅'}}</view>
            </view>
            <view class="info-item">
                <view class="info-label">位置</view>
                <view class="info-value">{{ contractDetail.meetingRoomAddress||'-' }}</view>
            </view>
        </view>
          <!-- 预警详情 -->
        <view class="info-section">
            <view class="info-title">预约详情</view>
            <up-line></up-line>
            <view class="info-item">
                <view class="info-label">预约人</view>
                <view class="info-value">{{ contractDetail.userName||'-' }}</view>
            </view>
            <!-- <view class="info-item">
                <view class="info-label">企业名称</view>
                <view class="info-value">{{ contractDetail.deptName||'-' }}</view>
            </view> -->
            <view class="info-item">
                <view class="info-label">联系电话</view>
                <view class="info-value">{{ contractDetail.phoneNum||'-' }}</view>
            </view>
            <view class="info-item">
                <view class="info-label">预约日期</view>
                <view class="info-value">{{ contractDetail.bookingDate||'-' }}</view>
            </view>
             <view class="info-item">
                <view class="info-label">预约时间</view>
                <view class="info-value">{{ contractDetail.timeSlot||'-' }}</view>
            </view>
        </view>
   </view>
</template>
<script setup>
import { ref} from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getMeetingRoomDetail } from '@/api/park/park';

const bookingId = ref('');
const contractDetail = ref({});

onLoad((options) => {
  bookingId.value = options.id;
  getDetail();

});
function getDetail() {
  getMeetingRoomDetail(bookingId.value).then((res) => {
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