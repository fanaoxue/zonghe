<template>
    <div class="add-transport-div">
        <c-header :isShowTitle="true">
            <van-nav-bar :title="title" left-arrow @click-left="onClickLeft" />
        </c-header>
        <div class="add-head-back-div">
            <img class="head-back-img" src="../../assets/imgs/add/fazhanyunlibg_img@2x.png" />
            <div class="head-icon-all-div">
                <div class="add-icon-div">
                    <img class="icon-img" src="../../assets/imgs/add/fazhanyunli_icon@2x.png" />
                </div>
                <div class="add-icon-div ash-icon-div margin-icon-div">
                    <img class="icon-img" src="../../assets/imgs/add/yunyingjingli_icon@2x.png" />
                </div>
                <div class="add-icon-div ash-icon-div">
                    <img class="icon-img" src="../../assets/imgs/add/huodeshouyi_icon@2x.png" />
                </div>
                <div class="add-line-div org-add-line-div"></div>
                <div class="add-line-div ash-add-line-div"></div>
                <div class="add-step-div current-step-div step1-div">发展运力</div>
                <div class="add-step-div step2-div">经营运力</div>
                <div class="add-step-div step3-div">获得收益</div>
            </div>
        </div>
        <div class="add-ash-div"></div>
        <div class="add-msg-all-div">
            <div class="add-input-all-div">
                <div class="add-input-div" :class="!(changeType == 0) ? 'disabled-style' : ''">
                    <span class="project-name-span"> <span class="org-name-span">*</span>车牌号码： </span>
                    <input
                        class="add-input"
                        type="text"
                        readonly
                        placeholder="请输入车牌号码"
                        @click="carNumIpt"
                        v-model.trim="cartBadgeNo"
                        :disabled="!(changeType == 0)"
                    />
                </div>
                <div class="add-input-div" :class="!(changeType == 0 || changeType == 2) ? 'disabled-style' : ''">
                    <span class="project-name-span"> <span class="org-name-span">*</span>司机姓名： </span>
                    <input
                        class="add-input"
                        type="text"
                        placeholder="请输入司机姓名"
                        v-model.trim="driverName"
                        :disabled="!(changeType == 0 || changeType == 2)"
                    />
                </div>
                <div class="add-input-div" :class="!(changeType == 0 || changeType == 2) ? 'disabled-style' : ''">
                    <span class="project-name-span not-must-span">司机手机：</span>
                    <input
                        class="add-input"
                        type="tel"
                        placeholder="请输入司机手机"
                        v-model.trim="mobileNo"
                        :disabled="!(changeType == 0 || changeType == 2)"
                    />
                </div>
            </div>
        </div>
        <div :class="{ 'confirm-add-div gray-button-div': isSubmitFlag, 'confirm-add-div': !isSubmitFlag }" @click="addTransport">{{ buttonName }}</div>
    </div>
</template>

