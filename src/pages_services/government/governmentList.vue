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
              <text class="policy-tag">级别：{{ getPolicyRankName(item.rank) }}</text>
              <text class="policy-tag">类别：{{ getPolicyDomainName(item.policyDomain) }}</text>
            </view>
            <view class="policy-time">
              <text class="policy-time-item"
                >发布时间：{{ item.createTime}}</text
              >
              <text class="policy-time-item"
                >截止时间：{{ item.releaseTime}}</text
              >
            </view>
          </view>
        
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {getPolicySupermarketList} from "@/api/operations/policySupermarket";

export default {
  data() {
    return {
        policyList: [],
    
      showStatusMenu: false,
      // 政策领域字典
      policyDomainDict: [
        { label: '科技政策', value: '1' },
        { label: '产业政策', value: '2' },
        { label: '人才政策', value: '3' },
        { label: '金融政策', value: '4' },
        { label: '税收政策', value: '5' }
      ],
      // 政策级别字典
      policyRankDict: [
        { label: '国家级', value: '1' },
        { label: '河南省级', value: '2' },
        { label: '郑州市级', value: '3' },
        { label: '航空港区', value: '4' }
      ],
    };
  },
    mounted() {
        this.fetchList();
    },
  methods: {
      async fetchList() {
          try {
              const res = await getPolicySupermarketList({
                  policyType: 'governmentAffairs',
              }, { showLoading: false });
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
        url: "/pages_services/government/governmentDetails?id=" + item.id,
      });
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

<style scoped>
.container {
  background: linear-gradient(180deg, #f3f8fe 0%, #fafafa 100%);
  border-radius: 0px;
  min-height: 100vh;
}
.search {
    width: 100%;
    padding: 0 30rpx 30rpx 30rpx;
    background-color: #ffffff;
    box-sizing: border-box;
  }




.list-container {
  padding: 30rpx;
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
