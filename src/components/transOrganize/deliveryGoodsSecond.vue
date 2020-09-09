<template>
  <div class="delivery_goods_second">
    <c-header isShowTitle>
      <van-nav-bar title="发布货源" left-arrow fixed @click-left="onClickLeft"></van-nav-bar>
    </c-header>
    <div class="sub_page_base">
      <div class="gray"></div>
      <div class="content">
        <van-cell-group>
          <van-field
            v-model="formData.loadingTime"
            label="装货时间："
            placeholder="请选择装货时间"
            right-icon="arrow"
            @click="selectDatePickerShow = true"
            required
            readonly
          />
          <van-field
            v-model="formData.expectFreight"
            type="number"
            required
            label="期望运费："
            placeholder="请填写期望运费"
          >
            <div slot="right-icon">
              <div>元</div>
            </div>
          </van-field>
          <div class="cell">
            <div class="label required">结算方式(多选)</div>
            <div class="checbox_group_box">
              <van-checkbox-group v-model="settleType" class="checbox_group">
                <van-checkbox name="预付">
                  <van-button
                    class="btn"
                    slot="icon"
                    slot-scope="props"
                    :class="props.checked ? 'activeIcon' : 'inactiveIcon'"
                    type="primary"
                    size="large"
                  >预付</van-button>
                </van-checkbox>
                <van-checkbox name="到付">
                  <van-button
                    class="btn"
                    slot="icon"
                    slot-scope="props"
                    :class="props.checked ? 'activeIcon' : 'inactiveIcon'"
                    type="primary"
                    size="large"
                  >到付</van-button>
                </van-checkbox>
                <van-checkbox name="回单付">
                  <van-button
                    class="btn"
                    slot="icon"
                    slot-scope="props"
                    :class="props.checked ? 'activeIcon' : 'inactiveIcon'"
                    type="primary"
                    size="large"
                  >回单付</van-button>
                </van-checkbox>
              </van-checkbox-group>
            </div>
          </div>
          <div class="cell txz_box">
            <div class="label">提供通行证：</div>
            <van-radio-group v-model="formData.isSupportTraffic" class="txz_group">
              <van-radio name="1">是</van-radio>
              <van-radio name="0">否</van-radio>
            </van-radio-group>
          </div>
          <div class="cell">
            <div class="label">服务要求(多选)</div>
            <div class="checbox_group_box">
              <van-checkbox-group v-model="serviceRequire" class="checbox_group">
                <van-checkbox name="三不超">
                  <van-button
                    class="btn"
                    slot="icon"
                    slot-scope="props"
                    :class="props.checked ? 'activeIcon' : 'inactiveIcon'"
                    type="primary"
                    size="large"
                  >三不超</van-button>
                </van-checkbox>
                <van-checkbox name="需雨布">
                  <van-button
                    class="btn"
                    slot="icon"
                    slot-scope="props"
                    :class="props.checked ? 'activeIcon' : 'inactiveIcon'"
                    type="primary"
                    size="large"
                  >需雨布</van-button>
                </van-checkbox>
                <van-checkbox name="急需走">
                  <van-button
                    class="btn"
                    slot="icon"
                    slot-scope="props"
                    :class="props.checked ? 'activeIcon' : 'inactiveIcon'"
                    type="primary"
                    size="large"
                  >急需走</van-button>
                </van-checkbox>
              </van-checkbox-group>
              <!-- <checker
                v-model="serviceRequire"
                type="checkbox"
                class="checbox_group"
                default-item-class="demo2-item"
                selected-item-class="demo2-item-selected"
              >
                <checker-item :value="item" v-for="(item, index) in items3" :key="index">{{ item }}</checker-item>
              </checker>-->
            </div>
          </div>
          <div class="cell">
            <div class="label">特殊说明：</div>
            <div class="checbox_group_box">
              <van-field
                v-model="formData.specialExplain"
                rows="2"
                autosize
                type="textarea"
                placeholder="请填写特殊说明和运输要求~"
                clearable
                maxlength="64"
              />
            </div>
          </div>
        </van-cell-group>
      </div>
      <div class="footer">
        <van-button @click="goto" type="primary" size="large">确认发布</van-button>
      </div>
    </div>

    <!-- 装货时间 -->
    <van-popup v-model="selectDatePickerShow" position="bottom">
      <datePicker @onConfirm="onConfirmDatePicker" @onCancel="selectDatePickerShow = false"></datePicker>
    </van-popup>

    <!-- 选择车型 -->
    <van-action-sheet
      v-model="cartTypeActionsShow"
      close-on-click-action
      :actions="cartTypeActions"
      @select="onSelectCartType"
    />

    <!-- 更多车型 -->
    <van-popup v-model="moreCartTypeShow" position="bottom" :overlay="true">
      <selectPopup
        title="更多车型"
        :arrayList="cartTypeList"
        @on-cancle="moreCartTypeShow = false"
        @on-submit="submitMoreCartType"
      ></selectPopup>
    </van-popup>

    <!-- 选择车长 -->
    <van-popup v-model="cartLengthShow" position="bottom" :overlay="true">
      <selectPopup
        :arrayList="cartLengthList"
        :inputShow="true"
        title="请选择车长(米)"
        inputUnit="米"
        inputPlaceholder="请输入车长"
        @on-cancle="cartLengthShow = false"
        @on-submit="submitCartLength"
      ></selectPopup>
    </van-popup>

    <!-- 几装几卸  -->
    <van-popup v-model="cartWhatShow" position="bottom" :overlay="true">
      <selectPopup
        :arrayList="cartWhatList"
        title="几装几卸"
        BtnClassName="car_msg_choose_2"
        @on-cancle="cartWhatShow = false"
        @on-submit="submitcartWhat"
      ></selectPopup>
    </van-popup>
  </div>
