<template>
    <view class="container">
        <view class="institution-list">
            <view
                v-if="listState === 'error'"
                class="list-message retry-message"
                @click="fetchList"
            >
                <text>加载失败，点击重试</text>
            </view>
            <view
                v-else-if="listState === 'ready' && institutionList.length === 0"
                class="list-message"
            >
                <text>{{ parkName }}暂无已发布的服务机构</text>
            </view>
            <view
                v-else
                v-for="(item, index) in institutionList"
                :key="index"
                class="institution-item"
                @click="handleInstitutionClick(item)"
            >
                <view class="institution-info">
                    <text class="institution-name">{{
                        item.organizationName
                    }}</text>
                    <view class="institution-meta">
                        <text class="institution-type"
                            >类型：{{ item.organizationType }}</text
                        >
                        <text class="institution-date"
                            >成立日期：{{ item.incorporationDate }}</text
                        >
                    </view>
                </view>
                <text class="institution-detail">详情</text>
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
import { getServiceOrganizationList } from "@/api/operations/policySupermarket";
import { getCurrentPark, getCurrentParkId } from "@/utils/parkContext";

export default {
    data() {
        return {
            institutionList: [],
            listState: "loading",
            parkName: "当前园区",
        };
    },
    mounted() {
        this.fetchList();
    },
    onShow() {
        this.fetchList();
    },
    methods: {
        async fetchList() {
            const park = getCurrentPark();
            const expectedParkId = getCurrentParkId();
            this.parkName = park?.parkName || "当前园区";
            this.listState = "loading";
            try {
                const res = await getServiceOrganizationList({
                    policyType: "governmentAffairs",
                    orderByColumn: 'createTime',
                    isAsc: 'desc',
                });
                if (expectedParkId !== getCurrentParkId()) return;
                this.institutionList = Array.isArray(res?.rows)
                    ? res.rows
                    : Array.isArray(res?.data)
                      ? res.data
                      : [];
                this.listState = "ready";
            } catch (e) {
                if (expectedParkId !== getCurrentParkId()) return;
                this.institutionList = [];
                this.listState = "error";
            }
        },
        handleInstitutionClick(item) {
            uni.navigateTo({
                url:
                    "/pages_services/institution/institutionDetails?id=" +
                    item.id,
            });
        },
        handleContactClick() {
            uni.navigateTo({
                url: "/pages_services/consult?dictSort=4",
            });
        },
    },
};
</script>

<style scoped>
.container {
    min-height: 100vh;
    background: #f5fbff;
    padding: 32px 16px;
    box-sizing: border-box;
}

.header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 32px;
    position: relative;
}

.header-title {
    font-family: "Source Han Sans", sans-serif;
    font-weight: 700;
    font-size: 24px;
    color: rgba(0, 0, 0, 0.9);
    line-height: 36px;
    text-align: center;
}

.header-icon {
    position: absolute;
    right: 0;
    width: 32px;
    height: 32px;
}

.institution-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.list-message {
    margin: 48px 16px;
    color: #7a8795;
    font-size: 14px;
    text-align: center;
}

.retry-message {
    color: #2f7ee6;
}

.institution-item {
    background: #ffffff;
    border-radius: 10px;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
}

.institution-item:active {
    transform: scale(0.98);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.institution-info {
    flex: 1;
}

.institution-name {
    font-size: 14px;
    font-weight: 500;
    color: #333333;
    margin-bottom: 8px;
    display: block;
}

.institution-meta {
    display: flex;
    gap: 24px;
}

.institution-type,
.institution-date {
    font-size: 12px;
    color: #666666;
}

.institution-detail {
    font-size: 14px;
    color: #666666;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 4px;
}

.institution-detail::after {
    content: " >";
    font-size: 12px;
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
