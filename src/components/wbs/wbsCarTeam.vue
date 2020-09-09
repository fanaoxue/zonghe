<template>
  <div class="wbs-car-team">
    <c-header>
      <x-header :left-options="{ backText: '' }">填写承运信息</x-header>
    </c-header>
    <div style="height:10px;background-color:#EFEFEF"></div>
    <cell v-show="wbBusinessType != 2">
      <span slot="icon">
        <img
          class="star-icon-style"
          src="../../assets/imgs/wbs/zhuyi_icon_yellow@2x.png"
          alt
          style="float:left;margin-right:8px;"
        />
        <p style="font-size:14px;color:#FFBA00">为保证运输协议规范有效，请务必准确填写司机手机号和司机姓名。协议生成后不可修改！！</p>
      </span>
    </cell>
    <div style="height:10px;background-color:#EFEFEF" v-show="wbBusinessType != 2"></div>
    <div class="car-msg-cxt" v-show="wbBusinessType != 2">
      <div class="car-title-cxt">
        <span class="title-star-style">*</span>
        <span>请手动填写承运信息或从</span>
        <div class="car-choose-btn" @click="chooseBtnClick()">我的车队选择</div>
      </div>
    </div>
    <div class="car-ipt-cxt">
      <group label-align="right" label-width="5.8em">
        <x-input
          type="tel"
          ref="PhoneNumber"
          v-model.trim="weyBillSecond1.mobileNo"
          is-type="china-mobile"
          :max="11"
          placeholder="请输入司机手机"
          :disabled="wbBusinessType == 2"
          @on-blur="phoneGetName()"
        >
          <div slot="label">
            <img
              class="star-icon-style1"
              src="../../assets/imgs/wbs/bitian_icon@2x.png"
              alt
              style="vertical-align:middle;"
            />
            <span style="vertical-align:middle;">司机手机：</span>
          </div>
        </x-input>
        <x-input
          :rows="1"
          autosize
          :show-counter="false"
          placeholder="请输入司机姓名"
          :max="64"
          v-model.trim="weyBillSecond1.driverName"
          :disabled="nameDisabled || wbBusinessType == 2"
        >
          <div slot="label">
            <img
              class="star-icon-style1"
              src="../../assets/imgs/wbs/bitian_icon@2x.png"
              alt
              style="vertical-align:middle;"
            />
            <span style="vertical-align:middle;">司机姓名：</span>
          </div>
        </x-input>
        <cell title="车牌号码：" value-align="left" is-link @click.native="carNumIpt">
          <span
            :class="{ 'cell-left-style': weyBillSecond1.cartBadgeNo !== '请输入车牌号码','grey': wbBusinessType == 2}"
          >{{ weyBillSecond1.cartBadgeNo }}</span>
          <div slot="title">
            <img
              class="star-icon-style1"
              src="../../assets/imgs/wbs/bitian_icon@2x.png"
              alt
              style="vertical-align:middle;"
            />
            <span>车牌号码：</span>
          </div>
        </cell>
        <cell value-align="left" is-link @click.native="show1 = true">
          <span
            :class="{ 'cell-left-style': weyBillSecond1.carType !== '请选择车型' }"
          >{{ weyBillSecond1.carType }}</span>
          <div slot="title">
            <img
              class="star-icon-style1"
              src="../../assets/imgs/wbs/bitian_icon@2x.png"
              alt
              style="padding-right: 4px;vertical-align:middle;"
            />
            <span>车型：</span>
          </div>
        </cell>
        <cell value-align="left" is-link @click.native="show13 = true">
          <span
            :class="{ 'cell-left-style': weyBillSecond1.carLength !== '请选择车长' }"
          >{{ weyBillSecond1.carLength }}</span>
          <div slot="title">
            <img
              class="star-icon-style1"
              src="../../assets/imgs/wbs/bitian_icon@2x.png"
              alt
              style="padding-right: 4px;vertical-align:middle;"
            />
            <span>车长(米)：</span>
          </div>
        </cell>
        <cell value-align="left" is-link @click.native="show14 = true">
          <span
            :class="{ 'cell-left-style': weyBillSecond1.carTonNumber !== '请选择吨位' }"
          >{{ weyBillSecond1.carTonNumber }}</span>
          <div slot="title">
            <img
              class="star-icon-style1"
              src="../../assets/imgs/wbs/bitian_icon@2x.png"
              alt
              style="padding-right: 4px;vertical-align:middle;"
            />
            <span>吨位(吨)：</span>
          </div>
        </cell>
        <x-textarea
          title="备注："
          :height="40"
          placeholder="请填写备注信息"
          :max="64"
          v-model="weyBillSecond1.note"
        ></x-textarea>
      </group>
    </div>
    <actionsheet v-model="show1" :menus="menus1" @on-click-menu="carTypeBtn"></actionsheet>
    <popup v-model="show15" position="bottom">
      <popup-header
        left-text="取消"
        right-text="确定"
        @on-click-left="show15 = false"
        @on-click-right="cartTypeBtn()"
        title="更多车型"
      ></popup-header>
      <div class="car-msg-choose">
        <div
          class="car-choose-btn"
          :class="{ 'choose-btn-active': activeFlag3 === index }"
          @click="activeFlag3 = index"
          v-for="(item, index, key) in cartType"
          :key="key"
        >{{ item.type }}</div>
      </div>
    </popup>

    <popup v-model="show13" position="bottom" max-height="80%">
      <popup-header
        left-text="取消"
        right-text="确定"
        @on-click-left="show13 = false"
        @on-click-right="carLongBtn()"
        title="请选择车长(米)"
      ></popup-header>
      <div class="car-msg-choose">
        <div
          class="car-choose-btn"
          :class="{ 'choose-btn-active': activeFlag === index }"
          @click="activeFlag = index"
          v-for="(item, index, key) in carLongList"
          :key="key"
        >{{ item.cartAttr }}米</div>
      </div>
      <!-- 新添加的手动输入车长 -->
      <div class="self-ipt">
        <span>其他：</span>
        <input type="number" placeholder="请输入车长" v-model="carLen" @click="activeFlag = -1" />
        <span>米</span>
      </div>
      <!-- <div style="height:32px;"></div> -->
    </popup>

    <popup v-model="show14" position="bottom" max-height="80%">
      <popup-header
        left-text="取消"
        right-text="确定"
        @on-click-left="show14 = false"
        @on-click-right="carTonBtn()"
        title="请选择车吨位(吨)"
      ></popup-header>
      <div class="car-msg-choose">
        <div
          class="car-choose-btn"
          :class="{ 'choose-btn-active': activeFlag1 === index }"
          @click="activeFlag1 = index"
          v-for="(item, index, key) in carTonList"
          :key="key"
        >{{ item.cartAttr }}吨</div>
      </div>
      <!-- 新添加的手动输入吨位 -->
      <div class="self-ipt">
        <span>其他：</span>
        <input type="number" placeholder="请输入吨位" v-model="carTon" @click="activeFlag1 = -1" />
        <span>吨</span>
      </div>
      <!-- <div style="height:32px;"></div> -->
    </popup>

    <div style="height:60px;"></div>
    <div id="button">
      <x-button
        type="primary"
        style="width:90%;height:48px;background-color:#15499A;margin: 10px auto;"
        :style="{ backgroundColor: btnState === 1 ? '#15499A' : '#9e9e9e' }"
        @click.native="nextBtnClick()"
      >下一步</x-button>
    </div>
  </div>
