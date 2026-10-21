<template>
  <view class="container">
    <!-- 旧版 uni-list 样式，当前先保留以便后续恢复 -->
    <!--
    <uni-list>
      <uni-list-item
        showExtraIcon="true"
        :extraIcon="{ type: 'person-filled' }"
        title="昵称"
        :rightText="user.nickName || '-'"
      />
      <uni-list-item
        showExtraIcon="true"
        :extraIcon="{ type: 'phone-filled' }"
        title="手机号码"
        :rightText="user.phonenumber || '-'"
      />
      <uni-list-item
        showExtraIcon="true"
        :extraIcon="{ type: 'email-filled' }"
        title="邮箱"
        :rightText="user.email || '-'"
      />
      <uni-list-item
        showExtraIcon="true"
        :extraIcon="{ type: 'auth-filled' }"
        title="岗位"
        :rightText="postGroup || '-'"
      />
      <uni-list-item
        showExtraIcon="true"
        :extraIcon="{ type: 'staff-filled' }"
        title="角色"
        :rightText="roleGroup || '-'"
      />
      <uni-list-item
        showExtraIcon="true"
        :extraIcon="{ type: 'calendar-filled' }"
        title="创建日期"
        :rightText="user.createTime || '-'"
      />
    </uni-list>
    -->
    <view class="info-panel">
      <u-cell-group :border="false">
        <u-cell
          v-for="item in profileItems"
          :key="item.key"
          :title="item.label"
          :border="item.key !== profileItems[profileItems.length - 1].key"
          :clickable="false"
          :is-link="false"
          :center="true"
          :title-style="item.titleStyle"
        >
          <template #icon>
            <view class="cell-icon">
              <u-icon :name="item.icon" color="#2f6bff" size="18"></u-icon>
            </view>
          </template>
          <template #value>
            <text class="cell-value">{{ item.value || "-" }}</text>
          </template>
        </u-cell>
      </u-cell-group>
    </view>
  </view>
</template>

<script>
import { getUserProfile } from "@/api/system/user";

const defaultUser = () => ({
  nickName: "",
  phonenumber: "",
  email: "",
  createTime: ""
});

export default {
  data() {
    return {
      user: defaultUser(),
      roleGroup: "",
      postGroup: ""
    };
  },
  computed: {
    profileItems() {
      return [
        {
          key: "nickName",
          label: "昵称",
          value: this.user.nickName,
          icon: "account-fill",
          titleStyle: "color: #303133; font-size: 30rpx;"
        },
        {
          key: "phonenumber",
          label: "手机号码",
          value: this.user.phonenumber,
          icon: "phone-fill",
          titleStyle: "color: #303133; font-size: 30rpx;"
        },
        {
          key: "email",
          label: "邮箱",
          value: this.user.email,
          icon: "email-fill",
          titleStyle: "color: #303133; font-size: 30rpx;"
        },
        {
          key: "postGroup",
          label: "岗位",
          value: this.postGroup,
          icon: "tags-fill",
          titleStyle: "color: #303133; font-size: 30rpx;"
        },
        {
          key: "roleGroup",
          label: "角色",
          value: this.roleGroup,
          icon: "grid-fill",
          titleStyle: "color: #303133; font-size: 30rpx;"
        },
        {
          key: "createTime",
          label: "创建日期",
          value: this.user.createTime,
          icon: "calendar-fill",
          titleStyle: "color: #303133; font-size: 30rpx;"
        }
      ];
    }
  },
  onLoad() {
    this.getUser();
  },
  methods: {
    getUser() {
      getUserProfile().then((response) => {
        const data = response && response.data ? response.data : {};
        this.user = data.user || defaultUser();
        this.roleGroup = data.roleGroup || "";
        this.postGroup = data.postGroup || "";
      }).catch(() => {
        this.user = defaultUser();
        this.roleGroup = "";
        this.postGroup = "";
        uni.showToast({
          title: "个人信息加载失败",
          icon: "none"
        });
      });
    }
  }
};
</script>

<style lang="scss">
page {
  background-color: #f5f6f8;
}

.container {
  min-height: 100vh;
  padding: 20rpx;
  box-sizing: border-box;
}

.info-panel {
  overflow: hidden;
  background-color: #ffffff;
  border-radius: 16rpx;
  box-shadow: 0 8rpx 24rpx rgba(15, 34, 67, 0.05);
}

.cell-icon {
  width: 56rpx;
  height: 56rpx;
  margin-right: 12rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(47, 107, 255, 0.1);
}

.cell-value {
  max-width: 420rpx;
  font-size: 28rpx;
  color: #606266;
  text-align: right;
  word-break: break-all;
}

.info-panel :deep(.u-cell) {
  background-color: transparent !important;
}

.info-panel :deep(.u-cell__body) {
  min-height: 108rpx;
  padding: 24rpx 28rpx;
}

.info-panel :deep(.u-cell__body__content) {
  min-width: 0;
}

.info-panel :deep(.u-cell__left-icon-wrap) {
  margin-right: 0;
}

.info-panel :deep(.u-cell__title) {
  flex: 1;
}

.info-panel :deep(.u-line) {
  border-color: #ebeef5 !important;
}
</style>
