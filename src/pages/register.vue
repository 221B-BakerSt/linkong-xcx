<template>
  <view class="normal-login-container">
    <view class="bg-decoration">
      <view class="bg-circle bg-circle-1"></view>
      <view class="bg-circle bg-circle-2"></view>
      <view class="bg-circle bg-circle-3"></view>
    </view>

    <view class="logo-container">
      <image :src="globalConfig.appInfo.logo" mode="widthFix"></image>
    </view>

    <view class="center-form">
      <view class="account-number">
        <view class="tenant">
          <up-icon name="home" size="22" color="#909399"></up-icon>
          <view class="tenant-input">
            <up-picker-data
              v-model="registerForm.tenantId"
              title="请选择园区"
              :options="tenantList"
              valueKey="value"
              labelKey="text"
            >
              <template #trigger="{ current }">
                <view class="tenant-picker-trigger">
                  <text :class="current ? 'tenant-picker-value' : 'tenant-picker-placeholder'">
                    {{ current || "请选择园区" }}
                  </text>
                  <up-icon name="arrow-down-fill" size="12" color="#909399"></up-icon>
                </view>
              </template>
            </up-picker-data>
          </view>
        </view>

        <up-input
          v-model="registerForm.username"
          placeholder="请输入账号"
          border="bottom"
          clearable
          prefixIcon="account"
          prefixIconStyle="font-size: 22px;color: #909399"
        ></up-input>

        <up-input
          v-model="registerForm.password"
          placeholder="请输入密码"
          border="bottom"
          clearable
          prefixIcon="eye"
          prefixIconStyle="font-size: 22px;color: #909399"
          type="password"
        ></up-input>

        <up-input
          v-model="registerForm.confirmPassword"
          placeholder="请确认密码"
          border="bottom"
          clearable
          prefixIcon="eye"
          prefixIconStyle="font-size: 22px;color: #909399"
          type="password"
        ></up-input>

        <view class="codeImg">
          <up-input
            v-model="registerForm.code"
            placeholder="请输入验证码"
            border="none"
            clearable
            prefixIcon="eye"
            prefixIconStyle="font-size: 22px;color: #909399"
          ></up-input>
          <view class="login-code">
            <image
              :src="codeUrl"
              @click="getCode"
              class="login-code-img"
            ></image>
          </view>
        </view>
      </view>

      <view class="action-btn">
        <button
          @click="handleRegister"
          class="login-btn"
          style="background-color: #4d69cc; color: #fff"
        >
          注册
        </button>
        <view class="login-link">
          <text>已有账号？</text>
          <text class="login-text" @click="toLogin">立即登录</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { getCodeImg, getTenantList, register } from "@/api/login";
import config from "@/config.js";
import modal from "@/plugins/modal";

const codeUrl = ref("");
const captchaEnabled = ref(true);
const globalConfig = ref(config);
const tenantList = ref([]);

const registerForm = ref({
  tenantId: "",
  username: "",
  password: "",
  confirmPassword: "",
  code: "",
  uuid: "",
  grantType: "password",
  userType: "sys_user",
  clientId: "e5cd7e4891bf95d1d19206ce24a7b32e",
});

function getCode() {
  getCodeImg().then((res) => {
    const { data } = res;
    captchaEnabled.value =
      data.captchaEnabled === undefined ? true : data.captchaEnabled;
    if (captchaEnabled.value) {
      codeUrl.value = "data:image/gif;base64," + data.img;
      registerForm.value.uuid = data.uuid;
    }
  });
}

function getTenant() {
  getTenantList().then((res) => {
    const list = res.data?.voList || [];
    tenantList.value = list.map((item) => ({
      value: item.tenantId,
      text: item.companyName,
    }));
  });
}

async function handleRegister() {
  if (registerForm.value.tenantId === "") {
    modal.msgError("请选择园区");
  } else if (registerForm.value.username === "") {
    modal.msgError("请输入账号");
  } else if (registerForm.value.password === "") {
    modal.msgError("请输入密码");
  } else if (registerForm.value.confirmPassword === "") {
    modal.msgError("请确认密码");
  } else if (registerForm.value.password !== registerForm.value.confirmPassword) {
    modal.msgError("两次输入的密码不一致");
  } else if (registerForm.value.code === "" && captchaEnabled.value) {
    modal.msgError("请输入验证码");
  } else {
    modal.loading("注册中，请耐心等待...");
    await doRegister();
  }
}

async function doRegister() {
  try {
    const res = await register(registerForm.value);
    modal.closeLoading();
    if (res.code === 200) {
      modal.msgSuccess("注册成功");
      setTimeout(() => {
        uni.navigateTo({
          url: "/pages/login",
        });
      }, 1000);
    } else {
      modal.msgError(res.msg || "注册失败");
      if (captchaEnabled.value) {
        getCode();
      }
    }
  } catch (error) {
    modal.closeLoading();
    modal.msgError("网络错误，请稍后重试");
    if (captchaEnabled.value) {
      getCode();
    }
  }
}

function toLogin() {
  uni.navigateTo({
    url: "/pages/login",
  });
}

getCode();
getTenant();
</script>

<style lang="scss">
page {
  background-color: #ffffff;
}

.normal-login-container {
  width: 100%;

  .bg-decoration {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 300rpx;
    z-index: 0;

    .bg-circle {
      position: absolute;
      border-radius: 50%;
      background-color: rgba(24, 144, 255, 0.1);
    }

    .bg-circle-1 {
      width: 20rpx;
      height: 20rpx;
      top: 50rpx;
      left: 250rpx;
    }

    .bg-circle-2 {
      width: 150rpx;
      height: 150rpx;
      top: 100rpx;
      right: 80rpx;
    }

    .bg-circle-3 {
      width: 100rpx;
      height: 100rpx;
      top: 200rpx;
      left: 200rpx;
    }
  }

  .logo-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 125rpx;
    margin-top: 100rpx;
    z-index: 1;
  }

  .center-form {
    background-color: #ffffff;
    margin: 100rpx auto 0 auto;
    width: 700rpx;
    border-radius: 20rpx;
    padding: 40rpx 0;
  }

  .account-number {
    padding: 40rpx 40rpx 0 40rpx;

    .tenant {
      position: relative;
      width: 100%;
      display: flex;
      align-items: center;
      border-bottom: 1rpx solid #f5f5f5;

      ::v-deep {
        > .u-icon {
          position: absolute;
          left: 20rpx;
          z-index: 2;
        }
      }

      .tenant-input {
        width: 100%;
      }

      .tenant-picker-trigger {
        height: 90rpx;
        padding: 0 20rpx 0 70rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .tenant-picker-value,
      .tenant-picker-placeholder {
        font-size: 30rpx;
      }

      .tenant-picker-value {
        color: #303133;
      }

      .tenant-picker-placeholder {
        color: #c0c4cc;
      }
    }

    .u-input {
      height: 100rpx;
      margin-top: 30rpx;
      border-color: #f5f5f5 !important;
    }

    .codeImg {
      padding: 0 20rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1rpx solid #f5f5f5;

      .login-code {
        width: 150rpx;
        height: 80rpx;
        border-radius: 20rpx;

        .login-code-img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .action-btn {
    padding: 40rpx;

    .login-link {
      text-align: center;
      margin-top: 20rpx;
      font-size: 24rpx;
      color: #666;

      .login-text {
        color: #4d69cc;
        margin-left: 10rpx;
      }
    }
  }
}
</style>
