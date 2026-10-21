<template>
  <view class="notice-details-container">
    <!-- 标题 -->
    <view class="notice-title">
      关于做好宜兴市2026年农业产业化项目储备申报工作的通知
    </view>
    
    <!-- 时间 -->
    <view class="notice-time">
      2023.12.12 12:00
    </view>
    
    <!-- 内容 -->
    <view class="notice-content">
      <view class="section">
        <view class="section-title">(一)平台简介</view>
        <view class="section-text">
          作为药物创新研发的前端和基础支撑，新药筛选检测平台建有理化实验室、精密仪器室、分子生物学实验室、微生物实验室、细胞房等多个专业实验室，拥有核磁共振波谱仪、X射线单晶/多晶衍射仪、LC-MS/MS、GC/GC-MS、活细胞成像系统、蛋白纯化仪、流式细胞仪、多功能酶标仪、荧光定量PCR仪等300余套前沿检验检测和筛选分析设备，可提供小分子药物理化分析及稳定性研究、小分子药物高通量筛选、抗体/酶功能表征等服务，能够满足创新药从药物发现到产业化开发等各阶段的筛选、分析和质控需求，将破解本地创新药企业就近检测难、跨省检验时间长等难题，为服务产业发展、优化产业生态注入新动能。
        </view>
      </view>
    </view>
    
    <!-- 底部黑色区域 -->
    <view class="bottom-black-area">
    </view>
  </view>
</template>

<script setup>
// 页面逻辑
</script>

<style lang="scss" scoped>
/* 重置默认样式 */
page {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background: #FFFFFF;
  border-radius: 0px 0px 0px 0px;
}

.notice-details-container {
  width: 100%;
  min-height: 100vh;
  background: #FFFFFF;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.notice-title {
  width: 307px;
  height: 48px;
  font-family: Source Han Sans, Source Han Sans;
  font-weight: 400;
  font-size: 18px;
  color: rgba(0, 0, 0, 0.898);
  line-height: 24px;
  text-align: center;
  font-style: normal;
  text-transform: none;
  margin: 0 auto 16px;
}

.notice-time {
  width: 78px;
  height: 10px;
  font-family: Source Han Sans, Source Han Sans;
  font-weight: 400;
  font-size: 10px;
  color: rgba(0, 0, 0, 0.451);
  line-height: 10px;
  text-align: left;
  font-style: normal;
  text-transform: none;
  margin-bottom: 24px;
}

.notice-content {
  flex: 1;
  width: 307px;
  margin: 0 auto;
}

.section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.898);
  margin-bottom: 12px;
}

.section-text {
  width: 307px;
  font-family: Source Han Sans, Source Han Sans;
  font-weight: 400;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.898);
  line-height: 24px;
  text-align: left;
  font-style: normal;
  text-transform: none;
}

.bottom-black-area {
  width: 307px;
  height: 230px;
  background: rgba(0, 0, 0, 0.898);
  border-radius: 0px 0px 0px 0px;
  margin: 32px auto 0;
}
</style>