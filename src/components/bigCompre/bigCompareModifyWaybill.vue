<template>
  <div class="modify-waybill">
    <c-header>
      <x-header :left-options="{ backText: '' }">修改运单</x-header>
    </c-header>
    <div v-show="loadingFlag === true">
      <group label-width="7em" label-margin-right="1em" label-align="right" class="group1">
        <cell title="运单信息" @click.native="showOrHide(0)">
          <span class="show-or-hide">
            <img
              :src="shouqi"
              alt
              width="15"
              height="15"
              class="img-icon img2"
              :class="{ shouQi: showControl[0] === 0, zhanKai: showControl[0] === 1 }"
            />
          </span>
          <div slot="title" style="text-align:left;">
            <span style="vertical-align:middle;color:#121212;">运单信息</span>
          </div>
        </cell>
        <transition name="mybox">
          <div class="slide" :class="{ animate: showControl[0] === 1 }">
            <x-input
              title="运 单 号："
              v-model.trim="taxWaybillNo"
              :disabled="this.classify != '0'"
              :max="128"
            >
              <div slot="label" style="text-align:right;padding-right:1em;width:7em;">
                <img
                  :src="bitian"
                  alt
                  width="8"
                  height="8"
                  style="font-size:20px;vertical-align:middle;"
                  class="img1"
                />
                <span style="vertical-align:middle;">运 单 号：</span>
              </div>
            </x-input>
            <x-input title="发货单位：" v-model.trim="orgName" disabled v-show="this.classify != '0'">
              <div slot="label" style="text-align:right;padding-right:1em;width:7em;">
                <img
                  :src="bitian"
                  alt
                  width="8"
                  height="8"
                  style="font-size:20px;vertical-align:middle;"
                  class="img1"
                />
                <span style="vertical-align:middle;">发货单位：</span>
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
                  class="img1"
                />
                <span style="vertical-align:middle;">装货地名称：</span>
              </div>
            </x-input>
            <popup-picker
              title="装货地城市："
              :data="cityList"
              :columns="3"
              v-model="value3"
              show-name
              disabled
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
                    class="img1"
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
                  class="img1"
                />
                <span style="vertical-align:middle;">卸货地名称：</span>
              </div>
            </x-input>
            <popup-picker
              title="卸货地城市："
              :data="cityList"
              :columns="3"
              v-model="value4"
              show-name
              disabled
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
                    class="img1"
                  />
                  <span style="vertical-align:middle;">卸货地城市：</span>
                </span>
              </template>
            </popup-picker>
            <x-input title="货物名称：" v-model="goodsName" type="text">
              <div slot="label" style="text-align:right;padding-right:1em;width:7em;">
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
              title="运输单价："
              v-model.trim="unitPrice"
              placeholder="请输入货物的单价"
              type="number"
              @on-blur="calculateBlur()"
            >
              <span slot="right" class="danwei">元/{{ goodsAmountType | typeFilter }}</span>
            </x-input>
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
                    class="img1"
                  />
                  <span style="vertical-align:middle;">业务项目：</span>
                </div>
              </template>
            </x-input>

            <popup-picker
              title="受票方："
              :data="draweeList"
              v-model="draweeArr"
              @on-change="taxDraweeChange"
              @on-show="showDrawee"
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
            <!-- <x-input title="业务项目：" v-model.trim="wbItem" placeholder="请输入业务项目"></x-input> -->
            <popup-picker
              title="发货人："
              :data="consignorList"
              v-model="consignor"
              placeholder="请选择发货人"
              v-show="consignorState"
            ></popup-picker>

            <div class="weui-cell" v-show="classify == 1 && this.billCycleMode == '8'">
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
                <input pattern="\d*" class="input-sty" v-model="transTrip" />&nbsp;&nbsp;
                <span>趟</span>
              </label>
            </div>
            <cell
              title="承运趟次："
              value-align="left"
              disabled
              v-if="classify == 0 && Number(transTrip) > 1"
            >
              <span style="display: inline-block;width: 89.3%;">{{ transTrip }}</span>
              <span style="color:#202020">趟</span>
            </cell>
          </div>
        </transition>
      </group>
      <group label-width="7em" label-margin-right="1em" label-align="right" class="group2">
        <cell title="承运信息" @click.native="showOrHide(1)">
          <span class="show-or-hide">
            <img
              :src="shouqi"
              alt
              width="15"
              height="15"
              class="img-icon img2"
              :class="{ shouQi: showControl[1] === 0, zhanKai: showControl[1] === 1 }"
            />
          </span>
          <div slot="title" style="text-align:left;">
            <span style="vertical-align:middle;color:#121212;">承运信息</span>
          </div>
        </cell>
        <transition name="mybox">
          <div class="slide" :class="{ animate: showControl[1] === 1 }">
            <cell title="车牌号码：" value-align="left" is-link type="text" @click.native="carNumIpt">
              <span :class="{ 'not-active': payState === '2' }">{{ cartBadgeNo }}</span>
              <div slot="title" style="text-align:right;padding-right:1em;width:7em;">
                <img
                  :src="bitian"
                  alt
                  width="8"
                  height="8"
                  style="font-size:20px;vertical-align:middle;"
                  class="img1"
                />
                <span style="vertical-align:middle;">车牌号码：</span>
              </div>
            </cell>
            <x-input
              title="司机姓名："
              :disabled="driverMsg === '1' ? true : false"
              v-model.trim="driverName"
              type="text"
              :max="64"
              placeholder="请填写司机姓名"
            >
              <div slot="label" style="text-align:right;padding-right:1em;width:7em;">
                <img
                  :src="bitian"
                  alt
                  width="8"
                  height="8"
                  style="font-size:20px;vertical-align:middle;"
                  class="img1"
                />
                <span style="vertical-align:middle;">司机姓名：</span>
              </div>
            </x-input>
            <x-input
              title="司机手机："
              :disabled="driverMsg === '1' ? true : false"
              v-model.trim="mobileNo"
              is-type="china-mobile"
              type="tel"
              :max="11"
              placeholder="请填写司机手机号"
              @on-blur="_onblur()"
            >
              <div slot="label" style="text-align:right;padding-right:1em;width:7em;">
                <img
                  :src="bitian"
                  alt
                  width="8"
                  height="8"
                  style="font-size:20px;vertical-align:middle;"
                  class="img1"
                />
                <span style="vertical-align:middle;">司机手机：</span>
              </div>
            </x-input>
          </div>
        </transition>
      </group>
      <group label-width="7em" label-margin-right="1em" label-align="right" class="group3">
        <cell title="结算信息" @click.native="showOrHide(2)">
          <span class="show-or-hide">
            <img
              :src="shouqi"
              alt
              width="15"
              height="15"
              class="img-icon img2"
              :class="{ shouQi: showControl[2] === 0, zhanKai: showControl[2] === 1 }"
            />
          </span>
          <div slot="title" style="text-align:left;">
            <span style="vertical-align:middle;color:#121212;">结算信息</span>
          </div>
        </cell>
        <transition name="mybox">
          <div class="slide" :class="{ animate: showControl[2] === 1 }">
            <x-input
              title="装货数量："
              v-model.trim="loadingTonnage"
              placeholder="请输入装货数量"
              type="number"
              @on-blur="calculateBlur()"
            >
              <span slot="right" class="danwei">{{ goodsAmountType | typeFilter }}</span>
            </x-input>
            <x-input
              title="卸货数量："
              v-model.trim="unloadingTonnage"
              placeholder="请输入卸货数量"
              type="number"
              @on-blur="calculateBlur()"
            >
              <div slot="label" style="text-align:right;padding-right:1em;width:7em;">
                <img
                  :src="bitian"
                  alt
                  width="8"
                  height="8"
                  style="font-size:20px;vertical-align:middle;"
                  class="img1"
                />
                <span style="vertical-align:middle;">卸货数量：</span>
              </div>
              <span slot="right" class="danwei">{{ goodsAmountType | typeFilter }}</span>
            </x-input>
            <cell v-if="goodsAmountType==='0'" title="货损吨位：" value-align="left" disabled>
              <span style="display: inline-block;width: 89.3%;">{{ huosundunwei }}</span>
              <span style="color:#202020">{{ goodsAmountType | typeFilter }}</span>
            </cell>
            <x-input
              title="应收货主运费："
              v-model.trim="carrierAllFreight"
              disabled
              label-width="8.0em"
              type="number"
              v-show="this.classify != '0'"
            >
              <div slot="label" style="text-align:right;padding-right:1em;width:8.0em;">
                <img
                  :src="bitian"
                  alt
                  width="8"
                  height="8"
                  style="font-size:20px;vertical-align:middle;"
                  class="img1"
                />
                <span style="vertical-align:middle;">应收货主运费：</span>
              </div>
              <span slot="right" class="danwei">元</span>
            </x-input>
            <x-input
              type="number"
              title="运费金额："
              placeholder="请输入运费金额"
              v-model.trim="userFreight"
              :disabled="payState === '2' || payState === '3' || payState === '1' || payState === '6' || payState === '7' ? true : false"
            >
              <span slot="right">元</span>
              <span slot="right" @click="calculate()" v-show="calcuShowState">
                <img :src="jisuanqi" alt width="20" style="vertical-align: bottom;margin-left:10px" />
                <span style="color:#FFBA00">计算运费</span>
              </span>
            </x-input>
            <x-input
              type="number"
              title="预付现金："
              placeholder="请输入预付现金"
              v-model.trim="prepayments"
              :disabled="payState === '2' || payState === '3' || payState === '1' || payState === '6' || payState === '7' || confirmState === '1'? true: false"
            >
              <span slot="right" class="danwei">元</span>
            </x-input>
            <!-- 2020/08/28 新增 -->
            <!-- 自有（企业） -->
            <div v-if="classify == '0'">
              <x-input
                title="预付油卡："
                placeholder="请输入预付油卡"
                type="number"
                :disabled="payState === '2' || payState === '3' || payState === '1' || payState === '6' || payState === '7'"
                v-model.trim="prepaymentsOilCard"
                v-show="prepaymentsOilCardShow"
              >
                <span slot="right" class="danwei">元</span>
              </x-input>
              <cell
                title="油卡卡号："
                is-link
                v-model.trim="oilCardNo"
                v-show="Number(prepaymentsOilCard) != 0 && /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/.test(prepaymentsOilCard)"
                @click.native="gotoSelectOilCard(prepaymentsOilCard)"
                :disabled="payState === '2' || payState === '3' || payState === '1' || payState === '6' || payState === '7'"
              >
                <div
                  slot="value"
                  style="color:#757575;text-align: left;"
                  v-show="oilCardNo == ''"
                >请选择卡号</div>
              </cell>
              <x-input
                title="线下油款："
                type="number"
                v-model.trim="prepaymentsBuyOil"
                v-show="prepaymentsBuyOilShow"
                placeholder="请输入线下油款"
              >
                <span slot="right" class="danwei">元</span>
              </x-input>
              <x-input
                title="线下气款："
                type="number"
                v-model.trim="prepaymentsBuyGas"
                v-show="prepaymentsBuyGasShow"
                placeholder="请输入线下气款"
              >
                <span slot="right" class="danwei">元</span>
              </x-input>
              <x-input
                title="运费增补："
                type="number"
                v-model.trim="freightIncr"
                placeholder="请输入运费增补"
                :disabled="payState === '2' || payState === '3' || payState === '1' || payState === '6' || payState === '7' || confirmState === '1'"
              >
                <span slot="right" class="danwei">元</span>
              </x-input>
              <x-input
                title="运费扣减："
                type="number"
                v-model.trim="lossFee"
                placeholder="请输入运费扣减"
                :disabled="payState === '2' || payState === '3' || payState === '1' || payState === '6' || payState === '7' || confirmState === '1'"
              >
                <span slot="right" class="danwei">元</span>
              </x-input>
            </div>

          </div>
        </transition>
      </group>
      <!-- 运单详情页,对于开通了回款宝功能的企业和开通了自保理功能的企业,的运单详情页中展示收款人类型,带出建单时所选择的的收款人类型 -->
      <group
        label-width="7em"
        label-margin-right="1em"
        label-align="left"
        class="group4"
        v-show="this.classify != '0'"
      >
        <cell title="收款人信息：" is-link value-align="left" @click.native="receiveBill">
          <span :class="{ 'cell-left-style': receiveName !== '未填写' }">{{ receiveName }}</span>
        </cell>
      </group>
      <div class="footer" style="height:5rem;"></div>
      <div class="button" v-show="buttonshow">
        <x-button type="primary" :disabled="!buttonFlag" @click.native="clickConfirm">保存</x-button>
      </div>
    </div>

    <van-popup v-model="payPopupShow" position="bottom" class="pay_container">
      <div class="title">运单信息确认</div>
      <div class="content">
        <ul>
          <li class="adress">
            {{ loadingAddressName }}
            <img
              src="@/assets/imgs/wbs/jiantou_icon2@2x.png"
              alt
              class="jiantou"
            />
            {{ unloadingAddressName }}
          </li>
          <li>
            <div class="label">运单号</div>:
            <div class="value">{{ taxWaybillNo }}</div>
          </li>
          <li>
            <div class="label">车牌号码</div>:
            <div class="value">{{ cartBadgeNo }}</div>
          </li>
          <li>
            <div class="label">司机信息</div>:
            <div class="value">{{ mobileNo }},{{ driverName }}</div>
          </li>
          <li>
            <div class="label">发车时间</div>:
            <div class="value">{{ startTime }}</div>
          </li>
          <li>
            <div class="label">货物信息</div>:
            <div
              class="value"
            >{{ goodsName }},{{ unloadingTonnage }}{{ goodsAmountType | typeFilter}}</div>
          </li>
        </ul>
        <div class="bottom">
          <div class="money">
            <div class="label">运费金额</div>:
            <div class="value">{{ userFreight }}元</div>
          </div>
          <div class="prepay" v-if="Number(prepaymentsOilCardNotPaid) > 0">
            <div class="label">预付油卡</div>:
            <div class="value">{{ prepaymentsOilCardNotPaid }}元</div>
          </div>
          <div v-else>
            <div class="prepay" v-if="Number(prepayments) > 0">
              <div class="label">预付款</div>:
              <div class="value">{{ prepayments }}元</div>
            </div>
            <div class="prepay" v-if="Number(freightIncr) > 0">
              <div class="label">运费增补</div>:
              <div class="value">{{ freightIncr }}元</div>
            </div>
            <div class="prepay" v-if="Number(lossFee) > 0">
              <div class="label">运费扣减</div>:
              <div class="value">{{ lossFee }}元</div>
            </div>
          </div>
        </div>
      </div>
      <div class="botton_box">
        <van-button @click="cancelPay" class="btn cancel" type="primary">取消</van-button>
        <van-button @click="submitPay" class="btn submit" type="primary">确认申请</van-button>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { Button, Popup } from "vant";
