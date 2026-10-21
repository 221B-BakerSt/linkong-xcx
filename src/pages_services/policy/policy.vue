<template>
    <view class="container">
        <view class="header">
            <text class="header-title">政策服务</text>
            <!-- <image src="/pages_services/static/kefu.png" mode="aspectFit" class="header-icon"></image> -->
        </view>

        <view class="subtitle">
            <text class="subtitle-text">一键知政策，一键快兑现</text>
        </view>

        <view class="service-list">
            <view
                class="service-item"
                @click="handleServiceClick('declaration')"
            >
                <view class="service-content">
                    <text class="service-title">政策申报</text>
                    <text class="service-desc">申报援助，政策趋势对掌握</text>
                </view>
                <text class="service-enter">进入 &gt;</text>
            </view>

            <view
                class="service-item"
                @click="handleServiceClick('consultation')"
            >
                <view class="service-content">
                    <text class="service-title">精准推送</text>
                    <text class="service-desc">精准推送，推荐适合的政策</text>
                </view>
                <text class="service-enter">进入 &gt;</text>
            </view>

            <view
                class="service-item"
                @click="handleServiceClick('supermarket')"
            >
                <view class="service-content">
                    <text class="service-title">政策超市</text>
                    <text class="service-desc"
                        >展示所有政策文件，掌握政策趋势</text
                    >
                </view>
                <text class="service-enter">进入 &gt;</text>
            </view>
        </view>

        <!-- 联系我们插件 -->
        <view class="contact-plugin" @click="handleContactClick">
            <image
                src="/pages_services/static/kefu.png"
                mode="aspectFit"
                class="contact-image"
            ></image>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {};
    },
    methods: {
        handleServiceClick(type) {
            if (type === "declaration") {
                uni.navigateTo({
                    url: "/pages_services/policy/declareList",
                });
            } else if (type === "consultation") {
                uni.navigateTo({
                    url: "/pages_services/policy/consultList",
                });
            } else if (type === "supermarket") {
                uni.navigateTo({
                    url: "/pages_services/policy/supermarketList",
                });
            }
        },
        handleContactClick() {
            uni.navigateTo({
                url: "/pages_services/consult?dictSort=2",
            });
        },
    },
};
</script>

<style scoped>
.container {
    min-height: 100vh;
    width: 100%;
    height: 100%;
    background: #f5fbff;
    border-radius: 0px;
    padding: 32px 16px;
    box-sizing: border-box;
}

.header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 16px;
    position: relative;
}

.header-title {
    font-family: "Source Han Sans", sans-serif;
    font-weight: 700;
    font-size: 24px;
    color: rgba(0, 0, 0, 0.9);
    line-height: 36px;
}

.header-icon {
    position: absolute;
    right: 0;
    width: 32px;
    height: 32px;
}

.subtitle {
    text-align: center;
    margin-bottom: 40px;
}

.subtitle-text {
    width: 311px;
    height: 24px;
    font-family: "Source Han Sans", sans-serif;
    font-weight: 400;
    font-size: 18px;
    color: rgba(0, 0, 0, 0.9);
    line-height: 24px;
    letter-spacing: 1px;
    text-align: center;
    font-style: normal;
    text-transform: none;
    display: block;
    margin: 0 auto;
}

.service-list {
    width: 100%;
}

.service-item {
    width: 90%;
    height: 72px;
    background: #ffffff;
    border-radius: 10px;
    padding: 16px;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.service-item:active {
    background: #f8f8f8;
    transform: scale(0.98);
}

.service-content {
    flex: 1;
}

.service-title {
    width: 56px;
    height: 12px;
    font-family: "Source Han Sans", sans-serif;
    font-weight: 600;
    font-size: 14px;
    color: #333333;
    line-height: 12px;
    text-align: left;
    font-style: normal;
    text-transform: none;
    margin-bottom: 8px;
    display: block;
}

.service-desc {
    font-size: 12px;
    color: #666666;
    line-height: 16px;
    display: block;
}

.service-enter {
    font-family: "Source Han Sans", sans-serif;
    font-weight: 400;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.6);
    line-height: 12px;
    text-align: right;
    font-style: normal;
    text-transform: none;
    display: flex;
    align-items: center;
    gap: 4px;
}

.contact-plugin {
    position: fixed;
    bottom: 78%;
    right: 20px;
    width: 50px;
    height: 50px;
    background-color: #3b63ff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(59, 99, 255, 0.3);
    z-index: 1000;
}

.contact-image {
    width: 32px;
    height: 32px;
    object-fit: contain;
}
</style>
