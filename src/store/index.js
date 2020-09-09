import Vue from 'vue'
import Vuex from 'vuex'
import loading from './modules/loading'
import wayBill from './modules/wayBill'
import applyPayMsg from './modules/wayBillApplyPay'
import dazong from './modules/dazong'
import oilCard from './modules/oilCard'
import deliveryGoods from './modules/deliveryGoods'
import user from './modules/user'
import roadTransCapacity from './modules/roadTransCapacity'
import carTeamMasterInfo from './modules/carTeamMasterInfo'
import bigCompre from './modules/bigCompre'

// import createLogger from '../../../src/plugins/logger'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    loading,
    wayBill,
    applyPayMsg,
    oilCard,
    dazong,
    deliveryGoods,
    user,
    roadTransCapacity,
    carTeamMasterInfo,
    bigCompre
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
