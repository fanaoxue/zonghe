<template>
  <div class="waybill-info">
    <c-header>
      <x-header :left-options="{ backText: '' }">运单信息</x-header>
    </c-header>
    <div>
      <group label-width="6.5em" label-align="right">
        <x-input title="运 单 号：" v-model="taxWaybillNo" placeholder="请填写运单号" :max="128">
          <div slot="label" style="text-align:right;width:6.5em;">
            <img
              :src="bitian"
              alt
              width="8"
              height="8"
              style="font-size:20px;vertical-align:middle;"
              v-show="waybillNoCfg == 1"
              class="img1"
            />
            <span style="vertical-align:middle;">运 单 号：</span>
          </div>
        </x-input>
        <popup-picker
          title="始发城市："
          :data="cityList"
          :columns="3"
          v-model="value3"
          show-name
          @on-hide="startValue"
          placeholder="请选择装货地"
          disabled
          @click.native="chooseStCity(0)"
        >
          <template slot="title" slot-scope="props">
            <span :class="props.labelClass" :style="props.labelStyle" style="height:24px;">
              <img
                :src="bitian"
                alt
                width="8"
                height="8"
                class="img1"
                style="font-size:20px;vertical-align:middle;"
              />
              <span style="vertical-align:middle;">始发城市：</span>
            </span>
          </template>
        </popup-picker>
        <popup-picker
          title="目的城市："
          :data="cityList"
          :columns="3"
          v-model="value4"
          show-name
          @on-hide="endValue"
          placeholder="请选择卸货地"
          disabled
          @click.native="chooseStCity(1)"
        >
          <template slot="title" slot-scope="props">
            <span :class="props.labelClass" :style="props.labelStyle" style="height:24px;">
              <img
                :src="bitian"
                class="img1"
                alt
                width="8"
                height="8"
                style="font-size:20px;vertical-align:middle;"
              />
              <span style="vertical-align:middle;">目的城市：</span>
            </span>
          </template>
        </popup-picker>
        <x-input title="货物名称：" v-model="goodsName" placeholder="请填写货物名称" type="text">
          <div slot="label" style="text-align:right;width:6.5em;">
            <img
              :src="bitian"
              alt
              width="8"
              height="8"
              style="font-size:20px;vertical-align:middle;"
              class="img1"
            />
            <span style="vertical-align:middle;">货物名称：</span>
          </div>
        </x-input>
        <x-input
          title="货物数量："
          v-model="goodsAmount"
          placeholder="请填写货物数量"
          type="number"
          :show-clear="false"
        >
          <div slot="label" style="text-align:right;width:6.5em;">
            <img
              :src="bitian"
              alt
              width="8"
              height="8"
              style="font-size:20px;vertical-align:middle;"
              class="img1"
            />
            <span style="vertical-align:middle;">货物数量：</span>
          </div>
          <div slot="right">
            <checker
              v-model="goodsAmountType"
              default-item-class="demo2-item"
              selected-item-class="demo2-item-selected"
              radio-required
              @on-change="changeAmountType"
            >
              <checker-item
                :value="item"
                v-for="(item, index) in items2"
                :key="index"
              >{{ item.value }}</checker-item>
            </checker>
          </div>
        </x-input>
        <x-input
          title="应收运费："
          v-show="orgCfg718 === '49'"
          v-model.trim="recvFreight"
          placeholder="请输入应收运费金额"
          type="number"
        >
          <span slot="right">元</span>
        </x-input>
        <x-input title="运输单价：" v-model.trim="unitPrice" placeholder="请输入货物的单价" type="number">
          <span slot="right">元</span>
        </x-input>
        <x-input
          title="起运时间："
          placeholder="请填写预计发车时间"
          type="text"
          :readonly="true"
          @click.native="showPicker=true"
          v-model="startTime"
        >
          <div slot="right">
            <i class="iconfont iconarr-right"></i>
          </div>
        </x-input>
        <!-- 德邦外协加一个发货方 -->
        <popup-picker
          title="发货方："
          :data="fahuoList"
          v-model="fahuoArr"
          @on-change="fahuoChange"
          @on-hide="hidefahuo"
          placeholder="请选择发货方"
          v-show="orgCfg718 === '49'"
          @on-show.once="showfahuo"
        >
          <template slot="title" slot-scope="props">
            <span :class="props.labelClass" :style="props.labelStyle" style="height:24px;">
              <img
                :src="bitian"
                class="img1"
                alt
                width="8"
                height="8"
                style="font-size:20px;vertical-align:middle;"
              />
              <span style="vertical-align:middle;">发货方：</span>
            </span>
          </template>
        </popup-picker>
        <div class="weui-cell" v-show="billCycleMode == '8'">
          <checker
            v-model="items1Value"
            default-item-class="demo1-item"
            selected-item-class="demo1-item-selected"
            radio-required
            @on-change="changeType"
          >
            <checker-item value="1" style="margin-left:1.5em;">
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
          <label for v-show="items1Value == 2">
            <input placeholder="请输入次数" class="input-sty" v-model="transTrip" />&nbsp;&nbsp;
            <span>趟</span>
          </label>
        </div>
      </group>
      <group label-width="6.5em" label-align="right">
        <x-input
          title="业务项目："
          placeholder="请输入运输的类别名称"
          v-model="wbItem"
          v-show="businessItems == '3' || businessItems == '38'"
        >
          <div slot="label" style="text-align:right;width:6.5em;">
            <img
              v-show="businessItems == '3'"
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
        <popup-picker
          title="受票方："
          :data="list3"
          v-model="draweeArr"
          @on-change="taxDraweeChange"
          @on-hide="hideDrawee"
          placeholder="请选择受票方"
          v-show="loginState == '0' && orgCfg718 !== '49'"
          @on-show.once="showDrawee"
        >
          <template slot="title" slot-scope="props">
            <span :class="props.labelClass" :style="props.labelStyle" style="height:24px;">
              <img
                :src="bitian"
                class="img1"
                alt
                width="8"
                height="8"
                style="font-size:20px;vertical-align:middle;"
              />
              <span style="vertical-align:middle;">受票方：</span>
            </span>
          </template>
        </popup-picker>
        <!-- 货主端运输管理 -->
        <popup-picker
          title="选择货主："
          :data="cargoOwnerArr"
          v-model="cargoOwner"
          placeholder="请选择货主"
          @on-show.once="showCargoOwner"
          v-show="relatedList && relatedList.length > 0"
        ></popup-picker>
        <popup-picker
          title="承运项目："
          :data="carrierProjectArr"
          v-model="carrierProject"
          placeholder="请选择"
          v-show="report003Cfg == '3'"
          :disabled="!carrierProjectState"
        >
          <template slot="title" slot-scope="props">
            <span :class="props.labelClass" :style="props.labelStyle" style="height:24px;">
              <img
                :src="bitian"
                class="img1"
                alt
                width="8"
                height="8"
                style="font-size:20px;vertical-align:middle;"
              />
              <span style="vertical-align:middle;">承运项目：</span>
            </span>
          </template>
        </popup-picker>
        <x-textarea title="运输要求：" placeholder="请输入您对本次运输的要求" :max="64" v-model="requirement"></x-textarea>
      </group>
      <div id="footer" style="height:90px;"></div>
      <div class="button">
        <x-button type="primary" @click.native="nextClick">下一步</x-button>
      </div>
    </div>
    <van-popup v-model="showPicker" position="bottom">
      <van-datetime-picker
        type="datetime"
        :min-date="startDate"
        :formatter="formatter"
        @confirm="confirmDate"
        @cancel="showPicker=false"
      />
    </van-popup>
  </div>