</template>

<script>
import {
  NavBar,
  Button,
  CellGroup,
  Field,
  Radio,
  RadioGroup,
  ActionSheet,
  Popup,
  Checkbox,
  CheckboxGroup
} from "vant";
import selectPopup from "@/components/common/selectPopup";
import datePicker from "./components/datePicker";

// import { addDeliveryGoods } from "@/api/apiDeliveryGoods"
import { newAddGoodsResource } from "@/api/transOrganize";
import { getBaseInfo, sendTransOrganizeMessages } from "@/api/api";
export default {
  name: "delivery_goods_second",
  data() {
    return {
      transportTemplateId: this.$route.query.transportTemplateId,
      pageType: this.$route.query.pageType ? this.$route.query.pageType : "0",
      settleType: [],
      serviceRequire: [],
      // loadingTime: "",
      formData: {
        loadingTime: "",
        expectFreight: "",
        settleType: "",
        isSupportTraffic: "",
        serviceRequire: "",
        specialExplain: ""
      },
      selectDatePickerShow: false,
      cartLengthShow: false,
      cartTonnageShow: false,
      moreCartTypeShow: false,
      cartTypeActionsShow: false,
      cartWhatShow: false,
      cartTypeActions: [
        { name: "厢式" },
        { name: "半挂" },
        { name: "高低板" },
        { name: "更多>>", fn: "showMoreCartType" }
      ],
      cartTypeList: [
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
      cartLengthList: [
        { type: "4.2米" },
        { type: "6.8米" },
        { type: "8.7米" },
        { type: "9.6米" },
        { type: "13米" },
        { type: "17.5米" }
      ],
      cartWhatList: [
        { type: "一装一卸" },
        { type: "一装两卸" },
        { type: "两装一卸" },
        { type: "两装两卸" }
      ],
      items3: ["三不超", "需雨布", "急需走"]
    };
  },
  components: {
    vanNavBar: NavBar,
    vanButton: Button,
    vanCellGroup: CellGroup,
    vanField: Field,
    vanRadio: Radio,
    vanRadioGroup: RadioGroup,
    vanActionSheet: ActionSheet,
    vanPopup: Popup,
    vanCheckbox: Checkbox,
    vanCheckboxGroup: CheckboxGroup,
    selectPopup,
    datePicker
  },
  computed: {
    deliveryGoodsFirst() {
      return this.$store.state.deliveryGoods.deliveryGoodsFirst;
    },
    deliveryGoodsTemplete() {
      return this.$store.state.deliveryGoods.deliveryGoodsTemplete;
    },
    deliveryGoodsAgain() {
      return this.$store.state.deliveryGoods.deliveryGoodsAgain;
    }
  },
  watch: {
    settleType(val) {
      console.log(val);
      val && (this.formData.settleType = val.toString());
    },
    serviceRequire(val) {
      console.log(val);
      val && (this.formData.serviceRequire = val.toString());
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$store.commit("updateLoadingStatus", { isLoading: false });
    });
  },
  mounted() {
    if (this.pageType === "1") {
      this.dataInit();
    } else if (this.pageType === "2") {
      this.GetDeliveryGoodsAgainData();
    }
  },
  methods: {
    // 导航左侧点击
    onClickLeft() {
      this.$router.back();
    },
    dataInit() {
      Object.keys(this.formData).forEach(key => {
        this.formData[key] = this.deliveryGoodsTemplete[key];
      });
      this.formData.isSupportTraffic = this.formData.supportTraffic || "";
      this.formData.serviceRequire.indexOf(",") != -1
        ? this.formData.serviceRequire.split(",")
        : [this.formData.serviceRequire];
    },
    GetDeliveryGoodsAgainData() {
      Object.keys(this.formData).forEach(key => {
        this.formData[key] = this.deliveryGoodsAgain[key];
      });
      this.settleType =
        this.formData.settleType.indexOf(",") != -1
          ? this.formData.settleType.split(",")
          : [this.formData.settleType];
      this.serviceRequire =
        this.formData.serviceRequire.indexOf(",") != -1
          ? this.formData.serviceRequire.split(",")
          : [this.formData.serviceRequire];
    },
    //非空验证通用方法
    isEmptyStr(str) {
      var pat = /^[\s]*$/;
      if (undefined == str || "" == str || null == str || pat.test(str)) {
        return true;
      }
      return false;
    },
    // 验证
    validator() {
      //装货时间
      if (this.isEmptyStr(this.formData.loadingTime)) {
        this.$vux.toast.text("请选择装货时间", "middle");
        return false;
      }
      //期望运费必填！
      if (!this.isEmptyStr(this.formData.expectFreight)) {
        let regexp = /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/;
        if (!regexp.test(this.formData.expectFreight)) {
          this.$vux.toast.text("期望运费不合法！", "middle");
          return false;
        }
      } else {
        this.$vux.toast.text("期望运费必填！", "middle");
        return false;
      }
      //结算方式
      if (this.settleType.length === 0) {
        this.$vux.toast.text("请选择结算方式", "middle");
        return false;
      }
      return true;
    },
    _getBaseInfo() {
      return new Promise((resolve, reject) => {
        this.$store.commit("updateLoadingStatus", { isLoading: true });
        getBaseInfo({})
          .then(res => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode == 0) {
              resolve(res.data.result);
            } else {
              this.$vux.toast.text(res.data.reInfo, "middle");
              reject();
            }
          })
          .catch(err => {
            this.$vux.toast.text(err.message, "middle");
            reject();
          });
      });
    },
    goto() {
      if (this.validator()) {
        this._getBaseInfo().then(res => {
          this.$store.commit("updateLoadingStatus", { isLoading: true });
          let data = Object.assign(
            {},
            this.formData,
            this.deliveryGoodsFirst,
            res
          );
          console.log(data);
          newAddGoodsResource(data).then(res => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode == 0) {
              // 存值模板要用
              let updateOpions = {
                type: "deliveryGoodsSecond",
                updatMsg: this.formData
              };
              this.$store.commit("updateDeliveryGoods", updateOpions);
              this._sendTransOrganizeMessages();
              this.$router.push({ path: "/delivery_goods_success" });
            } else {
              this.$vux.toast.text(res.data.reInfo, "middle");
            }
          });
        });
      }
    },
    _sendTransOrganizeMessages() {
      return new Promise((resolve, reject) => {
        // this.$store.commit("updateLoadingStatus", { isLoading: true });
        sendTransOrganizeMessages({})
          .then(res => {
            // this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode == 0) {
              resolve();
            } else {
              // this.$vux.toast.text(res.data.reInfo, "middle");
              reject();
            }
          })
          .catch(err => {
            // this.$vux.toast.text(err.message, "middle");
            reject();
          });
      });
    },
    onConfirmDatePicker({ text, code }) {
      this.selectDatePickerShow = false;
      // this.loadingTime = text;
      // this.formData.loadingTime = code.toString();
      this.formData.loadingTime = text;
    },
    onSelectCartType(item) {
      // 默认情况下，点击选项时不会自动关闭菜单
      // 可以通过 close-on-click-action 属性开启自动关闭
      if (item.fn) {
        this[item.fn]();
      } else {
        this.formData.cartType = item.name;
      }
    },
    // 展示选择车型
    showCartTypeActions() {
      this.cartTypeActionsShow = true;
    },
    // 展示更多车型
    showMoreCartType() {
      this.moreCartTypeShow = true;
    },
    // 展示选择车长
    showCartLength() {
      this.cartLengthShow = true;
    },
    // 更多车型确定
    submitMoreCartType(val) {
      this.moreCartTypeShow = false;
      this.formData.cartType = val;
    },
    // 展示选择车长
    submitCartLength(val) {
      this.cartLengthShow = false;
      this.formData.cartLength = val;
    },
    // 几装几卸
    submitcartWhat(val) {
      this.cartWhatShow = false;
      this.formData.cartWhat = val;
    }
  }
};
</script>
<style lang="less" scoped>
.delivery_goods_second {
  background: #ffffff;
  font-size: 16px;
  /deep/.van-cell {
    font-size: 16px;
  }
  /deep/ .van-button--primary {
    color: #fff;
    background-color: #15499a;
    border: 1px solid #15499a;
  }
  /deep/ .van-field__label {
    text-align: justify;
    text-align-last: justify;
    color: #797979;
    display: inline-block;
    max-height: 24px;
    &:after {
      display: inline-block;
      content: "";
      overflow: hidden;
      width: 100%;
      height: 0;
    }
  }
  .van-cell--required::before {
    color: #ffba00;
  }
  .gray {
    background: #efefef;
    height: 10px;
  }
  .sub_page_base {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    box-sizing: border-box;
    padding-top: 45px;
    background: #efefef;
    .content {
      .cell {
        width: 100%;
        position: relative;
        box-sizing: border-box;
        padding: 10px 15px;
        overflow: hidden;
        color: #323233;
        font-size: 14px;
        line-height: 24px;
        background-color: #fff;
        .label {
          // text-align: justify;
          // text-align-last: justify;
          color: #797979;
          display: inline-block;
          max-height: 24px;
          font-size: 16px;
          // &:after {
          //   display: inline-block;
          //   content: "";
          //   overflow: hidden;
          //   width: 100%;
          //   height: 0;
          // }
        }
        .required {
          &::before {
            position: absolute;
            left: 7px;
            color: #ffba00;
            font-size: 14px;
            content: "*";
          }
        }
        .checbox_group {
          height: 65px;
          display: flex;
          align-items: center;
          /deep/.van-button {
            font-size: 15px;
          }
          /deep/.van-checkbox__icon {
            height: 100%;
            line-height: 100%;
          }
          .btn {
            width: 70px;
            height: 30px;
            line-height: 30px;
            border-radius: 4px;
            margin-right: 20px;
          }
          .activeIcon {
            color: #fff;
            background-color: #1581cf;
            border: 1px solid #1581cf;
          }
          .inactiveIcon {
            color: #202020;
            background-color: #f6f6f6;
            border: 1px solid #dcdcdc;
          }
        }
        &:after {
          position: absolute;
          box-sizing: border-box;
          content: " ";
          pointer-events: none;
          right: 0;
          bottom: 0;
          left: 15px;
          border-bottom: 1px solid #ebedf0;
          -webkit-transform: scaleY(0.5);
          transform: scaleY(0.5);
        }
      }
      .txz_box {
        display: flex;
        /deep/.van-radio__icon--checked .van-icon {
          background-color: #1581cf;
          border-color: #1581cf;
        }
      }
      .txz_group {
        font-size: 15px;
        display: flex;
        flex: 1;
        justify-content: left;
        .van-radio {
          margin-right: 20px;
        }
      }
    }
    .footer {
      height: 50px;
      width: 100%;
      box-sizing: border-box;
      padding: 0 25px;
      // margin-bottom: 28px;
      margin-top: 50px;
    }
    // 吨方件车
    .goods-amount-type-box {
      display: flex;
      .goods-amount-type-item {
        font-size: 15px;
        background: #bebebe;
        padding: 0 2px;
        margin: 0 2px;
        border-radius: 4px;
        color: #fff;
        &.active {
          background: #1581cf;
        }
      }
    }
    // 趟次样式
    .tangci {
      display: flex;
      .van-radio {
        margin-left: 10px;
        .input-sty {
          -webkit-appearance: none;
          width: 5em;
          margin-left: 2em;
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
    }
  }
}
</style>
