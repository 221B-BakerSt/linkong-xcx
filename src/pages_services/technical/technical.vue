<template>
    <view class="container">
        <view class="header">
            <text class="header-title">技术服务</text>
            <text class="header-subtitle">CXO一站式解决方案</text>
            <text class="header-desc">全面服务中国生物医药产业</text>
        </view>

        <scroll-view class="content" scroll-y>
            <view class="service-item">
                <view class="service-header">
                    <text class="service-title">新药筛选检测平台</text>
                </view>
                <view class="service-content">
                    <text class="service-desc"
                        >小分子药物理化分析及稳定性研究</text
                    >
                    <text class="service-desc"
                        >小分子药物成分分析及含量测定</text
                    >
                    <text class="service-desc">抗体/酶高通量筛选</text>
                    <text class="service-desc">药物细胞活性研究</text>
                    <text class="service-desc">抗体/酶功能表征</text>
                    <text class="service-desc">抗原/抗体表达及纯化</text>
                    <text class="service-desc">抗体/酶展示库构建与筛选</text>
                </view>
                <view class="service-footer">
                    <text
                        class="service-detail"
                        @click="handleDetailClick(serviceName)"
                        >详情 →</text
                    >
                </view>
            </view>

            <view class="service-item">
                <view class="service-header">
                    <text class="service-title">药物评价平台(动物房)</text>
                </view>
                <view class="service-content">
                    <text class="service-desc">小分子新药研发服务</text>
                    <text class="service-desc">小分子新药临床前评价</text>
                    <text class="service-desc">创新药物筛选评价</text>
                    <text class="service-desc">药物安全性评价</text>
                    <text class="service-desc">药物代谢动力学评价</text>
                </view>
                <view class="service-footer">
                    <text
                        class="service-detail"
                        @click="handleDetailClick(serviceName)"
                        >详情 →</text
                    >
                </view>
            </view>

            <view class="service-item">
                <view class="service-header">
                    <text class="service-title">大分子药物CDMO平台</text>
                </view>
                <view class="service-content">
                    <text class="service-desc">无菌注射剂研发服务</text>
                    <text class="service-desc">无菌注射剂生产服务</text>
                    <text class="service-desc">无菌注射剂质量控制</text>
                    <text class="service-desc">无菌注射剂注册申报</text>
                </view>
                <view class="service-footer">
                    <text
                        class="service-detail"
                        @click="handleDetailClick(serviceName)"
                        >详情 →</text
                    >
                </view>
            </view>

            <view class="service-item">
                <view class="service-header">
                    <text class="service-title">小分子API&制剂CDMO平台</text>
                </view>
                <view class="service-content">
                    <text class="service-desc">小分子API研发服务</text>
                    <text class="service-desc">小分子API生产服务</text>
                    <text class="service-desc">小分子API质量控制</text>
                    <text class="service-desc">小分子API注册申报</text>
                </view>
                <view class="service-footer">
                    <text
                        class="service-detail"
                        @click="handleDetailClick(serviceName)"
                        >详情 →</text
                    >
                </view>
            </view>

            <view class="service-item">
                <view class="service-header">
                    <text class="service-title">基因治疗CDMO平台</text>
                </view>
                <view class="service-content">
                    <text class="service-desc">基因治疗载体研发</text>
                    <text class="service-desc">基因治疗载体生产</text>
                    <text class="service-desc">基因治疗载体质量控制</text>
                    <text class="service-desc">基因治疗载体注册申报</text>
                </view>
                <view class="service-footer">
                    <text
                        class="service-detail"
                        @click="handleDetailClick(serviceName)"
                        >详情 →</text
                    >
                </view>
            </view>

            <view class="service-item">
                <view class="service-header">
                    <text class="service-title">细胞治疗CDMO平台</text>
                </view>
                <view class="service-content">
                    <text class="service-desc">细胞治疗产品研发</text>
                    <text class="service-desc">细胞治疗产品生产</text>
                    <text class="service-desc">细胞治疗产品质量控制</text>
                    <text class="service-desc">细胞治疗产品注册申报</text>
                </view>
                <view class="service-footer">
                    <text
                        class="service-detail"
                        @click="handleDetailClick(serviceName)"
                        >详情 →</text
                    >
                </view>
            </view>

            <view class="service-item">
                <view class="service-header">
                    <text class="service-title">临床CRO平台</text>
                </view>
                <view class="service-content">
                    <text class="service-desc">抗体药物研发服务</text>
                    <text class="service-desc">抗体药物生产服务</text>
                    <text class="service-desc">抗体药物质量控制</text>
                    <text class="service-desc">抗体药物注册申报</text>
                </view>
                <view class="service-footer">
                    <text
                        class="service-detail"
                        @click="handleDetailClick(serviceName)"
                        >详情 →</text
                    >
                </view>
            </view>
        </scroll-view>

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
        handleDetailClick(serviceName) {
            uni.navigateTo({
                url: "/pages_services/technical/technicalList",
            });
        },
        handleContactClick() {
            uni.navigateTo({
                url: "/pages_services/consult?dictSort=0",
            });
        },
    },
};
</script>

<style scoped>
.container {
    background-color: #f1faff;
    min-height: 100vh;
}

.header {
    background-color: #f1faff;
    padding: 24px 16px;
    text-align: center;
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
    margin: 0 auto 8px;
    display: block;
}

.header-subtitle {
    font-family: "Han Sans-Regular", sans-serif;
    font-size: 18px;
    font-weight: 400;
    color: #333333;
    text-align: center;
    letter-spacing: 5px;
    line-height: 24px;
    margin-bottom: 4px;
    display: block;
}

.header-desc {
    font-family: "Han Sans-Regular", sans-serif;
    font-size: 18px;
    font-weight: 400;
    color: #666666;
    text-align: center;
    letter-spacing: 5px;
    line-height: 24px;
    display: block;
}

.content {
    flex: 1;
    overflow: hidden;
}

.service-item {
    background-color: #ffffff;
    margin: 16px;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    padding: 16px;
}

.service-header {
    width: 100%;
    height: 48px;
    background: #3b63ff;
    border-radius: 10px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
}

.service-title {
    font-family: "Source Han Sans-Bold", sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: #ffffff;
    text-align: left;
    line-height: 16px;
}

.service-content {
    padding: 16px 0 0 0;
}

.service-desc {
    display: block;
    font-size: 14px;
    color: #333333;
    line-height: 24px;
    position: relative;
    padding-left: 16px;
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

.service-desc::before {
    content: "•";
    color: #3b63ff;
    font-weight: bold;
    margin-right: 8px;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
}

.service-footer {
    padding: 0 16px 16px;
    display: flex;
    justify-content: flex-end;
}

.service-detail {
    font-family: "Source Han Sans", sans-serif;
    font-weight: 400;
    font-size: 14px;
    color: #ffffff;
    line-height: 14px;
    text-align: left;
    font-style: normal;
    text-transform: none;
    width: 48px;
    height: 32px;
    padding: 0 16px;
    border: 1px solid #3b63ff;
    background-color: #3b63ff;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
