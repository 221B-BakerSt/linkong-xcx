<template>
    <view class="page-container">
        <!-- 图片 -->
        <view class="imageData">
            <swiper
                :indicator-dots="false"
                :autoplay="false"
                :interval="3000"
                :duration="1000"
                class="swiper"
                @change="onSwiperChange"
            >
                <swiper-item v-for="(url, index) in imageList" :key="index">
                    <image
                        :src="url"
                        mode="scaleToFill"
                        style="width: 100%; height: 100%"
                        @click="previewImage(index)"
                    >
                    </image>
                </swiper-item>
            </swiper>
            <view class="pagination">
                {{ currentIndex + 1 }}/{{ imageList.length || 1 }}
            </view>
        </view>

        <!-- 会议室详情卡片 -->
        <view class="card">
            <view class="detail">
                <view class="detail-title">会议室详情</view>
                <view class="detail-item">
                    <view class="label">名称</view>
                    <view class="value">{{
                        meetingRoomDetail.meetingRoomName || "会议室"
                    }}</view>
                </view>
                <view class="detail-item">
                    <view class="label">编号</view>
                    <view class="value">{{
                        meetingRoomDetail.meetingRoomId
                    }}</view>
                </view>
                <view class="detail-item">
                    <view class="label">类型</view>
                    <view class="value">{{
                        getMeetingType(meetingRoomDetail.type)
                    }}</view>
                </view>
                <view class="detail-item">
                    <view class="label">位置</view>
                    <view class="value">{{ meetingRoomDetail.address }}</view>
                </view>
                <view class="detail-item">
                    <view class="label">面积</view>
                    <view class="value">{{ meetingRoomDetail.area }}m²</view>
                </view>
                <view class="detail-item">
                    <view class="label">容坐率</view>
                    <view class="value"
                        >{{ meetingRoomDetail.seatRate }}人</view
                    >
                </view>
                <view class="detail-item">
                    <view class="label">开放时间</view>
                    <view class="value">{{
                        getOpenTime(meetingRoomDetail.openTime)
                    }}</view>
                </view>
                <view class="detail-item">
                    <view class="label">配套设施</view>
                    <view class="value">{{
                        meetingRoomDetail.matchService || "无"
                    }}</view>
                </view>
            </view>
        </view>

        <!-- 预定时间卡片 -->
        <view class="card">
            <view class="facilities-section">
                <view class="facilities-title">预定时间(8小时)</view>
                <view class="date-container">
                    <view
                        v-for="(item, index) in dateList"
                        :key="index"
                        class="date-item"
                        :class="{
                            active: selectedDateIndex === index,
                            disabled: !isDateInOpenTime(index),
                        }"
                        @click="selectDate(index)"
                    >
                        <view class="date-week">{{ item.week }}</view>
                        <view class="date-day">{{ item.day }}</view>
                    </view>
                </view>
                <view class="time-container">
                    <view
                        v-for="timeSlot in timeSlots"
                        :key="timeSlot"
                        class="time-slot"
                        :class="getTimeSlotStatus(timeSlot)"
                        @click="selectTimeSlot(timeSlot)"
                    >
                        <view class="time-text">{{ timeSlot }}</view>
                        <view class="time-status">
                            {{
                                getTimeSlotStatus(timeSlot) === "booked"
                                    ? "已约"
                                    : getTimeSlotStatus(timeSlot) === "selected"
                                      ? "选中"
                                      : "空闭"
                            }}
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <!-- 预约按钮 -->
        <view class="button-container">
            <button class="reserve-button" @click="navigateToConfirm">
                预约使用
            </button>
        </view>
    </view>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { meetingRoomApi } from "@/api/operations/meetingRoom";
import { getParkMeetingRoomDetail } from "@/api/park/park";

const currentIndex = ref(0);
const meetingRoomDetail = ref({});
const selectedDateIndex = ref(0);
const bookingList = ref([]);
const selectedTimeSlot = ref(null);

// 生成未来7天的日期和星期
const dateList = computed(() => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        const weekDays = [
            "周日",
            "周一",
            "周二",
            "周三",
            "周四",
            "周五",
            "周六",
        ];
        const weekDay = weekDays[date.getDay()];

        // 计算该日期对应的开放时间索引（0是星期一，6是星期日）
        // getDay() 返回 0（周日）到 6（周六），需要转换为 0（周一）到 6（周日）
        let openTimeIndex;
        if (date.getDay() === 0) {
            openTimeIndex = 6; // 周日对应索引 6
        } else {
            openTimeIndex = date.getDay() - 1; // 其他日期减 1
        }

        dates.push({
            date: date,
            day: date.getDate(),
            week: i === 0 ? "今天" : weekDay,
            openTimeIndex: openTimeIndex,
        });
    }

    return dates;
});

