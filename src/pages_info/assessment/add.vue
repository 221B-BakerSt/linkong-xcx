<template>
    <view class="container">
        <view class="info-section">
            <view class="info-title">考核信息</view>
            <up-line></up-line>

            <view class="form-item">
                <view class="info-label">任务名称</view>
                <input
                    class="info-input"
                    v-model="formData.assessmentTitle"
                    placeholder="请输入任务名称"
                />
            </view>

            <view class="form-item">
                <view class="info-label">截止时间</view>
                <picker
                    mode="date"
                    :value="formData.releaseDate"
                    @change="onDateChange"
                >
                    <view class="info-input picker-value">
                        {{ formData.releaseDate || "选择截止日期" }}
                    </view>
                </picker>
            </view>

            <view class="form-item" style="display: block">
                <view class="info-label" style="margin-bottom: 20rpx"
                    >平台名称 (如有)</view
                >
                <textarea
                    class="info-textarea"
                    v-model="formData.assessmentContent"
                    placeholder="请输入平台名称"
                    maxlength="500"
                />
            </view>
        </view>

        <view class="info-section">
            <view class="info-label" style="margin-bottom: 20rpx"
                >附件上传</view
            >

            <!-- 自定义上传区域 -->
            <view class="custom-upload-box">
                <!-- 图片列表展示 -->
                <view
                    class="image-item"
                    v-for="(item, index) in fileList"
                    :key="index"
                    @click="previewImage(index)"
                >
                    <image
                        :src="item.url"
                        mode="aspectFill"
                        class="uploaded-image"
                    ></image>
                    <!-- 删除按钮 -->
                    <view class="delete-btn" @click.stop="deletePic(index)"
                        >×</view
                    >
                    <!-- 上传状态标记 -->
                    <view v-if="item.status === 'uploading'" class="status-mask"
                        >上传中...</view
                    >
                    <view
                        v-if="item.status === 'failed'"
                        class="status-mask fail"
                        >失败</view
                    >
                </view>

                <!-- 选择图片按钮 (限制最多 10 张) -->
                <view
                    v-if="fileList.length < 10"
                    class="upload-btn"
                    @click="chooseImage"
                >
                    <view class="plus-icon">+</view>
                    <text class="upload-text">上传</text>
                </view>
            </view>
        </view>

        <view class="button-container">
            <button
                class="reserve-button"
                @click="submitForm"
                :disabled="submitting || loading"
            >
                {{
                    submitting ? "提交中..." : isEdit ? "保存修改" : "确认提交"
                }}
            </button>
        </view>
    </view>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import {
    getEnterpriseAssessmentDetail,
    updateEnterpriseAssessmentDetail,
} from "@/api/info/assessment";
// 引入封装好的上传接口
import { uploadOss } from "@/api/system/user";

// 状态标识
const loading = ref(false);
const submitting = ref(false);
const isEdit = ref(false);
const assessmentId = ref("");

// 表单数据
const formData = reactive({
    assessmentId: "",
    assessmentTitle: "",
    releaseDate: "",
    assessmentContent: "",
});

// 图片列表 { url: string, status: 'success'|'uploading'|'failed', tempPath?: string }
const fileList = ref([]);

onMounted(() => {
    initPage();
});

// 初始化页面
const initPage = () => {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const id = currentPage.options?.assessmentId;

    if (id) {
        assessmentId.value = id;
        formData.assessmentId = id;
        isEdit.value = true;
        fetchDetail(id);
    } else {
        // 新增时也需要设置 assessmentId，使用时间戳作为临时 ID
        const tempId = Date.now().toString();
        assessmentId.value = tempId;
        formData.assessmentId = tempId;
        isEdit.value = false;
    }
};

// 获取详情并回显
const fetchDetail = async (id) => {
    loading.value = true;
    try {
        const res = await getEnterpriseAssessmentDetail(id);
        const data = res.data || {};

        formData.assessmentTitle = data.assessmentTitle || "";
        formData.releaseDate = data.releaseDate || "";
        formData.assessmentContent = data.assessmentContent || "";

        // 回显已有附件
        let rawAttachments = data.attachments || [];
        if (typeof rawAttachments === "string") {
            rawAttachments = rawAttachments.split(",").filter((i) => i.trim());
        }

        if (Array.isArray(rawAttachments)) {
            fileList.value = rawAttachments.map((url) => ({
                url: url,
                status: "success",
                message: "",
            }));
        }
    } catch (error) {
        console.error(error);
        uni.showToast({ title: "获取详情失败", icon: "none" });
    } finally {
        loading.value = false;
    }
};

