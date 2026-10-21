<template>
    <view class="page-container">
        <view class="success-icon">
            <image src="/pages_info/static/success.png" class="icon-image" />
        </view>
        <view class="success-text1">咨询信息提交成功，我们会尽快联系您</view>
        <view class="success-text2">您可以添加微信或电话联系我们</view>
        <view class="success-text3"
            >联系电话：<span class="phone-number">17630531212</span></view
        >
        <view class="button-container">
            <button class="btn-primary" @click="goToHome">返回首页</button>
        </view>
    </view>
</template>

<script setup>
import { ref } from "vue";

const goBackToList = () => {
    uni.navigateBack({
        delta: 6,
    });
};

const goToHome = () => {
    uni.switchTab({ url: "/pages/index" });
};
</script>

<style scoped lang="scss">
.page-container {
    height: 812px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #f5fbff;
    border-radius: 0px 0px 0px 0px;
    padding: 100rpx 40rpx 0 40rpx;
    .success-icon {
        margin-bottom: 40rpx;
        margin-left: 40rpx;
        .icon-image {
            width: 240rpx;
            height: 220rpx;
        }
    }
    .success-text1 {
        width: 238px;
        height: 14px;
        font-family:
            Source Han Sans,
            Source Han Sans;
        font-weight: 400;
        font-size: 14px;
        color: #666666;
        line-height: 14px;
        text-align: center;
        font-style: normal;
        text-transform: none;
        margin-bottom: 80rpx;
    }

    .success-text2 {
        width: 252px;
        height: 18px;
        font-family:
            Source Han Sans,
            Source Han Sans;
        font-weight: 400;
        font-size: 18px;
        color: rgba(0, 0, 0, 0.9);
        line-height: 18px;
        text-align: center;
        font-style: normal;
        text-transform: none;
        margin-bottom: 20rpx;
    }

    .success-text3 {
        width: 80%;
        height: 18px;
        font-family:
            Source Han Sans,
            Source Han Sans;
        font-weight: 400;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.9);
        line-height: 18px;
        text-align: center;
        font-style: normal;
        text-transform: none;
        margin-bottom: 40rpx;
        .phone-number {
            color: #3b63ff;
        }
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
        border: 2rpx solid #235eff;
        border-radius: 40rpx;
        background-color: white;
        color: #235eff;
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
        background: #235eff;
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
