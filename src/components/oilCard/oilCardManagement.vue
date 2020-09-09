<template>
    <div class="oil-card-management">
        <x-header
            :left-options="{ backText: '', preventGoBack: true, showBack: false }"
            title="slot:overwrite-title"
            @on-click-back="goBack()"
            class="header1"
            v-if="!showBack"
        >
            <div class="overwrite-title-demo" slot="overwrite-title">
                <input type="tel" placeholder="请输入卡号后四位" v-model="condition" />
            </div>
            <a slot="right" class="search_btn" @click="searchBtn()">{{ search }}</a>
        </x-header>
        <x-header :left-options="{ backText: '', preventGoBack: true }" title="slot:overwrite-title" @on-click-back="goBack()" v-else>
            <div class="overwrite-title-demo" slot="overwrite-title">
                <input type="tel" placeholder="请输入卡号后四位" v-model="condition" />
            </div>
            <a slot="right" class="search_btn" @click="searchBtn()">{{ search }}</a>
        </x-header>
        <span v-show="show1 == true">
            <div v-show="arrayList.length == 0">
                <div class="default">
                    <img :src="srcStatic" alt="" width="100" />
                    <p>当前企业无可用油卡记录！</p>
                    <p>请联系快路宝客服开卡</p>
                </div>
            </div>
            <div class="tab" v-show="arrayList.length != 0 && searchList.length == 0 && noInfo == false">
                <img src="../../assets/imgs/wbs/xuankabg_img@2x.png" alt="" width="100%" height="66px" />
                <tab active-color="#FFBA00" v-model="index0">
                    <tab-item @on-item-click="onItemClick">
                        <p class="p1">{{ cardNum }}</p>
                        <p class="p2">油卡总数</p>
                    </tab-item>
                    <tab-item @on-item-click="onItemClick">
                        <p class="p1">{{ noBindNum }}</p>
                        <p class="p2">未绑定</p>
                    </tab-item>
                    <tab-item @on-item-click="onItemClick">
                        <p class="p1">{{ bindNum }}</p>
                        <p class="p2">已绑定</p>
                    </tab-item>
                </tab>
            </div>
            <div class="card" v-show="!(arrayList.length == 0 && searchList.length == 0)">
                <span v-show="!tabState">
                    <span v-show="arrayList.length != 0 && searchList.length == 0 && noInfo == false" class="card_height1">
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
                                        >电话号码：{{ item.oilMobile }} <img v-show="item.oilMobile" src="../../assets/imgs/wbs/dianhua_icon@2x.png" />
                                    </a>
                                </div>
                            </div>
                            <div class="right">
                                <x-button type="primary" :mini="true" @click.native="bindCardConfirm(val, item.oilTypeName, item.oilCardNo, item)">
                                    <span v-if="item.signFlag == '0' && item.isBind == '0'">重新绑定</span>
                                    <span v-else-if="item.signFlag == '1' && item.isBind == '0'"></span>
                                    <span v-else>绑定</span>
                                </x-button>
                            </div>
                            <img :src="[item.isBind == '-1' ? src1 : src2]" alt="" class="img" />
                        </div>
                    </span>
                    <span v-show="searchList.length != 0" class="card_height2">
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
                                <div v-show="item.isBind == '0'" class="info">
                                    <div>车牌号码：{{ item.driverCarNo }}</div>
                                    <div>司机姓名：{{ item.driverName }}</div>
                                    <a @click="phoneCall(item.oilMobile)" class="phone-call"
                                        >电话号码：{{ item.oilMobile }}
                                        <img v-show="item.oilMobile" src="../../assets/imgs/wbs/dianhua_icon@2x.png" />
                                    </a>
                                </div>
                            </div>
                            <div class="right">
                                <x-button type="primary" :mini="true" @click.native="bindCardConfirm(val, item.oilTypeName, item.oilCardNo, item)">
                                    <span v-if="item.signFlag == '0' && item.isBind == '0'">重新绑定</span>
                                    <span v-else-if="item.signFlag == '1' && item.isBind == '0'"></span>
                                    <span v-else>绑定</span>
                                </x-button>
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
                </span>
                <span v-show="tabState">
                    <div class="default">
                        <p>暂无绑定油卡信息~</p>
                    </div>
                </span>
            </div>
        </span>
        <div v-transfer-dom>
            <confirm
                v-model="show"
                :title="title"
                cancel-text="取消"
                confirm-text="确认"
                :close-on-confirm="false"
                @on-cancel="onCancel2()"
                @on-confirm="onConfirm2()"
                @on-close="onClose()"
            >
                <p style="color:#FFBA00">
                    <span v-if="title == '确认绑定'">*对于已确定油卡卡号车辆，可提前绑定油卡</span>
                    <span v-else>确认解除之前与"{{ d.driverName }},{{ d.driverCarNo }}"的绑定关系？</span>
                </p>
                <p style="color:#454545;">卡号：{{ cardNo }}</p>
                <p style="height:1px;background:#DCDCDC;margin:0px auto 10px;width:250px;"></p>
                <p>
                    车牌号码：<input
                        @click="carNumIpt"
                        class="fake_input"
                        v-model.trim="cartBadgeNo"
                        type="text"
                        onfocus="this.blur()"
                        placeholder="请输入绑定车牌号码"
                    />
                </p>
                <p>司机姓名：<input type="text" name="" v-model.trim="driverName" placeholder="请输入绑定司机姓名" /></p>
            </confirm>
        </div>
    </div>
