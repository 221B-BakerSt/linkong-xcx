<template>
    <view class="container">
        <view class="search-wrap">
            <u-search
                placeholder="搜索关键词"
                :show-action="false"
                bg-color="#ffffff"
                placeholder-color="#666666"
                shape="square"
                :input-style="{ fontSize: '14px', color: '#000000' }"
                icon-color="#666666"
            ></u-search>
        </view>

        <view class="tags-wrap">
            <view class="tag-dropdown">
                <view class="dropdown-container" @click="toggleStatusMenu">
                    <text class="dropdown-value">{{ selectedStatus }}</text>
                    <text class="dropdown-arrow">▼</text>
                    <view class="dropdown-menu" v-if="showStatusMenu">
                        <view
                            class="dropdown-item"
                            v-for="status in statusOptions"
                            :key="status"
                            @click.stop="selectStatus(status)"
                        >{{ status }}</view
                        >
                    </view>
                </view>
            </view>

            <view class="tag-dropdown">
                <view class="dropdown-container" @click="toggleLevelMenu">
                    <text class="dropdown-value">{{ selectedLevel }}</text>
                    <text class="dropdown-arrow">▼</text>
                    <view class="dropdown-menu" v-if="showLevelMenu">
                        <view
                            class="dropdown-item"
                            v-for="level in levelOptions"
                            :key="level"
                            @click.stop="selectLevel(level)"
                        >{{ level }}</view
                        >
                    </view>
                </view>
            </view>

            <view class="tag-dropdown">
                <view class="dropdown-container" @click="toggleCategoryMenu">
                    <text class="dropdown-value">{{ selectedCategory }}</text>
                    <text class="dropdown-arrow">▼</text>
                    <view class="dropdown-menu" v-if="showCategoryMenu">
                        <view
                            class="dropdown-item"
                            v-for="category in categoryOptions"
                            :key="category"
                            @click.stop="selectCategory(category)"
                        >{{ category }}</view
                        >
                    </view>
                </view>
            </view>
        </view>

        <view class="list-container">
            <view class="policy-list">
                <view
                    v-if="listState === 'error'"
                    class="list-message retry-message"
                    @click="fetchList"
                >加载失败，点击重试</view>
                <view
                    v-else-if="listState === 'ready' && policyList.length === 0"
                    class="list-message"
                >{{ parkName }}暂无可申报政策</view>
                <view
                    v-else
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
                            >发布时间：{{ item.createTime }}</text
                            >
                            <text class="policy-time-item"
                            >截止时间：{{ item.releaseTime }}</text
                            >
                        </view>
                    </view>
                    <view class="policy-arrow">→</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import { getPolicySupermarketList } from '@/api/operations/policySupermarket';
import { getCurrentPark, getCurrentParkId } from '@/utils/parkContext';

export default {
    data() {
        return {
            policyList: [],
            listState: 'loading',
            parkName: '当前园区',
            // 申报状态选项
            statusOptions: ["已申报", "申报中", "已结束"],
            selectedStatus: "申报中",
            showStatusMenu: false,
            // 级别选项
            levelOptions: ["国家级", "省级", "市级", "县级"],
            selectedLevel: "国家级",
            showLevelMenu: false,
            // 类别选项
            categoryOptions: ["科技政策", "测试 1", "测试 2"],
            selectedCategory: "科技政策",
            showCategoryMenu: false,
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
    onShow() {
        this.fetchList();
    },
    methods: {
        async fetchList() {
            const park = getCurrentPark();
            const expectedParkId = getCurrentParkId();
            this.parkName = park?.parkName || '当前园区';
            this.listState = 'loading';
            try {
                const res = await getPolicySupermarketList({
                   
                    policyType: 'policy',
                    orderByColumn: 'createTime',
                    isAsc: 'desc',
                });
                if (expectedParkId !== getCurrentParkId()) return;
                this.policyList = Array.isArray(res?.rows)
                    ? res.rows
                    : Array.isArray(res?.data)
                      ? res.data
                      : [];
                this.listState = 'ready';
            } catch (e) {
                if (expectedParkId !== getCurrentParkId()) return;
                this.policyList = [];
                this.listState = 'error';
            }
        },
        handleCardClick(item) {
            uni.navigateTo({
                url: '/pages_services/policy/supermarketDetails?id=' + item.id,
            });
        },
        // 切换申报状态菜单
        toggleStatusMenu() {
            this.showStatusMenu = !this.showStatusMenu;
            this.showLevelMenu = false;
            this.showCategoryMenu = false;
        },
        // 切换级别菜单
        toggleLevelMenu() {
            this.showLevelMenu = !this.showLevelMenu;
            this.showStatusMenu = false;
            this.showCategoryMenu = false;
        },
        // 切换类别菜单
        toggleCategoryMenu() {
            this.showCategoryMenu = !this.showCategoryMenu;
            this.showStatusMenu = false;
            this.showLevelMenu = false;
        },
        // 选择申报状态
        selectStatus(status) {
            this.selectedStatus = status;
            this.showStatusMenu = false;
        },
        // 选择级别
        selectLevel(level) {
            this.selectedLevel = level;
            this.showLevelMenu = false;
        },
        // 选择类别
        selectCategory(category) {
            this.selectedCategory = category;
            this.showCategoryMenu = false;
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

.search-wrap {
  width: 82%;
  height: 50px;
  background: #ffffff;
  margin: 16px auto;
  padding: 0 16px;
  display: flex;
  align-items: center;
  opacity: 1;
}

::v-deep .u-search {
  height: 40px !important;
  border-radius: 0 !important;
  border: none !important;
  background-color: #ffffff !important;
  width: 100% !important;
}

::v-deep .u-search__content {
  background-color: #ffffff !important;
  height: 100% !important;
  display: flex;
  align-items: center;
  border-radius: 0 !important;
}

::v-deep .u-search__content__input {
  color: #000000 !important;
  line-height: 40px !important;
  font-size: 14px !important;
}

.tags-wrap {
  width: 82%;
  height: 50px;
  background: #ffffff;
  margin: 16px auto;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tag-dropdown {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: center;
  position: relative;
}

.tag-dropdown:not(:last-child)::after {
  content: "";
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 0px;
  height: 14px;
  border: 1px solid #e6eaf3;
}

.tag-label {
  font-size: 12px;
  color: #666666;
  white-space: nowrap;
}

.dropdown-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 12px;
  font-size: 12px;
  color: #333333;
  cursor: pointer;
}

.dropdown-value {
  white-space: nowrap;
  display: flex;
  align-items: center;
}

.dropdown-arrow {
  font-size: 10px;
  color: #999999;
  display: flex;
  align-items: center;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
  max-height: 150px;
  overflow-y: auto;
}

.dropdown-item {
  padding: 10px 12px;
  font-size: 12px;
  color: #333333;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.dropdown-item:active {
  background-color: #e8e8e8;
}

.list-container {
  padding: 0 16px 16px;
}

.policy-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.list-message {
  margin: 56px 16px;
  color: #7a8795;
  font-size: 14px;
  text-align: center;
}

.retry-message {
  color: #2f7ee6;
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
