/**
 * 大宗1.0信息储存处
 */
const waybillInfo = { // 扫码补单新增运单第一步所需要填写的字段
    dazongFirst: {
        goodsName: '', //货物名称
        startTime: '', //发车时间
        unitPrice: '', //运输单价
        danwei: '', //发货单位
        billCycleMode:'',//
        items1Value: '', //趟次类型
        transTrip: '', //运输趟次
        wbItem: '', //业务项目
        orgId: '', //企业ID
        transportLineId: '', //线路ID
        startProvinceCode: '',
        startCityCode: '',
        startCountyCode: '',
        endProvinceCode: '',
        endCityCode: '',
        endCountyCode: '',
        loadingAddressName: '',
        unloadingAddressName: '',
        maxAllFreight: '',
        tripFlag:''
    }
}

const dazongBuildWaybill = { // 大综点击使用建单第一步
    dazongFirstqiye: {
        taxWaybillNo: '',
        transportLineId:'',
        loadingAddressName: '',
        unloadingAddressName: '',
        startProvinceCode: '',
        startCityCode: '',
        startCountyCode: '',
        endProvinceCode: '',
        endCityCode: '',
        endCountyCode: '',
        goodsName: '',
        unitPrice: '',
        startTime: '',
        drawee: '',
        taxDraweePartyId: '',
        requirement: '',
        tripFlag: '',
        consignor: [],
        wbItem: ''
    }
}

const state = Object.assign({}, waybillInfo, dazongBuildWaybill)
const mutations = {
    updateWayBillStatus(state, payload) {
        state[payload.type] = Object.assign({}, payload.updatMsg)
    }
}
export default {
    state,
    mutations
}
