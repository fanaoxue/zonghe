const waybillNo = { // 新增运单第一步所需要填写的字段
	weyBillFirst: {
		taxWaybillNo: '', // 运单号
		startProvinceCode: '',
		startCityCode: '',
		startCountyCode: '',
		endProvinceCode: '',
		endCityCode: '',
		endCountyCode: '',
		goodsName: '', // 货物名称
		goodsAmount: '', // 货物数量
		unitPrice: '', // 运输单价
		recvFreight: '', // 应收运费
		items1Value: '', // 趟次类型
		transTrip: '', // 运输趟次
		goodsAmountType: {
			key: '0',
			value: '吨'
		}, // 货物数量类型  0吨  1方  2件
		startTime: '', // 起运时间
		wbItem: '', // 业务项目
		drawee: [], // 受票方名称
		carrierProject: [], // 承运项目
		taxDraweePartyId: '', // 受票方ID
		waybillNoCfg: '', // 运单号必填配置
		loginState: '', // 企业类型
		billCycleMode: '', // 结算周期模式
		requirement: '', // 运输要求
		fahuoName: '', // 发货方名称
		fahuoId: '', // 发货方ID
		relatedShipper: '', //关联货主
	}
}
const driverTeamMsg = { // 新增运单第二步所需要填写的字段
	weyBillSecond: {
		cartBadgeNo: '请输入车牌号码',
		driverName: '',
		mobileNo: '',
		carType: '请选择车型',
		carLength: '请选择车长',
		carTonNumber: '请选择吨位',
		note: '',
		idCard: '',//收款人身份证
		alipayNo: '',//收款人支付宝
		zyCapitalCfg: '',
		payBankName: '',
		payBankNo: '',
		hybWallet: ''
	}
}
const settlementInfo = { // 结算页面的字段
	weyBillThird: {
		allFreight: '', // 运费金额
		backFee: '', // 回单押金
		prepayments: '', // 预付现金
		prepaymentsOilCard: '', // 预付油卡
		prepaymentsBuyOil: '', // 线下油款
		prepaymentsBuyGas: '', // 线下气款
		prepaymentsBuyEtc: '', // 线下路桥费
		// prepaymentsEtcCard: '', // 预付ETC
		goodsCost: '', // 货值
		demo1Checkbox: '', // 预付现金选中项
		items1Value: '', // 保险选中项
		zyCapitalCfg: '', // 回款宝配置
		hybWalletCfg: '', // 钱包配置
		arrivePay: ''
	}
}

const reciveMsgInfo = { // 填写收款信息页面
	reciveMsgPay: {
		reciveType: '-1',
		recivePersonName: '', // 收款人姓名
		recivePersonCardNum: '', // 收款人身份证号
		recivePersonBankNum: '', // 收款人银行卡号
		recivePersonphoneNum: '', // 收款人手机号
		reciveBank: [], // 收款人银行名称
		reciveBankAdress: [], // 收款人银行地址
		alipayNo: '', // 支付宝账号
		acctType: '' //是否是钱包收款
	}
}

const reciveMsgInfo1 = { // 回款保本人的收款人信息页面
	reciveMsgPay1: {
		driverName: '', // 收款人姓名
		bankNum: '', // 收款人银行卡号
		bankName: '', // 收款人银行名称
		alipayNo: '' // 支付宝账号
	}
}

const state = Object.assign({}, driverTeamMsg, waybillNo, settlementInfo, reciveMsgInfo, reciveMsgInfo1)
const mutations = {
	updateWayBillStatus(state, payload) {
		state[payload.type] = Object.assign({}, payload.updatMsg)
	},
	updateWayRecivePersonName(state, recivePersonName) {
		state.reciveMsgPay.recivePersonName = recivePersonName
	},
	resetReciveMsgInfo(state) {
		state.reciveMsgPay = reciveMsgInfo
	},
}
export default {
	state,
	mutations
}
