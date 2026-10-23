<template>
  <view class="container">
 <!-- 搜索框 -->
    <view class="search">
      <up-search
        placeholder="请输入搜索关键词"
        v-model="searchText"
        @custom="searchBtn"
      ></up-search>
    </view>

    <!-- 筛选条件 -->
    <view class="filter-container">
      <view class="filter-item">
        <text :class="['filter-label', { 'selected': selectedStatus }]" @click="showStatusPicker = true">{{ selectedStatus || '全部状态' }}</text>
        <up-icon v-if="selectedStatus" name="close-circle" size="16" color="#999" @click.stop="clearStatus" />
        <up-icon v-else name="arrow-down-fill" size="12" color="#999" @click="showStatusPicker = true" />
      </view>
      <view class="filter-divider"></view>
      <view class="filter-item">
        <text :class="['filter-label', { 'selected': selectedLevel }]" @click="showLevelPicker = true">{{ selectedLevel || '全部级别' }}</text>
        <up-icon v-if="selectedLevel" name="close-circle" size="16" color="#999" @click.stop="clearLevel" />
        <up-icon v-else name="arrow-down-fill" size="12" color="#999" @click="showLevelPicker = true" />
      </view>
      <view class="filter-divider"></view>
      <view class="filter-item">
        <text :class="['filter-label', { 'selected': selectedCategory }]" @click="showCategoryPicker = true">{{ selectedCategory || '全部类别' }}</text>
        <up-icon v-if="selectedCategory" name="close-circle" size="16" color="#999" @click.stop="clearCategory" />
        <up-icon v-else name="arrow-down-fill" size="12" color="#999" @click="showCategoryPicker = true" />
      </view>
    </view>

    <view class="list-container">
      <view class="policy-list">
        <view
          class="policy-card"
          v-for="(item, index) in policyList"
          :key="index"
          @click="handleCardClick(item)"
        >
          <view class="policy-item">
            <text class="policy-title">{{ item.title }}</text>
            <view class="policy-info">
              <text class="policy-tag">级别：{{ item.rank === '1' ? '国家级' : item.rank === '2' ? '河南省级' : item.rank === '3' ? '郑州市级' : item.rank === '4' ? '航空港区' : '' }}</text>
              <text class="policy-tag">类别：{{ item.policyDomain === '1' ? '科技政策' : item.policyDomain === '2' ? '产业政策' : item.policyDomain === '3' ? '人才政策' : item.policyDomain === '4' ? '金融政策' : item.policyDomain === '5' ? '税收政策' : '' }}</text>
            </view>
            <view class="policy-time">
              <text class="policy-time-item"
                >发布时间：{{ formatDate(item.createTime) }}</text>
              
              <text class="policy-time-item"
                >截止时间：{{ formatDate(item.releaseTime) }}</text>
              
            </view>
          </view>
          
        </view>
      </view>
    </view>
    
    <!-- 状态选择器 -->
    <up-picker :show="showStatusPicker" :columns="statusOptions" @change="statusChange" @confirm="confirmStatus" @cancel="cancelStatus" keyName="label" valueName="value"></up-picker>
    <!-- 级别选择器 -->
    <up-picker :show="showLevelPicker" :columns="policyRankDict" @change="levelChange" @confirm="confirmLevel" @cancel="cancelLevel" keyName="label" valueName="value"></up-picker>
    <!-- 类别选择器 -->
    <up-picker :show="showCategoryPicker" :columns="policyDomainDict" @change="categoryChange" @confirm="confirmCategory" @cancel="cancelCategory" keyName="label" valueName="value"></up-picker>
  </view>
</template>

<script>
import { getPolicySupermarketList } from '@/api/operations/policySupermarket';

