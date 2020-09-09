<template>
    <div class="add-oil-card">
        <c-header>
            <x-header :left-options="{ backText: '' }">绑定油卡</x-header>
        </c-header>
        <span v-show="show1 == true">
            <group>
                <div class="search-ipt-cxt">
                    <div class="search-ipt-style">
                        <img src="../../assets/imgs/wbs/sousuo_icon@2x.png" alt="" />
                        <x-input title="" placeholder="请输入卡号后四位" v-model="condition"></x-input>
                    </div>
                    <div class="search-control-btn" @click="searchBtn()">搜索</div>
                </div>
            </group>
            <div>
                <div class="default" v-show="arrayList.length == 0">
                    <img :src="srcStatic" alt="" width="100" />
                    <p>当前企业无可用油卡记录！</p>
                    <p>请联系快路宝客服开卡</p>
                </div>
            </div>
            <div class="card" v-show="!(arrayList.length == 0 && searchList.length == 0)">
                <span v-show="arrayList.length != 0 && searchList.length == 0 && noInfo == false">
                    <div
                        v-for="(item, val) in arrayList"
                        :key="val"
                        class="card-box"
                        :class="item.oilBgType == '2' || item.oilBgType == '3' ? 'card2' : 'card1'"
                    >
                        <div class="left">
                            <div>{{ item.oilTypeName }}</div>
                            <div class="cardNum">{{ item.oilCardNo }}</div>
                            <p class="money">
                                ￥<span>{{ item.preOilBalance }}</span
                                >余额
                            </p>
                            <div v-show="item.isBind == '0'" class="info">
                                <div>车牌号码：{{ item.driverCarNo }}</div>
                                <div>司机姓名：{{ item.driverName }}</div>
                                <a @click="phoneCall(item.oilMobile)" class="phone-call"
                                    >电话号码：{{ item.oilMobile }}<img v-show="item.oilMobile" src="../../assets/imgs/wbs/dianhua_icon@2x.png"
                                /></a>
                            </div>
                        </div>
                        <div class="right">
                            <x-button type="primary" :mini="true" @click.native="bindCardConfirm(val, item.oilTypeName, item.oilCardNo, item)">绑定</x-button>
                        </div>
                        <img :src="[item.isBind == '-1' ? src1 : src2]" alt="" class="img" />
                    </div>
                </span>
                <span v-show="searchList.length != 0">
                    <div
                        v-for="(item, val) in searchList"
                        :key="val"
                        class="card-box"
                        :class="item.oilBgType == '2' || item.oilBgType == '3' ? 'card2' : 'card1'"
                    >
                        <div class="left">
                            <div>{{ item.oilTypeName }}</div>
                            <div class="cardNum">{{ item.oilCardNo }}</div>
                            <p class="money">
                                ￥<span>{{ item.preOilBalance }}</span
                                >余额
                            </p>
                            <div v-show="item.isBind == '0'">
                                <div>车牌号码：{{ item.driverCarNo }}</div>
                                <div>司机姓名：{{ item.driverName }}</div>
                                <a @click="phoneCall(item.oilMobile)" class="phone-call"
                                    >电话号码：{{ item.oilMobile }}<img v-show="item.oilMobile" src="../../assets/imgs/wbs/dianhua_icon@2x.png"
                                /></a>
                            </div>
                        </div>
                        <div class="right">
                            <x-button type="primary" :mini="true" @click.native="bindCardConfirm(val, item.oilTypeName, item.oilCardNo, item)">绑定</x-button>
                        </div>
                        <img :src="[item.isBind == '-1' ? src1 : src2]" alt="" class="img" />
                    </div>
                </span>
                <span v-show="noInfo == true">
                    <div class="default">
                        <img :src="srcStatic" alt="" width="100" />
                        <p>未搜索到匹配的油卡</p>
                    </div>
                </span>
            </div>
        </span>
        <!-- <div v-transfer-dom>
            <confirm
            v-model="show"
            title="确认绑定"
            cancel-text="取消"
            confirm-text="确认"
            @on-cancel="onCancel"
            @on-confirm="onConfirm(index)">
                <p style="text-align:left;color:#FFBA00;">{{oilName}}</p>
                <p style="text-align:left;color:#454545;">卡号：{{cardNo}}</p>
            </confirm>
        </div> -->
    </div>
