<template>
  <div class="bigcompre-waybill-info">
    <c-header>
      <x-header :left-options="{ backText: '' }">运单信息</x-header>
    </c-header>
    <group label-width="7em" label-margin-right="1em" label-align="right">
      <x-input title="运 单 号：" v-model.trim="taxWaybillNo" placeholder="请填写运单号" :max="128">
        <div slot="label" style="text-align:right;padding-right:1em;width:7em;">
          <img
            :src="bitian"
            alt
            v-show="waybillNoCfg == 1"
            width="8"
            height="8"
            style="font-size:20px;vertical-align:middle;"
            class="img"
          />
          <span style="vertical-align:middle;">运 单 号：</span>
        </div>
      </x-input>
      <x-input title="装货地名称：" v-model.trim="loadingAddressName" placeholder="请输入装货地名称">
        <div slot="label" style="text-align:right;padding-right:1em;width:7em;">
          <img
            :src="bitian"
            alt
            width="8"
            height="8"
            style="font-size:20px;vertical-align:middle;"
            class="img"
          />
          <span style="vertical-align:middle;">装货地名称：</span>
        </div>
      </x-input>
      <popup-picker
        title="装货地城市："
        :data="cityList"
        :columns="3"
        v-model="value3"
        disabled
        show-name
        @on-hide="startValue"
        @click.native="chooseStCity(0)"
      >
        <template slot="title" slot-scope="props">
          <span :class="props.labelClass" :style="props.labelStyle" style="height:24px;">
            <img
              :src="bitian"
              alt
              width="8"
              height="8"
              style="font-size:20px;vertical-align:middle;"
              class="img"
            />
            <span style="vertical-align:middle;">装货地城市：</span>
          </span>
        </template>
      </popup-picker>
      <x-input title="卸货地名称：" v-model.trim="unloadingAddressName" placeholder="请输入卸货地名称">
        <div slot="label" style="text-align:right;padding-right:1em;width:7em;">
          <img
            :src="bitian"
            alt
            width="8"
            height="8"
            style="font-size:20px;vertical-align:middle;"
            class="img"
          />
          <span style="vertical-align:middle;">卸货地名称：</span>
        </div>
      </x-input>
      <popup-picker
        title="卸货地城市："
        :data="cityList"
        :columns="3"
        v-model="value4"
        disabled
        show-name
        @on-hide="endValue"
        @click.native="chooseStCity(1)"
      >
        <template slot="title" slot-scope="props">
          <span :class="props.labelClass" :style="props.labelStyle" style="height:24px;">
            <img
              :src="bitian"
              alt
              width="8"
              height="8"
              style="font-size:20px;vertical-align:middle;"
              class="img"
            />
            <span style="vertical-align:middle;">卸货地城市：</span>
          </span>
        </template>
      </popup-picker>
      <x-input title="货物名称：" v-model="goodsName" type="text" placeholder="请输入货物名称">
        <div slot="label" style="text-align:right;padding-right:1em;width:7em;">
          <img
            :src="bitian"
            alt
            width="8"
            height="8"
            style="font-size:20px;vertical-align:middle;"
            class="img"
          />
          <span style="vertical-align:middle;">货物名称：</span>
        </div>
      </x-input>
      <x-input title="运输单价：" v-model.trim="unitPrice" placeholder="请输入货物的单价" type="number">
        <span slot="right" class="danwei">元/{{ transportUnitPriceType | typeFilter }}</span>
      </x-input>
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
        <div slot="title" style="text-align:right;padding-right:1em;width:7em;">
          <img
            :src="bitian"
            alt
            width="8px"
            height="8px"
            style="font-size:20px;vertical-align:middle;"
            class="img"
          />
          <span style="vertical-align:middle;">发车日期：</span>
        </div>
      </datetime>
    </group>
    <group label-width="7em" label-margin-right="1em" label-align="right">
      <popup-picker
        title="受票方："
        :data="list3"
        v-model="draweeArr"
        @on-change="taxDraweeChange"
        placeholder="请选择受票方"
      >
        <template slot="title" slot-scope="props">
          <span :class="props.labelClass" :style="props.labelStyle" style="height:24px;">
            <img
              :src="bitian"
              class="img"
              alt
              width="8"
              height="8"
              style="font-size:20px;vertical-align:middle;"
            />
            <span style="vertical-align:middle;">受票方：</span>
          </span>
        </template>
      </popup-picker>
      <!-- <x-input title="业务项目：" v-model.trim="wbItem" placeholder="请输入业务项目" v-show="businessItems == '38'"></x-input> -->
      <x-input
        title="业务项目："
        v-model.trim="wbItem"
        placeholder="请输入业务项目名称"
        v-show="this.businessItems == '3' || this.businessItems == '38'"
      >
        <template v-if="this.businessItems == '3'">
          <div slot="label" style="text-align:right;padding-right:1em;width:7em;">
            <img
              :src="bitian"
              alt
              width="8"
              height="8"
              style="font-size:20px;vertical-align:middle;"
              class="img"
            />
            <span style="vertical-align:middle;">业务项目：</span>
          </div>
        </template>
      </x-input>
      <popup-picker
        title="发货人："
        :data="consignorList"
        v-model="consignor"
        placeholder="请选择发货人"
        v-show="consignorState"
      ></popup-picker>
      <x-textarea title="运输要求：" placeholder="请输入您对本次运输的要求" :max="64" v-model="requirement"></x-textarea>
    </group>
    <div class="footer" style="height:74px;"></div>
    <div class="button">
      <x-button type="primary" @click.native="nextStep" :disabled="buttonState">下一步</x-button>
    </div>
  </div>
