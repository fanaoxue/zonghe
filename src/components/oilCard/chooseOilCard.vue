<template>
  <div class="choose-oil-card">
    <c-header>
      <x-header :left-options="{ backText: '' }">选择油卡</x-header>
    </c-header>
    <span v-show="show == true">
      <div class="default" v-show="cardList.length == 0 && !this.showyouka">
        <img src="../../assets/imgs/wbs/wuyoukajilu_icon@2x.png" alt width="100" />
        <p>该车辆当前无油卡支付记录！</p>
        <p>请去新增油卡~~</p>
      </div>
      <div v-show="cardList.length == 0 && this.showyouka">
        <div class="title-warn">*提醒司机在“好运宝-个人中心-我的油卡”查看使用油卡</div>
        <div class="card-box">
          <div class="card card3">
            <div class="left">
              <div>
                <img class="luge-icon" src="../../assets/imgs/wbs/lugelogo_img@2x.png" alt />电子油卡
              </div>
            </div>
            <div class="right">
              <x-button type="primary" @click.native="useCardConfirm1()">使用</x-button>
            </div>
          </div>
        </div>
      </div>
      <span v-show="cardList.length != 0">
        <div class="title-warn">*提醒司机在“好运宝-个人中心-我的油卡”查看使用油卡</div>
        <div class="card-box" v-show="showyouka">
          <div class="card card3">
            <div class="left">
              <div>
                <img class="luge-icon" src="../../assets/imgs/wbs/lugelogo_img@2x.png" alt />电子油卡
              </div>
            </div>
            <div class="right">
              <x-button type="primary" @click.native="useCardConfirm1()">使用</x-button>
            </div>
          </div>
        </div>
        <div class="card-box">
          <div
            class="card"
            v-for="(item, val) in cardList"
            :key="val"
            :class="item.oilBigType == '4' ? 'card3' : item.oilBgType == '2' ? 'card1' : 'card2'"
          >
            <div class="left">
              <span v-show="item.isSelfOrg == '0'">
                <img
                  src="../../assets/imgs/wbs/benqiye_img@2x.png"
                  alt
                  style="width: 50px;position: absolute;left: -10px;top: -20px;"
                />
                <p
                  style="position: absolute;top: -20px;left: -7px;font-size: 12px;letter-spacing: 2px;"
                >本企业</p>
              </span>
              <div>
                <img
                  class="luge-icon"
                  v-if="item.oilBigType == '4'"
                  src="../../assets/imgs/wbs/lugelogo_img@2x.png"
                  alt
                />
                {{
                item.oilTypeName
                }}
              </div>
              <div class="cardNum">{{ item.oilCardNo }}</div>
            </div>
            <div class="right">
              <!-- <p class="money"  v-show="item.isSelfOrg == '0'">￥<span>{{item.preOilBalance}}</span>余额</p> -->
              <x-button type="primary" @click.native="useCardConfirm(item)">使用</x-button>
            </div>
          </div>
        </div>
      </span>
      <div class="footer"></div>
      <div class="button">
        <x-button type="primary" class="newAddCard" @click.native="newAddCard()">绑定油卡</x-button>
      </div>
    </span>
  </div>
