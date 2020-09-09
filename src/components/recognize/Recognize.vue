<template>
  <div class="Recognize_container">
    <c-header :isShowTitle="true">
      <van-nav-bar
        title="证件识别"
        left-arrow
        @click-left="onClickLeft"
        fixed
      ></van-nav-bar>
    </c-header>
    <div class="sub_page_base">
      <van-notice-bar
        color="#202020"
        background="#fff"
        :scrollable="false"
        wrapable
        text="请按照示例上传清晰、无遮挡、摆正对齐的证件"
        v-if="info.recState !== '1' || from === '1'"
      >
        <van-icon slot="left-icon" name="warning" color="#ffba00" size="18" />
      </van-notice-bar>

      <div class="group mt10">
        <p class="result_msg" v-if="info.failMsg">{{ info.failMsg }}</p>
        <!-- 身份证正面 -->
        <recognize-upload
          @callBackGoRecognize="goRecognize"
          @callBackUploadImg="uploadImg"
          @callUpdateWaybill="goUpdateWaybill"
          :cardInfo="idCardInfo"
          :recState="info.recState"
        />
        <!-- 身份证反面 -->
        <recognize-upload
          @callBackGoRecognize="goRecognize"
          @callBackUploadImg="uploadImg"
          :cardInfo="idCardReverseInfo"
          :recState="info.recState"
        />
        <!-- 驾驶证 -->
        <recognize-upload
          @callBackGoRecognize="goRecognize"
          @callBackUploadImg="uploadImg"
          @callUpdateWaybill="goUpdateWaybill"
          :cardInfo="driveCardInfo"
          :recState="info.recState"
        />
        <!-- 行驶证 -->
        <recognize-upload
          @callBackGoRecognize="goRecognize"
          @callBackUploadImg="uploadImg"
          @callUpdateWaybill="goUpdateWaybill"
          :cardInfo="drivingCardInfo"
          :recState="info.recState"
        />
      </div>

      <!-- 车牌颜色 -->
      <van-field
        v-model="activeCartColorName"
        placeholder="请选择车牌颜色"
        input-align="right"
        readonly
        class="cell_main"
        @click="handleChangeCartColor"
      >
        <p slot="label" class="cell_label">
          <span class="cell_yellow">*</span>车牌颜色
        </p>
        <p slot="right-icon" v-if="this.info.recState !== '3'">
          <van-icon name="arrow" />
        </p>
      </van-field>

      <!-- 运政 -->
      <div class="upload_yunzheng">
        <van-cell
          class="cell_main mt10"
          @click="showHideControl = !showHideControl"
        >
          <p slot="title" class="cell_label">
            <span
              class="cell_yellow"
              v-if="
                this.info.rtcPhotoCfg === '1' || this.info.tqcPhotoCfg === '1'
              "
              >*</span
            >上传运证图片
          </p>
          <p slot="right-icon">
            <span
              class="yunzheng_img"
              :class="{ zhankai: !showHideControl }"
            ></span>
          </p>
        </van-cell>
        <div class="yunzheng_group" :class="{ animate: !showHideControl }">
          <recognize-yunzheng
            :yuzhengData="rtcInfo"
            @callBackImgJson="uploadImg"
          />
          <recognize-yunzheng
            :yuzhengData="tqcInfo"
            @callBackImgJson="uploadImg"
          />
        </div>
      </div>

      <div class="pub_fixed_btn" v-if="sendAble">
        <van-button
          class="btn"
          :color="submitDisabled ? '#bcbcbc' : '#15499a'"
          @click="submit"
          :disabled="submitDisabled"
          >提交</van-button
        >
      </div>
    </div>

    <cart-badge-color
      :cartBadgeColorShow="cartBadgeColorShow"
      :cartBadgeColorData="cartBadgeColorData"
      :activeCartColorIndex="activeCartColorIndex"
      @change="cartColorChange"
    />
  </div>
</template>

