<template>
    <view class="page-container">
        <!-- 预约人 -->
        <view class="yuyue-ren">
            <view class="title">预约人信息</view>
            <up-line></up-line>
            <view class="detail-item">
                <view class="label">预约人</view>
                <up-input
                    placeholder="请输入预约人姓名"
                    border="none"
                    v-model="formData.contact"
                ></up-input>
            </view>
            <view class="detail-item">
                <view class="label">企业名称</view>
                <up-input
                    placeholder="请输入企业名称"
                    border="none"
                    v-model="formData.companyName"
                ></up-input>
            </view>
            <view class="detail-item">
                <view class="label">联系电话</view>
                <up-input
                    placeholder="请输入联系电话"
                    border="none"
                    v-model="formData.phoneNum"
                ></up-input>
            </view>
        </view>
        <!-- 诉求信息 -->
        <view class="content">
            <view class="title">诉求信息</view>
            <up-line></up-line>
            <view class="content-item">
                <view class="label">诉求类型</view>
                <view class="right" @click="showDropdown = !showDropdown">
                    <text>{{ selectedTypeLabel || "请选择诉求类型" }}</text>
                    <up-icon
                        :name="showDropdown ? 'arrow-up' : 'arrow-right'"
                    ></up-icon>
                </view>
                <!-- 简单的下拉框 -->
                <view v-if="showDropdown" class="dropdown-menu">
                    <view
                        v-for="item in columns"
                        :key="item.id"
                        class="dropdown-item"
                        @click="selectType(item)"
                    >
                        {{ item.label }}
                    </view>
                </view>
            </view>
            <view class="content-item">
                <view class="label">诉求内容</view>
            </view>
            <up-textarea
                v-model="formData.demandContent"
                placeholder="请输入内容"
            ></up-textarea>
        </view>
        <!-- 预约按钮 -->
        <view class="button-container">
            <button
                class="reserve-button"
                @click="submitForm"
                :disabled="submitting"
            >
                {{ submitting ? "提交中..." : "提交" }}
            </button>
        </view>
    </view>
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
import { getUserProfile } from "@/api/system/user";
import { addInteractionDemand } from "@/api/home/enterprise";

// 表单数据
const formData = reactive({
    demandType: "",
    contact: "",
    companyName: "",
    demandContent: "",
    phoneNum: "",
});

// 状态
const submitting = ref(false);
const showDropdown = ref(false);
const selectedTypeLabel = ref("");

// 诉求类型选项
const columns = [
    {
        id: "1",
        label: "用工需求",
    },
    {
        id: "2",
        label: "政策咨询",
    },
    {
        id: "3",
        label: "其他诉求",
    },
];

// 选择诉求类型
const selectType = (item) => {
    formData.demandType = item.id;
    selectedTypeLabel.value = item.label;
    showDropdown.value = false;
};

// 从 getUserProfile 获取联系人信息
onMounted(async () => {
    try {
        // 获取用户信息
        const userRes = await getUserProfile();
        if (userRes && userRes.data && userRes.data.user) {
            const user = userRes.data.user;
            if (user.deptName) {
                formData.companyName = user.deptName;
            }
            if (user.nickName) {
                formData.contact = user.nickName;
            }
            if (user.phonenumber) {
                formData.phoneNum = user.phonenumber;
            }
        }
    } catch (e) {
        console.error("获取数据失败:", e);
        uni.showToast({ title: "获取数据失败", icon: "none" });
    }
});

const submitForm = async () => {
    if (!formData.contact) {
        uni.showToast({ title: "请输入预约人姓名", icon: "none" });
        return;
    }
    if (!formData.companyName) {
        uni.showToast({ title: "请输入企业名称", icon: "none" });
        return;
    }
    if (!formData.phoneNum) {
        uni.showToast({ title: "请输入联系电话", icon: "none" });
        return;
    }

    if (!formData.demandContent) {
        uni.showToast({ title: "请输入诉求内容", icon: "none" });
        return;
    }

    submitting.value = true;
    try {
        const res = await addInteractionDemand(formData);
        if (res.code === 200 || res.success) {
            uni.showToast({ title: "提交成功", icon: "success" });
            setTimeout(() => {
                uni.navigateTo({ url: "/pages_home/enterprise/success" });
            }, 1500);
        } else {
            uni.showToast({ title: res.msg || "提交失败", icon: "none" });
        }
    } catch (error) {
        uni.showToast({ title: "网络异常", icon: "none" });
    } finally {
        submitting.value = false;
    }
};
</script>
<style scoped lang="scss">
.page-container {
    padding-bottom: 200rpx;

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
            padding: 0 0 20rpx 0;
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
        }
    }

    .content {
        width: 85%;
        margin: 30rpx auto;
        background-color: #fff;
        border-radius: 20rpx;
        padding: 30rpx;

        .title {
            font-size: 28rpx;
            font-weight: bold;
            color: rgba(0, 0, 0, 0.9);
            padding: 0 0 20rpx 0;
        }

        .content-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 30rpx 0;
            color: rgba(0, 0, 0, 0.9);
            font-size: 24rpx;
            position: relative;

            .label {
                text-align: right;
                margin-right: 30rpx;
                width: 100rpx;
                font-size: 24rpx;
                color: rgba(0, 0, 0, 0.6);
            }
            .right {
                display: flex;
                justify-content: flex-end;
                align-items: center;
                width: 60%;
                cursor: pointer;
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

/* 下拉框样式 */
.dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #fff;
    border: 1rpx solid #f0f0f0;
    border-radius: 10rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
    z-index: 1000;

    .dropdown-item {
        padding: 20rpx;
        text-align: center;
        border-bottom: 1rpx solid #f0f0f0;
        font-size: 24rpx;
        color: rgba(0, 0, 0, 0.9);
        cursor: pointer;

        &:last-child {
            border-bottom: none;
        }

        &:hover {
            background-color: #f5f5f5;
        }
    }
}
</style>
