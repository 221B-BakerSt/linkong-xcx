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
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getPolicySupermarketList } from '@/api/operations/policySupermarket';

const policyList = ref([]);
const searchText = ref('');
const fetchList = async () => {
  try {
    const res = await getPolicySupermarketList({ policyType: "technology",title:searchText.value,  
        orderByColumn: 'createTime',
        isAsc: 'desc',
        pageNum: 1,
        pageSize: 20,
     }, { showLoading: false });
    if (res && res.rows) {
      policyList.value = res.rows;
    }
  } catch (e) {
    uni.showToast({ title: '获取列表失败', icon: 'none' });
  }
};
const searchBtn = () => {
  fetchList();
};

onMounted(() => {
  fetchList();
});

const handleCardClick = (item) => {
  uni.navigateTo({
    url: `/pages_services/technical/technicalDetails?id=${item.id}`,
  });
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
  padding:30rpx;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 16px;
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
}

.policy-item {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.policy-title {
  font-size: 14px;
  color: #333333;
  line-height: 1.4;
  flex: 1;
  margin-right: 16px;
}

.policy-detail {
  font-size: 14px;
  color: #3b63ff;
  font-weight: 500;
}
</style>
