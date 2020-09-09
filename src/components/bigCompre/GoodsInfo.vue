<template>
  <div class="goods_info">
    <c-header isShowTitle>
      <van-nav-bar
        title="货物信息"
        left-arrow
        fixed
        @click-left="onClickLeft"
      ></van-nav-bar>
    </c-header>
    <div class="sub_page_base">
      <div class="content">
        <van-cell-group>
          <van-field
            v-model.trim="formData.goodsName"
            label="货物名称："
            placeholder="请输入货物名称"
            type="text"
            maxlength="16"
            required
            clearable
          />
          <van-field
            v-model.trim="formData.curTransportUnitPrice"
            label="运输单价："
            placeholder="请输入运输单价"
            type="number"
            clearable
          >
            <div slot="right-icon">
              <div>元</div>
            </div>
          </van-field>
          <van-field
            v-model.trim="formData.lossUnitPrice"
            label="货损单价："
            placeholder="请输入货损单价"
            type="number"
            clearable
          >
            <div slot="right-icon">
              <div>元</div>
            </div>
          </van-field>
        </van-cell-group>
      </div>
      <div class="content">
        <van-cell-group>
          <div class="cell">
            <div class="label">请选择货物单位</div>
            <div class="checbox_group_box">
              <van-radio-group
                v-model="formData.transportUnitPriceType"
                direction="horizontal"
              >
                <van-radio name="0">
                  <van-button
                    class="btn"
                    slot="icon"
                    slot-scope="props"
                    :class="props.checked ? 'activeIcon' : 'inactiveIcon'"
                    type="primary"
                    size="large"
                    >吨</van-button
                  >
                </van-radio>
                <van-radio name="1">
                  <van-button
                    class="btn"
                    slot="icon"
                    slot-scope="props"
                    :class="props.checked ? 'activeIcon' : 'inactiveIcon'"
                    type="primary"
                    size="large"
                    >方</van-button
                  >
                </van-radio>
                <van-radio name="3">
                  <van-button
                    class="btn"
                    slot="icon"
                    slot-scope="props"
                    :class="props.checked ? 'activeIcon' : 'inactiveIcon'"
                    type="primary"
                    size="large"
                    >车</van-button
                  >
                </van-radio>
              </van-radio-group>
            </div>
          </div>
          <div class="cell">
            <div class="label">司机可见运输单价</div>
            <div class="checbox_group_box">
              <van-radio-group
                v-model="formData.unitPriceVisible"
                direction="horizontal"
              >
                <van-radio name="0">
                  <van-button
                    class="btn"
                    slot="icon"
                    slot-scope="props"
                    :class="props.checked ? 'activeIcon' : 'inactiveIcon'"
                    type="primary"
                    size="large"
                    >可见</van-button
                  >
                </van-radio>
                <van-radio name="1">
                  <van-button
                    class="btn"
                    slot="icon"
                    slot-scope="props"
                    :class="props.checked ? 'activeIcon' : 'inactiveIcon'"
                    type="primary"
                    size="large"
                    >不可见</van-button
                  >
                </van-radio>
              </van-radio-group>
            </div>
          </div>
          <div class="cell">
            <div class="label">一天多趟</div>
            <div class="checbox_group_box">
              <van-radio-group
                v-model="formData.manyTrips"
                direction="horizontal"
              >
                <van-radio name="0">
                  <van-button
                    class="btn"
                    slot="icon"
                    slot-scope="props"
                    :class="props.checked ? 'activeIcon' : 'inactiveIcon'"
                    type="primary"
                    size="large"
                    >否</van-button
                  >
                </van-radio>
                <van-radio name="1">
                  <van-button
                    class="btn"
                    slot="icon"
                    slot-scope="props"
                    :class="props.checked ? 'activeIcon' : 'inactiveIcon'"
                    type="primary"
                    size="large"
                    >是</van-button
                  >
                </van-radio>
              </van-radio-group>
            </div>
          </div>
          <div class="cell">
            <div class="label">磅单区分上传</div>
            <div class="checbox_group_box">
              <van-radio-group
                v-model="formData.poundDiffUpload"
                direction="horizontal"
              >
                <van-radio name="0">
                  <van-button
                    class="btn"
                    slot="icon"
                    slot-scope="props"
                    :class="props.checked ? 'activeIcon' : 'inactiveIcon'"
                    type="primary"
                    size="large"
                    >否</van-button
                  >
                </van-radio>
                <van-radio name="1">
                  <van-button
                    class="btn"
                    slot="icon"
                    slot-scope="props"
                    :class="props.checked ? 'activeIcon' : 'inactiveIcon'"
                    type="primary"
                    size="large"
                    >是</van-button
                  >
                </van-radio>
              </van-radio-group>
            </div>
          </div>
          <div class="cell" v-show="formData.transportUnitPriceType === '0'">
            <div class="label">允许货损范围</div>
            <div class="checbox_group_box">
              <van-radio-group
                v-model="formData.allowLossType"
                direction="horizontal"
              >
                <van-radio name="0">
                  <van-button
                    class="btn"
                    slot="icon"
                    slot-scope="props"
                    :class="props.checked ? 'activeIcon' : 'inactiveIcon'"
                    type="primary"
                    size="large"
                    >固定值</van-button
                  >
                </van-radio>
                <van-radio name="1">
                  <van-button
                    class="btn"
                    slot="icon"
                    slot-scope="props"
                    :class="props.checked ? 'activeIcon' : 'inactiveIcon'"
                    type="primary"
                    size="large"
                    >百分比</van-button
                  >
                </van-radio>
              </van-radio-group>
              <input
                type="number"
                v-model.trim="formData.allowLossWeight"
                placeholder="请输入允许货损的范围"
                class="last_input"
                v-if="formData.allowLossType === '0'"
                oninput="this.value=(this.value.replace(/[^0-9.]+/,''))"
              />
              <span v-else>
                <input
                  type="number"
                  v-model.trim="formData.allowLossPercent"
                  placeholder="请输入允许货损的范围"
                  class="last_input"
                  oninput="this.value=(this.value.replace(/[^0-9.]+/,''))"
                />
                <span>%</span>
              </span>
            </div>
          </div>
        </van-cell-group>
      </div>
      <div class="footer">
        <van-button
          type="primary"
          size="large"
          :disabled="disabledState"
          @click="nextStep"
          >下一步</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { moneyReg_2, moneyReg_4 } from "../../utils/regularSets.js";
