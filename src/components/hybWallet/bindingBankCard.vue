<template>
  <div class="binding-bank-card">
    <c-header>
      <x-header :left-options="{ backText: '' }">绑定银行卡</x-header>
    </c-header>
    <group label-width="6.5em" label-margin-right="0.2em" label-align="right">
      <x-input title="司机姓名：" v-model="realName" value-align="left" :disabled="true">
        <!-- placeholder="请输入司机姓名" -->
        <div slot="label" style="text-align:right;width:6.5em;">
          <span style="vertical-align:middle;">司机姓名：</span>
        </div>
      </x-input>
      <x-input
        title="银行名称："
        placeholder="请选择银行名称"
        type="text"
        :readonly="true"
        @click.native="gotoSelectBank"
        v-model="bankName"
      >
        <div slot="right">
          <i class="iconfont iconarr-right"></i>
        </div>
      </x-input>
      <!-- <popup-picker title="银行名称：" :data="bankList" v-model="bankName" placeholder="请选择收款银行">
        <template slot="title" slot-scope="props">
          <span :class="props.labelClass" :style="props.labelStyle" style="height:24px;">
            <span style="vertical-align:middle;">银行名称：</span>
          </span>
        </template>
      </popup-picker> -->
      <x-input
        title="银 行 卡 号："
        v-model.trim="bankCardNo"
        placeholder="请输入银行卡号"
        type="number"
        @on-blur="bankListAjax()"
      >
        <div slot="label" style="text-align:right;width:6.5em;">
          <span style="vertical-align:middle;">银行卡号：</span>
        </div>
      </x-input>
    </group>
    <div class="prompt-box">
      <img
        :src="bitian"
        alt
        width="8"
        height="8"
        style="font-size:20px;vertical-align:middle;"
        class="img1"
      />
      请填写司机本人的银行卡
    </div>
    <div class="footer">
      <x-button type="primary" class="save" @click.native="save()">绑定</x-button>
    </div>
    <div v-transfer-dom>
      <confirm
        v-model="showConfirm"
        title="提示"
        cancelText="取消"
        confirmText="确定"
        @on-cancel="onCancel"
        @on-confirm="onConfirm"
      >
        <p style="text-align:center;">{{errMsg}}</p>
        <p style="text-align:center;">
          <span>4001660056</span>
          <img
            src="../../assets/imgs/wbs/dianhua_icon@2x.png"
            alt
            width="20"
            style="    vertical-align: middle;"
            @click="dialPhone(realName,4001660056)"
          />
        </p>
      </confirm>
    </div>
  </div>
