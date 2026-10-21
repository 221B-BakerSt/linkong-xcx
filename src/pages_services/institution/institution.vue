<template>
    <view class="container">
        <view class="institution-list">
            <view
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

export default {
    data() {
        return {
            institutionList: [],
        };
    },
    mounted() {
        this.fetchList();
    },
    methods: {
        async fetchList() {
            try {
                const res = await getServiceOrganizationList({
                    policyType: "governmentAffairs",
                    orderByColumn: 'createTime',
                    isAsc: 'desc',
                });
                if (res && res.rows) {
                    this.institutionList = res.rows;
                } else if (res && res.data) {
                    this.institutionList = res.data;
                }
            } catch (e) {
                uni.showToast({ title: "获取列表失败", icon: "none" });
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