</template>

<script>
import {
  queryWaybill,
  checkOrderAgain,
  driverNext,
  buildWaybillAgain,
  phoneGetName
} from "../../api/api.js";
// import { openElectronicOilCard } from "../../api/apiOil.js";
export default {
  name: "wbsCarTeam",
  data() {
    return {
      show1: false,
      show13: false,
      show14: false,
      show15: false,
      show13Waiting: 0,
      show13Msg: "",
      show14Waiting: 0,
      show14Msg: "",
      weyBillSecond1: {
        cartBadgeNo: "请输入车牌号码",
        driverName: "",
        mobileNo: "",
        carType: "请选择车型",
        carLength: "请选择车长",
        carTonNumber: "请选择吨位",
        note: "",
        idCard: "", //收款人身份证
        alipayNo: "", //收款人支付宝
        zyCapitalCfg: "",
        payBankName: "",
        payBankNo: ""
      },
      carLen: "", //输入的车长
      carTon: "", //输入的吨位
      menus1: {
        menu1: "厢式",
        menu2: "半挂",
        menu3: "高低板",
        menu4: "更多>>"
      },
      cartType: [
        //更多车型
        { type: "平板" },
        // {type:'厢式'},
        { type: "低栏" },
        { type: "中栏" },
        { type: "高栏" },
        { type: "集装箱" },
        { type: "自卸" },
        { type: "开顶厢" },
        { type: "冷藏车" },
        { type: "危险品" },
        { type: "其他" }
      ],
      carLongList: [
        { cartAttr: "4.2" },
        { cartAttr: "6.8" },
        { cartAttr: "8.7" },
        { cartAttr: "9.6" },
        { cartAttr: "13" },
        { cartAttr: "17.5" }
      ],
      activeFlag: -1,
      carTonList: [
        { cartAttr: "8" },
        { cartAttr: "15" },
        { cartAttr: "20" },
        { cartAttr: "25" },
        { cartAttr: "30" },
        { cartAttr: "35" }
      ],
      activeFlag1: -1,
      activeFlag3: -1,
      taxWaybillId: this.$route.query.taxWaybillId, //从再建一单进来的标志
      wbBusinessType: "", //运单业务类型
      cartBadgeNoStore: "",
      nameDisabled: false, //默认不禁用
      zyCapitalCfg: "", // 回款宝配置
      mobileState: "0" //判断是否从司机选择页面返回的
    };
  },
  beforeRouteEnter(to, from, next) {
    if (from.name == "wayBillInfo") {
      next(v => {
        v.mobileState = "0";
        v.queryWaybill();
      });
    }
    if (from.name == "settlementInfo") {
      next(v => {
        v.mobileState = "0";
        v.cartBadgeNoStore = v.$store.state.wayBill.weyBillSecond.cartBadgeNo;
      });
    }
    // 车队选择回调,去查询
    if (from.name == "wbsTeamChoose") {
      next(vm => {
        vm.$store.commit("updateLoadingStatus", { isLoading: false });
        // vm.weyBillSecond1.zyCapitalCfg = vm.zyCapitalCfg; // 回款宝配置
        vm.weyBillSecond1.cartBadgeNo = vm.weyBillSecond.cartBadgeNo;
        vm.weyBillSecond1.driverName = vm.weyBillSecond.driverName;
        vm.weyBillSecond1.mobileNo = vm.weyBillSecond.mobileNo;
        vm.weyBillSecond1.carType = vm.weyBillSecond.carType;
        vm.weyBillSecond1.carLength = vm.weyBillSecond.carLength;
        vm.weyBillSecond1.carTonNumber = vm.weyBillSecond.carTonNumber;
        vm.weyBillSecond1.payBankName = vm.weyBillSecond.payBankName;
        vm.weyBillSecond1.payBankNo = vm.weyBillSecond.payBankNo;
        vm.mobileState = "1";
        vm.$nextTick(() => {
          vm.phoneGetName();
        });
      });
    }
    next(vm => {
      vm.$store.commit("updateLoadingStatus", { isLoading: false });
      vm.weyBillSecond1.cartBadgeNo = vm.weyBillSecond.cartBadgeNo;
      vm.weyBillSecond1.driverName = vm.weyBillSecond.driverName;
      vm.weyBillSecond1.mobileNo = vm.weyBillSecond.mobileNo;
      vm.weyBillSecond1.carType = vm.weyBillSecond.carType;
      vm.weyBillSecond1.carLength = vm.weyBillSecond.carLength;
      vm.weyBillSecond1.carTonNumber = vm.weyBillSecond.carTonNumber;
      vm.weyBillSecond1.payBankName = vm.weyBillSecond.payBankName;
      vm.weyBillSecond1.payBankNo = vm.weyBillSecond.payBankNo;
    });
  },
  beforeRouteLeave(to, from, next) {
    if (to.name == "settlementInfo") {
      if (
        this.weyBillSecond1.cartBadgeNo != this.cartBadgeNoStore ||
        this.mobileState == "1"
      ) {
        localStorage.setItem("cartBadgeNoChange", 1);
      }
      // console.log(this.mobileState)
      if (
        this.weyBillSecond1.mobileNo != this.weyBillSecond.mobileNo ||
        this.mobileState == "1"
      ) {
        localStorage.setItem("mobileNoChange", 1);
      }
      if (
        this.weyBillSecond1.driverName != this.weyBillSecond.driverName ||
        this.mobileState == "1"
      ) {
        localStorage.setItem("driverNameNoChange", 1);
      }
    }
    if (document.getElementById("cardIpt")) {
      setTimeout(function() {
        document.body.removeChild(document.getElementById("cardIpt"));
      }, 400);
      next(false);
      return false;
    }
    // let updateOpions = {
    //     type: 'weyBillSecond',
    //     updatMsg: this.weyBillSecond1
    // };
    let updateOpions = {
      type: "weyBillSecond",
      updatMsg: Object.assign(this.weyBillSecond1, {
        hybWallet: this.weyBillSecond.hybWallet
      })
    };
    this.$store.commit("updateWayBillStatus", updateOpions);
    next();
  },
  created() {},
  computed: {
    weyBillSecond() {
      return this.$store.state.wayBill.weyBillSecond;
    },
    deliveryGoodsWaybillInfo() {
      return this.$store.state.deliveryGoods.deliveryGoodsWaybillInfo;
    },
    btnState() {
      if (
        this.weyBillSecond1.mobileNo.length === 11 &&
        this.weyBillSecond1.driverName.length > 0 &&
        this.weyBillSecond1.cartBadgeNo.length > 6 &&
        this.weyBillSecond1.carType !== "请选择车型" &&
        this.weyBillSecond1.carLength !== "请选择车长" &&
        this.weyBillSecond1.carTonNumber !== "请选择吨位"
      ) {
        return 1;
      } else {
        return 0;
      }
    }
  },
  mounted() {},
  methods: {
    queryWaybill() {
      this.weyBillSecond1.cartBadgeNo = this.weyBillSecond.cartBadgeNo;
      this.weyBillSecond1.driverName = this.weyBillSecond.driverName;
      this.weyBillSecond1.mobileNo = this.weyBillSecond.mobileNo;
      this.weyBillSecond1.carType = this.weyBillSecond.carType;
      this.weyBillSecond1.carLength = this.weyBillSecond.carLength;
      this.weyBillSecond1.carTonNumber = this.weyBillSecond.carTonNumber;
      this.weyBillSecond1.payBankName = this.weyBillSecond.payBankName;
      this.weyBillSecond1.payBankNo = this.weyBillSecond.payBankNo;
      queryWaybill()
        .then(res => {
          //3013
          if (res.data.reCode === "0") {
            this.zyCapitalCfg = res.data.result.zyCapitalCfg; // 回款宝配置
            this.weyBillSecond1.zyCapitalCfg = res.data.result.zyCapitalCfg; // 回款宝配置
          }
          this.wbBusinessType = this.deliveryGoodsWaybillInfo.wbBusinessType;
          if (this.wbBusinessType == 2) {
            this.weyBillSecond1.driverName = this.deliveryGoodsWaybillInfo
              .driverName
              ? this.deliveryGoodsWaybillInfo.driverName
              : "";
            this.weyBillSecond1.mobileNo = this.deliveryGoodsWaybillInfo
              .driverMobileNo
              ? this.deliveryGoodsWaybillInfo.driverMobileNo
              : "";
            this.weyBillSecond1.carType = this.deliveryGoodsWaybillInfo.cartType
              ? this.deliveryGoodsWaybillInfo.cartType
              : "";
            this.weyBillSecond1.carLength = this.deliveryGoodsWaybillInfo
              .cartLength
              ? this.deliveryGoodsWaybillInfo.cartLength
              : "";
            this.weyBillSecond1.cartBadgeNo = this.deliveryGoodsWaybillInfo
              .cartBadgeNo
              ? this.deliveryGoodsWaybillInfo.cartBadgeNo
              : "";
          }
          if (this.taxWaybillId !== undefined) {
            // this.weyBillSecond1.note = localStorage.getItem('note');
            let json = {
              taxWaybillId: this.taxWaybillId
            };
            buildWaybillAgain(json)
              .then(res => {
                //3048
                if (res.data.reCode === "0") {
                  let result = res.data.result;
                  this.weyBillSecond1.note = result.note;
                }
                this.$store.commit("updateLoadingStatus", { isLoading: false });
              })
              .catch(err => {
                this.$store.commit("updateLoadingStatus", { isLoading: false });
                this.$vux.toast.text(err.message, "middle");
              });
          } else {
            this.weyBillSecond1.note = this.weyBillSecond.note;
            this.$store.commit("updateLoadingStatus", { isLoading: false });
          }
        })
        .catch(err => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          this.$vux.toast.text(err.message, "middle");
        });
    },
    chooseBtnClick() {
      try {
        MtaH5.clickStat("my_car_team_btn");
      } catch (error) {
        JSON.stringify(error);
      }
      this.$router.push({
        path: "/wbsTeamChoose"
      });
    },
    checkNextClick() {
      //司机手机号验证
      let re = /^1\d{10}$/;
      if (!re.test(this.weyBillSecond1.mobileNo)) {
        this.$vux.toast.text("司机手机号码输入错误", "middle");
        return false;
      }
      if (!this.btnState) return false;
      let cartBadgeCheck = /^([\u4E00-\u9FA5](([0-9A-Z]{6,7})|([0-9A-Z]{5,6}[\u4E00-\u9FA5]{1})))$/;
      if (
        this.weyBillSecond1.driverName === "先生" ||
        this.weyBillSecond1.driverName === "微信注册车辆" ||
        this.weyBillSecond1.driverName === "M信用开通司机"
      ) {
        this.$store.commit("updateLoadingStatus", { isLoading: false });
        this.$vux.toast.text(
          "司机姓名输入名称不可为：" + this.weyBillSecond1.driverName,
          "middle"
        );
        return false;
      }
      //司机姓名64位规则验证
      if (this.weyBillSecond1.driverName.length > 64) {
        this.$vux.toast.text("司机姓名长度最大不可超过64位", "middle");
        return false;
      }
      return true;
    },
    async _nextBtnClick() {
      let res = await this._checkOrderAgain()
      if(res.data.reCode === '0'){
        let resInfo = res.data.result.taxWaybillNo;
        if (res.data.result.state === "0") {
          try {
            MtaH5.clickStat("xinjianyundanlo", { waybillstep2: "true" });
          } catch (error) {
            JSON.stringify(error);
          }
          this.driverNextBtn();
        } else {
          if (res.data.result.level === "0") {
            try {
              MtaH5.clickStat("xinjianyundanlo", { waybillstep2: "true" });
            } catch (error) {
              JSON.stringify(error);
            }
            this.driverNextBtn();
          } else if (res.data.result.level === "1") {
            this.$vux1.confirm.show({
              title: "提示",
              content: `当前司机已有承运中的运单（${resInfo}）是否继续建单？`,
              confirmText: "确认",
              cancelText: "取消",
              onCancel: () => {},
              onConfirm: () => {
                try {
                  MtaH5.clickStat("xinjianyundanlo", {
                    waybillstep2: "true"
                  });
                } catch (error) {
                  JSON.stringify(error);
                }
                this.driverNextBtn();
              }
            });
          } else {
            this.$vux.alert.show({
              title: "提示",
              content: `当前司机已有承运中的运单（${resInfo}）当前不可继续建单`
            });
          }
        }
      }else{
        this.$vux.toast.text(res.data.reInfo, "middle");
      }
    },
    _checkOrderAgain(){
      let json = {
        mobileNo:this.weyBillSecond1.mobileNo,
        cartBadgeNo:this.weyBillSecond1.cartBadgeNo,
        driverName:this.weyBillSecond1.driverName,
        startTime:this.$store.state.wayBill.weyBillFirst.startTime
      }
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      return new Promise((resolve,reject)=>{
        checkOrderAgain(json).then((res)=>{
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          resolve(res)
        }).catch((err)=>{
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          reject(err)
        })
      })
    },
    nextBtnClick() {
      if (!this.btnState) return false;
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      if (!this.checkNextClick()) {
        return;
      }
      this._nextBtnClick();
    },
    carNumIpt() {
      if (this.wbBusinessType == 2) {
        return;
      }
      let _this = this;
      this.$carIpt({
        dpCartNum:
          this.weyBillSecond1.cartBadgeNo !== "" &&
          this.weyBillSecond1.cartBadgeNo !== "请输入车牌号码"
            ? this.weyBillSecond1.cartBadgeNo
            : "",
        fn: function(res) {
          _this.weyBillSecond1.cartBadgeNo =
            res === "" ? "请输入车牌号码" : res;
        }
      });
    },

    //点击更多的时候
    carTypeBtn(menuKey, menuItem) {
      if (menuKey != "menu4") {
        this.weyBillSecond1.carType = menuItem;
      } else {
        this.show15 = true;
      }
    },

    //更多车型按钮
    cartTypeBtn() {
      if (this.activeFlag3 === -1) {
        this.$vux.toast.text("请选择车型~~~", "middle");
        return false;
      }
      this.show15 = false;
      this.weyBillSecond1.carType = this.cartType[this.activeFlag3].type;
    },

    carLongBtn() {
      if (this.activeFlag === -1) {
        if (this.carLen == "") {
          this.$vux.toast.text("请选择你需要的车长~~~", "middle");
          return false;
        } else {
          this.show13 = false;
          let reg = /^\d+(\.\d{1,2})?$/;
          if (!reg.test(this.carLen)) {
            this.$vux.toast.text("输入的车长不符合规则~~~", "middle");
            return false;
          }
          this.weyBillSecond1.carLength = this.carLen + "米";
          return false;
        }
      }
      this.show13 = false;
      this.weyBillSecond1.carLength =
        this.carLongList[this.activeFlag].cartAttr + "米";
    },

    carTonBtn() {
      if (this.activeFlag1 === -1) {
        if (this.carTon == "") {
          this.$vux.toast.text("请选择你需要的车吨位~~~", "middle");
          return false;
        } else {
          this.show14 = false;
          let reg = /^\d+(\.\d{1,2})?$/;
          if (!reg.test(this.carTon)) {
            this.$vux.toast.text("输入的吨位不符合规则~~~", "middle");
            return false;
          }
          this.weyBillSecond1.carTonNumber = this.carTon + "吨";
          return false;
        }
      }
      this.show14 = false;
      this.weyBillSecond1.carTonNumber =
        this.carTonList[this.activeFlag1].cartAttr + "吨";
    },
    //点击下一步的时候必须走这个方法
    driverNextBtn() {
      if (
        this.weyBillSecond1.mobileNo != "" &&
        this.weyBillSecond1.cartBadgeNo != ""
      ) {
        this.$store.commit("updateLoadingStatus", { isLoading: true });
        driverNext(
          this.weyBillSecond1.mobileNo,
          this.weyBillSecond1.cartBadgeNo,
          this.weyBillSecond1.driverName,
          this.weyBillSecond1.carType,
          parseFloat(this.weyBillSecond1.carLength),
          parseFloat(this.weyBillSecond1.carTonNumber)
        )
          .then(res => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.$router.push({
              path: "/settlementInfo",
              query: {
                taxWaybillId: this.taxWaybillId,
                driverName: this.weyBillSecond1.driverName,
                alipayNo: this.weyBillSecond1.alipayNo,
                payBankName: this.weyBillSecond1.payBankName,
                payBankNo: this.weyBillSecond1.payBankNo
              }
            });
          })
          .catch(err => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.$router.push({
              path: "/settlementInfo",
              query: {
                taxWaybillId: this.taxWaybillId,
                driverName: this.weyBillSecond1.driverName,
                alipayNo: this.weyBillSecond1.alipayNo,
                payBankName: this.weyBillSecond1.payBankName,
                payBankNo: this.weyBillSecond1.payBankNo
              }
            });
          });
      } else {
        this.$router.push({
          path: "/settlementInfo",
          query: {
            taxWaybillId: this.taxWaybillId,
            driverName: this.weyBillSecond1.driverName,
            alipayNo: this.weyBillSecond1.alipayNo,
            payBankName: this.weyBillSecond1.payBankName,
            payBankNo: this.weyBillSecond1.payBankNo
          }
        });
      }
    },
    //通过司机手机号码获取注册过的司机姓名
    phoneGetName() {
      if (
        this.zyCapitalCfg == "8" &&
        this.weyBillSecond1.mobileNo.length == 11
      ) {
        let json = {
          mobileNo: this.weyBillSecond1.mobileNo
        };
        this.$store.commit("updateLoadingStatus", { isLoading: true });
        phoneGetName(json)
          .then(res => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode == "0") {
              //如果带出了司机姓名则覆盖
              if (Object.keys(res.data.result).length != "0") {
                let result = res.data.result;
                this.weyBillSecond1.payName = result.driverName;
                //带出四要素则说明是做过实名认证的好运宝用户
                if (
                  result.alipayNo !== "" &&
                  result.driverName !== "" &&
                  !result.mobileNo == ""
                ) {
                  window.sessionStorage.isChooseType = "0";
                  this.weyBillSecond1.alipayNo = result.alipayNo;
                  this.weyBillSecond1.mobileNo = result.mobileNo;
                  this.weyBillSecond1.driverName = result.driverName;
                  this.weyBillSecond1.idCard = result.idCard;
                  this.weyBillSecond1.payBankName = result.payBankName;
                  this.weyBillSecond1.payBankNo = result.payBankNo;
                  this.nameDisabled = true; //带出信息则禁用
                } else {
                  this.weyBillSecond1.alipayNo = "";
                  this.nameDisabled = false;
                }
              } else {
                this.weyBillSecond1.alipayNo = "";
                window.sessionStorage.isChooseType = "0";
                this.nameDisabled = false;
              }
            }
          })
          .catch(err => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.$vux.toast.text(err.message, "middle");
          });
      }
    }
  }
};
</script>