// 图片列表：将 ossUrls 逗号分割为数组
const imageList = computed(() => {
    if (!meetingRoomDetail.value.ossUrls) {
        // 如果没有图片，使用默认图片
        return [];
    }
    return meetingRoomDetail.value.ossUrls.split(",").filter((u) => u);
});

// 定义时间段数组
const timeSlots = ["08:00-10:00", "10:00-12:00", "14:00-16:00", "16:00-18:00"];

// 计算每个时间段的状态
const getTimeSlotStatus = (timeSlot) => {
    // 检查是否已被预约
    const isBooked = bookingList.value.some(
        (item) => item.timeSlot === timeSlot,
    );
    if (isBooked) {
        return "booked";
    }
    // 检查是否被选中
    if (selectedTimeSlot.value === timeSlot) {
        return "selected";
    }
    // 默认状态为空闲
    return "available";
};

// 获取预约列表
const fetchBookingList = async (bookingDate) => {
    try {
        console.log("调用 getBookingList 接口，传递 bookingDate:", bookingDate);
        const roomsRes = await meetingRoomApi.getBookingList({
            bookingDate,
        });
        console.log("getBookingList 接口返回:", roomsRes);
        if (roomsRes && roomsRes.rows) {
            bookingList.value = roomsRes.rows;
        } else {
            bookingList.value = [];
        }
        // 重置选中的时间段
        selectedTimeSlot.value = null;
    } catch (e) {
        console.error("获取预约列表失败:", e);
        bookingList.value = [];
    }
};

// 页面加载时调用会议室详情接口和获取会议室列表
const getDetail = async () => {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const meetingRoomId = currentPage.options?.meetingRoomId;
    console.log("meetingRoomId:", meetingRoomId);
    if (!meetingRoomId) {
        console.error("会议室ID不存在");
        return;
    }

    try {
        // 获取会议室详情
        const res = await getParkMeetingRoomDetail(meetingRoomId);
        if (res && res.data) {
            meetingRoomDetail.value = res.data;
        } else if (res) {
            // 兼容不同的响应格式
            meetingRoomDetail.value = res;
        }

        // 获取今天的日期，格式为 YYYY-MM-DD
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        const bookingDate = `${year}-${month}-${day}`;

        // 调用 fetchBookingList 函数获取预约列表
        await fetchBookingList(bookingDate);
    } catch (e) {
        console.error("获取详情失败:", e);
    }
};

