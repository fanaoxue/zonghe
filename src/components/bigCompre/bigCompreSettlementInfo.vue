<template>
    <div class="bigcompre-settlement-info">
        <c-header>
            <x-header :left-options="{ backText: '' }">结算信息</x-header>
        </c-header>
        <group label-width="6em" label-align="right" label-margin-right="1em">
            <x-input v-model.trim="unitPrice"  type="number" title="运输单价：" placeholder="请输入货物的单价" v-show="this.classify != '0'">
                <span slot="right">
                    <span>元/吨</span>
                </span>
            </x-input>
            <x-input v-model="loadingTonnage"  type="number" title="装货吨位：" placeholder="请输入装货吨位">
                <span slot="right">
                    <span>吨</span>
                </span>
            </x-input>
            <x-input title="卸货吨位：" v-model.trim="unloadingTonnage" type="number" placeholder="请输入卸货吨位">
                <div slot="label" style="text-align:right;padding-right:1em;width:6em;">
                    <img :src="bitian" alt width="8px" height="8px" style="font-size:20px;vertical-align:middle;" class="img" />
                    <span style="vertical-align:middle;">卸货吨位：</span>
                </div>
                <span slot="right">
                    <span>吨</span>
                </span>
            </x-input>
            <cell title="货损吨位：" value-align="left" >
                <span class="huosun">{{ huosundunwei }}</span>
                <span>吨</span>
            </cell>
            <x-input title="应收货主运费：" v-model.trim="updw_freight" type="number" v-show="this.classify != '0'" placeholder="请输入应收货主运费">
                <div slot="label" style="text-align:right;padding-right:1em;width:8em;">
                    <img :src="bitian" alt width="8px" height="8px" style="font-size:20px;vertical-align:middle;" class="img" />
                    <span style="vertical-align:middle;">应收货主运费：</span>
                </div>
                <span slot="right">
                    <span>元</span>
                </span>
            </x-input>
            <x-input value-align="left" v-model.trim="allFreight" :show-clear="false" type="number" placeholder="请输入运费金额">
                <div slot="label" style="text-align:right;padding-right:1em;width:6em;">
                    <img :src="bitian" alt width="8px" height="8px" style="font-size:20px;vertical-align:middle;" class="img" />
                    <span style="vertical-align:middle;">运费金额：</span>
                </div>
                <div slot="right">
                    <span>元</span>
                    <span @click="calculate()" v-show="this.classify != '0'">
                        <img src="../../assets/imgs/wbs/jisuan_icon@2x.png" alt width="20" style="vertical-align: bottom;margin-left:10px" />
                        <span style="color:#FFBA00">计算运费</span>
                    </span>
                </div>
            </x-input>
            <x-input v-model.trim="prepayments"  type="number" title="预付现金：" placeholder="请输入预付现金">
                <span slot="right">
                    <span>元</span>
                </span>
            </x-input>
        </group>
        <div class="footer" style="height:5rem;"></div>
        <div class="button">
            <x-button type="primary" @click.native="clickConfirm" :disabled="disabled">建单</x-button>
        </div>
    </div>