</template>
<script>
import { AppGotoTell, AppFinish } from "../../utils/app.js";
import { getBankName } from "../../api/applyPay.js";
// import { getHkbBankList } from "../../api/api.js";
import { bindBankCard } from "../../api/apiHybWallet.js";
export default {
  name: "binding-bank-card",
  data() {
    return {
      bitian: require("../../assets/imgs/wbs/bitian_icon@2x.png"),
      // bankList: [
      //   [
      //     "中国农业银行",
      //     "中国邮政储蓄银行",
      //     "中国工商银行",
      //     "中国建设银行",
      //     "中国银行",
      //     "平安银行",
      //     "中信银行",
      //     "兴业银行",
      //     "中国光大银行",
      //     "上海浦东发展银行",
      //     "招商银行",
      //     "中国民生银行"
      //   ]
      // ], //默认携带所有银行的数据
      realName: this.$route.query.realName, //司机姓名
      bankCardNo: "", //银行卡号
      bankName: '', //银行名称
      showConfirm: false,
      dcaWsUserId: this.$route.query.dcaWsUserId,
      hybWalletCfg: this.$route.query.hybWalletCfg,
      errMsg: "",
      from: this.$route.query.from ? this.$route.query.from : "2" // 0:运输列表 1：个人中心 2:建单 3：其他
    };
  },
  // provide(){
  //   return{
  //     bankName
  //   }
  // },
  beforeRouteEnter(to, from, next) {
    if (from.name == 'bank_list') {
      next(vm => {
        vm.$store.commit("updateLoadingStatus", { isLoading: false });
        let temp = JSON.parse(localStorage.getItem('chooseBank'))
        localStorage.removeItem('chooseBank');
        temp && (vm.bankName = temp.bankName);
      });
    }else{
      next()
    }
  },
  mounted() {
    this.$store.commit("updateLoadingStatus", { isLoading: false });
    // this.$nextTick(() => {
    //   getHkbBankList()
    //     .then(res => {
    //       // 9002
    //       this.$store.commit("updateLoadingStatus", { isLoading: false });
    //       if (res.data.reCode === "0") {
    //         let bankList1 = res.data.result.data.map(item => {
    //           return item.bankName;
    //         });
    //         this.bankList.push(bankList1);
    //       }
    //       // this._getRecPayHistory();
    //     })
    //     .catch(err => {
    //       this.$store.commit("updateLoadingStatus", { isLoading: false });
    //     });
    // });
  },
  methods: {
    // _getRecPayHistory() {
    //   getRecPayHistory("", this.realName, 0, "0", this.hybWalletCfg)
    //     .then(res => {
    //       this.$store.commit("updateLoadingStatus", { isLoading: false });
    //       if (res.data.result.payeeList.length === 0) {
    //       } else {
    //         let payeeList = res.data.result.payeeList;
    //         this.bankName = [payeeList[0].payeeBankName];
    //         this.bankCardNo = payeeList[0].payeeBankNo;
    //       }
    //     })
    //     .catch(error => {
    //       this.$store.commit("updateLoadingStatus", { isLoading: false });
    //       this.$vux.toast.text(error.message, "middle");
    //     });
    // },
    gotoSelectBank(){ 
      this.$router.push({path:'/bank_list'})
    },
    //点击按钮保存->判断四要素
    save() {
      //司机姓名
      if (this.isEmptyStr(this.realName)) {
        this.$vux.toast.text("司机姓名不能为空！", "middle");
        return false;
      }
      // //支付宝规则
      // if (this.isEmptyStr(this.alipayNo)) {
      //   this.$vux.toast.text("支付宝账号不能为空！", "middle");
      //   return false;
      // }
      //银行名称规则
      if (!(this.bankName.length > 0)) {
        this.$vux.toast.text("银行名称不能为空！", "middle");
        return false;
      }
      //银行卡号规则
      if (this.isEmptyStr(this.bankCardNo)) {
        this.$vux.toast.text("银行卡号不能为空！", "middle");
        return false;
      }
      this._bindBankCard();
    },
    onCancel() {},
    onConfirm() {},
    // 用户输入银行卡号是查询开户行名称
    bankListAjax() {
      if (this.bankCardNo.length < 11) return false;
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      getBankName(this.bankCardNo)
        .then(res => {
          //9000
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          if (res.data.reCode === "0") {
            this.bankName = '';
            this.bankName = res.data.result;
          }
        })
        .catch(err => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          this.$vux.toast.text(err.message, "middle");
        });
    },
    //非空验证通用方法
    isEmptyStr: function(str) {
      var pat = /^[\s]*$/;
      if (undefined == str || "" == str || null == str || pat.test(str)) {
        return true;
      }
      return false;
    },
    _bindBankCard() {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      let json = {
        dcaWsUserId: this.dcaWsUserId,
        bankCardNo: this.bankCardNo,
        bankName: this.bankName,
        realName: this.realName,
        from: this.from
      };
      bindBankCard(json).then(res => {
        this.$store.commit("updateLoadingStatus", { isLoading: false });
        if (res.data.reCode == "0") {
          this.$vux1.confirm.show({
            showCancelButton: false,
            title: `消息提示`,
            content: `<p style='color:#454545;'>绑定成功，司机可使用此卡在好运宝钱包中提取运费!</p>`,
            confirmText: "确定",
            onConfirm: () => {
              this.goHome();
            }
          });
        } else {
          this.showConfirm = true;
          this.errMsg = res.data.reInfo;
          // this.$vux.toast.text(res.data.reInfo, "middle");
        }
      });
    },
    goHome() {
      if (this.from == "1") {
        AppFinish(-2);
      } else if (this.from == "0") {
        try {
          MtaH5.clickStat("waybill_success_lookwaybill");
        } catch (error) {
          JSON.stringify(error);
        }
        AppFinish(-6);
      } else {
        try {
          MtaH5.clickStat("waybill_success_lookwaybill");
        } catch (error) {
          JSON.stringify(error);
        }
        let json = {
          selectedIndex: "0",
          subIndex: "0",
          waybillTopIndex: "0"
        };
        if (this.$sysType === 1) {
          // android写法
          AndroidWaybillJs.jumpIndex(JSON.stringify(json));
        } else if (this.$sysType === 2) {
          // ios写法
          window.webkit.messageHandlers.jumpIndex.postMessage(
            JSON.stringify(json)
          );
        } else {
          AppFinish(-6);
        }
      }
    },
    //拨打电话的弹框
    dialPhone(driverName, mobileNo) {
      this.showConfirm = false;
      this.$vux1.confirm.show({
        title: "拨打电话",
        content:
          `<p style='text-align:left'>请联系运营：</p><p style='color:#FFBA00;text-align:left'>` +
          mobileNo +
          `</p>`,
        confirmText: "确认",
        cancelText: "取消",
        onConfirm: () => {
          AppGotoTell(mobileNo);
        }
      });
    }
  }
};
</script>
<style lang="less">
.binding-bank-card {
  width: 100%;
  background-color: #efefef;
  .img1 {
    width: 8px;
    height: 8px;
  }
  .weui-cell__ft {
    color: #202020;
  }
  .weui-btn_primary {
    background-color: #15499a;
    color: #fff;
  }
  .footer {
    background: #fff;
    width: 100%;
    padding: 40px 0px;
    .save {
      width: 90%;
    }
  }
  .vux-popup-picker-select {
    text-align: left !important;
    .vux-popup-picker-placeholder {
      color: #9f9f9f;
    }
  }
  .weui-cell {
    .what_alipay {
      width: 60%;
      text-align: left;
      color: #ff3333;
      img {
        margin-right: 4px;
      }
    }
    .down_alipay {
      width: 40%;
      text-align: right;
      color: #1581cf;
      text-decoration: underline;
    }
  }
  .vux-x-input.disabled .weui-input {
    -webkit-text-fill-color: #202020;
  }
  .prompt-box {
    background: #fff;
    padding-left: 35px;
    font-size: 15px;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(255, 186, 0, 1);
    line-height: 36px;
  }
}
</style>
