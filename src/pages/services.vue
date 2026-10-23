<template>
    <view class="container">
        <!-- 搜索框 -->
        <view class="search">
            <up-search
                placeholder="请输入搜索关键词"
                v-model="searchText"
                @custom="searchBtn"
            ></up-search>
        </view>

        <view class="service-grid">
            <u-grid :col="5" :border="false" :gutter="16">
                <u-grid-item v-for="(item, index) in serviceList" :key="index">
                    <view
                        class="service-item-wrapper"
                        @click="handleServiceClick(item)"
                    >
                        <view class="service-icon">
                            <image
                                :src="item.icon"
                                mode="aspectFit"
                                style="
                                    width: 24px;
                                    height: 24px;
                                    filter: brightness(0) invert(1);
                                "
                            ></image>
                        </view>
                        <text class="service-text">{{ item.text }}</text>
                    </view>
                </u-grid-item>
            </u-grid>
        </view>

        <view class="policy-section">
            <view class="section-title">政策发布</view>
            <view class="policy-list">
                <view v-if="policyState === 'error'" class="policy-empty policy-retry" @click="fetchList">
                    政策列表加载失败，点击重试
                </view>
                <view v-else-if="policyState === 'ready' && policyList.length === 0" class="policy-empty">
                    暂无适用于{{ parkName }}的政策信息
                </view>
                <view
                    v-else
                    class="policy-card"
                    v-for="(item, index) in policyList"
                    :key="index"
                    @click="handlePolicyClick(item)"
                >
                    <view class="policy-item">
                        <text class="policy-title">{{ item.title }}</text>
                        <view class="policy-info">
                            <text class="policy-tag"
                                >级别：{{ getPolicyRankName(item.rank) }}</text
                            >
                            <text class="policy-tag"
                                >类别：{{
                                    getPolicyDomainName(item.policyDomain)
                                }}</text
                            >
                        </view>
                        <view class="policy-time">
                            <text class="policy-time-item"
                                >发布时间：{{
                                    (item.createTime || item.publishTime || "-").toString().substring(0, 10)
                                }}</text
                            >
                            <text class="policy-time-item"
                                >截止时间：{{ item.releaseTime || item.expireTime || "-" }}</text
                            >
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import { getPolicySupermarketList } from "@/api/operations/policySupermarket";
import { getCurrentPark, getCurrentParkId } from '@/utils/parkContext';
export default {
    data() {
        return {
            serviceList: [],
            policyList: [],
            policyState: 'loading',
            parkName: getCurrentPark()?.parkName || '当前园区',
            tabList: [
                {
                    icon: "home",
                    text: "首页",
                },
                {
                    icon: "grid",
                    text: "特色服务",
                },
                {
                    icon: "map",
                    text: "园区服务",
                },
                {
                    icon: "account",
                    text: "我的",
                },
            ],
            currentTab: 1,
            // 政策领域字典
            policyDomainDict: [
                { label: "科技政策", value: "1" },
                { label: "产业政策", value: "2" },
                { label: "人才政策", value: "3" },
                { label: "金融政策", value: "4" },
                { label: "税收政策", value: "5" },
            ],
            // 政策级别字典
            policyRankDict: [
                { label: "国家级", value: "1" },
                { label: "河南省级", value: "2" },
                { label: "郑州市级", value: "3" },
                { label: "航空港区", value: "4" },
            ],
            searchText: "",
        };
    },
    mounted() {
        this.loadData();
        this.fetchList();
    },
    onShow() {
        // 特色服务页是 tab 页面，切换园区后页面可能不会重新 mounted。
        // 重新查询即可让政策等可维护数据跟随当前园区。
        this.fetchList();
    },
    methods: {
        async fetchList() {
            const expectedParkId = getCurrentParkId();
            this.parkName = getCurrentPark()?.parkName || '当前园区';
            this.policyState = 'loading';
            try {
                const res = await getPolicySupermarketList({
                    title: this.searchText,
                    orderByColumn: 'createTime',
                    isAsc: 'desc',
                }, { showLoading: false });
                if (getCurrentParkId() !== expectedParkId) return;
                if (res && Array.isArray(res.rows)) {
                    this.policyList = res.rows;
                } else if (res && Array.isArray(res.data)) {
                    this.policyList = res.data;
                } else {
                    this.policyList = [];
                }
                this.policyState = 'ready';
            } catch (e) {
                if (getCurrentParkId() !== expectedParkId) return;
                this.policyList = [];
                this.policyState = 'error';
            }
        },
        handlePolicyClick(item) {
            uni.navigateTo({
                url: "/pages_services/policy/supermarketDetails?id=" + item.id,
            });
        },
        loadData() {
            this.serviceList = [
                {
                    icon: "/static/images/icon/services/technology.png",
                    text: "技术服务",
                },
                {
                    icon: "/static/images/icon/services/finance.png",
                    text: "金融服务",
                },
                {
                    icon: "/static/images/icon/services/policy.png",
                    text: "政策服务",
                },
                {
                    icon: "/static/images/icon/services/government.png",
                    text: "政务服务",
                },
                {
                    icon: "/static/images/icon/services/institution.png",
                    text: "服务机构",
                },
            ];
        },
        // 根据字典值获取政策领域名称
        getPolicyDomainName(value) {
            if (!value) return "";
            const dictItem = this.policyDomainDict.find(
                (item) => item.value === String(value),
            );
            return dictItem ? dictItem.label : value;
        },
        // 根据字典值获取政策级别名称
        getPolicyRankName(value) {
            if (!value) return "";
            const dictItem = this.policyRankDict.find(
                (item) => item.value === String(value),
            );
            return dictItem ? dictItem.label : value;
        },
        handleServiceClick(item) {
            if (item.text === "技术服务") {
                uni.navigateTo({
                    url: "/pages_services/technical/technical",
                    fail: function (err) {
                        console.log("跳转失败:", err);
                    },
                });
            } else if (item.text === "金融服务") {
                uni.navigateTo({
                    url: "/pages_services/finance/finance",
                    fail: function (err) {
                        console.log("跳转失败:", err);
                    },
                });
            } else if (item.text === "政策服务") {
                uni.navigateTo({
                    url: "/pages_services/policy/policy",
                    fail: function (err) {
                        console.log("跳转失败:", err);
                    },
                });
            } else if (item.text === "政务服务") {
                uni.navigateTo({
                    url: "/pages_services/government/government",
                    fail: function (err) {
                        console.log("跳转失败:", err);
                    },
                });
            } else if (item.text === "服务机构") {
                uni.navigateTo({
                    url: "/pages_services/institution/institution",
                    fail: function (err) {
                        console.log("跳转失败:", err);
                    },
                });
            }
        },
        tabChange(index) {
            this.currentTab = index;
        },
        searchBtn() {
            this.fetchList();
        },
    },
};
</script>