import { NavBar, CellGroup, Field, RadioGroup, Radio, Button } from "vant";
import { AppFinish, finishCallBack } from "@/utils/app.js";
export default {
  components: {
    vanNavBar: NavBar,
    vanCellGroup: CellGroup,
    vanField: Field,
    vanRadioGroup: RadioGroup,
    vanRadio: Radio,
    vanButton: Button
  },
  name: "GoodsInfo",
  data() {
    return {
      formData: {
        goodsName: "",
        curTransportUnitPrice: "",
        lossUnitPrice: "",
        transportUnitPriceType: "0",
        unitPriceVisible: "0",
        manyTrips: "0",
        poundDiffUpload: "0",
        allowLossType: "0",
        allowLossWeight: "",
        allowLossPercent: ""
      }
    };
  },
  watch: {
    "formData.transportUnitPriceType": {
      handler: function(val) {
        if (val !== "0") {
          this.formData.allowLossPercent = "";
          this.formData.allowLossWeight = "";
          this.formData.allowLossType = "";
        } else {
          this.formData.allowLossType = "0";
        }
      }
    }
  },
  computed: {
    // 按钮点击状态
    disabledState() {
      if (this.$utils.isNotEmpty(this.formData.goodsName)) {
        return false;
      }
      return true;
    },
    ...mapState("bigCompre/", {
      goodsInfo: state => state.goodsInfo
    })
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$store.commit("updateLoadingStatus", { isLoading: false });
    });
  },
  created() {
    // this.$store.commit("updateLoadingStatus", { isLoading: false });
  },
  mounted() {},
  methods: {
    onClickLeft() {
      // this.$router.back();
      AppFinish(-1);
      // finishCallBack({ methodName: "javascript:AppJSApi_finishCallBack()" });
    },
    nextStep() {
      // 验证金额字段
      if (
        this.$utils.isNotEmpty(this.formData.curTransportUnitPrice) &&
        !moneyReg_2.test(this.formData.curTransportUnitPrice)
      ) {
        this.$vux.toast.text("运输单价输入不合法~~", "middle");
        return false;
      }
      if (
        this.$utils.isNotEmpty(this.formData.lossUnitPrice) &&
        !moneyReg_2.test(this.formData.lossUnitPrice)
      ) {
        this.$vux.toast.text("货损单价输入不合法~~", "middle");
        return false;
      }
      if (this.formData.transportUnitPriceType === "0") {
        if (this.formData.allowLossType === "0") {
          if (!this.$utils.isNotEmpty(this.formData.allowLossWeight)) {
            this.$vux.toast.text("允许货损不能为空~~", "middle");
            return false;
          } else {
            if (!moneyReg_4.test(this.formData.allowLossWeight)) {
              this.$vux.toast.text("允许货损输入不合法~~", "middle");
              return false;
            }
          }
        }

        if (this.formData.allowLossType === "1") {
          if (!this.$utils.isNotEmpty(this.formData.allowLossPercent)) {
            this.$vux.toast.text("允许货损百分比不能为空~~", "middle");
            return false;
          } else {
            if (!moneyReg_2.test(this.formData.allowLossPercent)) {
              this.$vux.toast.text("允许货损百分比输入不合法~~", "middle");
              return false;
            }
          }
        }
      }
      this.$store.commit("bigCompre/setGoodsInfo", this.formData);
      this.$router.push("/LineInfo");
    }
  }
};
</script>
<style lang="less" scoped>
.goods_info {
  background: #ffffff;
  font-size: 16px;
  /deep/.van-cell {
    font-size: 16px;
    &:not(:last-child)::after {
      right: 16px;
      border-bottom: 1px solid #bfbfbf;
    }
  }
  .van-cell--required::before {
    color: #ffba00;
  }
  /deep/ .van-field__label {
    text-align: justify;
    text-align-last: justify;
    color: #454545;
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
  .sub_page_base {
    text-align: left;
    min-height: 100vh;
    box-sizing: border-box;
    padding-top: 46px;
    background: #efefef;
    display: flex;
    flex-direction: column;
    .content {
      overflow: hidden;
      margin: 10px 10px 0px 10px;
      border-radius: 5px;
      box-shadow: 0px 0px 5px 0px rgba(160, 165, 170, 0.3);
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
        &:not(:last-child)::after {
          position: absolute;
          box-sizing: border-box;
          content: " ";
          pointer-events: none;
          right: 0;
          bottom: 0;
          left: 16px;
          right: 16px;
          border-bottom: 1px solid #bfbfbf;
          -webkit-transform: scaleY(0.5);
          transform: scaleY(0.5);
        }
        .label {
          color: #454545;
          display: inline-block;
          max-height: 24px;
          font-size: 16px;
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
        .van-radio-group {
          height: 65px;
          display: flex;
          align-items: center;
          /deep/.van-button {
            font-size: 15px;
          }
          /deep/.van-radio__icon {
            height: 100%;
            line-height: 100%;
          }
          .btn {
            width: 75px;
            height: 30px;
            line-height: 30px;
            border-radius: 5px;
            margin-right: 38px;
            font-size: 13px;
          }
          .activeIcon {
            color: #ffffff;
            background-color: #164a9a;
            border: 1px solid #164a9a;
          }
          .inactiveIcon {
            color: #ffffff;
            background-color: #d6d6d6;
            border: 1px solid #d6d6d6;
          }
        }
        .last_input {
          font-size: 16px;
          width: 92%;
          background-color: #efefef;
          border: none;
          height: 40px;
          line-height: 40px;
          border-radius: 5px;
          text-indent: 0.5em;
          &::placeholder {
            color: #a6a6a6;
          }
        }
      }
    }
  }
  .footer {
    width: 100%;
    height: 100px;
    box-sizing: border-box;
    padding: 0 20px;
    background-color: #efefef;
    /deep/ .van-button--primary {
      color: #fff;
      background-color: #15499a;
      border: 1px solid #15499a;
      border-radius: 8px;
      margin: 25px auto;
    }
    /deep/ .van-button--disabled {
      background-color: #c0c0c0;
      border: 1px solid #c0c0c0;
      opacity: 1;
    }
  }
}
</style>
