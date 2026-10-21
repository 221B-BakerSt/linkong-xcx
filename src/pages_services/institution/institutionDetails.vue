<template>
  <view class="container">
    <view class="header">
      <text class="header-title">{{ detail.organizationName }}</text>
      <text class="header-subtitle">{{ detail.organizationType }}</text>
      <!-- <image src="/pages_services/static/kefu.png" mode="aspectFit" class="header-icon"></image> -->
    </view>


    <view class="content">
      <view class="section" v-if="detail.businessScope">
        <text class="section-title">经营范围</text>
        <text class="section-content">{{ detail.businessScope }}</text>
      </view>

      <view class="section" v-if="detail.manageScope">
        <text class="section-title">管理范围</text>
        <text class="section-content">{{ detail.manageScope }}</text>
      </view>

      <view class="section" v-if="detail.honorQualification">
        <text class="section-title">荣誉资质</text>
        <text class="section-content">{{ detail.honorQualification }}</text>
      </view>

      <view class="section" v-if="detail.servicePerformance">
        <text class="section-title">服务业绩</text>
        <text class="section-content">{{ detail.servicePerformance }}</text>
      </view>
    </view>

    <view class="certificates-card">
      <view class="certificate-item" v-if="detail.licenseOssUrls">
        <text class="certificate-label">营业执照：</text>
        <image :src="detail.licenseOssUrls" mode="widthFix" style="width:30%;border-radius:4px;"></image>
      </view>
      <view class="certificate-item" v-if="detail.honorsOssUrls">
        <text class="certificate-label">荣誉资质：</text>
        <image :src="detail.honorsOssUrls" mode="widthFix" style="width:30%;border-radius:4px;"></image>
      </view>
    </view>
  </view>
</template>

<script>
import { getServiceOrganizationDetail } from '@/api/operations/policySupermarket';

export default {
  data() {
    return {
      detail: {},
    };
  },
  mounted() {
    this.fetchDetail();
  },
  methods: {
    async fetchDetail() {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const id = currentPage.options?.id;

      if (!id) return;

      try {
        const res = await getServiceOrganizationDetail(id);
        if (res && res.data) {
          this.detail = res.data;
        } else if (res) {
          this.detail = res;
        }
      } catch (e) {
        uni.showToast({ title: '获取详情失败', icon: 'none' });
      }
    },
  },
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: #F5FBFF;
  padding: 32px 16px;
  box-sizing: border-box;
}

.header {
  margin-bottom: 24px;
  position: relative;
}

.header-title {
  font-family: 'Source Han Sans', sans-serif;
  font-weight: 600;
  font-size: 20px;
  color: #333333;
  line-height: 24px;
  text-align: center;
  display: block;
  margin-bottom: 8px;
}

.header-subtitle {
  width: 40px;
  height: 10px;
  font-family: 'Source Han Sans', sans-serif;
  font-weight: 400;
  font-size: 10px;
  color: rgba(0,0,0,0.451);
  line-height: 10px;
  text-align: center;
  font-style: normal;
  text-transform: none;
  display: block;
  margin: 0 auto 16px;
}

.header-icon {
  position: absolute;
  top: 0;
  right: 0;
  width: 32px;
  height: 32px;
}

.tab-bar {
  display: flex;
  background: #FFFFFF;
  border-radius: 8px;
  padding: 4px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 12px 0;
  font-size: 14px;
  color: #666666;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.tab-item.active {
  background: #3B63FF;
  color: #FFFFFF;
  font-weight: 500;
}

.content {
  background: #FFFFFF;
  border-radius: 10px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 16px;
}

.section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 12px;
  display: block;
}

.section-content {
  font-size: 14px;
  color: #666666;
  line-height: 20px;
  text-align: justify;
}

.certificates-card {
  width: 85%;
  height: 30%;
  background: #FFFFFF;
  border-radius: 0px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.certificate-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.certificate-label {
  font-size: 14px;
  color: #666666;
  width: 80px;
  flex-shrink: 0;
}

.certificate-link {
  font-size: 14px;
  color: #3B63FF;
  text-decoration: underline;
  flex: 1;
}
</style>