</template>
<script>
import { selectOilCard, openElectronicOilCard } from "../../api/apiOil.js";
export default {
  name: "chooseOilCard",
  data() {
    return {
      show: false, //默认页面不展示
      belongActSys: this.$route.query.belongActSys, //路由传来的所属账户体系
      cartBadgeNo: "", //车牌号
      driverName: "", //司机姓名
      mobileNo: "", //司机手机号
      prepaymentsOilCard: this.$route.query.prepaymentsOilCard, //预付油卡金额
      cardList: [], //卡列表
      chooseOilCardItem: {}, //已选择油卡
      showyouka: false //是否显示默认油卡
    };
  },
  beforeRouteEnter(to, from, next) {
    if (from.name == "settlementInfo") {
      next(vm => {
        vm.cartBadgeNo = vm.weyBillSecond.cartBadgeNo;
        vm.driverName = vm.weyBillSecond.driverName;
        vm.mobileNo = vm.weyBillSecond.mobileNo;
      });
    } else if (from.name == "modifyWaybill") {
      next(v => {
        v.cartBadgeNo = v.$route.query.cartBadgeNo;
        v.driverName = v.$route.query.driverName;
        v.mobileNo = v.$route.query.mobileNo;
      });
    } else if (from.name == "wbsApplyPay") {
      next(vv => {
        vv.cartBadgeNo = vv.$route.query.cartBadgeNo;
        vv.driverName = vv.$route.query.driverName;
        vv.mobileNo = vv.$route.query.mobileNo;
      });
    } else if (from.name == "addOilCard") {
      next(vn => {
        vn.cartBadgeNo = window.localStorage.getItem("cartBadgeNo");
        vn.driverName = window.localStorage.getItem("driverName");
        vn.mobileNo = window.localStorage.getItem("mobileNo");
        window.localStorage.removeItem("cartBadgeNo");
        window.localStorage.removeItem("driverName");
        window.localStorage.removeItem("mobileNo");
      });
    } else {
      next(vf => {
        vf.cartBadgeNo = vf.$route.query.cartBadgeNo;
        vf.driverName = vf.$route.query.driverName;
        vf.mobileNo = vf.$route.query.mobileNo;
      });
    }
  },
  beforeRouteLeave(to, from, next) {
    if (
      to.name == "modifyWaybill" ||
      to.name == "settlementInfo" ||
      to.name == "wbsApplyPay" || 
      to.name == "bigCompareModifyWaybill"
    ) {
      let updateOpions = {
        type: "chooseOilCardItem",
        updatMsg: this.chooseOilCardItem
      };
      this.$store.commit("updateOildCardStatus", updateOpions);
    }
    next();
  },
  computed: {
    weyBillSecond() {
      return this.$store.state.wayBill.weyBillSecond;
    }
  },
  created() {},
  mounted() {
    //进入选择油卡页面接口--3050
    this.$nextTick(() => {
      this.dataInit();
    });
  },
  methods: {
    //初始化数据
    dataInit() {
      selectOilCard(this.belongActSys, this.cartBadgeNo, this.mobileNo)
        .then(res => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          if (res.data.reCode === "0") {
            this.cardList = res.data.result.list;
            //显示的规则是 必须在白名单内
            // if (res.data.result.isOilWhite == "1") {
            if (this.cardList.length != "0") {
              let arr = [];
              this.cardList.forEach(e => {
                arr.push(e.oilBigType); //[2,2,2,4....]
              });
              if (arr.indexOf("4") > -1) {
                //存在 油卡
                this.showyouka = false;
              } else {
                //不存在 油卡
                this.showyouka = true;
              }
            } else {
              //展示没有卡号的电子油卡
              this.showyouka = true;
            }
            // }
          } else {
            this.$vux.toast.text(res.data.reInfo, "middle");
          }
          this.show = true;
        })
        .catch(err => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          this.show = true;
          this.$vux.toast.text("网络异常，请稍后再试~~~", "middle");
        });
    },
    //绑定油卡
    newAddCard() {
      try {
        MtaH5.clickStat("chooseoilcard_bindcard");
      } catch (error) {
        JSON.stringify(error);
      }
      // if(this.cardList.length >= '3'){
      //     let _arr = [];
      //     for(let i = 0; i < this.cardList.length; i++){
      //         _arr.push(this.cardList[i].oilBigType)
      //     }
      //     var _res = [];
      //     _arr.sort();
      //     for (let i = 0; i < _arr.length;) {
      //         var count = 0;
      //         for (var j = i; j < _arr.length; j++) {
      //             if (_arr[i] == _arr[j]) {
      //                 count++;
      //             }
      //         }
      //         _res.push([_arr[i], count]);
      //         i += count;
      //     }
      //     //_res 二维数维中保存了 值和值的重复数
      //     for (let i = 0; i < _res.length; i++) {
      //         // console.log("类型":+_res[i][0] + "重复次数:" + _res[i][1]);
      //         console.log(_res[i][0])
      //         if(_res[i][0] >= 3){
      //             this.$vux.alert.show({
      //                 title: "提示",
      //                 content: "该车辆所绑油卡已满，请联系快路宝客服处理！"
      //             });
      //             return false;
      //         }
      //     }
      // }
      this.$router.push({
        path: "/addOilCard",
        query: {
          prepaymentsOilCard: this.prepaymentsOilCard,
          cartBadgeNo: this.cartBadgeNo,
          belongActSys: this.belongActSys,
          driverName: this.driverName,
          mobileNo: this.mobileNo
        }
      });
    },
    useCardConfirm(item) {
      // 电子油卡，且未使用过
      if (item.isUseEleOil === "0" && item.oilBigType === "4") {
        this.$vux1.confirm.show({
          title: `确认使用`,
          content: `<p style='text-align:left;font-size:16px;font-family:PingFang-SC-Bold;font-weight:bold;color:rgba(69,69,69,1);'>路歌电子油卡</p><p style='text-align:left;font-size:16px;font-family:PingFang-SC-Medium;font-weight:500;color:rgba(255,186,0,1);'>请提醒司机去指定站点加油!</p>`,
          confirmText: "确认",
          cancelText: "取消",
          onConfirm: () => {
            this.useCard(item);
          },
          onCancel: () => {}
        });
      } else {
        this.useCard(item);
      }
    },
    //没有油卡的时候,走16006接口去开通油卡,再使用默认空的油卡
    useCardConfirm1() {
      // this.$vux.toast.text('使用默认油卡','middle')
      if (this.driverName == "" || this.driverName == undefined) {
        this.$vux.toast.text("司机姓名不能为空！", "middle");
        return;
      }
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      openElectronicOilCard(this.mobileNo, this.driverName)
        .then(res => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          if (res.data.reCode == "0") {
            window.localStorage.setItem("oilCardNo", res.data.result.oilCardNo);
            this.chooseOilCardItem = {
              oilBigType: "4",
              oilCardNo: res.data.result.oilCardNo
            };
            this.$router.go(-1);
          } else {
            this.$vux1.confirm.show({
              title: `确认使用`,
              content: res.data.reInfo,
              confirmText: "确认",
              cancelText: "取消",
              onConfirm: () => {
                // this.useCardConfirm1();
              },
              onCancel: () => {}
            });
          }
        })
        .catch(err => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          this.$vux.toast.text("网络异常，请稍后再试~~~", "middle");
        });
    },
    //使用油卡-携带卡号
    useCard(item) {
      try {
        MtaH5.clickStat("chooseoilcard_usecard");
      } catch (error) {
        JSON.stringify(error);
      }
      window.localStorage.setItem("oilCardNo", item.oilCardNo);
      this.chooseOilCardItem = item;
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="less">
.choose-oil-card {
  .title-warn {
    width: 95%;
    margin: 1rem auto;
    font-size: 14px;
    color: rgba(255, 51, 51, 1);
  }
  .default {
    margin: 100px auto 0px;
    width: 66%;
    text-align: center;
    p {
      color: #797979;
    }
  }
  .card1 {
    width: 95%;
    height: 6.4375rem;
    margin: 10px auto;
    background: url("../../assets/imgs/wbs/shiyouka_img@2x.png") no-repeat
      center center;
    background-size: 100% 100%;
    position: relative;
    .left {
      width: 70%;
      float: left;
      color: #fff;
      position: absolute;
      top: 50%;
      left: 10px;
      margin-top: -25px;
    }
    .right {
      .money {
        display: inline-block;
        position: absolute;
        top: 15%;
        width: 40%;
        right: 0;
        text-align: center;
        color: #202020;
        span {
          font-size: 18px;
          font-weight: bold;
          margin-right: 5px;
        }
      }
      .weui-btn {
        width: 25%;
        height: 30px;
        line-height: 30px;
        float: right;
        background: #1e66b4;
        color: #fff;
        position: absolute;
        top: 50%;
        right: 10px;
      }
    }
  }
  .card2 {
    width: 95%;
    height: 6.4375rem;
    margin: 10px auto;
    background: url("../../assets/imgs/wbs/shihuaka_img@2x.png") no-repeat
      center center;
    background-size: 100% 100%;
    position: relative;
    .left {
      width: 70%;
      float: left;
      color: #fff;
      position: absolute;
      top: 50%;
      left: 10px;
      margin-top: -25px;
    }
    .right {
      .money {
        display: inline-block;
        position: absolute;
        top: 15%;
        width: 40%;
        right: 0;
        text-align: center;
        color: #202020;
        span {
          font-size: 18px;
          font-weight: bold;
          margin-right: 5px;
        }
      }
      .weui-btn {
        width: 25%;
        height: 30px;
        line-height: 30px;
        float: right;
        background: #1e66b4;
        color: #fff;
        position: absolute;
        top: 50%;
        right: 10px;
      }
    }
  }
  .card3 {
    width: 95%;
    height: 6.4375rem;
    margin: 10px auto;
    background: url("../../assets/imgs/wbs/chaiyouka_img@2x.png") no-repeat
      center center;
    background-size: 100% 100%;
    position: relative;
    .luge-icon {
      height: 1rem;
      vertical-align: middle;
      margin-right: 0.5rem;
    }
    .left {
      width: 70%;
      float: left;
      color: #fff;
      position: absolute;
      top: 50%;
      left: 10px;
      margin-top: -25px;
    }
    .right {
      .money {
        display: inline-block;
        position: absolute;
        top: 15%;
        width: 40%;
        right: 0;
        text-align: center;
        color: #202020;
        span {
          font-size: 18px;
          font-weight: bold;
          margin-right: 5px;
        }
      }
      .weui-btn {
        width: 25%;
        height: 30px;
        line-height: 30px;
        float: right;
        background: #1e66b4;
        color: #fff;
        position: absolute;
        top: 50%;
        right: 10px;
      }
    }
  }
  .card-box .card:first-child {
    margin-top: 0;
  }
  .footer {
    height: 70px;
  }
  .button {
    background: #fff;
    padding: 10px 0;
    position: fixed;
    bottom: 0px;
    width: 100%;
    height: 55px;
    .newAddCard {
      background: #15499a;
      color: #fff;
      width: 90%;
    }
  }
}
</style>
