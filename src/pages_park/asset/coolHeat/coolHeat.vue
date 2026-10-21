<template>
  <view class="cool-heat-container">
    <view v-if="loading" class="empty-tip">加载中...</view>
    <view v-else-if="demandList.length === 0" class="empty-tip">暂无需求</view>

    <view v-for="(item, index) in demandList" :key="item.heatColdId || index">
      <view class="demand-card">
        <text class="detail-text" @click="handleDetailClick(item)">详情 ></text>
        <view class="card-content">
          <view class="card-header">
            <text class="content-title">{{ typeMap[item.type] || item.type }}</text>
          </view>
          <view class="company-name">{{ item.companyName || '' }}</view>
          <view class="card-footer">
            <text class="date-text">{{ item.startDate }}</text>
            <text class="status-text">{{ statusMap[item.status] || '' }}</text>
          </view>
        </view>
      </view>
    </view>

    <view v-if="noMore" class="empty-tip">没有更多数据了</view>

    <view class="bottom-button" @click="handleAddClick">
      <text class="button-text">+ 新增需求</text>
    </view>
  </view>
</template>

<script>
import { ref, onMounted } from "vue";
import { getHeatColdList } from "@/api/operations/heatCold";

export default {
  setup() {
    const demandList = ref([]);
    const loading = ref(false);
    const noMore = ref(false);
    const pageNum = ref(1);
    const pageSize = ref(10);

    const statusMap = {
      0: "待审核",
      1: "已通过",
      2: "已拒绝",
    };

    const typeMap = {
      0: "供暖",
      1: "制冷",
    };

    const fetchList = async () => {
      if (loading.value || noMore.value) return;
      loading.value = true;
      try {
        const res = await getHeatColdList({
          pageNum: pageNum.value,
          pageSize: pageSize.value
        });
        const list = res?.rows || [];
        if (list.length < pageSize.value) {
          noMore.value = true;
        }
        if (pageNum.value === 1) {
          demandList.value = list;
        } else {
          demandList.value = [...demandList.value, ...list];
        }
      } catch (e) {
        uni.showToast({ title: "获取列表失败", icon: "none" });
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchList();
    });

    const handleDetailClick = (item) => {
      uni.navigateTo({
        url: `/pages_park/asset/coolHeat/coolHeatDetail?heatColdId=${item.heatColdId}`
      });
    };

    const handleAddClick = () => {
      uni.navigateTo({
        url: "/pages_park/asset/coolHeat/coolHeatAdd"
      });
    };

    return {
      demandList,
      loading,
      noMore,
      pageNum,
      pageSize,
      statusMap,
      typeMap,
      fetchList,
      handleDetailClick,
      handleAddClick
    };
  },

  onReachBottom() {
    if (this.noMore) return;
    this.pageNum++;
    this.fetchList();
  }
};
</script>

<style lang="scss" scoped>
.cool-heat-container {
  width: 100%;
  min-height: 812px;
  background: #F5FBFF;
  border-radius: 0px 0px 0px 0px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 80px;
}

.demand-card {
  width: 83%;
  background: #FFFFFF;
  border-radius: 10px 10px 10px 10px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: relative;
}

.card-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-text {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
}

.content-title {
  width: 28px;
  height: 12px;
  font-family: Source Han Sans, Source Han Sans;
  font-weight: 500;
  font-size: 14px;
  color: #333333;
  line-height: 12px;
  text-align: left;
  font-style: normal;
  text-transform: none;
}

.company-name {
  font-family: Source Han Sans, Source Han Sans;
  font-weight: 400;
  font-size: 12px;
  color: rgba(0,0,0,0.6);
  line-height: 12px;
  text-align: left;
  font-style: normal;
  text-transform: none;
  margin-top: 30rpx;
  margin-bottom: 8px;
}

.detail-text {
  width: 40px;
  height: 12px;
  font-family: Source Han Sans, Source Han Sans;
  font-weight: 400;
  font-size: 12px;
  color: rgba(0,0,0,0.6);
  line-height: 12px;
  text-align: right;
  font-style: normal;
  text-transform: none;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.date-text {
  width: 260px;
  height: 12px;
  font-family: Source Han Sans, Source Han Sans;
  font-weight: 400;
  font-size: 12px;
  color: rgba(0,0,0,0.6);
  line-height: 12px;
  text-align: left;
  font-style: normal;
  text-transform: none;
}

.status-text {
  font-family: Source Han Sans, Source Han Sans;
  font-weight: 400;
  font-size: 12px;
  color: rgba(0,0,0,0.6);
  line-height: 12px;
  text-align: right;
  font-style: normal;
  text-transform: none;
}

.bottom-button {
  position: fixed;
  bottom: 24px;
  left: 20px;
  right: 20px;
  width: 335px;
  height: 44px;
  background: #235EFF;
  border-radius: 22px 22px 22px 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(35, 94, 255, 0.3);
}

.button-text {
  font-family: Source Han Sans, Source Han Sans;
  font-weight: 400;
  font-size: 14px;
  color: #FFFFFF;
  line-height: 14px;
  text-align: center;
  font-style: normal;
  text-transform: none;
}

.empty-tip {
  text-align: center;
  color: rgba(0, 0, 0, 0.4);
  font-size: 14px;
  padding: 20px 0;
}
</style>