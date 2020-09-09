<!-- uploadWeightBill -->
<template>
  <div class="upload-agreement-container">
    <c-header>
      <x-header :left-options="{backText: ''}">上传协议</x-header>
    </c-header>
    <div class="title">请上传和司机签署的纸质电子协议</div>
    <div class="select">
      <selectImage :multiple="true" :file="file" :imgList="imgList" :imgListMaxLength="2"></selectImage>
    </div>
    <!-- <div class="footer" style="height:5rem;"></div> -->
    <div class="button">
      <x-button type="primary" @click.native="clickConfirm" :disabled="disabled">{{buttonName}}</x-button>
    </div>
  </div>
</template>

<script>
import { AppRefreshUpload, AppFinish } from "../../utils/app.js";
import { getBillImage, uploadImage, uploadImgUrl } from "../../api/api";
import selectImage from "../common/selectImage";
export default {
  name: "uploadAgreement",
  data() {
    return {
      pageType: Number(this.$route.query.pageType), // 1 上传协议，2 重新上传协议
      payState: "0",
      taxWaybillId: this.$route.query.taxWaybillId,
      isH5: this.$route.query.isH5 || false, // 是不是h5页面过来的不用调用AppFinish
      xid: this.$route.query.xid,
      imgList: [], //展示的有url
      file: [], //传后台的
      buttonName: "上传",
      contractPhotoUrlList: [], //传后台需要tostring
      disabled: false
    };
  },
  components: {
    selectImage
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      document.title =
        vm.$route.query.pageType == 1 ? "上传纸质协议" : "查看协议";
    });
  },
  computed: {},
  mounted() {
    this.initPageData();
    if (this.pageType === 2) {
      this._getBillImage();
    }
    this.$store.commit("updateLoadingStatus", { isLoading: false });
  },
  methods: {
    initPageData() {
      switch (this.pageType) {
        case 1:
          this.buttonName = "上传";
          break;
        case 2:
          this.buttonName = "确认修改";
          break;
        default:
          this.buttonName = "上传";
          break;
      }
    },
    _getBillImage() {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      let json = {
        imageType: 3,
        xid: this.xid
      };
      getBillImage(json).then(res => {
        this.$store.commit("updateLoadingStatus", { isLoading: false });
        if (res.data.reCode === "0") {
          let htz = res.data.result.htz;
          htz.forEach(val => {
            this.imgList.push({ name: "", src: val.origPath });
            this.file.push(null);
            // this.contractPhotoUrlList.push(val.origPath);
          });
        } else {
          this.$vux.toast.text("网络异常，请稍后再试~~~", "middle");
        }
      });
    },
    _uploadImgUrl() {
      let json = {
        taxWaybillId: this.taxWaybillId,
        xid: this.xid,
        contractPhotoUrl: this.contractPhotoUrlList.toString()
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
    clickConfirm() {
      this.disabled = true;
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      this._clickConfirm();
    },
    async _clickConfirm() {
      // this.imgList.forEach(res=>{
      //   this.contractPhotoUrlList.push(res.src);
      // })
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
        }
      }
      this.contractPhotoUrlList = this.imgList.map((currentValue, index, arr) => {
        return this.file[index] ? fileUrl.shift() : currentValue.src;
      });
      // for (let i = 0; i < this.file.length; i++) {
      //   if (this.file[i]) {
      //     try {
      //       let res = await uploadImage(this.file[i]);
      //       if (res.data.reCode !== "0") {
      //         this.$store.commit("updateLoadingStatus", { isLoading: false });
      //         this.disabled = false;
      //         this.$vux.toast.text(res.data.reInfo, "middle");
      //         uploadBoolean = false;
      //         break;
      //       }
      //       this.contractPhotoUrlList.push(res.data.result.url);
      //     } catch (e) {
      //       this.$store.commit("updateLoadingStatus", { isLoading: false });
      //       this.disabled = false;
      //       this.$vux.toast.text("网络异常，请稍后再试~~~", "middle");
      //     }
      //   } else if (this.imgList[i]) {
      //     this.contractPhotoUrlList.push(this.imgList[i].src);
      //   }
      // }
      if (!uploadBoolean) {
        return;
      }

      // 提交url
      try {
        if (this.contractPhotoUrlList.length === 0) {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          this.disabled = false;
          this.$vux.toast.text("图片不能为空！", "middle");
          return;
        }
        await this._uploadImgUrl();
      } catch (e) {
        this.$store.commit("updateLoadingStatus", { isLoading: false });
        this.disabled = false;
        // this.$vux.toast.text("网络异常，请稍后再试~~~", "middle");
      }
      // 返回APP并通知
      if (this.pageType === 1) {
        this.$vux.toast.text("上传成功", "middle");
        AppRefreshUpload({ type: "1", taxWaybillId: this.taxWaybillId });
      } else {
        this.$vux.toast.text("修改成功", "middle");
      }
      if (!this.isH5) {
        setTimeout(() => {
          AppFinish(-1);
        }, 1000);
      } else {
        this.$router.back(-1);
      }
    }
  }
};
</script>
<style lang='less'>
.upload-agreement-container {
  min-height: 100%;
  width: 100%;
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
    margin: 10px auto;
    width: 90% !important;
  }
  .title {
    font-size: 15px;
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    color: #202020;
    padding: 15px;
  }
  .select {
    padding: 15px;
    background: #fff;
  }
}
</style>
