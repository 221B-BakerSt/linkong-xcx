<template>
	<view>
		<!-- 头像 -->
		<view class="u-flex u-flex-y-center u-flex-around user-box u-p-l-30 u-p-r-20 u-p-b-30" @click="navigateTo('/pages_mine/pages/info/index')">
			<view class="u-m-r-10">
				<u-avatar :src="avatar" size="100"></u-avatar>
			</view>
			<view class="u-flex-1">
				<view class="u-font-18 u-p-b-20">{{ name }}</view>
				<!-- <view class="u-font-14 u-tips-color">{{ company }}</view> -->
			</view>
			<view class="u-m-l-10 u-p-10">
				<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
			</view>
		</view>

		<!-- 菜单列表 -->
		<view class="u-m-t-20 list">
			<u-cell-group>
			<u-cell title="当前园区" :value="currentParkName()" isLink @click="openParkSwitch">
				<template #icon>
					<u-icon name="map" color="#3B63FF" size="24"></u-icon>
				</template>
			</u-cell>
				<u-cell title="企业诉求" isLink @click="navigateTo('/pages_home/enterprise/index')">
				<template #icon>
					<image src="../../static/images/icon/mine/1.png" style="width: 24px; height: 24px;"></image>
				</template>
			</u-cell>
			<u-cell title="房源预约记录" isLink @click="navigateTo('/pages_home/house/appointmentList')">
				<template #icon>
					<image src="../../static/images/icon/mine/2.png" style="width: 24px; height: 24px;"></image>
				</template>
			</u-cell>
			<u-cell title="公寓预约记录" isLink @click="navigateTo('/pages_home/apartment/appointmentList')">
				<template #icon>
					<image src="../../static/images/icon/mine/3.png" style="width: 24px; height: 24px;"></image>
				</template>
			</u-cell>
			<u-cell title="会议室预约记录" isLink @click="navigateTo('/pages_home/meetingRoom/appointmentList')">
				<template #icon>
					<image src="../../static/images/icon/mine/4.png" style="width: 24px; height: 24px;"></image>
				</template>
			</u-cell>
			<u-cell title="班车预约" isLink @click="navigateTo('/pages_mine/pages/shuttle/index')">
				<template #icon>
					<image src="../../static/images/icon/mine/6.png" style="width: 24px; height: 24px;"></image>
				</template>
			</u-cell>
			
      <u-cell title="退出登录" isLink @click="logout">
				<template #icon>
					<image src="../../static/images/icon/mine/5.png" style="width: 24px; height: 24px;"></image>
				</template>
			</u-cell>
			</u-cell-group>
		</view>
		<u-popup :show="showParkSwitch" :round="10" mode="bottom" @close="showParkSwitch = false">
			<view class="park-switch-popup">
				<view class="park-switch-title">切换园区</view>
				<view
					v-for="park in parkOptions"
					:key="park.parkId"
					class="park-option"
					:class="{ active: String(park.parkId) === String(currentPark?.parkId) }"
					@click="selectPark(park)"
				>
					<text>{{ park.parkName }}</text>
					<u-icon
						v-if="String(park.parkId) === String(currentPark?.parkId)"
						name="checkmark"
						color="#3B63FF"
						size="22"
					/>
				</view>
			</view>
		</u-popup>
		<!-- 弹窗 -->
		<u-popup :show="showLogout" :round="10" mode="bottom" @close="close" @open="open">
			<view class="popup-content">
			
				<view class="u-font-14 u-text-center u-p-b-30">确定要退出登录吗？</view>
				<view class="u-flex">
					<u-button type="default" @click="showLogout = false" style="flex: 1; margin-right: 20rpx;">取消</u-button>
					<u-button type="primary" @click="confirmLogout" style="flex: 1; margin-left: 20rpx;">确定</u-button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script setup >
import { ref, onMounted } from 'vue'
import { getCurrentParkScope, switchBusinessTenant } from '@/api/system/park'
import { getCurrentPark, getCurrentTenantId, setCurrentPark } from '@/utils/parkContext'
import store from '@/store'
import config from '@/config.js'

