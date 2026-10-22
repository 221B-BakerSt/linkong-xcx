<template>
  <view class="boiler-container">
    <!-- 背景图片 -->
    <image
      src="/pages_park/static/boiler.png"
      mode="aspectFill"
      class="background-image"
    ></image>

    <!-- 内容容器 -->
    <view class="content-wrapper">
      <!-- 标题 -->
      <view class="title">园区锅炉</view>

      <!-- 内容 -->
      <view class="content">
        <text>{{ record ? '数据由园区后台维护，以下为当前园区最新锅炉运行记录。' : `${parkName}暂无锅炉运行记录。` }}</text>
      </view>

      <!-- 数据卡片 -->
      <view class="data-card">
        <image
          src="/pages_park/static/boiler_sewage_2.png"
          mode="aspectFill"
          class="data-card-background"
        ></image>
        <view class="data-card-content">
          <view class="data-title">当前锅炉数据</view>
          <view class="data-grid">
            <view class="data-item">
              <image
                src="/pages_park/static/boiler_sewage.png"
                mode="aspectFill"
                class="data-item-background"
              ></image>
              <view class="data-item-content">
                <view class="data-item-title">NOx折算</view>
                <view class="data-item-value">{{ valueOf(record?.noxOpValue) }}</view>
              </view>
            </view>
            <view class="data-item">
              <image
                src="/pages_park/static/boiler_sewage.png"
                mode="aspectFill"
                class="data-item-background"
              ></image>
              <view class="data-item-content">
                <view class="data-item-title">烟气压力</view>
                <view class="data-item-value">{{ valueOf(record?.smokePressure) }}</view>
              </view>
            </view>
            <view class="data-item">
              <image
                src="/pages_park/static/boiler_sewage.png"
                mode="aspectFill"
                class="data-item-background"
              ></image>
              <view class="data-item-content">
                <view class="data-item-title">烟气流速</view>
                <view class="data-item-value">{{ valueOf(record?.smokeSpeed) }}</view>
              </view>
            </view>
            <view class="data-item">
              <image
                src="/pages_park/static/boiler_sewage.png"
                mode="aspectFill"
                class="data-item-background"
              ></image>
              <view class="data-item-content">
                <view class="data-item-title">烟气湿度</view>
                <view class="data-item-value">{{ valueOf(record?.smokeHumidity) }}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getBoilerOperationRecords } from '@/api/operations/assetRecords'
import { getCurrentPark, getCurrentParkId } from '@/utils/parkContext'

const record = ref(null)
const parkName = ref(getCurrentPark()?.parkName || '当前园区')

const valueOf = (value) => value === null || value === undefined || value === '' ? '0' : String(value)

async function loadLatestRecord() {
  const expectedParkId = getCurrentParkId()
  parkName.value = getCurrentPark()?.parkName || '当前园区'
  try {
    const res = await getBoilerOperationRecords({ pageNum: 1, pageSize: 1, orderByColumn: 'dataDate', isAsc: 'desc' })
    if (getCurrentParkId() !== expectedParkId) return
    record.value = Array.isArray(res?.rows) && res.rows.length > 0 ? res.rows[0] : null
  } catch (error) {
    if (getCurrentParkId() === expectedParkId) record.value = null
    console.error('获取锅炉运行记录失败:', error)
  }
}

onShow(loadLatestRecord)
</script>

<style lang="scss" scoped>
/* 重置默认样式 */
page {
  margin: 0;
  padding: 0;
  background: transparent;
}

.boiler-container {
  width: 109%;
  height: 100%;
  position: relative;
  overflow: hidden;
  margin: 0;
  padding: 0;
  background: transparent;
}

.background-image {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
  margin: 0;
  padding: 0;
  transform: scale(1.05);
}

.content-wrapper {
  position: relative;
  z-index: 1;
  padding: 60px 16px 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 812px;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.2),
    rgba(0, 0, 0, 0.3)
  );
  align-items: center;
  text-align: center;
  width: 100%;
}

.title {
  width: 96px;
  height: 36px;
  font-family:
    Source Han Sans,
    Source Han Sans;
  font-weight: 700;
  font-size: 24px;
  color: #ffffff;
  line-height: 36px;
  text-align: center;
  font-style: normal;
  text-transform: none;
  text-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
    margin-right: 10%;
}

.content {
  max-width: 327px;
  width: 90%;
  font-family:
    Source Han Sans,
    Source Han Sans;
  font-weight: 400;
  font-size: 18px;
  color: #ffffff;
  line-height: 27px;
  text-shadow: 0px 0px 20px #000000;
  text-align: left;
  font-style: normal;
  text-transform: none;
  margin-right: 10%;
}

.data-card {
  position: relative;
  border-radius: 10px;
  margin-top: 40px;
  max-width: 85%;
  width: 100%;
  overflow: hidden;
  align-self: center;
    margin-right: 10%;
}

.data-card-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.data-card-content {
  position: relative;
  z-index: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.data-title {
  width: 120px;
  height: 30px;
  font-family:
    Source Han Sans,
    Source Han Sans;
  font-weight: 400;
  font-size: 20px;
  color: #ffffff;
  line-height: 20px;
  text-align: left;
  font-style: normal;
  text-transform: none;
  margin-bottom: 40px;
  align-self: flex-start;
}

.data-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.data-item {
  position: relative;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  overflow: hidden;
  background: transparent;
}

.data-item-background {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 75%;
  height: 75%;
  z-index: 0;
  border-radius: 6px;
  transform: translate(-50%, -50%);
  border: 0.5px solid #33efff;
  box-shadow: 0 0 8px rgba(51, 239, 255, 0.5);
}

.data-item-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
  height: 100%;
  justify-content: center;
  background: transparent;
}

.data-item-title {
  width: 80px;
  height: 24px;
  font-family:
    Source Han Sans,
    Source Han Sans;
  font-weight: 400;
  font-size: 14px;
  color: #33efff;
  line-height: 24px;
  text-align: center;
  font-style: normal;
  text-transform: none;
  text-shadow: 0 0 5px #33efff;
}

.data-item-value {
  width: 40px;
  height: 36px;
  font-family:
    Source Han Sans,
    Source Han Sans;
  font-weight: 500;
  font-size: 24px;
  color: #33e5ff;
  line-height: 36px;
  text-align: center;
  font-style: normal;
  text-transform: none;
  text-shadow: 0 0 8px #33e5ff;
}
</style>
