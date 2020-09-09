<template>
    <div id="detail" class="detail" :style="{ height: clientHeight + 'px' }">
        <c-header :isShowTitle="true">
            <van-nav-bar @click-left="onClickLeft" :title="headTitle" left-arrow :fixed="true" />
        </c-header>
        <div style="height:46px;"></div>
        <div class="tab-content">
            <div @click="checkTab(0)" :class="{ 'tab tab-left selected-tab yellow': active === 0, 'tab tab-left': active !== 0 }">
                <span :class="{ 'num selected-tab': active === 0, 'num num-black': active !== 0 }">{{ total.cartCount }}</span>
                <span>全部</span>
            </div>
            <div></div>
            <div @click="checkTab(1)" :class="{ 'tab selected-tab yellow': active === 1, tab: active !== 1 }">
                <div v-if="active === 2" class="small-line-left"></div>
                <span :class="{ 'num selected-tab': active === 1, 'num num-black': active !== 1 }">{{ total.relevanceCartCount }}</span>
                <span>已关联</span>
                <div v-if="active === 0" class="small-line-right"></div>
            </div>
            <div @click="checkTab(2)" :class="{ 'tab tab-right selected-tab yellow': active === 2, 'tab tab-right': active !== 2 }">
                <span :class="{ 'num selected-tab': active === 2, 'num num-black': active !== 2 }">{{ total.unRelevanceCartCount }}</span>
                <span>未关联</span>
            </div>
        </div>
        <van-tabs v-model="active" :animated="true">
            <van-tab title v-for="xlIndex in 3" :key="xlIndex">
                <div
                    class="detail-list-cxt"
                    :style="{ height: clientHeight - 155 + 'px' }"
                    style="overflow: scroll;-webkit-overflow-scrolling : touch;"
                    :class="'TCDetailList_' + [xlIndex - 1]"
                >
                    <van-list
                        v-model="listState[xlIndex - 1].loading"
                        :finished="listState[xlIndex - 1].finished"
                        :error.sync="listState[xlIndex - 1].error"
                        :error-text="listState[xlIndex - 1].errorText"
                        :finished-text="listState[xlIndex - 1].finishedText"
                        @load="dataInit(xlIndex - 1)"
                    >
                        <div
                            class="list van-hairline--bottom"
                            v-for="(item, index) in listState[xlIndex - 1].driverList"
                            :key="index"
                            @click="check(item)"
                            :class="'list_' + item.transportCapacityRecId + '_' + [xlIndex - 1]"
                        >
                            <div v-if="item.headUrl === null || item.headUrl === undefined" class="head-img default-head-div">
                                {{ item.name | formatDriverName }}
                            </div>
                            <img v-if="item.headUrl !== null && item.headUrl !== undefined" class="head-img" alt :src="item.headUrl" />
                            <div
                                :class="{
                                    'driver-info': item.mobileNo !== null,
                                    'driver-info': item.mobileNo !== undefined,
                                    'driver-info2': item.mobileNo === null,
                                    'driver-info2': item.mobileNo === undefined
                                }"
                            >
                                {{ item.cartBadgeNo }}
                                <br />
                                {{ item.name | formatName20 }}
                                <br />
                                <span
                                    v-if="item.mobileNo !== null && item.mobileNo !== undefined"
                                    class="tel-num"
                                    @click.stop="goTel(item.mobileNo, item.name)"
                                    >{{ item.mobileNo }}</span
                                >
                                <img
                                    v-if="item.mobileNo !== null && item.mobileNo !== undefined"
                                    class="phone-icon"
                                    alt
                                    src="../../assets/imgs/icons/phone.png"
                                    @click.stop="goTel(item.mobileNo, item.name)"
                                />
                            </div>
                            <span class="coop-total">合作{{ item.waybillCount }}单</span>
                            <br />
                            <span v-if="item.relCount === '0'" class="state">未关联</span>
                            <span v-if="item.relCount !== '0'" class="state">已关联</span>
                            <div class="show-or-hide" v-show="item.childList.length !== 0">
                                <span class="tab_col"  @click.stop="showOrHide(index)">
                                    <span>以往司机</span>
                                    <img
                                        src="../../assets/imgs/wbs/shouqi_icon2@2x.png"
                                        alt
                                        width="15"
                                        height="15"
                                        class="img-icon imgStyle"
                                        :class="{ shouQi: showControl[index] === 0, zhanKai: showControl[index] === 1 }"
                                    />
                                </span>
                                <transition name="mybox">
                                    <div class="slide" :class="{ animate: showControl[index] === 1 }">
                                        <p class="oldDriver" v-for="(item1,val) in item.childList" :key="val">
                                            <!-- <span>张三</span>
                                            <span>15533335555</span>
                                            <span><img src="../../assets/imgs/icons/phone.png" alt="" class="phone"/></span> -->
                                            <span>{{ item1.driverName}}</span>
                                            <span
                                                v-if="item1.mobileNo !== null && item1.mobileNo !== undefined"
                                                class="tel-num"
                                                @click.stop="goTel(item1.mobileNo, item1.driverName)"
                                                >{{ item1.mobileNo }}
                                            </span>
                                            <span>
                                                <img 
                                                    v-if="item1.mobileNo !== null && item1.mobileNo !== undefined"
                                                    class="phone-icon"
                                                    alt=""
                                                    src="../../assets/imgs/icons/phone.png"
                                                    @click.stop="goTel(item1.mobileNo, item1.driverName)"
                                                />
                                            </span>
                                        </p>
                                        <!-- <p class="oldDriver">
                                            <span>张三</span>
                                            <span>15533335555</span>
                                            <span><img src="../../assets/imgs/icons/phone.png" alt="" class="phone"/></span>
                                        </p> -->
                                    </div>
                                </transition>
                            </div>
                        </div>
                    </van-list>
                </div>
            </van-tab>
        </van-tabs>
        <actionsheet v-model="showActionsheet" :menus="menusActionsheet" @on-click-menu="menuCheck" @on-after-hide="menuCancel" show-cancel></actionsheet>
    </div>