// 响应式数据
const avatar = ref('https://uviewui.com/common/logo.png')
const name = ref('张xx')
const company = ref('河南云立方科技')
const version = ref(config.appInfo.version)
const showLogout = ref(false)
const showParkSwitch = ref(false)
const parkOptions = ref([])
const currentPark = ref(getCurrentPark())
const switchingPark = ref(false)

const currentParkName = () => currentPark.value?.parkName || '未选择园区'

async function loadParkScope() {
	try {
		const res = await getCurrentParkScope()
		const parks = Array.isArray(res?.data) ? res.data : []
		parkOptions.value = parks
		const storedPark = getCurrentPark()
		const matchedPark = parks.find((park) => storedPark && String(park.parkId) === String(storedPark.parkId))
			|| parks.find((park) => String(park.tenantId) === String(getCurrentTenantId()))
			|| parks[0]
		if (matchedPark) {
			currentPark.value = matchedPark
			setCurrentPark(matchedPark)
		}
	} catch (error) {
		console.error('获取园区权限范围失败:', error)
	}
}

function openParkSwitch() {
	if (parkOptions.value.length > 1) {
		showParkSwitch.value = true
	} else {
		uni.showToast({ title: '当前账号只有一个可访问园区', icon: 'none' })
	}
}

async function selectPark(park) {
	if (!park || switchingPark.value || String(park.parkId) === String(currentPark.value?.parkId)) {
		showParkSwitch.value = false
		return
	}
	switchingPark.value = true
	try {
		await switchBusinessTenant(park.tenantId)
		setCurrentPark(park)
		currentPark.value = park
		showParkSwitch.value = false
		uni.showToast({ title: `已切换至${park.parkName}`, icon: 'success' })
		setTimeout(() => uni.switchTab({ url: '/pages/index' }), 300)
	} catch (error) {
		console.error('切换园区失败:', error)
	} finally {
		switchingPark.value = false
	}
}

// 生命周期
onMounted(() => {
	loadParkScope()
	// 从 store 获取用户信息
	if (store.state.user.name) {
		name.value = store.state.user.name
	}
	if (store.state.user.avatar) {
		avatar.value = store.state.user.avatar
	}
})

// 方法
function navigateTo(url) {
	uni.navigateTo({
		url
	})
}


function confirmLogout() {
	showLogout.value = false
	// 调用退出登录接口
	store.dispatch('LogOut').then(() => {
		uni.clearStorageSync()
		uni.reLaunch({
			url: '/pages/login'
		})
	})
}
// 退出登录
function logout() {
	showLogout.value = true
}
// 退出登录-弹窗关闭时触发
function close() {
	showLogout.value = false
}
// 退出登录-弹窗打开时触发
function open() {
	showLogout.value = true
}
</script>

<style lang="scss" scoped>
page {
	background-color: #ededed !important;
}	



.user-box {
	background-color: #fff;
}

::v-deep.u-cell-group {
	background-color: #fff !important;
  border-radius: 10rpx;
  margin: 0 20rpx;
  border-radius: 10rpx;
}
::v-deep .u-line:nth-child(1) {
	border: none !important;
}
::v-deep .u-line:nth-child(7) {
	border: none !important;
}
.popup-content {
	padding: 40rpx;
	background-color: #fff;
	border-radius: 20rpx;
	width: 80%;
}
.list{
	padding: 0 10rpx;
}

.park-switch-popup {
	padding: 34rpx 30rpx 48rpx;
	background-color: #fff;
}

.park-switch-title {
	padding-bottom: 22rpx;
	font-size: 32rpx;
	font-weight: 600;
	text-align: center;
	color: #222;
}

.park-option {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 26rpx 12rpx;
	border-bottom: 1rpx solid #f0f0f0;
	font-size: 30rpx;
	color: #333;
}

.park-option.active {
	color: #3B63FF;
	font-weight: 600;
}

</style>
