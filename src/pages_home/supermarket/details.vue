<template>
    <view class="page-container">
        <!-- 图片 -->
        <view class="imageData">
            <swiper :indicator-dots="false" :autoplay="false" :interval="3000" :duration="1000" class="swiper"
                @change="onSwiperChange">
                <swiper-item v-for="(url, index) in imageList" :key="index">
                    <image :src="url" mode="scaleToFill" style="width: 100%; height: 100%"
                        @click="previewImage(index)">
                    </image>
                </swiper-item>
            </swiper>
            <view class="pagination">
                {{ currentIndex + 1 }}/{{ imageList.length || 1 }}
            </view>
        </view>
        <!-- 详情 -->
        <view class="detail">
            <view class="title">超市详情</view>
            <up-line></up-line>
            <view class="detail-item">
                <view class="label">超市名称</view>
                <view class="value">{{ detail.marketName }}</view>
            </view>
            <view class="detail-item">
                <view class="label">超市位置</view>
                <view class="value">{{ detail.address }}</view>
            </view>
            <view class="detail-item">
                <view class="label">主营业务</view>
                <view class="value"></view>
            </view>
            <view class="detail-item-bottom">
              {{ detail.mainBusiness }}
            </view>
        </view>
     
    </view>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { getParkMarketDetail } from '@/api/park/park';

const currentIndex = ref(0);
const detail = ref({});

const imageList = computed(() => {
    if (!detail.value.ossUrls) return [];
    return detail.value.ossUrls.split(',').filter(u => u);
});

const getDetail = async () => {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const marketId = currentPage.options?.marketId;
    if (!marketId) return;
    try {
        const res = await getParkMarketDetail(marketId);
        if (res && res.data) {
            detail.value = res.data;
        }
    } catch (e) {
        uni.showToast({ title: '获取详情失败', icon: 'none' });
    }
};

onMounted(() => {
    getDetail();
});

const onSwiperChange = (e) => {
    currentIndex.value = e.detail.current;
};

function previewImage(index) {
    if (!imageList.value || imageList.value.length === 0) return;
    uni.previewImage({ current: imageList.value[index], urls: imageList.value });
}
</script>
<style scoped lang="scss">
.page-container {
    padding-bottom: 200rpx;
    .imageData {
        position: relative;
        .swiper {
            height: 422rpx;
        }

        .pagination {
            position: absolute;
            bottom: 20rpx;
            right: 20rpx;
            background-color: rgba(0, 0, 0, 0.5);
            color: white;
            padding: 10rpx 20rpx;
            border-radius: 20rpx;
            font-size: 24rpx;
            z-index: 10;
        }
    }

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
                font-size: 24rpx;
                color: rgba(0, 0, 0, 0.9);
            }
        }

        .detail-item-bottom {
            color: rgba(0, 0, 0, 0.9);
            font-size: 24rpx;
            line-height: 42rpx;
        }
    }

  
}
</style>