<script>
import { NoticeBar, NavBar, Icon, Field, Cell, Toast, Button } from "vant";
import ocrLoading from "@/components/common/ocrLoading";
import Vue from "vue";
Vue.use(ocrLoading);
import { selectPhotoUpload, updateCertificateState } from "@/utils/app.js";
import {
  getCertification,
  confirmImage,
  confirmIDCard,
  confirmIDCardReverse,
  confirmDriverLicense,
  confirmDrivingLicense,
  submitCertification
} from "@/api/recognize.js";
import {
  setNativeHead,
  AppFinish,
  openNewWindow,
  getUserInfo
} from "@/utils/app.js";
import Const from "@/utils/const";
import CartBadgeColor from "./components/CartBadgeColor";
import RecognizeUpload from "./components/RecognizeUpload";
import RecognizeYunzheng from "./components/RecognizeYunzheng";

export default {
  name: "Recognize",
  components: {
    vanNavBar: NavBar,
    vanIcon: Icon,
    vanField: Field,
    vanCell: Cell,
    vanNoticeBar: NoticeBar,
    vanButton: Button,
    CartBadgeColor,
    RecognizeUpload,
    RecognizeYunzheng
  },
  data() {
    return {
      taxWaybillId: this.$route.query.taxWaybillId || "",
      from: this.$route.query.from || "", // 来源类型
      driverName: this.$route.query.driverName || "",
      mobileNo: this.$route.query.mobileNo || "",
      cartBadgeNo: this.$route.query.cartBadgeNo || "",
      updateWaybillUrl: this.$route.query.updateWaybillUrl || "",
      photoType: "",
      cartBadgeColorShow: false,
      cartBadgeColorData: Const.CART_BADGE_COLOR_ARR,
      activeCartColorIndex: "0",
      info: {},
      idCardInfo: {
        type: "1",
        title: "上传身份证正面",
        state: "",
        photoUrl: "",
        msg: ""
      },
      driveCardInfo: {
        type: "2",
        title: "上传驾驶证正面",
        state: "",
        photoUrl: "",
        msg: ""
      },
      drivingCardInfo: {
        type: "3",
        title: "上传行驶证正面",
        state: "",
        photoUrl: "",
        msg: ""
      },
      idCardReverseInfo: {
        type: "4",
        title: "上传身份证反面",
        state: "",
        photoUrl: "",
        msg: ""
      },
      rtcInfo: {
        title: "上传道路运输证",
        type: "5",
        photoUrl: ""
      },
      tqcInfo: {
        title: "上传从业资格证",
        type: "6",
        photoUrl: ""
      },
      showHideControl: true, // 是否收起
      isReviseYunZhengFlag: false, // 是否修改了车牌颜色和重新上传了证书
      isSending: false, // 提交是否结束
      category: "",
      classify: "",
      isUploadReverse: ""
    };
  },
  computed: {
    // 车牌名称
    activeCartColorName() {
      return this.cartBadgeColorData[this.activeCartColorIndex];
    },
    // 提交按钮
    sendAble() {
      return (
        !(this.info.recState === "3" && this.isUploadReverse === "0") ||
        this.isReviseYunZhengFlag
      );
    },
    submitDisabled() {
      return (
        this.idCardInfo.photoUrl === "" &&
        this.driveCardInfo.photoUrl === "" &&
        this.drivingCardInfo.photoUrl === "" &&
        this.idCardReverseInfo.photoUrl === ""
      );
    }
  },
  beforeRouteEnter(to, from, next) {
    let json = { isShow: "0" };
    setNativeHead(json);
    next();
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === "mauIndex") {
      // 控制安卓返回
      this.onClickLeft();
      return;
    }
    if (to.name === "modifyWaybill" || to.path === "/bigCompareModifyWaybill" ) {
      let json = { isShow: "1" };
      setNativeHead(json);
    }
    next();
  },
  created() {
    this.$store.commit("updateLoadingStatus", { isLoading: false });
    window.AppJSApi_BackAppPhotoJson = this.receviveImgJson;
    window.AppMesgUserInfoCallBack = this.setUserInfo;
    getUserInfo();
    this.initData(); // 初始化
  },
  methods: {
    // 返回
    onClickLeft() {
      if (this.from === '1') {
        this.$router.back()
      } else {
        AppFinish(-1);
      }
    },
    // 设置角色信息
    setUserInfo(json) {
      let data = JSON.parse(json);
      this.category = data.category;
      this.classify = data.classify;
    },
    // 初始化
    initData() {
      this.$_getCertification().then(res => {
        if (
          this.info.recState === '1' &&
          this.idCardInfo.state === "0" &&
          this.driveCardInfo.state === "0" &&
          this.drivingCardInfo.state === "0" &&
          this.idCardReverseInfo.state === "0" &&
          (this.from === "0" || this.from === "2")
        ) {
          // 列表和建单
          this.$vux1.confirm.show({
            title: "提示",
            confirmText: "好的",
            // cancelText: "取消",
            content: "证件已识别，请点击【提交】即可完成证件识别",
            showCancelButton: false,
            onConfirm: () => {
              this.submit();
            }
          })
        }
      });
    },
    // 判断运政图片是否存在 && 按钮显示
    isRtcTqcPhoto() {
      if (
        this.info &&
        this.info.rtcPhotoCfg === "1" &&
        this.info.tqcPhotoCfg === "1"
      ) {
        return this.rtcInfo.photoUrl && this.tqcInfo.photoUrl;
      }
      if (this.info && this.info.rtcPhotoCfg === "1") {
        return this.rtcInfo.photoUrl;
      }
      if (this.info && this.info.tqcPhotoCfg === "1") {
        return this.tqcInfo.photoUrl;
      }
      return true;
    },
    // 车牌颜色选择
    cartColorChange(activeIndex) {
      if (!isNaN(activeIndex)) {
        // 是数字
        this.activeCartColorIndex = activeIndex;
      }
      this.isReviseYunZhengFlag = true; // 操作并有可能修改了车牌颜色
      this.cartBadgeColorShow = false;
    },
    // 打开车牌颜色
    handleChangeCartColor() {
      if (this.info.recState === "3") return; // 若是全认证成功了，则不可修改
      this.cartBadgeColorShow = true;
    },
    // 获取认证信息
    $_getCertification() {
      return new Promise((resolve, reject) => {
        const loading = Toast.loading({
          message: "加载中"
        });
        getCertification({
          mobileNo: this.mobileNo,
          driverName: this.driverName,
          cartBadgeNo: this.cartBadgeNo
        })
          .then(res => {
            loading.clear();
            if (res.data.reCode === "0") {
              let data = res.data.result;
              this.info = Object.assign({}, data);

              this.idCardInfo = Object.assign({}, this.idCardInfo, data.idCard);
              this.driveCardInfo = Object.assign(
                {},
                this.driveCardInfo,
                data.driveCard
              );
              this.drivingCardInfo = Object.assign(
                {},
                this.drivingCardInfo,
                data.drivingCard
              );
              this.idCardReverseInfo = Object.assign(
                {},
                this.idCardReverseInfo,
                data.idCardReverse
              );

              this.rtcInfo = Object.assign({}, this.rtcInfo, {
                photoUrl: data.rtcPhoto
              });

              this.tqcInfo = Object.assign({}, this.tqcInfo, {
                photoUrl: data.tqcPhoto
              });

              this.isUploadReverse = data.idCardReverse.state || ""; // 是否成功上传身份证反面

              if (
                this.info.rtcPhotoCfg === "1" ||
                this.info.tqcPhotoCfg === "1"
              ) {
                // 有一个必传，上传运政图需展开
                this.showHideControl = false;
              }
              if (
                this.info.cartBadgeColor &&
                Number(this.info.cartBadgeColor) <=
                  this.cartBadgeColorData.length
              ) {
                // 车牌颜色
                this.activeCartColorIndex = this.info.cartBadgeColor;
              }
              resolve();
            } else {
              Toast(res.data.reInfo);
              reject();
            }
          })
          .catch(() => {
            loading.clear();
            reject();
          });
      });
    },
    // 上传图片
    $_confirmImage(imageFile) {
      const loading = Toast.loading({
        message: "加载中"
      });
      return new Promise((resolve, reject) => {
        confirmImage({
          imageFile
        })
          .then(res => {
            loading.clear();
            if (res.data.reCode === "0") {
              resolve(res.data.result.url);
            } else {
              Toast(res.data.reInfo);
              reject();
            }
          })
          .catch(() => {
            loading.clear();
            reject();
          });
      });
    },
    // 身份证正面OCR验证
    $_confirmIDCard(photoUrl) {
      return new Promise((resolve, reject) => {
        confirmIDCard({
          driverName: this.driverName,
          mobileNo: this.mobileNo,
          photoUrl
        })
          .then(res => {
            if (res.data.reCode === "0") {
              resolve(res.data.result);
            } else {
              Toast(res.data.reInfo);
              reject();
            }
          })
          .catch(() => {
            reject();
          });
      });
    },
    // 身份证反面OCR验证
    $_confirmIDCardReverse(photoUrl) {
      return new Promise((resolve, reject) => {
        confirmIDCardReverse({
          driverName: this.driverName,
          mobileNo: this.mobileNo,
          idCard: this.idCardInfo.idCard,
          photoUrl
        })
          .then(res => {
            if (res.data.reCode === "0") {
              resolve(res.data.result);
            } else {
              Toast(res.data.reInfo);
              reject();
            }
          })
          .catch(() => {
            reject();
          });
      });
    },
    // 驾驶证OCR验证
    $_confirmDrivingLicense(photoUrl) {
      return new Promise((resolve, reject) => {
        confirmDriverLicense({
          driverName: this.driverName,
          mobileNo: this.mobileNo,
          photoUrl
        })
          .then(res => {
            if (res.data.reCode === "0") {
              resolve(res.data.result);
            } else {
              Toast(res.data.reInfo);
              reject();
            }
          })
          .catch(() => {
            reject();
          });
      });
    },
    // 行驶证OCR验证
    $_confirmVehicleLicense(photoUrl) {
      return new Promise((resolve, reject) => {
        confirmDrivingLicense({
          driverName: this.driverName,
          mobileNo: this.mobileNo,
          cartBadgeNo: this.cartBadgeNo,
          photoUrl
        })
          .then(res => {
            if (res.data.reCode === "0") {
              resolve(res.data.result);
            } else {
              Toast(res.data.reInfo);
              reject();
            }
          })
          .catch(() => {
            reject();
          });
      });
    },
    // 提交
    $_submitCertification() {
      return new Promise((resolve, reject) => {
        const loading = Toast.loading({
          message: "加载中"
        });
        submitCertification({
          mobileNo: this.mobileNo,
          // driverName: this.idCardInfo.name,
          driverName: this.driverName,
          taxWaybillId: this.taxWaybillId,
          cartBadgeNo: this.cartBadgeNo,
          idCard: this.idCardInfo.idCard,
          driverNo: this.driveCardInfo.idCard,
          idCardFrontPhoto: this.idCardInfo.photoUrl, // 身份证正面
          idCardReversePhoto: this.idCardReverseInfo.photoUrl, // 身份证反面
          driverLicencePhoto: this.driveCardInfo.photoUrl, // 驾驶证
          drivingPermitPhoto: this.drivingCardInfo.photoUrl, // 行驶证
          idState: this.idCardInfo.state, // 身份证正面状态
          driverState: this.driveCardInfo.state, // 驾驶证状态
          drivingState: this.drivingCardInfo.state, // 行驶证状态
          idReverseState: this.idCardReverseInfo.state, // 身份证反面状态
          from: this.from, // 认证来源
          cartBadgeColor: this.activeCartColorIndex,
          rtcPhoto: this.rtcInfo.photoUrl, // 道路运输证
          tqcPhoto: this.tqcInfo.photoUrl // 从业资格证
        })
          .then(res => {
            loading.clear();
            if (res.data.reCode === "0") {
              resolve(res.data.result);
            } else {
              Toast(res.data.reInfo);
              reject();
            }
          })
          .catch(() => {
            loading.clear();
            reject();
          });
      });
    },
    // ocr
    $_OCR(data) {
      let fn = [
        "$_confirmIDCard",
        "$_confirmDrivingLicense",
        "$_confirmVehicleLicense",
        "$_confirmIDCardReverse"
      ];
      return new Promise((resolve, reject) => {
        this[fn[Number(data.photoType) - 1]](data.photoUrl).then(res => {
          resolve(res);
        }).catch(() => {
          reject()
        });
      });
    },
    // 上传图片
    uploadImg(type) {
      this.photoType = type;
      if (type === "4") {
        // 上传身份证反面
        if (this.idCardInfo.state === "2") {
          // 身份证正面对比不一致
          Toast("身份证与运单姓名不一致，请重新上传或联系调度修改运单姓名");
          return;
        }
        if (this.idCardInfo.state !== "0") {
          Toast("请先上传身份证正面图片");
          return;
        }
      }
      this.uploadAndOcr(type);
    },
    // 上传图片及OCR识别
    uploadAndOcr(type) {
      if (this.$sysType === 0) {
        this.$klb.SelectImage({
          success: this.receviveImgJson,
          failed: () => {
            console.log("===failed===");
          },
          data: { type }
        });
      } else {
        selectPhotoUpload({
          isCompress: "1",
          isCut: "1",
          ignoreBySize: "1024"
        });
      }
    },
    // 客户端上传图片回调
    receviveImgJson(json) {
      let imageFile = "";
      try {
        if (this.$sysType === 0) {
          imageFile = json.file.src;
        } else {
          imageFile = JSON.parse(json).photoData;
          imageFile += "data:image/jpeg;base64,";
        }
      } catch (error) {
        Toast("选择图片出错！");
        return;
      }
      this.$_confirmImage(imageFile).then(res => {
        this.orcRecognize(res);
      });
    },
    // OCR识别
    orcRecognize(photoUrls) {
      let photoUrl = photoUrls.split(",")[0];
      if (this.photoType === "5") {
        // 上传道路资格证5
        this.isReviseYunZhengFlag = true;
        this.rtcInfo = Object.assign({}, this.rtcInfo, { photoUrl });
        return;
      }
      if (this.photoType === "6") {
        // 上传从业资格证6
        this.isReviseYunZhengFlag = true;
        this.tqcInfo = Object.assign({}, this.tqcInfo, { photoUrl });
        return;
      }
      const paramData = {
        photoType: this.photoType,
        photoUrl
      };
      this.goRecognize(paramData); // 其他类型走OCR识别
    },
    // 去识别
    goRecognize(data) {
      if (!data.photoUrl || data.photoUrl === "null") {
        this.$vux1.confirm.show({
          title: "提示",
          content: "加载证件图片失败，请重新上传",
          confirmText: "好的"
        });
        return;
      }
      let title = "";
      if (
        data.photoType == "1" ||
        data.photoType == "2" ||
        data.photoType == "4"
      ) {
        title = "正在与公安备案信息比对中";
      } else if (data.photoType == "3") {
        title = "正在与系统信息比对中";
      }

      this.$klb.ocrLoading.show({
        title
      });
      this.$_OCR(data)
        .then(res => {
          let info = res;
          info.type = data.photoType;
          info.photoUrl = data.photoUrl;
          if (info.state === "2") {
            this.$klb.ocrLoading.success();
          } else {
            this.$klb.ocrLoading.failed();
          }
          this.getResult(info);
        })
        .catch(() => {
          this.$klb.ocrLoading.failed();
        });
    },
    // OCR得到结果
    getResult(data) {
      let cardInfoList = [
        "idCardInfo",
        "driveCardInfo",
        "drivingCardInfo",
        "idCardReverseInfo"
      ];
      let cardKey = cardInfoList[Number(data.type) - 1];
      this[cardKey] = Object.assign({}, this[cardKey], data);
      if (
        (this[cardKey].type === "1" || this[cardKey].type === "2") &&
        this[cardKey].state === "2"
      ) {
        let text;
        this[cardKey].type === "1" ? (text = "身份证") : (text = "驾驶证");
        this.$vux1.confirm.show({
          title: "异常提示",
          content: `<div class="yc_tip"><p style="color: #D8070A">${text}信息与司机不一致！</p><p>身份证姓名: ${
            data.name
          }</p><p>司机姓名: ${this.driverName}</p></div>`,
          confirmText: "修改司机姓名",
          cancelText: "重新识别",
          onConfirm: () => {
            this.goUpdateWaybill();
          },
          onCancel: () => {
            // this.uploadImg(this[cardKey].type);
          }
        });
      }
    },
    goUpdateWaybill() {
      if (this.from === "0") {
        // 运输列表入口
        if (this.updateWaybillUrl) {
          // openNewWindow({ url: this.updateWaybillUrl });
          window.location.href = this.updateWaybillUrl;
        } else {
          if (this.category == "0") {
            // 综合物流
            this.$router.push({
              path: "/modifyWaybill",
              query: {
                taxWaybillId: this.taxWaybillId,
                type: "1"
              }
            });
          } else if (this.category == "1") {
            // 大综
            this.$router.push({
              path: "/bigCompareModifyWaybill",
              query: {
                taxWaybillId: this.taxWaybillId,
                type: "1",
                classify: this.classify // 0：自有运单 1：外协运单 2：企业+外协
              }
            });
          } else {
            console.log("异常");
          }
        }
      } else if (this.from === "2") {
        // 2:建单
        if (this.category == "0") {
          // 综合物流
          this.$router.push({
            path: "/modifyWaybill",
            query: {
              taxWaybillId: this.taxWaybillId,
              type: "1"
            }
          });
        } else if (this.category == "1") {
          // 大综
          this.$router.push({
            path: "/bigCompareModifyWaybill",
            query: {
              taxWaybillId: this.taxWaybillId,
              type: "1",
              classify: this.classify // 0：自有运单 1：外协运单 2：企业+外协
            }
          });
        } else {
          console.log("异常");
        }
      } else if (this.from === "1") {
        this.$router.back()
      } else {
        AppFinish(-1);
      }
    },
    // 提交
    submit() {
      if (!this.sendAble || this.isSending) {
        return;
      }
      // 身份证识别成功，反面必须识别成功才能提交
      if (
        this.idCardInfo.state === "0" &&
        this.idCardReverseInfo.state !== "0"
      ) {
        Toast("请上传本人的身份证反面图片");
        return;
      }
      if (
        this.idCardInfo.state === "-2" ||
        this.idCardReverseInfo.state === "-2" ||
        this.driveCardInfo.state === "-2" ||
        this.drivingCardInfo.state === "-2"
      ) {
        this.$vux1.confirm.show({
          content: `<div class="qsb_tip">请先<span>“去识别”</span>已存在的图片</div>`,
          confirmText: "知道了",
          onConfirm: () => {},
          showCancelButton: false
        });
        return;
      }
      if (this.idCardInfo.state === "2" || this.driveCardInfo.state === "2") {
        Toast("身份证对比信息不一致，请核实后提交！");
        return;
      }
      if (this.info.rtcPhotoCfg === "1" && !this.rtcInfo.photoUrl) {
        Toast("请上传道路运输证");
        return;
      }
      if (this.info.tqcPhotoCfg === "1" && !this.tqcInfo.photoUrl) {
        Toast("请上传从业资格证");
        return;
      }
      // if (
      //   this.idCardInfo.photoUrl === "" ||
      //   this.driveCardInfo.photoUrl === "" ||
      //   this.drivingCardInfo.photoUrl === "" ||
      //   (this.idCardInfo.photoUrl !== "0" &&
      //     this.driveCardInfo.photoUrl !== "0" &&
      //     this.driveCardInfo.drivingCardInfo !== "0")
      // ) {
      //   let urlData = {
      //     cartBadgeNo: this.cartBadgeNo,
      //     mobileNo: this.mobileNo,
      //     realName: this.idCardInfo.name,
      //     idCard: this.idCardInfo.idCard,
      //     state: "1",
      //     msg: "证件识别提交成功，请完善其它证件信息！",
      //     dcaWsUserId: ""
      //   };
      //   this.$router.push({
      //     path: "/discernSuccess",
      //     query: {
      //       result: JSON.stringify(urlData),
      //       from: this.from
      //     }
      //   });
      //   return;
      // }
      this.isSending = true;
      this.$_submitCertification().then(res => {
        this.isSending = false;
        // 更新客户端列表
        let json = {
          recState: res.state,
          cartBadgeNo: this.cartBadgeNo,
          driverName: this.driverName,
          mobileNo: this.mobileNo
        };
        updateCertificateState(json);
        // 跳转成功
        let urlData = {
          cartBadgeNo: this.cartBadgeNo,
          mobileNo: this.mobileNo,
          realName: this.idCardInfo.name,
          idCard: this.idCardInfo.idCard,
          state: res.state,
          msg: res.msg,
          dcaWsUserId: res.dcaWsUserId
        };
        this.$router.push({
          path: "/discernSuccess",
          query: {
            result: JSON.stringify(urlData),
            from: this.from
          }
        });
      }).catch(() => {
        this.isSending = false;
      });
    }
  }
};
</script>

