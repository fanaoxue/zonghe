<template>
  <div class="transport-info" v-show="pageShow">
    <c-header>
      <x-header :left-options="{ backText: '' }">运输信息</x-header>
    </c-header>
    <group>
      <!--<div class="header">
            </div>
            <div class="transline">
                <div>
                    <img :src="startPlace" alt="" width="25px">
                    <div class="title1">{{loadingAddressName}}</div>
                    <div class="title2">{{zhuanghuodichengshi}}</div>
                </div>
                <div>
                    <img :src="line" alt="" height="20px" class="line">
                </div>
                <div>
                    <img :src="endPlace" alt=""  width="25px">
                    <div class="title1">{{unloadingAddressName}}</div>
                    <div class="title2">{{xiehuodichengshi}}</div>
                </div>
      </div>-->
      <div class="header-box">
        <div class="header">
          <div class="header-left">
            <div>
              <img :src="startPlace" alt width="20px" />
              <div class="title">
                <div
                  class="text-over"
                  style="font-weight:bold;font-size:16px;line-height:18px;margin-bottom:2px;"
                >{{ loadingAddressName }}</div>
                <div class="text-over" style="font-size:14px;">{{ zhuanghuodichengshi }}</div>
              </div>
            </div>
            <div style="width: 20px;">
              <div class="line"></div>
            </div>
            <div>
              <img :src="endPlace" alt width="20px" />
              <div class="title">
                <div
                  class="text-over"
                  style="font-weight:bold;font-size:16px;line-height:18px;margin-bottom:2px;"
                >{{ unloadingAddressName }}</div>
                <div class="text-over" style="font-size:14px;">{{ xiehuodichengshi }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </group>
    <group label-width="6.5em" label-margin-right="1em" label-align="right">
      <x-input
        title="货物名称："
        v-model.trim="goodsName"
        placeholder="请填写货物名称"
        disabled
        text-align="right"
      ></x-input>
      <x-input
        title="运输单价："
        v-model.trim="unitPrice"
        placeholder="请输入货物的单价"
        disabled
        text-align="right"
        v-show="this.classify !== '0'"
      >
        <span slot="right" class="orgName">元/吨</span>
      </x-input>
      <x-input
        title="发货单位："
        v-model.trim="orgName"
        placeholder="请输入发货单位"
        disabled
        text-align="right"
        v-show="this.classify !== '0'"
      ></x-input>
      <datetime
        title="发车日期："
        v-model="startTime"
        format="YYYY-MM-DD"
        :start-date="startDate"
        :end-date="endDate"
        year-row="{value}年"
        month-row="{value}月"
        day-row="{value}日"
        @on-change="changeTime"
        placeholder="请填写实际发车时间"
      >
        <div slot="title" style="text-align:right;padding-right:1em;width:6.5em;">
          <img
            :src="bitian"
            alt
            width="8px"
            height="8px"
            style="font-size:20px;vertical-align:middle;"
            class="img1"
          />
          <span style="vertical-align:middle;">发车日期：</span>
        </div>
      </datetime>
      <div class="weui-cell" v-show="billCycleMode == '8' && this.classify != '0'">
        <checker
          v-model="items1Value"
          default-item-class="demo1-item"
          selected-item-class="demo1-item-selected"
          radio-required
          @on-change="changeType"
        >
          <checker-item value="1" style="margin-left:1em;">
            <img
              :src="src1"
              alt
              width="15"
              height="15"
              style="vertical-align: middle;"
              class="img2"
            />
            <span style="vertical-align: middle;margin-left:0.5em;">单趟</span>
          </checker-item>
          <checker-item value="2" style="margin-left:1em;">
            <img
              :src="src2"
              alt
              width="15"
              height="15"
              style="vertical-align: middle;"
              class="img2"
            />
            <span style="vertical-align: middle;margin-left:0.5em;">多趟</span>
          </checker-item>
        </checker>
        <label v-show="items1Value == 2">
          <input placeholder="请输入次数" class="input-sty" v-model="transTrip" />&nbsp;&nbsp;
          <span>趟</span>
        </label>
      </div>
      <x-input
        title="业务项目："
        placeholder="请输入运输的类别名称"
        v-model.trim="wbItem"
        v-show="businessItems == '3' && this.classify != '0'"
      >
        <div slot="label" style="text-align:right;padding-right:1em;width:6.5em;">
          <img
            :src="bitian"
            alt
            width="8"
            height="8"
            style="font-size:20px;vertical-align:middle;"
            class="img1"
          />
          <span style="vertical-align:middle;">业务项目：</span>
        </div>
      </x-input>
    </group>
    <div class="weui-cell">
      <p class="red">
        <span>*</span>发车日期与磅单中的装货日期一致，否则无法完成支付
      </p>
    </div>
    <div class="footer" style="height:74px;"></div>
    <div class="button">
      <x-button type="primary" @click.native="nextClick" :disabled="buttonState">下一步</x-button>
    </div>
  </div>
</template>
<script>
import { getTransportInfo, dazongNewBill } from "../../api/dazongapi.js";
import { AppFinish } from "../../utils/app.js";
import { getCookie } from "../../utils/getCookie.js";
import { newVersion } from "../../utils/version.js";
import { getCompanyConfig } from "../../api/api.js";
export default {
  name: "",
  data() {
    return {
      bg: require("../../assets/imgs/wbs/bg_img@2x.png"),
      bitian: require("../../assets/imgs/wbs/bitian_icon@2x.png"),
      src1: require("../../assets/imgs/wbs/xuanzeselect_icon@2x.png"),
      src2: require("../../assets/imgs/wbs/xuanze_icon@2x.png"),
      src3: require("../../assets/imgs/wbs/xuanze_icon@2x.png"),
      src4: require("../../assets/imgs/wbs/xuanzeselect_icon@2x.png"),
      startPlace: require("../../assets/imgs/wbs/zhuang_icon@2x.png"),
      line: require("../../assets/imgs/wbs/xuxian_icon@2x.png"),
      endPlace: require("../../assets/imgs/wbs/xie_icon@2x.png"),
      buttonState: false, //按钮默认可以点击
      goodsName: "", //货物名称
      unitPrice: "", //运输单价
      orgName: "", //发货单位
      startTime: "", //发车日期
      startDate: "", //开始时间
      endDate: "", //结束时间
      billCycleMode: "", //结算周期模式
      items1Value: "1",
      transTrip: "1", //运输趟次
      wbItem: "", //业务项目
      businessItems: "", //业务项目配置
      loadingAddressName: "", //发货地名称
      zhuanghuodichengshi: "", //装货地城市
      unloadingAddressName: "", //卸货地名称
      xiehuodichengshi: "", //卸货地城市
      scanResult: this.$route.query.scanResult, //包含线路ID和fid
      // transportLineId: this.$route.query.transportLineId, //二维码ID
      transportLineId: "", //线路ID
      fid: "", //   1 装货地   2 卸货地
      orgId: "", //企业ID
      pageShow: false, //页面默认不展示
      startProvinceCode: "",
      startCityCode: "",
      startCountyCode: "",
      endProvinceCode: "",
      endCityCode: "",
      endCountyCode: "",
      tripFlag: "0", //单趟，多趟标识
      classify: getCookie("classify") //类别分类 0：大宗自有运单(不扫码建单) 1：大宗外协运单
      // classify:'0'
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name == "bigCompreCarTeam") {
        vm.$store.commit("updateLoadingStatus", { isLoading: false });
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    let obj = {
      goodsName: this.goodsName, //货物名称
      startTime: this.startTime, //发车时间
      unitPrice: this.unitPrice, //运输单价
      orgName: this.orgName, //发货单位
      billCycleMode: this.billCycleMode, //
      items1Value: this.items1Value, //趟次类型
      transTrip: this.transTrip, //运输趟次
      wbItem: this.wbItem, //业务项目
      orgId: this.orgId, //企业ID
      transportLineId: this.transportLineId, //线路ID
      startProvinceCode: this.startProvinceCode,
      startCityCode: this.startCityCode,
      startCountyCode: this.startCountyCode,
      endProvinceCode: this.endProvinceCode,
      endCityCode: this.endCityCode,
      endCountyCode: this.endCountyCode,
      loadingAddressName: this.loadingAddressName,
      unloadingAddressName: this.unloadingAddressName,
      maxAllFreight: this.maxAllFreight,
      tripFlag: this.tripFlag
    };
    let updateOpions = {
      type: "dazongFirst",
      updatMsg: obj
    };
    this.$store.commit("updateWayBillStatus", updateOpions);
    next();
  },
  created() {
    this._getCompanyConfig()
      .then(res => {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        if (year < 10) {
          year = "0" + year;
        }
        if (month < 10) {
          month = "0" + month;
        }
        if (day < 10) {
          day = "0" + day;
        }
        this.endDate = year + "-" + month + "-" + day;
        //判断 scanResult 里面的 transportLineId 和 fid
        try {
          if (this.$route.query.transportLineId) {
            this.transportLineId = this.$route.query.transportLineId;
            this.dataInit();
          } else {
            this.scanResult = JSON.parse(decodeURIComponent(this.scanResult));
            // this.scanResult = {'fid':'1','transportLineId':'176'}
            console.log(this.scanResult.fid, this.scanResult.transportLineId);
            if (
              (JSON.stringify(this.scanResult) != "{}" &&
                !this.isEmptyStr(this.scanResult.fid)) ||
              !this.isEmptyStr(this.scanResult.transportLineId)
            ) {
              this.fid = this.scanResult.fid;
              this.transportLineId = this.scanResult.transportLineId;
              this.dataInit();
            } else {
              this.$store.commit("updateLoadingStatus", { isLoading: false });
              this.$vux.toast.text("请扫描快路宝建单二维码!", "middle");
            }
            if (this.fid == "1" && this.classify == "0") {
              this.startTime = this.endDate;
            }
          }
        } catch (err) {
          console.log(err);
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          this.$vux.toast.text("请扫描快路宝建单二维码!", "middle");
        }
      })
      .catch(error => {});
  },
  mounted() {},
  computed: {
    dazongFirst() {
      return this.$store.state.dazong.dazongFirst;
    }
  },
  methods: {
    _getCompanyConfig() {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      return new Promise((resolve, reject) => {
        getCompanyConfig()
          .then(res => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode === "0") {
              // this.createWaybillCfg = res.data.result.createWaybillCfg; // 新建运单配置 8：开通9：关闭
              if (res.data.result.createWaybillCfg === "9") {
                this.$vux.confirm.show({
                  title: "提示",
                  confirmText: "确认",
                  cancelText: "取消",
                  content: "当前企业已关闭建单权限！",
                  showCancelButton: false,
                  onConfirm: () => {
                    AppFinish(-1);
                  }
                });
                reject();
              } else {
                resolve();
              }
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
    dataInit() {
      let json = {
        transportLineId: this.transportLineId //87
      };
      getTransportInfo(json)
        .then(re => {
          //3097
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          if (re.data.reCode == "0") {
            let result = re.data.result;
            this.goodsName = result.goodsName;
            this.unitPrice = result.curTransportUnitPrice;
            this.loadingAddressName = result.loadingAddressName;
            this.unloadingAddressName = result.unloadingAddressName;
            this.zhuanghuodichengshi =
              result.loadingProvinceName +
              result.loadingCityName +
              result.loadingCountyName;
            this.xiehuodichengshi =
              result.unloadingProvinceName +
              result.unloadingCityName +
              result.unloadingCountyName;
            this.orgId = result.orgId; //企业ID
            // this.startProvinceCode = result.loadingProvinceCode;
            // this.startCityCode = result.loadingCityCode;
            // this.startCountyCode = result.loadingCountyCode;
            // this.endProvinceCode = result.unloadingProvinceCode;
            // this.endCityCode = result.unloadingCityCode;
            // this.endCountyCode = result.unloadingCountyCode;
            this.startProvinceCode = result.loadingProvinceId;
            this.startCityCode = result.loadingCityId;
            this.startCountyCode = result.loadingCountyId;
            this.endProvinceCode = result.unloadingProvinceId;
            this.endCityCode = result.unloadingCityId;
            this.endCountyCode = result.unloadingCountyId;
            this.orgName = result.orgName;
            this.tripFlag = result.manyTrips;
            if (result.lineState == "1" || result.isDel == "1") {
              this.buttonState = true; //按钮不可点击
              this.$vux.confirm.show({
                title: "提示",
                content: "该条二维码线路已删除/停用，请联系企业处理",
                confirmText: "确定",
                showCancelButton: false,
                onConfirm: () => {
                  AppFinish("-1");
                }
              });
            } else {
              this.getAllData();
            }
          } else {
            this.$vux.toast.text(re.data.reInfo, "middle");
          }
        })
        .catch(err => {
          console.log(err);
          this.$vux.toast.text(err, "middle");
          this.$store.commit("updateLoadingStatus", { isLoading: false });
        });
    },
    //获取页面所有配置
    getAllData() {
      // this.orgId = "88213531";
      let json = {
        src: this.classify == "0" ? "0" : "1",
        updw_orgid: this.orgId
      };
      if (this.classify == "0") {
        json.type = "0";
      }
      dazongNewBill(json)
        .then(res => {
          //3064
          if (res.data.reCode == "0") {
            let result = res.data.result;
            this.billCycleMode = result.billCycleMode;
            this.businessItems = result.businessItems;
            this.maxAllFreight = result.maxAllFreight; //最大运费金额
          } else {
            //您未与该企业绑定承运关系 ,不可建单
            // this.$vux.toast.text(res.data.reInfo, "middle");
            this.buttonState = true; //按钮不可点击
            this.$vux.confirm.show({
              title: "提示",
              content: res.data.reInfo,
              confirmText: "返回",
              showCancelButton: false,
              onConfirm: () => {
                AppFinish("-1");
              }
            });
          }
          this.$nextTick(() => {
            //数据走完显示页面
            this.pageShow = true;
          });
        })
        .catch(err => {
          this.$vux.toast.text(err.message, "middle");
          this.$store.commit("updateLoadingStatus", { isLoading: false });
        });
    },
    //下一步按钮
    nextClick() {
      //发货日期必填项
      if (this.isEmptyStr(this.startTime)) {
        this.$vux.toast.text("发车时间不能为空", "middle");
        return false;
      }
      //多趟时趟次范围2-99
      if (
        this.classify != "0" &&
        this.billCycleMode == "8" &&
        this.items1Value == "2"
      ) {
        let reg = /^[1-9]\d{0,2}$/;
        if (!reg.test(this.transTrip)) {
          this.$vux.toast.text("无效的趟次！", "middle");
          return false;
        } else {
          if (this.transTrip <= 1) {
            this.$vux.toast.text("运输趟次为多趟时，趟次必须大于1！", "middle");
            return false;
          }
        }
      }
      //业务项目
      if (
        this.classify != "0" &&
        this.businessItems == 3 &&
        this.isEmptyStr(this.wbItem)
      ) {
        this.$vux.toast.text("业务项目必填！", "middle");
        return;
      }
      this.$router.push("/bigCompreCarTeam");
    },
    //发车日期
    changeTime(val) {
      console.log(val);
      this.startTime = val;
    },
    //切换趟次
    changeType(val) {
      if (val == 1 || val == "") {
        this.src2 = this.src3;
        this.src1 = this.src4;
        this.transTrip = val;
      } else {
        this.src1 = this.src3;
        this.src2 = this.src4;
        if (Number(this.transTrip) > 1) {
          this.transTrip = this.transTrip;
        } else {
          this.transTrip = "2";
        }
      }
      this.items1Value = val;
    },
    //非空验证通用方法
    isEmptyStr: function(str) {
      var pat = /^[\s]*$/;
      if (undefined == str || "" == str || null == str || pat.test(str)) {
        return true;
      }
      return false;
    }
  }
};
</script>
<style lang="less">
.transport-info {
  width: 100%;
  background-color: #efefef;
  position: absolute;
  top: 0rem;
  min-height: 100%;
  height: auto;
  .header-box {
    padding: 15px;
    background: #fff;
    .header {
      max-height: 130px;
      min-height: 120px;
      height: auto;
      font-size: 16px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: #202020;
      background-image: url(../../assets/imgs/wbs/bg_img@2x.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      background-position: center;
      display: flex;
      justify-content: flex-start;
      .header-left {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        padding: 10px;
        .line {
          border-left: 1px dashed #000;
          height: 20px;
          align-self: center;
        }
        & > div {
          display: flex;
          justify-content: center;
          align-items: center;

          .title {
            margin-left: 10px;
            white-space: nowrap;
            line-height: 100%;
            // font-size: 14px;
            font-family: PingFang-SC-Medium;
            color: #202020;
            // text-overflow: ellipsis;
            // -webkit-line-clamp: 2;
            // overflow: hidden;
            // -webkit-box-orient: vertical;
            // display: -webkit-box;
          }
        }
      }
    }
  }
  .text-over {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
    white-space: normal;
    width: 70vw;
  }
  .weui-cell {
    @media screen and (max-width: 320px) {
      font-size: 15px;
    }
  }
  .weui-cell:before {
    left: 0px;
  }
  .header {
    height: 9rem;
    background-image: url(../../assets/imgs/wbs/bg_img@2x.png);
    background-repeat: no-repeat;
    background-size: 95% 85%;
    background-position: center;
  }
  .transline {
    position: absolute;
    z-index: 200;
    top: 25px;
    left: 25px;
    div {
      width: 300px;
      position: relative;
      .title1 {
        position: absolute;
        top: -9px;
        left: 40px;
        font-weight: bold;
        font-size: 16px;
        @media screen and (max-width: 320px) {
          font-size: 14px;
        }
      }
      .title2 {
        position: absolute;
        top: 12px;
        left: 40px;
        width: 250px;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        overflow: hidden;
        -webkit-box-orient: vertical;
        display: -webkit-box;
        font-size: 14px;
        @media screen and (max-width: 320px) {
          font-size: 12px;
        }
      }
    }
    .line {
      margin-left: 12px;
    }
  }
  .weui-cell__hd {
    color: #797979;
  }
  // .weui-cell__bd {
  //     input{
  //         text-align:right;
  //     }
  // }
  .weui-cell__ft {
    // text-align:left;
    .orgName {
      color: #202020;
    }
  }
  .vux-datetime {
    span {
      color: #797979;
    }
  }

  .red {
    color: #ff3333;
    // text-indent: 1.3em;
  }
  .button {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background: #fff;
  }
  .weui-btn_primary {
    background-color: #15499a !important;
    margin: 1rem auto;
    width: 90% !important;
  }
  /*
    *趟次样式
    */
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
  .vux-x-input.disabled .weui-input {
    // text-fill-color: #202020;
    -webkit-text-fill-color: #202020;
  }
  .weui-btn_disabled {
    background-color: #efefef !important;
    color: #aaa;
  }
}
</style>
