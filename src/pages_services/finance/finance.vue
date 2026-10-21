<template>
    <view class="container">
        <view class="header">
            <text class="header-title">金融服务</text>
        </view>

        <view class="content">
            <text class="content-text"
                >这是金融服务简介，这是金融服务简介，这是金融服务简介，这是金融服务简介，这是金融服务简介，这是金融服务简介，这是金融服务简介，这是金融服务简介，</text
            >

            <view class="button-wrap">
                <text class="button-text" @click="handleDetailClick()"
                    >进入金融服务 →</text
                >
            </view>
        </view>

        <view class="image-wrap">
            <image
                src="/pages_services/static/finance_service.png"
                mode="aspectFit"
                class="finance-image"
            ></image>
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
        handleDetailClick() {
            uni.navigateTo({
                url: "/pages_services/finance/financeList",
            });
        },
        handleContactClick() {
            uni.navigateTo({
                url: "/pages_services/consult?dictSort=1",
            });
        },
    },
};
</script>

<style scoped>
.container {
    min-height: 100vh;
    background: #eaf2fd;
    border-radius: 0px;
    padding: 24px 16px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.header {
    text-align: center;
    margin-bottom: 40px;
}

.header-title {
    width: 96px;
    height: 36px;
    font-family: "Source Han Sans", sans-serif;
    font-weight: 700;
    font-size: 24px;
    color: rgba(0, 0, 0, 0.9);
    line-height: 36px;
    text-align: center;
    font-style: normal;
    text-transform: none;
    margin: 0 auto;
    display: block;
}

.content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 60px;
}

.content-text {
    width: 311px;
    font-family: "Source Han Sans", sans-serif;
    font-weight: 400;
    font-size: 18px;
    color: rgba(0, 0, 0, 0.9);
    line-height: 24px;
    letter-spacing: 1px;
    text-align: center;
    font-style: normal;
    text-transform: none;
    margin-bottom: 40px;
    display: block;
}

.button-wrap {
    width: 160px;
    height: 42px;
    background: #3b63ff;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(59, 99, 255, 0.3);
    transition: all 0.3s ease;
}

.button-wrap:active {
    transform: scale(0.98);
    box-shadow: 0 1px 4px rgba(59, 99, 255, 0.3);
}

.button-text {
    font-size: 16px;
    color: #ffffff;
    font-weight: 500;
}

.image-wrap {
    width: 100%;
    height: 300px;
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.finance-image {
    width: 100%;
    height: auto;
    object-fit: contain;
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
