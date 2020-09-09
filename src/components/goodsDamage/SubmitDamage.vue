<!-- SubmitDamage -->
<template>
  <div class="SubmitDamage">
    <c-header class="header">
      <van-nav-bar :title="isEdit?'确认货损':'查看货损'" left-arrow @click-left="onClickLeft" />
    </c-header>
    <div class="container">
      <div class="item">
        <div class="title">1.货损现场照片</div>
        <div class="img_container">
          <div
            class="img_box"
            v-for="(item, index) in lossScenePhoto"
            :key="index"
            @click="seeImg(lossScenePhoto, index)"
          >
            <img :src="item" alt="货损现场照片" />
          </div>
        </div>
      </div>
      <div class="item">
        <div class="title">2.货损凭证照片</div>
        <div class="img_container">
          <div
            class="img_box"
            v-for="(item, index) in lossEvidencePhoto"
            :key="index"
            @click="seeImg(lossEvidencePhoto, index)"
          >
            <img :src="item" alt="货损凭证照片" />
          </div>
        </div>
      </div>
      <div class="item">
        <div class="title">
          3.车身照片(需要包含前、后、45度角的照片至少各一张，车牌清晰可见）
        </div>
        <div class="img_container">
          <div
            class="img_box"
            v-for="(item, index) in carPhoto"
            :key="index"
            @click="seeImg(carPhoto, index)"
          >
            <img :src="item" alt="车身照片" />
          </div>
        </div>
      </div>
      <div class="item">
        <div class="title">
          <img :src="bitian" alt width="8" height="8" />
          <span>4.货损金额</span>
        </div>
        <van-field v-model="orgLossFee" type="number" :disabled="!isEdit">
          <template #button>
            <div>元</div>
          </template>
        </van-field>
      </div>
    </div>
    <div class="footer" v-if="isEdit">
      <van-button
        class="btn"
        @click="submitClick()"
        type="primary"
        size="large"
        :loading="btnLoading"
        >确认货损</van-button
      >
    </div>
  </div>
</template>

<script>
import { NavBar, Field, Button, ImagePreview, Toast } from "vant";
import {
  getLossEnsureId,
  submitDamage,
  submitDdMessage
} from "@/api/goodsDamage";
import { AppUpdateWaybillData } from "@/utils/app.js";
export default {
  name: "SubmitDamage",
  data() {
    return {
      btnLoading: false,
      dataList: [],
      bitian: require("../../assets/imgs/wbs/bitian_icon@2x.png"),
      taxWaybillId: this.$route.query.taxWaybillId || "",
      isFromH5: this.$route.query.isFromH5 || "0",
      lossScenePhoto: [],
      lossEvidencePhoto: [],
      carPhoto: [],
      orgConfirmLossTime: "",
      orgLossFee: 0
    };
  },
  components: {
    vanNavBar: NavBar,
    vanButton: Button,
    vanField: Field,
    ImagePreview
  },
  computed: {
    isEdit() {
      return this.orgConfirmLossTime==''
    }
  },
  mounted() {
    this.$store.commit("updateLoadingStatus", { isLoading: false });
    this._getLossEnsureId();
  },
  methods: {
    onClickLeft() {
      this.$router.back();
    },
    goSuccess() {
      this.$router.push({
        path: "/SubmitDamageSuccess",
        query: {
          taxWaybillId: this.taxWaybillId,
          isFromH5: this.isFromH5
        }
      });
    },
    seeImg(list, index) {
      ImagePreview({
        images: list,
        startPosition: index,
        closeOnPopstate: true,
        closeable: true,
        onClose() {
          // do something
        }
      });
    },
    validate() {
      if (this.orgLossFee == '') {
        Toast('货损金额必填!')
        return false
      }
      if (Number(this.orgLossFee) <= 0) {
        Toast('货损金额必须大于0!')
        return false
      }
      return true
    },
    submitClick() {
      this.btnLoading = true;
      if (!this.validate()) {
        this.btnLoading = false;
        return
      }
      this._submitDamage()
        .then(res => {
          this.btnLoading = false;
          this._submitDdMessage(res).then(res => {
            this.updateApp();
            this.goSuccess();
          });
        })
        .catch(() => {
          this.btnLoading = false;
        });
    },
    _getLossEnsureId() {
      return new Promise((resolve, reject) => {
        this.$store.commit("updateLoadingStatus", { isLoading: true });
        getLossEnsureId({ taxWaybillId: this.taxWaybillId })
          .then(res => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode === "0") {
              const { result } = res.data;
              let {
                lossScenePhoto = [],
                lossEvidencePhoto = [],
                carPhoto = [],
                orgConfirmLossTime = "",
                orgLossFee = 0,
                driverLossFee = 0,
                ensurerLossFee = 0
              } = result;
              this.lossScenePhoto = lossScenePhoto.split(",") || [];
              this.lossEvidencePhoto = lossEvidencePhoto.split(",") || [];
              this.carPhoto = carPhoto.split(",") || [];
              this.orgConfirmLossTime = orgConfirmLossTime;
              // 优先保障员、企业、司机
              if (Number(ensurerLossFee) > 0) {
                this.orgLossFee = ensurerLossFee;
              } else if(Number(orgLossFee) > 0){
                this.orgLossFee = orgLossFee;
              } else {
                this.orgLossFee = driverLossFee;
              }
              window.document.title = this.isEdit?'确认货损':'查看货损';
              resolve();
            } else {
              this.$vux.toast.text(res.data.reInfo, "middle");
              reject();
            }
          })
          .catch(error => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.$vux.toast.text(error.message, "middle");
            reject();
          });
      });
    },
    _submitDamage() {
      return new Promise((resolve, reject) => {
        this.$store.commit("updateLoadingStatus", { isLoading: true });
        submitDamage({
          taxWaybillId: this.taxWaybillId,
          orgLossFee: this.orgLossFee
        })
          .then(res => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode === "0") {
              const { result } = res.data;
              const { msg = "" } = result;
              resolve(msg);
            } else {
              this.$vux.toast.text(res.data.reInfo, "middle");
              reject();
            }
          })
          .catch(error => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.$vux.toast.text(error.message, "middle");
            reject();
          });
      });
    },
    _submitDdMessage(msg) {
      return new Promise((resolve, reject) => {
        this.$store.commit("updateLoadingStatus", { isLoading: true });
        submitDdMessage({
          content: msg
        })
          .then(res => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode === "0") {
              resolve();
            } else {
              this.$vux.toast.text(res.data.reInfo, "middle");
              reject();
            }
          })
          .catch(error => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.$vux.toast.text(error.message, "middle");
            reject();
          });
      });
    },
    updateApp() {
      let json = {
        taxWaybillId: this.taxWaybillId, //运单号
        type: "3",
        content: {
          lookLossFlag: '0'
        }
      };
      try {
        AppUpdateWaybillData(json);
      } catch (error) {
        console.log(error)
      }
    },
  }
};
</script>
<style lang="less">
.SubmitDamage {
  background: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  // /deep/.van-field__control {
  //   background: rgba(252, 252, 252, 1);
  //   border: 1px solid rgba(211, 211, 212, 1);
  //   border-radius: 4px;
  //   width: 100px;
  //   padding: 0 7px;
  // }
  /deep/.van-field {
    padding: 0;
  }
  .container {
    padding: 20px 16px;
    font-size: 15x;
    font-weight: 500;
    color: rgba(32, 32, 32, 1);
    .item {
      padding-bottom: 10px;
      input {
        background: rgba(252, 252, 252, 1);
        border: 1px solid rgba(211, 211, 212, 1);
        border-radius: 4px;
        width: 100px;
        padding: 0 7px;
      }
    }
    .title {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      line-height: 1.4;
    }
    .img_container {
      display: flex;
      flex-wrap: wrap;
      // justify-content: space-between;
      .img_box {
        width: 90px;
        height: 68px;
        margin-bottom: 10px;
        margin-right: 10px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .footer {
    flex: 1;
    padding: 30px 25px;
    background: #ececec;
    .btn {
      background: rgba(21, 73, 154, 1);
      border-color: rgba(21, 73, 154, 1);
      border-radius: 5px;
      font-size: 16px;
      font-weight: 500;
    }
  }
}
</style>
