<template>
    <view class="container">
        <view class="header">
            <text class="header-title">政务服务</text>
            <!-- <image
        src="/pages_services/static/kefu.png"
        mode="aspectFit"
        class="header-icon"
      ></image> -->
        </view>

        <view class="subtitle">
            <text class="subtitle-text">提供您需要的政务文件</text>
        </view>

        <view class="service-list">
            <view class="service-item" @click="handleServiceClick('economic')">
                <view class="service-content">
                    <text class="service-title">经济发展</text>
                    <text class="service-desc">项目立项变更咨询及办理业务</text>
                </view>
                <text class="service-arrow">→</text>
            </view>

            <view class="service-item" @click="handleServiceClick('safety')">
                <view class="service-content">
                    <text class="service-title">安监办</text>
                    <text class="service-desc"
                        >安全评审、压力容器等相关业务咨询及办理</text
                    >
                </view>
                <text class="service-arrow">→</text>
            </view>

            <view class="service-item" @click="handleServiceClick('fire')">
                <view class="service-content">
                    <text class="service-title">消防</text>
                    <text class="service-desc">消防手续咨询及办理业务</text>
                </view>
                <text class="service-arrow">→</text>
            </view>

            <view class="service-item" @click="handleServiceClick('planning')">
                <view class="service-content">
                    <text class="service-title">规划市政建设环保</text>
                    <text class="service-desc"
                        >应急预案、环评手续咨询及办理业务</text
                    >
                </view>
                <text class="service-arrow">→</text>
            </view>

            <view class="service-item" @click="handleServiceClick('food')">
                <view class="service-content">
                    <text class="service-title">食药监</text>
                    <text class="service-desc"
                        >药品临床试验审批、生产许可证、经营许可证、委托生产许可证、医疗器械生产许可证、经营许可证等相关证件咨询和报装业务</text
                    >
                </view>
                <text class="service-arrow">→</text>
            </view>

            <view class="service-item" @click="handleServiceClick('industry')">
                <view class="service-content">
                    <text class="service-title">工商</text>
                    <text class="service-desc"
                        >工商注册、变更、注销等相关业务咨询及办理</text
                    >
                </view>
                <text class="service-arrow">→</text>
            </view>

            <view class="service-item" @click="handleServiceClick('quality')">
                <view class="service-content">
                    <text class="service-title">质检</text>
                    <text class="service-desc">质检相关业务咨询和办理</text>
                </view>
                <text class="service-arrow">→</text>
            </view>

            <view class="service-item" @click="handleServiceClick('finance')">
                <view class="service-content">
                    <text class="service-title">金融服务</text>
                    <text class="service-desc">支持设备贷款、三表用电</text>
                </view>
                <text class="service-arrow">→</text>
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
            uni.navigateTo({
                url: "/pages_services/government/governmentList",
            });
        },
        handleContactClick() {
            uni.navigateTo({
                url: "/pages_services/consult?dictSort=3",
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
    height: 36px;
    font-family: "Source Han Sans", sans-serif;
    font-weight: 400;
    font-size: 18px;
    color: rgba(0, 0, 0, 0.9);
    line-height: 36px;
    letter-spacing: 9px;
    text-align: center;
    font-style: normal;
    text-transform: none;
    display: block;
    margin: 0 auto;
}

.service-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.service-item {
    width: 88%;
    min-height: 108px;
    background: linear-gradient(270deg, #3b63ff 0%, #7892f9 98.57%);
    border-radius: 10px;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(59, 99, 255, 0.3);
}

.service-item:active {
    transform: scale(0.98);
    box-shadow: 0 2px 8px rgba(59, 99, 255, 0.3);
}

.service-content {
    flex: 1;
    min-width: 0;
}

.service-title {
    font-family: "Source Han Sans", sans-serif;
    font-weight: 700;
    font-size: 16px;
    color: #ffffff;
    line-height: 36px;
    text-align: left;
    font-style: normal;
    text-transform: none;
    margin-bottom: 8px;
    display: block;
}

.service-desc {
    font-family: "Source Han Sans", sans-serif;
    font-weight: 400;
    font-size: 14px;
    color: #ffffff;
    line-height: 24px;
    text-align: left;
    font-style: normal;
    text-transform: none;
    display: block;
    margin-right: 16px;
}

.service-arrow {
    font-size: 16px;
    color: #ffffff;
    font-weight: 500;
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
