<template>
    <view class="container">
        <view class="header">
            <text class="header-title">{{ detail.title }}</text>
        </view>

        <scroll-view class="content" scroll-y>
            <view class="card">
                <view class="section" v-if="detail.url">
                    <text class="section-title">相关链接</text>
                    <text class="section-content">{{ detail.url }}</text>
                </view>
                <view class="section" v-if="detail.releaseTime">
                    <text class="section-title">发布时间</text>
                    <text class="section-content">{{ detail.createTime}}</text>
                </view>
                <view class="section" v-if="detail.remark">
                    <rich-text :nodes="detail.remark" class="section-content"></rich-text>
                </view>
            </view>
        </scroll-view>
    </view>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { getPolicySupermarketDetail } from '@/api/operations/policySupermarket';

const detail = ref({});

const fetchDetail = async () => {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const id = currentPage.options?.id;

    if (!id) return;

    try {
        const res = await getPolicySupermarketDetail(id);
        if (res && res.data) {
            detail.value = res.data;
        } else if (res) {
            detail.value = res;
        }
    } catch (e) {
        uni.showToast({ title: '获取详情失败', icon: 'none' });
    }
};

onMounted(() => {
    fetchDetail();
});
</script>

<style scoped>
.container {
  background-color: #f1faff;
  min-height: 100vh;
}

.header {
  padding: 24px 16px;
  text-align: center;
}

.header-title {
  width: 299px;
  height: 24px;
  font-family: "Source Han Sans", sans-serif;
  font-weight: 400;
  font-size: 18px;
  color: rgba(0, 0, 0, 0.898);
  line-height: 24px;
  text-align: center;
  font-style: normal;
  text-transform: none;
  margin: 0 auto;
  display: block;
}

.content {
  flex: 1;
  overflow: hidden;
  padding: 0 16px 16px;
}

.card {
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 16px;
  max-width: 92%;
  box-sizing: border-box;
}

.section {
  margin-bottom: 24px;
}

.section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-family: "Source Han Sans", sans-serif;
  font-weight: 400;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.898);
  line-height: 24px;
  text-align: left;
  font-style: normal;
  text-transform: none;
  margin-bottom: 12px;
  display: block;
}

.section-content {
  width: 100%;
  font-family: "Source Han Sans", sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.898);
  line-height: 24px;
  text-align: left;
  font-style: normal;
  text-transform: none;
  margin-bottom: 8px;
  display: block;
}
</style>