</template>

<script>
import { NavBar, Tab, Tabs, List } from 'vant';
import { systemType, AppFinish, AppGotoTell } from '../../utils/app.js';
import { getTCDetail, beforeUpdateTransportCapactity, ruleLogIfs } from '../../api/apiTC.js';
export default {
    data() {
        return {
            isLoginUser: this.$route.query.isLoginUser,
            headTitle:
                typeof this.$route.query.headTitle !== 'undefined'
                    ? decodeURIComponent(decodeURIComponent(this.$route.query.headTitle)) + '的运力'
                    : '我的运力',
            clientHeight: document.documentElement.clientHeight,
            active: 0,
            total: {
                cartCount: '0',
                relevanceCartCount: '0',
                unRelevanceCartCount: '0'
            },
            listState: [
                {
                    driverList: [],
                    loading: false,
                    finished: false,
                    error: false,
                    finishedText: '',
                    errorText: '请求失败，点击重新加载'
                },
                {
                    driverList: [],
                    loading: false,
                    finished: false,
                    error: false,
                    finishedText: '',
                    errorText: '请求失败，点击重新加载'
                },
                {
                    driverList: [],
                    loading: false,
                    finished: false,
                    error: false,
                    finishedText: '',
                    errorText: '请求失败，点击重新加载'
                }
            ],
            showActionsheet: false,
            menusActionsheet: { menu1: '去修改' },
            changeType: '1',
            chooseItem: {},
            scrollClass: '',
            scroll: 0,
            showControl: [],//关闭
            suoying:'' //点击的索引
        };
    },
    components: {
        vanNavBar: NavBar,
        vanTab: Tab,
        vanTabs: Tabs,
        vanList: List
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.$store.commit('updateLoadingStatus', { isLoading: false });
            if (from.name == 'addTransport') {
                vm.dataInit(vm.active);
            } else {
                vm.scrollClass = '';
            }
        });
    },
    computed: {
        waitingFlag() {
            return this.$store.state.loading.isLoading;
        }
    },
    // created() {
    //   this.$store.commit("updateLoadingStatus", { isLoading: false });
    // },
    mounted() {},
    methods: {
        check(item) {
            if (this.isLoginUser === '0') {
                return;
            }
            let _this = this;
            // _this.recordLogFuc("10", {
            //   cartBadgeNo: _this.cartBadgeNo
            // });
            _this.showActionsheet = true;
            _this.chooseItem = item;
        },
        menuCheck(key) {
            if (key === 'cancel') {
                return;
            }
            let _this = this;
            let item = _this.chooseItem;
            this.recordLogFuc('10', {
                changeType: _this.changeType,
                isUpdate: '1',
                cartBadgeNo: item.cartBadgeNo,
                driverName: item.name,
                mobileNo: item.mobileNo,
                transportCapacityRecId: item.transportCapacityRecId
            });
            setTimeout(() => {
                let cartBadgeNo = item.cartBadgeNo;
                beforeUpdateTransportCapactity(cartBadgeNo).then(res => {
                    if (res.data.reCode === '0') {
                        // 0：都可修改
                        // 1：不可修改
                        // 2：可修改手机号和姓名
                        _this.changeType = JSON.parse(res.data.result).changeType.toString();
                        if (_this.changeType === '1') {
                            _this.$vux.toast.text('此运力已存在申请支付的运单无法修改~', 'middle');
                        } else {
                            //记录当前元素的className和scroll偏移量
                            _this.scrollClass = 'list_' + item.transportCapacityRecId + '_' + _this.active;
                            try {
                                let scroll = 0;
                                scroll =
                                    Number(document.getElementsByClassName(_this.scrollClass)[0].offsetTop) -
                                        Number(document.getElementsByClassName('TCDetailList_' + _this.active)[0].scrollTop) || 0;
                                _this.scroll = scroll > 0 ? scroll : 0;
                                console.log(_this.scroll);
                            } catch (e) {}
                            //
                            _this.$router.push({
                                name: 'addTransport',
                                query: {
                                    changeType: _this.changeType,
                                    isUpdate: '1',
                                    cartBadgeNo: item.cartBadgeNo,
                                    driverName: item.name,
                                    mobileNo: item.mobileNo,
                                    transportCapacityRecId: item.transportCapacityRecId
                                }
                            });
                        }
                    } else {
                        _this.$vux.toast.text(res.data.reInfo, 'middle');
                    }
                });
            }, 50);
        },
        menuCancel() {},
        recordLogFuc(type, requestBody) {
            // 记录日志
            ruleLogIfs(type, requestBody)
                .then(response => {
                    if (response.data.reCode !== '0') {
                        console.log('行为数据返回结果' + type + ':' + JSON.stringify(response));
                    }
                })
                .catch(function(error) {
                    console.log('行为数据异常:' + error);
                });
        },
        checkTab(index) {
            this.showControl = [];
            this.active = index;
        },
        dataInit(type) {
            this.type = type;
            let _this = this;
            _this.listState[type].loading = true;
            _this.listState[type].finished = false;
            _this.listState[type].driverList = [];
            getTCDetail(_this.active, _this.$route.query.managerId)
                .then(res => {
                    if (res.data.reCode !== '0') {
                        _this.listState[type].error = true;
                        _this.listState[type].loading = false;
                        _this.listState[type].errorText = res.data.reInfo;
                        return;
                    }
                    let result = JSON.parse(res.data.result);
                    _this.total = result.total;
                    _this.listState[type].driverList = [..._this.listState[type].driverList, ...result.driverList];
                    _this.$nextTick(() => {
                        _this.listState[type].loading = false;
                        if (_this.scrollClass) {
                            //修改页面回来scroll
                            try {
                                let height = 0;
                                height = _this.scrollClass ? document.getElementsByClassName(_this.scrollClass)[0].offsetTop : 0;
                                height = height - _this.scroll;
                                height = height > 0 ? height : 0;
                                document.getElementsByClassName('TCDetailList_' + _this.active)[0].scroll(0, height);
                            } catch (e) {}
                            _this.scrollClass = '';
                            //
                        }
                    });
                    _this.listState[type].finished = true;
                    if (_this.listState[type].driverList.length === 0) {
                        _this.listState[type].finishedText = '暂无数据~~~';
                    } else {
                        _this.listState[type].finishedText = '没有更多了~~~';
                    }
                })
                .catch(error => {
                    _this.listState[type].loading = false;
                    _this.listState[type].error = true;
                    _this.listState[type].errorText = '请求失败，点击重新加载';
                });
        },
        onClickLeft() {
            let sysType = systemType();
            AppFinish();
            if (sysType === 0) {
                this.$router.go(-1);
            }
        },
        goTel(phoneNo, realName) {
            let sysType = systemType();
            this.recordLogFuc(7, { phoneNo: phoneNo });
            if (sysType === 1 || sysType === 2) {
                this.$vux1.confirm.show({
                    title: '提示',
                    content: '姓名：' + realName + '<br/>电话：' + phoneNo,
                    confirmText: '确认拨打',
                    cancelText: '取消',
                    onConfirm() {
                        AppGotoTell(phoneNo);
                    }
                });
            } else {
                window.location.href = 'tel:' + phoneNo;
            }
        },
        //点击展开、关闭按钮
        showOrHide(type,index) {
            if (this.showControl[type]) {
                this.$set(this.showControl,type, 0);
            } else {
                this.$set(this.showControl,type, 1);
            }
        },
    }
};
</script>

