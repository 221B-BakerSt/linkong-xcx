<template>
    <view class="page-container">
        <!-- 详情 -->
        <view class="detail">
            <view class="title">公寓详情</view>
            <up-line></up-line>
            <view class="detail-item">
                <view class="label">房型名称</view>
                <view class="value">{{ detail.apartmentName }}</view>
            </view>
            <view class="detail-item">
                <view class="label">房型面积(㎡)</view>
                <view class="value">{{ detail.area }}</view>
            </view>
            <view class="detail-item">
                <view class="label">所属楼栋</view>
                <view class="value">{{ detail.buildingAddress }}</view>
            </view>
        </view>

        <!-- 预约人 -->
        <view class="yuyue-ren">
            <view class="title">预约人信息</view>
            <up-line></up-line>
            <view class="detail-item">
                <view class="label">预约人</view>
                <up-input
                    v-model="form.contact"
                    placeholder="请输入预约人"
                    border="none"
                    text="right"
                    disabled
                    disabledColor="#fff"
                />
            </view>
            <view class="detail-item">
                <view class="label">联系电话</view>
                <up-input
                    v-model="form.phoneNum"
                    placeholder="请输入联系电话"
                    border="none"
                    type="number"
                />
            </view>
            <view class="detail-item">
                <view class="label">预约日期</view>
                <view class="value" @click="dateShow = true">
                    <text>{{ formattedDate }}</text>
                    <up-icon name="calendar"></up-icon>
                </view>
            </view>
            <view class="detail-item">
                <view class="label">预约时间</view>
                <view class="value" @click="timeShow = true">
                    <text>{{ formattedTime }}</text>
                    <up-icon name="clock"></up-icon>
                </view>
            </view>
        </view>
        <!-- 预约按钮 -->
        <view class="button-container">
            <button class="reserve-button" @click="navigateToSuccess">
                确认预约
            </button>
        </view>
        <!-- 日期选择器 -->
        <up-datetime-picker
            ref="datetimePickerRef"
            :show="dateShow"
            v-model="dateData"
            mode="date"
            :formatter="formatter"
            :min-date="minDate"
            :max-date="maxDate"
            @cancel="dateShow = false"
            @change="changeDate"
            @confirm="confirmDate"
        ></up-datetime-picker>
        <!-- 时间选择器 -->
        <up-datetime-picker
            ref="timePickerRef"
            :show="timeShow"
            v-model="timeData"
            mode="time"
            :formatter="timeFormatter"
            @cancel="timeShow = false"
            @change="changeTime"
            @confirm="confirmTime"
        ></up-datetime-picker>
    </view>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import {
    getApartmentDetail,
    addApartmentBooking,
} from "@/api/operations/apartment";
import store from "@/store";

const detail = ref({});
const form = ref({
    contact: store.state.user.nickName,
    phoneNum: store.state.user.phoneNum,
    appointmentDate: "",
    appointmentTime: "",
});

const getDetail = async () => {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const apartmentId = currentPage.options?.apartmentId;
    if (!apartmentId) return;
    try {
        const res = await getApartmentDetail(apartmentId);
        if (res && res.data) {
            detail.value = res.data;
        }
    } catch (e) {
        uni.showToast({ title: "获取公寓信息失败", icon: "none" });
    }
};

const dateShow = ref(false);
const timeShow = ref(false);

// 初始化默认值
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, "0");
const day = String(now.getDate()).padStart(2, "0");
const hours = String(now.getHours()).padStart(2, "0");
const minutes = String(now.getMinutes()).padStart(2, "0");

// 初始化日期和时间数据为字符串格式
const dateData = ref(`${year}-${month}-${day}`);
const timeData = ref(`${hours}:${minutes}`);

const initDefaultValues = () => {
    // 初始化默认日期
    form.value.appointmentDate = `${year}-${month}-${day}`;

    // 初始化默认时间
    form.value.appointmentTime = `${hours}:${minutes}`;
};
const datetimePickerRef = ref(null);
const timePickerRef = ref(null);
const minDate = ref(now.getTime());
const maxDateValue = new Date();
maxDateValue.setMonth(maxDateValue.getMonth() + 12);
const maxDate = ref(maxDateValue.getTime());

const formattedDate = computed(() => {
    try {
        // 检查是否是时间戳（长数字）
        if (
            typeof dateData.value === "number" ||
            (typeof dateData.value === "string" && !isNaN(dateData.value))
        ) {
            const date = new Date(Number(dateData.value));
            if (!isNaN(date.getTime())) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");
                return `${year}-${month}-${day}`;
            }
        }
        // 如果不是时间戳，直接返回
        return dateData.value;
    } catch (error) {
        // 出错时返回默认值
        return `${year}-${month}-${day}`;
    }
});

const formattedTime = computed(() => {
    return timeData.value;
});

const formatter = (type, value) => {
    if (type === "year") return `${value}年`;
    if (type === "month") return `${value}月`;
    if (type === "day") return `${value}日`;
    return value;
};

const timeFormatter = (type, value) => {
    if (type === "hour") return `${value}时`;
    if (type === "minute") return `${value}分`;
    return value;
};

onMounted(() => {
    getDetail();
    initDefaultValues();
    if (datetimePickerRef.value) {
        datetimePickerRef.value.setFormatter(formatter);
    }
    if (timePickerRef.value) {
        timePickerRef.value.setFormatter(timeFormatter);
    }
});

const changeDate = (e) => {
    if (e && e.detail && e.detail.value) {
        dateData.value = e.detail.value;
    }
};

const confirmDate = (e) => {
    try {
        if (
            typeof dateData.value === "number" ||
            (typeof dateData.value === "string" && !isNaN(dateData.value))
        ) {
            const date = new Date(Number(dateData.value));
            if (!isNaN(date.getTime())) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");
                form.value.appointmentDate = `${year}-${month}-${day}`;
            }
        } else {
            form.value.appointmentDate = dateData.value;
        }
    } catch (error) {
        form.value.appointmentDate = `${year}-${month}-${day}`;
    }
    dateShow.value = false;
};

const changeTime = (e) => {
    if (e && e.detail && e.detail.value) {
        timeData.value = e.detail.value;
    }
};

const confirmTime = (e) => {
    form.value.appointmentTime = timeData.value;
    timeShow.value = false;
};

const navigateToSuccess = async () => {
    // 构建预约信息
    const bookingData = {
        apartmentId: detail.value.apartmentId,
        contact: form.value.contact,
        phoneNum: form.value.phoneNum,
        appointmentDate: form.value.appointmentDate,
        appointmentTime: form.value.appointmentTime,
    };

    try {
        const res = await addApartmentBooking(bookingData);
        if (res.code === 200) {
            uni.navigateTo({
                url: "/pages_home/apartment/success",
            });
        } else {
            uni.showToast({ title: res.msg || "预约失败", icon: "none" });
        }
    } catch (e) {
        uni.showToast({ title: "预约失败", icon: "none" });
    }
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
            ::v-deep(.u-input) {
                .u-input__content {
                    .u-input__content__field-wrapper {
                        .u-input__content__field-wrapper__field {
                            text-align: right !important;
                        }
                    }
                }
            }
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
    .yuyue-ren {
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
                text-align: right;
                margin-right: 30rpx;
                width: 100rpx;
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
    .button-container {
        padding: 0 30rpx;
        margin-top: 36px;
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