</template>
<script>
import { getCookie } from '../../utils/getCookie.js';
import { AppFinish } from '../../utils/app.js';
import { checkFee } from '../../api/api.js';
import { infoEntry } from '../../api/applyPay.js';
import { dazongBuildWaybill } from '../../api/dazongapi.js';
export default {
    name: 'bigCompreSettlementInfo',
    data() {
        return {
            bitian: require("../../assets/imgs/wbs/bitian_icon@2x.png"),
            taxWaybillId: this.$route.query.taxWaybillId,
            xid: this.$route.query.xid,
            unitPrice:'',
            loadingTonnage:'',
            unloadingTonnage:'',
            updw_freight:'',
            allFreight:'',
            prepayments:'',
            disabled: false,
            successFlag: 1,
            classify: getCookie('classify') //类别分类 0：大宗自有运单(不扫码建单) 1：大宗外协运单
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.$store.commit('updateLoadingStatus', { isLoading: false });
        })
    },
    created() {
        this.unitPrice = this.dazongFirst.unitPrice;
    },
    mounted() {
        // this.initPageData();
        // if (this.pageType === 2) {
        //     this._getBillImage();
        // }
    },
    computed: {
        dazongFirst() {
            return this.$store.state.dazong.dazongFirst;
        },
        weyBillSecond() {
            return this.$store.state.wayBill.weyBillSecond;
        },
        reciveMsgPay() {
            return this.$store.state.wayBill.reciveMsgPay;
        },
         huosundunwei: {
            get: function() {
                let temp = Number(this.loadingTonnage) - Number(this.unloadingTonnage);
                if (isNaN(temp) || temp < 0) {
                    return '0.0000';
                }
                return temp.toFixed(4);
            },
            set: function() {}
        }
    },
    methods: {
        clickConfirm(){
            //运输单价
            if(this.classify != '0'){
                if (!this.isEmptyStr(this.unitPrice)) {
                    let regExp = /^([1-9]\d{0,6}|0)([\.]\d{0,4})?$/;
                    if (!regExp.test(this.unitPrice)) {
                        this.$vux.toast.text("无效的运输单价！", "middle");
                        return false;
                    }
                }
            }
            //装货吨位
            if (!this.isEmptyStr(this.loadingTonnage)) {
                let reg = /^([1-9]\d{0,6}|0)([\.]\d{0,4})?$/;
                if (!reg.test(this.loadingTonnage)) {
                    this.$vux.toast.text('无效的装货吨位！', 'middle');
                    return false;
                }
            }
            //卸货吨位必填
            if (this.isEmptyStr(this.unloadingTonnage)) {
                this.$vux.toast.text('卸货吨位必填！', 'middle');
                return false;
            } else {
                let reg = /^([1-9]\d{0,6}|0)([\.]\d{0,4})?$/;
                if (!reg.test(this.unloadingTonnage)) {
                    this.$vux.toast.text('无效的卸货吨位！', 'middle');
                    return false;
                }
            }
            //应收货主运费必填
            if(this.classify != '0'){
                if (this.isEmptyStr(this.updw_freight)) {
                    this.$vux.toast.text('应收货主运费必填！', 'middle');
                    return false;
                } else {
                    let reg = /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/;
                    if (!reg.test(this.updw_freight) || Number(this.updw_freight) == 0) {
                        this.$vux.toast.text('无效的应收货主运费！', 'middle');
                        return false;
                    }
                }
            }

            //运费金额必填
            if (!this.isEmptyStr(this.allFreight)) {
                let regExp = /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/;
                if (!regExp.test(this.allFreight) || Number(this.allFreight) == 0) {
                    this.$vux.toast.text('无效的运费金额！', 'middle');
                    return false;
                }
                if (Number(this.allFreight) > Number(this.dazongFirst.maxAllFreight)) {
                    this.$vux.toast.text('运费金额不能超过最大金额！', 'middle');
                    return false;
                }
            } else {
                this.$vux.toast.text('运费金额必填！', 'middle');
                return false;
            }

            //预付和回单付的值判断
            if (!this.isEmptyStr(this.prepayments)) {
                let regExp = /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/;
                if (!regExp.test(this.prepayments)) {
                    this.$vux.alert.show({
                        title: '提示',
                        content: '无效的预付现金！'
                    });
                    return false;
                }
                if (!this.isEmptyStr(this.allFreight)) {
                    if (Number(this.prepayments) > Number(this.allFreight)) {
                        this.$vux.alert.show({
                            title: '提示',
                            content: '预付现金不能超过运费金额！'
                        });
                        return false;
                    }
                }
                if (Number(this.prepayments) > Number(this.dazongFirst.maxAllFreight)) {
                    this.$vux.alert.show({
                        title: '提示',
                        content: '预付现金不能超过最大金额！'
                    });
                    return false;
                }
            }
            if (
                !this.isEmptyStr(this.dazongFirst.startProvinceCode) &&
                !this.isEmptyStr(this.dazongFirst.endProvinceCode) &&
                !this.isEmptyStr(this.dazongFirst.startCityCode) &&
                !this.isEmptyStr(this.dazongFirst.endCityCode) &&
                !this.isEmptyStr(this.allFreight)
            ) {
                //建单运费判断
                if (!this.successFlag) {
                    return false;
                }
                this.checkFee();
            }
        },
        //检查运费
        checkFee() {
            var _this = this;
            this.$store.commit('updateLoadingStatus', { isLoading: true });
            this.successFlag = 0;
            var json = {
                fromProvId: this.dazongFirst.startProvinceCode, //起运省份ID
                toProvId: this.dazongFirst.endProvinceCode, //目的省份ID
                fromCityId: this.dazongFirst.startCityCode, //起运城市ID
                toCityId: this.dazongFirst.endCityCode, //目的城市ID
                allFreight: this.allFreight //运输总价
            };
            checkFee(json).then(res => {
                if (res.data.reCode == '0') {
                    if(this.reciveMsgPay.reciveBank[0] == '好运宝收款'){
                        _this.gotToBuild();
                    }else{
                        _this.informationEntry();
                    }
                } else {
                    this.$store.commit('updateLoadingStatus', { isLoading: false });
                    this.disabled = false;
                    this.successFlag = 1;
                    if (res.data.reCode == '1') {
                        //走confirm
                        this.$vux1.confirm.show({
                            title: '提示',
                            content: res.data.reInfo,
                            confirmText: '确认',
                            cancelText: '取消',
                            onConfirm: () => {
                                //点击确定去建单
                                if(this.reciveMsgPay.reciveBank[0] == '好运宝收款'){
                                    _this.gotToBuild();
                                }else{
                                    _this.informationEntry();
                                }
                            }
                        });
                    } else {
                        this.$vux.toast.text('抱歉,您录入的数据不合法,请核实后重试！', 'middle');
                    }
                }
            }).catch(err => {
                this.successFlag = 1;
                this.$store.commit('updateLoadingStatus', { isLoading: false });
                this.disabled = false;
            });
        },
        //收款人信息录入
        informationEntry() {
            let payBankName;
            if (this.reciveMsgPay.reciveBank.length == 0) {
                payBankName = '';
            } else {
                payBankName = this.reciveMsgPay.reciveBank[0];
            }
            let jsons = {
                mobileNo: this.weyBillSecond.mobileNo,
                payeeBankNo: window.sessionStorage.isChooseType === '1' ? this.reciveMsgPay.recivePersonBankNum : '', //收款人银行卡号
                payeeName: window.sessionStorage.isChooseType === '1' ? this.reciveMsgPay.recivePersonName : '', //收款人姓名
                payeeBankName: window.sessionStorage.isChooseType === '1' ? payBankName : '', //收款银行名称
                payeeProvinceId: window.sessionStorage.isChooseType === '1' ? this.reciveMsgPay.reciveBankAdress[0] : '', //开户行省份
                payeeCityId: window.sessionStorage.isChooseType === '1' ? this.reciveMsgPay.reciveBankAdress[1] : '', //开户行城市
                payeeIdCard: window.sessionStorage.isChooseType === '1' ? this.reciveMsgPay.recivePersonCardNum : '', //收款人身份证
                payeeMobileNo: window.sessionStorage.isChooseType === '1' ? this.reciveMsgPay.recivePersonphoneNum : '', //收款人手机号
                alipayNo: window.sessionStorage.isChooseType === '1' ? this.reciveMsgPay.alipayNo : '' //收款人支付宝
            };
            console.log(jsons);
            if (
                jsons.mobileNo != '' &&
                jsons.payeeBankNo != '' &&
                jsons.payeeName != '' &&
                jsons.payeeBankName != '' &&
                jsons.payeeProvinceId != '' &&
                jsons.payeeCityId != '' &&
                jsons.payeeIdCard != '' &&
                jsons.payeeMobileNo != ''
            ) {
                this.$store.commit('updateLoadingStatus', { isLoading: true });
                infoEntry(jsons).then(res => {
                    // this.$store.commit("updateLoadingStatus", { isLoading: false });
                    this.gotToBuild();
                }).catch(err => {
                    this.$store.commit('updateLoadingStatus', { isLoading: false });
                    this.disabled = false;
                    this.$vux.toast.text(err.message, 'middle');
                    this.successFlag = 1;
                });
            } else {
                this.gotToBuild();
            }
        },
        //建单接口
        gotToBuild() {
            let transTrip, startTime;
            if (this.dazongFirst.billCycleMode != 8) {
                transTrip = '';
            } else {
                transTrip = this.dazongFirst.transTrip;
            }
            if (this.dazongFirst.startTime.length == 0) {
                startTime = '';
            } else {
                startTime = this.dazongFirst.startTime.replace(/\//g, '-');
            }
            let shoukuanrenleixing = '';
            if (window.sessionStorage.isChooseType === '1') {
                shoukuanrenleixing = this.reciveMsgPay.reciveType;
            } else {
                shoukuanrenleixing = '';
            }
            let json = {
                cityId: window.sessionStorage.isChooseType === '1' ? this.reciveMsgPay.reciveBankAdress[1] : '', //开户行城市
                allFreight: this.allFreight, //运费
                endProvinceId: this.dazongFirst.endProvinceCode,
                payType: shoukuanrenleixing, //正常的收款人类型
                alipayNo: window.sessionStorage.isChooseType === '1' ? this.reciveMsgPay.alipayNo : '', //收款人支付宝账号
                payIdCard: window.sessionStorage.isChooseType === '1' ? this.reciveMsgPay.recivePersonCardNum : '', //收款人身份证
                hkbPayeeType: '0', //回款宝收款人类型
                startTime: this.dazongFirst.startTime, //起运时间
                transTrip: transTrip, //运输趟次
                payBankNo: window.sessionStorage.isChooseType === '1' ? this.reciveMsgPay.recivePersonBankNum : '', //收款人银行卡号
                cartBadgeNo: this.weyBillSecond.cartBadgeNo, //司机车牌号
                goodsName: this.dazongFirst.goodsName, //货物名称
                goodsAmountType: '0',
                payName: window.sessionStorage.isChooseType === '1' ? this.reciveMsgPay.recivePersonName : '', //收款人姓名
                startCountyId: this.dazongFirst.startCountyCode,
                unitPrice: this.unitPrice, //运输单价
                endCityId: this.dazongFirst.endCityCode,
                wbItem: this.dazongFirst.wbItem, //业务项目
                startProvinceId: this.dazongFirst.startProvinceCode,
                mobileNo: this.weyBillSecond.mobileNo, //司机手机号
                payBankName: window.sessionStorage.isChooseType === '1' ? this.reciveMsgPay.reciveBank[0] : '', //收款银行名称
                provinceId: window.sessionStorage.isChooseType === '1' ? this.reciveMsgPay.reciveBankAdress[0] : '', //开户行省份
                endCountyId: this.dazongFirst.endCountyCode,
                startCityId: this.dazongFirst.startCityCode,
                payMobileNo: window.sessionStorage.isChooseType === '1' ? this.reciveMsgPay.recivePersonphoneNum : '', //收款人手机号
                driverName: this.weyBillSecond.driverName, //司机姓名
                prepayments: this.prepayments,
                unloadingTonnage: this.unloadingTonnage,
                loadingTonnage: this.loadingTonnage,
                loadingAddressName: this.dazongFirst.loadingAddressName,
                unloadingAddressName: this.dazongFirst.unloadingAddressName,
                updw_orgid: this.dazongFirst.orgId,
                updw_freight: this.classify == '0' ? '': this.updw_freight,
                transportLineId: this.dazongFirst.transportLineId,
                wbMode:this.classify == '0' ? '0' :'1',
                tripFlag:this.dazongFirst.tripFlag
            };
            console.log(json);
            this.$store.commit('updateLoadingStatus', { isLoading: true });
            dazongBuildWaybill(json).then(res => {
                this.$store.commit('updateLoadingStatus', { isLoading: false });
                if (res.data.reCode == 0) {
                    // this.$vux.toast.text(res.data.reInfo, 'middle');
                    window.localStorage.clear();
                    // setTimeout(() => {
                    //     //建单成功返回主页
                    //     let json = {
                    //         selectedIndex: '0',
                    //         subIndex: '0'
                    //     };
                    //     if (this.$sysType === 1) {
                    //         // android写法
                    //         AndroidWaybillJs.jumpIndex(JSON.stringify(json));
                    //     } else if (this.$sysType === 2) {
                    //         // ios写法
                    //         window.webkit.messageHandlers.jumpIndex.postMessage(JSON.stringify(json));
                    //     } else {
                    //         AppFinish(-3);
                    //     }
                    //     //   AppFinish(-1);
                    //     this.successFlag = 1;
                    // }, 1000);
                    let taxWaybillId = res.data.result.taxWaybillId
                    this.successFlag = 1;
                    this.$router.push({
                        path: '/wayBillSuccess',
                        query: {
                            taxWaybillId: taxWaybillId,
                            mobileNo:this.weyBillSecond.mobileNo,
                            driverName:this.weyBillSecond.driverName,
                            cartBadgeNo:this.weyBillSecond.cartBadgeNo,
                            dazongState:'1'
                        }
                    });
                } else {
                    this.$vux.alert.show({
                        title: '提示',
                        buttonText: '知道了',
                        content: res.data.reInfo
                    });
                    this.successFlag = 1;
                    this.disabled = false;
                }
            }).catch(err => {
                console.log(err);
                this.$vux.toast.text(err, 'middle');
                this.$store.commit('updateLoadingStatus', { isLoading: false });
                this.disabled = false;
                this.successFlag = 1;
            });
        },
        calculate(){
            let temp = Number(this.unitPrice) * Number(this.unloadingTonnage);
            if (isNaN(temp) || temp < 0) {
                this.allFreight = '0.00';
            } else {
                this.allFreight = temp.toFixed(2);
            }
        },
        //非空验证通用方法
        isEmptyStr: function(str) {
            var pat = /^[\s]*$/;
            if (undefined == str || '' == str || null == str || pat.test(str)) {
                return true;
            }
            return false;
        },
    },
}
</script>
<style lang="less">
.bigcompre-settlement-info{
    input[type='number']::-webkit-inner-spin-button,
    input[type='number']::-webkit-outer-spin-button {
        -webkit-appearance: none;
        appearance: none;
        margin: 0;
    }
    width: 100%;
    text-align: left;
    background-color: #efefef;
    position: absolute;
    top: 0px;
    min-height: 100%;
    height: auto;
    .button {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        background: #fff;
        z-index: 10;
    }
    .weui-btn_primary {
        background-color: #15499a !important;
        margin: 10px auto;
        width: 90% !important;
    }
    .img{
        width:8px;
        height:8px;
    }
    .weui-cell:before {
        left:0;
    }
    .weui-cell {
        color: #202020;
        .weui-cell__ft {
            word-break: break-all;
            color: #202020;
            // -webkit-box-flex: 1;
            // -webkit-flex: 1;
            // flex: 1;
            // .huosun{
            //     width: 100%;
            // }
        }
    }
}
</style>
