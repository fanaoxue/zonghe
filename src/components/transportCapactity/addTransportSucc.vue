<template>
    <div class="add-success-div">
        <div class="add-success-all-div">
            <img class="add-success-img" src="../../assets/imgs/add/shibiewancheng_icon@2x.png" />
            <div class="add-success-msg-div">恭喜您！发展运力成功！</div>
        </div>
        <div class="add-sucs-middle-div">
            <div class="add-name-all-div">
                <div class="add-name-div">{{ getSurname }}</div>
                <div class="add-user-all-div">
                    <div class="add-table-all-div">
                        <div class="add-msg-div">{{ cartBadgeNo }}</div>
                        <div class="add-msg-div" v-if="getSurname != '' && getSurname != null">{{ getSurname }}师傅({{ driverName | formatName20 }})</div>
                        <div class="add-mobile-div" v-if="mobileNo != '' && mobileNo != null" @click="goTel(mobileNo, driverName)">
                            <span class="add-mobile-span">{{ mobileNo }}</span>
                            <img class="add-mobile-img" src="../../assets/imgs/add/dianhua_icon@2x.png" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="add-sucs-back-all-div">
            <div class="add-sucs-reward-div">发展更多运力可获得累计奖励哦！</div>
            <!-- <div class="add-sucs-carry-div" @click="goAdd">继续发展</div> -->
            <flexbox style="padding: 0px;width: 84%;margin: 10px auto" :gutter="10">
                <flexbox-item>
                    <x-button type="primary" @click.native="goAddWayBill">建单</x-button>
                </flexbox-item>
                <flexbox-item>
                    <x-button type="primary" @click.native="goAdd" style="background:#fff !important;color:#15499a;border:1px solid rgba(21,73,154,1);"
                        >继续发展</x-button
                    >
                </flexbox-item>
            </flexbox>
            <div class="add-sucs-go-back-div" @click="goHome"><span>返回运力主页>></span></div>
        </div>
    </div>
</template>
<script>
import { systemType, AppFinish, refreshPrePageWhenGoBack, AppGotoTell, openWaybillModule } from '../../utils/app.js';
import { ruleLogIfs } from '../../api/apiTC.js';
export default {
    name: 'addTransportSucc',
    data() {
        return {
            driverName: this.$route.query.driverName,
            cartBadgeNo: this.$route.query.cartBadgeNo,
            mobileNo: this.$route.query.mobileNo
        };
    },
    created() {
        this.$store.commit('updateLoadingStatus', { isLoading: false });
        refreshPrePageWhenGoBack();
    },
    computed: {
        getSurname() {
            return this.driverName.substring(0, 1);
        }
    },
    methods: {
        goAddWayBill() {
            openWaybillModule({ type: '0' });
            let _this = this;
            setTimeout(() => {
                _this.recordLogFuc('9');
            }, 500);
            // let sysType = systemType();
            // if (sysType !== 0) {
            //   setTimeout(() => {
            //     AppFinish();
            //   }, 0);
            // }
        },
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
        goHome() {
            this.recordLogFuc('6');
            setTimeout(() => {
                let sysType = systemType();
                if (sysType === 0) {
                    this.$router.push({ name: 'TCIndex' });
                } else {
                    AppFinish();
                }
            }, 500);
        },
        goAdd() {
            this.recordLogFuc('5');
            setTimeout(() => {
                this.$router.push({ name: 'addTransport' });
            }, 500);
        },
        goTel(phoneNo, realName) {
            this.recordLogFuc('8', { phoneNo: phoneNo });
            let sysType = systemType();
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
        }
    }
};
</script>
<style lang="less">
html,
body,
#app {
    height: 100%;
}

.add-success-div {
    width: 100%;
    height: 100%;
    background: #efefef;
    .weui-btn_primary {
        background-color: #15499a !important;
        margin: 10px auto;
        width: 90% !important;
        height: 45px;
    }
    .add-success-all-div {
        text-align: center;
        padding-top: 102px;
    }
    .add-success-img {
        width: 63px;
    }
    .add-success-msg-div {
        color: #202020;
        font-size: 17px;
        line-height: 17px;
        margin: 12px 0;
    }
    .add-sucs-middle-div {
        position: relative;
        float: right;
        right: 50%;
    }
    .add-name-all-div {
        padding: 18px 26px;
        background: #f6f6f6;
        float: right;
        position: relative;
        left: 50%;
    }
    .add-name-div {
        width: 50px;
        height: 50px;
        border-radius: 50px;
        background: #1581cf;
        text-align: center;
        line-height: 50px;
        color: #fff;
        float: left;
        margin-right: 12px;
    }
    .add-user-all-div {
        float: left;
        text-align: left;
        display: table;
        height: 55px;
    }
    .add-table-all-div {
        display: table-cell;
        vertical-align: middle;
    }
    .add-msg-div {
        font-size: 14px;
        color: #202020;
        line-height: 14px;
        margin-bottom: 5px;
    }
    .add-mobile-div {
        color: #15499a;
        font-size: 14px;
        line-height: 14px;
    }
    .add-mobile-span {
        color: #15499a;
        font-size: 14px;
        line-height: 14px;
    }
    .add-mobile-img {
        width: 18px;
        vertical-align: middle;
        margin-left: 6px;
    }
    .add-sucs-back-all-div {
        position: fixed;
        bottom: 20vh;
        left: 0;
        right: 0;
        text-align: center;
    }
    .add-sucs-reward-div {
        color: #202020;
        font-size: 15px;
        line-height: 15px;
    }
    .add-sucs-carry-div {
        width: calc(100% - 50px);
        margin-left: 25px;
        height: 45px;
        background: #15499a;
        color: #fff;
        line-height: 45px;
        border-radius: 5px;
        margin-top: 17px;
        margin-bottom: 23px;
    }
    .add-sucs-go-back-div {
        color: #15499a;
        font-size: 17px;
        line-height: 17px;
        // text-decoration: underline;
        span {
            border-bottom: 1px solid #15499a;
        }
    }
    @media screen and (max-height: 480px) {
        .add-success-all-div {
            text-align: center;
            padding-top: 51px;
        }
        .add-sucs-back-all-div {
            position: fixed;
            bottom: 45px;
            left: 0;
            right: 0;
            text-align: center;
        }
    }
}
</style>