<script>
import { NavBar } from 'vant';
import { systemType, AppFinish } from '../../utils/app.js';
import { ruleLogIfs, addTransportCapactity, updateTransportCapactity } from '../../api/apiTC.js';
import { driverNext } from '../../api/api.js';
export default {
    name: 'addTransport',
    data() {
        return {
            title: '发展运力',
            buttonName: '确认添加',
            cartBadgeNo: '',
            driverName: '',
            mobileNo: '',
            isSubmitFlag: false,
            transportCapacityRecId: '',
            pageType: this.$route.query.isUpdate || 0,
            changeType: this.$route.query.changeType || 0
        };
    },
    components: {
        vanNavBar: NavBar
    },
    beforeRouteEnter(to, from, next) {
        if (from.name == 'TCDetail') {
            next(vm => {
                vm.title = '修改运力';
                vm.buttonName = '确认修改';
                vm.cartBadgeNo = vm.$route.query.cartBadgeNo || '';
                vm.driverName = vm.$route.query.driverName || '';
                vm.mobileNo = vm.$route.query.mobileNo || '';
                vm.transportCapacityRecId = vm.$route.query.transportCapacityRecId || '';
            });
        }
        next();
    },
    created() {
        this.$store.commit('updateLoadingStatus', { isLoading: false });
    },
    methods: {
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
        carNumIpt() {
            let _this = this;
            this.$carIpt({
                dpCartNum: this.cartBadgeNo !== '' && this.cartBadgeNo !== '请输入车牌号码' ? this.cartBadgeNo : '',
                fn: function(res) {
                    _this.cartBadgeNo = res === '' ? '请输入车牌号码' : res;
                }
            });
        },
        addTransport() {
            let _this = this;
            if (this.pageType == 0) {
                setTimeout(() => {
                    _this.recordLogFuc('4', {
                        cartBadgeNo: _this.cartBadgeNo,
                        driverName: _this.driverName,
                        mobileNo: _this.mobileNo
                    });
                }, 2000);
            } else {
                setTimeout(() => {
                    _this.recordLogFuc('11', {
                        cartBadgeNo: _this.cartBadgeNo,
                        driverName: _this.driverName,
                        mobileNo: _this.mobileNo,
                        transportCapacityRecId: _this.transportCapacityRecId
                    });
                }, 2000);
            }
            if (_this.isSubmitFlag) {
                return;
            }
            if (!_this.$utils.isNotEmpty(_this.cartBadgeNo)) {
                _this.$vux.toast.text('车牌不可为空');
                console.info('车牌不可为空');
                return;
            }
            if (!_this.$utils.isNotEmpty(_this.driverName)) {
                _this.$vux.toast.text('司机姓名不可为空');
                console.info('司机姓名不可为空');
                return;
            }
            if (this.driverName.length > 32) {
                this.$vux.toast.text('司机姓名过长');
                console.info('司机姓名过长');
                return false;
            }
            if (_this.$utils.isNotEmpty(_this.mobileNo) && !_this.$utils.isMobileNo(_this.mobileNo)) {
                _this.$vux.toast.text('手机号不合法');
                console.info('手机号不合法');
                return;
            }
            this.$store.commit('updateLoadingStatus', { isLoading: true });
            if (this.pageType == 0) {
                this._addTransportCapactity();
            } else {
                this._updateTransportCapactity();
            }
        },
        _updateTransportCapactity() {
            let _this = this;
            _this.isSubmitFlag = true;
            // 后台处理不了
            let jsonData = {
                driverName: this.driverName,
                mobileNo: this.mobileNo,
                transportCapacityRecId: this.transportCapacityRecId
            };
            if (this.$route.query.cartBadgeNo !== this.cartBadgeNo) {
                jsonData.cartBadgeNo = this.cartBadgeNo;
            }
            // let jsonData = {
            //   cartBadgeNo: this.cartBadgeNo,
            //   driverName: this.driverName,
            //   mobileNo: this.mobileNo,
            //   transportCapacityRecId: this.transportCapacityRecId
            // };
            updateTransportCapactity(jsonData)
                .then(res => {
                    if (res.data.reCode === '0') {
                        this.$vux.toast.text('修改成功！');
                        setTimeout(() => {
                            this.$router.go(-1);
                        }, 500);
                    } else if (res.data.reCode === '40011') {
                        let result = JSON.parse(res.data.result);
                        _this.$vux1.confirm.show({
                            title: '修改失败',
                            content:
                                '<div style="text-align: left;">此运力已被其他经理人发展,不可重复添加！<br/>运力经理人：' +
                                result.managerName +
                                '<br/>已发展运力：' +
                                result.carCount +
                                '辆</div>',
                            confirmText: '知道了',
                            onConfirm: () => {},
                            onClose: () => {},
                            showCancelButton: false
                        });
                    } else {
                        _this.$vux.toast.text(res.data.reInfo);
                    }
                    _this.isSubmitFlag = false;
                    this.$store.commit('updateLoadingStatus', { isLoading: false });
                })
                .catch(error => {
                    _this.isSubmitFlag = false;
                    console.log(error);
                    this.$store.commit('updateLoadingStatus', { isLoading: false });
                });
        },
        _addTransportCapactity() {
            let _this = this;
            _this.isSubmitFlag = true;
            addTransportCapactity(_this.cartBadgeNo, _this.driverName, _this.mobileNo)
                .then(res => {
                    if (res.data.reCode === '0') {
                        _this.submitSuccess();
                        // _this.$vux.toast.text({message:"添加成功",callBackFuc:_this.submitSuccess});
                    } else if (res.data.reCode === '40011') {
                        let result = JSON.parse(res.data.result);
                        _this.$vux1.confirm.show({
                            title: '添加失败',
                            content:
                                '<div style="text-align: left;">此运力已被其他经理人发展,不可重复添加！<br/>运力经理人：' +
                                result.managerName +
                                '<br/>已发展运力：' +
                                result.carCount +
                                '辆</div>',
                            confirmText: '知道了',
                            onConfirm: () => {
                                _this.cartBadgeNo = '';
                                _this.driverName = '';
                                _this.mobileNo = '';
                            },
                            onClose: () => {
                                _this.cartBadgeNo = '';
                                _this.driverName = '';
                                _this.mobileNo = '';
                            },
                            showCancelButton: false
                        });
                    } else {
                        _this.$vux.toast.text(res.data.reInfo);
                    }
                    _this.isSubmitFlag = false;
                    this.$store.commit('updateLoadingStatus', { isLoading: false });
                })
                .catch(error => {
                    _this.isSubmitFlag = false;
                    console.log(error);
                    this.$store.commit('updateLoadingStatus', { isLoading: false });
                });
        },
        // 未使用到
        verifyParams() {
            this.recordLogFuc('20', { cartBadgeNo: this.cartBadgeNo });
            if (this.isSubmitFlag) {
                return false;
            }
            if (!this.$utils.isNotEmpty(this.cartBadgeNo)) {
                this.$vux.toast.text('车牌不可为空');
                console.info('车牌不可为空');
                return false;
            }
            if (!this.$utils.isNotEmpty(this.driverName)) {
                this.$vux.toast.text('司机姓名不可为空');
                console.info('司机姓名不可为空');
                return false;
            }
            if (this.driverName.length > 32) {
                this.$vux.toast.text('司机姓名过长');
                console.info('司机姓名过长');
                return false;
            }
            if (this.$utils.isNotEmpty(this.mobileNo) && !this.$utils.isMobileNo(this.mobileNo)) {
                this.$vux.toast.text('手机号不合法');
                console.info('手机号不合法');
                return false;
            }
            return true;
        },
        submitSuccess() {
            this.$store.commit('updateLoadingStatus', { isLoading: true });
            driverNext(this.mobileNo, this.cartBadgeNo, this.driverName, '0', '0', '0')
                .then(res => {
                    this.$store.commit('updateLoadingStatus', { isLoading: false });
                    this.$router.push({
                        name: 'addTransportSucc',
                        query: {
                            cartBadgeNo: this.cartBadgeNo,
                            driverName: this.driverName,
                            mobileNo: this.mobileNo
                        }
                    });
                })
                .catch(err => {
                    this.$store.commit('updateLoadingStatus', { isLoading: false });
                    this.$router.push({
                        name: 'addTransportSucc',
                        query: {
                            cartBadgeNo: this.cartBadgeNo,
                            driverName: this.driverName,
                            mobileNo: this.mobileNo
                        }
                    });
                });
        },
        onClickLeft() {
            console.log('======================', this.pageType);
            if (this.pageType == 1) {
                //  修改运力回退不关页面
                this.$router.go(-1);
            } else {
                let sysType = systemType();
                AppFinish();
                if (sysType === 0) {
                    this.$router.go(-1);
                }
            }
        }
    }
};
// window.onresize = function() {
//     if (document.body.scrollHeight < h) {
//         alert('0');
//     }else{
//         alert('1');
//     }
// };
</script>