onMounted(() => {
    getDetail();
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

// 检查日期是否在开放时间内
const isDateInOpenTime = (dateIndex) => {
    const openTime = meetingRoomDetail.value.openTime;
    if (!openTime) return false;

    const openTimeIndex = dateList.value[dateIndex].openTimeIndex;

    // 处理逗号分隔的字符串
    if (typeof openTime === "string" && openTime.includes(",")) {
        return openTime.split(",").includes(openTimeIndex.toString());
    }

    return openTime === openTimeIndex.toString();
};

// 选择日期
function selectDate(index) {
    // 检查该日期是否在开放时间内
    if (!isDateInOpenTime(index)) {
        uni.showToast({ title: "当前时间段会议室未开放", icon: "none" });
        return;
    }

    selectedDateIndex.value = index;
    // 获取选中日期的 bookingDate
    const selectedDate = dateList.value[index].date;
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    const bookingDate = `${year}-${month}-${day}`;
    // 调用 getBookingList 接口
    fetchBookingList(bookingDate);
}

// 选择时间段
function selectTimeSlot(timeSlot) {
    // 检查该时间段是否已被预约
    const isBooked = bookingList.value.some(
        (item) => item.timeSlot === timeSlot,
    );
    if (!isBooked) {
        selectedTimeSlot.value =
            selectedTimeSlot.value === timeSlot ? null : timeSlot;
    }
}

// 预约按钮：将 meetingRoomId、选中的日期和时间传递到 confirm 页面
function navigateToConfirm() {
    const meetingRoomId =
        meetingRoomDetail.value.meetingRoomId || meetingRoomDetail.value.id;
    if (!meetingRoomId) {
        uni.showToast({ title: "会议室信息不存在", icon: "none" });
        return;
    }

    // 获取选中的日期
    const selectedDate = dateList.value[selectedDateIndex.value].date;
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    const bookingDate = `${year}-${month}-${day}`;

    // 使用用户选择的时间段
    const timeSlot = selectedTimeSlot.value || "16:00-18:00";

    uni.navigateTo({
        url: `/pages_home/meetingRoom/confirm?meetingRoomId=${meetingRoomId}&bookingDate=${bookingDate}&timeSlot=${timeSlot}`,
        success: function (res) {
            console.log("跳转成功");
        },
        fail: function (err) {
            console.error("跳转失败:", err);
            // 如果跳转失败，使用 redirectTo 作为备选
            uni.redirectTo({
                url: `/pages_home/meetingRoom/confirm?meetingRoomId=${meetingRoomId}&bookingDate=${bookingDate}&timeSlot=${timeSlot}`,
            });
        },
    });
}

const onSwiperChange = (e) => {
    currentIndex.value = e.detail.current;
};

function previewImage(index) {
    if (!imageList.value || imageList.value.length === 0) return;
    uni.previewImage({
        current: imageList.value[index],
        urls: imageList.value,
    });
}
</script>

<style scoped lang="scss">
.page-container {
    min-height: 100vh;
    background-color: #f5fbff;
    border-radius: 0px;
    padding: 20rpx;
    padding-bottom: 100rpx;

    .imageData {
        position: relative;
        margin-bottom: 20rpx;
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

    .price-section {
        padding: 0 10rpx 20rpx;
        font-size: 32rpx;
        font-weight: bold;
        color: #ff4d4f;
    }

    .title-section {
        padding: 0 10rpx 20rpx;
        font-size: 28rpx;
        font-weight: bold;
        color: rgba(0, 0, 0, 0.9);
    }

    .card {
        background-color: #ffffff;
        border-radius: 12rpx;
        padding: 24rpx;
        margin-bottom: 20rpx;
        box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
    }

    .detail {
        .detail-title {
            font-size: 24rpx;
            font-weight: bold;
            color: rgba(0, 0, 0, 0.9);
            margin-bottom: 20rpx;
        }

        .detail-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15rpx 0;
            font-size: 24rpx;

            .label {
                color: rgba(0, 0, 0, 0.6);
            }

            .value {
                color: rgba(0, 0, 0, 0.9);
            }
        }
    }

    .facilities-section {
        .facilities-title {
            font-size: 24rpx;
            font-weight: bold;
            color: rgba(0, 0, 0, 0.9);
            margin-bottom: 20rpx;
        }

        .facilities-content {
            font-size: 24rpx;
            line-height: 42rpx;
            color: rgba(0, 0, 0, 0.9);
        }

        .date-container {
            display: flex;
            overflow-x: auto;
            margin-bottom: 20rpx;
            padding-bottom: 10rpx;

            .date-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-right: 20rpx;
                padding: 10rpx;
                border-radius: 8rpx;
                min-width: 60rpx;
                cursor: pointer;

                &.active {
                    background-color: #3b63ff;
                    color: white;
                }

                &.disabled {
                    background-color: #f5f5f5;
                    color: #999;
                    cursor: not-allowed;
                }

                .date-week {
                    font-size: 18rpx;
                    margin-bottom: 5rpx;
                }

                .date-day {
                    font-size: 24rpx;
                    font-weight: bold;
                }
            }
        }

        .time-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15rpx;

            .time-slot {
                padding: 20rpx;
                border-radius: 8rpx;
                display: flex;
                justify-content: space-between;
                align-items: center;

                &.booked {
                    background-color: #ffecec;
                    color: #ff4d4f;
                }

                &.available {
                    background-color: #e6f7ff;
                    color: #1890ff;
                }

                &.selected {
                    background-color: #fff2e8;
                    color: #fa8c16;
                }

                .time-text {
                    font-size: 20rpx;
                }

                .time-status {
                    font-size: 18rpx;
                }
            }
        }
    }

    .button-container {
        margin-top: 10rpx;

        .reserve-button {
            width: 100%;
            height: 80rpx;
            background-color: #235eff;
            color: #ffffff;
            border-radius: 40rpx;
            font-size: 16px;
            border: none;
        }
    }
}
</style>
