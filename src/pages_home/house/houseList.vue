<template>
    <view class="page-container">
       

        <!-- 筛选条件 -->
        <view class="filter-container">
            <view class="filter-item">
                <text :class="['filter-label', { 'selected': selectedBuilding }]" @click="showBuildingPicker = true">{{ selectedBuilding || '全部楼栋' }}</text>
                <up-icon v-if="selectedBuilding" name="close-circle" size="16" color="#999" @click.stop="clearBuilding" />
                <up-icon v-else name="arrow-down-fill" size="12" color="#999" @click="showBuildingPicker = true" />
            </view>
            <view class="filter-divider"></view>
            <view class="filter-item">
                <text :class="['filter-label', { 'selected': selectedFloor }]" @click="selectFloor">{{ selectedFloor || '全部楼层' }}</text>
                <up-icon v-if="selectedFloor" name="close-circle" size="16" color="#999" @click.stop="clearFloor" />
                <up-icon v-else name="arrow-down-fill" size="12" color="#999" @click="selectFloor" />
            </view>

        </view>

        <!-- 房源列表 -->
        <view class="house-list">
            <view class="house-item" v-for="(house, index) in houseList" :key="index" @click="navigateToDetails(house)">
                <view class="house-info">
                    <view class="house-header">
                        <text class="house-room">{{ house.roomName }}</text>
                        <!-- <text class="house-status">{{ house.status }}</text> -->
                    </view>
                    <view class="house-details">
                       
                        <view class="detail-item">
                            <text class="detail-label">楼栋：</text>
                            <text class="detail-value">{{ house.remarkBuilding }}</text>
                        </view>
                        <view class="detail-item">
                            <text class="detail-label">楼层：</text>
                            <text class="detail-value">{{ house.remarkFloor }}</text>
                        </view>
                    </view>
                </view>
                <view class="house-arrow">
                     <text class="area">{{ house.area }} m² </text>
                    <uni-icons type="right" size="20" color="#999" />
                </view>
            </view>
        </view>
        <!-- 楼栋选择器 -->
        <up-picker :show="showBuildingPicker" :columns="buildings" @change="buildingChange" @confirm="confirmBuilding" @cancel="cancelBuilding" keyName="label" valueName="id"></up-picker>
        <!-- 楼层选择器 -->
       <up-picker :show="showFloorPicker" :columns="floors" @change="floorChange" @confirm="confirmFloor" @cancel="cancelFloor" keyName="label" valueName="id"></up-picker>
    </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getAvailableRoomList } from '@/api/park/park'
// 状态管理
const showBuildingPicker = ref(false)
const showFloorPicker = ref(false)

const selectedBuilding = ref('')
const selectedFloor = ref('')

// 从API数据中提取的楼栋和楼层信息
const buildings = ref([[]])
const buildingFloors = ref({})

// 当前可选的楼层
const floors = ref([[]])

const houseList = ref([])

// 选择楼层方法
const selectFloor = () => {
    if (!selectedBuilding.value) {
        uni.showToast({
            title: '请先选择楼栋',
            icon: 'none'
        })
        return
    }
    showFloorPicker.value = true
}

// 楼栋选择器事件处理
const buildingChange = (e) => {
    // 这里可以处理实时变化
}

const confirmBuilding = (e) => {
    showBuildingPicker.value = false
    selectedBuilding.value = e.value[0].label
    // 重置楼层选择
    selectedFloor.value = ''
    // 更新楼层选项
    floors.value = buildingFloors.value[selectedBuilding.value] || [[]]
    // 重新获取数据
    getList()
}

const cancelBuilding = (e) => {
    showBuildingPicker.value = false
}

// 楼层选择器事件处理
const floorChange = (e) => {
    // 这里可以处理实时变化
}

const confirmFloor = (e) => {
    showFloorPicker.value = false
    selectedFloor.value = e.value[0].label
    // 重新获取数据
    getList()
}

const cancelFloor = (e) => {
    showFloorPicker.value = false
}

// 清除选择
const clearBuilding = () => {
    selectedBuilding.value = ''
    selectedFloor.value = ''
    // 重新获取数据
    getList()
}

const clearFloor = () => {
    selectedFloor.value = ''
    // 重新获取数据
    getList()
}

// 导航到详情页
const navigateToDetails = (house) => {
    uni.navigateTo({
        url: '/pages_home/house/details?id=' + house.id
    })
}
function getList(){
  const params = {
    buildStatus: 0
  }
  if (selectedBuilding.value) {
    params.remarkBuilding = selectedBuilding.value
  }
  if (selectedFloor.value) {
    params.remarkFloor = selectedFloor.value
  }
  getAvailableRoomList(params).then(res => {
        if (res.code === 200) {
            houseList.value = res.rows
            // 提取楼栋和楼层信息
            extractBuildingFloorInfo(res.rows)
        }
    })
}

// 从数据中提取楼栋和楼层信息
function extractBuildingFloorInfo(data) {
    const buildingSet = new Set()
    const floorMap = {}
    
    data.forEach(item => {
        if (item.remarkBuilding) {
            buildingSet.add(item.remarkBuilding)
            if (!floorMap[item.remarkBuilding]) {
                floorMap[item.remarkBuilding] = new Set()
            }
            if (item.remarkFloor) {
                floorMap[item.remarkBuilding].add(item.remarkFloor)
            }
        }
    })
    
    // 构建楼栋选项
    const buildingOptions = Array.from(buildingSet).map((building, index) => ({
        id: (index + 1).toString(),
        label: building
    }))
    buildings.value = [buildingOptions]
    
    // 构建每个楼栋对应的楼层选项
    Object.keys(floorMap).forEach(building => {
        const floorOptions = Array.from(floorMap[building]).map((floor, index) => ({
            id: (index + 1).toString(),
            label: floor
        }))
        buildingFloors.value[building] = [floorOptions]
    })
}
onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
.page-container {
    min-height: 100vh;
    background-color: #F5F7FA;
    padding-bottom: 120rpx;
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

.house-list {
    margin: 20rpx;

    .house-item {
        display: flex;
        align-items: center;
        background-color: #FFFFFF;
        border-radius: 12rpx;
        padding: 24rpx;
        margin-bottom: 16rpx;
        box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

        .house-info {
            flex: 1;

            .house-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16rpx;

                .house-room {
                    font-size: 30rpx;
                    font-weight: bold;
                    color: #333;
                    padding: 20rpx 0;
                }

                .house-status {
                    font-size: 24rpx;
                    color: #1E88E5;
                    background-color: #E3F2FD;
                    padding: 4rpx 16rpx;
                    border-radius: 16rpx;
                }
            }

            .house-details {
                display: flex;
              justify-content: space-between;
                    padding: 10rpx 0;
              align-items: center;
                .detail-item {
                    display: flex;
                    margin-bottom: 8rpx;

                    .detail-label {
                        font-size: 26rpx;
                        color: #666;
                        width: 80rpx;
                    }

                    .detail-value {
                        font-size: 26rpx;
                        color: #235EFF;
                    }
                }
            }
        }

        .house-arrow {
            display: flex;
            align-items: center;
          
            .area {
                  margin-right: 16rpx;
                font-size: 26rpx;
                color: #333;
            }
        }
    }
}
</style>