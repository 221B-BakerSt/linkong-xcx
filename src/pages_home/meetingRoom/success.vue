<template>
    <view class="page-container">
        <view class="success-icon">
           <image src="/pages_home/static/success.png" class="icon-image" />
        </view>
        <view class="success-text">会议室预约成功</view>
        <view class="button-container">
            <button class="btn-secondary" @click="goBackToList">返回会议室列表</button>
            <button class="btn-primary" @click="goToHome">返回首页</button>
        </view>
    </view>
</template>

<script setup>
import { ref } from 'vue'


const goBackToList = () => {
   uni.navigateBack({
     delta: 3
   })
}

const goToHome = () => {
    uni.switchTab({ url: '/pages/index' })
}
</script>

<style scoped lang="scss">
.page-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    background-color: #ffffff;
    padding: 100rpx 40rpx 0 40rpx;
    .success-icon {
        margin-bottom: 40rpx;
            margin-left: 40rpx;
        .icon-image {
            width: 240rpx;
            height: 220rpx;
        }
    }
    .success-text {
        font-size: 32rpx;
        color: #333333;
        margin-bottom: 80rpx;
        font-weight: 500;
    }
}





@keyframes pulse {
    0% {
        transform: scale(1);
        opacity: 1;
    }
    100% {
        transform: scale(1.2);
        opacity: 0;
    }
}




.button-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 30rpx;
    max-width: 500rpx;

    .btn-secondary {
    width: 100%;
    height: 80rpx;
    border: 2rpx solid #235EFF;
    border-radius: 40rpx;
    background-color: white;
    color: #235EFF;
    font-size: 30rpx;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}


.btn-primary {
    width: 100%;
    height: 80rpx;
    border-radius: 40rpx;
    background: #235EFF;
    color: white;
    font-size: 30rpx;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4rpx 12rpx rgba(35, 94, 255, 0.3);
    transition: all 0.3s ease;
}


}



</style>