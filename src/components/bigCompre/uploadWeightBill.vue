<template>
  <div class="upload-weight-bill2-container">
    <c-header>
      <x-header :left-options="{ backText: '' }">{{isSeePageType ? '查看磅单':'上传磅单'}}</x-header>
    </c-header>
    <div class="example">
      <divider class="divider-text">拍摄示例</divider>
      <div class="example-box">
        <div class="example-box-item example-box-item-left">
          <img class="example-img" src="../../assets/imgs/wbs/shilitupian_img@2x.png" alt srcset />
        </div>
        <div class="example-box-item">
          <div class="example-box-item-line">
            <img class="nick-icon" src="../../assets/imgs/wbs/shenfenzheng_img@2x.png" alt />保证光源充足!
          </div>
          <div class="example-box-item-line">
            <img class="nick-icon" src="../../assets/imgs/wbs/shenfenzheng_img@2x.png" alt />磅单拍摄完整清晰!
          </div>
        </div>
      </div>
    </div>
    <div class="hint" v-if="pageType===1">
      <span>*请上传全部磅单，全部上传完成后才可支付运费！</span>
    </div>
    <div v-if="pageType == 0">
      <div class="select">
        <selectImage :multiple="false" :count="2" :file="file" :reUpload="true" :imgList="imgList">
          <div slot="select-title" class="select-title">
            <div>装货磅单</div>
            <div>卸货磅单</div>
          </div>
          <div slot="select-text1">上传装货磅单</div>
          <div slot="select-text2">上传卸货磅单</div>
        </selectImage>
      </div>
    </div>
    <div v-if="pageType == 1">
      <div class="select">
        <div class="title">请上传装货磅单</div>
        <selectImage
          :isNoChangeAmount="isSeePageType&&payState==='2'"
          :multiple="true"
          :file="file"
          :reUpload="true"
          :imgList="imgList"
          :imgListMaxLength="imgListMaxLength/2"
          borderStyle="dashed"
        ></selectImage>
      </div>
      <div class="select">
        <div class="title">请上传卸货磅单</div>
        <selectImage
          :isNoChangeAmount="isSeePageType&&payState==='2'"
          :multiple="true"
          :file="file2"
          :reUpload="true"
          :imgList="imgList2"
          :imgListMaxLength="imgListMaxLength/2"
          borderStyle="dashed"
        ></selectImage>
      </div>
    </div>
    <div v-if="pageType == 2">
      <div class="select">
        <div class="title">请上传磅单</div>
        <selectImage
          :isNoChangeAmount="isSeePageType&&payState==='2'"
          :multiple="true"
          :file="file"
          :reUpload="true"
          :imgList="imgList"
          :imgListMaxLength="imgListMaxLength"
          borderStyle="dashed"
        ></selectImage>
      </div>
    </div>
    <div class="footer" style="height:5rem;"></div>
    <div class="button">
      <x-button
        type="primary"
        @click.native="clickConfirm"
        :disabled="disabled"
      >{{ isSeePageType?'确认修改':'确认上传' }}</x-button>
    </div>
  </div>
</template>