// 1. 选择图片 (wx.chooseImage)
const chooseImage = () => {
    const count = 10 - fileList.value.length;
    if (count <= 0) {
        uni.showToast({ title: "最多上传 10 张图片", icon: "none" });
        return;
    }

    wx.chooseImage({
        count: count,
        sizeType: ["compressed"], // 自动压缩
        sourceType: ["album", "camera"], // 可选相册或相机
        success: (res) => {
            const tempFilePaths = res.tempFilePaths;
            // 遍历上传
            tempFilePaths.forEach((path) => {
                uploadSingleImage(path);
            });
        },
        fail: (err) => {
            if (err.errMsg !== "chooseImage:fail cancel") {
                uni.showToast({ title: "选择图片失败", icon: "none" });
            }
        },
    });
};

// 2. 上传单张图片 (调用封装的 uploadOss 接口)
const uploadSingleImage = (tempFilePath) => {
    // 先添加到列表显示占位
    const tempItem = {
        url: tempFilePath, // 本地临时路径用于预览
        status: "uploading",
        message: "上传中",
        tempPath: tempFilePath,
    };
    fileList.value.push(tempItem);
    const currentIndex = fileList.value.length - 1;

    // 调用封装接口，无需手动拼凑 URL 和 Token
    uploadOss({
        filePath: tempFilePath,
        name: "file", // 对应后端 @RequestPart("file")
    })
        .then((res) => {
            // 后端返回结构通常为 { code: 200, msg: "操作成功", data: { url: "...", ... } }
            // 注意：uploadOss 内部可能已经处理过一层 R 包装，具体视 utils/upload 实现而定
            // 假设 res 已经是解包后的数据或者标准 R 对象
            const responseData = res.data || res;

            // 兼容处理：如果 res.code 存在且为 200，取 res.data
            let fileUrl = "";
            if (res.code === 200 && res.data) {
                fileUrl = res.data.url || res.data.data?.url;
            } else if (responseData.url) {
                fileUrl = responseData.url;
            }

            if (fileUrl) {
                // 更新列表项为成功状态
                fileList.value[currentIndex] = {
                    ...fileList.value[currentIndex],
                    status: "success",
                    message: "",
                    url: fileUrl, // 替换为服务器地址
                };
            } else {
                handleUploadError(currentIndex, "上传成功但未返回文件地址");
            }
        })
        .catch((err) => {
            console.error("Upload fail:", err);
            handleUploadError(currentIndex, err.msg || "网络错误");
        });
};

// 处理上传失败
const handleUploadError = (index, msg) => {
    fileList.value[index] = {
        ...fileList.value[index],
        status: "failed",
        message: msg,
    };
    uni.showToast({ title: msg, icon: "none" });
};

// 3. 预览图片 (wx.previewImage)
const previewImage = (index) => {
    const item = fileList.value[index];
    if (!item.url) return;

    // 过滤出所有成功的图片 URL 用于预览列表
    const urls = fileList.value
        .filter((i) => i.status === "success")
        .map((i) => i.url);
    const currentUrl = item.url;

    wx.previewImage({
        current: currentUrl,
        urls: urls,
    });
};

// 4. 删除图片
const deletePic = (index) => {
    wx.showModal({
        title: "提示",
        content: "确定要删除这张图片吗？",
        success: (res) => {
            if (res.confirm) {
                fileList.value.splice(index, 1);
            }
        },
    });
};

// --- 核心上传逻辑结束 ---

const onDateChange = (e) => {
    formData.releaseDate = e.detail.value;
};

