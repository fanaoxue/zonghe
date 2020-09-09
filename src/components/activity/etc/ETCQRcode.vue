<template>
  <div class="ETCQRcode-container">
    <c-header isShowTitle>
      <x-header :left-options="{ backText: '' }">二维码</x-header>
    </c-header>
    <!-- 时间线 -->
    <div v-show="firstFlag" class="container" ref="imageTofile">
      <div class="qr-box">
        <qrcode class="qr" :value="this.etcLinkUrl" type="img" :size="80"></qrcode>
        <img class="scan" src="../../../assets/imgs/activity/etc/shaoma@2x.png" alt="">
      </div>
    </div>
    <!-- <img class="downloadImg" :src="dataURL" alt="" v-show="!firstFlag" /> -->
  </div>
</template>

<script>
import { Qrcode } from "vux";
// import html2canvas from "html2canvas";
// import longTouch from "@/utils/longTouch";
export default {
  name: "ETCQRcode",
  data() {
    return {
      firstFlag: false, //默认页面不展示
      etcLinkUrl:
        this.$route.query.etcLinkUrl + "&type=42&t=" + new Date().getTime(),
      // dataURL: ""
    };
  },
  components: {
    Qrcode
  },
  // directives: { longTouch },
  created() {},
  mounted() {
    this.$store.commit("updateLoadingStatus", { isLoading: false });
    this.firstFlag = true;
    // this.$nextTick(() => {
    //   this.html2canvas();
    // });
  },
  methods: {
    // handleLongTouch(el) {
    //   console.log("el", el);
    // },
    // html2canvas() {
    //   html2canvas(this.$refs["imageTofile"], {
    //     allowTaint: false,
    //     useCORS: true,
    //     backgroundColor: null,
    //     scale: 2
    //   }).then(canvas => {
    //     let imgUrl = canvas.toDataURL();
    //     this.dataURL = imgUrl;
    //     this.firstFlag = false;
    //   });
    // }
  }
};
</script>

<style lang="less">
.ETCQRcode-container {
  width: 100%;
  height: 100%;
  background: #efefef;
  .downloadImg {
    width: 100%;
    height: 100%;
  }
  .container {
    height: calc(~"100vh - 46px");
    // height: 100vh;
    background: url("../../../assets/imgs/activity/etc/qrbg@2x.png") no-repeat;
    // background-size: cover;
    background-size: 100% 100%;
    .qr-box {
      position: absolute;
      top: 59vh;
      left: 12.5vw;
      width: 90px;
      .qr{
        background: #fff;
        padding: 5px;
        line-height: 100%;
      }
      .scan{
        width: 100%;
        margin-top: 5px;
      }
    }
  }
}
</style>
