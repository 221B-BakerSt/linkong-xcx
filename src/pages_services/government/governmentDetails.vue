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
                    <text class="section-content">{{ detail.createTime }}</text>
                </view>
                <view class="section" v-if="detail.remark">
                    <up-parse :content="detail.remark" :tag-style="{p: 'text-indent: 2em;', img: 'margin-left: -2em !important;'}"></up-parse>
                </view>
                <view class="attachment" v-if="detail.ossUrls">
                      <up-icon name="attach" size="16" color="#1E88E5"></up-icon>
                    <text class="attachment-label">材料附件：</text>
                    <text
                        class="attachment-link"
                        @click="openFile(detail.ossUrls)"
                        >{{ detail.title }}附件</text
                    >
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getPolicySupermarketDetail } from '@/api/operations/policySupermarket';

const detail = ref({});

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

const fetchDetail = async () => {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const id = currentPage.options?.id;

    if (!id) return;

    try {
        const res = await getPolicySupermarketDetail(id);
        if (res && res.data) {
            detail.value = res.data;
            // 应用iframe到video的转换
            if (detail.value.remark) {
                detail.value.remark = convertIframeToVideo(detail.value.remark);
            }
        } else if (res) {
            detail.value = res;
            // 应用iframe到video的转换
            if (detail.value.remark) {
                detail.value.remark = convertIframeToVideo(detail.value.remark);
            }
        }
    } catch (e) {
        uni.showToast({ title: '获取详情失败', icon: 'none' });
    }
};

onMounted(() => {
    fetchDetail();
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

.attachment {
    display: flex;
    align-items: center;
    font-size: 14px;
    margin-top: 24px;
}

.attachment-label {
    color: #666;
    margin-left: 8px;
}

.attachment-link {
    color: #1e88e5;
    margin-left: 4px;
}
</style>
