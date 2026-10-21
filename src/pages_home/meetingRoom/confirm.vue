<template>
    <view class="page-container">
        <view class="section">
            <view class="section-title">会议室详情</view>
            <view class="info-item">
                <view class="label">名称</view>
                <view class="value">{{
                    meetingRoomDetail.meetingRoomName || "会议室"
                }}</view>
            </view>
            <view class="info-item">
                <view class="label">编号</view>
                <view class="value">{{
                    meetingRoomDetail.meetingRoomId || "会议室"
                }}</view>
            </view>
            <view class="info-item">
                <view class="label">类型</view>
                <view class="value">{{
                    getMeetingType(meetingRoomDetail.type)
                }}</view>
            </view>
            <view class="info-item">
                <view class="label">位置</view>
                <view class="value">{{
                    meetingRoomDetail.address || "五号楼一楼101室"
                }}</view>
            </view>
        </view>

        <view class="section">
            <view class="section-title">预约时间</view>
            <view class="info-item">
                <view class="label">预约日期</view>
                <view class="value">{{ form.bookingDate || "请选择" }}</view>
            </view>
            <view class="info-item">
                <view class="label">预约时间</view>
                <view class="value">{{ form.timeSlot || "请选择" }}</view>
            </view>
        </view>

        <view class="section">
            <view class="section-title">预约人信息</view>
            <view class="info-item">
                <view class="label">预约人</view>
                <view class="value">{{ form.contact || "请输入" }}</view>
            </view>
            <view class="info-item">
                <view class="label">企业名称</view>
                <view class="value">{{ form.deptName || "请输入" }}</view>
            </view>
            <view class="info-item">
                <view class="label">联系电话</view>
                <input
                    type="tel"
                    v-model="form.phoneNum"
                    placeholder="请输入"
                    style="
                        flex: 1;
                        text-align: right;
                        border: none;
                        background: transparent;
                        font-size: 24rpx;
                        color: #333;
                    "
                />
            </view>
        </view>

        <view class="button-container">
            <button class="btn-primary" @click="submitBooking">确认预约</button>
        </view>
    </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getParkMeetingRoomDetail } from "@/api/park/park";
import { meetingRoomApi } from "@/api/operations/meetingRoom";
import { getUserProfile } from "@/api/system/user";

const form = ref({
    meetingRoomId: "",
    bookingDate: "",
    timeSlot: "",
    contact: "",
    deptName: "",
    phoneNum: "",
});

const meetingRoomDetail = ref({});
const bookingList = ref([]);
const timeSlots = ["08:00-10:00", "10:00-12:00", "14:00-16:00", "16:00-18:00"];
const timeSlotIndex = ref(0);

// 页面加载时获取参数和会议室详情
const getDetail = async () => {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const { meetingRoomId, bookingDate, timeSlot } = currentPage.options || {};

    if (meetingRoomId) {
        form.value.meetingRoomId = meetingRoomId;
        form.value.bookingDate = bookingDate || "";
        form.value.timeSlot = timeSlot || "";

        try {
            const res = await getParkMeetingRoomDetail(meetingRoomId);
            if (res && res.data) {
                meetingRoomDetail.value = res.data;
            } else if (res) {
                // 兼容不同的响应格式
                meetingRoomDetail.value = res;
            }

            // 调用 getUserProfile 接口获取用户信息
            try {
                const userRes = await getUserProfile();
                if (userRes && userRes.data && userRes.data.user) {
                    const user = userRes.data.user;
                    // 预约人用 nickName
                    if (user.nickName) {
                        form.value.contact = user.nickName;
                    }
                    // 企业名称用 deptName
                    if (user.deptName) {
                        form.value.deptName = user.deptName;
                    }
                    // 联系电话用 phonenumber
                    if (user.phonenumber) {
                        form.value.phoneNum = user.phonenumber;
                    }
                }
            } catch (e) {
                console.error("获取用户信息失败:", e);
            }
        } catch (e) {
            console.error("获取详情失败:", e);
            // 即使获取详情失败，也不影响页面显示
        }
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

// 处理日期选择
const onDateChange = (e) => {
    form.value.bookingDate = e.detail.value;
};

// 处理时间选择
const onTimeChange = (e) => {
    const index = e.detail.value;
    timeSlotIndex.value = index;
    form.value.timeSlot = timeSlots[index];
};

// 提交预约
const submitBooking = async () => {
    try {
        // 调用预约API
        const bookingData = {
            meetingRoomId: form.value.meetingRoomId,
            bookingDate: form.value.bookingDate,
            timeSlot: form.value.timeSlot,
            contact: form.value.contact,
            deptName: form.value.deptName,
            phoneNum: form.value.phoneNum,
        };

        console.log("预约信息:", bookingData);
        const res = await meetingRoomApi.addBooking(bookingData);

        if (res.code === 200) {
            uni.showToast({ title: "预约成功", icon: "success" });

            // 直接跳转，不使用 setTimeout
            uni.navigateTo({
                url: "/pages_home/meetingRoom/success",
                success: function (res) {
                    console.log("跳转成功");
                },
                fail: function (err) {
                    console.error("跳转失败:", err);
                    // 如果跳转失败，使用 redirectTo 作为备选
                    uni.redirectTo({
                        url: "/pages_home/meetingRoom/success",
                    });
                },
            });
        } else {
            uni.showToast({ title: res.msg || "预约失败", icon: "none" });
        }
    } catch (e) {
        console.error("预约失败:", e);
        uni.showToast({ title: "预约失败", icon: "none" });
    }
};
</script>

<style scoped lang="scss">
.page-container {
    min-height: 100vh;
    background-color: #f5f7fa;
    padding: 20rpx;

    .section {
        background-color: #ffffff;
        border-radius: 12rpx;
        padding: 24rpx;
        margin-bottom: 20rpx;
        box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

        .section-title {
            font-size: 28rpx;
            font-weight: bold;
            color: #333;
            margin-bottom: 20rpx;
        }

        .info-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15rpx 0;

            .label {
                font-size: 24rpx;
                color: #666;
            }

            .value {
                font-size: 24rpx;
                color: #333;
            }
        }

        .form-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15rpx 0;

            .label {
                font-size: 24rpx;
                color: #666;
                flex: 1;
            }

            input {
                flex: 2;
                padding: 10rpx;
                border: none;
                font-size: 24rpx;
                color: #333;
            }

            .date-picker,
            .time-picker {
                flex: 2;
                position: relative;

                input {
                    width: 100%;
                    padding-right: 40rpx;
                }

                .icon {
                    position: absolute;
                    right: 10rpx;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 24rpx;
                }

                .picker-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    font-size: 24rpx;
                    color: #333;
                }
            }
        }
    }

    .button-container {
        margin-top: 30rpx;

        .btn-primary {
            width: 100%;
            height: 80rpx;
            background-color: #235eff;
            color: #ffffff;
            font-size: 28rpx;
            border-radius: 40rpx;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .btn-primary::after {
            border: none;
        }
    }
}
</style>