</template>
<script>
import { getTransportInfo } from "../../api/dazongapi.js";
import {
  queryWaybill,
  qeurywaybillNo,
  getDrawee,
  checkCommonCity,
  getCompanyConfig
} from "../../api/api.js";
import { cityDataToIWant } from "../../utils/cMethods";
import { getCookie } from "../../utils/getCookie.js";
import { setNativeHead,AppFinish } from "../../utils/app.js";
export default {
  name: "bigCompreWayBillInfo",
  data() {
    return {
      // classify: this.$route.query.classify,
      classify: getCookie("classify"), //类别分类  0：大宗自有运单(不扫码建单)  1：大宗外协运单
      transportLineId: this.$route.query.transportLineId, //线路ID
      bitian: require("../../assets/imgs/wbs/bitian_icon@2x.png"),
      cityList: cityDataToIWant(city.data),
      taxWaybillNo: "",
      loadingAddressName: "",
      unloadingAddressName: "",
      value3: [],
      value4: [],
      startProvinceCode: "",
      startCityCode: "",
      startCountyCode: "",
      endProvinceCode: "",
      endCityCode: "",
      endCountyCode: "",
      goodsName: "",
      unitPrice: "",
      startTime: "", //发车日期
      startDate: "", //开始时间
      endDate: "", //结束时间
      minDate: "", // 最小日期
      list3: [],
      drawee: "", //受票方名称
      draweeArr: [], //受票方名称数组
      taxDraweePartyId: "", //受票方ID
      taxDraweePartyIdArr: [], //受票方ID集合
      consignorList: [],
      consignor: [],
      consignorState: false,
      requirement: "",
      buttonState: false, //按钮默认可以点击
      isDisable: true, //控制点击次数
      cityIdArr: [],
      types: "", //判断始发还是目的城市的标志
      waybillNoCfg: "", //运单号必填配置
      tripFlag: "0", //单趟，多趟标识
      businessItems: "", // 业务项目配置
      wbItem: "", // 业务项目
      transportUnitPriceType: "" // 货物单位
    };
  },
  filters: {
    typeFilter(item) {
      // 0-吨
      // 1-方
      // 2-件
      // 3-车
      let type = "";
      switch (item) {
        case "0":
          type = "吨";
          break;
        case "1":
          type = "方";
          break;
        case "2":
          type = "件";
          break;
        case "3":
          type = "车";
          break;
        default:
          type = "";
          break;
      }
      return type;
    }
  },
  beforeRouteEnter(to, from, next) {
    let json = { isShow: "1" };
    setNativeHead(json);
    if (from.name === "chooseCity") {
      next(vm => {
        vm.$store.commit("updateLoadingStatus", { isLoading: false });
        vm.cityIdArr = JSON.parse(localStorage.getItem("cityIdArr"));
      });
    } else if (from.name === "bigCompreCarTeam") {
      next(vm => {
        vm.$store.commit("updateLoadingStatus", { isLoading: false });
      });
    } else {
      next(vm => {
        vm.value3 = [];
        vm.value4 = [];
        vm.draweeArr = [];
        vm.list3 = [];
        vm.consignorList = [];
        vm.consignor = [];
        vm.buttonFlag = true;
        vm.$nextTick(() => {
          vm.$_getCompanyConfig().then(()=> {
            vm.dataInit().then(()=>{
              vm.getDraweeMethod().then(()=>{
                vm.queryWaybillMethod().then(()=>{})
              })
            });
          })
        });
      });
      // next();
    }
  },
  beforeRouteLeave(to, from, next) {
    let obj = {
      taxWaybillNo: this.taxWaybillNo,
      transportLineId: this.transportLineId,
      loadingAddressName: this.loadingAddressName,
      unloadingAddressName: this.unloadingAddressName,
      startProvinceCode: this.startProvinceCode,
      startCityCode: this.startCityCode,
      startCountyCode: this.startCountyCode,
      endProvinceCode: this.endProvinceCode,
      endCityCode: this.endCityCode,
      endCountyCode: this.endCountyCode,
      goodsName: this.goodsName,
      unitPrice: this.unitPrice,
      startTime: this.startTime,
      drawee: this.drawee,
      taxDraweePartyId: this.taxDraweePartyId,
      requirement: this.requirement,
      tripFlag: this.tripFlag,
      consignor: this.consignor,
      wbItem: this.wbItem
    };
    let updateOpions = {
      type: "dazongFirstqiye",
      updatMsg: obj
    };
    this.$store.commit("updateWayBillStatus", updateOpions);
    next();
  },
  watch: {
    cityIdArr() {
      if (this.cityIdArr.length != 0) {
        this.types = localStorage.getItem("types");
        localStorage.removeItem("types");
        if (this.types == 0) {
          this.startProvinceCode = this.cityIdArr[0];
          this.startCityCode = this.cityIdArr[1];
          this.startCountyCode = this.cityIdArr[2];
          this.value3 = [];
          this.value3 = this.cityIdArr;
        } else {
          this.endProvinceCode = this.cityIdArr[0];
          this.endCityCode = this.cityIdArr[1];
          this.endCountyCode = this.cityIdArr[2];
          this.value4 = [];
          this.value4 = this.cityIdArr;
        }
      }
    }
  },
  created() {
    this.$store.commit("updateLoadingStatus", { isLoading: false });
    var year = new Date().getFullYear();
    this.endDate = year + "-" + "12" + "-" + "31";

    // 日期改为当前时间前一天
    var preDateTimeval = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    var preYear = preDateTimeval.getFullYear();
    var preMonth = preDateTimeval.getMonth() + 1;
    var preDate = preDateTimeval.getDate();
    if (preMonth < 10) {
      preMonth = "0" + preMonth;
    }
    if (preDate < 10) {
      preDate = "0" + preDate;
    }
    this.startDate = preYear + "-" + preMonth + "-" + preDate;
  },
  methods: {
    $_getCompanyConfig() {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      return new Promise((resolve, reject) => {
        getCompanyConfig()
          .then(res => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode === "0") {
              this.businessItems = res.data.result.businessItems; // 业务项目配置
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
      return new Promise((resolve,reject)=>{
        getTransportInfo({ transportLineId: this.transportLineId }).then(res => {
          if (res.data.reCode === "0") {
            let result = res.data.result;
            this.startCityCode = result.loadingCityId;
            this.startProvinceCode = result.loadingProvinceId;
            this.startCountyCode = result.loadingCountyId;
            this.endCityCode = result.unloadingCityId;
            this.endProvinceCode = result.unloadingProvinceId;
            this.endCountyCode = result.unloadingCountyId;
            this.value3.push(
              this.startProvinceCode,
              this.startCityCode,
              this.startCountyCode
            );
            this.value4.push(
              this.endProvinceCode,
              this.endCityCode,
              this.endCountyCode
            );
            this.loadingAddressName = result.loadingAddressName;
            this.unloadingAddressName = result.unloadingAddressName;
            this.goodsName = result.goodsName;
            this.unitPrice = result.curTransportUnitPrice;
            this.tripFlag = result.manyTrips;
            if (result.consignor && result.consignor.split(",").length > 0) {
              // 有发货人数据，就展示
              this.consignorState = true;
              this.consignorList.push(result.consignor.split(","));
              if (result.consignor.split(",").length === 1) {
                this.consignor.push(result.consignor.split(",")[0]);
              }
            }
            if (result.drawee && result.taxDraweePartyId) {
              this.draweeArr.push(result.drawee);
              this.drawee = result.drawee;
              this.taxDraweePartyId = result.taxDraweePartyId;
            }
            this.transportUnitPriceType = result.transportUnitPriceType;
          }else{
            this.$vux.toast.text(res.data.reInfo, "middle");
          }
          resolve()
        }).catch(err => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          reject()
        });
      })
      
    },
    // 获取受票方集合
    getDraweeMethod(){
      return new Promise((resolve,reject)=>{
        this.$store.commit("updateLoadingStatus", { isLoading: true });
        getDrawee({}).then(res => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          let data = res.data.result;
          if(data.length > 0){
            if (res.data.reCode == 0) {
              let value = [];
              if (data.length == "0") {
                this.draweeArr = [];
              } else if (data.length == "1") {
                this.taxDraweePartyIdArr.push(data[0].taxDraweePartyId);
                if (!this.drawee) {
                  this.drawee = data[0].drawee;
                  this.draweeArr.push(data[0].drawee);
                }
                value.push(data[0].drawee);
              } else {
                //循环对象拼接字段内容
                for (let i = 0; i < data.length; i++) {
                  this.taxDraweePartyIdArr.push(data[i].taxDraweePartyId);
                  value.push(data[i].drawee);
                }
              }
              this.list3.push(value);
            } else {
              this.$vux.toast.text(res.data.reInfo, "middle");
            }
          }
          resolve()
        }).catch((err)=>{
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          reject()
        })
      })
    },
    // 查询 运单 及 运单号 配置
    queryWaybillMethod(){
      return new Promise((resolve,reject)=>{
        this.$store.commit("updateLoadingStatus", { isLoading: true });
          queryWaybill().then((res)=>{
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode === "0") {
              let data = res.data.result;
              this.waybillNoCfg = data.waybillNoCfg;
              if(this.waybillNoCfg !== "1"){
                this.$store.commit("updateLoadingStatus", { isLoading: true });
                qeurywaybillNo().then(res => {
                  this.$store.commit("updateLoadingStatus", { isLoading: false });
                  if (res.data.reCode === "0") {
                    this.taxWaybillNo = res.data.result;
                  } else {
                    this.$vux.toast.text(res.data.reInfo, "middle");
                  }
                }) 
              }
            }
            resolve()
          }).catch((err)=>{
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            reject()
          })
      })
    },
    startValue() {
      var CodeArr = this.value3;
      this.startProvinceCode = CodeArr[0];
      this.startCityCode = CodeArr[1];
      this.startCountyCode = CodeArr[2];
    },
    endValue() {
      var CodeArr = this.value4;
      this.endProvinceCode = CodeArr[0];
      this.endCityCode = CodeArr[1];
      this.endCountyCode = CodeArr[2];
    },
    //发车日期
    changeTime(val) {
      console.log(val);
      this.startTime = val;
    },
    //选择城市
    chooseStCity(index) {
      if (this.isDisable) {
        this.isDisable = false;
        this.$router.push({
          path: "/chooseCity",
          query: {
            type: index
          }
        });
      }
      setTimeout(() => {
        this.isDisable = true;
      }, 1000);
    },
    //切换受票方的值
    taxDraweeChange(val) {
      this.draweeArr = val;
      this.drawee = this.draweeArr[0];
      if (this.list3[0] != undefined) {
        for (let i = 0; i < this.list3[0].length; i++) {
          if (this.list3[0][i] == val[0]) {
            this.taxDraweePartyId = this.taxDraweePartyIdArr[i];
          }
        }
      }
    },
    // 点击下一步
    async nextStep() {
      //运单号为否配置判断
      if (this.waybillNoCfg == 1) {
        if (this.isEmptyStr(this.taxWaybillNo)) {
          this.$vux.toast.text("运单号不能为空,请输入运单号！", "middle");
          return;
        }
        if (
          !this.isEmptyStr(this.taxWaybillNo) &&
          !/^[0-9a-zA-Z_-]+$/.test(this.taxWaybillNo)
        ) {
          this.$vux.toast.text(
            "运单号只接受数字,字母," + "_" + "与 " + "-" + ",不接受特殊字符",
            "middle"
          );
          return;
        }
      } else {
        if (
          !this.isEmptyStr(this.taxWaybillNo) &&
          !/^[0-9a-zA-Z_-]+$/.test(this.taxWaybillNo)
        ) {
          this.$vux.toast.text(
            "运单号只接受数字,字母," + "_" + "与 " + "-" + ",不接受特殊字符",
            "middle"
          );
          return;
        }
      }
      //装货地名称必填(可修改)
      if (this.isEmptyStr(this.loadingAddressName)) {
        this.$vux.toast.text("装货地名称不能为空！", "middle");
        return;
      }
      //卸货地名称必填(可修改)
      if (this.isEmptyStr(this.unloadingAddressName)) {
        this.$vux.toast.text("卸货地名称不能为空！", "middle");
        return;
      }
      //同城运输判断
      if (
        !this.isEmptyStr(this.startProvinceCode) &&
        !this.isEmptyStr(this.endProvinceCode)
      ) {
        let validateCountyRes = await this.checkCountry();
        if (validateCountyRes == "1") {
          this.$vux.toast.text("同城运输区县必填！", "middle");
          return;
        }
        if (validateCountyRes == "2") {
          this.$vux.toast.text(
            "验证同城运输区县是否必填异常，请稍后重试！",
            "middle"
          );
          return;
        }
      }
      //货物名称不能为空
      if (this.isEmptyStr(this.goodsName)) {
        this.$vux.toast.text("货物名称不能为空！", "middle");
        return;
      }
      //运输单价
      if (!this.isEmptyStr(this.unitPrice)) {
        let regExp = /^([1-9]\d{0,6}|0)([\.]\d{0,4})?$/;
        if (!regExp.test(this.unitPrice)) {
          this.$vux.toast.text("无效的运输单价！", "middle");
          return;
        }
      }
      //发车日期
      if (this.isEmptyStr(this.startTime)) {
        this.$vux.toast.text("发车日期必填！", "middle");
        return;
      }
      //受票方
      if (this.drawee == "" || this.taxDraweePartyId == "") {
        this.$vux.toast.text("受票方必填！", "middle");
        return;
      }
      //业务项目配置
      if (this.businessItems == 3) {
        if (this.isEmptyStr(this.wbItem)) {
          this.$vux.toast.text("业务项目不能为空！", "middle");
          return false;
        }
      }
      // 各个条件满足，跳转到下级页面
      this.$router.push({
        path: "/bigCompreCarTeam",
        query: { transportUnitPriceType: this.transportUnitPriceType }
      });
    },
    //验证同城区县是否必填方法
    checkCountry() {
      return new Promise((resolve, reject) => {
        let fromProvId = this.startProvinceCode; // 起始省份编码
        let fromCityId = this.startCityCode; // 起始城市编码
        let toCityId = this.endCityCode; // 目的城市编码
        let fromCountyId = this.startCountyCode; // 起始区县编码
        let toCountyId = this.endCountyCode; // 目的区县编码
        this.$store.commit("updateLoadingStatus", { isLoading: true });
        checkCommonCity(
          fromProvId,
          fromCityId,
          toCityId,
          fromCountyId,
          toCountyId
        )
          .then(res => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            resolve(res.data.reCode);
          })
          .catch(err => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            resolve("1");
          });
      });
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
.bigcompre-waybill-info {
  width: 100%;
  text-align: left;
  background-color: #efefef;
  position: absolute;
  top: 0px;
  min-height: 100%;
  height: auto;
  .img {
    width: 8px;
    height: 8px;
  }
  .danwei {
    color: #202020;
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
  .weui-cell__ft {
    text-align: left !important;
  }
  .vux-popup-picker-select {
    text-align: left !important;
  }
  .weui-cell__hd {
    color: #797979;
  }
  .vux-datetime {
    color: #797979;
  }
}
</style>