</template>
<script>
import { newAddOilCard, bindOilCard } from '../../api/apiOil.js';
import { AppGotoTell } from '../../utils/app.js';
export default {
    name: 'addOilCard',
    data() {
        return {
            show1: false, //页面默认不展示
            show: false, //点击绑定的弹框状态
            condition: '', //搜索内容
            belongActSys: this.$route.query.belongActSys, //路由传来的所属账户体系
            prepaymentsOilCard: this.$route.query.prepaymentsOilCard, //预付油卡金额
            cartBadgeNo: this.$route.query.cartBadgeNo, //车牌号
            driverName: this.$route.query.driverName, //司机姓名
            mobileNo: this.$route.query.mobileNo, //司机手机号
            arrayList: [],
            searchList: [], //搜索的集合
            oilName: '', //弹框的卡名字
            cardNo: '', //弹框的卡号
            noInfo: false,

            index: '', //点击绑定的索引

            srcStatic: require('../../assets/imgs/wbs/youkajilu_icon@2x.png'), //没有油卡的背景图
            src1: require('../../assets/imgs/wbs/weibangding_img@2x.png'), //未绑定的图片
            src2: require('../../assets/imgs/wbs/yibangding_img@2x.png'), //已绑定的图片
            chooseOilCardItem: {} //已经选择的油卡
        };
    },
    beforeRouteLeave(to, from, next) {
        window.localStorage.setItem('cartBadgeNo', this.cartBadgeNo);
        window.localStorage.setItem('driverName', this.driverName);
        window.localStorage.setItem('mobileNo', this.mobileNo);
        if (to.name == 'modifyWaybill' || to.name == 'settlementInfo' || to.name == 'wbsApplyPay' || to.name == 'bigCompareModifyWaybill') {
            let updateOpions = {
                type: 'chooseOilCardItem',
                updatMsg: this.chooseOilCardItem
            };
            this.$store.commit('updateOildCardStatus', updateOpions);
        }
        next();
    },
    watch: {
        condition() {
            if (this.condition == '') {
                this.searchList = [];
                this.noInfo = false;
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.dataInit();
        });
    },
    methods: {
        phoneCall(oilMobile) {
            // if(oilMobile){
            //   window.location.href = `tel://${oilMobile}`
            // }
            if (oilMobile) {
                AppGotoTell(oilMobile);
            }
        },
        //页面数据初始化
        dataInit() {
            //新增油卡接口--16002
            this.$store.commit('updateLoadingStatus', { isLoading: true });
            newAddOilCard(this.prepaymentsOilCard, this.cartBadgeNo, this.belongActSys)
                .then(res => {
                    this.$store.commit('updateLoadingStatus', { isLoading: false });
                    if (res.data.reCode === '0') {
                        this.arrayList = res.data.result.list;
                    } else {
                        this.$vux.alert.show({
                            title: '提示',
                            buttonText: '知道了',
                            content: res.data.reInfo
                        });
                    }
                    this.show1 = true;
                })
                .catch(err => {
                    this.$store.commit('updateLoadingStatus', { isLoading: false });
                    this.show1 = true;
                    console.log(JSON.stringify(err));
                });
        },
        bindCardConfirm(index, item1, item2, item) {
            if (item.isBind == '0') {
                this.$vux1.confirm.show({
                    title: `确认绑定`,
                    content: `<div style="text-align:left;"><p style='color:#454545;line-height:150%;'><span style="font-weight:bold;">${item1}</span></br>卡号：${item2}</p><p style='color:#454545;line-height:150%;font-family:PingFang-SC-Medium;color:rgba(255,186,0,1);margin-top:4px;'>确认解除之前与"${item.driverName}，${item.driverCarNo}"的绑定关系？</p></div>`,
                    confirmText: '确认',
                    cancelText: '取消',
                    onConfirm: () => {
                        this.bindCard(index, item1, item2, item);
                    },
                    onCancel: () => {}
                });
            } else {
                this.bindCard(index, item1, item2, item);
            }
        },
        //绑定油卡
        bindCard(index, item1, item2, item) {
            try {
                MtaH5.clickStat('addoilcard_bind');
            } catch (error) {
                JSON.stringify(error);
            }
            this.index = index;
            this.oilName = item1;
            this.cardNo = item2;
            // this.show = true;
            this.chooseOilCardItem = item;
            this.onConfirm(this.index);
        },
        //搜索功能--最少后四位才能查询
        searchBtn() {
            try {
                MtaH5.clickStat('addoilcard_search');
            } catch (error) {
                JSON.stringify(error);
            }
            let reg = /^[0-9]+$/;
            if (this.condition != '' && !reg.test(this.condition)) {
                this.$vux.toast.text('请输入数字', 'middle');
                return false;
            }
            if (this.condition.length < 4) {
                this.$vux.toast.text('请输入卡号最少后四位', 'middle');
                return false;
            } else {
                let sousuoweihao;
                let arr = [];
                for (let key in this.arrayList) {
                    let cardNo = this.arrayList[key].oilCardNo;
                    sousuoweihao = cardNo.substring(cardNo.length - this.condition.length);
                    if (sousuoweihao == this.condition) {
                        //有的时候，返回对应的key值
                        arr.push(this.arrayList[key]);
                    }
                }
                this.searchList = [];
                this.searchList = arr;

                //最少后四位
                // if(/[0-9]{4}/.test(this.condition)){
                //     if(this.condition == sousuoweihao){
                //         if(this.arrayList[key].oilCardNo == cardNo){
                //             //有的时候，返回对应的key值
                //             this.searchList = [];
                //             this.searchList.push(this.arrayList[key]);
                //         }
                //     }
                // }
                if (this.searchList.length == 0) {
                    this.noInfo = true;
                } else {
                    this.noInfo = false;
                }
            }
        },
        //取消按钮
        onCancel() {
            //取消则关闭弹框
            this.show = false;
        },
        //确定按钮
        onConfirm(val) {
            try {
                MtaH5.clickStat('addoilcard_bind_ensure');
            } catch (error) {
                JSON.stringify(error);
            }
            let oilCardNo = this.arrayList[val].oilCardNo;
            //
            if (this.searchList.length != 0) {
                // console.log(val);
                // console.log()
                oilCardNo = this.searchList[val].oilCardNo;
            }
            //调用绑定接口,调用接口成功直接返回结算信息页面
            this.$store.commit('updateLoadingStatus', { isLoading: true });
            bindOilCard(oilCardNo, this.cartBadgeNo, this.driverName, this.mobileNo)
                .then(res => {
                    this.$store.commit('updateLoadingStatus', { isLoading: false });
                    this.$vux.toast.text(res.data.reInfo, 'middle');
                    if (res.data.reCode === '0') {
                        // let result = res.data.result;
                        setTimeout(() => {
                            // this.$router.push("/settlementInfo");
                            this.$router.go(-2);
                            window.localStorage.setItem('oilCardNo', oilCardNo);
                        }, 1500);
                    } else {
                        return false;
                    }
                })
                .catch(err => {
                    // this.$vux.toast.text(err, "middle");
                    this.$store.commit('updateLoadingStatus', { isLoading: false });
                    console.log(JSON.stringify(err));
                });
        }
        //有一个筛选功能
    }
};
</script>

