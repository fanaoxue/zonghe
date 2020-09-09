const getDefaultCarTeamInfo = () =>{
  return {
    carTeamInfo: {
      acctType: "",
      alipayNo: "",
      bankInfoId: "",
      mobileNo: "",
      paidType: "",
      payMoney:"",
      payeeBankName: "",
      payeeBankNo: "",
      payeeCityId: "",
      payeeCityName: "",
      payeeIdCard: "",
      payeeName: "",
      payeeProvince: "",
      payeeProvinceId: "",
      reciveMessage_DFJ: "",
      wsMerchantId: "",
    }
  }
}
const state = getDefaultCarTeamInfo();

const getters = {}

const actions = {}

const mutations = {
  RESET_CARTEAMINFO: state => {
    Object.assign(state, getDefaultCarTeamInfo());
  },
  setCarTeamInfo(state, carTeamInfo) {
    Object.assign(state.carTeamInfo, carTeamInfo);
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
