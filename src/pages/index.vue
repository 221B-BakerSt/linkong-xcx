<template>
  <view class="page-container">
    <!--顶部个人信息栏-->
    <view class="header-section" :style="{
      marginTop: headerHeight.top + 'px',
      lineHeight: headerHeight.height + 'px',
    }">
      <view class="header-switch" @click="communityBtn">
        <view class="header-switch-txt">
          {{ parkName }}
        </view>
        <!-- <image src="../static/images/icon/home/swap.svg" mode=""></image> -->
      </view>
    </view>
    <!-- logo -->
    <view class="work-container">
      <!-- logo区域 -->
      <view class="logo-box">
        <view class="name">
          <view class="title">{{ parkBrand }}</view>
          <view class="title">智慧园区系统</view>
        </view>
        <image :src="homeImg" class="logo-img"></image>
      </view>
    </view>

    <!-- 轮播图 -->
    <view class="swiper">
      <up-swiper :list="carouselList" keyName="image"  :autoplay="true" circular radius="10"
        height="280rpx"></up-swiper>
    </view>
    <!-- 功能 -->
    <view class="service-grid">
      <!-- 功能区 -->
      <view class="function-area">
        <view class="function-item" @click="houseBtn">
          <view class="function-icon">
            <image src="../static/images/icon/home/2-1.png" mode="aspectFill"></image>
          </view>
          <view class="function-name">园区房源</view>
        </view>
        <view class="function-item" @click="meetingRoomBtn">
          <view class="function-icon">
            <image src="../static/images/icon/home/2-2.png" mode="aspectFill"></image>
          </view>
          <view class="function-name">园区会议室</view>
        </view>
        <view class="function-item" @click="apartmentBtn">
          <view class="function-icon">
            <image src="../static/images/icon/home/2-3.png" mode="aspectFill"></image>
          </view>
          <view class="function-name">园区公寓</view>
        </view>
        <view class="function-item" @click="foodBtn">
          <view class="function-icon">
            <image src="../static/images/icon/home/2-4.png" mode="aspectFill"></image>
          </view>
          <view class="function-name">园区餐饮</view>
        </view>
        <view class="function-item" @click="enterpriseBtn">
          <view class="function-icon">
            <image src="../static/images/icon/home/2-5.png" mode="aspectFill"></image>
          </view>
          <view class="function-name">企业诉求</view>
        </view>
        <up-line></up-line>
        <!-- 通知公告 -->
        <view class="notice-box">
          <view class="notice-title">通知<text class="notice-title-bold">公告</text></view>
          <up-line direction="col" length="40rpx"></up-line>
          <view class="notice-scroll">
            <view v-if="homeLoadState.notice === 'loading'" class="empty-message">公告加载中...</view>
            <view v-else-if="homeLoadState.notice === 'error'" class="empty-message retry-message" @click="loadHomeData()">公告加载失败，点击重试</view>
            <view v-else-if="noticeList.length === 0" class="empty-message">暂无新消息</view>
            <view v-else v-for="(notice, index) in noticeList" :key="notice.id" class="notice-item" @click="toDetails(notice,'notice')"
              :style="{ transform: `translateY(-${currentIndex * 100}%)` }">
              <view class="notice-content">{{ notice.content }}</view>
              <view class="notice-date">{{ notice.date }}</view>
            </view>
          </view>
        </view>
      </view>

    </view>
    <!-- tab标签切换 -->
    <view class="tab-box">
      <!-- tab 标题 -->
      <view class="tab-header">
        <view v-for="tab in tabs" :key="tab.id" class="tab-item" :class="{ active: activeTab === tab.id }"
          @click="switchTab(tab.id)">
          {{ tab.title }}
        </view>
      </view>

      <!-- tab 内容 -->
      <view class="tab-content" @touchstart="touchStart" @touchend="touchEnd">
        <!-- 园企资讯 -->
        <view v-if="activeTab === 1" class="tab-pane">
          <view v-if="homeLoadState.info === 'loading'" class="empty-message">资讯加载中...</view>
          <view v-else-if="homeLoadState.info === 'error'" class="empty-message retry-message" @click="loadHomeData()">资讯加载失败，点击重试</view>
          <view v-else-if="tabData[1].length === 0" class="empty-message">暂无新消息</view>
          <view v-else v-for="item in tabData[1]" :key="item.id" class="news-item" @click="toDetails(item,'zixun')">
            <view class="news-image">
              <image :src="item.image" mode="aspectFill"></image>
            </view>
            <view class="news-content">
              <view class="news-title">{{ item.title }}</view>
              <view class="news-date">{{ item.date }}</view>
            </view>
          </view>
        </view>

        <!-- 园企招聘 -->
        <view v-if="activeTab === 2" class="tab-pane2">
          <view v-if="homeLoadState.recruit === 'loading'" class="empty-message">招聘加载中...</view>
          <view v-else-if="homeLoadState.recruit === 'error'" class="empty-message retry-message" @click="loadHomeData()">招聘加载失败，点击重试</view>
          <view v-else-if="tabData[2].length === 0" class="empty-message">暂无新消息</view>
          <view v-else v-for="item in tabData[2]" :key="item.id" class="news-item" @click="toDetails(item,'zhaoPin')">
            <view class="news-title">{{ item.title }}</view>
            <view class="news-date">{{ item.date }}</view>
          </view>
        </view>

        <!-- 明星企业 -->
        <view v-if="activeTab === 3" class="tab-pane3">
          <view v-if="homeLoadState.enterprise === 'loading'" class="empty-message">企业列表加载中...</view>
          <view v-else-if="homeLoadState.enterprise === 'error'" class="empty-message retry-message" @click="loadHomeData()">企业列表加载失败，点击重试</view>
          <view v-else-if="tabData[3].length === 0" class="empty-message">暂无新消息</view>
          <view v-else v-for="item in tabData[3]" :key="item.id" class="news-item" @click="toDetails(item,'star')">
            <view class="news-image">
              <image :src="item.logoOssUrls" mode="aspectFill"></image>
            </view>
            <view class="news-content">
              <view class="news-title">{{ item.title }}</view>
              <view class="news-content">{{ item.content }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'

import { getNoticeList, getStarEnterpriseList, getParkRecruitList, getParkInfoList, getCarouselList } from '@/api/park/park'
import { getCurrentPark, getCurrentParkId } from '@/utils/parkContext'
import { getMediaUrl } from '@/utils/media'
const headerHeight = wx.getMenuButtonBoundingClientRect();
import homeImg from '@/static/images/icon/home/1.png'
import sharedHomeBanner from '@/static/images/home/shared-home-banner.jpg'

const parkName = ref(getCurrentPark()?.parkName || '请选择园区')
const parkBrand = computed(() => {
  const name = parkName.value || ''
  return name.replace(/^郑州/, '').replace(/园$/, '') || '临空'
})
const communityBtn = () => {
  uni.switchTab({ url: '/pages/mine' })
}
let loadedParkId = ''
let homeRefreshToken = 0
// A small packaged fallback keeps a new park from rendering a blank carousel
// while its own Banner entry is still being configured in the web console.
const SHARED_HOME_BANNER_URL = sharedHomeBanner
let noticeTimer = null
const silentRequest = { showLoading: false }
const homeLoadState = ref({
  notice: 'loading',
  info: 'loading',
  recruit: 'loading',
  enterprise: 'loading'
})

onShow(() => {
  parkName.value = getCurrentPark()?.parkName || '请选择园区'
  const currentParkId = getCurrentParkId()
  if (currentParkId && currentParkId !== loadedParkId) {
    loadHomeData(currentParkId)
  }
})
//轮播图
const carouselList = ref([{
  image: SHARED_HOME_BANNER_URL,
  title: '临空智慧园区'
}])

function useSharedHomeBanner() {
  carouselList.value = [{
    image: SHARED_HOME_BANNER_URL,
    title: '临空智慧园区'
  }]
}

// 公告数据
const noticeList = ref([]);

// 滚动索引
const currentIndex = ref(0);
// 获取轮播
async function getCarouselListApi(expectedParkId) {
  try {
    const res = await getCarouselList(undefined, silentRequest)
    if (getCurrentParkId() === expectedParkId && res && Array.isArray(res.rows)) {
      const banners = res.rows.map(item => ({
        image: getMediaUrl(item.ossUrls, homeImg),
        title: item.createTime || ''
      })).filter(item => item.image)
      carouselList.value = banners.length > 0 ? banners : []
      if (carouselList.value.length === 0) useSharedHomeBanner()
    }
  } catch (e) {
    console.error('获取轮播图失败:', e)
    if (getCurrentParkId() === expectedParkId) useSharedHomeBanner()
  }
}
// 获取通知公告列表
const getNoticeListApi = async (expectedParkId) => {
  try {
    const res = await getNoticeList(undefined, silentRequest)
    if (getCurrentParkId() === expectedParkId && res && Array.isArray(res.rows)) {
      noticeList.value = res.rows.map(item => ({
        id: item.noticeId,
        content: item.noticeTitle,
        date: formatTime(item.createTime)
      }))
    }
    if (getCurrentParkId() === expectedParkId) homeLoadState.value.notice = 'ready'
  } catch (e) {
    console.error('获取公告列表失败:', e)
    if (getCurrentParkId() === expectedParkId) homeLoadState.value.notice = 'error'
  }
}

// 获取明星企业列表
const getStarEnterpriseListApi = async (expectedParkId) => {
  try {
    const res = await getStarEnterpriseList(
      {
        orderByColumn: 'createTime',
        isAsc: 'desc',
      },
      silentRequest
    )
    if (getCurrentParkId() === expectedParkId && res && Array.isArray(res.rows)) {
      tabData.value[3] = res.rows.map(item => ({
        id: item.starEnterpriseId,
        logoOssUrls: getMediaUrl(item.logoOssUrls, homeImg),
        title: item.starEnterpriseName,
        content: item.starEnterpriseProfile || ''
      }))
    }
    if (getCurrentParkId() === expectedParkId) homeLoadState.value.enterprise = 'ready'
  } catch (e) {
    console.error('获取明星企业列表失败:', e)
    if (getCurrentParkId() === expectedParkId) homeLoadState.value.enterprise = 'error'
  }
}

// 获取园区招聘列表
const getParkRecruitListApi = async (expectedParkId) => {
  try {
    const res = await getParkRecruitList(
      {
        orderByColumn: 'createTime',
        isAsc: 'desc',
      },
      silentRequest
    )
    if (getCurrentParkId() === expectedParkId && res && Array.isArray(res.rows)) {
      tabData.value[2] = res.rows.map(item => ({
        id: item.recruitId,
        title: item.title || '',
        date: formatTime(item.createTime)
      }))
    }
    if (getCurrentParkId() === expectedParkId) homeLoadState.value.recruit = 'ready'
  } catch (e) {
    console.error('获取园区招聘列表失败:', e)
    if (getCurrentParkId() === expectedParkId) homeLoadState.value.recruit = 'error'
  }
}

// 格式化时间
const formatTime = (timeStr) => {
  if (!timeStr) return ''
  // 处理 iOS 兼容性问题，将 "yyyy-MM-dd HH:mm:ss" 格式转换为 "yyyy/MM/dd HH:mm:ss"
  const iosCompatibleTime = timeStr.replace(/-/g, '/')
  const date = new Date(iosCompatibleTime)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  return `${year}.${month}.${day} ${hour}:${minute}`
}

// 获取园区资讯列表
const getParkInfoListApi = async (expectedParkId) => {
  try {
    const res = await getParkInfoList(
      {
        orderByColumn: 'createTime',
        isAsc: 'desc',
      },
      silentRequest
    )
    if (getCurrentParkId() === expectedParkId && res && Array.isArray(res.rows)) {
      tabData.value[1] = res.rows.map(item => ({
        id: item.infoId,
        image: getMediaUrl(item.infoCoverUrl, homeImg),
        title: item.infoName || '',
        date: formatTime(item.createTime)
      }))
    }
    if (getCurrentParkId() === expectedParkId) homeLoadState.value.info = 'ready'
  } catch (e) {
    console.error('获取园区资讯列表失败:', e)
    if (getCurrentParkId() === expectedParkId) homeLoadState.value.info = 'error'
  }
}

const loadHomeData = async (parkId = getCurrentParkId()) => {
  if (!parkId) {
    useSharedHomeBanner()
    homeLoadState.value = { notice: 'ready', info: 'ready', recruit: 'ready', enterprise: 'ready' }
    return
  }
  const refreshToken = ++homeRefreshToken
  loadedParkId = parkId
  useSharedHomeBanner()
  noticeList.value = []
  tabData.value = { 1: [], 2: [], 3: [] }
  homeLoadState.value = { notice: 'loading', info: 'loading', recruit: 'loading', enterprise: 'loading' }
  currentIndex.value = 0

  await Promise.allSettled([
    getCarouselListApi(parkId),
    getNoticeListApi(parkId),
    getStarEnterpriseListApi(parkId),
    getParkRecruitListApi(parkId),
    getParkInfoListApi(parkId)
  ])

  // 园区切换期间旧请求返回时，不允许覆盖新园区的数据。
  if (refreshToken !== homeRefreshToken || getCurrentParkId() !== parkId) return
}

// 滚动公告
onMounted(() => {
  loadHomeData()

  noticeTimer = setInterval(() => {
    if (noticeList.value.length > 0) {
      currentIndex.value = (currentIndex.value + 1) % noticeList.value.length;
    }
  }, 3000);
});

onUnmounted(() => {
  if (noticeTimer) clearInterval(noticeTimer)
})

// Tab 数据
const tabs = ref([
  { id: 1, title: '园企资讯' },
  { id: 2, title: '园企招聘' },
  { id: 3, title: '明星企业' }
]);

// 当前选中的 tab
const activeTab = ref(1);

// 切换 tab
const switchTab = (tabId) => {
  activeTab.value = tabId;
};

// 触摸事件
const touchStartX = ref(0);
const touchEndX = ref(0);

const touchStart = (e) => {
  touchStartX.value = e.touches[0].clientX;
};

const touchEnd = (e) => {
  touchEndX.value = e.changedTouches[0].clientX;
  handleSwipe();
};

const handleSwipe = () => {
  const diff = touchEndX.value - touchStartX.value;
  // 向左滑动
  if (diff < -50) {
    if (activeTab.value < tabs.value.length) {
      activeTab.value += 1;
    }
  }
  // 向右滑动
  if (diff > 50) {
    if (activeTab.value > 1) {
      activeTab.value -= 1;
    }
  }
};

// Tab 数据
const tabData = ref({
  1: [], // 园企资讯
  2: [], // 园企招聘
  3: []  // 明星企业
});
// 园区房源
const houseBtn = () => {
  uni.navigateTo({
    url: '/pages_home/house/index'
  })
}
// 园区会议室
const meetingRoomBtn = () => {
  uni.navigateTo({
    url: '/pages_home/meetingRoom/index'
  })
}
// 园区公寓
const apartmentBtn = () => {
  uni.navigateTo({
    url: '/pages_home/apartment/index'
  })
}
// 园区餐饮
const foodBtn = () => {
  uni.navigateTo({
    url: '/pages_home/food/index'
  })
}
// 园区企业
const enterpriseBtn = () => {
  uni.navigateTo({
    url: '/pages_home/enterprise/index'
  })
}
// 跳转详情页
const toDetails = (item,type) => {
  if(type === 'zixun'){
    let info={
      type:type,
      id:item.id
    }
    uni.navigateTo({
      url: '/pages_park/notice/noticeDetails?info=' + JSON.stringify(info)
    })
  }else if(type === 'star'){
    let info={
      type:type,
      id:item.id
    }
   uni.navigateTo({
      url: '/pages_park/notice/noticeDetails?info=' + JSON.stringify(info)
    })
  }else if(type === 'notice'){
    let info={
      type:type,
      id:item.id
    }
    uni.navigateTo({
      url: '/pages_park/notice/noticeDetails?info=' + JSON.stringify(info)
    })
  }else if(type === 'zhaoPin'){
    let info={
      type:type,
      id:item.id
    }
    uni.navigateTo({
      url: '/pages_park/notice/noticeDetails?info=' + JSON.stringify(info)
    })
  }
}
</script>

<style lang="scss" scoped>
@font-face {
  font-family: 'YouSheBiaoTiHei';
  src: url('https://linkong.yunlf.cn/linkong/ttf/YouSheBiaoTiHei-2.ttf');
}
view {
  box-sizing: border-box;
}

.page-container {
  width: 100%;
  overflow-x: hidden;
  position: relative;

  /* 隐藏滚动条 */
  &::-webkit-scrollbar {
    display: none;
  }
}


.header-section {
  padding: 0 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;

  .header-switch {
    display: flex;
    align-items: center;

    .header-switch-txt {
      font-weight: 600;
      font-size: 34rpx;
      color: #333;
      margin-right: 12rpx;
    }

    image {
      width: 30rpx;
      height: 30rpx;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    .header-menu {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.work-container {
  padding: 0 30rpx;
  width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;

  .logo-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    .name {
      .title {
        font-family: 'YouSheBiaoTiHei' !important;
        font-size: 56rpx;
        color: #3B63FF;
      }
    }

    .logo-img {
      width: 306rpx;
      height: 225rpx;
    }
  }
}

.swiper {
  margin-top: 5rpx;
  padding: 0 30rpx;
  width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
}

.service-grid {
  padding: 10rpx 30rpx;
  width: 100%;
  overflow-x: hidden;

  /* 功能区 */
  .function-area {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 30rpx 10rpx;
    border-radius: 20rpx;
    background-color: #fff;
    width: 100%;
    box-sizing: border-box;

    .function-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 20%;
      margin-bottom: 30rpx;

      .function-icon {
        width: 80rpx;
        height: 80rpx;
        background: linear-gradient(121deg, #3B63FF 0%, rgba(43, 181, 255, 0.28) 98.57%);
        box-shadow: 0rpx 0rpx 8rpx 0rpx rgba(59, 99, 255, 0.5);
        border-radius: 20rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 10rpx;

        image {
          width: 50rpx;
          height: 50rpx;
        }
      }

      .function-name {
        font-size: 24rpx;
        color: #333;
        text-align: center;
      }
    }

    .notice-box {
      display: flex;
      align-items: center;
      padding: 5rpx 10rpx 5rpx 10rpx;
      border-radius: 10rpx;
      margin-top: 20rpx;

      .notice-title {
        font-size: 48rpx;
        font-weight: bold;
        color: #3B63FF;
        margin-right: 20rpx;
        font-family: 'YouSheBiaoTiHei' !important;

        .notice-title-bold {
          color: #000;
        }
      }

      .notice-scroll {
        flex: 1;
        height: 40rpx;
        overflow: hidden;
        position: relative;
        margin-left: 20rpx;

        /* 隐藏滚动条 */
        &::-webkit-scrollbar {
          display: none;
        }

        .notice-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 40rpx;
          transition: transform 0.5s ease;

          .notice-content {
            flex: 1;
            font-size: 28rpx;
            color: #333;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .notice-date {
            font-size: 28rpx;
            color: #999;
            white-space: nowrap;
            padding-right: 10rpx;
          }
        }
      }
    }
  }
}

/* Tab 标签切换 */
.tab-box {
  margin: 20rpx 0;

  /* Tab 标题 */
  .tab-header {
    display: flex;
    font-family: 'YouSheBiaoTiHei' !important;
    height: 60rpx;
    padding-left: 30rpx;
    width: 100%;
    box-sizing: border-box;
    overflow-x: hidden;

    .tab-item {
      font-size: 36rpx;
      color: #333;
      margin: 0 15rpx;
      padding: 10rpx 0;
      transition: all 0.3s ease;
      display: flex;
      align-items: flex-end;

      &.active {
        color: #3B63FF;
        font-size: 42rpx;
        font-weight: bold;
      }
    }
  }

  /* Tab 内容 */
  .tab-content {
    border-radius: 20rpx;
    padding: 20rpx;
    width: 100%;
    overflow-x: hidden;

    /* 隐藏滚动条 */
    &::-webkit-scrollbar {
      display: none;
    }

    .tab-pane {
      .news-item {
        display: flex;
        padding: 24rpx;
        background-color: #fff;
        margin-bottom: 20rpx;

        &:last-child {
          border-bottom: none;
        }

        .news-image {
          width: 240rpx;
          height: 180rpx;
          border-radius: 8rpx;
          overflow: hidden;
          margin-right: 15rpx;

          image {
            width: 100%;
            height: 100%;
          }
        }

        .news-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 10rpx;

          .news-title {
            font-size: 28rpx;
            color: #333;
            margin-bottom: 10rpx;
            line-height: 1.5;
            // 超出4行部分省略号
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;

          }

          .news-date {
            font-size: 22rpx;
            color: #999;
          }
        }
      }


    }

    .tab-pane2 {
      .news-item {

        padding: 24rpx;
        background-color: #fff;
        margin-bottom: 20rpx;

        &:last-child {
          border-bottom: none;
        }



     .news-title {
            font-size: 28rpx;
            color: #333;
            margin-bottom: 10rpx;
            line-height: 1.3;
            // 超出4行部分省略号
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;

          }

          .news-date {
            font-size: 22rpx;
            color: #999;
          }
      }


    }
.tab-pane3 {
      .news-item {
        display: flex;
        padding: 24rpx;
        background-color: #fff;
        margin-bottom: 20rpx;

        &:last-child {
          border-bottom: none;
        }

        .news-image {
          width: 240rpx;
          height: 180rpx;
          border-radius: 8rpx;
          overflow: hidden;
          margin-right: 15rpx;

          image {
            width: 100%;
            height: 100%;
          }
        }

        .news-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 10rpx;

          .news-title {
            font-size: 28rpx;
            color: #333;
            margin-bottom: 10rpx;
            line-height: 1;
            // 超出4行部分省略号
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;

          }

          .news-content {
            font-size: 28rpx;
            color: #999;
            line-height: 1.5;
            // 首行缩进
            text-indent: 1em;
             // 超出4行部分省略号
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
          }
        }
      }


    }
  }
}

.empty-message {
  width: 100%;
  padding: 36rpx 0;
  text-align: center;
  font-size: 26rpx;
  color: #999;
}

.retry-message {
  color: #3b63ff;
}
</style>
