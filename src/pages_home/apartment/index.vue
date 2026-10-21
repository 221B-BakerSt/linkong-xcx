<template>
  <view class="page-container">

    <view class="content">
      <view class="info-box">
        <view class="header">
          <view class="title">{{ moduleTitle }}</view>
        </view>
        <up-parse :content="content" :tag-style="{p: 'text-indent: 2em;', img: 'margin-left: -2em !important;'}"></up-parse>
        <view class="attachment" v-if="info.ossUrls">
          <up-icon name="attach" size="16" color="#1E88E5"></up-icon>
          <text class="attachment-label">材料附件：</text>
          <text class="attachment-link" @click="openFile(info.ossUrls)">{{ moduleTitle }}附件</text>
        </view>
      </view>
    </view>
    <view class="footer">
      <button class="btn-primary" @click="viewAvailable">查看园区公寓</button>
    </view>
  </view>
</template>
<script setup>
import { getParkIntroduction } from '@/api/park/park';
import { ref, computed } from 'vue';
import { onMounted } from 'vue';

const MODULE_TITLES = {
  '0': '园区公寓',
  '1': '园区会议室',
  '2': '园区配套',
  '3': '园区配套',
  '4': '园区餐饮',
  '5': '园区配套',
  '6': '园区配套',
};

const info = ref({});
const content = ref('');
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


// 从 URL 中提取文件名
const ossFileName = computed(() => {
  if (!info.value.ossUrls) return '点击查看附件';
  const url = info.value.ossUrls;
  return decodeURIComponent(url.substring(url.lastIndexOf('/') + 1));
});

const moduleTitle = computed(() => {
  return MODULE_TITLES[info.value.module] || '园区公寓';
});

const getInfo = async () => {
  // 调用接口，显式传递参数 module: "0" 表示园区公寓
  const res = await getParkIntroduction({ module: '0' });
  if (res && res.rows && res.rows.length > 0) {
   info.value = res.rows[0];
     // 应用iframe到video的转换
      const convertedContent = convertIframeToVideo(res.rows[0].content);
      content.value = `
      	${convertedContent}
      `;
  }
};

onMounted(() => {
  getInfo();
});

const openFile = (url) => {
  uni.downloadFile({
    url: url,
    success: function (res) {
      if (res.statusCode === 200) {
        uni.openDocument({
          filePath: res.tempFilePath,
          success: function (res) {
            console.log('打开文档成功');
          },
          fail: function (res) {
            console.log('打开文档失败:', res);
            uni.showToast({
              title: '无法打开该文件',
              icon: 'none'
            });
          }
        });
      }
    },
    fail: function (res) {
      console.log('下载文件失败:', res);
      uni.showToast({
        title: '下载文件失败',
        icon: 'none'
      });
    }
  });
};

const viewAvailable = () => {
  uni.navigateTo({
    url: '/pages_home/apartment/apartmentList'
  });
};
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