<style lang="less" scoped>
.Recognize_container {
  .sub_page_base {
    background: #efefef;
    min-height: 100vh;
    box-sizing: border-box;
    padding-top: 45px;
  }
  color: #444444;
  padding-bottom: 46px;
  /deep/ .van-notice-bar__wrap {
    padding-left: 4px;
  }
  .mt10 {
    margin-top: 10px;
  }
  .group {
    padding: 0 10px;
    margin-bottom: 17px;
    background-color: #ffffff;
    overflow: hidden;
    .result_msg {
      margin-top: 20px;
      padding: 5px 15px;
      font-size: 16px;
      color: #ffffff;
      background-color: #ffba00;
      border-radius: 5px;
    }
  }
  .cell_main {
    padding: 14px 16px;
    &::after {
      border-bottom: none;
    }
    .cell_label {
      color: #121212;
      font-size: 17px;
      font-weight: bold;
      .cell_yellow {
        padding-right: 5px;
        color: #ffba00;
      }
    }
    .yunzheng_img {
      display: inline-block;
      height: 12px;
      width: 13px;
      background: url("~@/assets/imgs/recognize/zhankai_img.png") no-repeat
        center;
      background-size: 100%;
      transition: transform 0.3s, -webkit-transform 0.3s;
      &.zhankai {
        background: url("~@/assets/imgs/recognize/zhankaishangi_img.png")
          no-repeat center;
        background-size: 100%;
        transform: rotate(360deg);
      }
    }
    /deep/ .van-field__control {
      font-size: 15px;
      color: #121212;
    }
  }
  .upload_yunzheng {
    margin: 17px 0;
    .yunzheng_group {
      padding: 0 10px;
      overflow: hidden;
      background: #fff;
      max-height: 0;
      transition: max-height 0.5s cubic-bezier(0, 1, 0, 1);
      &.animate {
        max-height: 318px;
        transition: max-height 1s cubic-bezier(0, 1, 0, 1);
      }
    }
  }
  .driv_tip {
    text-align: center;
    font-size: 14px;
    padding-top: 10px;
  }
  .pub_fixed_btn {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background: #fff;
    opacity: 1;
    .btn {
      width: 100%;
    }
  }
}
</style>

<style lang="less">
.qsb_tip {
  span {
    color: #15499a;
    font-size: 18px;
  }
}
</style>
