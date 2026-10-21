<template>
    <view class="page-container">
        <view class="section">
            <view class="section-title">房源详情</view>
          <view class="info-item">
                <text class="info-label">房源名称</text>
                <text class="info-value">{{ house.roomName }}</text>
            </view>
            <view class="info-item">
                <text class="info-label">房源区域</text>
                <text class="info-value">{{ house.remarkRegion }}</text>
            </view>
            <view class="info-item">
                <text class="info-label">房源楼栋</text>
                <text class="info-value">{{ house.remarkBuilding }}</text>
            </view>
            <view class="info-item">
                <text class="info-label">房源楼层</text>
                <text class="info-value">{{ house.remarkFloor }}</text>
            </view>
            <view class="info-item">
                <text class="info-label">建筑面积(m²)</text>
                <text class="info-value">{{ house.area }}</text>
            </view>
        </view>

        <view class="section">
            <view class="section-title">预约信息</view>
            <view class="info-item">
                <text class="info-label">预约人</text>
                <up-input v-model="form.contact" placeholder="请输入预约人" border="none" text="right" disabled disabledColor="#fff"/>
            </view>
            <view class="info-item">
                <text class="info-label">联系电话</text>    
                <up-input v-model="form.phoneNum" placeholder="请输入联系电话" border="none" type="number"/>
            </view>
              <view class="info-item" >
                <text class="info-label">预约时间</text>
                <view class="info-value" style="display: flex; align-items: center;" @click="timeShow = true">
                    <text>{{ formattedTime }}</text>
                    <up-icon  name="calendar"></up-icon>
                </view>
            </view>
        </view>

  

        <view class="button-container">
            <button class="btn-primary" @click="submitBooking">确认预约</button>
        </view>
          <!-- 日期时间 -->
         <up-datetime-picker
		ref="datetimePickerRef"
		:show="timeShow"
            v-model="timeData"
		mode="datetime"
		:formatter="formatter"
		:min-date="minDate"
		:max-date="maxDate"
        @cancel="timeShow = false"
        @change="changeTime"
        @confirm="confirmTime"

        ></up-datetime-picker>
    </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getAvailableRoomDetail, addHouseReserve } from '@/api/park/park.js'
import store from "@/store";

onLoad((options) => {
    
    id.value = options.id
    getDetail()

})
const id = ref('')
const house = ref({})

const form = ref({
    contact: store.state.user.nickName,
    phoneNum: store.state.user.phoneNum,
});
const timeShow = ref(false);
const timeData = ref(Date.now());
const datetimePickerRef = ref(null);
const minDate = ref(Date.now());
const maxDateValue = new Date();
maxDateValue.setMonth(maxDateValue.getMonth() + 12);
const maxDate = ref(maxDateValue.getTime());

const formattedTime = computed(() => {
  const date = new Date(timeData.value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
  
s
});

const formatter = (type, value) => {
   if (type === 'year') return `${value}年`;
  if (type === 'month') return `${value}月`;
  if (type === 'day') return `${value}日`;
  if (type === 'hour') return `${value}时`;
  if (type === 'minute') return `${value}分`;
  return value;
};



const changeTime = (e) => {
  timeData.value = e.detail.value;
};

const confirmTime = (e) => {
  timeShow.value = false;
};
function getDetail(){
    getAvailableRoomDetail(id.value).then(res => {
        house.value = res.data
    })
}
function submitBooking(){
    addHouseReserve({
         roomId: id.value,
        number: form.value.phoneNum,
        appointmentTime: timeData.value,
       
    }).then(res => {
        if(res.code === 200){
            uni.showToast({ title: '预约成功', icon: 'success' });
            uni.navigateTo({
                url: '/pages_home/house/success',
            })
        }
    })
}



</script>

<style scoped lang="scss">

.page-container {
    min-height: 100vh;
    background-color: #f5f7fa;
    padding: 20rpx;
  
    .section {
        background-color: #ffffff;
        border-radius: 12rpx;
        padding: 24rpx;
        margin-bottom: 20rpx;
        box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

        .section-title {
            font-size: 28rpx;
            font-weight: bold;
            color: #333;
            margin-bottom: 20rpx;
        }

       .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 16px;
    ::v-deep(.u-input) {
  .u-input__content{
    .u-input__content__field-wrapper{
        .u-input__content__field-wrapper__field{
            text-align: right !important;
        }
    }
  }
}
    .info-label {
    font-size: 14px;
    color: #666666;
}

.info-value {
    font-size: 14px;
    color: #333333;
}
}

        .form-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15rpx 0;

            .label {
                font-size: 24rpx;
                color: #666;
                flex: 1;
            }

            input {
                flex: 2;
                padding: 10rpx;
                border: none;
                font-size: 24rpx;
                color: #333;
            }

            .date-picker,
            .time-picker {
                flex: 2;
                position: relative;

                input {
                    width: 100%;
                    padding-right: 40rpx;
                }

                .icon {
                    position: absolute;
                    right: 10rpx;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 24rpx;
                }

                .picker-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    font-size: 24rpx;
                    color: #333;
                }
            }
        }
    }

    .button-container {
        margin-top: 30rpx;

        .btn-primary {
            width: 100%;
            height: 80rpx;
            background-color: #235eff;
            color: #ffffff;
            font-size: 28rpx;
            border-radius: 40rpx;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .btn-primary::after {
            border: none;
        }
    }
}
</style>
