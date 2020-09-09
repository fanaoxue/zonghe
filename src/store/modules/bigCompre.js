/**
 * 大宗2.0信息存储
 */
const state = {
  goodsInfo: {},
  lineInfo: {},
}
const mutations = {
  setGoodsInfo(state, payload) {
    state.goodsInfo = Object.assign({},payload)
  },
  setLineInfo(state, payload) {
    state.lineInfo = Object.assign({},payload)
  },
}
const getters = {}

const actions = {}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