<style lang="less">
.detail {
    .tab-content {
        width: calc(100% - 32px);
        margin: 25px 15px 25px 15px;
        text-align: center;
        display: inline-block;
        font-size: 14px;
        color: #797979;
        border: 1px solid #fcfcfc;
        border-radius: 29px;
        box-shadow: #efefef 0 0 8px 1px;
        display: flex;
        position: relative;
        height: 57px;
    }
    .tab {
        width: 33.33%;
        float: left;
        /*padding: 5px 0;*/
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .selected-tab {
        background: #15499a;
        font-weight: bold;
        color: #ffba00;
    }
    .tab-left {
        border-top-left-radius: 29px;
        border-bottom-left-radius: 29px;
    }
    .tab-right {
        border-top-right-radius: 29px;
        border-bottom-right-radius: 29px;
    }
    .tab .num {
        font-size: 20px;
    }
    .num-black {
        color: #202020;
    }
    .yellow {
        color: #ffba00;
    }
    .detail-list-cxt {
        width: 100%;
        min-height: 16px;
        height: auto;
    }
    .van-hairline--bottom {
        border: 1px solid #dcdcdc;
        border-top: none;
    }
    .van-tabs--line {
        padding-top: 0px;
    }
    .van-tabs--line .van-tabs__wrap {
        display: none;
    }
    .detail-list-cxt .list:first-child {
        margin-top: 0;
    }
    .list {
        border: 1px solid #dcdcdc;
        border-radius: 9px;
        width: calc(100% - 44px);
        margin: 16px 15px 0 15px;
        background: #f6f6f6;
        // padding: 15px 0 15px 12px;
        padding: 15px 0 0 12px;
        display: inline-block;
        position: relative;
        font-size: 15px;
        color: #202020;
        // height: 61px;
        min-height:72px;
        height: auto;
        text-align: left;
    }
    .default-head-div {
        background: #1581cf;
        line-height: 54px;
        text-align: center;
        font-size: 14px;
        color: #fff;
    }
    .head-img {
        width: 54px;
        height: 54px;
        border-radius: 100%;
        margin-right: 12px;
        float: left;
        position: absolute;
        // top: 50%;
        top:50px;
        transform: translate(0, -50%);
    }
    .driver-info {
        width: calc(100% - 68px);
        float: right;
        text-align: left;
    }
    .driver-info2 {
        width: calc(100% - 68px);
        float: right;
        margin-top: 10px;
        text-align: left;
    }
    .coop-total {
        position: absolute;
        right: -1px;
        font-size: 13px;
        color: #fff;
        padding: 3px 5px;
        border-top-left-radius: 15px;
        border-bottom-left-radius: 15px;
        background: #1581cf;
        margin-top: -8px;
        box-shadow: #1581cf 0 0 1px 0;
    }
    .state {
        position: absolute;
        right: 10px;
        font-size: 13px;
        color: #797979;
    }
    .tel-num {
        color: #15499a;
    }
    .phone-icon {
        width: 18px;
        height: 18px;
        margin-left: 5px;
        position: relative;
        top: 3px;
    }
    .small-line-left {
        position: absolute;
        width: 0.0625rem;
        height: 0.9375rem;
        background-color: #dfdfdf;
        left: 33.33%;
        top: 1.375rem;
    }
    .small-line-right {
        position: absolute;
        width: 0.0625rem;
        height: 0.9375rem;
        background-color: #dfdfdf;
        left: 66.66%;
        top: 1.375rem;
    }
    .show-or-hide {
        margin-top: 50px;
        border-top: 1px solid #dcdcdc;
        width: 100%;
        text-align: right;
        font-size: 14px;
        color: #15499a;
        img{
            margin-right: 4px;
        }
        .img-icon {
            transition: transform 0.3s, -webkit-transform 0.3s;
        }
        .shouQi {
            transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0) rotate(-45deg);
        }
        .zhanKai {
            transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0) rotate(-225deg);
        }
    }
    .slide {
        width: calc(100% - 68px);
        float: right;
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.5s cubic-bezier(0, 1, 0, 1) -0.1s;
    }
    .animate {
        max-height: 9999px;
        transition: max-height 1s cubic-bezier(0, 1, 0, 1) -0.1s;
        transition-delay: 0s;
    }
    .imgStyle{
        width:15px;
        height:15px;
    }
    .oldDriver{
        text-align: left;
        .phone{
            width: 20px;
            vertical-align: middle;
            padding: 3px 0;

        }
    }
}
</style>