import {
  dazongModifyBill,
  getTransportInfo,
  dazongModifyWayBill
} from "../../api/dazongapi.js";
import { isCanToPay, getPrepaymentsOilCardNotPaid } from "@/api/applyPay.js";
import {
  checkCommonCity,
  waybillRepeat,
  checkFee,
  //   reWriteWaybill,
  getDrawee,
  supplyChainState,
  getCompanyConfig
} from "../../api/api.js";
import { getCookie } from "../../utils/getCookie.js";
import { cityDataToIWant } from "../../utils/cMethods";
import { divide, multiply, subtract, add } from "../../utils/calc";
import { AppUpdateWaybillData, AppFinish } from "../../utils/app.js";
import { infoEntry } from "../../api/applyPay.js";
import { oilCardCheck, queryOilCardType } from "@/api/apiOil.js";
export default {
  name: "modifyWaybill",
  data() {
    return {
      buttonshow: false, //
      buttonFlag: false, //初始按钮不可以点击
      startPlaceModifyCfg: "4",
      endCfg: "4",
      payState: "", // 支付状态，用来判断某些选项不给更改输入
      shouqi: require("../../assets/imgs/wbs/shouqi_icon2@2x.png"),
      jisuanqi: require("../../assets/imgs/wbs/jisuan_icon@2x.png"),
      bitian: require("../../assets/imgs/wbs/bitian_icon@2x.png"),
      src1: require("../../assets/imgs/wbs/xuanzeselect_icon@2x.png"),
      src2: require("../../assets/imgs/wbs/xuanze_icon@2x.png"),
      src3: require("../../assets/imgs/wbs/xuanze_icon@2x.png"),
      src4: require("../../assets/imgs/wbs/xuanzeselect_icon@2x.png"),
      //第一部分
      taxWaybillNo: "", //运单号
      taxWaybillId: this.$route.query.taxWaybillId, //运单ID
      xid: "",
      cityList: [], //城市数据集合
      value3: [], //
      value4: [], //
      startProvinceCode: "",
      startCityCode: "",
      startCountyCode: "",
      endProvinceCode: "",
      endCityCode: "",
      endCountyCode: "",
      klbState: "", //运输状态
      stateCfg: "", //运单跟踪状态
      goodsName: "", //货物名称
      goodsAmount: "", //货物数量
      goodsAmountType: "",
      state: "", //业务记录状态   0 未追踪 1 跟踪中  2 已终结
      unitPrice: "", //运输价格
      startTime: "", //起运时间
      startDate: "", //开始时间
      endDate: "", //结束时间
      minHour: 0, //最小小时
      items1Value: "1",
      transTrip: "", //趟次
      loginState: "", //受票方状态
      requirement: "", //承运要求
      //第二部分
      show1: false,
      show2: false,
      show3: false,
      show15: false,
      activeFlag: -1,
      activeFlag1: -1,
      activeFlag3: -1,
      show13Waiting: 0,
      show13Msg: "",
      show14Waiting: 0,
      show14Msg: "",
      cartBadgeNo: "", //车牌号码
      driverName: "", //司机姓名
      mobileNo: "", //司机手机
      mobileNoRawData: "",

      driverMsg: "0",
      //第三部分

      allFreight: "", //司机的运费金额
      userFreight: "0.00", //用户输入的运费金额
      prepayments: "", //预付现金

      showControl: [0, 0, 1],
      lossInvoiceCfg: "",
      //第四部分
      receiveName: "未填写", //收款人信息

      payType: "", //收款人类型
      payName: "", //收款人姓名
      payIdCard: "", //收款人身份证
      payBankName: "", //收款人银行名称
      payBankNo: "", //收款人银行卡号

      payMobileNo: "", //收款人手机号
      provinceId: "", //开户行省份ID
      cityId: "", //开户行城市ID
      alipayNo: "", //收款人支付宝账号

      invoiceState: "", //开票状态
      confirmState: "", //运输结束确认状态
      billCycleMode: "", //结算周期
      businessItems: "", //业务项目配置
      maxAllFreight: "", //最大运费金额
      oilCardCfg: "",
      etcCardCfg: "",
      oilCardPayUpperCfg: "",
      paidAllFreight: "", //已付运费
      arrivePay: "0.00", //到付金额
      yetLossFee: "", //已支付货损金额
      insType: "", //保险类型
      insState: "", //投保状态
      freightChangeReasonCfg: "",
      msg: "", //修改原因
      //提取公共正则
      reg: /^([1-9]\d{0,6}|0)([\.]\d{0,4})?$/,
      Reg: /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/,

      //   screenHeight: document.documentElement.clientHeight,
      //   minHeight: "",
      // cityIdArr: [],
      loadingFlag: false,

      cityIdArr: [],
      types: "", //判断始发还是目的城市的标志

      oilCardNo: "", //油卡卡号
      belongActSys: "", //所属账户体系

      supplyChainState: "", //供应链金融配置

      show10: false,
      isModifyElements: "", //0：可修改 1：不可修改
      isModifyName: "", //0：可修改 1：不可修改
      isEleOil: "", //是否是电子油卡 0：是 1：否
      zyCapitalCfg: "",

      //大综
      orgName: "", //发货单位
      loadingAddressName: "", //装货地名称
      unloadingAddressName: "", //卸货地名称
      loadingTonnage: "", //装货吨位
      unloadingTonnage: "", //卸货吨位
      huosundunweiCopy: "", //如果货损金额是负数，则给这个赋值
      carrierAllFreight: "0.00", //应收货主运费
      allowLossWeight: "0.00", //允许货损
      lossUnitPrice: "0.00", //货损单价
      draweeList: [],
      drawee: "", //受票方名称
      draweeArr: [], //受票方名称数组
      taxDraweePartyId: "", //受票方ID
      taxDraweePartyIdArr: [], //受票方ID集合
      consignorList: [],
      consignor: [],
      consignorState: false,
      wbItem: "",
      classify: this.$route.query.classify
        ? this.$route.query.classify
        : getCookie("classify"), //类别分类 0：大宗自有运单(q企业版) 1：大宗外协运单(运营商)
      allowLossType: "", // 0:允许货损吨位 1:允许货损百分比
      allowLossPercent: "",
      bdState: "", // 大宗优化需求 2020/03/25
      xyState: "",
      payPopupShow: false,
      autoFreightState: "", // 自动计算运费  1 开启
      roundDownState: "", // 运费抹零  1 开启
      roundDownType: "", // 抹零方式

      prepaymentsOilCard: "", // 预付油卡
      prepaymentsBuyOil: "", // 线下油款
      prepaymentsBuyGas: "", // 线下气款
      existsAvaibleGasStation: "", //线下气款判断
      existsAvaibleOilStation: "", //线下油款判断
      yetBuyOilNotInvoice: "", //累计购油未开票金额
      yetBuyGasNotInvoice: "", //企业累计购气未开票金额
      yetPrepaymentsBuyOil: "",
      yetPrepaymentsBuyGas: "",
      freightIncr: "", // 运费增补
      lossFee: "", // 运费扣减
      prepaymentsOilCardShow: false, // 预付油卡显示
      prepaymentsBuyOilShow: false, // 线下油款显示
      prepaymentsBuyGasShow: false, // 线下气款显示
      prepaymentsOilCardNotPaid: 0, // 未支付预付油卡金额
    };
  },
  components: {
    vanButton: Button,
    vanPopup: Popup
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
    if (from.name == "chooseOilCard" || from.name == "addOilCard") {
      next(vm => {
        vm.$store.commit("updateLoadingStatus", { isLoading: false });
        if (window.localStorage.getItem("oilCardNo") != null) {
          vm.oilCardNo = window.localStorage.getItem("oilCardNo");
          window.localStorage.removeItem("oilCardNo");
        }
        vm.mobileNoRawData = vm.mobileNo;
        vm.isEleOil = vm.chooseOilCardItem.oilBigType == "4" ? "0" : "1";
      });
    } else if (from.name === "webReciveMsg" || from.name === "claimRules") {
      next(vm => {
        vm.$store.commit("updateLoadingStatus", { isLoading: false });
      });
    } else if (from.name === "chooseCity") {
      next(vm => {
        vm.$store.commit("updateLoadingStatus", { isLoading: false });
        vm.cityIdArr = JSON.parse(localStorage.getItem("cityIdArr"));
      });
    } else {
      next(vm => {
        vm.value3 = [];
        vm.value4 = [];
        vm.draweeArr = [];
        vm.draweeList = [];
        vm.consignorList = [];
        vm.consignor = [];
        vm.buttonFlag = true;
        // vm.checkbox(vm.demo1Checkbox);
        vm.$nextTick(() => {
          // vm.queryWaybill();
          vm._getCompanyConfig()
            .then(res => {
              vm.queryWaybill();
            })
            .catch(err => {});
        });
      });
      next();
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name != "chooseOilCard") {
      // 离开结算信息时清空选择油卡购物车
      let updateOpions = {
        type: "chooseOilCardItem"
      };
      this.$store.commit("cleanOildCardStatus", updateOpions);
    }
    if (to.name == "waybillDetail") {
      window.localStorage.clear();
    }
    if (to.name === "webReciveMsg") {
      if (
        !this.isEmptyStr(this.payName) &&
        !this.isEmptyStr(this.payIdCard) &&
        !this.isEmptyStr(this.payBankName) &&
        !this.isEmptyStr(this.payBankNo) &&
        !this.isEmptyStr(this.payMobileNo) &&
        typeof window.sessionStorage.isChooseType === "undefined"
      ) {
        let updateOpions = {
          type: "reciveMsgPay",
          updatMsg: {
            reciveType: this.payType,
            recivePersonName: this.payName, //收款人姓名
            recivePersonCardNum: this.payIdCard, //收款人身份证号
            recivePersonBankNum: this.payBankNo, //收款人银行卡号
            recivePersonphoneNum: this.payMobileNo, //收款人手机号
            reciveBank: [this.payBankName], //收款人银行名称
            reciveBankAdress: [this.provinceId, this.cityId], //收款人银行地址
            alipayNo: this.alipayNo
          }
        };
        this.$store.commit("updateWayBillStatus", updateOpions);
      }
      window.localStorage.setItem("zyCapitalCfg", this.zyCapitalCfg);
      let updateOpions1 = {
        type: "weyBillSecond",
        updatMsg: {
          cartBadgeNo: this.cartBadgeNo,
          driverName: this.driverName,
          mobileNo: this.mobileNo
        }
      };
      this.$store.commit("updateWayBillStatus", updateOpions1);
    }
    next();
  },
  activated() {
    if (window.sessionStorage.isChooseType === "1") {
      this.receiveName = this.reciveMsgPay.recivePersonName;
    } else {
      this.receiveName =
        !this.isEmptyStr(this.payName) &&
        !this.isEmptyStr(this.payIdCard) &&
        !this.isEmptyStr(this.payBankName) &&
        !this.isEmptyStr(this.payBankNo) &&
        !this.isEmptyStr(this.payMobileNo)
          ? this.payName
          : "未填写";
    }
  },
  beforeMount() {
    let date = new Date();
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
    //this.startTime = year + "-" + month + "-" + day + " " + hour + ":" + minute;
    this.startDate = year + "-" + month + "-" + day;
    this.endDate = year + 5 + "-" + month + "-" + day;
    this.minHour = Number(hour);
  },
  mounted() {
    this.cityList = cityDataToIWant(city.data);
  },
  watch: {
    cityIdArr() {
      if (this.cityIdArr.length != 0) {
        // this.cityIdArr = this.cityIdArr.split(",");
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
  computed: {
    chooseOilCardItem() {
      return this.$store.state.oilCard.chooseOilCardItem;
    },
    reciveMsgPay() {
      return this.$store.state.wayBill.reciveMsgPay;
    },
    reciveMsgPay1() {
      return this.$store.state.wayBill.reciveMsgPay1;
    },
    //货损吨位动态计算
    huosundunwei: {
      get: function() {
        if (
          this.reg.test(this.loadingTonnage) &&
          this.reg.test(this.unloadingTonnage)
        ) {
          if (Number(this.loadingTonnage) > Number(this.unloadingTonnage)) {
            this.huosundunweiCopy = "0";
            return (this.loadingTonnage - this.unloadingTonnage).toFixed(4);
          } else {
            this.huosundunweiCopy = "1"; //说明货损是负数
            return "0.0000";
          }
        } else {
          this.huosundunweiCopy = "0";
          return "0.0000";
        }
      },
      set: function() {}
    },
    // 计算按钮展示计算
    calcuShowState() {
      // 现在区分企业版和承运商版
      if (this.classify === "0") {
        if (this.payState != "2" && this.autoFreightState != "1") {
          return true;
        }
      } else {
        if (this.payState != "2") {
          return true;
        }
      }
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
              // this.updateWaybillCfg = res.data.result.updateWaybillCfg; // 修改运单配置 8：开通9：关闭
              this.businessItems = res.data.result.businessItems;
              if (res.data.result.updateWaybillCfg === "9") {
                this.$vux.confirm.show({
                  title: "提示",
                  confirmText: "确认",
                  cancelText: "取消",
                  content: "当前企业已关闭修改运单权限！",
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
    // 中远海运计算功能
    calculateBlur() {
      if (
        this.payState === "1" ||
        this.payState === "2" ||
        this.payState === "3" ||
        this.payState === "6" ||
        this.payState === "7"
      ) {
        return;
      }
      // 若运单对应的线路中，开启了【自动计算运费】，系统需要自动来计算该运单的运费，不需要手动点击【自动计算运费】按钮
      if (this.classify === "0" && this.autoFreightState === "1") {
        // 0:允许货损吨位 1:允许货损百分比
        if (this.goodsAmountType === "0") {
          if (this.allowLossType == "1") {
            let huosundunwei1 =
              Number(this.loadingTonnage) - Number(this.unloadingTonnage);
            let allowLossWeight =
              Number(this.allowLossPercent) * Number(this.loadingTonnage);
            console.log(huosundunwei1, allowLossWeight);
            if (huosundunwei1 >= 0) {
              if (huosundunwei1 <= allowLossWeight) {
                this.userFreight = (
                  this.unitPrice * this.unloadingTonnage
                ).toFixed(2);
              } else {
                this.userFreight = (
                  this.unitPrice * this.unloadingTonnage -
                  this.lossUnitPrice * (huosundunwei1 - allowLossWeight)
                ).toFixed(2);
              }
            } else {
              this.userFreight = (this.unitPrice * this.loadingTonnage).toFixed(
                2
              );
            }
          } else {
            if (this.huosundunweiCopy != "1") {
              if (this.huosundunwei <= this.allowLossWeight) {
                this.userFreight = (
                  this.unitPrice * this.unloadingTonnage
                ).toFixed(2);
              } else {
                this.userFreight = (
                  this.unitPrice * this.unloadingTonnage -
                  this.lossUnitPrice *
                    (this.huosundunwei - this.allowLossWeight)
                ).toFixed(2);
              }
            } else {
              this.userFreight = (this.unitPrice * this.loadingTonnage).toFixed(
                2
              );
            }
          }
        } else {
          let huosundunwei2 =
            Number(this.loadingTonnage) - Number(this.unloadingTonnage);
          if (huosundunwei2 >= 0) {
            this.userFreight = (this.unitPrice * this.unloadingTonnage).toFixed(
              2
            );
          } else {
            this.userFreight = (this.unitPrice * this.loadingTonnage).toFixed(
              2
            );
          }
        }
        // 若是自动计算的运费，且开启了【运费抹零】。自动计算的运费金额，都会进行抹零处理
        if (this.roundDownState === "1") {
          if (this.roundDownType === "0") {
            this.userFreight = Math.floor(this.userFreight).toFixed(2);
          } else {
            this.userFreight = (Math.floor(this.userFreight / 10) * 10).toFixed(
              2
            );
          }
        }
      }
    },
    //计算金额按钮
    calculate() {
      if (this.isEmptyStr(this.unitPrice)) {
        this.$vux.toast.text("运输单价不能为空！", "middle");
        return false;
      } else {
        if (!this.Reg.test(this.unitPrice)) {
          this.$vux.toast.text("无效的运输单价！", "middle");
          return false;
        }
      }
      if (this.isEmptyStr(this.unloadingTonnage)) {
        this.$vux.toast.text("卸货吨位不能为空", "middle");
        return false;
      } else {
        if (!this.reg.test(this.unloadingTonnage)) {
          this.$vux.toast.text("无效的卸货吨位", "middle");
          return false;
        }
      }
      //大综0.5情况下
      if (this.classify == "0") {
        if (this.goodsAmountType == "0") {
          if (this.allowLossType == "1") {
            // 1:允许货损百分比
            let huosundunwei =
              Number(this.loadingTonnage) - Number(this.unloadingTonnage);
            let allowLossWeight =
              Number(this.allowLossPercent) * Number(this.loadingTonnage);
            if (huosundunwei >= 0) {
              if (huosundunwei <= allowLossWeight) {
                this.userFreight = (
                  this.unitPrice * this.unloadingTonnage
                ).toFixed(2);
              } else {
                this.userFreight = (
                  this.unitPrice * this.unloadingTonnage -
                  this.lossUnitPrice * (huosundunwei - allowLossWeight)
                ).toFixed(2);
              }
            } else {
              //这种属于卸货比装货吨位大的情况
              this.userFreight = (this.unitPrice * this.loadingTonnage).toFixed(
                2
              );
            }
          } else {
            //  if (this.allowLossType == '0')
            // 0:允许货损吨位
            //a、若货损吨位，小于等于运输线路中的【允许货损】，则运费金额=卸货吨位x运输单价
            //b、若货损吨位，大于【允许货损】，则运费金额=【卸货吨位x运输单价】-【（货损单价）x（货损吨位-允许货损）】
            if (this.huosundunweiCopy != "1") {
              if (this.huosundunwei <= this.allowLossWeight) {
                this.userFreight = (
                  this.unitPrice * this.unloadingTonnage
                ).toFixed(2);
              } else {
                this.userFreight = (
                  this.unitPrice * this.unloadingTonnage -
                  this.lossUnitPrice *
                    (this.huosundunwei - this.allowLossWeight)
                ).toFixed(2);
              }
            } else {
              //这种属于卸货比装货吨位大的情况
              this.userFreight = (this.unitPrice * this.loadingTonnage).toFixed(
                2
              );
            }
          }
        } else {
          let huosundunwei =
            Number(this.loadingTonnage) - Number(this.unloadingTonnage);
          if (huosundunwei >= 0) {
            this.userFreight = (this.unitPrice * this.unloadingTonnage).toFixed(
              2
            );
          } else {
            //这种属于卸货比装货吨位大的情况
            this.userFreight = (this.unitPrice * this.loadingTonnage).toFixed(
              2
            );
          }
        }
      } else {
        this.userFreight = (this.unitPrice * this.unloadingTonnage).toFixed(2);
      }
    },
    //发车时间修改
    changeTime(val) {
      this.startTime = val;
    },
    //选择城市
    chooseStCity(index) {
      if (index == "0" && this.startPlaceModifyCfg === "5") {
        return false;
      }
      if (index == "1" && this.endCfg === "5") {
        return false;
      }
      this.$router.push({
        path: "/chooseCity",
        query: {
          type: index
        }
      });
    },
    //吊起车牌组件
    carNumIpt() {
      let newCartBadgeNo = this.cartBadgeNo;
      if (this.payState === "2") return false;
      let _this = this;
      this.$carIpt({
        dpCartNum:
          this.cartBadgeNo !== "" && this.cartBadgeNo !== "请输入车牌号码"
            ? this.cartBadgeNo
            : "",
        fn: function(res) {
          _this.cartBadgeNo = res === "" ? "请输入车牌号码" : res;
          //修改前的车牌
          console.log(newCartBadgeNo);
          //修改过后的车牌
          console.log(res);
          if (newCartBadgeNo != res && _this.isEleOil != 0) {
            _this.oilCardNo = "";
          }
        }
      });
    },
    //修改运单页面查询所有配置
    queryWaybill() {
      dazongModifyBill(this.taxWaybillId)
        .then(res => {
          //3063
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          if (res.data.reCode == 0) {
            let result = res.data.result;
            this.xid = result.xid; //后期 xid不从客户端获取
            this.belongActSys = result.belongActSys; //所属账户体系
            this.startPlaceModifyCfg = result.startPlaceModifyCfg;
            this.lossInvoiceCfg = result.lossInvoiceCfg;
            this.endCfg = result.endCfg;
            this.payState = result.payState;
            this.taxWaybillNo = result.taxWaybillNo;
            this.startCityCode = result.startCityId;
            this.startProvinceCode = result.startProvinceId;
            this.startCountyCode = result.startCountyId;
            this.endCityCode = result.endCityId;
            this.endProvinceCode = result.endProvinceId;
            this.endCountyCode = result.endCountyId;
            this.prepaymentsOilCard = result.prepaymentsOilCard; //预付油卡
            this.oilCardNo = result.oilCardNo; //油卡卡号
            this.zyCapitalCfg = result.zyCapitalCfg; //回款宝配置

            this.isModifyElements = result.isModifyElements; //0：可修改 1：不可修改
            this.isModifyName = result.isModifyName; // 0：姓名可修改 1：不可修改
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
            this.klbState = result.klbState; //快路宝状态
            this.state = result.state; //业务记录状态
            this.stateCfg = result.stateCfg;
            this.goodsName = result.goodsName;
            this.goodsAmount = result.goodsAmount;
            this.goodsAmountType = result.goodsAmountType;
            this.unitPrice = result.unitPrice;
            this.startTime = result.startTime;
            this.transTrip = result.transTrip;
            if (this.transTrip == 1) {
              this.items1Value = 1;
            } else {
              this.items1Value = 2;
            }
            this.wbItem = result.wbItem;
            this.taxDraweePartyId = result.taxDraweePartyId;
            this.drawee = result.drawee;
            this.draweeArr.push(this.drawee);
            if (result.consignor) {
              this.consignor.push(result.consignor);
            }
            this.loginState = result.loginState;
            this.requirement = result.tranRequire;
            this.cartBadgeNo = result.cartBadgeNo;
            this.driverName = result.driverName;
            this.mobileNo = result.mobileNo;
            this.mobileNoRawData = result.mobileNo;
            this.carType = result.cartType;
            if (!this.isEmptyStr(result.cartLength)) {
              this.carLength = result.cartLength + "米";
            }
            if (!this.isEmptyStr(result.cartTonnage)) {
              this.carTonNumber = result.cartTonnage + "吨";
            }
            this.driverMsg = result.driverMsg; //承运信息是否可以修改
            this.allFreight = result.allFreight;
            this.userFreight = result.userFreight || "0.00";
            this.lossFee = result.lossFee;
            this.freightIncr = result.freightIncr;
            this.prepayments = result.prepayments;
            this.prepaymentsBuyOil = result.prepaymentsBuyOil;
            this.prepaymentsBuyGas = result.prepaymentsBuyGas;
            this.prepaymentsBuyEtc = result.prepaymentsBuyEtc;
            this.note = result.note;
            this.backFee = result.backFee;
            this.payType = result.payType; //收款人类型
            if (result.payType == "1") {
              this.value2 = "本人收款";
            } else if (result.payType == "0") {
              this.value2 = "非本人收款";
            } else {
              this.value2 = "请选择";
            }
            this.payName = result.payName; //收款人姓名
            this.payIdCard = result.payIdCard; //收款人身份证
            this.payBankName = result.payBankName; //收款人银行名称
            this.payBankNo = result.payBankNo; //收款人银行卡号
            this.payMobileNo = result.payMobileNo; //收款人手机号
            this.provinceId = result.provinceId; //开户行省份ID
            this.cityId = result.cityId; //开户行城市ID
            this.alipayNo = result.alipayNo; //支付宝账号
            if (
              !this.isEmptyStr(this.payName) &&
              !this.isEmptyStr(this.payIdCard) &&
              !this.isEmptyStr(this.payBankName) &&
              !this.isEmptyStr(this.payBankNo) &&
              !this.isEmptyStr(this.payMobileNo)
            ) {
              this.receiveName = this.payName;
            } else {
              this.receiveName = "未填写";
            }
            this.invoiceState = result.invoiceState;
            this.confirmState = result.confirmState;
            this.billCycleMode = result.billCycleMode;
            // this.businessItems = result.businessItems;
            this.maxAllFreight = result.maxAllFreight;
            this.existsAvaibleOilStation = result.existsAvaibleOilStation;
            this.existsAvaibleEtcStation = result.existsAvaibleEtcStation;
            this.existsAvaibleGasStation = result.existsAvaibleGasStation;
            this.oilCardCfg = result.oilCardCfg;
            this.etcCardCfg = result.etcCardCfg;
            this.oilCardPayUpperCfg = result.oilCardPayUpperCfg;
            this.yetBuyOilNotInvoice = result.yetBuyOilNotInvoice;
            this.yetBuyEtcNotInvoice = result.yetBuyEtcNotInvoice;
            this.yetBuyGasNotInvoice = result.yetBuyGasNotInvoice;
            this.yetPrepaymentsBuyOil = result.yetPrepaymentsBuyOil;
            this.yetPrepaymentsBuyEtc = result.yetPrepaymentsBuyEtc;
            this.yetPrepaymentsBuyGas = result.yetPrepaymentsBuyGas;
            this.paidAllFreight = result.paidAllFreight;
            this.yetLossFee = result.yetLossFee;
            this.insType = result.insType;
            this.insState = result.insState;
            this.freightChangeReasonCfg = result.freightChangeReasonCfg;

            //大综
            this.orgName = result.orgName;
            this.unloadingTonnage = result.unloadingTonnage;
            this.loadingTonnage = result.loadingTonnage;
            this.loadingAddressName = result.loadingAddressName;
            this.unloadingAddressName = result.unloadingAddressName;
            this.carrierAllFreight = result.carrierAllFreight;
            if (result.carrierAllFreight == "") {
              this.carrierAllFreight = "0.00";
            }
            // 大宗优化需求 2020/03/25
            this.bdState = result.bdState;
            this.xyState = result.xyState;
            // 2020/08/31
            this.prepaymentsOilCardShow = this.oilCardCfg == 8 || (this.oilCardCfg == 9 && Number(this.prepaymentsOilCard) != 0);
            this.prepaymentsBuyOilShow = this.existsAvaibleOilStation == '1' || Number(this.prepaymentsBuyOil) > 0;
            this.prepaymentsBuyGasShow = this.existsAvaibleGasStation == '1' || Number(this.prepaymentsBuyGas) > 0;
            // this.billState = result.billState;
            //本地存储接口返回的值
            localStorage.setItem("oldTaxWaybillNo", result.taxWaybillNo);
            localStorage.setItem(
              "prepaymentsBuyOiled",
              result.prepaymentsBuyOil
            );
            localStorage.setItem(
              "prepaymentsBuyEtced",
              result.prepaymentsBuyEtc
            );
            localStorage.setItem(
              "prepaymentsBuyGased",
              result.prepaymentsBuyGas
            );
            localStorage.setItem(
              "oldStartProvinceCode",
              this.startProvinceCode
            );
            localStorage.setItem("oldStartCityCode", this.startCityCode);
            localStorage.setItem("oldEndProvinceCode", this.endProvinceCode);
            localStorage.setItem("oldEndCityCode", this.endCityCode);
            localStorage.setItem("oldAllFreight", this.userFreight);
            // 2020/08/25
            if (this.classify == '0') {
              // 自有
              if (this.oilCardNo) {
                setTimeout(() => {
                  this.$_queryOilCardType()
                }, 500);
              }
            }
            if (result.transportLineId != "") {
              let json = {
                transportLineId: result.transportLineId //87
              };
              getTransportInfo(json)
                .then(re => {
                  //3097
                  this.$store.commit("updateLoadingStatus", {
                    isLoading: false
                  });
                  if (re.data.reCode == "0") {
                    let result = re.data.result;
                    // 发货人列表数据
                    if (
                      result.consignor &&
                      result.consignor.split(",").length > 0
                    ) {
                      // 有发货人数据，就展示
                      this.consignorState = true;
                      this.consignorList.push(result.consignor.split(","));
                      if (
                        result.consignor.split(",").length === 1 &&
                        this.consignor[0] == ""
                      ) {
                        this.consignor.push(result.consignor.split(",")[0]);
                      }
                    }
                    if (result.allowLossWeight == "") {
                      this.allowLossWeight = "0.00";
                    } else {
                      this.allowLossWeight = result.allowLossWeight; //允许货损
                    }
                    if (result.lossUnitPrice == "") {
                      this.lossUnitPrice = "0.00";
                    } else {
                      this.lossUnitPrice = result.lossUnitPrice; //货损单价
                    }

                    this.allowLossType = result.allowLossType;
                    this.allowLossPercent = result.allowLossPercent;
                    // 中远海运新加字段
                    this.autoFreightState = result.autoFreightState;
                    this.roundDownType = result.roundDownType;
                    this.roundDownState = result.roundDownState;
                  }
                })
                .catch(err => {
                  this.$store.commit("updateLoadingStatus", {
                    isLoading: false
                  });
                  this.$vux.toast.text(err.message, "middle");
                });
            } else {
              this.allowLossWeight = "0.00"; //允许货损
              this.lossUnitPrice = "0.00"; //货损单价
            }
          } else {
            this.$vux.toast.text(res.data.reInfo, "middle");
          }
          this.$nextTick(() => {
            this.buttonshow = true; // 显示
            this.loadingFlag = true;
          });
        })
        .catch(err => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          this.$vux.toast.text(err.message, "middle");
        });
    },
    // 查询是否是电子油卡
    $_queryOilCardType() {
      return new Promise((resolve, reject) => {
        queryOilCardType(this.oilCardNo).then(res => {
          this.$store.commit("updateLoadingStatus", {
            isLoading: false
          });
          if (res.data.reCode == 0) {
            this.isEleOil = res.data.result.isEleOil;
            resolve()
          } else {
            reject()
          }
        }).catch(() => {
          reject()
        });
      });
    },
    //点击确定保存按钮
    async clickConfirm() {
      //运单号判断
      this.taxWaybillNo = this.trim(this.taxWaybillNo);
      if (this.isEmptyStr(this.taxWaybillNo)) {
        this.$vux.toast.text("运单号不能为空！", "middle");
        return false;
      } else {
        let regExp = /^[0-9a-zA-Z_-]+$/;
        if (!regExp.test(this.taxWaybillNo)) {
          this.$vux.toast.text(
            "运单号只接受数字,字母," + "_" + "与 " + "-" + ",不接受特殊字符！",
            "middle"
          );
          return false;
        }
      }
      //发货单位必填
      // if (this.classify != '0' && this.isEmptyStr(this.orgName)) {
      // 	this.$vux.toast.text("发货单位不能为空！", "middle");
      // 	return false;
      // }
      //装货地名称必填(可修改)
      if (this.isEmptyStr(this.loadingAddressName)) {
        this.$vux.toast.text("装货地名称不能为空！", "middle");
        return false;
      }
      //卸货地名称必填(可修改)
      if (this.isEmptyStr(this.unloadingAddressName)) {
        this.$vux.toast.text("卸货地名称不能为空！", "middle");
        return false;
      }
      //同城运输判断
      if (
        !this.isEmptyStr(this.startProvinceCode) &&
        !this.isEmptyStr(this.endProvinceCode)
      ) {
        let validateCountyRes = await this.checkCountry();
        if (validateCountyRes == "1") {
          this.$vux.toast.text("同城运输区县必填！", "middle");
          return false;
        }
        if (validateCountyRes == "2") {
          this.$vux.toast.text(
            "验证同城运输区县是否必填异常，请稍后重试！",
            "middle"
          );
          return false;
        }
      }
      //货物名称不能为空
      this.goodsName = this.trim(this.goodsName);
      if (this.isEmptyStr(this.goodsName)) {
        this.$vux.toast.text("货物名称不能为空！", "middle");
        return false;
      }
      //运输单价(不是必填)
      this.unitPrice = this.trim(this.unitPrice);
      if (!this.isEmptyStr(this.unitPrice)) {
        if (!this.Reg.test(this.unitPrice)) {
          this.$vux.toast.text("无效的运输单价！", "middle");
          return false;
        }
      }
      //业务项目配置
      if (this.businessItems == 3) {
        this.wbItem = this.trim(this.wbItem);
        if (this.isEmptyStr(this.wbItem)) {
          this.$vux.toast.text("业务项目不能为空！", "middle");
          return false;
        }
      }
      //多趟时趟次范围2-99
      if (
        this.classify == 1 &&
        this.billCycleMode == "8" &&
        this.items1Value == 2
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
      //司机手机号验证
      let re = /^1\d{10}$/;
      if (!re.test(this.mobileNo)) {
        this.$vux.toast.text("司机手机号码输入错误", "middle");
        return false;
      }
      //司机姓名上传规则验证
      if (
        !this.isEmptyStr(this.driverName) &&
        this.trim(this.driverName).length >= 64
      ) {
        this.$vux.toast.text("司机姓名长度最大不可以超过64个字符！", "middle");
        return;
      }
      //装货吨位规则判断
      if (
        !this.isEmptyStr(this.loadingTonnage) &&
        !this.reg.test(this.loadingTonnage)
      ) {
        this.$vux.toast.text("无效的装货吨位", "middle");
        return false;
      }
      //卸货吨位必填且规则判断
      if (this.isEmptyStr(this.unloadingTonnage)) {
        this.$vux.toast.text("卸货吨位必填", "middle");
        return false;
      } else {
        if (!this.reg.test(this.unloadingTonnage)) {
          this.$vux.toast.text("无效的卸货吨位", "middle");
          return false;
        }
      }
      //运费金额验证   系统自动计算，计算公式：卸货吨位x运输单价，可修改，不同步给发货单位
      if (!this.isEmptyStr(this.userFreight)) {
        if (!this.Reg.test(this.userFreight)) {
          this.$vux.alert.show({ title: "提示", content: "运费金额不合法！" });
          //this.$vux.toast.text("无效的运费扣减金额！", "middle");
          return false;
        } else {
          // if (Number(this.userFreight) == "0") {
          //   this.$vux.alert.show({
          //     title: "提示",
          //     content: "运费金额不合法！"
          //   });
          //   return false;
          // }
          if (Number(this.userFreight) > Number(this.maxAllFreight)) {
            this.$vux.alert.show({
              title: "提示",
              content: "运费金额不能超过最大运费金额！"
            });
          }
        }
      }
      // else {
      //   this.$vux.alert.show({
      //     title: "提示",
      //     content: "运费金额不能为空！"
      //   });
      //   return false;
      // }
      //预付现金
      if (!this.isEmptyStr(this.prepayments)) {
        if (!this.Reg.test(this.prepayments)) {
          this.$vux.alert.show({
            title: "提示",
            content: "无效的预付现金！"
          });
          return false;
        }
        if (Number(this.prepayments) > Number(this.userFreight)) {
          this.$vux.alert.show({
            title: "提示",
            content: "预付现金不能大于运费金额！"
          });
          return false;
        }
        if (Number(this.prepayments) > Number(this.maxAllFreight)) {
          this.$vux.alert.show({
            title: "提示",
            content: "预付现金不能超过最大金额！"
          });
          return false;
        }
      }

      if (!this.isEmptyStr(this.userFreight)) {
        let regexp = /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/;
        if (
          regexp.test(this.userFreight) &&
          Number(this.userFreight) > Number(this.maxAllFreight)
        ) {
          this.$vux.alert.show({
            title: "提示",
            content: "运费金额不能超过最大运费金额！"
          });
          return false;
        }
      }
      //  else {
      //   this.sub();
      //   return false;
      // }
      // 2020/08/28
      if (this.classify == '0') {
        // 自有
        //运费扣减
        if (!this.isEmptyStr(this.lossFee)) {
          if (!this.Reg.test(this.lossFee)) {
            this.$vux.alert.show({
              title: "提示",
              content: "无效的运费扣减金额！"
            });
            return false;
          }
        }
        //运费增补
        if (!this.isEmptyStr(this.freightIncr)) {
          if (!this.Reg.test(this.freightIncr)) {
            this.$vux.alert.show({
              title: "提示",
              content: "无效的运费增补金额！"
            });
            return false;
          }
        }
        //线下油款
        if (this.existsAvaibleOilStation == "1" || this.prepaymentsBuyOil > "0") {
          if (!this.isEmptyStr(this.prepaymentsBuyOil)) {
            if (!this.Reg.test(this.prepaymentsBuyOil)) {
              this.$vux.alert.show({
                title: "提示",
                content: "无效的线下油款金额！"
              });
              return false;
            }
          }
        }
        //线下气款
        if (this.existsAvaibleGasStation == "1" || this.prepaymentsBuyGas > "0") {
          if (!this.isEmptyStr(this.prepaymentsBuyGas)) {
            if (!this.Reg.test(this.prepaymentsBuyGas)) {
              this.$vux.alert.show({
                title: "提示",
                content: "无效的线下气款金额！"
              });
              return false;
            }
          }
        }
        //预付油卡
        if (!this.isEmptyStr(this.prepaymentsOilCard)) {
          this.prepaymentsOilCard = this.trim(this.prepaymentsOilCard);
          let regExp = /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/;
          if (!regExp.test(this.prepaymentsOilCard)) {
            this.$vux.alert.show({
              title: "提示",
              content: "无效的预付油卡金额！"
            });
            return false;
          } else {
            if (Number(this.prepaymentsOilCard) > Number(this.maxAllFreight)) {
              this.$vux.alert.show({
                title: "提示",
                content: "预付油卡金额不能超过最大金额！"
              });
              return false;
            }
            if (Number(this.prepaymentsOilCard) && this.oilCardNo == "") {
              this.$vux1.confirm.show({
                title: "提示",
                content: `<p style='color:#454545;'>当前运单存在预付油卡</p><p style='color:#454545;'>请选择油卡!</p>`,
                confirmText: "选择油卡",
                cancelText: "保存",
                onConfirm: () => {
                  this.$router.push({
                    path: "/chooseOilCard",
                    query: {
                      belongActSys: this.belongActSys,
                      prepaymentsOilCard: this.prepaymentsOilCard,
                      cartBadgeNo: this.cartBadgeNo,
                      driverName: this.driverName,
                      mobileNo: this.mobileNo
                    }
                  });
                },
                onCancel: () => {
                  //判断是否修改了运单号
                  if (this.taxWaybillNo != localStorage.getItem("oldTaxWaybillNo")) {
                    this.$_waybillRepeatCheck(this.taxWaybillNo).then(() => {
                      //运费各种判断
                      this.checkFee();
                    })
                    // this.waybillRepeatCheck(this.taxWaybillNo);
                  } else {
                    //运费各种判断
                    this.checkFee();
                  }
                  return false;
                }
              });
              return false;
            }
          }
        }
      }

      //运费各种判断
      this.checkFee();
    },
    //各种运费判断
    checkFee() {
      // 2020/08/31
      if (this.classify == '0') {
        if (this.isEmptyStr(this.userFreight)) {
          this.userFreight = 0;
        }
        if (this.isEmptyStr(this.prepayments)) {
          this.prepayments = 0;
        }
        if (this.isEmptyStr(this.prepaymentsBuyOil)) {
          this.prepaymentsBuyOil = 0;
        }
        if (this.isEmptyStr(this.prepaymentsBuyGas)) {
          this.prepaymentsBuyGas = 0;
        }
        if (this.isEmptyStr(this.prepaymentsBuyEtc)) {
          this.prepaymentsBuyEtc = 0;
        }
        if (this.isEmptyStr(this.backFee)) {
          this.backFee = 0;
        }
        if (this.isEmptyStr(this.freightIncr)) {
          this.freightIncr = 0;
        }
        if (this.isEmptyStr(this.lossFee)) {
          this.lossFee = 0;
        }
        if (this.isEmptyStr(this.yetBuyOilNotInvoice)) {
          this.yetBuyOilNotInvoice = 0;
        }

        if (this.isEmptyStr(this.yetBuyGasNotInvoice)) {
          this.yetBuyGasNotInvoice = 0;
        }
        if (this.isEmptyStr(this.yetPrepaymentsBuyOil)) {
          this.yetPrepaymentsBuyOil = 0;
        }
 
        if (this.isEmptyStr(this.yetPrepaymentsBuyGas)) {
          this.yetPrepaymentsBuyGas = 0;
        }
        if(this.oilCardCfg=="8"){
          if (this.prepaymentsBuyOilShow) {
            // 预付油卡金额加上线下油款金额不能大于运费金额*油卡支付上限
            if(this.f(this.d(this.prepaymentsOilCard, this.prepaymentsBuyOil),multiply(this.d(this.d(this.f(this.userFreight, this.lossFee), this.freightIncr),this.prepaymentsBuyOil), this.oilCardPayUpperCfg))>0){
                this.$vux.alert.show({
                  title: "提示",
                  content: "请确认，预付油卡金额加上线下油款金额不能大于设置的上限。"
                });
                return false;
            }
          } else {
            // 请确认，预付油卡金额不能大于设置的上限。
            if(this.f(this.prepaymentsOilCard, multiply(this.d(this.f(this.userFreight, this.lossFee), this.freightIncr), this.oilCardPayUpperCfg))>0){
                this.$vux.alert.show({
                  title: "提示",
                  content: "请确认，预付油卡金额不能大于设置的上限。"
                });
                return false;
            }
          }
        }
        let prepaymentsBuyOiled = localStorage.getItem("prepaymentsBuyOiled");
        // let prepaymentsBuyEtced = localStorage.getItem("prepaymentsBuyEtced");
        let prepaymentsBuyGased = localStorage.getItem("prepaymentsBuyGased");
        if (
          this.d(this.f(this.userFreight, this.lossFee), this.freightIncr) <= 0
        ) {
          this.$vux.alert.show({
            title: "提示",
            content: "请确认，运费金额加运费增补减货损必须大于0。"
          });
          return false;
        }
        // 预付油卡权限设置为关闭，油品开票记录设置为运单回填记录，输入线下油款金额大于用户输入的金额乘以油卡设置上限比例
        if (
          this.oilCardCfg == 9 &&
          subtract(
            this.prepaymentsBuyOil,
            multiply(
              this.d(
                this.d(this.f(this.userFreight, this.lossFee), this.freightIncr),
                this.prepaymentsBuyOil
              ),
              this.oilCardPayUpperCfg
            )
          ) > 0
        ) {
          this.$vux.alert.show({
            title: "提示",
            content: "请确认，线下油款金额不能大于设置的上限！"
          });
          return false;
        }
        // 企业累计线下油款不能大于累计购油未开票余额
        if (
          this.f(
            this.d(
              this.f(this.prepaymentsBuyOil, this.prepaymentsBuyOiled),
              this.yetPrepaymentsBuyOil
            ),
            this.yetBuyOilNotInvoice
          ) > 0
        ) {
          this.$vux.alert.show({
            title: "提示",
            content: "请确认，企业累计线下油款不能大于累计购油未开票余额"
          });
          return false;
        }


        // 企业累计线下气款不能大于累计气款未开票余额
        if (
          this.f(
            this.d(
              this.f(this.prepaymentsBuyGas, this.prepaymentsBuyGased),
              this.yetPrepaymentsBuyGas
            ),
            this.yetBuyGasNotInvoice
          ) > 0
        ) {
          this.$vux.alert.show({
            title: "提示",
            content: "请确认，企业累计线下气款不能大于累计气款未开票余额"
          });
          return false;
        }

        if (
          this.d(this.f(this.userFreight, this.lossFee), this.freightIncr) < 0
        ) {
          this.$vux.alert.show({
            title: "提示",
            content: "确认，运费金额加运费增补减货损必须大于0。"
          });
          return false;
        }

        if (this.d(this.prepaymentsOilCard,this.d(this.prepayments, this.backFee)) > this.d(this.f(this.userFreight, this.lossFee), this.freightIncr)) {
          if(this.oilCardCfg=="8"){
            this.$vux.alert.show({title: "提示", content:"请确认，预付油卡加上预付款必须要小于等于运费金额加上增补减去货损。"});
          }else{
            this.$vux.alert.show({title: "提示", content:"请确认，预付款必须要小于等于运费金额加上增补减去货损。"});
          }
          return false;
        } else {
          //验证运费合理性接口
          if (
            !this.isEmptyStr(this.startProvinceCode) &&
            !this.isEmptyStr(this.endProvinceCode) &&
            !this.isEmptyStr(this.startCityCode) &&
            !this.isEmptyStr(this.endCityCode) &&
            !this.isEmptyStr(this.userFreight)
          ) {
            this._checkFee();
          }else{
            this.$vux.toast.text("城市数据异常~", "middle");
          }
        }
      } else {
       this._checkFee()
      }
    },
    _checkFee() {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      //验证运费合理性接口
      let json1 = {
        fromProvId: this.startProvinceCode, //起运省份ID
        toProvId: this.endProvinceCode, //目的省份ID
        fromCityId: this.startCityCode, //起运城市ID
        toCityId: this.endCityCode, //目的城市ID
        allFreight: this.userFreight //运输总价
      };
      this.buttonFlag = false;
      checkFee(json1)
        .then(res => {
          console.log(res.data.reCode);
          if ("0" == res.data.reCode) {
            this.sub();
          } else {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if ("1" == res.data.reCode) {
              this.$vux1.confirm.show({
                title: "提示",
                confirmText: "确认",
                cancelText: "取消",
                content: res.data.reInfo,
                onConfirm: () => {
                  //点击确定去建单
                  this.sub();
                }
              });
            } else {
              this.$vux.toast.text(
                "抱歉,您录入的数据不合法,请核实后重试！",
                "middle"
              );
            }
          }
          this.buttonFlag = true;
        })
        .catch(err => {
          console.log(err);
          this.buttonFlag = true;
          this.$store.commit("updateLoadingStatus", { isLoading: false });
        });
    },
    //运费合理性
    sub() {
      let oldStartProvinceCode = localStorage.getItem("oldStartProvinceCode");
      let oldStartCityCode = localStorage.getItem("oldStartCityCode");
      let oldEndProvinceCode = localStorage.getItem("oldEndProvinceCode");
      let oldEndCityCode = localStorage.getItem("oldEndCityCode");
      let oldAllFreight = localStorage.getItem("oldAllFreight");
      let newStartAddr = localStorage.getItem("startValue");
      let newEndAddr = localStorage.getItem("endValue");
      // 如果运单不是未投保状态
      if (
        "12" == this.insType &&
        "0" != this.insState &&
        (oldStartProvinceCode != this.startProvinceCode ||
          oldStartCityCode != this.startCityCode ||
          oldEndProvinceCode != this.endProvinceCode ||
          oldEndCityCode != this.endCityCode ||
          parseFloat(oldAllFreight).toFixed(2) !=
            parseFloat(this.userFreight).toFixed(2))
      ) {
        this.$vux1.confirm.show({
          title: "提示",
          confirmText: "确认",
          cancelText: "取消",
          content:
            "修改起始地、目的地、运费会对已投保的保单保费产生变化，如您确定修改以上内容，后台将自动进行退保！",
          onConfirm: () => {
            this.submit();
          }
        });
      } else {
        this.submit();
      }
    },
    //修改成功后提交的方法
    submit() {
      let bankName =
        window.sessionStorage.isChooseType === "1"
          ? this.reciveMsgPay.reciveBank[0]
          : this.payBankName;
      var _this = this;
      let userFreightOld = localStorage.getItem("oldAllFreight");
      if (
        this.freightChangeReasonCfg == 1 &&
        Number(this.userFreight) !== Number(userFreightOld)
      ) {
        this.$store.commit("updateLoadingStatus", { isLoading: false });
        this.$vux.confirm.prompt("请输入修改原因", {
          title: "请输入修改原因",
          onConfirm(value) {
            _this.msg = value;
            let regexp = /^\s+$/g;
            if (value == "" || regexp.test(value) || value == null) {
              _this.$vux.toast.text("运费金额修改原因必填！", "middle");
              return false;
            }
            if (value != "" && !regexp.test(value) && value != null) {
              if (value.length >= 120) {
                _this.$vux.toast.text(
                  "输入内容超过限制，请修改重试！",
                  "middle"
                );
                return false;
              } else {
                //通知后台
                // _this.sendMessage();
                if (bankName == "好运宝钱包" || bankName == "车队钱包") {
                  _this.sendMessage();
                } else {
                  _this.informationEntry();
                }
              }
            }
          }
        });
      } else {
        if (bankName == "好运宝钱包" || bankName == "车队钱包") {
          this.sendMessage();
        } else {
          this.informationEntry();
        }
      }
    },
    informationEntry() {
      this.$_informationEntry().then(() => {
        if (this.classify == '0') {
          return this.$_oilCardCheck()
        } else {
          return Promise.resolve()
        }
      }).then(() => {
        this.sendMessage()
      }).catch(() => {

      })
    },
    //录入信息的方法
    $_informationEntry() {
      return new Promise((resolve, reject) => {
        let jsons = {
          mobileNo: this.mobileNo,
          payeeBankNo:
            window.sessionStorage.isChooseType === "1"
              ? this.reciveMsgPay.recivePersonBankNum
              : this.payBankNo, //收款人银行卡号
          payeeName:
            window.sessionStorage.isChooseType === "1"
              ? this.reciveMsgPay.recivePersonName
              : this.payName, //收款人姓名
          payeeBankName:
            window.sessionStorage.isChooseType === "1"
              ? this.reciveMsgPay.reciveBank[0]
              : this.payBankName, //收款人银行名称
          payeeProvinceId:
            window.sessionStorage.isChooseType === "1"
              ? this.reciveMsgPay.reciveBankAdress[0]
              : this.provinceId, //开户行省份id
          payeeCityId:
            window.sessionStorage.isChooseType === "1"
              ? this.reciveMsgPay.reciveBankAdress[1]
              : this.cityId, //开户行城市id
          payeeIdCard:
            window.sessionStorage.isChooseType === "1"
              ? this.reciveMsgPay.recivePersonCardNum
              : this.payIdCard, //收款人身份证
          payeeMobileNo:
            window.sessionStorage.isChooseType === "1"
              ? this.reciveMsgPay.recivePersonphoneNum
              : this.payMobileNo, //收款人手机号
          alipayNo:
            window.sessionStorage.isChooseType === "1"
              ? this.reciveMsgPay.alipayNo
              : this.alipayNo //收款人支付宝
        };
        if (
          jsons.mobileNo != "" &&
          jsons.payeeBankNo != "" &&
          jsons.payeeName != "" &&
          jsons.payeeBankName != "" &&
          jsons.payeeProvinceId != "" &&
          jsons.payeeCityId != "" &&
          jsons.payeeIdCard != "" &&
          jsons.payeeMobileNo != ""
        ) {
          this.$store.commit("updateLoadingStatus", { isLoading: true });
          this.buttonFlag = false;
          infoEntry(jsons)
            .then(res => {
              this.$store.commit("updateLoadingStatus", { isLoading: false });
              resolve()
            })
            .catch(err => {
              this.buttonFlag = true;
              this.$store.commit("updateLoadingStatus", { isLoading: false });
              this.$vux.toast.text(err.message, "middle");
              reject()
            });
        } else {
          resolve()
        }
      });
    },
    //油卡验证接口
    $_oilCardCheck() {
      return new Promise((resolve, reject) => {
        //油卡配置开通了要去验证油卡
        if (this.oilCardCfg == 8 || (this.oilCardCfg == 9 && Number(this.prepaymentsOilCard) != "0")) {
          let json = {
            prepaymentsOilCard: Number(this.prepaymentsOilCard) === 0 ? '0' : this.prepaymentsOilCard,
            cartBadgeNo: this.cartBadgeNo,
            belongActSys: this.belongActSys,
            oilCardNo: Number(this.prepaymentsOilCard) === 0 ? "" : this.oilCardNo
          };
          this.buttonFlag = false;
          oilCardCheck(json)
            .then(res => {
              if (res.data.reCode == "0") {
                resolve()
              } else {
                this.$store.commit("updateLoadingStatus", { isLoading: false });
                this.$vux.alert.show({
                  title: "提示",
                  buttonText: "知道了",
                  content: res.data.reInfo
                });
                this.buttonFlag = true;
                reject()
              }
            })
            .catch(err => {
              this.$store.commit("updateLoadingStatus", { isLoading: false });
              this.$vux.toast.text(err.message, "middle");
              this.buttonFlag = false;
              reject()
            });
        } else {
          resolve()
        }
      });
    },
    //走后台接口，提供信息
    sendMessage() {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      let shoukuanrenleixing = "";
      if (this.driverName == this.receiveName) {
        shoukuanrenleixing = "1";
      } else {
        shoukuanrenleixing = "0";
      }
      let json = {
        xid: this.xid, //通用ID
        loadingTonnage:
          this.loadingTonnage == "" ? "0.00" : this.loadingTonnage,
        unloadingTonnage: this.unloadingTonnage,
        loadingAddressName: this.loadingAddressName,
        unloadingAddressName: this.unloadingAddressName,
        taxWaybillId: this.taxWaybillId, //运单ID
        startProvinceId: this.startProvinceCode,
        startCityId: this.startCityCode,
        startCountyId: this.startCountyCode,
        endProvinceId: this.endProvinceCode,
        endCityId: this.endCityCode,
        endCountyId: this.endCountyCode,
        driverName: this.driverName, //司机姓名
        cartBadgeNo: this.cartBadgeNo, //车牌号
        transTrip:
          this.classify == 1 && this.billCycleMode == 8 ? this.transTrip : "", //运输趟次
        goodsName: this.goodsName, //货物名称
        unitPrice: this.isEmptyStr(this.unitPrice) ? "0.00" : this.unitPrice, //运输单价
        userFreight: this.userFreight || "0.00", //运费金额
        wbItem: this.wbItem, //业务项目
        prepayments: this.isEmptyStr(this.prepayments)
          ? "0.00"
          : this.prepayments, //预付现金
        freightChangeReason: this.msg, //修改原因
        klbState: this.klbState, //运输状态
        mobileNo: this.mobileNo, //手机号
        stateCfg: this.stateCfg, //运单跟踪状态
        payType: shoukuanrenleixing, //正常的收款人类型
        payName:
          this.zyCapitalCfg === "8" && this.value2 == "本人收款"
            ? window.sessionStorage.isChooseType === "2"
              ? window.localStorage.getItem("driverName")
              : this.payName
            : window.sessionStorage.isChooseType === "1"
            ? this.reciveMsgPay.recivePersonName
            : "", //收款人姓名
        payIdCard:
          this.zyCapitalCfg === "8" && this.value2 == "本人收款"
            ? ""
            : window.sessionStorage.isChooseType === "1"
            ? this.reciveMsgPay.recivePersonCardNum
            : this.payIdCard, //收款人身份证
        payBankName:
          this.zyCapitalCfg === "8" && this.value2 == "本人收款"
            ? window.sessionStorage.isChooseType === "2"
              ? window.localStorage.getItem("bankName")[0]
              : this.payBankName
            : window.sessionStorage.isChooseType === "1"
            ? this.reciveMsgPay.reciveBank[0]
            : "", //收款人银行名称
        payBankNo:
          this.zyCapitalCfg === "8" && this.value2 == "本人收款"
            ? window.sessionStorage.isChooseType === "2"
              ? window.localStorage.getItem("bankNum")
              : this.payBankNo
            : window.sessionStorage.isChooseType === "1"
            ? this.reciveMsgPay.recivePersonBankNum
            : "", //收款人银行卡号
        payMobileNo:
          this.zyCapitalCfg === "8" && this.value2 == "本人收款"
            ? ""
            : window.sessionStorage.isChooseType === "1"
            ? this.reciveMsgPay.recivePersonphoneNum
            : this.payMobileNo, //收款人手机号
        provinceId:
          this.zyCapitalCfg === "8" && this.value2 == "本人收款"
            ? ""
            : window.sessionStorage.isChooseType === "1"
            ? this.reciveMsgPay.reciveBankAdress[0]
            : this.provinceId, //开户行省份id
        cityId:
          this.zyCapitalCfg === "8" && this.value2 == "本人收款"
            ? ""
            : window.sessionStorage.isChooseType === "1"
            ? this.reciveMsgPay.reciveBankAdress[1]
            : this.cityId, //开户行城市id
        alipayNo:
          this.zyCapitalCfg === "8" && this.value2 == "本人收款"
            ? window.sessionStorage.isChooseType === "2"
              ? window.localStorage.getItem("banalipayNokNum")
              : this.alipayNo
            : window.sessionStorage.isChooseType === "1"
            ? this.reciveMsgPay.alipayNo
            : "", //收款人支付宝账号
        taxWaybillNo: this.classify != "0" ? "" : this.taxWaybillNo, //自有传
        consignor: this.consignor[0],
        drawee: this.drawee,
        taxDraweePartyId: this.taxDraweePartyId
      };
      if (this.classify == '0') {
        let temp = {
          freightIncr: this.isEmptyStr(this.freightIncr)
            ? "0.00"
            : this.freightIncr, //运单增补
          prepaymentsBuyOil: this.isEmptyStr(this.prepaymentsBuyOil)
            ? "0.00"
            : this.prepaymentsBuyOil, //线下油款
          prepaymentsBuyGas: this.isEmptyStr(this.prepaymentsBuyGas)
            ? "0.00"
            : this.prepaymentsBuyGas, //线下气款
          lossFee: this.isEmptyStr(this.lossFee) ? "0.00" : this.lossFee, //运费扣减
          oilCardNo: Number(this.prepaymentsOilCard) === 0
            ? ""
            : this.oilCardNo, //油卡卡号
          prepaymentsOilCard:
            this.prepaymentsOilCard == "" ? "0.00" : this.prepaymentsOilCard, //预付油卡
        }
        json = Object.assign({}, json, temp)
      }
      this.buttonFlag = false; //禁用按钮
      dazongModifyWayBill(json)
        .then(res => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          if (res.data.reCode == "0") {
            this.payState = res.data.result.payState;
            let type = this.typeFilter(this.goodsAmountType);
            let json = {
              taxWaybillId: this.taxWaybillId, //运单号
              type: "3", //1删除 2终结 3修改
              content: {
                taxWaybillNo: this.taxWaybillNo,
                userFreight: (this.userFreight || "0.00") + "元",
                prepayments: this.prepayments,
                cartBadgeNo: this.cartBadgeNo,
                driverName: this.driverName,
                mobileNo: this.mobileNo,
                goodsName: this.goodsName,
                unitPrice: this.unitPrice + `元/${type}`,
                unloadingTonnage: this.unloadingTonnage + `${type}`,
                startPlace: res.data.result.startPlace,
                endPlace: res.data.result.endPlace,
                supplyChainLogo:
                  this.supplyChainState == "8" &&
                  Number(this.prepaymentsOilCard) > "0"
                    ? 1
                    : 0
              }
            };
            AppUpdateWaybillData(json);
            this.buttonFlag = true;
            this.userFreight = this.userFreight ? this.userFreight : "0.00";
         
            let temp = Number(this.prepaymentsOilCard) + Number(this.prepayments);
            if (
              (this.payState == "0" || this.payState == "5") 
              && (this.bdState === "1" || (this.bdState === "0" && temp > 0 )) 
              && this.xyState === "1" 
              && Number(this.userFreight) > 0
            ) {
              this.$_getPrepaymentsOilCardNotPaid().then(() => {
                this.$vux1.confirm.show({
                  title: "提示",
                  confirmText: "确认",
                  cancelText: "取消",
                  content: "保存成功，是否立即申请支付？",
                  onConfirm: () => {
                    this.payPopupShow = true;
                  },
                  onCancel: () => {
                    this.goBack();
                  }
                });
              })
            } else {
              this.$vux.toast.text(res.data.reInfo, "middle");
              this.goBack();
            }
          } else {
            this.$vux.alert.show({
              title: "提示",
              buttonText: "知道了",
              content: res.data.reInfo
            });
            this.buttonFlag = true;
          }
        })
        .catch(err => {
          this.buttonFlag = true;
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          this.$vux.toast.text(err.message, "middle");
        });
    },
    goBack() {
      //修改成功跳转到详情页
      setTimeout(() => {
        if (this.$route.query.type === "1") {
          this.$router.replace({
            // path: "/waybillDetail",
            path:"/bulkWaybillDetail",
            query: {
              taxWaybillId: this.taxWaybillId,
              xid: this.xid
            }
          });
        } else {
          this.$router.go(-1);
        }
      }, 100);
    },
    cancelPay() {
      this.payPopupShow = false;
    },
    submitPay() {
      this._isCanToPay().then(() => {
        this.$router.push({
          path: "/wbsApplyPay",
          query: {
            taxWaybillId: this.taxWaybillId,
            type: "1"
          }
        });
      });
    },
    _isCanToPay() {
      return new Promise((resolve, reject) => {
        this.$store.commit("updateLoadingStatus", { isLoading: true });
        isCanToPay({ taxWaybillId: this.taxWaybillId })
          .then(res => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode == "0") {
              resolve();
            } else {
              this.$vux.toast.text(res.data.reInfo, "middle");
            }
          })
          .catch(err => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.$vux.toast.text(err.message, "middle");
            reject();
          });
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
            resolve(res.data.reCode); //res.data.reCode
          })
          .catch(err => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            resolve("1");
          });
      });
    },
    //始发城市赋值
    startValue: function() {
      var CodeArr = this.value3;
      this.startProvinceCode = CodeArr[0];
      this.startCityCode = CodeArr[1];
      this.startCountyCode = CodeArr[2];
    },
    //目的城市赋值
    endValue: function() {
      var CodeArr = this.value4;
      this.endProvinceCode = CodeArr[0];
      this.endCityCode = CodeArr[1];
      this.endCountyCode = CodeArr[2];
    },
    //切换趟次
    changeType(val) {
      this.items1Value = val;
      if (val == 1 || val == "") {
        this.src2 = this.src3;
        this.src1 = this.src4;
        this.transTrip = 1;
      } else {
        this.src1 = this.src3;
        this.src2 = this.src4;
      }
    },
    //切换受票方的值
    taxDraweeChange(val) {
      this.draweeArr = val;
      this.drawee = this.draweeArr[0];
      if (this.draweeList[0] != undefined) {
        for (let i = 0; i < this.draweeList[0].length; i++) {
          if (this.draweeList[0][i] == val[0]) {
            this.taxDraweePartyId = this.taxDraweePartyIdArr[i];
          }
        }
      }
    },
    // //点击的时候，展示一次受票方
    showDrawee() {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      getDrawee({}).then(resp => {
        this.$store.commit("updateLoadingStatus", { isLoading: false });
        let data = resp.data.result;
        if(data.length > 0){
          if (resp.data.reCode == 0) {
            let value = [];
            this.draweeList = [];
            for (let i = 0; i < data.length; i++) {
              this.taxDraweePartyIdArr.push(data[i].taxDraweePartyId);
              value.push(data[i].drawee);
            }
            this.draweeList.push(value);
          } else {
            this.$vux.toast.text(resp.data.reInfo, "middle");
          }
        }
      }).catch(err => {
        this.$store.commit("updateLoadingStatus", { isLoading: false });
      });
    },
    //点击收款人信息,跳转页面
    receiveBill() {
      if (this.zyCapitalCfg === "8" && this.value2 == "本人收款") {
        this.$router.push({
          path: "/webReciveMsg2",
          query: {
            mobileNo: this.mobileNo,
            driverName: this.driverName,
            payName: this.driverName,
            cartBadgeNo: this.cartBadgeNo,
            payBankName: this.payBankName,
            payBankNo: this.payBankNo,
            alipayNo: this.alipayNo,
            isModifyElements: this.isModifyElements //判断是否做过四要素验证的标志
          }
        });
      } else {
        this.$router.push("/webReciveMsg");
        //返回路由过后，改变 value  为 已填写
      }
    },
    //点击展开、关闭按钮
    showOrHide(type) {
      if (this.showControl[type]) {
        this.$set(this.showControl, type, 0);
      } else {
        this.$set(this.showControl, type, 1);
      }
    },
    //自定义去前后空格的方法
    trim: function(i) {
      //   return i.toString().replace(/(^\s*)|(\s*$)/g, "");
      return i.toString().replace(/\s/g, "");
    },
    //非空验证通用方法
    isEmptyStr: function(str) {
      var pat = /^[\s]*$/;
      if (undefined == str || "" == str || null == str || pat.test(str)) {
        return true;
      }
      return false;
    },
    // 过滤货物类型
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
    },
    //点击跳转到油卡选择页面
    gotoSelectOilCard(item) {
      if (
        this.payState === "2" ||
        this.payState === "3" ||
        this.payState === "1" ||
        this.payState === "6" ||
        this.payState === "7"
      ) {
        return;
      }
      this.$router.push({
        path: "/chooseOilCard",
        query: {
          belongActSys: this.belongActSys,
          prepaymentsOilCard: item,
          cartBadgeNo: this.cartBadgeNo,
          driverName: this.driverName,
          mobileNo: this.mobileNo
        }
      });
    },
    //3018通过运单号判断运单是否重复
    $_waybillRepeatCheck(item) {
      return new Promise((resolve, reject) => {
        waybillRepeat(item)
          .then(res => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode == '0') {
              resolve();
            } else {
              this.$vux.toast.text(res.data.reInfo, "middle");
              reject();
            }
            this.buttonFlag = true;
          })
          .catch(err => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.$vux.toast.text(err.message, "middle");
            this.buttonFlag = true;
            reject();
          });
      });
    },
    //  3054-判断运单是否已支付完成预付油卡
    $_getPrepaymentsOilCardNotPaid() {
      return new Promise((resolve, reject) => {
        this.$store.commit("updateLoadingStatus", { isLoading: true });
        getPrepaymentsOilCardNotPaid({taxWaybillId: this.taxWaybillId})
          .then(res => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode == '0') {
              this.prepaymentsOilCardNotPaid = res.data.result.prepaymentsOilCardNotPaid;
              resolve();
            } else {
              this.$vux.toast.text(res.data.reInfo, "middle");
              reject();
            }
          })
          .catch(err => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.$vux.toast.text(err.message, "middle");
            reject()
          });
      });
    },
    //司机手机号码栏位失焦点后，先查询回款宝在查询下一个接口
    _onblur(val) {
      debugger
      if (this.mobileNoRawData !== this.mobileNo && this.isEleOil == "0") {
        this.oilCardNo = "";
      }
    },
    f(s, r) {
      var q, p, o, u;
      try {
        q = s.toString().split(".")[1].length;
      } catch (t) {
        q = 0;
      }
      try {
        p = r.toString().split(".")[1].length;
      } catch (t) {
        p = 0;
      }
      o = Math.pow(10, Math.max(q, p));
      u = q >= p ? q : p;
      return parseFloat(((s * o - r * o) / o).toFixed(u));
    },
    d(r, q) {
      var p, o, n;
      try {
        p = r.toString().split(".")[1].length;
      } catch (s) {
        p = 0;
      }
      try {
        o = q.toString().split(".")[1].length;
      } catch (s) {
        o = 0;
      }
      n = Math.pow(10, Math.max(p, o));
      return parseFloat(((r * n + q * n) / n).toFixed(Math.max(p, o)));
    },
  }
};
</script>

