<!-- ModeifyReciveCom -->
<template>
  <div class="ModeifyReciveCom">
    <van-cell-group>
      <van-field
        v-model="reciveType"
        label="收款方式："
        placeholder="请选择收款方式"
        :right-icon="reciveTypeClickDisabled ? '' : 'arrow'"
        v-show="reciveTypeShow"
        readonly
        @click="reciveTypeClick"
      />
      <div class="tips">
        <span v-show="advancePayState==='0' && reciveType===Data_HYB_RECIVE && zyCapitalCfg === '8'"><i class="iconfont icongantanhao"></i>司机{{ this.driverName }}已开通好运宝收款，请提醒司机去收款</span>
      </div>
      <van-field
        v-model="reciveMessage"
        label="收款人信息："
        placeholder="未填写"
        :right-icon="reciveMessageClickDisabled ? '' : 'arrow'"
        v-show="reciveMessageShow"
        readonly
        @click="reciveMessageClick"
      />
    </van-cell-group>

    <!-- 收款方式 actionsheet-->
    <van-action-sheet
      :round="false"
      v-model="reciveTypeActionsShow"
      :actions="reciveTypeActions"
      @select="onSelectReciveActions"
    />
  </div>
</template>

<script>
import { getCarMasterInfo } from "@/api/applyPay.js";
import { HYB_RECIVE, YHK_RECIVE, HYB_WALLET } from "./const";
import { Field, CellGroup, ActionSheet } from "vant";
import { getCompanyConfig } from "@/api/api.js";
export default {
  name: "ModeifyReciveCom",
  components: {
    vanField: Field,
    vanCellGroup: CellGroup,
    vanActionSheet: ActionSheet
  },
  data() {
    return {
      collectionFlagCfg: "",
      hybWalletCfg: "",
      zyCapitalCfg: "",
      collectTwoCfg: "",
      reciveType: "",
      reciveTypeShow: false,
      // reciveMessageShow: false,
      reciveTypeActionsShow: false,
      reciveTypeActions: [{ name: HYB_RECIVE }, { name: YHK_RECIVE }],
      Data_HYB_RECIVE: HYB_RECIVE,
      // reciveMessage_DFJ: ''
    };
  },
  props: {
    // 是否是垫付单
    advancePayState: {
      type: String,
      default: "0"
    },
    driverName: {
      type: String,
      default: ''
    },
    payName: {
      type: String,
      default: ''
    },
    mobileNo: {
      type: String,
      default: ''
    },
    cartBadgeNo: {
      type: String,
      default: ''
    },
    capWalletFalg: {
      type: String,
      default: '0'
    },
    SYSInfo: {
      type: Object,
      default: () => {
        return {
          name: '',
          idCard: '',
          phoneNumber: '',
          aliNum: '',
        }
      }
    }
  },
  computed: {
    reciveMessage_DFJ() {
      return this.$store.state.carTeamMasterInfo.carTeamInfo.reciveMessage_DFJ
    },
    SYSpass() {
      return this.SYSInfo.aliNum ? "1" : "0";
    },
    reciveMsgPay() {
      return this.$store.state.wayBill.reciveMsgPay;
    },
    reciveMessageShow() {
      if (this.advancePayState == '1' && this.collectTwoCfg == "8") {
        return true;
      } else {
        if (this.reciveType) {
          return true;
        } else if (this.zyCapitalCfg !== "8" && this.hybWalletCfg !== "8") {
          return true;
        } else {
          return false;
        }
      }
    },
    reciveMessage() {
      if (this.advancePayState == '1' && this.collectTwoCfg == '8') {
        return this.reciveMessage_DFJ
      } else {
        if (this.reciveType == HYB_RECIVE) {
          return this.driverName;
        } else {
          return this.$store.state.wayBill.reciveMsgPay.recivePersonName;
        }
      }
    },
    reciveTypeClickDisabled() {
      if (
        (this.advancePayState === "0" || this.collectTwoCfg === '9') && 
        this.zyCapitalCfg === "8" &&
        this.SYSpass === "1"
      ) {
        // 只有这种情况才有切换收款方式
        return false;
      }
      return true;
    },
    reciveMessageClickDisabled() {
      if (this.advancePayState === "1" && this.collectionFlagCfg === "45") {
        // 只有这种不可点击
        return true;
      }
      return false;
    }
  },
  mounted() {
    this._getCompanyConfig().then(res => {
      // this.init();
    });
  },
  methods: {
    // 初始化
    init() {
      this.$nextTick(() => {
        if (this.advancePayState == '1' && this.collectTwoCfg == "8") {
          // this.reciveMessageShow = true;
          // 垫付单且到付2配置开启
          var walletName = this.driverName;
          if (this.capWalletFalg == "1") {
            // 车队长收款标识
            walletName = this.payName;
          }
          if (this.reciveMsgPay.reciveBank) {
            const reciveMessage_DFJ =  walletName + HYB_WALLET;
            this.$store.commit(
              "carTeamMasterInfo/setCarTeamInfo",
              { reciveMessage_DFJ, payeeName: walletName }
            );
          } else {
            if (this.collectionFlagCfg == "46") {
              // 车队长+司机收款
              this._getCarMasterInfo();
            } else {
              const reciveMessage_DFJ =  walletName + HYB_WALLET;
              this.$store.commit(
                "carTeamMasterInfo/setCarTeamInfo",
                { reciveMessage_DFJ, payeeName: walletName }
              );
            }
          }
        } else {
          // 非垫付单
          if (this.zyCapitalCfg === "8") {
            // 开通回款宝配置
            if (this.SYSpass === "1") {
              // 四要素通过
              this.reciveTypeShow = true;
              if (this.reciveMsgPay.reciveType === "1") {
                // 原来选择好运宝收款的
                this.reciveType = HYB_RECIVE;
                const reciveMessage_DFJ =  this.payName + HYB_WALLET;
                this.$store.commit(
                  "carTeamMasterInfo/setCarTeamInfo",
                  { reciveMessage_DFJ }
                );
              } else{
                const reciveMessage_DFJ =  this.payName + HYB_WALLET;
                this.$store.commit(
                  "carTeamMasterInfo/setCarTeamInfo",
                  { reciveMessage_DFJ }
                );
                this.reciveType = YHK_RECIVE;
                this.reciveTypeShow = true;
                // this.reciveMessageShow = true;
              } 
            } else {
              // 四要素未通过
              const reciveMessage_DFJ =  this.payName + HYB_WALLET;
              this.$store.commit(
                "carTeamMasterInfo/setCarTeamInfo",
                { reciveMessage_DFJ }
              );
              this.reciveTypeShow = true;
              this.reciveType = YHK_RECIVE;
              // this.reciveMessageShow = true;
            }
          } else {
            // 未开通回款宝配置
            if (this.hybWalletCfg === "8") {
              // 开通好运宝钱包
              this.reciveType = YHK_RECIVE;
              this.reciveTypeShow = true;
              // this.reciveMessageShow = true;
            } else {
              // 未开通好运宝钱包
              // this.reciveMessageShow = true;
            }
          }
        }
      })
    },
    // 走车队长公共逻辑
    _getCarMasterInfo() {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      let json = {
        mobileNo: this.mobileNo,
        driverName: this.driverName,
        payeeName: this.payName ? this.payName : this.driverName,
        advancePayState: this.advancePayState,
        cartBadgeNo: this.cartBadgeNo
      };
      getCarMasterInfo(json)
        .then(res => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          if (res.data.reCode === "0") {
            const payeeList = res.data.result.payeeList || []
            let carTeamInfo
            if (payeeList.length === 0) {
              this.$store.commit("carTeamMasterInfo/RESET_CARTEAMINFO");
            } else {
              carTeamInfo = payeeList[payeeList.length-1]
              const reciveMessage_DFJ =  carTeamInfo.payeeName?carTeamInfo.payeeName + HYB_WALLET:''
              Object.assign(carTeamInfo, { reciveMessage_DFJ})
              this.$store.commit(
                "carTeamMasterInfo/setCarTeamInfo",
                carTeamInfo
              );
            }
          } else {
            this.$vux.toast.text(res.data.reInfo, "middle");
          }
        })
        .catch(err => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          // console.log(err);
        });
    },
    reciveMessageClick() {
      try {
        MtaH5.clickStat("modifywaybill_webrecivemsg");
      } catch (error) {
        JSON.stringify(error);
      }
      if (this.collectTwoCfg === "8" && this.advancePayState === "1") {
        if (this.collectionFlagCfg == "46") {
          // 垫付单且配置是车队长+司机
          this.carMasterSelect();
        }
      } else {
        // 自有资金
        this.goReciveMessage();
      }
    },
    // 自有资金
    goReciveMessage() {
      if (this.zyCapitalCfg === "8" && this.reciveType == HYB_RECIVE) {
        this.$router.push({
          path: "/webReciveMsg2",
          //携带四要素
          query: {
            driverName: this.SYSInfo.name,
            idCard: this.SYSInfo.idCard,
            mobileNo: this.SYSInfo.phoneNumber,
            alipayNo: this.SYSInfo.aliNum
          }
        });
      } else {
        this.$router.push({
          path: "/ReciveMessage",
          query: {
            driverName: this.SYSInfo.name,
            idCard: this.SYSInfo.idCard,
            mobileNo: this.SYSInfo.phoneNumber,
            alipayNo: this.SYSInfo.aliNum
          }
        });
      }
    },
    // 点击选择车队长
    carMasterSelect() {
      this.$router.push({
        path: "/carMasterReceiveMsg",
        query: {
          collectionFlagCfg: this.collectionFlagCfg,
          mobileNo: this.mobileNo,
          payeeName: this.payName ? this.payName : this.driverName,
          driverName: this.driverName,
          cartBadgeNo: this.cartBadgeNo
        }
      });
    },
    _getCompanyConfig() {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      return new Promise((resolve, reject) => {
        getCompanyConfig()
          .then(res => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode === "0") {
              let result = res.data.result;
              this.collectionFlagCfg = result.collectionFlagCfg; // 到付金收款方式
              this.collectTwoCfg = result.collectTwoCfg; // 到付金2配置
              this.hybWalletCfg = result.hybWalletCfg; // 好运宝钱包配置
              this.zyCapitalCfg = result.zyCapitalCfg; // 回款宝配置
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
    // 只有是回款宝收款 && 四要素通过才会有这
    onSelectReciveActions(item) {
      this.reciveTypeActionsShow = false;
      this.reciveType = item.name;
      // if (item.name === HYB_RECIVE) {
      //   this.reciveMessageShow = true;
      // } else {
      //   this.reciveMessageShow = true;
      // }
    },
    reciveTypeClick() {
      if (this.reciveTypeClickDisabled) {
        return false;
      }
      this.reciveTypeActionsShow = true;
    },
    getReciveType() {
      return this.reciveType;
    },
    changeReciver() {
      this.$nextTick(() => {
        if (this.advancePayState == '1' && this.collectTwoCfg == "8") {
          if (this.collectionFlagCfg == "46") {
            this._getCarMasterInfo();
          } else {
            const reciveMessage_DFJ =  this.driverName + HYB_WALLET;
            this.$store.commit(
              "carTeamMasterInfo/setCarTeamInfo",
              { reciveMessage_DFJ }
            );
          }
        } else {
          // 不是垫付单
          if (this.zyCapitalCfg === "8") {
            // 开通回款宝配置
            if (this.SYSpass === "1") {
              // 四要素通过
              this.reciveType = '';
              this.reciveTypeShow = true;
              // this.reciveMessageShow = false;
              this.$store.commit("resetReciveMsgInfo")
            } else {
              // 四要素未通过
              this.reciveType = YHK_RECIVE;
              this.reciveTypeShow = true;
              // this.reciveMessageShow = true;
              this.$store.commit("resetReciveMsgInfo")
            }
          } else {
            // 未开通回款宝配置
            if (this.reciveMsgPay.acctType !=='') {
              // 非普通银行卡收款
              this.$store.commit("resetReciveMsgInfo")
            }
            if (this.hybWalletCfg === "8") {
              // 开通好运宝钱包
              this.reciveType = YHK_RECIVE;
              this.reciveTypeShow = true;
              // this.reciveMessageShow = true;
            } else {
              // 未开通好运宝钱包
              // this.reciveMessageShow = true;
            }
          }
        }
      })
    }
  }
};
</script>
<style lang="less" scoped>
.ModeifyReciveCom {
  /deep/.van-field{
    font-size: 16px;
    color: #000;
    .van-field__label{
      width: 6.8em;
      text-align: right;
    }
  }
  .tips {
    color: #D84B4C;
    font-size: 14px;
    span {
      display: inline-block;
      padding: 5px 20px;
    }
    .icongantanhao {
      margin-right: 5px;
    }
  }
}
</style>
