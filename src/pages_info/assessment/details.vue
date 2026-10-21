<template>
    <view class="container">
        <!-- 加载状态 -->
        <view v-if="loading" class="loading-box">加载中...</view>

        <view v-else class="content-box">
            <!-- 考核信息 -->
            <view class="info-section">
                <view class="info-title">考核信息</view>
                <up-line></up-line>
                <view class="info-item">
                    <view class="info-label">任务名称</view>
                    <view class="info-value">{{ detailData.taskName || '-' }}</view>
                </view>
                <view class="info-item">
                    <view class="info-label">截止时间</view>
                    <view class="info-value">{{ detailData.deadline || '-' }}</view>
                </view>
                <view class="info-item" style="display: block;">
                    <view class="info-label" style="margin-bottom: 20rpx;">平台名称 (如有)</view>
                    <view class="platform-text">{{ detailData.platformName || '无' }}</view>
                </view>
            </view>

            <!-- 附件展示 -->
            <view class="info-section" v-if="detailData.attachments && detailData.attachments.length > 0">
                <view class="info-title">附件</view>
                <view class="attachment-list">
                    <image
                        v-for="(item, index) in detailData.attachments"
                        :key="index"
                        :src="item"
                        mode="aspectFill"
                        @click="previewImage(item)"
                    ></image>
                </view>
            </view>

            <view v-else-if="!loading" class="empty-tip">暂无附件</view>
        </view>
    </view>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { getEnterpriseAssessmentDetail } from "@/api/info/assessment"; // 引入 API

const loading = ref(false);
const assessmentId = ref('');
// 假设后端返回结构包含 taskName, deadline, platformName, attachments(数组)
const detailData = reactive({
    taskName: '',
    deadline: '',
    platformName: '',
    attachments: []
});

onMounted(() => {
    // 获取页面参数，假设通过 url?assessmentId=xxx 传递
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    assessmentId.value = currentPage.options?.assessmentId;

    if (assessmentId.value) {
        fetchDetail();
    }
});

// 获取详情
const fetchDetail = async () => {
    loading.value = true;
    try {
        const res = await getEnterpriseAssessmentDetail(assessmentId.value);
        // 假设 res.data 是业务数据，根据实际情况调整取值路径
        const data = res.data || {};

        detailData.taskName = data.taskName;
        detailData.deadline = data.deadline;
        detailData.platformName = data.platformName;
        // 假设附件是字符串数组，如果是对象需映射
        detailData.attachments = Array.isArray(data.attachments) ? data.attachments : [];
    } catch (error) {
        uni.showToast({ title: '获取详情失败', icon: 'none' });
        console.error(error);
    } finally {
        loading.value = false;
    }
};

// 预览图片
const previewImage = (url) => {
    uni.previewImage({
        urls: detailData.attachments,
        current: url
    });
};
</script>

<style scoped lang="scss">
.container {
    flex: 1;
    background-color: #f5f5f5;
    min-height: 100vh;
    padding-bottom: 100rpx;
    .loading-box, .empty-tip {
        text-align: center;
        padding: 100rpx 0;
        color: #999;
    }
    .content-box {
        .info-section {
            width: 85%;
            margin: 30rpx auto;
            background-color: #fff;
            border-radius: 20rpx;
            padding: 30rpx;

            .info-title {
                font-size: 28rpx;
                font-weight: bold;
                color: rgba(0, 0, 0, 0.9);
                padding: 0rpx 0rpx 20rpx 0;
            }

            .info-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 30rpx 0;
                color: rgba(0, 0, 0, 0.9);
                font-size: 24rpx;

                .info-label {
                    font-size: 24rpx;
                    color: rgba(0, 0, 0, 0.6);
                }

                .info-value {
                    text-align: right;
                    max-width: 60%;
                    font-size: 24rpx;
                    color: rgba(0, 0, 0, 0.9);
                }

                .platform-text {
                    font-size: 24rpx;
                    color: rgba(0, 0, 0, 0.9);
                    line-height: 1.6;
                    word-break: break-all;
                }
            }

            .attachment-list {
                display: flex;
                flex-wrap: wrap;
                image {
                    width: 150rpx;
                    height: 150rpx;
                    margin-right: 20rpx;
                    margin-bottom: 20rpx;
                    border-radius: 10rpx;
                    background-color: #eee;
                }
            }
        }
    }
}
</style>