<style lang="less">
@import "../../assets/styles/common.less";
// dialog样式
.weui-dialog {
  /deep/.weui-dialog__bd {
    font-size: 16px;
    color: #454545;
    padding: 2em;
    line-height: 40px;
    div {
      overflow: scroll;
      max-height: 130px;
      line-height: 1.5;
    }
  }
}
.wbs-car-team {
  .star-icon-style {
    width: 20px;
    height: 20px;
  }
  .star-icon-style1 {
    width: 8px;
    height: 8px;
  }
  #button {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background: #fff;
    z-index: 10;
  }
  .car-msg-cxt {
    padding: 13px;
    .car-title-cxt {
      .wh(100%;40px);
      color: @text-color-common;
      font-size: 17px;
      @media screen and (max-width: 320px) {
        font-size: 14px;
      }
      line-height: 40px;
      .car-choose-btn {
        .wh(120px;36px);
        text-align: center;
        line-height: 36px;
        color: @text-color-white;
        font-size: 16px;
        background-color: #1581cf;
        border-radius: 20px;
        display: inline-block;
      }
    }
    .title-star-style {
      color: #ffba00;
    }
  }
  .weui-cell,
  .vux-cell-box {
    font-size: 16px;
  }
  .car-ipt-cxt {
    width: 93%;
    margin-left: 3.5%;
    height: auto;
    border-left: 1px solid #d9d9d9;
    border-right: 1px solid #d9d9d9;
    .weui-cell__hd,
    .vux-label {
      color: #797979;
      font-size: 16px;
    }
    .vux-cell-align-left {
      font-size: 16px;
      color: #9f9f9f;
    }
    .weui-cell:before {
      left: 0px;
    }
    .weui-textarea,
    .weui-input {
      padding-top: 2px;
    }
    input::-webkit-input-placeholder,
    textarea::-webkit-input-placeholder {
      color: #9f9f9f;
    }
    textarea:disabled {
      background: #fff;
    }
    .weui-input,
    .cell-left-style {
      color: #202020;
    }
    .grey {
      color: #9f9f9f;
    }
  }
  .vux-popup-header {
    background-color: #15499a;
    color: #fff;
    .vux-popup-header-left {
      color: #fff;
    }
    .vux-popup-header-title {
      color: #fff;
    }
    .vux-popup-header-right {
      color: #fff;
    }
  }
  .car-msg-choose {
    width: 100%;
    min-height: 56px;
    height: auto;
    display: flex;
    flex-wrap: wrap;
    background-color: #fff;
    .car-choose-btn {
      width: 30%;
      text-align: center;
      height: 2rem;
      line-height: 2rem;
      border-radius: 0.3125rem;
      color: #797979;
      background: #f6f6f6;
      margin: 0.625rem 0.3rem;
    }
    .choose-btn-active {
      background-color: #1581cf;
      color: #fff;
    }
  }
  .self-ipt {
    // float: left;
    // font-size: 13px;
    // color: #1581CF;
    // margin-right: 16px;
    // text-decoration: underline;
    font-size: 16px;
    color: #797979;
    display: block;
    height: 36px;
    padding-left: 6px;
    background: #fff;
    padding-bottom: 10px;
    input {
      font-size: inherit;
      color: #797979;
      width: 65%;
      height: 32px;
      line-height: 32px;
      border: 1px solid #d9d9d9;
      margin-left: 2.4%;
      text-indent: 5px;
      outline: none;
      background: #f6f6f6;
    }
  }
}
</style>
