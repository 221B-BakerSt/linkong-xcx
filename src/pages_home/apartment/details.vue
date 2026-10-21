<template>
    <view class="page-container">
        <!-- 图片 -->
        <view class="imageData" v-if="goodsDetail.productImages.length > 0">
            <swiper
                :indicator-dots="false"
                :autoplay="false"
                :interval="3000"
                :duration="1000"
                class="swiper"
                @change="onSwiperChange"
            >
                <swiper-item
                    v-for="(item, index) in goodsDetail.productImages"
                    :key="index"
                >
                    <image
                        :src="item.picUrl"
                        mode="scaleToFill"
                        style="width: 100%; height: 100%"
                        @click="previewImage(index)"
                    >
                    </image>
                </swiper-item>
            </swiper>
            <view class="pagination">
                {{ currentIndex + 1 }}/{{ goodsDetail.productImages.length }}
            </view>
        </view>

        <!-- 价格和房型信息 -->
        <view class="price-info">
            <view class="price">￥{{ formatPrice(detail.rentPrice) }}/月</view>
            <view class="room-type">{{ detail.apartmentName }}</view>
        </view>

        <!-- 详情 -->
        <view class="detail">
            <view class="title">房源详情</view>
            <up-line></up-line>
            <view class="detail-item">
                <view class="label">房型名称</view>
                <view class="value">{{ detail.apartmentName || "-" }}</view>
            </view>
            <view class="detail-item">
                <view class="label">房型数量</view>
                <view class="value">{{ detail.count || "-" }}</view>
            </view>
            <view class="detail-item">
                <view class="label">房型面积(㎡)</view>
                <view class="value">{{ detail.area || "-" }}</view>
            </view>
            <view class="detail-item">
                <view class="label">租金(元)</view>
                <view class="value">{{ formatPrice(detail.rentPrice) }}</view>
            </view>

            <view class="detail-item">
                <view class="label">配套服务</view>
                <view class="value"></view>
            </view>
            <view class="detail-item-bottom">
                {{ detail.supportingFacilities || "暂无配套设施信息" }}
            </view>
        </view>

        <view class="button-container">
            <button class="reserve-button" @click="navigateToSuccess">
                预约看房
            </button>
        </view>
    </view>
</template>
<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { getApartmentDetail } from "@/api/operations/apartment";

const currentIndex = ref(0);
const apartmentId = ref(null);
const detail = ref({
    apartmentId: null,
    apartmentName: "",
    count: 0,
    area: "",
    rentPrice: 0,
    supportingFacilities: "",
    ossUrls: "",
    buildingAddress: "",
});

const goodsDetail = ref({
    productName: "",
    exchangePoints: 0,
    productImages: [],
});

// 获取公寓详情
const fetchDetail = async () => {
    try {
        const res = await getApartmentDetail(apartmentId.value);
        if (res.code === 200) {
            detail.value = res.data;
            // 处理图片列表
            if (res.data.ossUrls) {
                const urls = res.data.ossUrls
                    .split(",")
                    .map((url) => {
                        // 清理 URL，去除所有非 URL 字符
                        let cleanUrl = url.trim();
                        // 去除反引号
                        cleanUrl = cleanUrl.replace(/[`]/g, "");
                        // 去除空格
                        cleanUrl = cleanUrl.replace(/\s/g, "");
                        return cleanUrl;
                    })
                    .filter((url) => url && url.startsWith("http"));
                goodsDetail.value.productImages = urls.map((url) => ({
                    picUrl: url,
                }));
            }
        }
    } catch (error) {
        console.error("获取公寓详情失败:", error);
    }
};

// 页面加载时获取参数
onLoad((options) => {
    console.log("onLoad options:", options);
    apartmentId.value = options?.apartmentId;
    if (apartmentId.value) {
        fetchDetail();
    } else {
        console.log("没有获取到 apartmentId");
    }
});

// 格式化价格
const formatPrice = (price) => {
    if (!price) return "0.00";
    return price.toFixed(2);
};

// 预约按钮点击事件
function navigateToSuccess() {
    uni.navigateTo({
        url: "/pages_home/apartment/confirm?apartmentId=" + apartmentId.value,
    });
}

const onSwiperChange = (e) => {
    currentIndex.value = e.detail.current;
};

// 点击图片预览
function previewImage(index) {
    let url = goodsDetail.value.productImages.map((item) => {
        return item.picUrl;
    });

    uni.previewImage({
        current: index, //索引，为了点哪个图片显示那张图片，如果不写则不管点击那张图片都会显示集合第一张
        urls: url, // 图片路径集合
        longPressActions: {
            itemList: ["发送给朋友", "保存图片", "收藏"],
            success: function (data) {
                console.log(
                    "选中了第" +
                        (data.tapIndex + 1) +
                        "个按钮,第" +
                        (data.index + 1) +
                        "张图片",
                );
            },
            fail: function (err) {
                console.log(err.errMsg);
            },
        },
    });
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

    .price-info {
        width: 85%;
        margin: 30rpx auto;
        background-color: #fff;
        border-radius: 20rpx;
        padding: 30rpx;

        .price {
            font-size: 32rpx;
            font-weight: bold;
            color: #ff4d4f;
            margin-bottom: 15rpx;
        }

        .room-type {
            font-size: 24rpx;
            color: rgba(0, 0, 0, 0.9);
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
