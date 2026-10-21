<template>
    <view class="page-container">
        <view class="meeting-list">
            <view
                class="meeting-item"
                v-for="(item, index) in meetingList"
                :key="index"
                @click="navigateToDetails(item)"
            >
                <view class="meeting-image-container">
                    <image
                        class="meeting-image"
                        :src="
                            item.ossUrls
                                ? item.ossUrls
                                      .split(',')
                                      .map((url) => {
                                          let cleanUrl = url.trim();
                                          cleanUrl = cleanUrl.replace(
                                              /[`]/g,
                                              '',
                                          );
                                          cleanUrl = cleanUrl.replace(
                                              /\s/g,
                                              '',
                                          );
                                          return cleanUrl;
                                      })
                                      .filter(
                                          (url) =>
                                              url && url.startsWith('http'),
                                      )[0]
                                : 'https://img1.baidu.com/it/u=3978416878,3045590913&fm=253&fmt=auto&app=138&f=JPEG?w=667&h=500'
                        "
                        mode="aspectFill"
                    ></image>
                    <view class="capacity-tag">{{ item.count }}间</view>
                </view>
                <view class="meeting-info">
                    <text class="meeting-name">{{ item.apartmentName }}</text>
                    <view class="meeting-details">
                        <text class="meeting-detail-item"
                            >数量：{{ item.count }}间</text
                        >
                        <text class="meeting-detail-item"
                            >面积：{{ item.area }}㎡</text
                        >
                    </view>
                    <text class="meeting-price"
                        >￥{{ item.rentPrice.toFixed(2) }} /月</text
                    >
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getApartmentList } from "@/api/operations/apartment";

const meetingList = ref([]);

function navigateToDetails(item) {
    uni.navigateTo({
        url:
            "/pages_home/apartment/details?apartmentId=" +
            (item.apartmentId || item.id),
    });
}

// 页面加载时调用公寓列表接口
const getList = async () => {
    try {
        const res = await getApartmentList({
          orderByColumn: 'createTime',
          isAsc: 'desc',
        });
        if (res && res.rows) {
            meetingList.value = res.rows;
        }
    } catch (e) {
        uni.showToast({ title: "获取列表失败", icon: "none" });
    }
};

onMounted(() => {
    getList();
});
</script>

<style scoped>
.page-container {
    padding: 30rpx;
    min-height: 100vh;
}

.meeting-list {
    display: flex;
    flex-direction: column;
}

.meeting-item {
    background-color: white;

    display: flex;
    padding: 20rpx;
    align-items: center;
    border-radius: 20rpx;
    margin-bottom: 20rpx;
}

.meeting-image-container {
    position: relative;
    width: 240rpx;
    height: 180rpx;
    margin-right: 20rpx;
    flex-shrink: 0;
}

.meeting-image {
    width: 100%;
    height: 100%;
    border-radius: 8rpx;
}

.capacity-tag {
    position: absolute;
    top: 15rpx;
    left: 0;
    background-color: #0256ff;
    color: white;
    padding: 8rpx 20rpx;
    border-radius: 0rpx 20rpx 20rpx 0rpx;
    font-size: 24rpx;
    font-weight: 500;
    opacity: 0.8;
}

.meeting-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 180rpx;
}

.meeting-name {
    display: block;
    font-size: 28rpx;
    font-weight: 600;
    color: #000;
}

.meeting-details {
    display: flex;
    justify-content: space-between;
    margin: 10rpx 0;
}

.meeting-detail-item {
    font-size: 24rpx;
    color: rgba(0, 0, 0, 0.6);
}

.meeting-price {
    display: block;
    font-size: 28rpx;
    font-weight: 600;
    color: #ff4d4f;
    margin-top: 10rpx;
}
</style>
