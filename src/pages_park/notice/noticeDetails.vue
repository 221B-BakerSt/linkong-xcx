<template>
 <view class="detail">
    <!-- 标题 -->
    <view class="title">{{ listData.title }} </view>
    <!-- 详情信息 -->
    <view class="detail-info">
      <!-- <view class="detail-info-name">123</view> -->
      <view class="detail-info-item">{{
    listData.createTime
      }}</view>
    </view>
    <!-- 富文本解析 -->
    <view class="detail-content">
      <up-parse :content="content" :tag-style="{p: 'text-indent: 2em;', img: 'margin-left: -2em !important;'}"></up-parse>
    </view>
    <!-- 附件 -->
    
    <view class="attachment" v-if="coverOssUrls" >
                    <up-icon name="attach" size="16" color="#1E88E5"></up-icon>
                    <text class="attachment-label">材料附件：</text>
                    <text
                        class="attachment-link"
                        @click="openAttachment"
                        >附件</text
                    >
                </view>
    <!-- 无数据 -->
    <view v-if="noData" class="no-data">
      <up-empty mode="search" text="没有相关内容"> </up-empty>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import {onLoad} from "@dcloudio/uni-app";

import { getNoticeDetail,getStarEnterpriseDetail,getParkInfoDetail,getParkRecruitDetail } from '@/api/park/park'
onLoad( (options) => {
  let info = JSON.parse(options.info)
  if(info.type === 'zixun'){
    getZiXun(info.id)
  }else if(info.type === 'star'){
    getStarDetail(info.id)
  }else if(info.type === 'notice'){
    getNotice(info.id)
  }else if(info.type === 'zhaoPin'){
    getZhaoPin(info.id)
  }
})
// 创建响应式数据
const content = ref();
const listData = ref({
  title:'',
  createTime:'',
});
const coverOssUrls = ref();
const noData = ref(false);

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

// 获取公告详情
const getNotice = async (noticeId) => {
  const res = await getNoticeDetail(noticeId)
  if (res && res.data) {
    listData.value = {
      title: res.data.noticeTitle,
      createTime: res.data.createTime,
    }
    // 检查是否有Delta格式的内容
    if (res.data.noticeContent) {
  
       // 应用iframe到video的转换
      const convertedContent = convertIframeToVideo(res.data.noticeContent);
      content.value = `
      	${convertedContent}
      `;
    }
  }
}


// 获取咨询详情
const getZiXun=async (zixunId)=>{
  const res = await getParkInfoDetail(zixunId)
  if (res && res.data) {
    listData.value = {
      title:res.data.infoName,
      createTime:res.data.createTime,
    }

    // 应用iframe到video的转换
      const convertedContent = convertIframeToVideo(res.data.infoContent);
      content.value = `
      	${convertedContent}
      `;
   }
}
// 获取企业详情
const getStarDetail=async (starEnterpriseId)=>{
  const res = await getStarEnterpriseDetail(starEnterpriseId)
  if (res && res.data) {
    listData.value = {
      title: res.data.starEnterpriseName,
      createTime: res.data.createTime,
    }
    // 检查是否有Delta格式的内容
    if (res.data.productProfile) {
 
      // 应用iframe到video的转换
      const convertedContent = convertIframeToVideo(res.data.productProfile);
      content.value = `
      	${convertedContent}
      `;
    }
  }
}
// 获取园区企聘详情
const getZhaoPin=async (zhaoPinId)=>{
  const res = await getParkRecruitDetail(zhaoPinId)
  if (res && res.data) {
    listData.value = {
      title: res.data.title,
      createTime: res.data.createTime,
    }
    if(res.data.coverOssUrls){
      coverOssUrls.value = res.data.coverOssUrls
    }
     content.value = res.data.recruitContent
  }
}

// 打开附件
const openAttachment = () => {
  uni.downloadFile({
    url: coverOssUrls.value,
    success: function (res) {
      if (res.statusCode === 200) {
        uni.openDocument({
          filePath: res.tempFilePath,
          success: function (res) {
          },
          fail: function (res) {
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



<style lang="scss" scoped>
 
.detail {
  padding: 30rpx;
  background-color: #fff;
  height: 100vh;
  .title {
    font-size: 40rpx;
    font-weight: 550;
    letter-spacing: 1rpx;
  }
  .detail-info {
    display: flex;
    align-items: center;
    padding: 30rpx 0;
    .detail-info-name {
      font-size: 28rpx;
      letter-spacing: 1rpx;
      color: #576b95;
    }
    .detail-info-item {
      margin-left: 20rpx;
      font-size: 28rpx;
      letter-spacing: 1rpx;
      color: #999999;
    }
  }
  .detail-content {
    font-size: 30rpx;
    letter-spacing: 1rpx;
    color: #333333;
 
 
  }

.attachment {
            display: flex;
            align-items: center;
            font-size: 28rpx;
            margin-top: 30rpx;
            .attachment-label {
                color: #666;
                margin-left: 8rpx;
            }
            .attachment-link {
                color: #1e88e5;
                margin-left: 4rpx;
            }
        }
}


</style>