</template>
<script>
import { newAddOilCard, bindOilCard, oilCardManagement } from '../../api/apiOil.js';
import { ApphiddenNativeNav, AppGotoTell, AppFinish } from '../../utils/app.js';
import { newVersion } from '../../utils/version.js';
export default {
    name: 'oilCardManagement',
    data() {
        return {
            show1: false, //页面默认不展示
            show: false, //点击绑定的弹框状态
            condition: '', //搜索内容
            // belongActSys:this.$route.query.belongActSys,//路由传来的所属账户体系
            // prepaymentsOilCard:this.$route.query.prepaymentsOilCard,//预付油卡金额
            // cartBadgeNo:this.$route.query.cartBadgeNo,//车牌号
            // driverName:this.$route.query.driverName,//司机姓名
            mobileNo: '', //司机手机号
            arrayList: [],
            arrayList0: [],
            searchList: [], //搜索的集合
            oilName: '', //弹框的卡名字
            cardNo: '', //弹框的卡号
            noInfo: false,

            index: '0', //点击绑定的索引
            index0: 0, //默认第一个
            cartBadgeNo: '',
            driverName: '',
            srcStatic: require('../../assets/imgs/wbs/youkajilu_icon@2x.png'), //没有油卡的背景图
            src1: require('../../assets/imgs/wbs/weibangding_img@2x.png'), //未绑定的图片
            src2: require('../../assets/imgs/wbs/yibangding_img@2x.png'), //已绑定的图片
            chooseOilCardItem: {}, //已经选择的油卡
            cardNum: '0', //油卡总数
            noBindNum: '0', //未绑定
            bindNum: '0', //已绑定
            tab: '0', //默认选中第一栏
            a: '',
            b: '',
            c: '',
            d: '',
            title: '',
            tabState: false,
            search: '搜索',
            version: '', //获取设备版本号
            newVersion: newVersion,
            showBack: true
        };
    },
    watch: {
        condition() {
            if (this.condition == '') {
                this.search = '搜索';
                this.searchList = [];
                this.noInfo = false;
            }
        }
    },
    created() {
        // console.log(newVersion)
        if (this.$sysType === 1) {
            let resultOfAnd = JSON.parse(AndroidAppJs.getClientVersion());
            this.version = resultOfAnd.app_version;
            console.log(this.version);
            this.isVersionNew(this.version, this.newVersion);
        } else if (this.$sysType === 2) {
            // window.webkit.messageHandlers.getClientVersion.postMessage('')
            // var _this = this
            // window.AppMesgIosCallBack = function (res) {
            //     let resultOfIos = JSON.parse(res)
            //     _this.version = resultOfIos.app_version;
            //     console.log(_this.version)
            //     _this.isVersionNew(_this.version,_this.newVersion);
            // }
            // console.log('IOS页面是写死的，不用调试')
        } else {
            console.log('该获取版本号方法,仅在客户端才能使用~~');
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.dataInit();
        });
    },
    methods: {
        //判断版本号是否是新的
        isVersionNew(ver1, ver2) {
            // var arrOld = old.split('.');
            // var arrNew = newItem.split('.');
            // for (var i = 0; i < arrOld.length; i++) {
            //     if (arrNew[i] > arrOld[i]) {
            //         //新版本返回 1
            //         // console.log('1')
            //         this.showBack = false; //隐藏
            //     }
            // }
            var version1pre = parseFloat(ver1);
            var version2pre = parseFloat(ver2);
            var version1next = ver1.replace(version1pre + '.', '');
            var version2next = ver2.replace(version2pre + '.', '');
            if (version1pre > version2pre) {
                this.showBack = true;
            } else if (version1pre < version2pre) {
                this.showBack = false;
            } else {
                if (version1next >= version2next) {
                    this.showBack = true;
                } else {
                    this.showBack = false;
                }
            }
        },
        carNumIpt() {
            let _this = this;
            this.$carIpt({
                dpCartNum: this.cartBadgeNo !== '' && this.cartBadgeNo !== '请输入车牌号码' ? this.cartBadgeNo : '',
                fn: function(res) {
                    _this.cartBadgeNo = res === '' ? '请输入车牌号码' : res;
                }
            });
        },
        //返回按钮
        goBack() {
            AppFinish('-1');
        },
        //切换tab栏
        onItemClick(index, item) {
            this.tab = index;
            let arr = [];
            if (this.tab == '1') {
                if (item != 0) {
                    window.scrollTo(0, 0);
                }
                if (this.noBindNum != '0') {
                    this.arrayList = this.arrayList0;
                    this.arrayList.map(item => {
                        if (item.isBind == '-1') {
                            arr.push(item);
                        }
                    });
                    this.arrayList = arr;
                    this.tabState = false;
                } else {
                    this.tabState = true;
                }
            } else if (this.tab == '2') {
                if (item != 0) {
                    window.scrollTo(0, 0);
                }
                if (this.bindNum != '0') {
                    this.arrayList = this.arrayList0;
                    this.arrayList.map(item => {
                        if (item.isBind == '0') {
                            arr.push(item);
                        }
                    });
                    this.arrayList = arr;
                    this.tabState = false;
                } else {
                    this.tabState = true;
                }
            } else {
                if (item != 0) {
                    window.scrollTo(0, 0);
                }
                this.tabState = false;
                this.arrayList = this.arrayList0;
            }
        },
        //拨打电话
        phoneCall(oilMobile) {
            if (oilMobile) {
                AppGotoTell(oilMobile);
            }
        },
        //页面数据初始化
        dataInit() {
            //管理油卡接口--16003
            this.$store.commit('updateLoadingStatus', { isLoading: true });
            oilCardManagement()
                .then(res => {
                    this.$store.commit('updateLoadingStatus', { isLoading: false });
                    if (res.data.reCode === '0') {
                        let result = res.data.result;
                        this.cardNum = result.cardNum;
                        this.noBindNum = result.noBindNum;
                        this.bindNum = result.bindNum;
                        this.arrayList = result.list;
                        this.arrayList0 = result.list;
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
                    console.log(JSON.stringify(err.message));
                });
        },
        bindCardConfirm(index, item1, item2, item) {
            if (item.signFlag == '0' && item.isBind == '0') {
                this.title = '绑定油卡';
            } else {
                this.title = '确认绑定';
            }
            this.cardNo = item2;
            this.a = index;
            this.b = item1;
            this.c = item2;
            this.d = item;
            this.show = true;
            // if(item.isBind=='0'){
            //     this.$vux1.confirm.show({
            //         title: `确认绑定`,
            //         content: `
            //         <div style="text-align:left;">
            //             <p style='color:#454545;line-height:150%;'>
            //                 <span style="font-weight:bold;">${item1}</span></br>卡号：${item2}</p>
            //                 <p style='color:#454545;line-height:150%;font-family:PingFang-SC-Medium;color:rgba(255,186,0,1);margin-top:4px;'>确认解除之前与"${item.driverName}，${item.driverCarNo}"的绑定关系？</p>
            //         </div>`,
            //         confirmText:"确认",
            //         cancelText:"取消",
            //         onConfirm: () => {
            //             this.bindCard(index,item1,item2,item)
            //         },
            //         onCancel:() => {

            //         }
            //     });
            // }else{
            //     this.bindCard(index,item1,item2,item)
            // }
        },
        //绑定油卡
        bindCard(index, item1, item2, item) {
            this.index = index;
            this.oilName = item1;
            this.cardNo = item2;
            // this.show = true;
            this.chooseOilCardItem = item;
            this.onConfirm(this.index, 0);
        },
        //搜索功能--最少后四位才能查询
        searchBtn() {
            if (this.search == '取消') {
                this.condition = '';
                this.search = '搜索';
                return;
            }
            this.tabState = false;
            let reg = /^[0-9]+$/;
            if (!reg.test(this.condition)) {
                this.$vux.toast.text('请输入数字!', 'middle');
                return;
            } else {
                if (this.condition.length < 4) {
                    this.$vux.toast.text('请输入卡号最少后四位!', 'middle');
                    return;
                }
            }
            let sousuoweihao;
            let arr = [];
            for (let key in this.arrayList0) {
                let cardNo = this.arrayList0[key].oilCardNo;
                sousuoweihao = cardNo.substring(cardNo.length - this.condition.length);
                if (sousuoweihao == this.condition) {
                    //有的时候，返回对应的key值
                    arr.push(this.arrayList0[key]);
                }
            }
            this.searchList = [];
            this.searchList = arr;
            if (this.searchList.length == 0) {
                this.noInfo = true;
            } else {
                this.noInfo = false;
            }
            this.search = '取消';
        },
        //取消按钮
        onCancel2() {
            //取消则关闭弹框
            this.show = false;
            this.cartBadgeNo = '';
            this.driverName = '';
        },
        onClose() {
            //取消则关闭弹框
            this.show = false;
            this.cartBadgeNo = '';
            this.driverName = '';
        },
        onConfirm2() {
            // console.log(this.a,this.b,this.c,this.d)
            if (this.cartBadgeNo == '') {
                this.$vux.toast.text('车牌号码不能为空！', 'middle');
                return false;
            }
            if (this.driverName == '') {
                this.$vux.toast.text('司机姓名不能为空！', 'middle');
                return false;
            } else {
                if (this.driverName.length > 20) {
                    this.$vux.toast.text('姓名输入不合法！', 'middle');
                    return false;
                }
            }
            //满足条件关闭confirm
            this.show = false;
            this.index = this.a;
            // this.oilName = this.b;
            this.cardNo = this.c;
            this.chooseOilCardItem = this.d;
            this.onConfirm(this.index);
        },
        //确定按钮
        onConfirm(val) {
            let oilCardNo = this.arrayList[val].oilCardNo;
            if (this.searchList.length != 0) {
                oilCardNo = this.searchList[val].oilCardNo;
            }
            //调用绑定接口,调用接口成功直接返回结算信息页面
            let state = this.arrayList.length != 0 && this.searchList.length == 0 && this.noInfo == false;
            this.$store.commit('updateLoadingStatus', { isLoading: true });
            bindOilCard(oilCardNo, this.cartBadgeNo, this.driverName, this.mobileNo)
                .then(res => {
                    this.$store.commit('updateLoadingStatus', { isLoading: false });
                    if (res.data.reCode === '0') {
                        this.$vux.toast.text('绑定成功', 'middle');
                        if (this.searchList.length != 0) {
                            this.searchList[val].driverCarNo = this.cartBadgeNo;
                            this.searchList[val].driverName = this.driverName;
                            this.searchList[val].isBind = 0;
                        }
                        this.$nextTick(() => {
                            this.dataInit();
                        });
                        setTimeout(() => {
                            // 获取数据后，跳转到第一栏
                            if (state == false) {
                                this.index0 = 0;
                            }
                            if (this.index0 == 1) {
                                this.index0 = 1;
                                this.onItemClick(1, 0);
                                // console.log('1111')
                            }
                            if (this.index0 == 2) {
                                this.index0 = 2;
                                this.onItemClick(2, 0);
                                // console.log('2222')
                            }
                            // this.index0 = 0;
                        }, 500);
                    } else {
                        this.$vux.toast.text(res.data.reInfo, 'middle');
                    }
                    this.cartBadgeNo = '';
                    this.driverName = '';
                })
                .catch(err => {
                    // this.$vux.toast.text(err, "middle");
                    this.$store.commit('updateLoadingStatus', { isLoading: false });
                    console.log(JSON.stringify(err.message));
                });
        }
    }
};
</script>
<style lang="less">
@import '../../assets/styles/common.less';
.oil-card-management {
    overflow-x: hidden;
    width: 100%;
    background-color: #fff;
    // position: absolute;
    top: 0px;
    min-height: 100%;
    height: auto;
    .vux-header {
        position: fixed;
        width: 100%;
        z-index: 100;
        top: 0px;
    }
    .tab {
        height: 6.5rem;
        position: fixed;
        top: 2.875rem;
        background: #fff;
        z-index: 100;
        .p1 {
            height: 38px;
            line-height: 46px;
            font-size: 21px;
            // color:#FFBA00;
            // font-weight:bold
        }
        .p2 {
            font-size: 18px;
            height: 20px;
            line-height: 20px;
        }
    }
    .vux-tab-wrap {
        top: -70px;
        .vux-tab-container {
            height: 70px;
            border-radius: 40px;
            width: 95%;
            margin: 20px auto;
            -webkit-appearance: none;
            box-shadow: 0px 1px 12px 0px rgba(0, 0, 0, 0.1);
            -webkit-box-shadow: 0px 1px 12px 0px rgba(0, 0, 0, 0.1);
            .vux-tab {
                height: 71px;
            }
        }
    }
    .vux-tab-selected {
        font-weight: 600;
    }
    .vux-header-title-area {
        margin: 0 50px;
    }
    .header1 {
        .vux-header-title-area {
            margin: 0 50px 0 10px;
        }
    }
    .overwrite-title-demo {
        margin-top: 5px;
        input {
            width: 100%;
            height: 30px;
            line-height: 30px;
            border-radius: 4px;
            font-size: 16px;
            outline: none;
            border: none;
            text-indent: 2em;
            background: #fff url('../../assets/imgs/wbs/sousuo_icon@2x.png') no-repeat 4px 4px;
            background-size: 20px;
        }
    }
    .vux-header .vux-header-right {
        // right: 35px;
        top: 9px;
    }
    .search_btn {
        font-size: 16px;
        height: 28px;
        line-height: 28px;
        color: #fff !important;
    }
    .default {
        position: fixed;
        top: 8rem;
        width: 100%;
        margin: 30px auto 0;
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
        overflow: auto;
        background: #fff;
        padding-top: 1px;
        // margin-top: 10px;
        // padding-bottom: 10px;
        .card_height1 {
            top: 9.8rem;
            position: absolute;
            width: 100%;
        }
        .card_height2 {
            top: 3.15rem;
            position: absolute;
            width: 100%;
        }
        .card-box {
            width: 95%;
            margin: 15px auto;
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
    // .search-ipt-cxt{
    //     display: flex;
    //     .wh(100%,32px);
    //     line-height: 32px;
    //     padding: 12px;
    //     .search-ipt-style{
    //         display: flex;
    //         align-items: center;
    //         .wh(80%,32px);
    //         .borderRadius(4px);
    //         border: 1px solid #BFBFBF;
    //         .weui-cell{
    //             width: 96%;
    //         }
    //         .weui-cell:before{
    //             position: static;
    //         }
    //         .weui-input {
    //             width: 100%;
    //             height: 24px;
    //             padding: 11px 0px;
    //             line-height: 24px;
    //         }
    //         input::-webkit-input-placeholder {
    //             color: #9F9F9F;
    //             font-size: 14px;
    //         }
    //         img {
    //             width: 14px;
    //             height: 14px;
    //             padding-left: 12px;
    //         }
    //     }
    //     .search-control-btn {
    //         padding-left: 12px;
    //         color: #15499A
    //     }
    // }
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

.weui-dialog {
    width: 90% !important;
    max-width: none;
    .weui-dialog__bd {
        text-align: center;
        font-size: 15px;
        color: #454545;
        padding: 1em 0.5em 2em;
        line-height: 40px;
        p:nth-child(1) {
            line-height: 20px;
        }
        div {
            line-height: 1.5;
            max-height: 300px;
        }
        input {
            -webkit-appearance: none;
            text-indent: 2px;
            border: 1px solid #dfdfdf;
            outline: none;
            width: 175px;
            height: 24px;
            line-height: 24px;
            font-size: 16px;
            border-radius: 0px;
            background: #f6f6f6;
        }
    }
}
</style>
