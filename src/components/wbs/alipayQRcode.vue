<template>
    <div class="alipay-qrcode-container">
        <!-- <c-header>
      <x-header :left-options="{backText: ''}">支付宝推荐码</x-header>
    </c-header> -->
        <!-- 时间线 -->
        <div v-show="showPage == true" class="container">
            <div class="box">
                <div class="title">
                    <img src="../../assets/imgs/wbs/xiazai_icon@2x.png" alt="" /> 如何下载？<img src="../../assets/imgs/wbs/xiazai_icon@2x.png" alt="" />
                </div>
                <div class="step">
                    <div class="tip">第一步：</div>
                    出示此二维码给司机扫描
                </div>
                <div class="step">
                    <div class="tip">第二步：</div>
                    引导司机打开好运宝APP扫一扫下载支付宝
                </div>
                <div class="step">
                    <div class="tip">第三步：</div>
                    引导司机完成支付宝实名认证
                </div>
                <div class="qrcode-box">
                    <div>
                        <qrcode :value="this.url" type="img" :size="115"></qrcode>
                    </div>
                    扫描下载支付宝
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Qrcode } from 'vux';
import { getAlipayQRcode } from '../../api/api.js';
export default {
    name: 'alipayQRcode',
    data() {
        return {
            showPage: false, //默认页面不展示
            url: ''
        };
    },
    // beforeRouteEnter(to,from,next){
    //     next();
    // },
    created() {},
    mounted() {
        getAlipayQRcode().then(res => {
            if (res.data.reCode == '0') {
                this.url = res.data.result.hkb_h5_url;
            } else {
                this.$vux.toast.text(res.data.reInfo, 'middle');
            }
            this.$store.commit('updateLoadingStatus', { isLoading: false });
            this.showPage = true;
        });
        this.$store.commit('updateLoadingStatus', { isLoading: false });
        this.showPage = true;
    },
    methods: {},
    components: {
        Qrcode
    }
};
</script>

<style lang="less">
.alipay-qrcode-container {
    width: 100%;
    height: 100%;
    .container {
        width: 100vw;
        height:100vh;
        // width: 100%;
        // height: 100%;
        // position: fixed;
        background-image: url(../../assets/imgs/wbs/qrcodebg@2x.png);
        background-repeat: no-repeat;
        overflow: hidden;
        background-size: 100% 100%;
        // background-size: cover;
        display: flex;
        align-items: flex-end;
        border: none;
        .box {
            width: 100%;
            display: flex;
            justify-content: flex-start;
            flex-direction: column;
            padding: 0 12vw 12vh;
            height: 50vh;
            .title {
                font-size: 23px;
                font-family: PingFang-SC-Bold;
                font-weight: bold;
                color: rgba(26, 100, 210, 1);
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                @media screen and (max-height: 569px) {
                    font-size: 18px;
                }
                img {
                    height: 20px;
                }
            }
            .step {
                display: flex;
                font-family: PingFang-SC-Bold;
                font-weight: bold;
                color: rgba(32, 32, 32, 1);
                font-size: 14px;
                margin-bottom: 6px;
                @media screen and (max-height: 569px) {
                    font-size: 12px;
                    margin-bottom: 3px;
                }
                .tip {
                    white-space: nowrap;
                }
            }
            .qrcode-box {
                text-align: center;
                font-family: PingFang-SC-Medium;
                font-weight: bold;
                color: rgba(32, 32, 32, 1);
                font-size: 12px;
                flex: auto;
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
                align-items: center;
                & > div {
                    padding: 5px;
                    border-radius: 5px;
                    box-shadow: 0px 0px 5px 0px rgba(0, 47, 121, 0.15);
                    border-radius: 5px;
                    background: #fff;
                }
            }
        }
    }
}
</style>
