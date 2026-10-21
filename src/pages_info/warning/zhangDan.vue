<template>
   <view class="container">
        <!-- 预警信息 -->
        <view class="info-section">
            <view class="info-title">预警信息</view>
            <up-line></up-line>
            <view class="info-item">
                <view class="info-label">企业名称</view>
                <view class="info-value">河南云立方科技有限公司</view>
            </view>
            <view class="info-item">
                <view class="info-label">预警类型</view>
                <view class="info-value">账单预警</view>
            </view>
            <view class="info-item">
                <view class="info-label">预警时间</view>
                <view class="info-value">2025.12.12 12:00</view>
            </view>
        </view>
          <!-- 预警详情 -->
        <view class="info-section">
            <view class="info-title">预警详情</view>
            <up-line></up-line>
            <view class="info-item">
                <view class="info-label">合同名称</view>
                <view class="info-value">合同1</view>
            </view>
            <view class="info-item">
                <view class="info-label">账单月/年</view>
                <view class="info-value">2025.12</view>
            </view>
            <view class="info-item">
                <view class="info-label">应收(元)</view>
                <view class="info-value">1,000.00</view>
            </view>
             <view class="info-item">
                <view class="info-label">已收(元)</view>
                <view class="info-value">1,000.00</view>
            </view>
             <view class="info-item">
                <view class="info-label">未收(元)</view>
                <view class="info-value">1,000.00</view>
            </view>
             <view class="info-item">
                <view class="info-label">付款节点</view>
                <view class="info-value">2025.12.12</view>
            </view>
        </view>
   </view>
</template>
<script setup></script>
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