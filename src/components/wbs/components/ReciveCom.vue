<!-- ReciveCom -->
<template>
  <div class="ReciveCom">
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
        placeholder="请选择收款人信息"
        :right-icon="reciveMessageClickDisabled ? '' : 'arrow'"
        v-show="reciveMessageShow"
        readonly
        @click="reciveMessageClick"
      />
      <div class="tips">
        <span v-if="wbBusinessType == '2' && collectionFlagCfg === '45'"><i class="iconfont icongantanhao"></i>路歌推荐运力仅支持司机本人好运宝钱包收款！</span>
        <span v-else-if="advancePayState === '1' && collectionFlagCfg === '46' && carTeamInfo.acctType === '6'" ><i class="iconfont icongantanhao"></i>提醒车队长去好运宝钱包提现运费！</span>
        <span v-else-if="(advancePayState === '1' && collectionFlagCfg === '45' && hybWalletCfg==='8'&& hybWallet==='1') ||(advancePayState === '1' && collectionFlagCfg === '46' && carTeamInfo.acctType === '5')"><i class="iconfont icongantanhao"></i>提醒司机去好运宝钱包提现运费！</span>
        <span v-else-if="advancePayState === '1' && collectionFlagCfg == '46' && !carTeamInfo.payeeName" ><i class="iconfont icongantanhao"></i>提醒收款人开通钱包绑定银行卡提现运费！</span>
        <span v-else-if="advancePayState === '1' &&  collectionFlagCfg === '45' && hybWallet !='1'"><i class="iconfont icongantanhao"></i>提醒司机开通好运宝钱包绑定银行卡去提现运费！</span>
      </div>
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
import { getCompanyConfig } from "@/api/api.js";
import { getCarMasterInfo } from "@/api/applyPay.js";
import { HYB_RECIVE, YHK_RECIVE, HYB_WALLET } from "./const";
import { Field, CellGroup, ActionSheet } from "vant";
export default {
  name: "ReciveCom",
  props: {
    // 是否是垫付单
    advancePayState: {
      type: String,
      default: "0"
    },
  },
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
      reciveType: "",
      reciveTypeShow: false,
      // reciveMessageShow: false,
      reciveTypeActionsShow: false,
      reciveTypeActions: [{ name: HYB_RECIVE }, { name: YHK_RECIVE }],
      Data_HYB_RECIVE: HYB_RECIVE
      // reciveMessage_DFJ: ''s
    };
  },
  computed: {
    wbBusinessType() {
      return this.$store.state.deliveryGoods.deliveryGoodsWaybillInfo.wbBusinessType;
    },
    weyBillSecond() {
      return this.$store.state.wayBill.weyBillSecond;
    },
    hybWallet() {
      return this.$store.state.wayBill.weyBillSecond.hybWallet;
    },
    driverName() {
      return this.$store.state.wayBill.weyBillSecond.driverName;
    },
    SYSpass() {
      return this.$store.state.wayBill.weyBillSecond.alipayNo ? "1" : "0";
    },
    reciveMsgPay() {
      return this.$store.state.wayBill.reciveMsgPay;
    },
    reciveMessageShow() {
      if (this.advancePayState == '1') {
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
      if (this.advancePayState == '1') {
        return this.reciveMessage_DFJ;
      } else {
        if (this.reciveType == HYB_RECIVE) {
          return this.driverName;
        } else {
          return this.$store.state.wayBill.reciveMsgPay.recivePersonName;
        }
      }
    },
    carTeamInfo() {
      return this.$store.state.carTeamMasterInfo.carTeamInfo;
    },
    reciveMessage_DFJ() {
      return this.$store.state.carTeamMasterInfo.carTeamInfo.reciveMessage_DFJ
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
    console.log('==========MixinsMounted============')
    setTimeout(() => {
      this._getCompanyConfig().then(res => {
        this.init();
      });
    }, 100);
  },
  methods: {
    // 走车队长公共逻辑
    _getCarMasterInfo() {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      let json = {
        advancePayState: this.advancePayState,
        mobileNo: this.weyBillSecond.mobileNo,
        payeeName: this.weyBillSecond.driverName,
        driverName: this.weyBillSecond.driverName,
        cartBadgeNo: this.weyBillSecond.cartBadgeNo
      };
      getCarMasterInfo(json)
        .then(res => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          if (res.data.reCode === "0") {
            const payeeList = res.data.result.payeeList || []
            let carTeamInfo = payeeList[payeeList.length-1] || []
            if (payeeList.length===0) {
              this.$store.commit("carTeamMasterInfo/RESET_CARTEAMINFO");
            } else {
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
    // 初始化
    init() {
      console.log("===init===");
      if (this.advancePayState === "0") {
        // 不是垫付单
        if (this.zyCapitalCfg === "8") {
          // 开通回款宝配置
          if (this.SYSpass === "1") {
            // 四要素通过
            this.reciveTypeShow = true;
          } else {
            // 四要素未通过
            this.reciveType = YHK_RECIVE;
            this.reciveTypeShow = true;
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
      } else if (this.advancePayState === "1") {
        // this.reciveMessageShow = true;
        // 是垫付单
        if (this.collectionFlagCfg === "45") {
          // 司机钱包收款
          const reciveMessage_DFJ =  this.driverName + HYB_WALLET
          this.$store.commit(
            "carTeamMasterInfo/setCarTeamInfo",
            { reciveMessage_DFJ }
          );
        } else if (this.collectionFlagCfg === "46") {
          // 司机钱包收款+车队长收款
          this._getCarMasterInfo();
        }
      }
    },
    changeReciver() {
      console.log("===changeReciver===");
      if (this.advancePayState === "0") {
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
      } else if (this.advancePayState === "1") {
        // this.reciveMessageShow = true;
        // 是垫付单
        if (this.collectionFlagCfg === "45") {
          // 司机钱包收款
          const reciveMessage_DFJ =  this.driverName + HYB_WALLET
          this.$store.commit(
            "carTeamMasterInfo/setCarTeamInfo",
            { reciveMessage_DFJ }
          );
        } else if (this.collectionFlagCfg === "46") {
          // 司机钱包收款+车队长收款
          this._getCarMasterInfo();
        }
      }
    },
    reciveMessageClick() {
      try {
        MtaH5.clickStat("settlement_webrecivemsg");
      } catch (error) {
        JSON.stringify(error);
      }
      if (this.advancePayState === "0") {
        // 自有资金
        this.goReciveMessage();
      } else if (this.advancePayState === "1") {
        if (this.collectionFlagCfg == "46") {
          // 垫付单且配置是车队长+司机
          this.carMasterSelect();
        }
      }
    },
    // 自有资金
    goReciveMessage() {
      if (this.zyCapitalCfg === "8" && this.reciveType === HYB_RECIVE) {
        this.$router.push({
          path: "/webReciveMsg2",
          //携带四要素
          query: {
            driverName: this.weyBillSecond.driverName,
            idCard: this.weyBillSecond.idCard,
            mobileNo: this.weyBillSecond.mobileNo,
            alipayNo: this.weyBillSecond.alipayNo
          }
        });
      } else {
        this.$router.push({
          path: "/ReciveMessage",
          query: {
            driverName: this.weyBillSecond.driverName,
            idCard: this.weyBillSecond.idCard,
            mobileNo: this.weyBillSecond.mobileNo,
            alipayNo: this.weyBillSecond.alipayNo
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
          mobileNo: this.weyBillSecond.mobileNo,
          cartBadgeNo: this.weyBillSecond.cartBadgeNo,
          payeeName: this.weyBillSecond.driverName,
          driverName: this.weyBillSecond.driverName
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
      //   // 默认司机
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
    }
  }
};
</script>
<style lang="less" scoped>
.ReciveCom {
  /deep/.van-field{
    color: #000;
    font-size: 16px;
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
