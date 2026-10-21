<template>
    <view class="page-container">
        <!-- 详情 -->
        <view class="detail">
            <view class="title">联系人信息</view>
            <up-line></up-line>
            <view class="detail-item">
                <view class="label">联系人</view>
                <view class="value">{{ detail.contact || "-" }}</view>
            </view>
            <view class="detail-item">
                <view class="label">联系方式</view>
                <view class="value">{{ detail.phoneNum || "-" }}</view>
            </view>
            <view class="detail-item">
                <view class="label">企业名称</view>
                <view class="value">{{ detail.companyName || "-" }}</view>
            </view>
        </view>
        <!-- 诉求信息 -->
        <view class="detail">
            <view class="title">诉求信息</view>
            <up-line></up-line>
            <view class="detail-item">
                <view class="label">诉求类型</view>
                <view class="value">{{
                    getTypeLabel(detail.demandType) || "-"
                }}</view>
            </view>
            <view class="detail-item">
                <view class="label">提交时间</view>
                <view class="value">{{
                    formatDate(detail.createTime) || "-"
                }}</view>
            </view>
            <view class="detail-item">
                <view class="label">诉求状态</view>
                <view
                    class="value"
                    :style="{
                        color: detail.state === 1 ? '#2FC25B' : '#FF9500',
                    }"
                >
                    {{ detail.state === 1 ? "已解决" : "未解决" }}
                </view>
            </view>
            <view class="detail-item">
                <view class="label">诉求详情</view>
            </view>
            <view class="detail-item">
                {{ detail.demandContent || "-" }}
            </view>
        </view>
    </view>
</template>
<script>
import { getInteractionDemandDetail } from "@/api/home/enterprise";

export default {
    data() {
        return {
            detail: {},
            loading: false,
            demandId: "",
        };
    },
    onLoad(options) {
        console.log("onLoad options:", options);
        this.demandId = options.id || "";
        console.log("demandId:", this.demandId);
        // 手动设置一个测试值，用于调试
        if (!this.demandId) {
            this.demandId = "2034570955372630018";
            console.log("手动设置 demandId:", this.demandId);
        }
        this.getDetail();
    },
    methods: {
        getTypeLabel(type) {
            const typeMap = {
                1: "用工需求",
                2: "政策咨询",
                3: "其他诉求",
            };
            return typeMap[type] || "";
        },
        formatDate(dateString) {
            if (!dateString) return "";
            const date = new Date(dateString);
            return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
        },
        async getDetail() {
            console.log("getDetail demandId:", this.demandId);
            if (!this.demandId) {
                uni.showToast({ title: "缺少参数", icon: "none" });
                return;
            }

            this.loading = true;
            try {
                console.log("开始调用接口");
                const res = await getInteractionDemandDetail(this.demandId);
                console.log("getDetail res:", res);
                if (res.code === 200 || res.success) {
                    // 检查是否是列表结构
                    if (res.rows && res.rows.length > 0) {
                        this.detail = res.rows[0] || {};
                    } else if (res.data) {
                        this.detail = res.data || {};
                    } else {
                        this.detail = res || {};
                    }
                    console.log("detail:", this.detail);
                } else {
                    console.log("getDetail res error:", res);
                    uni.showToast({
                        title: res.msg || "获取详情失败",
                        icon: "none",
                    });
                }
            } catch (error) {
                console.error("获取详情失败:", error);
                uni.showToast({ title: "获取详情失败", icon: "none" });
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>
<style scoped lang="scss">
.page-container {
    padding-bottom: 200rpx;
    .detail {
        width: 85%;
        margin: 30rpx auto;
        background-color: #fff;
        border-radius: 20rpx;
        padding: 30rpx;

        .title {
            font-size: 28rpx;
            font-weight: bold;
            color: rgba(0, 0, 0, 0.9);
            padding: 0rpx 0rpx 20rpx 0;
        }

        .detail-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 30rpx 0;
            color: rgba(0, 0, 0, 0.9);
            font-size: 24rpx;

            .label {
                font-size: 24rpx;
                color: rgba(0, 0, 0, 0.6);
            }

            .value {
                display: flex;
                align-items: center;
                font-size: 24rpx;
                color: rgba(0, 0, 0, 0.9);
            }
        }
    }
}
</style>
