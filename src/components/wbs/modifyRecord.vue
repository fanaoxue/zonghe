<template>
    <div class="modify-record">
        <c-header>
            <x-header :left-options="{ backText: '' }">修改记录</x-header>
        </c-header>
        <!-- <div class="content" v-show="flag == '1' ? true : false">
            <img src="../../assets/imgs/pipeixinxi_icon@2x.png" alt="" width="45px" height="50px">
            <p class="dash">当前运单无修改记录~</p>
        </div> -->
        <div class="way-bill-msg" v-for="(item, val) in resultMsg" v-bind:key="val">
            <div class="way-order-num1">
                <div class="pay-msg-list">
                    <span class="msg-left yellow">修改项目：</span>
                    <span class="msg-right dark">{{ item.modifyItem }}</span>
                </div>
                <div class="pay-msg-list">
                    <span class="msg-left yellow">修&nbsp;改&nbsp;前&nbsp;：</span>
                    <span class="msg-right dark">{{ item.modifyBefore }}</span>
                </div>
                <div class="pay-msg-list">
                    <span class="msg-left yellow">修&nbsp;改&nbsp;后&nbsp;：</span>
                    <span class="msg-right dark">{{ item.modifyAfter }}</span>
                </div>
                <div class="pay-msg-list dotted">
                    <span class="msg-left dash">修改时间：</span>
                    <span class="msg-right dark">{{ item.modifiedTime }}</span>
                </div>
                <div class="pay-msg-list">
                    <span class="msg-left dash">修&nbsp;改&nbsp;人&nbsp;：</span>
                    <span class="msg-right ">{{ item.modifyRealName }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { modifyRecord } from '../../api/api.js';
export default {
    name: 'modifyRecord',
    data() {
        return {
            taxWaybillId: this.$route.query.taxWaybillId,
            // flag: '1',
            resultMsg: []
        };
    },
    mounted() {
        let json = {
            taxWaybillId: this.taxWaybillId
        };
        //修改记录查询
        this.$nextTick(() => {
            modifyRecord(json)
                .then(res => {
                    this.$store.commit('updateLoadingStatus', { isLoading: false });
                    if (res.data.reCode === '0') {
                        this.resultMsg = res.data.result;
                        // if(this.resultMsg.length === 0){
                        //     this.flag = '1'
                        // }else{
                        //     this.flag = '0'
                        // }
                    }
                })
                .catch(err => {
                    this.$store.commit('updateLoadingStatus', { isLoading: false });
                    console.log(err);
                });
        });
    }
};
</script>
<style lang="less">
.modify-record {
    width: 100%;
    background-color: #efefef;
    position: absolute;
    top: 0rem;
    min-height: 100%;
    height: auto;
    .content {
        margin: 5rem auto;
        text-align: center;
    }
    .way-bill-msg {
        width: 95%;
        text-align: start;
        height: auto;
        background-color: #ffffff;
        border-radius: 10px;
        margin: 1rem auto;
        .way-order-num1 {
            min-height: 36px;
            height: auto;
            margin: 0 12px;
            font-size: 15px;
            .pay-msg-list {
                display: flex;
                align-items: center;
                min-height: 36px;
                height: auto;
                // line-height: 36px;
                .msg-left {
                    min-width: 5em;
                    text-align: right;
                }
            }
            .yellow {
                color: #ffba00;
            }
            .dark {
                color: #202020;
            }
            .dotted {
                border-top: 1px dotted #dfdfdf;
            }
        }
    }
    .dash {
        color: #797979;
    }
}
</style>
