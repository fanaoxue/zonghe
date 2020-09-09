<template>
    <div class="web-recive-msg3">
        <c-header>
            <x-header :left-options="{ backText: '' }">收款人信息</x-header>
        </c-header>
        <group label-width="6.5em" label-margin-right="0.2em" label-align="right">
            <x-input title="司机姓名：" v-model="driverName" value-align="left" placeholder="请输入司机姓名">
                <div slot="label" style="text-align:right;width:6.5em;">
                    <img :src="bitian" alt width="8" height="8" style="font-size:20px;vertical-align:middle;" class="img1" />
                    <span style="vertical-align:middle;">司机姓名：</span>
                </div>
            </x-input>
            <x-input title="支付宝账号：" v-model.trim="alipayNo" placeholder="请输入支付宝账号">
                <!-- :disabled="!buttonShow" -->
                <div slot="label" style="text-align:right;width:7.5em;">
                    <img :src="bitian" alt width="8" height="8" style="font-size:20px;vertical-align:middle;" class="img1" />
                    <span style="vertical-align:middle;">支付宝账号：</span>
                </div>
            </x-input>
            <popup-picker title="银行名称：" :data="bankList" v-model="bankName" placeholder="请选择收款银行">
                <template slot="title" slot-scope="props">
                    <span :class="props.labelClass" :style="props.labelStyle" style="height:24px;">
                        <img :src="bitian" alt width="8" height="8" class="img1" style="font-size:20px;vertical-align:middle;" />
                        <span style="vertical-align:middle;">银行名称：</span>
                    </span>
                </template>
            </popup-picker>
            <x-input title="银 行 卡 号：" v-model.trim="bankNum" placeholder="请输入银行卡号" @on-blur="bankListAjax()">
                <div slot="label" style="text-align:right;width:6.5em;">
                    <img :src="bitian" alt width="8" height="8" style="font-size:20px;vertical-align:middle;" class="img1" />
                    <span style="vertical-align:middle;">银行卡号：</span>
                </div>
            </x-input>
            <div class="vux-x-input weui-cell cell-before">
                <div class="what_alipay" @click="alipay(1)"><img :src="wenhao" alt width="15px" />什么是支付宝账号？</div>
                <div class="down_alipay" @click="alipay(2)" v-show="downState">下载支付宝</div>
            </div>
        </group>
        <div class="footer">
            <x-button type="primary" class="save" @click.native="save()">保存</x-button>
        </div>
        <div v-transfer-dom>
            <popup v-model="show" is-transparent>
                <div style="width:80%;height:70%;margin:0 auto;text-align:center;">
                    <img :src="zhifubaomoren" alt width="100%" v-show="show_img1" />
                    <div class="qrcode-box" v-show="show_img2">
                        <qrcode :value="download_zhifubao" type="img" :size="100"></qrcode>
                    </div>
                    <img :src="chacha" alt width="25px" @click="show = false" />
                </div>
            </popup>
        </div>
        <div v-transfer-dom>
            <confirm v-model="dial" title="提示" cancelText="取消" confirmText="确定" @on-cancel="onCancel" @on-confirm="onConfirm">
                <p style="text-align:center;">绑定异常，请联系</p>
                <p style="text-align:center;">
                    <span>4001660056</span>
                    <img src="../../assets/imgs/wbs/dianhua_icon@2x.png" alt width="20" style="    vertical-align: middle;" @click="dialPhone()" />
                </p>
            </confirm>
        </div>
    </div>