// 提交表单
const submitForm = async () => {
    if (loading.value) return;

    // 校验
    if (!formData.assessmentTitle) {
        uni.showToast({ title: "请填写任务名称", icon: "none" });
        return;
    }
    if (!formData.releaseDate) {
        uni.showToast({ title: "请选择截止时间", icon: "none" });
        return;
    }

    // 检查是否有上传失败的图片
    const failedFiles = fileList.value.filter(
        (item) => item.status === "failed",
    );
    if (failedFiles.length > 0) {
        uni.showToast({ title: "有图片上传失败，请处理后提交", icon: "none" });
        return;
    }

    // 检查是否有正在上传的图片
    const uploadingFiles = fileList.value.filter(
        (item) => item.status === "uploading",
    );
    if (uploadingFiles.length > 0) {
        uni.showToast({ title: "图片正在上传中，请稍候", icon: "none" });
        return;
    }

    // 收集图片地址
    const attachmentUrls = fileList.value
        .filter((item) => item.status === "success" && item.url)
        .map((item) => item.url);

    const submitData = {
        assessmentDetId: isEdit.value ? Date.now() : Date.now(), // 考核详情 ID，使用时间戳
        assessmentId: assessmentId.value, // 考核 ID，保持字符串类型避免精度丢失
        ossId: attachmentUrls.join(","), // 上传附件，使用逗号分隔
        assessmentTitle: formData.assessmentTitle,
        releaseDate: formData.releaseDate,
        assessmentContent: formData.assessmentContent,
    };

    submitting.value = true;
    try {
        const res = await updateEnterpriseAssessmentDetail(submitData);

        if (res.code === 200 || res.success) {
            uni.showToast({
                title: isEdit.value ? "修改成功" : "新增成功",
                icon: "success",
            });
            setTimeout(() => {
                uni.navigateBack();
            }, 1500);
        } else {
            uni.showToast({ title: res.msg || "操作失败", icon: "none" });
        }
    } catch (error) {
        console.error(error);
        uni.showToast({ title: "网络异常", icon: "none" });
    } finally {
        submitting.value = false;
    }
};
</script>

<style scoped lang="scss">
.container {
    flex: 1;
    background-color: #f5f5f5;
    min-height: 100vh;
    padding-bottom: 100rpx;

    .page-header {
        text-align: center;
        padding: 40rpx 0;
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        background-color: #fff;
        margin-bottom: 20rpx;
    }

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

        .form-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 30rpx 0;
            border-bottom: 1rpx solid #f0f0f0;

            &:last-child {
                border-bottom: none;
            }

            .info-label {
                font-size: 24rpx;
                color: rgba(0, 0, 0, 0.6);
                width: 180rpx;
            }

            .info-input {
                flex: 1;
                text-align: right;
                font-size: 24rpx;
                color: rgba(0, 0, 0, 0.9);
                height: 40rpx;
                line-height: 40rpx;

                &.picker-value {
                    color: #333;
                }
            }

            .info-textarea {
                width: 100%;
                min-height: 200rpx;
                font-size: 24rpx;
                color: rgba(0, 0, 0, 0.9);
                margin-top: 10rpx;
            }
        }

        // 自定义上传样式
        .custom-upload-box {
            display: flex;
            flex-wrap: wrap;
            gap: 20rpx;

            .image-item {
                position: relative;
                width: 160rpx;
                height: 160rpx;
                border-radius: 12rpx;
                overflow: hidden;
                background-color: #f8f8f8;

                .uploaded-image {
                    width: 100%;
                    height: 100%;
                }

                .delete-btn {
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 40rpx;
                    height: 40rpx;
                    background-color: rgba(0, 0, 0, 0.5);
                    color: #fff;
                    font-size: 32rpx;
                    line-height: 40rpx;
                    text-align: center;
                    border-bottom-left-radius: 12rpx;
                    z-index: 10;
                }

                .status-mask {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.6);
                    color: #fff;
                    font-size: 24rpx;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    &.fail {
                        background-color: rgba(255, 0, 0, 0.6);
                    }
                }
            }

            .upload-btn {
                width: 160rpx;
                height: 160rpx;
                border: 2rpx dashed #ccc;
                border-radius: 12rpx;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background-color: #fafafa;

                .plus-icon {
                    font-size: 60rpx;
                    color: #ccc;
                    line-height: 60rpx;
                }

                .upload-text {
                    font-size: 24rpx;
                    color: #999;
                    margin-top: 10rpx;
                }
            }
        }
    }

    .button-container {
        padding: 0 30rpx;
        margin-top: 60rpx;

        .reserve-button {
            width: 100%;
            height: 80rpx;
            background-color: #235eff;
            color: #ffffff;
            border-radius: 40rpx;
            font-size: 32rpx;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;

            &[disabled] {
                background-color: #a0cfff;
            }
        }
    }
}
</style>