<style scoped>
.container {
    background-color: #ffffff;
    min-height: 100vh;
    padding-bottom: 10px;
}

.search {
    width: 100%;
    padding: 0 30rpx 30rpx 30rpx;
    background-color: #ffffff;
    box-sizing: border-box;
}

.service-grid {
    padding: 16px 0;
    background-color: #fff;
}

.service-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(
        121deg,
        #3b63ff 34%,
        rgba(43, 181, 255, 0.28) 98.57%
    );
    box-shadow: 0px 0px 4px 0px rgba(59, 99, 255, 0.5);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 8px;
}

.service-item-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px 0;
}

.service-text {
    font-size: 11px;
    color: #000000;
    text-align: center;
    line-height: 1;
}

.policy-section {
    padding: 0 16px 24px;
    background-color: #fff;
}

.section-title {
    font-size: 20px;
    font-weight: 600;
    color: #0c0c0c;
    margin-bottom: 12px;
}

.policy-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.policy-empty {
    padding: 48rpx 24rpx;
    color: #8a8a8a;
    font-size: 28rpx;
    text-align: center;
}

.policy-retry {
    color: #3b63ff;
}

.policy-card {
    background-color: #fff;
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 16px;
}

.policy-item {
    padding: 0;
}

.policy-title {
    font-size: 15px;
    color: #000000;
    line-height: 1.4;
    margin-bottom: 8px;
    display: block;
}

.policy-info {
    display: flex;
    margin-bottom: 6px;
}

.policy-tag {
    font-size: 12px;
    color: #666;
    margin-right: 24px;
}

.policy-time {
    display: flex;
}

.policy-time-item {
    font-size: 12px;
    color: #666;
    margin-right: 24px;
}
</style>
