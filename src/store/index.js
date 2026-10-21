import { createStore } from 'vuex';
import { getEnterpriseBaseInfo } from '@/api/operations/enterpriseBaseInfo';
import user from './modules/user';

export default createStore({
  modules: {
    user
  },
  state: {
    enterpriseId: null,
    detailInfo: {},
    // 本月已申报政策
    monthlyPolicies: [],
    // 下月重点申报政策
    nextMonthPolicies: []
  },
  mutations: {
    setEnterpriseId(state, id) {
      state.enterpriseId = id;
    },
    setDetailInfo(state, info) {
      state.detailInfo = info;
    },
    setMonthlyPolicies(state, policies) {
      state.monthlyPolicies = policies;
    },
    setNextMonthPolicies(state, policies) {
      state.nextMonthPolicies = policies;
    },
    addMonthlyPolicy(state, policy) {
      state.monthlyPolicies.push(policy);
    },
    addNextMonthPolicy(state, policy) {
      state.nextMonthPolicies.push(policy);
    },
    deleteMonthlyPolicy(state, index) {
      state.monthlyPolicies.splice(index, 1);
    },
    deleteNextMonthPolicy(state, index) {
      state.nextMonthPolicies.splice(index, 1);
    },
    updateDetailInfoPolicies(state) {
      // 合并本月已申报政策和下月重点申报政策
      const policies = [
        ...state.monthlyPolicies.map(p => ({
          ...p,
          type: '已申报'
        })),
        ...state.nextMonthPolicies.map(p => ({
          ...p,
          type: '未来申报',
          declareTime: p.date && p.date !== '' ? new Date(p.date.replace(/\./g, '-')).getTime() : null
        }))
      ];
      state.detailInfo.enterpriseInfoPolicies = policies;
    }
  },
  actions: {
    async fetchEnterpriseInfo({ commit }, id) {
      try {
        const res = await getEnterpriseBaseInfo(id);
        if (res.code === 200 && res.data) {
          const data = res.data;
          commit('setDetailInfo', data);
          
          // 初始化本月已申报政策列表
          const declared = (data.enterpriseInfoPolicies || []).filter(p => p.type === '已申报');
          const monthlyPolicies = declared.map(p => ({
            id: p.id,
            name: p.name,
            status: p.status
          }));
          commit('setMonthlyPolicies', monthlyPolicies);
          
          // 初始化下月重点申报政策列表
          const future = (data.enterpriseInfoPolicies || []).filter(p => p.type === '未来申报');
          const nextMonthPolicies = future.map(p => ({
            id: p.id,
            name: p.name,
            date: p.declareTime ? formatDate(new Date(p.declareTime)) : ''
          }));
          commit('setNextMonthPolicies', nextMonthPolicies);
          
          return data;
        }
      } catch (e) {
        uni.showToast({ title: '获取详情失败', icon: 'none' });
        return null;
      }
    }
  },
  getters: {
    enterpriseId: state => state.enterpriseId,
    detailInfo: state => state.detailInfo,
    monthlyPolicies: state => state.monthlyPolicies,
    nextMonthPolicies: state => state.nextMonthPolicies
  }
});

// 格式化日期
function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}.${month}.${day}`;
}
