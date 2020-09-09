const delivery_goods_first = {
    deliveryGoodsFirst: {
        loadingProvinceName: '',
        loadingCityName: '',
        loadingCountyName: '',
        unloadingProvinceName: '',
        unloadingCityName: '',
        unloadingCountyName: '',

        loadingProvinceId: '',
        loadingCityId: '',
        loadingCountyId: '',
        unloadingProvinceId: '',
        unloadingCityId: '',
        unloadingCountyId: '',

        goodsName: '',
        goodsAmount: '',
        goodsAmountType: '0',
        loadNumUnloadNum: '',
        cartLength: '',
        cartType: ''
    }
}
const delivery_goods_second = {
    deliveryGoodsSecond: {
        loadingTime: '',
        expectFreight: '',
        settleType: '',
        isSupportTraffic: '',
        serviceRequire: '',
        specialExplain: ''
    }
}
const delivery_goods_templete = {
    deliveryGoodsTemplete: {
        loadingProvinceName: '',
        loadingCityName: '',
        loadingCountyName: '',
        unloadingProvinceName: '',
        unloadingCityName: '',
        unloadingCountyName: '',

        loadingProvinceId: '',
        loadingCityId: '',
        loadingCountyId: '',
        unloadingProvinceId: '',
        unloadingCityId: '',
        unloadingCountyId: '',

        goodsName: '',
        goodsAmount: '',
        goodsAmountType: '0',
        loadNumUnloadNum: '',
        cartLength: '',
        cartType: '',

        loadingTime: '',
        expectFreight: '',
        settleType: '',
        isSupportTraffic: '',
        serviceRequire: '',
        specialExplain: ''
    }
}
const delivery_goods_again = {
    deliveryGoodsAgain: {
        loadingProvinceName: '',
        loadingCityName: '',
        loadingCountyName: '',
        unloadingProvinceName: '',
        unloadingCityName: '',
        unloadingCountyName: '',

        loadingProvinceId: '',
        loadingCityId: '',
        loadingCountyId: '',
        unloadingProvinceId: '',
        unloadingCityId: '',
        unloadingCountyId: '',

        goodsName: '',
        goodsAmount: '',
        goodsAmountType: '0',
        loadNumUnloadNum: '',
        cartLength: '',
        cartType: '',

        loadingTime: '',
        expectFreight: '',
        settleType: '',
        isSupportTraffic: '',
        serviceRequire: '',
        specialExplain: ''
    }
}
const delivery_goods_waybill_info = {
    deliveryGoodsWaybillInfo: {
        loadingProvinceName: '',
        loadingCityName: '',
        loadingCountyName: '',
        unloadingProvinceName: '',
        unloadingCityName: '',
        unloadingCountyName: '',

        loadingProvinceId: '',
        loadingCityId: '',
        loadingCountyId: '',
        unloadingProvinceId: '',
        unloadingCityId: '',
        unloadingCountyId: '',

        goodsName: '',
        goodsAmount: '',
        goodsAmountType: '0',
        loadNumUnloadNum: '',
        cartLength: '',
        cartType: '',
        expectFreight: '',
        goodsId: ''
    }
}
const state = Object.assign({}, delivery_goods_first, delivery_goods_second, delivery_goods_templete, delivery_goods_again, delivery_goods_waybill_info)
const mutations = {
    updateDeliveryGoods(state, payload) {
        state[payload.type] = Object.assign({}, payload.updatMsg)
    },
    updateDeliveryGoodsTemplete(state, payload) {
        state.deliveryGoodsTemplete = Object.assign({}, payload.updatMsg)
    },
    updateDeliveryGoodsAgain(state, payload) {
        state.deliveryGoodsAgain = Object.assign({}, payload.updatMsg)
    },
    updateDeliveryGoodsWaybillInfo(state, payload) {
        state.deliveryGoodsWaybillInfo = Object.assign({}, payload.updatMsg)
    },
    cleareDeliveryGoods(state) {
        state = Object.assign({}, delivery_goods_first, delivery_goods_second, delivery_goods_templete, delivery_goods_waybill_info)
    },
}

export default {
    state,
    mutations
}
