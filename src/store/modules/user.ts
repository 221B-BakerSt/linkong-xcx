import config from '@/config'
import storage from '@/utils/storage'
import constant from '@/utils/constant'
import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { UserState, UserForm } from '@/types/store'
import { Module } from 'vuex'

const baseUrl = config.baseUrl

const user: Module<UserState, UserState> = {
  state: {
    token: getToken(),
    name: storage.get(constant.name),
    nickName: storage.get(constant.nickName),
    avatar: storage.get(constant.avatar),
    roles: storage.get(constant.roles),
    permissions: storage.get(constant.permissions),
    userId: storage.get(constant.userId),
    phoneNum: storage.get(constant.phoneNum),
  },
  mutations: {
    SET_TOKEN: (state, token: string) => {
      state.token = token
    },
    SET_NAME: (state, name: string) => {
      state.name = name
      storage.set(constant.name, name)
    },
    SET_NICK_NAME: (state, nickName: string) => {
      state.nickName = nickName
      storage.set(constant.nickName, nickName)
    },
    SET_AVATAR: (state, avatar: string) => {
      state.avatar = avatar
      storage.set(constant.avatar, avatar)
    },
    SET_ROLES: (state, roles: Array<string>) => {
      state.roles = roles
      storage.set(constant.roles, roles)
    },
    SET_PERMISSIONS: (state, permissions: Array<string>) => {
      state.permissions = permissions
      storage.set(constant.permissions, permissions)
    },
    SET_USER_ID: (state, userId: string) => {
      state.userId = userId
      storage.set(constant.userId, userId)
    },
    SET_PHONE_NUM: (state, phoneNum: string) => {
      state.phoneNum = phoneNum
      storage.set(constant.phoneNum, phoneNum)
    }
  },



  actions: {
    // 登录
    Login({ commit }, userInfo: UserForm) {
      // const username = userInfo.username
      // const password = userInfo.password
      // const code = userInfo.code
      // const uuid = userInfo.uuid
      return new Promise((resolve, reject) => { 
        login(userInfo).then((res: any) => {
		  const data = res.data;
          setToken(data.access_token)
          commit('SET_TOKEN', data.access_token)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then((res: any) => {
		const data=res.data;
          const user = data.user
          const avatar = (user == null || user.avatar == "" || user.avatar == null) ? "/static/logo.png" : baseUrl + user.avatar
          const username = (user == null || user.userName == "" || user.userName == null) ? "" : user.userName
          const userId = (user == null || user.userId == "" || user.userId == null) ? "" : user.userId
          const phoneNum = (user == null || user.phonenumber == "" || user.phonenumber == null) ? "" : user.phonenumber
          const nickName = (user == null || user.nickName == "" || user.nickName == null) ? "" : user.nickName
          commit('SET_NICK_NAME', nickName)
          commit('SET_USER_ID', userId)
          commit('SET_PHONE_NUM', phoneNum)
          if (data.roles && data.roles.length > 0) {
            commit('SET_ROLES', data.roles)
            commit('SET_PERMISSIONS', data.permissions)
          } else {
            commit('SET_ROLES', ['ROLE_DEFAULT'])
          }
          commit('SET_NAME', username)
          commit('SET_AVATAR', avatar)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout().then((res) => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
          storage.clean()
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default user