</template>
<script>
import { DatetimePicker, Popup } from "vant";
import {
  getCompanyConfig,
  getDriverMsgList,
  qeurywaybillNo,
  queryWaybill,
  getDrawee,
  waybillRepeat,
  wayBillTemp,
  checkCommonCity,
  buildWaybillAgain,
  getCarrierProject,
} from "../../api/api.js";
import { templateDetail } from "../../api/newBuildTemplate.js";
import { goodsResourceDetail } from "../../api/transOrganize.js";
import { getWaixieCarrier } from "../../api/dbwaixie.js";
import { cityDataToIWant } from "../../utils/cMethods";
import { AppFinish, setNativeHead } from "../../utils/app.js";
export default {
  name: "wayBillInfo",
  components: {
    vanDatetimePicker: DatetimePicker,
    vanPopup: Popup,
  },
  data() {
    return {
      taxWaybillNo: "", //运单号
      cityList: [],
      value3: [], //起始地
      value4: [], //目的地
      startCityCode: "",
      startProvinceCode: "",
      startCountyCode: "",
      endCityCode: "",
      endProvinceCode: "",
      endCountyCode: "",
      oilCardCfg: "", //油卡权限
      goodsName: "", //货物名称
      goodsAmount: "", //货物数量
      recvFreight: "1", //应收运费
      unitPrice: "", //运输单价
      transTrip: "1", //运输趟次
      items2: [
        {
          key: "0",
          value: "吨",
        },
        {
          key: "1",
          value: "方",
        },
        {
          key: "2",
          value: "件",
        },
        {
          key: "3",
          value: "车",
        },
      ],
      goodsAmountType: {
        key: "0",
        value: "吨",
      }, //货物数量类型  0吨  1方  2件
      date: "", //开始日期格式
      wbItem: "", //业务项目
      list3: [],
      drawee: "", //受票方名称
      draweeArr: [], //受票方名称数组
      taxDraweePartyId: "", //受票方ID
      taxDraweePartyIdArr: [], //受票方ID集合
      report003Cfg: "", // 经营会计报表配置 2：不展示 3：展示
      carrierProjectArr: [], //承运项目集合
      carrierProject: [], //承运项目
      carrierProjectState: true, //承运项目的状态
      requirement: "", //运输要求
      items1Value: "1",
      startTime: "",
      startDate: "", //开始时间
      endDate: "", //结束时间
      minHour: 0, //最小小时
      bitian: require("../../assets/imgs/wbs/bitian_icon@2x.png"),
      src1: require("../../assets/imgs/wbs/xuanzeselect_icon@2x.png"),
      src2: require("../../assets/imgs/wbs/xuanze_icon@2x.png"),
      src3: require("../../assets/imgs/wbs/xuanze_icon@2x.png"),
      src4: require("../../assets/imgs/wbs/xuanzeselect_icon@2x.png"),
      //配置参数
      waybillNoCfg: "", //运单号必填配置
      businessItems: "", //业务项目配置
      loginState: "", //企业类型
      billCycleMode: "", //结算周期模式 billCycleMode: "", //结算周期模式
      mWaybillTemplateId: this.$route.query.mWaybillTemplateId, //模板ID
      taxWaybillId: this.$route.query.taxWaybillId, //从再建一单进来的标志
      flag: true,
      step: true,
      step2: true,
      cityIdArr: [],
      types: "", //判断始发还是目的城市的标志
      isDisable: true, //控制点击次数
      allFreight: "",
      prepayments: "",
      backFee: "",
      showPicker: false,
      sendGoodsInfo: {},
      goodsId: "",
      orgCfg718: "", // 49：德邦外协配置
      fahuoList: [], //发货方集合
      fahuoIdList: [], //发货方ID集合
      fahuoArr: [], //发货方名称数组
      fahuoName: "", //发货方名称
      fahuoId: "", //发货方ID

      relatedList: "", //货主关联配置
      cargoOwnerArr: [], // 货主集合
      cargoOwner: [], // 货主
    };
  },
  beforeRouteEnter(to, from, next) {
    let json = { isShow: "1" };
    setNativeHead(json);
    next((vm) => {
      if (from.name === "HelloWorld" || from.name === "wbsCarTeam") {
        vm.$store.commit("updateLoadingStatus", { isLoading: false });
      }
      if (from.name === "chooseCity") {
        window.sessionStorage.isChooseType =
          window.sessionStorage.isChooseType1;
        vm.$store.commit("updateLoadingStatus", { isLoading: false });
        vm.cityIdArr = JSON.parse(localStorage.getItem("cityIdArr"));
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    if (window.sessionStorage.isChooseType === "1") {
      window.sessionStorage.isChooseType1 = "1";
    }
    if (
      typeof window.sessionStorage.isChooseType !== "undefined" &&
      to.name !== "wbsCarTeam"
    ) {
      window.sessionStorage.removeItem("isChooseType");
    }
    let obj = {
      startProvinceCode: this.value3[0],
      startCityCode: this.value3[1],
      startCountyCode: this.value3[2],
      endProvinceCode: this.value4[0],
      endCityCode: this.value4[1],
      endCountyCode: this.value4[2],
      taxWaybillNo: this.taxWaybillNo, // 运单号
      goodsName: this.goodsName, // 货物名称
      goodsAmount: this.goodsAmount, // 货物数量
      unitPrice: this.unitPrice, // 运输单价
      recvFreight: this.recvFreight, // 应收运费
      goodsAmountType: this.goodsAmountType, // 货物数量类型  0吨  1方  2件 3 车
      wbItem: this.wbItem, // 业务项目
      drawee: this.drawee, // 受票方名称
      taxDraweePartyId: this.taxDraweePartyId, // 受票方ID
      waybillNoCfg: this.waybillNoCfg, // 运单号必填配置
      loginState: this.loginState, // 企业类型
      billCycleMode: this.billCycleMode, // 结算周期模式
      items1Value: this.items1Value, //趟次类型
      transTrip: this.transTrip, //运输趟次
      requirement: this.requirement, //运输要求
      startTime: this.startTime, //起运时间
      carrierProject: this.carrierProject, //承运项目
      fahuoName: this.fahuoName, // 发货方名称
      fahuoId: this.fahuoId, // 发货方ID
      relatedShipper: this.cargoOwner.length > 0 ? this.cargoOwner[0] : "", // 关联货主
    };
    let updateOpions = {
      type: "weyBillFirst",
      updatMsg: obj,
    };
    this.$store.commit("updateWayBillStatus", updateOpions);
    next();
  },
  computed: {
    weyBillFirst() {
      return this.$store.state.wayBill.weyBillFirst;
    },
  },
  created() {
    if (this.items1Value == 1 || this.items1Value == "") {
      this.src2 = this.src3;
      this.src1 = this.src4;
      this.transTrip = "1";
    } else {
      this.src1 = this.src3;
      this.src2 = this.src4;
      this.transTrip = this.weyBillFirst.transTrip;
    }
  },
  watch: {
    cityIdArr() {
      if (this.cityIdArr.length != 0) {
        this.types = localStorage.getItem("types");
        if (this.types == 0) {
          this.startProvinceCode = this.cityIdArr[0];
          this.startCityCode = this.cityIdArr[1];
          this.startCountyCode = this.cityIdArr[2];
          this.value3 = [];
          this.value3 = this.cityIdArr;
        } else {
          this.endCityCode = this.cityIdArr[1];
          this.endCountyCode = this.cityIdArr[2];
          this.value4 = [];
          this.value4 = this.cityIdArr;
        }
      }
      window.localStorage.removeItem("types");
    },
  },
  mounted() {
    this.goodsId = this.$route.query.goodsId;
    this.cityList = cityDataToIWant(city.data);
    this.startDate = new Date();
    this.$nextTick(() => {
      if (this.goodsId) {
        this.$_getGoodsInfo().then((res) => {
          this.normalStage();
        });
      } else {
        this.normalStage();
      }
    });
  },
  methods: {
    normalStage() {
      this.$_getCompanyConfig().then((res) => {
        this.getAllConfigure().then((res) => {
          this.getWaybillAgainInfo().then((res) => {
            this.getTemplateDetail().then((res) => {
              this.getDraweeMethod().then((res) => {
                this.queryWaybillNoMethod().then((res) => {
                  this.getCarrierProjectMethod(
                    this.taxDraweePartyId,
                    "0"
                  ).then((res) => {});
                });
              });
            });
          });
        });
      });
    },
    // 通过货源ID获取货源信息
    $_getGoodsInfo() {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      return new Promise((resolve, reject) => {
        goodsResourceDetail({ goodsId: this.goodsId })
          .then((res) => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode === "0") {
              let result = res.data.result;
              Object.assign(result, { wbBusinessType: "2" });
              let updateOpions = {
                type: "deliveryGoodsWaybillInfo",
                updatMsg: result,
              };
              this.$store.commit("updateDeliveryGoods", updateOpions);

              this.sendGoodsInfo = res.data.result;
              Object.assign(this.sendGoodsInfo, { wbBusinessType: "2" });
              this.startCountyCode = this.sendGoodsInfo.loadingCountyId
                ? this.sendGoodsInfo.loadingCountyId
                : "";
              this.startCityCode = this.sendGoodsInfo.loadingCityId;
              this.startProvinceCode = this.sendGoodsInfo.loadingProvinceId;
              this.endCountyCode = this.sendGoodsInfo.unloadingCountyId
                ? this.sendGoodsInfo.unloadingCountyId
                : "";
              this.endCityCode = this.sendGoodsInfo.unloadingCityId;
              this.endProvinceCode = this.sendGoodsInfo.unloadingProvinceId;
              this.goodsName = this.sendGoodsInfo.goodsName; //货物名称
              this.goodsAmount = this.sendGoodsInfo.goodsAmount; //货物数量
              this.goodsAmountType.key = this.sendGoodsInfo.goodsAmountType; //货物数量类型
              if (this.sendGoodsInfo.goodsAmountType == 0) {
                this.goodsAmountType.value = "吨";
              } else if (this.sendGoodsInfo.goodsAmountType == 1) {
                this.goodsAmountType.value = "方";
              } else if (this.sendGoodsInfo.goodsAmountType == 2) {
                this.goodsAmountType.value = "件";
              } else {
                this.goodsAmountType.value = "车";
              }
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
              resolve();
            } else {
              this.$vux.toast.text(res.data.reInfo, "middle");
              reject();
            }
          })
          .catch((error) => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.$vux.toast.text(error.message, "middle");
            reject();
          });
      });
    },
    // 3020获取公共配置
    $_getCompanyConfig() {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      return new Promise((resolve, reject) => {
        getCompanyConfig()
          .then((res) => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode === "0") {
              let result = res.data.result;
              this.businessItems = result.businessItems;
              this.orgCfg718 = result.orgCfg718;
              this.relatedList = result.relatedList;
              // if (this.relatedList.length == 1) {
              //   this.cargoOwner = this.relatedList;
              // }
              if (result.createWaybillCfg === "9") {
                this.$vux.confirm.show({
                  title: "提示",
                  confirmText: "确认",
                  cancelText: "取消",
                  content: "当前企业已关闭建单权限！",
                  showCancelButton: false,
                  onConfirm: () => {
                    AppFinish(-1);
                  },
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
          .catch((error) => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.$vux.toast.text(error.message, "middle");
            reject();
          });
      });
    },
    // 获取运单配置项
    getAllConfigure() {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      return new Promise((resolve, reject) => {
        queryWaybill({})
          .then((res) => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode == "0") {
              let data = res.data.result;
              this.waybillNoCfg = data.waybillNoCfg; //运单号配置
              this.loginState = data.loginState; //企业类型
              this.billCycleMode = data.billCycleMode; //结算周期模式
              this.oilCardCfg = data.oilCardCfg; //油卡权限
              this.report003Cfg = data.report003Cfg; //经营会计报表配置
              if (
                !this.isEmptyStr(data.taxDraweePartyId) &&
                this.taxWaybillId === undefined
              ) {
                this.taxDraweePartyId = data.taxDraweePartyId; //受票方默认ID
                this.drawee = data.drawee; //受票方默认选中的值
                this.draweeArr.push(this.drawee);
              }
              resolve();
            } else {
              this.$vux.toast.text(res.data.reInfo, "middle");
              reject();
            }
          })
          .catch((err) => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.$vux.toast.text(err.message, "middle");
            reject();
          });
      });
    },
    // 3048查询再建一单数据
    getWaybillAgainInfo() {
      return new Promise((resolve, reject) => {
        if (this.taxWaybillId) {
          this.$store.commit("updateLoadingStatus", { isLoading: true });
          buildWaybillAgain({ taxWaybillId: this.taxWaybillId })
            .then((res) => {
              this.$store.commit("updateLoadingStatus", { isLoading: false });
              if (res.data.reCode === "0") {
                let result = res.data.result;
                this.goodsAmount = result.goodsAmount; //货物数量
                this.goodsAmountType.key = result.goodsAmountType; //货物数量类型
                if (result.goodsAmountType == 0) {
                  this.goodsAmountType.value = "吨";
                } else if (result.goodsAmountType == 1) {
                  this.goodsAmountType.value = "方";
                } else if (result.goodsAmountType == 2) {
                  this.goodsAmountType.value = "件";
                } else {
                  this.goodsAmountType.value = "车";
                }
                this.goodsName = result.goodsName; //货物名称
                this.requirement = result.tranRequire; //运输要求
                //城市数据
                this.startCityCode = result.startCityId;
                this.startProvinceCode = result.startProvinceId;
                this.startCountyCode = result.startCountyId;
                this.endCityCode = result.endCityId;
                this.endProvinceCode = result.endProvinceId;
                this.endCountyCode = result.endCountyId;
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
                this.unitPrice = result.unitPrice; //单价
                if (!this.isEmptyStr(result.taxDraweePartyId)) {
                  this.taxDraweePartyId = result.taxDraweePartyId; //受票方默认ID
                  this.drawee = result.drawee; //受票方默认选中的值
                  this.draweeArr.push(this.drawee);
                }
                this.wbItem = result.wbItem; //业务项目
                if (Number(result.transTrip) > 1) {
                  this.items1Value = "2";
                  this.src1 = this.src3;
                  this.src2 = this.src4;
                  this.transTrip = result.transTrip;
                } else {
                  this.items1Value = "1";
                  this.src2 = this.src3;
                  this.src1 = this.src4;
                  this.transTrip = "1";
                }
                resolve();
              } else {
                this.$vux.toast.text(res.data.reInfo, "middle");
                reject();
              }
            })
            .catch((err) => {
              this.$store.commit("updateLoadingStatus", { isLoading: false });
              this.$vux.toast.text(err.message, "middle");
              reject();
            });
        } else {
          resolve();
        }
      });
    },
    // 获取模板数据
    getTemplateDetail() {
      return new Promise((resolve, reject) => {
        if (!this.isEmptyStr(this.mWaybillTemplateId)) {
          this.$store.commit("updateLoadingStatus", { isLoading: true });
          templateDetail({ mWaybillTemplateId: this.mWaybillTemplateId })
            .then((res) => {
              this.$store.commit("updateLoadingStatus", { isLoading: false });
              if (res.data.reCode === "0") {
                let result = res.data.result;
                this.startCityCode = result.startCityId;
                this.startProvinceCode = result.startProvinceId;
                this.startCountyCode = result.startCountyId;
                this.endCityCode = result.endCityId;
                this.endProvinceCode = result.endProvinceId;
                this.endCountyCode = result.endCountyId;
                this.goodsName = result.goodsName; //货物名称
                this.goodsAmount = result.goodsAmount; //货物数量
                this.goodsAmountType.key = result.goodsAmountType; //货物数量类型
                if (result.goodsAmountType == 0) {
                  this.goodsAmountType.value = "吨";
                } else if (result.goodsAmountType == 1) {
                  this.goodsAmountType.value = "方";
                } else if (result.goodsAmountType == 2) {
                  this.goodsAmountType.value = "件";
                } else {
                  this.goodsAmountType.value = "车";
                }
                this.unitPrice = result.unitPrice; //单价
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
                resolve();
              } else {
                this.$vux.toast.text(res.data.reInfo, "middle");
                reject();
              }
            })
            .catch((err) => {
              this.$store.commit("updateLoadingStatus", { isLoading: false });
              this.$vux.toast.text(err.message, "middle");
              reject();
            });
        } else {
          resolve();
        }
      });
    },
    // 获取受票方
    getDraweeMethod() {
      return new Promise((resolve, reject) => {
        this.$store.commit("updateLoadingStatus", { isLoading: true });
        if (this.drawee == "") {
          getDrawee({})
            .then((res) => {
              this.$store.commit("updateLoadingStatus", { isLoading: false });
              let result = res.data.result;
              if (result.length > 0) {
                if (res.data.reCode === "0") {
                  this.draweeArr = [];
                  this.drawee = result[0].drawee;
                  this.taxDraweePartyId = result[0].taxDraweePartyId;
                  this.draweeArr.push(this.drawee);
                } else {
                  this.$vux.toast.text(res.data.reInfo, "middle");
                }
              }
              resolve();
            })
            .catch((err) => {
              this.$store.commit("updateLoadingStatus", { isLoading: false });
              this.$vux.toast.text(err.message, "middle");
              reject();
            });
        } else {
          resolve();
        }
      });
    },
    // 获取运单号
    queryWaybillNoMethod() {
      return new Promise((resolve, reject) => {
        if (this.waybillNoCfg != 1) {
          this.$store.commit("updateLoadingStatus", { isLoading: true });
          qeurywaybillNo()
            .then((res) => {
              this.$store.commit("updateLoadingStatus", { isLoading: false });
              if (res.data.reCode === "0") {
                let result = res.data.result;
                this.taxWaybillNo = !this.isEmptyStr(result)
                  ? res.data.result
                  : "";
                resolve();
              } else {
                this.$vux.toast.text(res.data.reInfo, "middle");
                reject();
              }
            })
            .catch((err) => {
              this.$store.commit("updateLoadingStatus", { isLoading: false });
              this.$vux.toast.text(err.message, "middle");
              reject();
            });
        } else {
          resolve();
        }
      });
    },
    // 根据受票方ID去获取承运项目3072
    getCarrierProjectMethod(params1, params2) {
      return new Promise((resolve, reject) => {
        if (this.report003Cfg === "3") {
          getCarrierProject(params1)
            .then((res) => {
              if (res.data.reCode === "0") {
                this.carrierProjectArr = [];
                let result = res.data.result;
                //配置有值
                if (result.length > 0) {
                  let arr = [];
                  for (let i = 0; i < result.length; i++) {
                    arr.push(result[i].carrierProject);
                  }
                  this.carrierProjectArr.push(arr);
                  this.carrierProject = [];
                  this.carrierProjectState = true;
                } else {
                  this.carrierProject = [];
                  this.carrierProjectState = false;
                }
                resolve();
              } else {
                this.$vux.toast.text(res.data.reInfo, "middle");
                reject();
              }
            })
            .catch((err) => {
              this.$store.commit("updateLoadingStatus", { isLoading: false });
              this.$vux.toast.text(err.message, "middle");
              reject();
            });
        } else {
          resolve();
        }
      });
    },
    formatterDate(date) {
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let minute = date.getMinutes();
      if (year < 10) {
        year = "0" + year;
      }
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      if (hour < 10) {
        hour = "0" + hour;
      }
      if (minute < 10) {
        minute = "0" + minute;
      }
      return year + "-" + month + "-" + day + " " + hour + ":" + minute;
    },
    confirmDate(value) {
      this.startTime = this.formatterDate(value);
      this.showPicker = false;
    },
    formatter(type, value) {
      if (type === "year") {
        return `${value}年`;
      } else if (type === "month") {
        return `${value}月`;
      } else if (type === "day") {
        return `${value}日`;
      } else if (type === "hour") {
        return `${value}时`;
      } else if (type === "minute") {
        return `${value}分`;
      }
      return value;
    },
    //起运时间
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
            type: index,
          },
        });
      }
      setTimeout(() => {
        this.isDisable = true;
      }, 1000);
    },
    //切换趟次
    changeType(val) {
      try {
        MtaH5.clickStat("waybill_transtrip_choose");
      } catch (error) {
        JSON.stringify(error);
      }
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
    //货物单位
    changeAmountType() {
      try {
        MtaH5.clickStat("waybill_goodsamounttype_choose");
      } catch (error) {
        JSON.stringify(error);
      }
    },
    nextClick() {
      //运单号为否配置判断
      if (this.waybillNoCfg == 1) {
        this.taxWaybillNo = this.trim(this.taxWaybillNo);
        if (this.isEmptyStr(this.taxWaybillNo)) {
          this.$vux.toast.text("运单号不能为空,请输入运单号！", "middle");
          return false;
        }
        if (
          !this.isEmptyStr(this.taxWaybillNo) &&
          !/^[0-9a-zA-Z_-]+$/.test(this.taxWaybillNo)
        ) {
          this.$vux.toast.text(
            "运单号只接受数字,字母," + "_" + "与 " + "-" + ",不接受特殊字符",
            "middle"
          );
          return false;
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
          return false;
        }
      }
      //始发城市必填、目的城市必填判断
      if (this.isEmptyStr(this.startCityCode)) {
        this.$vux.toast.text("始发城市必填！", "middle");
        return false;
      }
      if (this.isEmptyStr(this.endCityCode)) {
        this.$vux.toast.text("目的城市必填！", "middle");
        return false;
      }
      //货物名称
      if (this.isEmptyStr(this.goodsName)) {
        this.goodsName = this.trim(this.goodsName);
        this.$vux.toast.text("货物名称必填！", "middle");
        return false;
      }
      //货物数量
      if (!this.isEmptyStr(this.goodsAmount)) {
        this.goodsAmount = this.trim(this.goodsAmount);
        let regexp = new RegExp(/^([1-9]\d{0,6}|0)([\.]\d{0,4})?$/);
        if (!regexp.test(this.goodsAmount)) {
          this.$vux.toast.text("无效的货物数量！", "middle");
          return false;
        }
      } else {
        this.$vux.toast.text("货物数量必填！", "middle");
        return false;
      }
      //运输单价
      if (!this.isEmptyStr(this.unitPrice)) {
        this.unitPrice = this.trim(this.unitPrice);
        let regexp = new RegExp(/^([1-9]\d{0,6}|0)([\.]\d{0,4})?$/);
        if (!regexp.test(this.unitPrice)) {
          this.$vux.toast.text("无效的运输单价！", "middle");
          return false;
        }
      }

      //发货方
      if (this.orgCfg718 === "49" && !Boolean(this.fahuoName)) {
        this.$vux.toast.text("发货方必填！", "middle");
        return false;
      }

      //多趟时趟次范围2-99
      if (this.billCycleMode == "8" && this.items1Value == "2") {
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
      if (this.businessItems == 3 && this.isEmptyStr(this.wbItem)) {
        this.wbItem = this.trim(this.wbItem);
        this.$vux.toast.text("业务项目必填！", "middle");
        return false;
      }
      //受票方
      if (this.loginState == 0 && this.orgCfg718 !== "49" && !Boolean(this.drawee)) {
        this.$vux.toast.text("受票方必填！", "middle");
        return false;
      }
      //承运项目
      if (this.report003Cfg == "3" && this.carrierProject.length == "0") {
        this.$vux.toast.text("承运项目必填！", "middle");
        return false;
      }

      //同城区县验证3008接口
      let fromProvId = this.startProvinceCode; // 起始省份编码
      let fromCityId = this.startCityCode; // 起始城市编码
      let toCityId = this.endCityCode; // 目的城市编码
      let fromCountyId = this.startCountyCode; // 起始区县编码
      let toCountyId = this.endCountyCode; // 目的区县编码
      if (
        !this.isEmptyStr(fromProvId) &&
        !this.isEmptyStr(fromCityId) &&
        !this.isEmptyStr(toCityId)
      ) {
        this.$store.commit("updateLoadingStatus", { isLoading: true });
        checkCommonCity(
          fromProvId,
          fromCityId,
          toCityId,
          fromCountyId,
          toCountyId
        )
          .then((res) => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode != 0) {
              this.$vux.toast.text(res.data.reInfo, "middle");
              return false;
            } else {
              //走3018运单号重复判断接口
              waybillRepeat(this.taxWaybillNo).then((res) => {
                if (res.data.reCode == 1) {
                  this.$vux.toast.text(res.data.reInfo, "middle");
                  return false;
                } else {
                  try {
                    MtaH5.clickStat("xinjianyundanlo", {
                      waybillstep1: "true",
                    });
                  } catch (error) {
                    JSON.stringify(error);
                  }
                  //条件全部满足后，先存值 再跳转
                  this.$router.push({
                    path: "/wbsCarTeam",
                    query: {
                      taxWaybillId: this.taxWaybillId,
                    },
                  });
                }
              });
            }
          })
          .catch((err) => {
            console.log(err);
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.$vux.toast.text(err.message, "middle");
          });
      }
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
    hideDrawee(val) {
      //切换受票方的时候，就去重新调取承运项目接口
      if (val == true) {
        this.getCarrierProjectMethod(this.taxDraweePartyId, "1");
      }
    },
    // 发货方切换值
    fahuoChange(val) {
      this.fahuoArr = val;
      this.fahuoName = this.fahuoArr[0];
      if (this.fahuoList[0]) {
        for (let i = 0; i < this.fahuoList[0].length; i++) {
          if (this.fahuoList[0][i] == val[0]) {
            this.fahuoId = this.fahuoIdList[i];
          }
        }
      }
      console.log(this.fahuoArr, this.fahuoName, this.fahuoList, this.fahuoId);
    },
    hidefahuo(val) {},
    //点击的时候，展示一次发货方
    showfahuo() {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      getWaixieCarrier({ cfgType: "1" })
        .then((resp) => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          let data = resp.data.result;
          if(data.length > 0){
            if (resp.data.reCode == 0) {
              let value = [];
              for (let i = 0; i < data.length; i++) {
                this.fahuoIdList.push(data[i].supplierOrgId);
                value.push(data[i].supplierOrgName);
              }
              this.fahuoList.push(value);
            } else {
              this.$vux.toast.text(resp.data.reInfo, "middle");
            }
          }
        })
        .catch((err) => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          this.$vux.toast.text(err.message, "middle");
        });
    },
    //点击的时候，展示一次货主
    showCargoOwner() {
      if (this.relatedList && this.relatedList.length > 0) {
        this.cargoOwnerArr.push(this.relatedList);
      }
    },

    //点击的时候，展示一次受票方
    showDrawee() {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      getDrawee({})
        .then((resp) => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          let data = resp.data.result;
          if(data.length > 0){
            if (resp.data.reCode == 0) {
              let value = [];
              for (let i = 0; i < data.length; i++) {
                this.taxDraweePartyIdArr.push(data[i].taxDraweePartyId);
                value.push(data[i].drawee);
              }
              this.list3.push(value);
            } else {
              this.$vux.toast.text(resp.data.reInfo, "middle");
            }
          }
        })
        .catch((err) => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          this.$vux.toast.text(err.message, "middle");
        });
    },
    //始发城市
    startValue: function () {
      var CodeArr = this.value3;
      this.startProvinceCode = CodeArr[0];
      this.startCityCode = CodeArr[1];
      this.startCountyCode = CodeArr[2];
    },
    //目的城市
    endValue: function () {
      var CodeArr = this.value4;
      this.endProvinceCode = CodeArr[0];
      this.endCityCode = CodeArr[1];
      this.endCountyCode = CodeArr[2];
    },

    //自定义去前后空格的方法
    trim: function (i) {
      //   return i.toString().replace(/(^\s*)|(\s*$)/g, "");
      return i.toString().replace(/\s/g, "");
    },
    //非空验证通用方法
    isEmptyStr: function (str) {
      var pat = /^[\s]*$/;
      if (undefined == str || "" == str || null == str || pat.test(str)) {
        return true;
      }
      return false;
    },
  },
};
</script>
<style lang="less">
@import "~vux/src/styles/close";
.waybill-info {
  width: 100%;
  background-color: #efefef;
  position: absolute;
  top: 0px;
  min-height: 100%;
  height: auto;
  .van-picker__confirm {
    color: #04be02;
  }
  .van-picker__cancel {
    color: #828282;
  }
  .img1 {
    width: 8px;
    height: 8px;
  }
  .img2 {
    width: 15px;
    height: 15px;
  }
  .weui-cell__hd {
    color: #797979;
  }
  .vux-popup-picker-select-box {
    .vux-popup-picker-select {
      text-align: left !important;
    }
  }
  .weui-cell {
    @media screen and (max-width: 320px) {
      font-size: 15px;
    }
  }
  .weui-cell:before {
    left: 0px;
  }
  .weui-cell:first-child:before {
    display: inline;
  }
  .weui-cell__ft {
    text-align: left !important;
  }
  .demo2-item {
    background: #bebebe;
    padding: 0 4px;
    margin: 2px;
    border-radius: 6px;
    color: #fff;
  }
  .demo1-item-selected {
    color: #1581cf;
  }
  .demo2-item-selected {
    background: #1581cf;
  }
  .button {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    // background: #fff;
  }
  .weui-btn_primary {
    background-color: #15499a !important;
    margin: 1rem auto;
    width: 90% !important;
  }
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
  .vux-datetime {
    div p {
      color: #797979;
    }
  }
}
</style>
