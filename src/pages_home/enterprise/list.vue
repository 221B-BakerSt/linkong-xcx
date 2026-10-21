<template>
    <view class="container">
        <!-- 导航栏 -->
        <view class="nav-container">
            <view class="nav-wrapper">
                <view
                    class="nav-item"
                    :class="{ active: currentTab === 0 }"
                    @tap="currentTab = 0"
                >
                    <text class="nav-text">未解决</text>
                    <view class="nav-bar" v-if="currentTab === 0"></view>
                </view>
                <view class="filter-divider"></view>
                <view
                    class="nav-item"
                    :class="{ active: currentTab === 1 }"
                    @tap="currentTab = 1"
                >
                    <text class="nav-text">已解决</text>
                    <view class="nav-bar" v-if="currentTab === 1"></view>
                </view>
            </view>
        </view>

        <!-- 内容区域 -->
        <view class="content-container">
            <swiper
                :current="currentTab"
                @change="handleSwiperChange"
                class="swiper-container"
            >
                <!-- 未解决列表 -->
                <swiper-item>
                    <view class="list-container">
                        <view
                            v-for="(item, index) in unresolvedList"
                            :key="index"
                            class="list-item"
                            @tap="goDetail(item)"
                        >
                            <view class="item-content">
                                <view class="item-title">{{
                                    getTypeLabel(item.demandType)
                                }}</view>
                                <view class="item-date">{{
                                    formatDate(item.createTime)
                                }}</view>
                            </view>
                            <view class="item-detail">详情 &gt;</view>
                        </view>
                    </view>
                </swiper-item>

                <!-- 已解决列表 -->
                <swiper-item>
                    <view class="list-container">
                        <view
                            v-for="(item, index) in resolvedList"
                            :key="index"
                            class="list-item"
                            @tap="goDetail(item)"
                        >
                            <view class="item-content">
                                <view class="item-title">{{
                                    getTypeLabel(item.demandType)
                                }}</view>
                                <view class="item-date">{{
                                    formatDate(item.createTime)
                                }}</view>
                            </view>
                            <view class="item-detail">详情 &gt;</view>
                        </view>
                    </view>
                </swiper-item>
            </swiper>
        </view>
    </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getInteractionDemandList } from "@/api/home/enterprise";

// 当前选中的标签
const currentTab = ref(0);

// 列表数据
const unresolvedList = ref([
 
]);
const resolvedList = ref([
  
]);

// 加载状态
const loading = ref(false);

// 格式化日期
const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
};

// 获取诉求类型标签
const getTypeLabel = (type) => {
    const typeMap = {
        1: "用工需求",
        2: "政策咨询",
        3: "其他诉求",
    };
    return typeMap[type] || "";
};

// 处理滑动切换
const handleSwiperChange = (e) => {
    currentTab.value = e.detail.current;
};

// 跳转详情页
const goDetail = (item) => {
    console.log("goDetail item:", item);
    console.log("goDetail item.demandId:", item.demandId);
    if (!item.demandId) {
        uni.showToast({ title: "缺少诉求ID", icon: "none" });
        return;
    }
    uni.navigateTo({
        url: `/pages_home/enterprise/details?id=${item.demandId}`,
    });
};

// 获取未解决列表
const getUnresolvedList = async () => {
    loading.value = true;
    try {
        console.log("开始获取未解决列表");
        const res = await getInteractionDemandList( {
        orderByColumn: 'createTime',
        isAsc: 'desc',
      });
        console.log("getUnresolvedList res:", res);
        if (res.code === 200 || res.success) {
            // 过滤未解决的诉求
            unresolvedList.value = (res.rows || []).filter(
                (item) => !item.state || item.state === 0,
            );
            console.log("unresolvedList:", unresolvedList.value);
            console.log("unresolvedList length:", unresolvedList.value.length);
        }
    } catch (error) {
        console.error("获取未解决列表失败:", error);
    } finally {
        loading.value = false;
    }
};

// 获取已解决列表
const getResolvedList = async () => {
    loading.value = true;
    try {
        console.log("开始获取已解决列表");
        const res = await getInteractionDemandList({}, { page: 1, size: 10 });
        console.log("getResolvedList res:", res);
        if (res.code === 200 || res.success) {
            // 过滤已解决的诉求
            resolvedList.value = (res.rows || []).filter(
                (item) => item.state === 1,
            );
            console.log("resolvedList:", resolvedList.value);
            console.log("resolvedList length:", resolvedList.value.length);
        }
    } catch (error) {
        console.error("获取已解决列表失败:", error);
    } finally {
        loading.value = false;
    }
};

// 页面加载时获取数据
onMounted(() => {
    console.log("onMounted");
    getUnresolvedList();
    getResolvedList();
});
</script>

<style scoped>
.container {
    width: 100%;
    height: 100vh;
    background-color: #f5f5f5;
}

.nav-container {
    padding: 16rpx 38rpx;
}

.nav-wrapper {
    display: flex;
    width: 100%;
    height: 80rpx;
    background-color: #fff;
    border-radius: 20rpx;
    padding: 20rpx 0;
}
.filter-divider {
    width: 2rpx;
    height: 40rpx;
    background-color: #e5e5e5;
    align-self: center;
}
.nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
}

.nav-text {
    font-size: 24rpx;
    color: #666666;
}

.nav-item.active .nav-text {
    color: #235eff;
}

.nav-bar {
    position: absolute;
    bottom: 0;
    width: 40rpx;
    height: 6rpx;
    background-color: #235eff;
    border-radius: 4rpx 4rpx 4rpx 4rpx;
}

.content-container {
    flex: 1;
    overflow: hidden;
}

.swiper-container {
    height: calc(100vh - 80rpx);
}

.list-container {
    padding: 20rpx 32rpx;
}

.list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    padding: 30rpx;
    border-radius: 12rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.item-content {
    flex: 1;
}

.item-title {
    font-size: 30rpx;
    font-weight: 500;
    color: #333;
    margin-bottom: 10rpx;
}

.item-date {
    font-size: 24rpx;
    color: #999;
}

.item-detail {
    font-size: 24rpx;
    color: rgba(0, 0, 0, 0.6);
}
</style>
