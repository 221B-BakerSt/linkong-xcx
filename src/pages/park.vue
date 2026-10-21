<template>
    <view class="park-service-container">
        <view class="section"  v-if="rolesType !== 'ROLE_DEFAULT'">
            <view class="section-title">企业服务</view>
            <uni-grid :column="4" :showBorder="false">
                <uni-grid-item
                    v-for="(item, index) in enterpriseServices"
                    :key="index"
                >
                    <view
                        class="grid-item-box"
                        @click="handleServiceClick(item)"
                    >
                        <view class="service-icon">
                            <image
                                v-if="!item.iconName"
                                :src="item.icon"
                                mode="aspectFit"
                                class="icon-img"
                                tint-color="#3B63FF"
                            ></image>
                            <up-icon
                                v-else
                                :name="item.iconName"
                                color="#3B63FF"
                                size="24"
                            ></up-icon>
                        </view>
                        <text class="item-text">{{ item.text }}</text>
                    </view>
                </uni-grid-item>
            </uni-grid>
        </view>

        <!-- 园区服务板块 -->
        <view class="section">
            <view class="section-title">园区服务</view>
            <uni-grid :column="4" :showBorder="false">
                <uni-grid-item
                    v-for="(item, index) in parkServices"
                    :key="index"
                >
                    <view
                        class="grid-item-box"
                        @click="handleServiceClick(item)"
                    >
                        <view class="service-icon">
                            <image
                                v-if="!item.iconName"
                                :src="item.icon"
                                mode="aspectFit"
                                class="icon-img"
                                tint-color="#3B63FF"
                            ></image>
                            <up-icon
                                v-else
                                :name="item.iconName"
                                color="#3B63FF"
                                size="24"
                            ></up-icon>
                        </view>
                        <text class="item-text">{{ item.text }}</text>
                    </view>
                </uni-grid-item>
            </uni-grid>
        </view>
    </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import store  from "@/store";
const rolesType = store.state.user.roles[0];
const enterpriseServices = ref([
    {
        icon: "/static/images/icon/park/information_submission.png",
        text: "信息填报",
        url: "/pages_info/info/index",
    },
    {
        icon: "/static/images/icon/park/enterprise_assessment.png",
        text: "企业考核",
        url: "/pages_info/assessment/index",
    },
    {
        icon: "/static/images/icon/park/enterprise_early_warning.png",
        text: "企业预警",
        url: "/pages_info/warning/index",
    },
    {
        icon: "/static/images/icon/park/enterprise_demand.png",
        text: "企业诉求",
        url: "/pages_home/enterprise/index",
    },
]);

const parkServices = ref([
    {
        icon: "/static/images/icon/park/technical_service.png",
        text: "技术服务",
        url: "/pages_services/technical/technical",
    },
    {
        icon: "/static/images/icon/park/financial_service.png",
        text: "金融服务",
        url: "/pages_services/finance/finance",
    },
    {
        icon: "/static/images/icon/park/policy_service.png",
        text: "政策服务",
        url: "/pages_services/policy/policy",
    },
    {
        icon: "/static/images/icon/park/government_service.png",
        text: "政务服务",
        url: "/pages_services/government/government",
    },
    {
        icon: "/static/images/icon/park/service_institution.png",
        text: "服务机构",
        url: "/pages_services/institution/institution",
    },
    {
        icon: "/static/images/icon/park/park_house.png",
        text: "园区房源",
        url: "/pages_home/house/index",
    },
    {
        icon: "/static/images/icon/park/park_apartment.png",
        text: "园区公寓",
        url: "/pages_home/apartment/index",
    },
    {
        icon: "/static/images/icon/park/park_meeting_room.png",
        text: "园区会议室",
        url: "/pages_home/meetingRoom/index",
    },
    {
        icon: "/static/images/icon/park/park_restaurant.png",
        text: "园区餐饮",
        url: "/pages_home/food/index",
    },
    {
        icon: "/static/images/icon/park/park_supermarket.png",
        text: "园区超市",
        url: "/pages_home/supermarket/index",
    },
    {
        icon: "/static/images/icon/park/park_print_shop.png",
        text: "园区文印店",
        url: "/pages_home/wenyinStore/index",
    },
    {
        icon: "/static/images/icon/park/staff_activity_center.png",
        text: "职工活动中心",
        url: "/pages_home/employee/index",
    },
    {
        icon: "/static/images/icon/park/park_bank.png",
        text: "园区银行",
        url: "/pages_home/bank/index",
    },
    {
        icon: "/static/images/icon/park/cooling_heating.png",
        text: "制冷供暖",
        url: "/pages_park/asset/coolHeat/index",
    },
    {
        icon: "/static/images/icon/park/park_boiler.png",
        text: "园区锅炉",
        url: "/pages_park/asset/boiler/boiler",
    },
    {
        icon: "/static/images/icon/park/sewage_treatment.png",
        text: "污水处理站",
        url: "/pages_park/asset/sewage/sewage",
    },
    {
        icon: "/static/images/icon/park/satisfaction_survey.png",
        text: "满意度调查",
        url: "/pages_park/survey/satisfaction",
    },
    {
        icon: "/static/images/icon/park/activity_registration.png",
        text: "活动报名",
        url: "/pages_park/activity/registration",
    },
    {
        icon: "/static/images/icon/park/notice.png",
        text: "通知公告",
        url: "/pages_park/notice/notice",
    },
    {
        iconName: "file-text-fill",
        text: "\u5de5\u5355\u62a5\u4e8b\u62a5\u4fee",
        url: "/pages_services/workOrder/index",
    },
]);

const handleServiceClick = (item) => {
    if (item.url) {
        uni.navigateTo({ url: item.url });
    }
};

</script>

<style lang="scss" scoped>
.park-service-container {
    background-color: #f3f8fe;
    min-height: 100vh;
    padding-bottom: 50px;
}

.section {
    margin-top: 16px;
    padding: 0 16px;
    background-color: #fff;
    border-radius: 8px;
    padding-bottom: 16px;
}

.section-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    padding: 16px 0;
    margin-bottom: 8px;
}

.grid-item-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px 8px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    margin: 4px;
}

.service-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
}

.icon-img {
    width: 24px;
    height: 24px;
}

.item-text {
    font-size: 10px;
    color: #000000;
    text-align: center;
    line-height: 0.5;
}
</style>
