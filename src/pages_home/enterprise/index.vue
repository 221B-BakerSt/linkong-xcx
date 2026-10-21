<template>
    <view class="container">
        <image class="bg" src="/pages_home/static/1.png" mode=""></image>
        <view class="options">
            <!-- 报事维修 -->
            <view class="submit" @click="goReport">
                <view class="left">
                    <image src="/pages_home/static/2.png" mode=""></image>
                    <view class="info">
                        <span>新增诉求</span>
                        <span class="title">提交诉求信息</span>
                    </view>
                </view>
                <u-icon name="arrow-right" color="#5a5a5a" size="20"></u-icon>
            </view>
            <!-- 维修记录 -->
            <view class="submit report" @click="goRecord">
                <view class="left">
                    <image src="/pages_home/static/3.png" mode=""></image>
                    <view class="info">
                        <span>诉求记录</span>
                        <span class="title">所有诉求记录</span>
                    </view>
                </view>
                <u-icon name="arrow-right" color="#5a5a5a" size="20"></u-icon>
            </view>
        </view>
    </view>
</template>

<script setup>
function goReport() {
    uni.navigateTo({
        url: "/pages_home/enterprise/add",
    });
}
function goRecord() {
    uni.navigateTo({
        url: "/pages_home/enterprise/list",
    });
}
</script>

<style lang="scss" scoped>
.container {
    min-height: 100vh;
    box-sizing: border-box;
    position: relative;
    background: #fafafa;
    padding: 112rpx 38rpx 0;

    .bg {
        display: flex;
        margin: auto;
        width: 514rpx;
        height: 514rpx;
    }

    .options {
        width: 100%;
        height: 132rpx;
        margin-top: 148rpx;
        display: flex;

        .submit {
            height: 132rpx;
            width: 50%;
            background: #ffffff;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 15rpx;
            box-shadow: 0rpx 2rpx 6rpx 2rpx rgba(0, 0, 0, 0.08);
            .left {
                display: flex;
            }
            image {
                width: 72rpx;
                height: 72rpx;
            }
            .info {
                display: flex;
                flex-direction: column;
                font-size: 28rpx;
                font-family: 苹方-简, 苹方-简;
                font-weight: normal;
                color: rgba(0, 0, 0, 0.9);
                box-sizing: border-box;
                cursor: pointer;
                .title {
                    font-size: 20rpx;
                    color: rgba(0, 0, 0, 0.45);
                    margin-top: 8rpx;
                }
            }
        }
        .report {
            margin-left: 12rpx;
        }
    }
}
</style>
