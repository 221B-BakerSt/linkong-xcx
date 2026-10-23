<template>
    <view class="container">
        <view class="header">
            <text class="header-title">技术服务</text>
            <text class="header-subtitle">园区服务目录</text>
            <text class="header-desc">{{ parkName }}</text>
        </view>

        <scroll-view v-if="listState === 'ready' && serviceList.length" class="content" scroll-y>
            <view
                v-for="item in serviceList"
                :key="item.id"
                class="service-item"
                @click="handleDetailClick(item)"
            >
                <view class="service-header">
                    <text class="service-title">{{ item.title }}</text>
                </view>
                <view v-if="item.content" class="service-content">
                    <text class="service-desc">{{ item.content }}</text>
                </view>
                <view class="service-footer">
                    <text class="service-detail">详情 →</text>
                </view>
            </view>
        </scroll-view>

        <view v-else-if="listState === 'loading'" class="empty-content">
            <text class="empty-title">服务目录加载中...</text>
        </view>

        <view v-else-if="listState === 'error'" class="empty-content retry-content" @click="fetchList">
            <text class="empty-title">服务目录加载失败，点击重试</text>
        </view>

        <view v-else class="empty-content">
            <text class="empty-title">暂无技术服务内容</text>
            <text class="empty-desc">{{ parkName }}发布服务目录后将在此展示，不展示其他园区的服务内容。</text>
        </view>

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
import { getPolicySupermarketList } from '@/api/operations/policySupermarket';
import { getCurrentPark, getCurrentParkId } from '@/utils/parkContext';

export default {
    data() {
        return {
            serviceList: [],
            listState: 'loading',
            parkName: '当前园区',
            loadedParkId: '',
        };
    },
    mounted() {
        this.fetchList();
    },
    onShow() {
        const currentParkId = getCurrentParkId();
        this.parkName = getCurrentPark()?.parkName || '当前园区';
        if (currentParkId !== this.loadedParkId) this.fetchList();
    },
    methods: {
        async fetchList() {
            const expectedParkId = getCurrentParkId();
            this.parkName = getCurrentPark()?.parkName || '当前园区';
            this.listState = 'loading';
            try {
                const res = await getPolicySupermarketList(
                    {
                        policyType: 'technology',
                        orderByColumn: 'createTime',
                        isAsc: 'desc',
                        pageNum: 1,
                        pageSize: 20,
                    },
                    { showLoading: false },
                );
                if (expectedParkId !== getCurrentParkId()) return;
                const rows = Array.isArray(res?.rows)
                    ? res.rows
                    : Array.isArray(res?.data)
                      ? res.data
                      : [];
                this.serviceList = rows
                    .map((item) => ({
                        id: item.id || item.policyId || item.supermarketId,
                        title: item.title || item.name || '未命名服务',
                        content: item.content || item.policyContent || item.serviceContent || '',
                    }))
                    .filter((item) => item.id != null);
                this.loadedParkId = expectedParkId;
                this.listState = 'ready';
            } catch (error) {
                if (expectedParkId !== getCurrentParkId()) return;
                this.serviceList = [];
                this.listState = 'error';
            }
        },
        handleDetailClick(item) {
            uni.navigateTo({
                url: `/pages_services/technical/technicalDetails?id=${item.id}`,
            });
        },
        handleContactClick() {
            uni.navigateTo({
                url: '/pages_services/consult?dictSort=0',
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
    display: block;
    font-weight: 700;
    font-size: 24px;
    color: rgba(0, 0, 0, 0.9);
    line-height: 36px;
}

.header-subtitle,
.header-desc {
    display: block;
    color: #6d7782;
    font-size: 13px;
    line-height: 24px;
}

.content {
    height: calc(100vh - 132px);
    padding: 0 16px 32px;
    box-sizing: border-box;
}

.service-item {
    margin-bottom: 14px;
    padding: 18px;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.service-header {
    display: flex;
    align-items: center;
}

.service-title {
    color: #20252b;
    font-size: 16px;
    font-weight: 600;
}

.service-content {
    margin-top: 12px;
}

.service-desc {
    color: #68727d;
    font-size: 13px;
    line-height: 22px;
}

.service-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 12px;
}

.service-detail {
    color: #3b63ff;
    font-size: 13px;
}

.empty-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 260px;
    padding: 24px;
    text-align: center;
}

.empty-title {
    color: #7a8795;
    font-size: 15px;
}

.empty-desc {
    margin-top: 10px;
    color: #9aa4ad;
    font-size: 12px;
}

.retry-content .empty-title {
    color: #3b63ff;
}

.contact-plugin {
    position: fixed;
    right: 20px;
    bottom: 78%;
    z-index: 1000;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #3b63ff;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(59, 99, 255, 0.3);
}

.contact-image {
    width: 32px;
    height: 32px;
}
</style>