export default {
  data() {
    return {
      policyList: [],
      // 申报状态选项
      statusOptions: [[   { label: '全部', value: '' },
        { label: '申报中', value: '0' },
        { label: '已结束', value: '1' }]
      ],
      selectedStatus: '',
      showStatusPicker: false,
      // 级别选项
      selectedLevel: '',
      showLevelPicker: false,
      // 类别选项
      selectedCategory: '',
      showCategoryPicker: false,
      // 政策领域字典
      policyDomainDict: [[  { label: '全部', value: '' },
        { label: '科技政策', value: '1' },
        { label: '产业政策', value: '2' },
        { label: '人才政策', value: '3' },
        { label: '金融政策', value: '4' },
        { label: '税收政策', value: '5' }]
      
      ],
      // 政策级别字典
      policyRankDict: [
        [ { label: '全部', value: '' },
        { label: '国家级', value: '1' },
        { label: '河南省级', value: '2' },
        { label: '郑州市级', value: '3' },
        { label: '航空港区', value: '4' }]
      
      ],
      searchText: '',
      // 申报状态0申报中1已结束
      declareState: '',
      policyDomain: '',
      // 政策级别
      rank: '',
    };
  },
  mounted() {
    this.fetchList();
  },
  methods: {
    async fetchList() {
      try {
        const res = await getPolicySupermarketList({
          title: this.searchText,
          policyType: 'policy',
          declareState: this.declareState,
          policyDomain: this.policyDomain,
          rank: this.rank,
          isDeclare: '1',
          orderByColumn: 'createTime',
          isAsc: 'desc',
          pageNum: 1,
          pageSize: 20,
        });
        if (res && res.rows) {
          this.policyList = res.rows;
        } else if (res && res.data) {
          this.policyList = res.data;
        }
      } catch (e) {
        uni.showToast({ title: '获取列表失败', icon: 'none' });
      }
    },
    handleCardClick(item) {
      uni.navigateTo({
        url: '/pages_services/policy/declareDetails?id=' + item.id,
      });
    },
    formatDate(value) {
      return value ? String(value).slice(0, 10) : '暂无';
    },
    // 搜索
    searchBtn() {
      this.fetchList();
    },
    // 状态选择器事件处理
    statusChange(e) {
      // 这里可以处理实时变化
    },
    confirmStatus(e) {
      this.showStatusPicker = false;
      this.selectedStatus = e.value[0].label;
      this.declareState = e.value[0].value;
      // 重新获取数据
      this.fetchList();
    },
    cancelStatus(e) {
      this.showStatusPicker = false;
    },
    // 级别选择器事件处理
    levelChange(e) {
      // 这里可以处理实时变化
    },
    confirmLevel(e) {
      this.showLevelPicker = false;
      this.selectedLevel = e.value[0].label;
      this.rank = e.value[0].value;
      // 重新获取数据
      this.fetchList();
    },
    cancelLevel(e) {
      this.showLevelPicker = false;
    },
    // 类别选择器事件处理
    categoryChange(e) {
      // 这里可以处理实时变化
    },
    confirmCategory(e) {
      this.showCategoryPicker = false;
      this.selectedCategory = e.value[0].label;
      this.policyDomain = e.value[0].value;
      // 重新获取数据
      this.fetchList();
    },
    cancelCategory(e) {
      this.showCategoryPicker = false;
    },
    // 清除选择
    clearStatus() {
      this.selectedStatus = '';
      this.declareState = '';
      // 重新获取数据
      this.fetchList();
    },
    clearLevel() {
      this.selectedLevel = '';
      this.rank = '';
      // 重新获取数据
      this.fetchList();
    },
    clearCategory() {
      this.selectedCategory = '';
      this.policyDomain = '';
      // 重新获取数据
      this.fetchList();
    },
    // 根据字典值获取政策领域名称
    getPolicyDomainName(value) {
      if (!value) return '';
      const dictItem = this.policyDomainDict.find(item => item.value === String(value));
      return dictItem ? dictItem.label : value;
    },
    // 根据字典值获取政策级别名称
    getPolicyRankName(value) {
      if (!value) return '';
      const dictItem = this.policyRankDict.find(item => item.value === String(value));
      return dictItem ? dictItem.label : value;
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  background: linear-gradient(180deg, #f3f8fe 0%, #fafafa 100%);
  border-radius: 0px;
  min-height: 100vh;
  padding-bottom: 120rpx;
}

.search {
    width: 100%;
    padding: 0 30rpx 30rpx 30rpx;
    background-color: #ffffff;
    box-sizing: border-box;
  }

.filter-container {
    display: flex;
    background-color: #FFFFFF;
    margin:  20rpx;
    border-radius: 12rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

    .filter-item {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24rpx 0;

        .filter-label {
            font-size: 28rpx;
            color: #333;
            margin-right: 20rpx;
        }
        .filter-label.selected {
            color: #235EFF;
            margin-left: 20rpx;
        }
    }

    .filter-divider {
        width: 2rpx;
        height: 40rpx;
        background-color: #E5E5E5;
        align-self: center;
    }
}

.list-container {
  padding: 0 16px 16px;
}

.policy-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.policy-card {
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: flex-start;
}

.policy-item {
  padding: 16px;
  flex: 1;
}

.policy-title {
  font-size: 14px;
  color: #333333;
  line-height: 1.4;
  margin-bottom: 8px;
  display: block;
}

.policy-info {
  display: flex;
  margin-bottom: 6px;
  gap: 24px;
}

.policy-tag {
  font-size: 12px;
  color: #666666;
  white-space: nowrap;
}

.policy-time {
  display: flex;
  gap: 24px;
}

.policy-time-item {
  font-size: 12px;
  color: #999999;
  white-space: nowrap;
}

.policy-arrow {
  font-size: 16px;
  color: #cccccc;
  padding: 16px 12px;
  display: flex;
  align-items: flex-start;
}
</style>
