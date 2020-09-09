const state = {
  applyPayMsg: {
    payMoney: '',
    cardNum: '',
    personName: '',
    bankNum: '',
    alipayNo: '',
    bankName: [],
    bankAdress: [],
    payType: '',
    paidType: '',
    changeState: '',
    wsMerchantId: '', // 网商商户号
    walletPay: '', // 是否是钱包收款
    clearData: ''
  }
}
const mutations = {
  updateApplyPayMsg(state, payload) {
    state.applyPayMsg = Object.assign({}, payload)
  }
}
export default {
  state,
  mutations
}
