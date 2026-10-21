<template>
  <view class="page-container">

    <view class="content">
      <view class="info-box">
          <view class="header">
      <view class="title">{{ moduleTitle }}</view>
    </view>
        <up-parse :content="content" :tag-style="{p: 'text-indent: 2em;', img: 'margin-left: -2em !important;'}"></up-parse>
        <view class="attachment" v-for="(url, idx) in attachmentList" :key="idx">
            <up-icon name="attach" size="16" color="#1E88E5"></up-icon>
          <text class="attachment-label">材料附件：</text>
          <text class="attachment-link">{{ moduleTitle }}附件</text>
        </view>
      </view>
    </view>
    <view class="footer">
      <button class="btn-primary" @click="viewAvailable">查看园区文印店</button>
    </view>
  </view>
</template>
<script setup>
import {ref, onMounted, computed} from 'vue'
import { getParkIntroduction } from '@/api/park/park';

const introInfo = ref({});
const attachmentList = ref([]);
const content = ref('');
const MODULE_TITLES = {
    '0': '园区公寓',
    '1': '园区会议室',
    '2': '职工活动中心',
    '3': '园区超市',
    '4': '园区文印店',
    '5': '园区银行',
    '6': '园区餐饮',
};
const moduleTitle = computed(() => {
    return MODULE_TITLES[introInfo.value.module] || '园区文印店';
});

// 转换iframe标签为video标签
function convertIframeToVideo(html) {
  if (!html) return "";
  // 使用正则表达式替换iframe标签为video标签
  const regex = /<iframe\s+class="ql-video"\s+src="([^"]+)"[^>]*><\/iframe>/g;
  return html.replace(
    regex,
    '<video controls="controls" src="$1" style="max-width: 100%; height: auto;"></video>'
  );
}

const getIntro = async () => {
  try {
    const res = await getParkIntroduction({ module: '4' });
    if (res && res.rows && res.rows.length > 0) {
      introInfo.value = res.rows[0];
      // 应用iframe到video的转换
      const convertedContent = convertIframeToVideo(res.rows[0].content);
      content.value = `
      	${convertedContent}
      `;
      if (introInfo.value.ossUrls) {
        attachmentList.value = introInfo.value.ossUrls.split(',').filter(u => u);
      }
    }
  } catch (e) {
    uni.showToast({ title: '获取介绍失败', icon: 'none' });
  }
};

onMounted(() => {
  getIntro();
});

const viewAvailable = () => {
  uni.navigateTo({
    url: '/pages_home/wenyinStore/list'
  })
}
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background-color: #F5F7FA;
  display: flex;
  flex-direction: column;
  padding: 20rpx;
}

.header {
  margin-bottom: 20rpx;
  .title {
    font-size: 32rpx;
    font-weight: bold;
    text-align: center;
    color: #333;
  }
}

.content {
  flex: 1;
  .info-box {
    background-color: #FFFFFF;
    border-radius: 12rpx;
    padding: 24rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
    .info-text {
      font-size: 28rpx;
      line-height: 44rpx;
      color: #333;
      margin-bottom: 24rpx;
    }
    .attachment {
      display: flex;
      align-items: center;
      font-size: 28rpx;
      .attachment-label {
        color: #666;
        margin-left: 8rpx;
      }
      .attachment-link {
        color: #1E88E5 ;
        margin-left: 4rpx;
      }
    }
  }
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 20rpx 70rpx 20rpx;
  background-color: #FFF;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  border-radius: 20rpx;
  .btn-primary {
    width: 100%;
    height: 80rpx;
    background-color: #235EFF;
    color: #FFFFFF;
    font-size: 28rpx;
    border-radius: 36rpx;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .btn-primary::after {
    border: none;
  }
}
</style>
