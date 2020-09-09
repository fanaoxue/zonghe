<template>
  <div class="other_info">
    <c-header isShowTitle>
      <van-nav-bar
        title="其他信息"
        left-arrow
        fixed
        @click-left="onClickLeft"
      ></van-nav-bar>
    </c-header>
    <div class="sub_page_base">
      <div class="content">
        <van-cell-group>
          <van-field
            v-model.trim="formData.contactName"
            label="联系人姓名："
            placeholder="请预留联系人姓名"
            maxlength="32"
            type="text"
            clearable
          />
          <van-field
            v-model.trim="formData.contactMobileNo"
            label="手机号码："
            placeholder="请填写联系人手机号码"
            maxlength="11"
            type="number"
            required
            clearable
          />
          <van-field
            v-model="formData.drawee"
            label="受票方："
            @click="draweeClickMethod"
            placeholder="请选择受票方"
            right-icon="arrow"
            readonly
            required
          />
        </van-cell-group>
      </div>
      <div class="content">
        <van-cell-group>
          <div class="cell">
            <div class="label">自动计算运费</div>
            <div class="checbox_group_box">
              <van-radio-group
                v-model="formData.autoFreightState"
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
                    >关闭</van-button
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
                    >开启</van-button
                  >
                </van-radio>
              </van-radio-group>
            </div>
          </div>
          <div class="cell">
            <div class="label">运费抹零</div>
            <div class="checbox_group_box">
              <van-radio-group
                v-model="formData.roundDownState"
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
                    >关闭</van-button
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
                    >开启</van-button
                  >
                </van-radio>
              </van-radio-group>
            </div>
          </div>
           <div class="cell" v-show="formData.roundDownState === '1'">
            <div class="label">运费抹零方式</div>
            <div class="checbox_group_box">
              <van-radio-group
                v-model="formData.roundDownType"
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
                    >小数抹零</van-button
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
                    >个位抹零</van-button
                  >
                </van-radio>
              </van-radio-group>
            </div>
          </div>
        </van-cell-group>
      </div>
      <div class="footer">
        <van-button
          type="primary"
          size="large"
          :disabled="disabledState"
          @click="saveData"
          >保存</van-button
        >
      </div>
    </div>

    <!-- 受票方组件 -->
    <van-popup v-model="draweeState" position="bottom" :overlay="true">
      <van-picker
        :default-index="draweeDefaultIndex"
        show-toolbar
        :columns="draweeArray"
        @cancel="draweeState = false"
        @confirm="onConfirmDrawee"
      />
    </van-popup>
  </div>
</template>

<script>
import {
  NavBar,
  CellGroup,
  Field,
  RadioGroup,
  Radio,
  Button,
  Toast,
  Picker,
  Popup
} from "vant";
import { getDrawee } from "../../api/api.js";
import { mapState } from "vuex";
import { newAddLine } from "../../api/bigCompre.js";
import { finishCallBack } from "@/utils/app.js";
export default {
  components: {
    vanNavBar: NavBar,
    vanCellGroup: CellGroup,
    vanField: Field,
    vanRadioGroup: RadioGroup,
    vanRadio: Radio,
    vanButton: Button,
    vanToast: Toast,
    vanPicker: Picker,
    vanPopup: Popup
  },
  name: "OtherInfo",
  data() {
    return {
      formData: {
        drawee: "",
        taxDraweePartyId: "",
        contactName: "",
        contactMobileNo: "",
        autoFreightState: "0",
        roundDownState: "0",
        roundDownType: "0"
      },
      draweeState: false,
      draweeArray: [], // 受票方集合
      draweeDefaultIndex: 0
    };
  },
  computed: {
    disabledState() {
      if (
        this.$utils.isMobileNo(this.formData.contactMobileNo) &&
        this.$utils.isNotEmpty(this.formData.drawee)
      ) {
        return false;
      }
      return true;
    },
    ...mapState("bigCompre/", {
      goodsInfo: state => state.goodsInfo,
      lineInfo: state => state.lineInfo
    })
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$store.commit("updateLoadingStatus", { isLoading: false });
      vm.dataInit();
    });
  },
  mounted() {},
  methods: {
    onClickLeft() {
      this.$router.back();
    },
    dataInit(){
      const loading = this.$toast.loading({
        duration: 0,
        message: "加载中",
        forbidClick: true
      });
      getDrawee({})
      .then(res => {
        loading.clear();
        let data = res.data.result;
        if (res.data.reCode === "0" && data.length === 1) {
          this.formData.drawee = data[0].drawee;
          this.formData.taxDraweePartyId = data[0].taxDraweePartyId;
        }
        if(res.data.reCode != "0"){
          this.$vux.toast.text(res.data.reInfo, "middle");
        }
      }).catch((err)=>{
        loading.clear();
        this.$vux.toast.text(err, "middle");
      })
    },
    // 受票方拉数据
    draweeClickMethod() {
      const Toast = this.$toast.loading({
        duration: 0,
        message: "加载中",
        forbidClick: true
      });
      getDrawee({})
        .then(res => {
          Toast.clear();
          var data = res.data.result;
          if (data.length > 0) {
            if (res.data.reCode === "0") {
              this.draweeObj = data;
              this.draweeArray = [];
              data.forEach(item => {
                this.draweeArray.push(item.drawee);
              });
              // 定位
              if (this.formData.drawee) {
                this.draweeArray.forEach((item, index) => {
                  if (this.formData.drawee === item) {
                    this.draweeDefaultIndex = index;
                  }
                });
              }
              this.draweeState = true;
            }
          }
        })
        .catch(err => {
          Toast.clear();
        });
    },
    // 受票方点击确定
    onConfirmDrawee(picker, value, index) {
      this.draweeState = false;
      this.formData.drawee = picker;
      this.formData.taxDraweePartyId = this.draweeObj[value].taxDraweePartyId;
    },
    saveData() {
      const loading = this.$toast.loading({
        duration: 0,
        message: "加载中",
        forbidClick: true
      });
      let params = Object.assign(this.goodsInfo, this.lineInfo, this.formData);
      newAddLine(params)
        .then(res => {
          loading.clear();
          if (res.data.reCode === "0") {
            Toast("新建线路成功~~")
            setTimeout(() => {
              finishCallBack({ methodName: "javascript:AppJSApi_finishCallBack()" });
              // this.$router.push("/LineList");
            }, 2000);
          } else {
            Toast(res.data.reInfo);
          }
        })
        .catch(err => {
          loading.clear();
        });
    }
  }
};
</script>
<style lang="less" scoped>
.other_info {
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
    width: 100px;
    &:after {
      display: inline-block;
      content: "";
      overflow: hidden;
      width: 100%;
      height: 0;
    }
  }
  /deep/.van-picker__toolbar {
    background: #15499a;
    &::after {
      border-color: #15499a;
    }
    .van-picker__cancel,
    .van-picker__confirm {
      color: #fff;
      font-size: 15px;
      &:active {
        background: rgb(21, 73, 154, 0.5);
      }
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