<style lang="less">
.modify-waybill {
  width: 100%;
  text-align: left;
  background-color: #efefef;
  position: absolute;
  top: 0px;
  min-height: 100%;
  height: auto;
  .img1 {
    width: 8px;
    height: 8px;
  }
  .img2 {
    width: 15px;
    height: 15px;
  }
  .img3 {
    width: 20px;
    height: 20px;
  }
  .danwei {
    color: #202020;
  }
  .weui-cell {
    @media screen and (max-width: 320px) {
      font-size: 15px;
    }
  }
  .vux-cell-value {
    color: #202020 !important;
    -webkit-text-fill-color: #202020 !important;
    -webkit-opacity: 1;
    opacity: 1;
  }
  .vux-datetime {
    p {
      color: #797979;
    }
  }
  .weui-cell__hd {
    color: #797979;
  }
  .group1 {
    .vux-cell-disabled .vux-label {
      color: #797979;
    }
    .demo1-item-selected {
      color: #1581cf;
    }
    .selected {
      color: #1581cf;
    }
    .demo2-item-selected {
      background: #1581cf;
    }
    .input-sty {
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
  .group2 {
    .vux-cell-bd {
      color: #797979;
    }
    .weui-cell__ft {
      color: #202020;
    }
    .vux-popup-header {
      background-color: #15499a;
      color: #fff;
      .vux-popup-header-left {
        color: #fff;
      }
      .vux-popup-header-title {
        color: #fff;
      }
      .vux-popup-header-right {
        color: #fff;
      }
    }
    .car-msg-choose {
      width: 100%;
      min-height: 56px;
      height: auto;
      display: flex;
      flex-wrap: wrap;
      background-color: #fff;
      .car-choose-btn {
        width: 30%;
        text-align: center;
        height: 2rem;
        line-height: 2rem;
        border-radius: 0.3125rem;
        color: #797979;
        background: #f6f6f6;
        margin: 0.625rem 0.3rem;
      }
      .choose-btn-active {
        background-color: #1581cf;
        color: #fff;
      }
    }
    .self-ipt {
      font-size: 16px;
      color: #797979;
      display: block;
      height: 36px;
      padding-left: 6px;
      background: #fff;
      padding-bottom: 10px;
      input {
        font-size: inherit;
        color: #797979;
        width: 65%;
        height: 32px;
        line-height: 32px;
        border: 1px solid #d9d9d9;
        margin-left: 2.4%;
        text-indent: 5px;
        outline: none;
        background: #f6f6f6;
      }
    }
  }
  .group3 {
    .weui-cell__hd {
      color: #797979;
    }
    .weui-cell__ft {
      color: #202020;
    }
    .vux-cell-disabled {
      .weui-cell__ft {
        color: #888;
      }
    }
    .vux-tap-active:active {
      background-color: #fff;
    }
    .vux-cell-disabled .vux-label {
      color: #797979;
    }
    .demo1-item {
      border: 1px solid #ececec;
      padding: 5px 5px;
      border-radius: 19px;
      text-align: center;
      width: 25%;
    }
    .demo1-item-selected {
      color: #fff;
      background: #1581cf;
    }
    .weui-cell_access .weui-cell__ft {
      width: 60%;
    }
    // .weui-cell__bd input{
    // 	-webkit-appearance: none;
    // 	width: 5em;
    // 	text-indent: 2px;
    // 	border: 0;
    // 	font-size: 16px;
    // 	background: #f6f6f6;
    // 	border: 1px solid #dfdfdf;
    // 	height: 1.5em;
    // 	outline: none;
    // }
    // .input-sty {

    // }
  }
  .group4 {
    .weui-cell__hd {
      color: #202020;
    }
  }
  .show-or-hide {
    .img-icon {
      transition: transform 0.3s, -webkit-transform 0.3s;
    }
    .shouQi {
      transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0) rotate(-45deg);
    }
    .zhanKai {
      transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0) rotate(-225deg);
    }
  }
  .slide {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.5s cubic-bezier(0, 1, 0, 1) -0.1s;
  }
  .animate {
    max-height: 9999px;
    transition: max-height 1s cubic-bezier(0, 1, 0, 1) -0.1s;
    transition-delay: 0s;
  }

  .weui-cell__ft {
    text-align: left !important;
  }
  .weui-cell:before {
    left: 0px;
  }
  .weui-cell:first-child:before {
    display: inline;
  }
  .vux-popup-picker-select-box {
    .vux-popup-picker-select {
      text-align: left !important;
    }
  }
  .demo2-item {
    background: #bebebe;
    padding: 0 4px;
    margin: 2px;
    border-radius: 6px;
    color: #fff;
  }
  .button {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background: #fff;
    z-index: 10;
  }
  .weui-btn_primary {
    background-color: #15499a !important;
    margin: 10px auto;
    width: 90% !important;
  }
  .not-active {
    color: #797979;
  }

  .pay_container {
    .title {
      background: #15499a;
      color: #fff;
      height: 45px;
      line-height: 45px;
      font-size: 18px;
      text-align: center;
    }
    .content {
      padding: 20px;
      padding-bottom: 0;
      ul {
        padding-bottom: 10px;
        border-bottom: 1px solid rgba(223, 223, 223, 1);
      }
      ul li {
        font-size: 15px;
        color: #797979;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        // line-height: 1.6;
        .label {
          width: 80px;
          height: 24px;
          text-align: justify;
          text-align-last: justify;
          display: inline-block;
          // display: flex;
          // flex-direction: column;
          &:after {
            display: inline-block;
            content: "";
            overflow: hidden;
            width: 100%;
            height: 0;
          }
        }
        .value {
          padding-left: 5px;
          color: #202020;
        }
        .jiantou {
          width: 14px;
          height: 6px;
          margin: 0 5px;
        }
      }
      .adress {
        color: #121212;
        font-size: 16px;
      }
      .bottom {
        padding: 10px 0;
      }
      .money {
        display: flex;
        color: #ffba00;
      }
      .prepay {
        display: flex;
        color: #797979;
        .value {
          padding-left: 5px;
          color: #202020;
        }
      }
    }
    .botton_box {
      border-top: 1px solid rgba(223, 223, 223, 1);
      padding: 10px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      .btn {
        width: 110px;
        height: 40px;
        line-height: 40px;
        border: 1px solid rgba(21, 73, 154, 1);
        background: #fff;
        color: #15499a;
        border-radius: 7px;
        margin: 0 25px;
      }
      .submit {
        background: #15499a;
        color: #fff;
      }
    }
  }
}
</style>