</template>
<script>
import { Qrcode } from 'vux';
import { getHkbBankList, yanzhenFourElement, getAlipayQRcode } from '../../api/api.js';
import { getBankName } from '../../api/applyPay.js';
import { AppGotoTell } from '../../utils/app.js';
export default {
    name: 'webReceiveMsg2',
    components: {
        Qrcode
    },
    data() {
        return {
            wenhao: require('../../assets/imgs/wbs/yiwen_icon@2x.png'),
            bitian: require('../../assets/imgs/wbs/bitian_icon@2x.png'),
            chacha: require('../../assets/imgs/wbs/chacha@2x.png'),
            zhifubaomoren: '', //默认没有图
            zhifubao_img: require('../../assets/imgs/wbs/zhifubao_img@2x.png'),
            download_zhifubao: '', //下载支付宝的二维码
            // buttonShow: true, //按钮默认展示
            zyCapitalCfg: '', // 回款宝配置
            bankList: [], //默认携带所有银行的数据
            driverName: '', //司机姓名
            mobileNo: '', //司机手机号
            // cartBadgeNo: "", //车牌号
            alipayNo: '', //支付宝账号
            bankNum: '', //银行卡号
            bankName: [], //银行名称
            getBankListFlag: 0, //控制次数
            show: false,
            downState: true, //默认展示支付宝下载文字
            show_img1: true,
            show_img2: true,
            dial: false
        };
    },
    created() {
        //进页面的时候，返回存储的数据
        // this.driverName = this.reciveMsgPay1.driverName;
        // if (this.reciveMsgPay1.bankName == "") {
        //   this.bankName = [];
        // } else {
        //   this.bankName = this.reciveMsgPay1.bankName;
        // }
        // this.bankNum = this.reciveMsgPay1.bankNum;
        // this.alipayNo = this.reciveMsgPay1.alipayNo;
    },
    beforeRouteEnter(to, from, next) {
        // 已知没有这种情况了
        // if(from.name == 'settlementInfo'){
        //     next((vm)=>{
        //         vm.cartBadgeNo = vm.weyBillSecond.cartBadgeNo; //携带过来的车牌号
        //         vm.mobileNo = vm.weyBillSecond.mobileNo; //携带过来的司机手机号
        //         vm.driverName = vm.weyBillSecond.driverName;
        //         if(window.sessionStorage.isChooseType !== '2'){
        //             //先清空，再赋值
        //             vm.bankName.length = 0;
        //             vm.alipayNo = vm.weyBillSecond.alipayNo;
        //             if(vm.weyBillSecond.payBankName != ''){
        //                 vm.bankName[0] = vm.weyBillSecond.payBankName;
        //             }
        //             vm.bankNum = vm.weyBillSecond.payBankNo;
        //         }
        //         if(vm.alipayNo != "" && vm.alipayNo != undefined && vm.bankName[0] != "" && vm.bankName[0] != undefined && vm.bankNum != "" && vm.bankNum != undefined){
        //             vm.buttonShow = false; //如果有值，则不可修改，且按钮消失
        //         }
        //     })
        // }else if(from.name == 'modifyWaybill'){
        //     next((v) => {
        //         v.driverName = v.$route.query.payName
        //         v.mobileNo = v.$route.query.mobileNo
        //         v.cartBadgeNo = v.$route.query.cartBadgeNo
        //         if(v.$route.query.isModifyElements == '1'){
        //             v.buttonShow = false; //如果有值，则不可修改，且按钮消失
        //             v.alipayNo = v.$route.query.alipayNo;
        //             v.bankName[0] = v.$route.query.payBankName;
        //             v.bankNum = v.$route.query.payBankNo;
        //         }else{
        //             if(window.sessionStorage.isChooseType === '2'){
        //                 v.driverName = v.reciveMsgPay1.driverName;
        //                 v.bankName[0] = window.localStorage.getItem("bankName")
        //                 v.bankNum = v.reciveMsgPay1.bankNum;
        //                 v.alipayNo = v.reciveMsgPay1.alipayNo;
        //                 v.buttonShow = false;
        //             }else{
        //                  //先清空，再赋值
        //                 v.bankName.length = 0;
        //                 v.bankNum = '';
        //                 v.alipayNo = '';
        //             }
        //         }
        //     })
        // }else
        if (from.name == 'alipayQRcode') {
            next(v => {
                //进页面的时候，返回存储的数据
                v.mobileNo = window.localStorage.getItem('mobileNo');
                // v.cartBadgeNo = window.localStorage.getItem("cartBadgeNo");
                v.driverName = v.reciveMsgPay1.driverName;
                v.bankName = v.reciveMsgPay1.bankName;
                v.bankNum = v.reciveMsgPay1.bankNum;
                v.alipayNo = v.reciveMsgPay1.alipayNo;
                window.localStorage.removeItem('mobileNo');
                // window.removeItem("cartBadgeNo");
            });
        } else {
            next(v => {
                v.bankName.length = 0;
                // v.driverName = v.$route.query.payName
                v.mobileNo = v.$route.query.mobileNo;
                // v.cartBadgeNo = v.$route.query.cartBadgeNo;
                // if(v.$route.query.isModifyElements == '1'){
                //     v.buttonShow = false; //如果有值，则不可修改，且按钮消失
                //     v.driverName = v.$route.query.payName;
                //     v.alipayNo = v.$route.query.alipayNo;
                //     v.bankName[0] = v.$route.query.payBankName;
                //     v.bankNum = v.$route.query.payBankNo;
                // }
                // if(window.sessionStorage.isChooseType === '2'){
                //     v.driverName = v.reciveMsgPay1.driverName;
                //     v.bankName[0] = window.localStorage.getItem("bankName")
                //     v.bankNum = v.reciveMsgPay1.bankNum;
                //     v.alipayNo = v.reciveMsgPay1.alipayNo;
                //     v.buttonShow = false;
                // }
            });
        }
        next();
    },
    beforeRouteLeave(to, from, next) {
        if (to.name == 'alipayQRcode') {
            window.localStorage.setItem('mobileNo', this.mobileNo);
            // window.localStorage.setItem("cartBadgeNo", this.cartBadgeNo);
        }
        // if (window.sessionStorage.isChooseType === "2") {
        //   window.localStorage.setItem("driverName", this.driverName);
        //   window.localStorage.setItem("alipayNo", this.alipayNo);
        //   window.localStorage.setItem("bankName", this.bankName);
        //   window.localStorage.setItem("bankNum", this.bankNum);
        // } else {
        //   // window.localStorage.setItem("driverName",this.driverName);
        // }
        let obj = {
            driverName: this.driverName, // 收款人姓名
            bankNum: this.bankNum, // 收款人银行卡号
            bankName: this.bankName, // 收款人银行名称
            alipayNo: this.alipayNo // 支付宝账号
        };
        let updateOpions = {
            type: 'reciveMsgPay1',
            updatMsg: obj
        };
        this.$store.commit('updateWayBillStatus', updateOpions);
        next();
    },
    computed: {
        // weyBillSecond() {
        //   return this.$store.state.wayBill.weyBillSecond;
        // },
        reciveMsgPay1() {
            return this.$store.state.wayBill.reciveMsgPay1;
        }
    },
    mounted() {
        this.$nextTick(() => {
            getHkbBankList()
                .then(res => {
                    // 9002
                    this.$store.commit('updateLoadingStatus', { isLoading: false });
                    if (res.data.reCode === '0') {
                        let bankList1 = res.data.result.data.map(item => {
                            return item.bankName;
                        });
                        this.bankList.push(bankList1);
                    }
                    this.getAlipayCode();
                })
                .catch(err => {
                    this.$store.commit('updateLoadingStatus', { isLoading: false });
                });
        });
    },
    methods: {
        //点击按钮保存->判断四要素
        save() {
            //司机姓名
            if (this.isEmptyStr(this.driverName)) {
                this.$vux.toast.text('司机姓名不能为空！', 'middle');
                return false;
            }
            //支付宝规则
            if (this.isEmptyStr(this.alipayNo)) {
                this.$vux.toast.text('支付宝账号不能为空！', 'middle');
                return false;
            }
            //银行名称规则
            if (!(this.bankName.length > 0)) {
                this.$vux.toast.text('银行名称不能为空！', 'middle');
                return false;
            }
            //银行卡号规则
            if (this.isEmptyStr(this.bankNum)) {
                this.$vux.toast.text('银行卡号不能为空！', 'middle');
                return false;
            }
            //点击【保存】按钮，会根据网商银行的验证接口，在当前页弹窗提示用户，成功提示什么？错误提示语根据接口返回进行展示
            this.yanzhenFourElement();
        },
        //打电话方法
        dialPhone() {
            this.dial = false;
            let mobileNo = '4001660056';
            this.$vux1.confirm.show({
                title: '拨打电话',
                content: `<p style='text-align:left'>确认拨打：</p><p style='color:#FFBA00;text-align:left'>` + mobileNo + `</p>`,
                confirmText: '确认',
                cancelText: '取消',
                onConfirm: () => {
                    //调用客户端的拨打电话功能
                    try {
                        MtaH5.clickStat('waybillinfo_dialsure');
                    } catch (error) {
                        JSON.stringify(error);
                    }
                    AppGotoTell(mobileNo);
                }
            });
        },
        onCancel() {},
        onConfirm() {},
        yanzhenFourElement() {
            getBankName(this.bankNum)
                .then(res => {
                    //9000
                    this.$store.commit('updateLoadingStatus', { isLoading: false });
                    if (res.data.reCode === '0') {
                        var bankArr = res.data.result;
                        if (this.bankName[0] !== bankArr) {
                            this.$vux.toast.text('您输入银行卡号与银行名称不一致，核实后重新输入！', 'middle');
                            return false;
                        }
                    }
                    let json = {
                        driverName: this.driverName,
                        mobileNo: this.mobileNo,
                        payBankName: this.bankName[0],
                        payBankNo: this.bankNum,
                        alipayNo: this.alipayNo,
                        // cartBadgeNo: this.cartBadgeNo,
                        gatheringType: '1' //0：支付宝 1：银行卡
                    };
                    this.$store.commit('updateLoadingStatus', { isLoading: true });
                    yanzhenFourElement(json)
                        .then(res => {
                            //3059
                            this.$store.commit('updateLoadingStatus', { isLoading: false });
                            var _this = this;
                            if (res.data.reCode === '0') {
                                _this.$vux1.confirm.show({
                                    //绑定成功,恭喜您获得10元奖励金可在【个人中心-回款宝推荐奖励】中查看
                                    title: '提示',
                                    content: `您已帮助司机${this.driverName}开通了好运宝收款`,
                                    confirmText: '知道了',
                                    showCancelButton: false,
                                    onConfirm: () => {
                                        let obj = {
                                            driverName: this.driverName, // 收款人姓名
                                            bankNum: this.bankNum, // 收款人银行卡号
                                            bankName: this.bankName, // 收款人银行名称
                                            alipayNo: this.alipayNo // 支付宝账号
                                        };
                                        let updateOpions = {
                                            type: 'reciveMsgPay1',
                                            updatMsg: obj
                                        };
                                        this.$store.commit('updateWayBillStatus', updateOpions);
                                        window.sessionStorage.isChooseType = '2'; //给个保存成功的标志
                                        this.$router.go(-1); //返回上一页，并携带名字
                                    }
                                });
                            } else if (res.data.reCode == '11') {
                                //电话弹框弹起
                                this.dial = true;
                            } else {
                                //5,6,7,8,9,10
                                this.$vux.alert.show({
                                    title: '提示',
                                    content: res.data.reInfo
                                });
                            }
                        })
                        .catch(err => {
                            this.$store.commit('updateLoadingStatus', { isLoading: false });
                            this.$vux.toast.text(err.message, 'middle');
                        });
                })
                .catch(err => {
                    this.$store.commit('updateLoadingStatus', { isLoading: false });
                    this.$vux.toast.text(err.message, 'middle');
                });
        },
        // 用户输入银行卡号是查询开户行名称
        bankListAjax() {
            if (this.bankNum.length < 11) return false;
            this.$store.commit('updateLoadingStatus', { isLoading: true });
            getBankName(this.bankNum)
                .then(res => {
                    //9000
                    this.$store.commit('updateLoadingStatus', { isLoading: false });
                    if (res.data.reCode === '0') {
                        this.bankName = [];
                        this.bankName.push(res.data.result);
                    }
                })
                .catch(err => {
                    this.$store.commit('updateLoadingStatus', { isLoading: false });
                    this.$vux.toast.text(err.message, 'middle');
                });
        },
        //获取支付宝二维码
        getAlipayCode() {
            getAlipayQRcode()
                .then(res => {
                    //3061
                    if (res.data.reCode == '0') {
                        this.download_zhifubao = res.data.result.hkb_h5_url;
                    } else {
                        this.downState = false;
                    }
                })
                .catch(err => {
                    this.$store.commit('updateLoadingStatus', { isLoading: false });
                    this.$vux.toast.text(err.message, 'middle');
                });
        },
        //支付宝图片相关方法
        alipay(item) {
            if (item == '1') {
                this.zhifubaomoren = this.zhifubao_img;
                this.show_img1 = true; //展示支付宝
                this.show_img2 = false;
                this.show = true;
            } else {
                // this.show_img1 = false;
                // this.show_img2 = true; //展示二维码
                this.$router.push({
                    path: '/alipayQRcode'
                });
            }
        },
        //非空验证通用方法
        isEmptyStr: function(str) {
            var pat = /^[\s]*$/;
            if (undefined == str || '' == str || null == str || pat.test(str)) {
                return true;
            }
            return false;
        }
    }
};
</script>
<style lang="less">
.web-recive-msg3 {
    width: 100%;
    background-color: #efefef;
    position: absolute;
    top: 0px;
    min-height: 100%;
    height: auto;
    .img1 {
        width: 8px;
        height: 8px;
    }
    .weui-cell__ft {
        color: #202020;
    }
    .weui-btn_primary {
        background-color: #15499a;
        color: #fff;
    }
    .footer {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        background: #fff;
        padding: 10px 0px;
        .save {
            width: 90%;
        }
    }
    .vux-popup-picker-select {
        text-align: left !important;
        .vux-popup-picker-placeholder {
            color: #9f9f9f;
        }
    }
    .weui-cell {
        .what_alipay {
            width: 60%;
            text-align: left;
            color: #ff3333;
            img {
                margin-right: 4px;
            }
        }
        .down_alipay {
            width: 40%;
            text-align: right;
            color: #1581cf;
            text-decoration: underline;
        }
    }
    .vux-x-input.disabled .weui-input {
        -webkit-text-fill-color: #202020;
    }
    .qrcode-box {
        text-align: center;
        font-family: PingFang-SC-Medium;
        font-weight: bold;
        color: rgba(32, 32, 32, 1);
        font-size: 0.75rem;
        flex: auto;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
    }
}
</style>