<style lang="less">
@import '../../assets/styles/common.less';
.add-oil-card {
    overflow-x: hidden;
    width: 100%;
    background-color: #efefef;
    position: absolute;
    top: 0px;
    // min-height: 100%;
    height: auto;
    .default {
        margin: 10px auto 0;
        background: #fff;
        text-align: center;
        p {
            color: #797979;
        }
        img {
            margin-top: 40px;
        }
    }
    .card {
        background: #fff;
        padding-top: 1px;
        margin-top: 10px;
        padding-bottom: 10px;
        .card-box {
            width: 95%;
            margin: 10px auto 0;
            padding: 10px 0;
            background-size: 100% 100%;
            position: relative;
            display: flex;
            justify-content: space-around;
            align-items: center;
            .info {
                font-size: 14px;
                font-family: PingFang-SC-Bold;
                color: rgba(32, 32, 32, 1);
            }
            .left {
                width: 70%;
                color: #fff;
                .money {
                    color: #202020;
                    span {
                        font-size: 18px;
                        font-weight: bold;
                        margin-right: 5px;
                    }
                }
                .phone-call {
                    color: #202020;
                    display: flex;
                    align-items: center;
                    img {
                        height: 1rem;
                        margin-left: 10px;
                    }
                }
            }
            .right {
                align-self: flex-end;
                .weui-btn {
                    line-height: 30px;
                    background: #1e66b4;
                    color: #fff;
                }
            }
            .img {
                position: absolute;
                right: 0px;
                top: 0;
                width: 65px;
            }
        }
    }
    .search-ipt-cxt {
        display: flex;
        .wh(100%, 32px);
        line-height: 32px;
        padding: 12px;
        .search-ipt-style {
            display: flex;
            align-items: center;
            .wh(80%, 32px);
            .borderRadius(4px);
            border: 1px solid #bfbfbf;
            .weui-cell {
                width: 96%;
            }
            .weui-cell:before {
                position: static;
            }
            .weui-input {
                width: 100%;
                height: 24px;
                padding: 11px 0px;
                line-height: 24px;
            }
            input::-webkit-input-placeholder {
                color: #9f9f9f;
                font-size: 14px;
            }
            img {
                width: 14px;
                height: 14px;
                padding-left: 12px;
            }
        }
        .search-control-btn {
            padding-left: 12px;
            color: #15499a;
        }
    }
    .card1 {
        background: url('../../assets/imgs/wbs/shihuaka_img@2x.png') no-repeat center center;
    }
    .card2 {
        background: url('../../assets/imgs/wbs/shiyouka_img@2x.png') no-repeat center center;
    }
    .footer {
        height: 40px;
    }
    .button {
        position: fixed;
        bottom: 0px;
        width: 100%;
        height: 55px;
        .newAddCard {
            background: #15499a;
            color: #fff;
            width: 90%;
        }
    }
    .weui-btn_disabled {
        background: #454545 !important;
        color: #cfcfcf !important;
    }
}
</style>
