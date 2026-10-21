<template>
  <view class="satisfaction-container">
    <!-- 调查列表 -->
    <view class="survey-list">
      <view
        class="survey-item"
        v-for="(item, index) in noticeList"
        :key="item.noticeId"
        @click="handleSurveyClick(item)"
      >
        <view class="survey-header">
          <view class="survey-title">{{ item.noticeTitle }}</view>
          <view class="survey-status" :class="getStatusClass(item.noticeType)">{{ getNoticeTypeName(item.noticeType) }}</view>
        </view>
        <view class="survey-footer">
          <view class="survey-deadline-date">{{ formatTime(item.createTime) }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getNoticeList } from '@/api/park/park'

const noticeList = ref([])

// 获取通知公告列表
const getList = async () => {
  try {
    const res = await getNoticeList({
      orderByColumn: 'createTime',
      isAsc: 'desc',
    })
    if (res && res.rows) {
      noticeList.value = res.rows
    }
  } catch (e) {
    uni.showToast({ title: '获取列表失败', icon: 'none' })
  }
}

onMounted(() => {
  getList()
})

// 处理调查项点击
const handleSurveyClick = (item) => {
  let info={
    type:'notice',
    id:item.noticeId
  }
  uni.navigateTo({
    url: "/pages_park/notice/noticeDetails?info=" + JSON.stringify(info),
    success: () => {
      console.log("导航成功");
    },
    fail: (err) => {
      console.log("导航失败:", err);
    },
  });
};

// 根据类型获取状态样式类
const getStatusClass = (type) => {
  // type: 1=通知，2=公告
  return type === 1 ? 'notice' : 'announcement'
}

// 根据类型获取名称
const getNoticeTypeName = (type) => {
  return type === 1 ? '通知' : '公告'
}

// 格式化时间
const formatTime = (timeStr) => {
  if (!timeStr) return ''
  const date = new Date(timeStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}
</script>

<style lang="scss" scoped>
page {
  margin: 0;
  padding: 0;
  background: #f5f5f5;
  border-radius: 0px 0px 0px 0px;
}

.satisfaction-container {
  width: 100%;
  min-height: 100vh;
  background: #f5fbff;
  padding: 16px;
  box-sizing: border-box;
}

.survey-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.survey-item {
  width: 100%;
  height: auto;
  background: #ffffff;
  border-radius: 10px 10px 10px 10px;
  padding: 16px;
  box-sizing: border-box;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.survey-item:active {
  transform: scale(0.98);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.survey-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.survey-title {
  width: 70%;
  height: auto;
  font-family:
    Source Han Sans,
    Source Han Sans;
  font-weight: 500;
  font-size: 14px;
  color: #333333;
  line-height: 20px;
  text-align: left;
  font-style: normal;
  text-transform: none;
}

.survey-status {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family:
    Source Han Sans,
    Source Han Sans;
  font-weight: 400;
  font-size: 12px;
  line-height: 12px;
  text-align: right;
  font-style: normal;
  text-transform: none;
  padding: 2px 8px;
  border-radius: 4px;
}

.survey-status.notice {
  color: #1890ff;
  background: rgba(24, 144, 255, 0.1);
}

.survey-status.announcement {
  color: #fa8c16;
  background: rgba(250, 140, 22, 0.1);
}

.survey-footer {
  display: flex;
  align-items: center;
}

.survey-deadline-label {
  height: 12px;
  font-family:
    Source Han Sans,
    Source Han Sans;
  font-weight: 400;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
  line-height: 12px;
  text-align: left;
  font-style: normal;
  text-transform: none;
}

.survey-deadline-date {
  height: 12px;
  font-family:
    Source Han Sans,
    Source Han Sans;
  font-weight: 400;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
  line-height: 12px;
  text-align: left;
  font-style: normal;
  text-transform: none;
}
</style>
