const state = {
  xiafaNotice: [],
  shenpi: {},
  noticeInfo: {
    dataLength: "",
    type: "", // 1代表升级直属、2代表下发通知、 3代表审批升级的弹框
    driverName: ""
  }
}
const mutations = {
  setXiafaNotice(state, xiafaNotice) {
    state.xiafaNotice = xiafaNotice
  },
  setShenpi(state, shenpi) {
    state.shenpi = shenpi
  },
  setNoticeInfo(state, noticeInfo) {
    state.noticeInfo = noticeInfo
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
