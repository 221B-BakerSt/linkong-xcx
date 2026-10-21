<template>
    <view class="page-container">
        <!-- 详情 -->
        <view class="detail">
            <view class="title">咨询信息</view>
            <up-line></up-line>
            <view class="detail-item">
                <view class="label">咨询模块</view>
                <view v-if="dictSort !== '' && selectedModule" class="value">
                    {{ selectedModule }}
                </view>
                <picker
                    v-else
                    mode="selector"
                    :range="moduleOptions"
                    :value="moduleIndex"
                    @change="handleModuleChange"
                >
                    <view class="value">
                        {{ selectedModule || "请选择" }} >
                    </view>
                </picker>
            </view>
            <view class="detail-item">
                <view class="label">咨询类型</view>
                <picker
                    mode="selector"
                    :range="typeOptions"
                    :value="typeIndex"
                    @change="handleTypeChange"
                >
                    <view class="value">
                        {{ selectedType || "请选择" }} >
                    </view>
                </picker>
            </view>
        </view>

        <!-- 预约人 -->
        <view class="yuyue-ren">
            <view class="title">联系人信息</view>
            <view class="detail-item">
                <view class="label">企业名称</view>
                <up-input
                    v-model="form.companyName"
                    placeholder="请输入企业名称"
                    border="none"
                    text="right"
                />
            </view>
            <view class="detail-item">
                <view class="label">联系人</view>
                <up-input
                    v-model="form.contact"
                    placeholder="请输入联系人"
                    border="none"
                    text="right"
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
        </view>
        <!-- 预约按钮 -->
        <view class="button-container">
            <button class="reserve-button" @click="handleSubmit">
                确认提交
            </button>
        </view>
    </view>
</template>
<script setup>
import { ref, onMounted, reactive } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { getUserProfile, getDicts } from "@/api/system/user";
import { addUserConsult } from "@/api/system/userInquiry";

// 响应式数据
const form = reactive({
    companyName: "",
    contact: "",
    phoneNum: "",
});

// 咨询模块和类型选项
const moduleOptions = ref([]);
const moduleValues = ref([]);
const typeOptions = ref([]);
const typeValues = ref([]);
const selectedModule = ref("");
const selectedType = ref("");
const moduleIndex = ref(0);
const typeIndex = ref(0);
const sourceType = ref("");
const dictSort = ref("");

// 获取页面参数
onLoad((options) => {
    if (options.source) {
        sourceType.value = options.source;
    }
    if (options.dictSort) {
        dictSort.value = options.dictSort;
    }
});

// 从 getUserProfile 获取联系人信息和字典数据
onMounted(async () => {
    try {
        // 获取用户信息
        const userRes = await getUserProfile();
        if (userRes && userRes.data && userRes.data.user) {
            const user = userRes.data.user;
            if (user.deptName) {
                form.companyName = user.deptName;
            }
            if (user.nickName) {
                form.contact = user.nickName;
            }
            if (user.phonenumber) {
                form.phoneNum = user.phonenumber;
            }
        }

        // 获取咨询模块字典数据
        const moduleRes = await getDicts("institution_type");
        if (moduleRes && moduleRes.data) {
            moduleOptions.value = moduleRes.data.map((item) => item.dictLabel);
            moduleValues.value = moduleRes.data.map((item) => item.dictValue);

            // 根据dictSort参数自动选择咨询模块
            if (dictSort.value) {
                const index = parseInt(dictSort.value);
                if (index >= 0 && index < moduleOptions.value.length) {
                    moduleIndex.value = index;
                    selectedModule.value = moduleOptions.value[index];
                } else {
                    // 当index超出范围时，不设置selectedModule，显示picker组件
                    selectedModule.value = "";
                }
            } else if (sourceType.value) {
                // 根据来源自动选择咨询模块
                let targetModule = "";
                switch (sourceType.value) {
                    case "technical":
                        targetModule = "技术服务";
                        break;
                    case "finance":
                        targetModule = "金融服务";
                        break;
                    case "policy":
                        targetModule = "政策服务";
                        break;
                    case "government":
                        targetModule = "政务服务";
                        break;
                    case "institution":
                        targetModule = "服务机构";
                        break;
                }

                if (targetModule) {
                    const index = moduleOptions.value.indexOf(targetModule);
                    if (index !== -1) {
                        moduleIndex.value = index;
                        selectedModule.value = targetModule;
                    }
                }
            }
        }

        // 获取咨询类型字典数据
        const typeRes = await getDicts("enterprise_policydomain");
        if (typeRes && typeRes.data) {
            typeOptions.value = typeRes.data.map((item) => item.dictLabel);
            typeValues.value = typeRes.data.map((item) => item.dictValue);
        }
    } catch (e) {
        console.error("获取数据失败:", e);
        uni.showToast({ title: "获取数据失败", icon: "none" });
    }
});

// 处理咨询模块选择
const handleModuleChange = (e) => {
    moduleIndex.value = e.detail.value;
    selectedModule.value = moduleOptions.value[e.detail.value];
};

// 处理咨询类型选择
const handleTypeChange = (e) => {
    typeIndex.value = e.detail.value;
    selectedType.value = typeOptions.value[e.detail.value];
};

// 验证表单
const validateForm = () => {
    if (!form.companyName) {
        uni.showToast({ title: "请输入企业名称", icon: "none" });
        return false;
    }
    if (!form.contact) {
        uni.showToast({ title: "请输入联系人", icon: "none" });
        return false;
    }
    if (!form.phoneNum) {
        uni.showToast({ title: "请输入联系电话", icon: "none" });
        return false;
    }
    if (!/^1[3-9]\d{9}$/.test(form.phoneNum)) {
        uni.showToast({ title: "请输入正确的手机号码", icon: "none" });
        return false;
    }
    if (!selectedModule.value) {
        uni.showToast({ title: "请选择咨询模块", icon: "none" });
        return false;
    }
    if (!selectedType.value) {
        uni.showToast({ title: "请选择咨询类型", icon: "none" });
        return false;
    }
    return true;
};

// 处理提交
const handleSubmit = async () => {
    // 验证表单
    if (!validateForm()) {
        return;
    }

    try {
        // 构建请求数据
        const requestData = {
            consultModule: selectedModule.value,
            consultType: selectedType.value,
            companyName: form.companyName,
            contact: form.contact,
            phoneNum: form.phoneNum,
        };

        // 调用接口提交数据
        const res = await addUserConsult(requestData);

        if (res.code === 200) {
            uni.showToast({ title: "提交成功", icon: "success" });
            // 提交成功后跳转到 success.vue 页面
            setTimeout(() => {
                uni.navigateTo({
                    url: "/pages_services/success",
                });
            }, 1000);
        } else {
            uni.showToast({ title: res.msg || "提交失败", icon: "none" });
        }
    } catch (e) {
        console.error("提交失败:", e);
        uni.showToast({ title: "网络错误，请稍后重试", icon: "none" });
    }
};

// 处理返回
const handleBackClick = () => {
    uni.navigateBack();
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