<script>
import { AppRefreshUpload, AppFinish } from "../../utils/app.js";
import selectImage from "../common/selectImage";
import { getCookie } from "../../utils/getCookie.js";
import {
  getBillImage,
  uploadImage,
  uploadImgUrl,
  getWeightBillPageType
} from "../../api/api.js";
export default {
  name: "uploadWeightBill2",
  data() {
    return {
      pageType: -1, //0 综合物流榜单页 1 大宗装卸区分页 2 大宗不区分类型页
      payState: "0",
      isSeePageType: this.$route.query.pageType == 2 ? true : false,
      imgListMaxLength: 20,
      file: [], //传后台的
      imgList: [], //展示的有url
      file2: [], //传后台的
      imgList2: [], //展示的有url
      sucOutPhotoUrl: [], // 出库单，即装货磅单url传后台的
      sucReceiptPhotoUrl: [], // 回单，即卸货磅单url传后台的
      taxWaybillId: this.$route.query.taxWaybillId,
      transportLineId: this.$route.query.transportLineId,
      xid: this.$route.query.xid,
      disabled: false,
      classify: this.$route.query.classify
        ? this.$route.query.classify
        : getCookie("classify") //类别分类 0：大宗自有运单(q企业版) 1：大宗外协运单(运营商)
    };
  },
  components: {
    selectImage
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      document.title = vm.isSeePageType ? "查看磅单" : "上传磅单";
      vm.$store.commit("updateLoadingStatus", { isLoading: false });
    });
  },
  computed: {},
  created() {
    this.$store.commit("updateLoadingStatus", { isLoading: true });
    let json = {
      transportLineId: this.transportLineId,
      xid: this.xid,
      taxWaybillId: this.taxWaybillId
    };
    getWeightBillPageType(json).then(res => {
      this.$store.commit("updateLoadingStatus", { isLoading: false });
      if (res.data.reCode !== "0") {
        this.$vux.toast.text(res.data.reInfo, "middle");
      } else {
        this.pageType = Number(res.data.result.pageType);
        this.payState = res.data.result.payState;
        this._getBillImage();
      }
    });
  },
  mounted() {},
  methods: {
    _getBillImage() {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      let json = {
        imageType: 0,
        xid: this.xid
      };
      getBillImage(json).then(res => {
        this.$store.commit("updateLoadingStatus", { isLoading: false });
        if (res.data.reCode === "0") {
          if (this.pageType === 0) {
            this.sucOutPhotoUrl = res.data.result.ckd[0]
              ? res.data.result.ckd[0].origPath
              : "";
            this.sucReceiptPhotoUrl = res.data.result.hd[0]
              ? res.data.result.hd[0].origPath
              : "";
            this.sucOutPhotoUrl &&
              this.imgList.push({ name: "", src: this.sucOutPhotoUrl });
            this.sucReceiptPhotoUrl &&
              this.$set(this.imgList, 1, {
                name: "",
                src: this.sucReceiptPhotoUrl
              });
            // this.imgList.push(
            //   { name: "", src: this.sucOutPhotoUrl },
            //   { name: "", src: this.sucReceiptPhotoUrl }
            // );
          } else if (this.pageType === 1) {
            this.imgList = res.data.result.ckd.map(
              (currentValue, index, arr) => {
                return { name: "", src: currentValue.origPath };
              }
            );
            this.imgList2 = res.data.result.hd.map(
              (currentValue, index, arr) => {
                return { name: "", src: currentValue.origPath };
              }
            );
          } else {
            this.imgList = res.data.result.hd.map(
              (currentValue, index, arr) => {
                return { name: "", src: currentValue.origPath };
              }
            );
          }
        } else {
          this.$vux.toast.text("网络异常，请稍后再试~~~", "middle");
        }
      });
    },
    _uploadImgUrl() {
      let json = {
        taxWaybillId: this.taxWaybillId,
        xid: this.xid,
        sucOutPhotoUrl: this.sucOutPhotoUrl.toString(),
        sucReceiptPhotoUrl: this.sucReceiptPhotoUrl.toString(),
        transTripType: this.pageType === 0 ? "0" : "1"
      };
      return new Promise((resolve, reject) => {
        uploadImgUrl(json).then(res => {
          if (res.data.reCode !== "0") {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.disabled = false;
            this.$vux.toast.text(res.data.reInfo, "middle");
            reject();
          } else {
            resolve(res);
          }
        });
      });
    },
    checkFile() {
      var bool = true;
      if (!this.imgList[0]) {
        this.$vux.toast.text("装货榜单必填！", "middle");
        bool = false;
      }
      if (!this.imgList[1]) {
        this.$vux.toast.text("卸货榜单必填！", "middle");
        bool = false;
      }
      return bool;
    },
    clickConfirm() {
      this.disabled = true;
      if (this.pageType === 0) {
        this.$store.commit("updateLoadingStatus", { isLoading: true });
        if (!this.checkFile()) {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          this.disabled = false;
          return;
        }
        this._clickConfirm_0();
      } else if (this.pageType === 1) {
        if (this.imgList.length != this.imgList2.length) {
          this.$vux1.confirm.show({
            title: "消息提示",
            content: "上传的装货磅单与卸货磅单数量不一致，请核实后再提交！",
            confirmText: "确认",
            cancelText: "继续提交",
            onConfirm: () => {
              // this.$store.commit("updateLoadingStatus", { isLoading: true });
              // this._clickConfirm_1();
              this.disabled = false;
            },
            onCancel: () => {
              this.$store.commit("updateLoadingStatus", { isLoading: true });
              this._clickConfirm_1();
            },
            onClose: () => {
              this.disabled = false;
            }
          });
        } else {
          this.$store.commit("updateLoadingStatus", { isLoading: true });
          this._clickConfirm_1();
        }
      } else {
        if (this.imgList.length % 2 === 1) {
          this.$vux1.confirm.show({
            title: "消息提示",
            content: "上传的装货磅单与卸货磅单数量不一致，请核实后再提交！",
            confirmText: "确认",
            cancelText: "继续提交",
            onConfirm: () => {
              this.disabled = false;
            },
            onCancel: () => {
              this.$store.commit("updateLoadingStatus", { isLoading: true });
              this._clickConfirm_2();
            },
            onClose: () => {
              this.disabled = false;
            }
          });
        } else {
          this.$store.commit("updateLoadingStatus", { isLoading: true });
          this._clickConfirm_2();
        }
      }
    },
    async _clickConfirm_0() {
      this.sucOutPhotoUrl = [];
      this.sucReceiptPhotoUrl = [];
      // 上传图片
      let uploadBoolean = true;

      try {
        if (this.imgList[0] && this.file[0]) {
          let res = await uploadImage([this.file[0]]);
          if (res.data.reCode !== "0") {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.disabled = false;
            this.$vux.toast.text(res.data.reInfo, "middle");
            uploadBoolean = false;
            return;
          } else {
            this.sucOutPhotoUrl.push(res.data.result.urlList[0]);
          }
        } else {
          this.sucOutPhotoUrl.push(this.imgList[0].src);
        }
        if (this.imgList[1] && this.file[1]) {
          let res1 = await uploadImage([this.file[1]]);
          if (res1.data.reCode !== "0") {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.disabled = false;
            this.$vux.toast.text(res1.data.reInfo, "middle");
            uploadBoolean = false;
            return;
          } else {
            this.sucReceiptPhotoUrl.push(res1.data.result.urlList[0]);
          }
        } else {
          this.sucReceiptPhotoUrl.push(this.imgList[1].src);
        }
      } catch (e) {
        this.$store.commit("updateLoadingStatus", { isLoading: false });
        this.disabled = false;
        this.$vux.toast.text("网络异常，请稍后再试~~~", "middle");
        uploadBoolean = false;
      }
      if (!uploadBoolean) {
        return;
      }
      //装货磅单必填
      if (this.sucOutPhotoUrl.length == 0) {
        this.$vux.toast.text("装货磅单必填！", "middle");
        this.$store.commit("updateLoadingStatus", { isLoading: false });
        this.disabled = false;
        return false;
      }
      //卸货磅单必填
      if (this.sucReceiptPhotoUrl.length == 0) {
        this.$vux.toast.text("卸货磅单必填！", "middle");
        this.$store.commit("updateLoadingStatus", { isLoading: false });
        this.disabled = false;
        return false;
      }
      this.commitUrl();
    },
    async _clickConfirm_1() {
      this.sucOutPhotoUrl = [];
      this.sucReceiptPhotoUrl = [];
      // 上传图片
      let uploadBoolean = true;
      let fileUrl = [];
      let fileUrl2 = [];
      if (this.file.filter(Boolean).length !== 0) {
        try {
          let res = await uploadImage(this.file.filter(Boolean));
          if (res.data.reCode !== "0") {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.disabled = false;
            this.$vux.toast.text(res.data.reInfo, "middle");
            uploadBoolean = false;
            return;
          } else {
            fileUrl = res.data.result.urlList;
          }
        } catch (e) {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          this.disabled = false;
          this.$vux.toast.text("网络异常，请稍后再试~~~", "middle");
          uploadBoolean = false;
        }
      }
      if (!uploadBoolean) {
        return;
      }
      this.sucOutPhotoUrl = this.imgList.map((currentValue, index, arr) => {
        return this.file[index] ? fileUrl.shift() : currentValue.src;
      });
      if (this.file2.filter(Boolean).length !== 0) {
        try {
          let res = await uploadImage(this.file2.filter(Boolean));
          if (res.data.reCode !== "0") {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.disabled = false;
            this.$vux.toast.text(res.data.reInfo, "middle");
            uploadBoolean = false;
            return;
          } else {
            fileUrl2 = res.data.result.urlList;
          }
        } catch (e) {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          this.disabled = false;
          this.$vux.toast.text("网络异常，请稍后再试~~~", "middle");
          uploadBoolean = false;
        }
      }
      if (!uploadBoolean) {
        return;
      }
      this.sucReceiptPhotoUrl = this.imgList2.map(
        (currentValue, index, arr) => {
          return this.file2[index] ? fileUrl2.shift() : currentValue.src;
        }
      );
      this.commitUrl();
    },
    async _clickConfirm_2() {
      this.sucOutPhotoUrl = [];
      this.sucReceiptPhotoUrl = [];
      // 上传图片
      let uploadBoolean = true;
      let fileUrl = [];
      if (this.file.filter(Boolean).length !== 0) {
        try {
          let res = await uploadImage(this.file.filter(Boolean));
          if (res.data.reCode !== "0") {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.disabled = false;
            this.$vux.toast.text(res.data.reInfo, "middle");
            uploadBoolean = false;
            return;
          } else {
            fileUrl = res.data.result.urlList;
          }
        } catch (e) {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          this.disabled = false;
          this.$vux.toast.text("网络异常，请稍后再试~~~", "middle");
          uploadBoolean = false;
        }
      }
      if (!uploadBoolean) {
        return;
      }
      this.sucReceiptPhotoUrl = this.imgList.map((currentValue, index, arr) => {
        return this.file[index] ? fileUrl.shift() : currentValue.src;
      });
      this.commitUrl();
    },
    async commitUrl() {
      // 提交url
      try {
        await this._uploadImgUrl();
        // 返回APP并通知
        if (!this.isSeePageType) {
          this.$vux.toast.text("上传成功", "middle");
          if (this.pageType === 0) {
            AppRefreshUpload({ type: "2", taxWaybillId: this.taxWaybillId });
          } else {
            let transTrip = parseInt(
              (this.imgList.length + this.imgList2.length) / 2
            );
            if (transTrip > 0) {
              AppRefreshUpload({
                type: "2",
                taxWaybillId: this.taxWaybillId,
                transTrip: transTrip > 1 ? transTrip + "趟" : ""
              });
            }
          }
        } else {
          if (this.pageType !== 0) {
            let transTrip = parseInt(
              (this.imgList.length + this.imgList2.length) / 2
            );
            if (transTrip > 0) {
              AppRefreshUpload({
                type: "2",
                taxWaybillId: this.taxWaybillId,
                transTrip: transTrip > 1 ? transTrip + "趟" : ""
              });
            }
          }
          this.$vux.toast.text("修改成功", "middle");
        }
        setTimeout(() => {
          AppFinish(-1);
        }, 1000);
      } catch (e) {
        this.$store.commit("updateLoadingStatus", { isLoading: false });
        this.disabled = false;
        // this.$vux.toast.text("网络异常，请稍后再试~~~", "middle");
      }
    }
  }
};
</script>
<style lang='less'>
.upload-weight-bill2-container {
  width: 100%;
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
  }
  .cell-title {
    text-align: right;
    color: #797979;
    // padding-right: 1em;
    width: 8em;
    & > img {
      font-size: 20px;
      vertical-align: middle;
      width: 8px;
      height: 8px;
    }
    & > span {
      line-height: 100%;
      vertical-align: middle;
    }
  }
  .input-sty {
    width: 5em;
    border-radius: 3px;
    text-indent: 2px;
    border: 0;
    font-size: 16px;
    background: #f6f6f6;
    border: 1px solid #dfdfdf;
    height: 1.5em;
    outline: none;
  }
  .weui-cell:before {
    // left: 0px;
    border: none;
  }
  .weui-cell {
    color: #202020;
    .vux-label {
      color: #797979;
    }
    .weui-cell__ft {
      word-break: break-all;
      color: #202020;
    }
    .weui-cell__primary {
      width: 5.5em;
      flex: none;
    }
    .weui-input {
      width: 5em;
      border-radius: 3px;
      text-indent: 2px;
      border: 0;
      font-size: 16px;
      background: #f6f6f6;
      border: 1px solid #dfdfdf;
      height: 1.5em;
      outline: none;
    }
  }
  min-height: 100%;
  position: absolute;
  background: #efefef;
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
    // margin: 10px auto;
    // width: 90% !important;
    border-radius: 0 !important;
    height: 50px;
  }
  .example {
    background: #fff;
    padding: 15px;
    margin-bottom: 10px;
    .divider-text {
      font-size: 17px;
      font-family: PingFang-SC-Bold;
      font-weight: bold;
      color: rgba(18, 18, 18, 1);
      line-height: 48px;
    }
    .example-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .example-box-item-left {
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }
      .example-box-item {
        width: 45%;
        // display: flex;
        .example-img {
          width: 100%;
        }
        .example-box-item-line {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          font-size: 15px;
          font-family: PingFang-SC-Medium;
          font-weight: bold;
          color: rgba(52, 192, 85, 1);
          line-height: 27px;
          .nick-icon {
            width: 18px;
            height: 18px;
            margin-right: 5px;
          }
        }
      }
    }
  }
  .hint {
    background: #fff;
    padding: 18px 15px;
    font-size: 14px;
    font-weight: 500;
    color: rgba(255, 186, 0, 1);
    word-break: break-all;
    @media screen and (max-width: 360px) {
      font-size: 13px;
    }
  }
  .select {
    margin: 10px 0;
    padding: 15px;
    // display: flex;
    background: #fff;
    .title {
      font-size: 18px;
      font-family: PingFang-SC-Bold;
      font-weight: bold;
      color: rgba(0, 0, 0, 1);
      line-height: 24px;
      padding-bottom: 15px;
    }
  }
  .select-title {
    display: flex;
    background: #fff;
    & > div {
      width: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 15px;
      font-family: PingFang-SC-Bold;
      font-weight: bold;
      color: rgba(18, 18, 18, 1);
      padding-bottom: 10px;
    }
  }
}
</style>
