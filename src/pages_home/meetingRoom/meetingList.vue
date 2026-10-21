<template>
    <scroll-view
        class="page-container"
        @scrolltolower="loadMore"
        scroll-y="true"
        style="height: 100vh"
    >
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
                                : ''
                        "
                        mode="aspectFill"
                    ></image>
                </view>
                <view class="meeting-info">
                    <text class="meeting-name">{{ item.meetingRoomName }}</text>
                    <text class="meeting-id"
                        >编号：{{ item.meetingRoomId }}</text
                    >
                    <text class="meeting-type"
                        >类型：{{ getMeetingType(item.type) }}</text
                    >
                    <text class="meeting-open-time"
                        >开放时间：{{ getOpenTime(item.openTime) }}</text
                    >
                </view>
            </view>
            <!-- 加载更多 -->
            <view class="loading-more" v-if="loading">
                <text>加载中...</text>
            </view>
        </view>
    </scroll-view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { meetingRoomApi } from "@/api/operations/meetingRoom";
import { getParkMeetingRoomList } from "@/api/park/park";

const meetingList = ref([]);
const loading = ref(false);
const page = ref(1);
const limit = ref(7);
const total = ref(0);

// 页面加载时调用会议室列表接口
const getList = async (isLoadMore = false) => {
    if (loading.value) return;

    loading.value = true;

    try {
        const res = await getParkMeetingRoomList({
            pageNum: isLoadMore ? page.value + 1 : 1,
            pageSize: limit.value,
        });

        if (res && res.total) {
            total.value = res.total;
        }

        if (res && res.data) {
            if (isLoadMore) {
                meetingList.value = [...meetingList.value, ...res.data];
                page.value++;
            } else {
                meetingList.value = res.data;
                page.value = 1;
            }
        } else if (res && res.rows) {
            if (isLoadMore) {
                meetingList.value = [...meetingList.value, ...res.rows];
                page.value++;
            } else {
                meetingList.value = res.rows;
                page.value = 1;
            }
        }
    } catch (e) {
        uni.showToast({ title: "获取列表失败", icon: "none" });
    } finally {
        loading.value = false;
    }
};

// 加载更多
const loadMore = () => {
    if (loading.value || meetingList.value.length >= total.value) return;
    getList(true);
};

onMounted(() => {
    getList();
});

// 获取会议室类型
const getMeetingType = (config) => {
    const typeMap = {
        multimediaum: "多媒体会议室",
        small: "小型会议室",
        large: "大型会议室",
        vip: "VIP会议室",
    };
    return typeMap[config] || "普通会议室";
};

// 转换开放时间（0是星期一，6是星期日）
const getOpenTime = (openTime) => {
    const weekDays = {
        0: "星期一",
        1: "星期二",
        2: "星期三",
        3: "星期四",
        4: "星期五",
        5: "星期六",
        6: "星期日",
    };

    // 处理逗号分隔的字符串
    if (typeof openTime === "string" && openTime.includes(",")) {
        return openTime
            .split(",")
            .map((day) => weekDays[day] || "")
            .filter(Boolean)
            .join(", ");
    }

    return weekDays[openTime] || "";
};

function navigateToDetails(item) {
    console.log("item:", item);
    const roomId = item.meetingRoomId || item.id;
    console.log("roomId:", roomId);
    uni.navigateTo({
        url: "/pages_home/meetingRoom/details?meetingRoomId=" + roomId,
        success: function (res) {
            console.log("跳转成功");
        },
        fail: function (err) {
            console.error("跳转失败:", err);
            uni.redirectTo({
                url: "/pages_home/meetingRoom/details?meetingRoomId=" + roomId,
            });
        },
    });
}
</script>

<style scoped>
.page-container {
    padding: 30rpx;
    height: 100vh;
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
}

.meeting-name {
    display: block;
    font-size: 28rpx;
    font-weight: 600;
    margin-bottom: 30rpx;
    color: #000;
}

.meeting-id,
.meeting-type,
.meeting-open-time {
    display: block;
    font-size: 24rpx;
    color: rgba(0, 0, 0, 0.6);
    margin-bottom: 10rpx;
}

.loading-more,
.no-more {
    text-align: center;
    padding: 30rpx 0;
    font-size: 24rpx;
    color: #999;
}
</style>