<style lang="less">
.add-transport-div {
    .disabled-style {
        color: #666;
    }
    input:focus {
        outline: none !important;
        border: 0;
    }
    input::-webkit-input-placeholder,
    textarea::-webkit-input-placeholder {
        font-size: 15px;
        color: #9f9f9f;
    }
    input:-moz-placeholder,
    textarea:-moz-placeholder {
        font-size: 15px;
        color: #9f9f9f;
    }
    input::-moz-placeholder,
    textarea::-moz-placeholder {
        font-size: 15px;
        color: #9f9f9f;
    }
    input:-ms-input-placeholder,
    textarea:-ms-input-placeholder {
        font-size: 15px;
        color: #9f9f9f;
    }
    .add-transport-div {
        width: 100%;
        height: 100%;
    }
    .head-back-img {
        width: 100%;
    }
    .add-head-back-div {
        position: relative;
        background: #fff;
    }
    .head-icon-all-div {
        position: absolute;
        top: 0;
        top: 42px;
        left: calc((100% - 292px) / 2);
        right: calc((100% - 18.25rem) / 2);
    }
    .add-icon-div {
        width: 3.125rem;
        height: 3.125rem;
        border-radius: 50px;
        background: #ffba00;
        text-align: center;
        margin: auto 0;
        position: relative;
        float: left;
    }
    .icon-img {
        width: 24px;
        vertical-align: middle;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .ash-icon-div {
        background: #dcdcdc;
    }
    .margin-icon-div {
        margin: 0 71px;
    }
    .add-line-div {
        height: 12px;
        width: 121px;
        float: left;
    }
    .org-add-line-div {
        border-left: 1px solid #ffba00;
        border-bottom: 1px solid #ffba00;
        margin-left: 25px;
    }
    .ash-add-line-div {
        border-left: 1px solid #dcdcdc;
        border-bottom: 1px solid #dcdcdc;
        border-right: 1px solid #dcdcdc;
    }
    .add-step-div {
        float: left;
        margin-top: 13px;
        line-height: 16px;
        color: #bcbcbc;
        font-weight: bold;
    }
    .current-step-div {
        color: #202020;
    }
    .step1-div {
        position: relative;
        left: -7px;
    }
    .step2-div {
        margin-left: calc((100% - 185px) / 2);
    }
    .step3-div {
        position: relative;
        right: -7px;
        float: right;
    }
    .add-ash-div {
        width: 100%;
        height: 10px;
        background: #efefef;
    }
    .add-msg-all-div {
        width: 100%;
        background: #fff;
        overflow: hidden;
    }
    .add-input-all-div {
        background: #fcfcfc;
        margin-left: 15px;
        width: calc(100% - 30px);
        border: 1px solid #d6d6d6;
        border-bottom: 0;
        margin-top: 22px;
        float: left;
    }
    .add-input-div {
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid #d6d6d6;
    }
    .project-name-span {
        color: #797979;
        font-size: 15px;
        float: left;
    }
    .org-name-span {
        color: #ffba00;
        font-size: 22px;
        line-height: 22px;
        float: left;
        margin-top: 19px;
        margin-right: 5px;
        margin-left: 8px;
    }
    .not-must-span {
        margin-left: 22px;
    }
    .add-input {
        float: left;
        height: 48px;
        line-height: 48px;
        background: #fcfcfc;
        border: 0px;
        padding: 0px;
        width: 62%;
    }
    .confirm-add-div {
        float: left;
        background: #15499a;
        color: #fff;
        font-size: 15px;
        width: calc(100% - 50px);
        margin-left: 25px;
        height: 47px;
        line-height: 47px;
        text-align: center;
        border-radius: 5px;
        margin-top: 125px;
    }
    .gray-button-div {
        background: #dcdcdc;
        color: #fff;
    }
    @media screen and (max-width: 320px) {
        .add-head-back-div {
            position: relative;
            background: #fff;
            padding-bottom: 20px;
        }
    }
    @media screen and (max-height: 480px) {
        .confirm-add-div {
            float: left;
            background: #15499a;
            color: #fff;
            font-size: 15px;
            width: calc(100% - 50px);
            margin-left: 25px;
            height: 47px;
            line-height: 47px;
            text-align: center;
            border-radius: 5px;
            margin-top: 15px;
        }
    }
    @media screen and (max-height: 568px) {
        .confirm-add-div {
            float: left;
            background: #15499a;
            color: #fff;
            font-size: 15px;
            width: calc(100% - 50px);
            margin-left: 25px;
            height: 47px;
            line-height: 47px;
            text-align: center;
            border-radius: 5px;
            margin-top: 50px;
        }
    }
}
</style>

