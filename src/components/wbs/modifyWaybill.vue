<template>
  <div class="modify-waybill">
    <c-header>
      <x-header :left-options="{ backText: '' }">修改运单</x-header>
    </c-header>
    <div v-show="loadingFlag === true">
      <group label-width="6.5em" label-align="right" class="group1">
        <cell title="运单信息" @click.native="showOrHide(0)">
          <span class="show-or-hide">
            <img
              src="../../assets/imgs/wbs/shouqi_icon2@2x.png"
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
            <x-input title="运 单 号：" v-model="taxWaybillNo" :max="128">
              <div slot="label" style="text-align:right;width:6.5em;">
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
            <popup-picker
              title="始发城市："
              :data="cityList"
              :columns="3"
              v-model="value3"
              show-name
              @on-hide="startValue"
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
                    style="font-size:20px;vertical-align:middle;"
                    class="img1"
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
              disabled
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
                  <span style="vertical-align:middle;">目的城市：</span>
                </span>
              </template>
            </popup-picker>
            <x-input title="货物名称：" v-model="goodsName" type="text">
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
            <x-input title="货物数量：" v-model="goodsAmount" :show-clear="false" type="number">
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
                >
                  <checker-item
                    :value="item"
                    v-for="(item, index) in items2"
                    :key="index"
                  >{{ item.value }}</checker-item>
                </checker>
              </div>
            </x-input>
            <x-input title="运输单价：" v-model="unitPrice" type="number"></x-input>
            <x-input
              title="起运时间："
              placeholder="请填写预计发车时间"
              type="text"
              :readonly="true"
              @click.native="!(!timeState || state == '1' || state == '2' || klbState == '1') ? (showPicker = true) : ''"
              v-model="startTime"
            >
              <div
                slot="right"
                v-if="!(!timeState || state == '1' || state == '2' || klbState == '1')"
              >
                <i class="iconfont iconarr-right"></i>
              </div>
            </x-input>
            <div class="weui-cell" v-show="this.billCycleMode == '8'">
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
              <label for v-show="items1Value == 2">
                <input pattern="\d*" class="input-sty" v-model="transTrip" />&nbsp;&nbsp;
                <span>趟</span>
              </label>
            </div>
            <x-input
              title="业务项目："
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
              v-model="drawee"
              @on-change="taxDraweeChange"
              @on-hide="hideDrawee"
              @on-show="showDrawee"
              v-show="loginState == '0'"
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
              v-show="relatedShipper ||  relatedList && relatedList.length > 0"
            ></popup-picker>
            <popup-picker
              title="承运项目："
              :data="carrierProjectArr"
              v-model="carrierProject"
              placeholder="请选择"
              v-show="!(this.report003Cfg == '2' && this.carrierProject.length == '0' && this.carrierProjectShow == false)"
              :disabled="!carrierProjectState"
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
                  <span style="vertical-align:middle;">承运项目：</span>
                </span>
              </template>
            </popup-picker>
            <x-textarea title="运输要求：" placeholder="请输入您对本次运输的要求" :max="64" v-model="requirement"></x-textarea>
          </div>
        </transition>
      </group>
      <group label-width="6.5em" label-align="right" class="group2">
        <cell title="承运信息" @click.native="showOrHide(1)">
          <span class="show-or-hide">
            <img
              src="../../assets/imgs/wbs/shouqi_icon2@2x.png"
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
            <cell>
              <span slot="icon">
                <img
                  src="../../assets/imgs/wbs/zhuyi_icon_yellow@2x.png"
                  alt
                  width="20"
                  height="20"
                  style="float:left;margin-right:8px;"
                  class="img3"
                />
                <p style="font-size:14px;color:#FFBA00">为保证运输协议规范有效，请务必准确填写司机手机号和司机姓名。协议生成后不可修改！!</p>
              </span>
            </cell>
            <x-input
              title="司机手机："
              :disabled="driverMsg === '1' ? true : false"
              v-model.trim="mobileNo"
              is-type="china-mobile"
              :max="11"
              type="tel"
              @on-blur="_onblur()"
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
                <span style="vertical-align:middle;">司机手机：</span>
              </div>
            </x-input>
            <x-input
              title="司机姓名："
              :disabled="(driverMsg === '1' ? true : false) || Boolean(Number(this.isModifyName)) || nameDisabled"
              v-model.trim="driverName"
              type="text"
              :max="64"
              @on-blur="driverNameChange"
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
                <span style="vertical-align:middle;">司机姓名：</span>
              </div>
            </x-input>
            <cell title="车牌号码：" value-align="left" is-link type="text" @click.native="carNumIpt">
              <span :class="{ 'not-active': payState === '2' }">{{ cartBadgeNo }}</span>
              <div slot="title" style="text-align:right;width:6.5em;">
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
            <cell value-align="left" is-link @click.native="show1 = true">
              <span>{{ carType }}</span>
              <div slot="title" style="text-align:right;width:6.5em;">
                <img
                  :src="bitian"
                  alt
                  width="8"
                  height="8"
                  style="font-size:20px;vertical-align:middle;"
                  class="img1"
                />
                <span style="vertical-align:middle;">车&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型：</span>
              </div>
            </cell>
            <cell value-align="left" is-link @click.native="show2 = true">
              <span>{{ carLength }}</span>
              <div slot="title" style="text-align:right;width:6.5em;">
                <img
                  :src="bitian"
                  alt
                  width="8"
                  height="8"
                  style="font-size:20px;vertical-align:middle;"
                  class="img1"
                />
                <span style="vertical-align:middle;">车长(米)：</span>
              </div>
            </cell>
            <cell value-align="left" is-link @click.native="show3 = true">
              <span>{{ carTonNumber }}</span>
              <div slot="title" style="text-align:right;width:6.5em;">
                <img
                  :src="bitian"
                  alt
                  width="8"
                  height="8"
                  style="font-size:20px;vertical-align:middle;"
                  class="img1"
                />
                <span style="vertical-align:middle;">吨位(吨)：</span>
              </div>
            </cell>
            <x-textarea title="备注：" placeholder="请填写备注信息" :max="64" v-model="note"></x-textarea>
            <!-- 车型固定 -->
            <actionsheet v-model="show1" :menus="menus1" @on-click-menu="carTypeBtn"></actionsheet>
            <popup v-model="show15" position="bottom">
              <popup-header
                left-text="取消"
                right-text="确定"
                @on-click-left="show15 = false"
                @on-click-right="cartTypeBtn()"
                title="更多车型"
              ></popup-header>
              <div class="car-msg-choose">
                <div
                  class="car-choose-btn"
                  :class="{ 'choose-btn-active': activeFlag3 === index }"
                  @click="activeFlag3 = index"
                  v-for="(item, index, key) in cartType"
                  :key="key"
                >{{ item.type }}</div>
              </div>
            </popup>
            <popup v-model="show2" position="bottom" max-height="80%">
              <popup-header
                left-text="取消"
                right-text="确定"
                @on-click-left="show2 = false"
                @on-click-right="carLongBtn()"
                title="请选择车长(米)"
              ></popup-header>
              <div class="car-msg-choose">
                <div
                  class="car-choose-btn"
                  :class="{ 'choose-btn-active': activeFlag === index }"
                  @click="activeFlag = index"
                  v-for="(item, index, key) in carLongList"
                  :key="key"
                >{{ item.cartAttr }}米</div>
              </div>
              <!-- <div class="self-ipt">手动输入</div> -->
              <!-- <div style="height:32px;"></div> -->
              <!-- 新添加的手动输入车长 -->
              <div class="self-ipt">
                <span>其他：</span>
                <input type="number" placeholder="请输入车长" v-model="carLen" @click="activeFlag = -1" />
                <span>米</span>
              </div>
            </popup>

            <popup v-model="show3" position="bottom" max-height="80%">
              <popup-header
                left-text="取消"
                right-text="确定"
                @on-click-left="show3 = false"
                @on-click-right="carTonBtn()"
                title="请选择车吨位(吨)"
              ></popup-header>

              <div class="car-msg-choose">
                <div
                  class="car-choose-btn"
                  :class="{ 'choose-btn-active': activeFlag1 === index }"
                  @click="activeFlag1 = index"
                  v-for="(item, index, key) in carTonList"
                  :key="key"
                >{{ item.cartAttr }}吨</div>
              </div>
              <!-- 新添加的手动输入吨位 -->
              <div class="self-ipt">
                <span>其他：</span>
                <input type="number" placeholder="请输入吨位" v-model="carTon" @click="activeFlag1 = -1" />
                <span>吨</span>
              </div>
              <!-- <div style="height:32px;"></div> -->
            </popup>
          </div>
        </transition>
      </group>
      <group label-width="6.5em" label-align="right" class="group3">
        <cell title="结算信息" @click.native="showOrHide(2)">
          <span class="show-or-hide">
            <img
              src="../../assets/imgs/wbs/shouqi_icon2@2x.png"
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
            <cell title="付款方式：" value-align="left" v-show="advancePayState && collectTwoCfg == '8'">
              <span slot="value" v-if="advancePayState == '1'">供应链金融 (结算保障)</span>
              <span slot="value" v-else>企业自付</span>
            </cell>
            <x-input
              title="运费金额："
              v-model.trim="userFreight"
              :disabled="payState === '2' || payState === '3' || payState === '1' || payState === '6' || payState === '7' ? true : false"
              @on-blur="arriveBlur"
              type="number"
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
                <span style="vertical-align:middle;">运费金额：</span>
              </div>
            </x-input>
            <x-input
              title="预付油卡："
              placeholder="请填写预付油卡"
              type="number"
              :disabled="payState === '2' || payState === '3' || payState === '1' || payState === '6' || payState === '7' ? true : false"
              v-model.trim="prepaymentsOilCard"
              v-show="prepaymentsOilCardShow"
              @on-blur="arriveBlur"
              ref="oilcardVal"
            ></x-input>
            <cell
              title="油卡卡号："
              is-link
              v-model.trim="oilCardNo"
              v-show="prepaymentsOilCard != '' && prepaymentsOilCard != 0 && /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/.test(prepaymentsOilCard)"
              @click.native="gotoSelectOilCard(prepaymentsOilCard)"
              :disabled="payState === '2' || payState === '3' || payState === '1' || payState === '6' || payState === '7' ? true : false"
            >
              <div
                slot="value"
                style="color:#757575;text-align: left;"
                v-show="oilCardNo == ''"
              >请选择卡号</div>
            </cell>
            <x-input
              title="货值："
              type="number"
              v-model.trim="goodsCost"
              @on-blur="inputBlur()"
              placeholder="请填写实际货值"
              :show-clear="false"
              v-if="priceInsuranceCfg == '8'"
              :disabled="goodsCostState == '1'"
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
                <span style="vertical-align:middle;">货值：</span>
              </div>
            </x-input>
            <x-input
              title="保价费："
              placeholder="请填写保价费"
              type="number"
              :value="insFee"
              disabled
              v-show="priceInsuranceCfg == '8'"
            ></x-input>
            <x-input
              title="运费扣减："
              type="number"
              v-model.trim="lossFee"
              :disabled="
                payState === '2' || payState === '3' || payState === '1' || payState === '6' || payState === '7' || confirmState === '1' ? true : false
              "
              @on-blur="arriveBlur"
            ></x-input>
            <x-input
              title="运费增补："
              type="number"
              v-model.trim="freightIncr"
              :disabled="
                payState === '2' || payState === '3' || payState === '1' || payState === '6' || payState === '7' || confirmState === '1' ? true : false
              "
              @on-blur="arriveBlur"
            ></x-input>
            <x-input
              title="预付现金："
              type="number"
              v-model.trim="prepayments"
              :disabled="
                payState === '2' || payState === '3' || payState === '1' || payState === '6' || payState === '7' || confirmState === '1' ? true : false
              "
              @on-blur="arriveBlur"
              v-show="!prepaymentsState"
            ></x-input>
            <x-input
              title="线下油款："
              type="number"
              v-model.trim="prepaymentsBuyOil"
              :show-clear="false"
              v-show="prepaymentsBuyOilShow"
              @on-blur="arriveBlur"
            ></x-input>
            <x-input
              title="线下气款："
              type="number"
              v-model.trim="prepaymentsBuyGas"
              :show-clear="false"
              v-show="prepaymentsBuyGasShow"
              @on-blur="arriveBlur"
            ></x-input>
            <x-input
              title="线下路桥费："
              type="number"
              v-model.trim="prepaymentsBuyEtc"
              :show-clear="false"
              v-show="existsAvaibleOilStation == '1' || Number(prepaymentsBuyEtc) > 0"
              @on-blur="arriveBlur"
            ></x-input>
            <x-input
              type="number"
              title="到付金额："
              v-model.trim="arrivePay"
              @on-blur="arriveBlur"
              disabled
            ></x-input>
            <x-input
              title="回单押金："
              v-model.trim="backFee"
              :disabled="
                payState === '2' || payState === '3' || payState === '1' || payState === '6' || payState === '7' || confirmState === '1' ? true : false
              "
              @on-blur="arriveBlur"
              v-show="!backFeeState"
              type="number"
            ></x-input>
            <x-input
              title="定金："
              type="number"
              v-model.trim="deposit"
              v-show="depositState"
              placeholder="请填写定金"
            ></x-input>
            <x-input
              title="推广费："
              type="number"
              v-model.trim="promotionFee"
              v-show="promotionFeeState"
              placeholder="请填写推广费"
            ></x-input>
            <x-input
              title="应收回款："
              type="number"
              v-model.trim="receivablePayback"
              v-show="receivablePaybackState"
              placeholder="请填写应收回款"
            ></x-input>
          </div>
        </transition>
      </group>
      <div class="footer" style="height:10px;"></div>
      <ReciveComponent
        ref="reciver"
        :advancePayState="advancePayState"
        :SYSInfo="SYSInfo"
        :cartBadgeNo="cartBadgeNo"
        :driverName="driverName"
        :mobileNo="mobileNo"
        :payName="payName"
        :capWalletFalg="capWalletFalg"
      ></ReciveComponent>
      <div class="footer" style="height:5rem;"></div>
      <div class="button" v-show="buttonshow">
        <x-button type="primary" :disabled="!buttonFlag" @click.native="clickConfirm">保存</x-button>
      </div>
    </div>
    <van-popup v-model="showPicker" position="bottom">
      <van-datetime-picker
        type="datetime"
        :min-date="startDate"
        :formatter="formatter"
        @confirm="confirmDate"
        @cancel="showPicker = false"
      />
    </van-popup>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { DatetimePicker, Popup } from "vant";
import {
  //   getCarLongOrTon,
  queryWaybillChange,
  checkCommonCity,
  waybillRepeat,
  checkFee,
  reWriteWaybill,
  supplyChainState,
  phoneGetName,
  getDrawee,
  getCarrierProject,
  getCompanyConfig,
} from "../../api/api.js";
import { cityDataToIWant } from "../../utils/cMethods";
import { divide, multiply, subtract, add } from "../../utils/calc";
import { AppUpdateWaybillData, AppFinish } from "../../utils/app.js";
import { infoEntry, getCarMasterInfo } from "../../api/applyPay.js";
import {
  oilCardCheck,
  // openElectronicOilCard,
  queryOilCardType,
} from "../../api/apiOil.js";
import { setTimeout } from "timers";

import ReciveComponent from "./components/ModeifyReciveCom";
import { HYB_RECIVE, YHK_RECIVE, HYB_WALLET } from "./components/const";
import { getPayTypeAndHkbPayeeType } from "./components/utils";
export default {
  name: "modifyWaybill",
  components: {
    ReciveComponent,
    vanDatetimePicker: DatetimePicker,
    vanPopup: Popup,
  },
  data() {
    return {
      buttonshow: false, //
      buttonFlag: false, //初始按钮不可以点击
      startPlaceModifyCfg: "4",
      endCfg: "4",
      payState: "", // 支付状态，用来判断某些选项不给更改输入
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
      state: "", //业务记录状态   0 未追踪 1 跟踪中  2 已终结
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
      unitPrice: "", //运输价格
      startTime: "", //起运时间
      startDate: "", //开始时间
      endDate: "", //结束时间
      // minHour: 0, //最小小时
      timeState: true, //时间选择是否禁用
      items1Value: "1",
      transTrip: "", //趟次
      wbItem: "", //业务项目
      list3: [],
      drawee: [], //受票方名称
      //   draweeArr: [], //受票方名称数组
      taxDraweePartyId: "", //受票方ID
      taxDraweePartyIdArr: [], //受票方ID集合
      loginState: "", //受票方状态
      requirement: "", //承运要求
      //第二部分
      show1: false,
      show2: false,
      show3: false,
      show15: false,
      activeFlag: -1,
      carLongList: [
        { cartAttr: "4.2" },
        { cartAttr: "6.8" },
        { cartAttr: "8.7" },
        { cartAttr: "9.6" },
        { cartAttr: "13" },
        { cartAttr: "17.5" },
      ],
      carTonList: [
        { cartAttr: "8" },
        { cartAttr: "15" },
        { cartAttr: "20" },
        { cartAttr: "25" },
        { cartAttr: "30" },
        { cartAttr: "35" },
      ],
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
      driverNameNoRawData: "",
      carType: "", //车型
      carLength: "", //车长
      carTonNumber: "", //吨位
      menus1: {
        menu1: "厢式",
        menu2: "半挂",
        menu3: "高低板",
        menu4: "更多>>",
      },
      carLen: "", //输入的车长
      carTon: "", //输入的吨位
      cartType: [
        //更多车型
        { type: "平板" },
        // {type:'厢式'},
        { type: "低栏" },
        { type: "中栏" },
        { type: "高栏" },
        { type: "集装箱" },
        { type: "自卸" },
        { type: "开顶厢" },
        { type: "冷藏车" },
        { type: "危险品" },
        { type: "其他" },
      ],
      driverMsg: "0",
      //第三部分

      allFreight: "", //司机的运费金额
      userFreight: "", //用户输入的运费金额
      prepayments: "", //预付现金
      prepaymentsBuyOil: "", //线下油款
      prepaymentsBuyGas: "", //线下气款
      prepaymentsBuyEtc: "", //线下路桥费
      backFee: "", //回单押金
      freightIncr: "", //运费增补
      lossFee: "", //运费扣减
      note: "", //备注
      showControl: [0, 0, 1],
      lossInvoiceCfg: "",
      //第四部分
      value1: "",

      payType: "", //收款人类型
      payName: "", //收款人姓名
      payIdCard: "", //收款人身份证
      payBankName: "", //收款人银行名称
      payBankNo: "", //收款人银行卡号

      payMobileNo: "", //收款人手机号
      provinceId: "", //开户行省份ID
      cityId: "", //开户行城市ID
      alipayNo: "", //收款人支付宝账号

      reciveMsgs: {
        reciveType: "",
        recivePersonName: "", //收款人姓名
        recivePersonCardNum: "", //收款人身份证号
        reciveBank: "", //收款人银行名称
        recivePersonBankNum: "", //收款人银行卡号
        recivePersonphoneNum: "", //收款人手机号
        provinceId: "",
        cityId: "",
        reciveBankAdress: "", //收款人银行地址
        alipayNo: "", //支付宝账号
      }, // 收款人信息集合
      //查出来的收款人信息
      name: "",
      idCard: "",
      phoneNumber: "",
      aliNum: "",
      SYSInfo: {}, // 以上集合

      invoiceState: "", //开票状态
      confirmState: "", //运输结束确认状态
      billCycleMode: "", //结算周期
      businessItems: "", //业务项目配置
      maxAllFreight: "", //最大运费金额
      existsAvaibleGasStation: "", //线下气款判断
      existsAvaibleEtcStation: "", //线下路桥费判断
      existsAvaibleOilStation: "", //线下油款判断
      yetBuyOilNotInvoice: "", //累计购油未开票金额
      yetBuyEtcNotInvoice: "", //累计购ETC未开票金额
      yetBuyGasNotInvoice: "", //企业累计购气未开票金额
      yetPrepaymentsBuyOil: "",
      yetPrepaymentsBuyEtc: "",
      yetPrepaymentsBuyGas: "",
      oilCardCfg: "",
      etcCardCfg: "",
      oilCardPayUpperCfg: "",
      paidAllFreight: "", //已付运费
      arrivePay: "0.00", //到付金额
      yetLossFee: "", //已支付货损金额
      prepaymentsEtcCard: "0.00",
      prepaymentsOilCard: "0.00",
      prepaymentsOilCarded: "0.00",
      prepaymentsEtcCarded: "0.00",
      insType: "", //保险类型
      insState: "", //投保状态
      freightChangeReasonCfg: "",
      msg: "", //修改原因
      //提取公共正则
      reg: /^([1-9]\d{0,6}|0)([\.]\d{0,4})?$/,
      Reg: /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/,

      //   screenHeight: document.documentElement.clientHeight,
      //   minHeight: "",
      cityIdArr: [],
      loadingFlag: false,

      cityIdArr: [],
      types: "", //判断始发还是目的城市的标志

      oilCardNo: "", //油卡卡号
      belongActSys: "", //所属账户体系
      goodsCostState: "", //货值可修改配置项
      priceInsuranceCfg: "", //货值打开关闭的配置项
      goodsCost: "", //货值(保价费需要)
      insFee: "0.00", //保价费
      priceInsuranceRate: "", //保价费率

      supplyChainState: "", //供应链金融配置

      show10: false,
      menus2: {
        menu1: "好运宝收款",
        menu2: "银行卡收款",
      },
      value2: "请选择收款方式",
      zyCapitalCfg: "", //回款宝配置
      hybWalletCfg: "", //好运宝钱包配置
      driverFinanceCfg: "", // 司机金融配置
      driverFinanceProportionCfg: "", // 司机金融最高配比

      nameDisabled: false, //默认司机姓名可以修改
      isModifyElements: "", //0：可修改 1：不可修改
      isModifyName: "", //0：可修改 1：不可修改
      isEleOil: "", //是否是电子油卡 0：是 1：否

      carrierProjectState: true, //承运项目的状态
      carrierProjectArr: [], //承运项目集合
      carrierProject: [], //承运项目
      carrierProjectShow: true,
      deposit: "", //定金
      promotionFee: "", //推广费
      receivablePayback: "", //应收回款
      report003Cfg: "",
      depositCfg: "", //定金配置
      promotionFeeCfg: "", //推广费配置
      receivablePaybackCfg: "", //应收回款配置
      depositState: true,
      promotionFeeState: true,
      receivablePaybackState: true,
      backFeeState: true,
      prepaymentsState: true,
      showPicker: false,
      advancePayState: "", // 付款方式
      collectTwoCfg: "", // 到付金2配置
      collectTwoPreCashCfg: "",
      collectTwoRecDepositCfg: "",
      collectionFlagCfg: "",
      capWalletFalg: "", // 车队长钱包标识
      orgCfg726: "",
      orgCfg710: "",

      relatedShipper:"", //3017返回的货主
      relatedList: "", //货主关联配置
      cargoOwnerArr: [], // 货主集合
      cargoOwner: [], // 货主
      prepaymentsOilCardShow: false, // 预付油卡显示
      prepaymentsBuyOilShow: false, // 线下油款显示
      prepaymentsBuyGasShow: false, // 线下气款显示
    };
  },
  beforeRouteEnter(to, from, next) {
    if (from.name == "chooseOilCard" || from.name == "addOilCard") {
      next((vm) => {
        vm.$store.commit("updateLoadingStatus", { isLoading: false });
        if (window.localStorage.getItem("oilCardNo") != null) {
          vm.oilCardNo = window.localStorage.getItem("oilCardNo");
          window.localStorage.removeItem("oilCardNo");
        }
        vm.mobileNoRawData = vm.mobileNo;
        vm.isEleOil = vm.chooseOilCardItem.oilBigType == "4" ? "0" : "1";
      });
    } else if (from.name === "webReciveMsg2") {
      next((vm) => {
        vm.value1 = vm.name;
        vm.$store.commit("updateLoadingStatus", { isLoading: false });
      });
    } else if (from.name === "chooseCity") {
      next((vm) => {
        vm.$store.commit("updateLoadingStatus", { isLoading: false });
        vm.cityIdArr = JSON.parse(localStorage.getItem("cityIdArr"));
      });
    } else if (from.name === "carMasterReceiveMsg" || from.name === "ReciveMessage" || from.name === "webReciveMsg" || from.name === "claimRules") {
      next((vm) => {
        vm.$store.commit("updateLoadingStatus", { isLoading: false });
      });
    } else {
      next((vm) => {
        vm.value3 = [];
        vm.value4 = [];
        vm.carrierProject = [];
        vm.list3 = [];
        vm.drawee = [];
        vm.buttonFlag = true;
        vm.$nextTick(() => {
          vm.$_getCompanyConfig().then((res) => {
            vm.queryWaybillMethod().then(()=>{
              vm.getCarrierProjectMethod().then(()=>{
                vm.queryOilCardTypeMethod().then(()=>{
                  vm.getSupplyChainState().then(()=>{
                    // 自动计算金额功能
                    vm.buttonshow = true;
                    vm.loadingFlag = true;
                    vm.arriveBlur();
                  })
                })
              })
            });
          })
        });
      });
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name == "waybillDetail") {
      window.localStorage.clear();
    }
    if (to.name === "webReciveMsg" || to.name === "ReciveMessage") {
      window.localStorage.setItem("zyCapitalCfg", this.zyCapitalCfg);
      window.localStorage.setItem("hybWalletCfg", this.hybWalletCfg);
      let updateOpions1 = {
        type: "weyBillSecond",
        updatMsg: {
          cartBadgeNo: this.cartBadgeNo,
          driverName: this.driverName,
          mobileNo: this.mobileNo,
          carType: this.carType,
          carLength: this.carLength,
          carTonNumber: this.carTonNumber,
          note: this.note, // 备注
        },
      };
      this.$store.commit("updateWayBillStatus", updateOpions1);
    }
    next();
  },
  activated() {},
  mounted() {
    this.cityList = cityDataToIWant(city.data);
    this.startDate = new Date();
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
    },
    insFee() {
      if (this.insFee == "0" || this.insFee == "") {
        this.insFee = "0.00";
      }
    },
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
    ...mapState("carTeamMasterInfo/", {
      carTeamInfo: (state) => state.carTeamInfo,
    }),
    // 收款人栏位展示调整
    receivePersonState() {
      if (this.advancePayState == "1") {
        return true;
      }
      if (this.zyCapitalCfg != "8" && this.hybWalletCfg != "8") {
        return true;
      }
      if (this.zyCapitalCfg === "8" || this.hybWalletCfg === "8") {
        return true;
      }
    },
    receiveType() {
      // 若是垫付单，则不展示收款方式
      if (this.collectTwoCfg === "8" && this.advancePayState === "1") {
        return false;
      }
      // 若开启回款宝配置或好运宝钱包配置，则展示收款方式
      if (this.zyCapitalCfg == "8" || this.hybWalletCfg == "8") {
        return true;
      }
    },
  },
  methods: {
    $_getCompanyConfig() {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      return new Promise((resolve, reject) => {
        getCompanyConfig()
          .then((res) => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode === "0") {
              let result = res.data.result;
              this.businessItems = result.businessItems;
              this.collectTwoCfg = result.collectTwoCfg;
              this.collectTwoPreCashCfg = result.collectTwoPreCashCfg; //到付金2-预付现金
              this.collectTwoRecDepositCfg = result.collectTwoRecDepositCfg; // 到付金2-回单押金
              this.collectionFlagCfg = result.collectionFlagCfg;
              this.orgCfg726 = result.orgCfg726;
              this.orgCfg710 = result.orgCfg710;
              this.relatedList = result.relatedList;
              if (result.updateWaybillCfg === "9") {
                this.$vux.confirm.show({
                  title: "提示",
                  confirmText: "确认",
                  cancelText: "取消",
                  content: "当前企业已关闭修改运单权限！",
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
    chaxunhkb() {
      return new Promise((resolve, reject) => {
        if (this.mobileNo.length == 11) {
          let json = {
            mobileNo: this.mobileNo,
          };
          this.$store.commit("updateLoadingStatus", { isLoading: true });

          phoneGetName(json)
            .then((res) => {
              this.$store.commit("updateLoadingStatus", { isLoading: false });
              if (res.data.reCode == "0") {
                //如果带出了司机姓名则覆盖
                if (Object.keys(res.data.result).length != "0") {
                  //带出四要素则说明是做过实名认证的好运宝用户
                  let result = res.data.result;
                  this.nameDisabled = false;
                  this.isModifyName = 0;
                  this.isModifyElements = 1;
                  //没做四要素认证但是做过司机认证的用户
                  if (
                    result.driverName != "" &&
                    result.alipayNo !== "" &&
                    result.mobileNo !== ""
                  ) {
                    this.isModifyName = 1;
                    this.isModifyElements = 0;
                    this.nameDisabled = true;

                    this.driverName = result.driverName;
                    this.name = result.driverName;
                    this.idCard = result.idCard;
                    this.phoneNumber = result.mobileNo;
                    this.aliNum = result.alipayNo;
                    this.payBankName = result.payBankName;
                    this.payBankNo = result.payBankNo;

                    this.SYSInfo = {
                      driverName: result.driverName,
                      name: result.driverName,
                      idCard: result.idCard,
                      phoneNumber: result.mobileNo,
                      aliNum: result.alipayNo,
                      payBankName: result.payBankName,
                      payBankNo: result.payBankNo,
                    };
                  } else {
                    //未认证
                    this.isModifyName = 0;
                    this.isModifyElements = 1;
                    this.nameDisabled = false;
                    this.SYSInfo = {};
                  }
                } else {
                  //未认证
                  this.nameDisabled = false;
                  //动态修改 这两个值
                  this.isModifyName = 0;
                  this.isModifyElements = 0;
                  this.SYSInfo = {};
                }
                resolve();
              }
              reject();
            })
            .catch((err) => {
              this.$store.commit("updateLoadingStatus", { isLoading: false });
              reject();
            });
        }
      });
    },
    //司机手机号码栏位失焦点后，先查询回款宝在查询下一个接口
    _onblur(val) {
      console.log(this.mobileNoRawData, this.mobileNo, this.isEleOil);
      if (this.mobileNoRawData !== this.mobileNo && this.isEleOil == "0") {
        this.oilCardNo = "";
      }
      if (
        !(this.collectTwoCfg == "8" && this.advancePayState == "1") &&
        this.zyCapitalCfg == "8"
      ) {
        setTimeout(() => {
          this.onblurNext();
        }, 10);
      } else {
        if (this.mobileNo != this.mobileNoRawData) {
          this.changeReciver();
        }
      }
    },
    async onblurNext() {
      try {
        await this.chaxunhkb();
        if (this.mobileNo != this.mobileNoRawData) {
          this.changeReciver();
        }
      } catch (e) {}
    },
    receiveTypeClick() {
      //切换本人、非本人
      if (
        this.zyCapitalCfg != "8" ||
        this.nameDisabled == false ||
        (this.zyCapitalCfg != "8" && this.hybWalletCfg == "8") ||
        (this.advancePayState == "1" && this.collectTwoCfg == "8")
      ) {
        return;
      }
      this.show10 = true;
    },
    //收款人类型点击选择的值
    menuCheck(key, val) {
      console.log(val);
      this.value2 = val;
      if (
        this.zyCapitalCfg == "8" &&
        this.value2 === "好运宝收款" &&
        this.aliNum !== ""
      ) {
        this.value1 = this.driverName;
        //切换为本人的时候
      } else if (this.zyCapitalCfg == "8" && this.value2 === "银行卡收款") {
        //切换为非本人的时候
        this.value1 =
          !this.isEmptyStr(this.payName) &&
          !this.isEmptyStr(this.payIdCard) &&
          !this.isEmptyStr(this.payBankName) &&
          !this.isEmptyStr(this.payBankNo) &&
          !this.isEmptyStr(this.payMobileNo)
            ? this.payName
            : "未填写";
      } else {
        this.value1 = "未填写";
      }
    },
    arriveBlur() {
      this.arrivePay = (
        Number(this.userFreight) -
        Number(this.prepayments) -
        Number(this.prepaymentsOilCard) -
        Number(this.backFee) -
        Number(this.lossFee) +
        Number(this.freightIncr)
      ).toFixed(2);
      if (this.arrivePay == "NaN") {
        this.arrivePay = "0.00";
      }
      if (this.advancePayState == "1") {
        this.validateBackFee();
      }
    },
    // 检查回单押金
    validateBackFee() {
      let type = true;
      if (
        this.collectTwoCfg == "8" &&
        this.collectTwoRecDepositCfg == "8" &&
        this.orgCfg710 == "44" &&
        this.orgCfg726 !== ""
      ) {
        // 若企业开通了到付金2且配置的回单押金为允许，回单押金最高比例，且配置的支付范围：回单+到付款，
        // 则建单时回单押金填写金额根据企业配置的回单押金最高比例做限制，超出时提示：回单押金不可超过运费金额的xx%
        let temp = Number(
          (
            (Number(this.orgCfg726) * 100 * Number(this.userFreight)) /
            100
          ).toFixed(2)
        );
        if (Number(this.backFee) > 200 && Number(this.backFee) > temp) {
          this.$vux1.confirm.show({
            title: "提示",
            content: `回单押金不可超过运费金额的${
              Number(this.orgCfg726) * 100
            }%`,
            confirmText: "确认",
            showCancelButton: false,
            onConfirm: () => {},
            onCancel: () => {},
            onClose: () => {},
          });
          // this.backFee = 0;
          type = false;
        }
      }
      return type;
    },
    //点击跳转到油卡选择页面
    gotoSelectOilCard(item) {
      try {
        MtaH5.clickStat("modwaybill_oilcard");
      } catch (error) {
        JSON.stringify(error);
      }
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
          mobileNo: this.mobileNo,
        },
      });
    },
    //起运时间修改
    changeTime(val) {
      this.startTime = val;
    },
    //货值输入动态计算
    inputBlur() {
      let reg = /^([1-9]\d{0,9})([\.]\d{0,2})?$/;
      if (this.priceInsuranceCfg == "8") {
        if (!reg.test(this.goodsCost)) {
          this.insFee = "0.00";
        } else {
          this.insFee = Number(
            this.goodsCost * this.priceInsuranceRate
          ).toFixed(2);
        }
      }
      if (this.goodsCost == "") {
        this.insFee = "0.00";
      }
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
          type: index,
        },
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
        fn: function (res) {
          _this.cartBadgeNo = res === "" ? "请输入车牌号码" : res;
          //修改前的车牌
          console.log(newCartBadgeNo);
          //修改过后的车牌
          console.log(res);
          if (newCartBadgeNo != res && _this.isEleOil != 0) {
            _this.oilCardNo = "";
          }
          // 如果修改了车牌号
          if (newCartBadgeNo != res) {
            _this.changeReciver();
          }
        },
      });
    },
    // 修改承运信息走共同的逻辑
    commonGetMaster() {
      this.$refs.reciver._getCarMasterInfo();
    },
    //修改运单页面查询所有配置
    queryWaybillMethod() {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      return new Promise((resolve,reject)=>{
        queryWaybillChange(this.taxWaybillId).then((res)=>{
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
            this.priceInsuranceCfg = result.priceInsuranceCfg; //货值打开关闭配置
            this.goodsCostState = result.goodsCostState; //货值可修改配置项
            this.insFee = result.insFee; //保价费
            this.priceInsuranceRate = result.priceInsuranceRate; //保价费率
            this.goodsCost = result.goodsCost; //货值
            this.prepaymentsOilCard = result.prepaymentsOilCard; //预付油卡
            this.oilCardNo = result.oilCardNo; //油卡卡号
            this.zyCapitalCfg = result.zyCapitalCfg; //回款宝配置
            this.hybWalletCfg = result.hybWalletCfg; //好运宝钱包配置
            this.driverFinanceCfg = result.driverFinanceCfg;
            this.driverFinanceProportionCfg = result.driverFinanceProportionCfg;

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
            this.goodsAmountType.key = result.goodsAmountType;
            if (result.goodsAmountType == "0") {
              this.goodsAmountType.value = "吨";
            } else if (result.goodsAmountType == "1") {
              this.goodsAmountType.value = "方";
            } else if (result.goodsAmountType == "2") {
              this.goodsAmountType.value = "件";
            } else {
              this.goodsAmountType.value = "车";
            }
            this.unitPrice = result.unitPrice;
            this.startTime = result.startTime;
            //若起运时间小于现在的时间，则不可以修改
            if (
              new Date(this.startTime.replace(/-/g, "/")).getTime() <
              new Date().getTime()
            ) {
              this.timeState = false; //不可修改
            } else {
              this.timeState = true; //可以修改
            }
            this.transTrip = result.transTrip;
            if (this.transTrip == 1) {
              this.items1Value = 1;
            } else {
              this.items1Value = 2;
            }
            this.wbItem = result.wbItem;
            this.taxDraweePartyId = result.taxDraweePartyId;
            this.drawee.push(result.drawee);
            if (result.carrierProject != "") {
              this.carrierProject.push(result.carrierProject);
              this.carrierProjectShow = true;
            } else {
              this.carrierProjectShow = false;
            }
            this.loginState = result.loginState;
            this.requirement = result.tranRequire;
            this.cartBadgeNo = result.cartBadgeNo;
            this.mobileNo = result.mobileNo;
            this.mobileNoRawData = result.mobileNo;
            this.driverName = result.driverName;
            this.driverNameNoRawData = result.driverName;

            this.carType = result.cartType;
            if (!this.isEmptyStr(result.cartLength)) {
              this.carLength = result.cartLength + "米";
            }
            if (!this.isEmptyStr(result.cartTonnage)) {
              this.carTonNumber = result.cartTonnage + "吨";
            }
            this.driverMsg = result.driverMsg; //承运信息是否可以修改
            this.allFreight = result.allFreight;
            this.userFreight = result.userFreight;
            this.lossFee = result.lossFee;
            this.freightIncr = result.freightIncr;
            this.prepayments = result.prepayments;
            this.prepaymentsBuyOil = result.prepaymentsBuyOil;
            this.prepaymentsBuyGas = result.prepaymentsBuyGas;
            this.prepaymentsBuyEtc = result.prepaymentsBuyEtc;
            this.note = result.note;
            this.backFee = result.backFee;
            this.deposit = result.deposit;
            this.promotionFee = result.promotionFee;
            this.receivablePayback = result.receivablePayback;
            this.report003Cfg = result.report003Cfg;
            this.depositCfg = result.depositCfg;
            this.promotionFeeCfg = result.promotionFeeCfg;
            this.receivablePaybackCfg = result.receivablePaybackCfg;
            this.relatedShipper = result.relatedShipper;
            if(result.relatedShipper && this.cargoOwner.length === 0){
              this.cargoOwner.push(result.relatedShipper);
            }
            //以下的情况是不显示
            this.depositState = Boolean(
              !(
                this.depositCfg == "9" &&
                (this.deposit == "" || Number(this.deposit) == "0")
              )
            );
            this.promotionFeeState = Boolean(
              !(
                this.promotionFeeCfg == "9" &&
                (this.promotionFee == "" || Number(this.promotionFee) == "0")
              )
            );
            this.receivablePaybackState = Boolean(
              !(
                this.receivablePaybackCfg == "9" &&
                (this.receivablePayback == "" ||
                  Number(this.receivablePayback) == "0")
              )
            );
            this.advancePayState = result.advancePayState;
            this.backFeeState = Boolean(
              this.advancePayState == 1 &&
                this.collectTwoRecDepositCfg != 8 &&
                (Number(this.backFee) == 0 || Number(this.backFee) == "")
            );
            this.prepaymentsState = Boolean(
              this.advancePayState == 1 &&
                this.collectTwoPreCashCfg != 8 &&
                (Number(this.prepayments) == 0 ||
                  Number(this.prepayments) == "")
            );
            this.payName = result.payName; //收款人姓名
            this.payIdCard = result.payIdCard; //收款人身份证
            this.payBankName = result.payBankName; //收款人银行名称
            this.payBankNo = result.payBankNo; //收款人银行卡号
            this.payMobileNo = result.payMobileNo; //收款人手机号
            this.provinceId = result.provinceId; //开户行省份ID
            this.cityId = result.cityId; //开户行城市ID
            this.alipayNo = result.alipayNo; //支付宝账号
            this.payType = result.payType; //收款人类型
            this.reciveMsgs = {
              reciveType: result.payType,
              recivePersonName: result.payName, //收款人姓名
              recivePersonCardNum: result.payIdCard, //收款人身份证号
              reciveBank: result.payBankName, //收款人银行名称
              recivePersonBankNum: result.payBankNo, //收款人银行卡号
              recivePersonphoneNum: result.payMobileNo, //收款人手机号
              provinceId: result.provinceId,
              cityId: result.cityId,
              reciveBankAdress: result.province
                ? result.province + " " + result.cityName
                : "", //收款人银行地址
              alipayNo: result.alipayNo, //支付宝账号
            };

            let updateOpions = {
              type: "reciveMsgPay",
              updatMsg: { ...this.reciveMsgs },
            };
            this.$store.commit("updateWayBillStatus", updateOpions);

            this.capWalletFalg = result.capWalletFalg;

            if (this.advancePayState == "1" && this.collectTwoCfg == "8") {
              this.$refs.reciver.init();
            } else {
              if (this.zyCapitalCfg === "8") {
                this.firstGetFourEle();
              } else {
                this.$refs.reciver.init();
              }
            }

            this.invoiceState = result.invoiceState;
            this.confirmState = result.confirmState;
            this.billCycleMode = result.billCycleMode;
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

            // 2020/08/31
            this.prepaymentsOilCardShow = this.oilCardCfg == 8 || (this.oilCardCfg == 9 && Number(this.prepaymentsOilCard) != 0);
            this.prepaymentsBuyOilShow = this.existsAvaibleOilStation == '1' || Number(this.prepaymentsBuyOil) > 0;
            this.prepaymentsBuyGasShow = this.existsAvaibleGasStation == '1' || Number(this.prepaymentsBuyGas) > 0;
            
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
          } else {
            this.$vux.toast.text(res.data.reInfo, "middle");
          }
          resolve()
        }).catch((err)=>{
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          reject()
        })
      })
    },
    // 获取承运项目方法
    getCarrierProjectMethod(){
      return new Promise((resolve,reject)=>{
        this.$store.commit("updateLoadingStatus", { isLoading: true });
        getCarrierProject(this.taxDraweePartyId).then((res) => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          this.carrierProjectArr = [];
          let result = res.data.result;
          if (res.data.reCode === "0") {
            //配置有值
            if (result.length > 0) {
              let arr = [];
              for (let i = 0; i < result.length; i++) {
                arr.push(result[i].carrierProject);
              }
              this.carrierProjectArr.push(arr);
              this.carrierProjectState = true;
            } else {
              //配置没有值
              this.carrierProjectArr = [];
              this.carrierProjectState = false;
            }
          }else{
            this.$vux.toast.text(res.data.reInfo, "middle");
          }
          resolve()
        }).catch((err)=>{
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          reject()
        })
      })
    },
    // 判断是否是电子油卡方法
    queryOilCardTypeMethod(){
      return new Promise((resolve,reject)=>{
        if (this.oilCardNo) {
          this.$store.commit("updateLoadingStatus", { isLoading: true });
          queryOilCardType(this.oilCardNo).then((res) => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode === "0") {
              this.isEleOil = res.data.result.isEleOil;
              resolve()
            }else{
              reject()
            }
          }).catch((err)=>{
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            reject()
          })
        }else{
          resolve()
        }
      })
    },
    // 获取供应链金融的state
    getSupplyChainState(){
      return new Promise((resolve,reject)=>{
        this.$store.commit("updateLoadingStatus", { isLoading: true });
        supplyChainState().then((res) => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          this.supplyChainState = res.data.result.supplyChainState;
          resolve()
        }).catch((err)=>{
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          reject()
        });
      })
    },
    //首次查询四要素
    async firstGetFourEle() {
      try {
        if (this.zyCapitalCfg == "8") {
          await this.chaxunhkb();
          this.$refs.reciver.init();
        }
      } catch (err) {
        this.$vux.toast.text(err, "middle");
      }
    },
    //点击确定保存按钮
    async clickConfirm() {
      try {
        MtaH5.clickStat("modwaybill_xiugai");
      } catch (error) {
        JSON.stringify(error);
      }
      // 校验回单押金合理性
      if (this.advancePayState == "1") {
        if (!this.validateBackFee()) {
          return false;
        }
      }
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
      if (this.isEmptyStr(this.trim(this.goodsName))) {
        this.$vux.toast.text("货物名称不能为空！", "middle");
        return false;
      }
      //货物数量
      if (this.isEmptyStr(this.trim(this.goodsAmount))) {
        this.$vux.toast.text("货物数量不能为空！", "middle");
        return false;
      } else {
        let regexp;
        if (this.goodsAmountType.key == "0") {
          regexp = /^([1-9]\d{0,6}|0)([\.]\d{0,4})?$/;
        } else {
          regexp = /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/;
        }
        if (!regexp.test(this.goodsAmount)) {
          this.$vux.toast.text("无效的货物数量！", "middle");
          return false;
        }
      }
      //运输单价
      if (!this.isEmptyStr(this.trim(this.unitPrice))) {
        if (!this.Reg.test(this.unitPrice)) {
          this.$vux.alert.show({
            title: "提示",
            content: "无效的运输金额！",
          });
          return false;
        }
      }
      //多趟时趟次范围2-99
      if (this.billCycleMode == "8" && this.items1Value == 2) {
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
      //业务项目配置
      if (this.businessItems == 3) {
        this.wbItem = this.trim(this.wbItem);
        if (this.isEmptyStr(this.wbItem)) {
          this.$vux.toast.text("业务项目不能为空！", "middle");
          return false;
        }
      }
      //受票方
      if (this.loginState == 0 && this.drawee.length == "0") {
        this.$vux.toast.text("受票方必填！", "middle");
        return;
      }
      //承运项目
      if (
        !(
          this.report003Cfg == "2" &&
          this.carrierProject.length == "0" &&
          this.carrierProjectShow == false
        ) &&
        this.carrierProject.length == 0
      ) {
        this.$vux.toast.text("承运项目必填！", "middle");
        return;
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
      //运费金额验证
      if (!this.isEmptyStr(this.userFreight)) {
        if (!this.Reg.test(this.userFreight)) {
          this.$vux.alert.show({ title: "提示", content: "运费金额不合法！" });
          return false;
        }
        if (Number(this.userFreight) > Number(this.maxAllFreight)) {
          this.$vux.alert.show({
            title: "提示",
            content: "运费金额不能超过最大运费金额！",
          });
        }
      } else {
        this.$vux.alert.show({
          title: "提示",
          content: "运费金额不能为空！",
        });
        return false;
      }

      //预付油卡
      if (!this.isEmptyStr(this.prepaymentsOilCard)) {
        this.prepaymentsOilCard = this.trim(this.prepaymentsOilCard);
        let regExp = /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/;
        if (!regExp.test(this.prepaymentsOilCard)) {
          this.$vux.alert.show({
            title: "提示",
            content: "无效的预付油卡金额！",
          });
          return false;
        } else {
          if (Number(this.prepaymentsOilCard) > Number(this.maxAllFreight)) {
            this.$vux.alert.show({
              title: "提示",
              content: "预付油卡金额不能超过最大金额！",
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
                try {
                  MtaH5.clickStat("modwaybill_alertchoosecard");
                } catch (error) {
                  JSON.stringify(error);
                }
                this.$router.push({
                  path: "/chooseOilCard",
                  query: {
                    belongActSys: this.belongActSys,
                    prepaymentsOilCard: this.prepaymentsOilCard,
                    cartBadgeNo: this.cartBadgeNo,
                    driverName: this.driverName,
                    mobileNo: this.mobileNo,
                  },
                });
              },
              onCancel: () => {
                try {
                  MtaH5.clickStat("modwaybill_alertbuildensure");
                } catch (error) {
                  JSON.stringify(error);
                }
                if (this.driverFinanceJudge() == false) {
                  return false;
                }
                //判断是否修改了运单号
                if (
                  this.taxWaybillNo != localStorage.getItem("oldTaxWaybillNo")
                ) {
                  this.waybillRepeatCheck(this.taxWaybillNo);
                } else {
                  //运费各种判断
                  this.checkFee();
                }
                return false;
              },
            });
            return false;
          }
        }
      }
      //货值判断(保价费)
      if (this.priceInsuranceCfg == 8 && this.goodsCostState == 0) {
        let regexp = /^([1-9]\d{0,9})([\.]\d{0,2})?$/;
        this.goodsCost = this.trim(this.goodsCost);
        if (!this.isEmptyStr(this.goodsCost)) {
          if (!regexp.test(this.goodsCost)) {
            this.$vux.toast.text("货值输入不合法！", "middle");
            return false;
          }
        } else {
          this.$vux.alert.show({
            title: "提示",
            content: `企业已开通"保价运输"请输入此次运输货值！`,
          });
          return false;
        }
      }

      //运费扣减
      if (!this.isEmptyStr(this.lossFee)) {
        if (!this.Reg.test(this.lossFee)) {
          this.$vux.alert.show({
            title: "提示",
            content: "无效的运费扣减金额！",
          });
          return false;
        }
      }
      //运费增补
      if (!this.isEmptyStr(this.freightIncr)) {
        if (!this.Reg.test(this.freightIncr)) {
          this.$vux.alert.show({
            title: "提示",
            content: "无效的运费增补金额！",
          });
          return false;
        }
      }
      //预付现金
      if (!this.isEmptyStr(this.prepayments)) {
        if (!this.Reg.test(this.prepayments)) {
          this.$vux.alert.show({
            title: "提示",
            content: "无效的预付现金！",
          });
          return false;
        }
        if (Number(this.prepayments) > Number(this.userFreight)) {
          this.$vux.alert.show({
            title: "提示",
            content: "预付现金不能大于运费金额！",
          });
          return false;
        }
        if (Number(this.prepayments) > Number(this.maxAllFreight)) {
          this.$vux.alert.show({
            title: "提示",
            content: "预付现金不能超过最大金额！",
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
              content: "无效的线下油款金额！",
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
              content: "无效的线下气款金额！",
            });
            return false;
          }
        }
      }
      //线下路桥费
      if (this.existsAvaibleEtcStation == "1" || this.prepaymentsBuyEtc > "0") {
        if (!this.isEmptyStr(this.prepaymentsBuyEtc)) {
          if (!this.Reg.test(this.prepaymentsBuyEtc)) {
            this.$vux.alert.show({
              title: "提示",
              content: "无效的线下路桥费金额！",
            });
            return false;
          }
        }
      }
      //回单押金
      if (!this.isEmptyStr(this.backFee)) {
        if (!this.Reg.test(this.backFee)) {
          this.$vux.alert.show({
            title: "提示",
            content: "无效的回单押金！",
          });
          return false;
        }
        if (Number(this.backFee) > Number(this.userFreight)) {
          this.$vux.alert.show({
            title: "提示",
            content: "回单押金不能大于运费金额！",
          });
          return false;
        }
        if (Number(this.backFee) > Number(this.maxAllFreight)) {
          this.$vux.alert.show({
            title: "提示",
            content: "回单押金不能超过最大金额！",
          });
          return false;
        }
      }
      //定金、推广费、应收回款 deposit promotionFee receivablePayback
      if (!this.isEmptyStr(this.deposit)) {
        if (!this.Reg.test(this.deposit)) {
          this.$vux.alert.show({
            title: "提示",
            content: "无效的定金！",
          });
          return false;
        }
      }
      if (!this.isEmptyStr(this.promotionFee)) {
        if (!this.Reg.test(this.promotionFee)) {
          this.$vux.alert.show({
            title: "提示",
            content: "无效的推广费！",
          });
          return false;
        }
      }
      if (!this.isEmptyStr(this.receivablePayback)) {
        if (!this.Reg.test(this.receivablePayback)) {
          this.$vux.alert.show({
            title: "提示",
            content: "无效的应收回款！",
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
            content: "运费金额不能超过最大运费金额！",
          });
          return false;
        }
      }

      if (this.driverFinanceJudge() == false) {
        return false;
      }

      //判断是否修改了运单号
      if (this.taxWaybillNo != localStorage.getItem("oldTaxWaybillNo")) {
        this.buttonFlag = false;
        setTimeout(() => {
          this.waybillRepeatCheck(this.taxWaybillNo);
        }, 20);
      } else {
        //运费各种判断
        this.checkFee();
      }
    },
    //3018通过运单号判断运单是否重复
    waybillRepeatCheck(item) {
      waybillRepeat(item)
        .then((res) => {
          if (res.data.reCode == 1) {
            this.$vux.toast.text(res.data.reInfo, "middle");
          } else {
            //运费各种判断
            this.checkFee();
          }
          this.buttonFlag = true;
        })
        .catch((err) => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          this.$vux.toast.text(err.message, "middle");
          this.buttonFlag = true;
        });
    },
    //各种运费判断
    checkFee() {
      let prepaymentsBuyOiled = localStorage.getItem("prepaymentsBuyOiled");
      let prepaymentsBuyEtced = localStorage.getItem("prepaymentsBuyEtced");
      let prepaymentsBuyGased = localStorage.getItem("prepaymentsBuyGased");
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
      if (this.isEmptyStr(this.yetBuyEtcNotInvoice)) {
        this.yetBuyEtcNotInvoice = 0;
      }
      if (this.isEmptyStr(this.yetBuyGasNotInvoice)) {
        this.yetBuyGasNotInvoice = 0;
      }
      if (this.isEmptyStr(this.yetPrepaymentsBuyOil)) {
        this.yetPrepaymentsBuyOil = 0;
      }
      if (this.isEmptyStr(this.yetPrepaymentsBuyEtc)) {
        this.yetPrepaymentsBuyEtc = 0;
      }
      if (this.isEmptyStr(this.yetPrepaymentsBuyGas)) {
        this.yetPrepaymentsBuyGas = 0;
      }
      if (
        this.d(this.f(this.userFreight, this.lossFee), this.freightIncr) <= 0
      ) {
        this.$vux.alert.show({
          title: "提示",
          content: "请确认，运费金额加运费增补减货损必须大于0。",
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
          content: "请确认，线下油款金额不能大于设置的上限！",
        });
        return false;
      }
      // 企业累计线下油款不能大于累计购油未开票余额
      if (
        subtract(
          add(
            subtract(this.prepaymentsBuyOil, prepaymentsBuyOiled),
            this.yetPrepaymentsBuyOil
          ),
          this.yetBuyOilNotInvoice
        ) > 0
      ) {
        this.$vux.alert.show({
          title: "提示",
          content: "请确认，企业累计线下油款不能大于累计购油未开票余额",
        });
        return false;
      }
      // 企业累计线下路桥费不能大于累计路桥费未开票余额
      if (
        subtract(
          add(
            subtract(this.prepaymentsBuyEtc, prepaymentsBuyEtced),
            this.yetPrepaymentsBuyEtc
          ),
          this.yetBuyEtcNotInvoice
        ) > 0
      ) {
        this.$vux.alert.show({
          title: "提示",
          content: "请确认，企业累计线下路桥费不能大于累计路桥费未开票余额",
        });
        return false;
      }
      // 企业累计线下气款不能大于累计气款未开票余额
      if (
        subtract(
          add(
            subtract(this.prepaymentsBuyGas, prepaymentsBuyGased),
            this.yetPrepaymentsBuyGas
          ),
          this.yetBuyGasNotInvoice
        ) > 0
      ) {
        this.$vux.alert.show({
          title: "提示",
          content: "请确认，企业累计线下气款不能大于累计气款未开票余额",
        });
        return false;
      }

      if (
        this.d(this.f(this.userFreight, this.lossFee), this.freightIncr) <
        this.d(this.paidAllFreight, 0)
      ) {
        this.$vux.alert.show({
          title: "提示",
          content: "请确认，运费金额加运费增补减货损必须大于等于已付运费。",
        });
        return false;
      }
      var allF;
      if (this.lossInvoiceCfg == "13") {
        //要支付货损
        allF = this.d(this.userFreight, this.freightIncr);
      } else {
        allF = this.d(this.f(this.userFreight, this.lossFee), this.freightIncr);
      }
      this.lossFee = this.lossFee.toString();
      //运费等于已付运费
      if (Number(allF) == Number(this.paidAllFreight)) {
        if (this.lossInvoiceCfg == "13") {
          if (
            (this.yetLossFee == "" && this.lossFee > 0) ||
            (this.yetLossFee != "" && this.f(this.yetLossFee, this.lossFee) < 0)
          ) {
            this.$vux.alert.show({
              title: "提示",
              content: "预付货损未完成支付，不能修改运费金额等于已支付金额！",
            });
            return false;
          }
        }
      }
      if (
        this.d(
          this.prepaymentsEtcCard,
          this.d(
            this.prepaymentsOilCard,
            this.d(this.prepayments, this.backFee)
          )
        ) > this.d(this.f(this.userFreight, this.lossFee), this.freightIncr)
      ) {
        if (
          (this.oilCardCfg == "8" || this.prepaymentsOilCarded != "0.00") &&
          (this.etcCardCfg == "8" || this.prepaymentsEtcCarded != "0.00")
        ) {
          this.$vux.alert.show({
            title: "提示",
            content:
              "请确认，预付油卡加上预付ETC加上预付现金加上回单押金必须要小于等于运费金额加上增补减去货损。",
          });
        } else if (
          (this.oilCardCfg == "8" || this.prepaymentsOilCarded != "0.00") &&
          this.etcCardCfg == "9" &&
          this.prepaymentsEtcCarded == "0.00"
        ) {
          this.$vux.alert.show({
            title: "提示",
            content:
              "请确认，预付油卡加上预付现金加上回单押金必须要小于等于运费金额加上增补减去货损。",
          });
        } else if (
          this.oilCardCfg == "9" &&
          this.prepaymentsOilCarded == "0.00" &&
          (this.etcCardCfg == "8" || this.prepaymentsEtcCarded != "0.00")
        ) {
          this.$vux.alert.show({
            title: "提示",
            content:
              "请确认，预付ETC加上预付现金加上回单押金必须要小于等于运费金额加上增补减去货损。",
          });
        } else {
          this.$vux.alert.show({
            title: "提示",
            content:
              "请确认，预付现金加上回单押金必须要小于等于运费金额加上增补减去货损。",
          });
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
          let json1 = {
            fromProvId: this.startProvinceCode, //起运省份ID
            toProvId: this.endProvinceCode, //目的省份ID
            fromCityId: this.startCityCode, //起运城市ID
            toCityId: this.endCityCode, //目的城市ID
            allFreight: this.userFreight, //运输总价
          };
          this.buttonFlag = false;
          checkFee(json1)
            .then((res) => {
              this.buttonFlag = true;
              if ("0" == res.data.reCode) {
                this.sub();
              } else {
                if ("1" == res.data.reCode) {
                  this.$vux1.confirm.show({
                    title: "提示",
                    confirmText: "确认",
                    cancelText: "取消",
                    content: res.data.reInfo,
                    onConfirm: () => {
                      //点击确定去建单
                      this.sub();
                    },
                  });
                } else {
                  this.$vux.toast.text(
                    "抱歉,您录入的数据不合法,请核实后重试！",
                    "middle"
                  );
                }
              }
            })
            .catch((err) => {
              this.buttonFlag = true;
              this.$store.commit("updateLoadingStatus", { isLoading: false });
              this.$vux.toast.text(err.message, "middle");
            });
        } else {
          this.$vux.toast.text("城市数据异常~", "middle");
        }
      }
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
          },
        });
      } else {
        this.submit();
      }
    },
    //修改成功后提交的方法
    submit() {
      let bankName =
        window.sessionStorage.isChooseType === "1"
          ? this.reciveMsgPay.reciveBank
          : this.payBankName;
      var _this = this;
      let userFreightOld = localStorage.getItem("oldAllFreight");
      if (
        this.freightChangeReasonCfg == 1 &&
        Number(this.userFreight) !== Number(userFreightOld)
      ) {
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
                  _this.oilCardCheck();
                } else {
                  _this.informationEntry();
                }
              }
            }
          },
        });
      } else {
        //通知后台
        // this.sendMessage();
        if (bankName == "好运宝钱包" || bankName == "车队钱包") {
          this.oilCardCheck();
        } else {
          this.informationEntry();
        }
      }
    },
    //录入信息
    //this.informationEntry();
    //录入信息的方法
    informationEntry() {
      let json = {
        mobileNo: this.mobileNo,
        payeeBankNo: this.reciveMsgPay.recivePersonBankNum, //收款人银行卡号
        payeeName: this.reciveMsgPay.recivePersonName, //收款人姓名
        payeeBankName: this.reciveMsgPay.reciveBank, //收款人银行名称
        payeeProvinceId: this.reciveMsgPay.provinceId, //开户行省份id
        payeeCityId: this.reciveMsgPay.cityId, //开户行城市id
        payeeIdCard: this.reciveMsgPay.recivePersonCardNum, //收款人身份证
        payeeMobileNo: this.reciveMsgPay.recivePersonphoneNum, //收款人手机号
        alipayNo: this.reciveMsgPay.alipayNo, //收款人支付宝
      };
      if (
        json.mobileNo != "" &&
        json.payeeBankNo != "" &&
        json.payeeName != "" &&
        json.payeeBankName != "" &&
        json.payeeProvinceId != "" &&
        json.payeeCityId != "" &&
        json.payeeIdCard != "" &&
        json.payeeMobileNo != ""
      ) {
        this.$store.commit("updateLoadingStatus", { isLoading: true });
        this.buttonFlag = false;
        infoEntry(json)
          .then((res) => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.oilCardCheck();
          })
          .catch((err) => {
            this.buttonFlag = true;
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.$vux.toast.text(err.message, "middle");
          });
      } else {
        this.oilCardCheck();
      }
    },
    //油卡验证接口
    oilCardCheck() {
      //油卡配置开通了要去验证油卡
      if (
        this.oilCardCfg == 8 ||
        (this.oilCardCfg == 9 && Number(this.prepaymentsOilCard) != "0")
      ) {
        let json = {
          prepaymentsOilCard:
            this.prepaymentsOilCard == "" ? "0.00" : this.prepaymentsOilCard,
          cartBadgeNo: this.cartBadgeNo,
          belongActSys: this.belongActSys,
          oilCardNo:
            this.prepaymentsOilCard == "" ||
            Number(this.prepaymentsOilCard) == "0"
              ? ""
              : this.oilCardNo,
        };
        this.buttonFlag = false;
        oilCardCheck(json)
          .then((res) => {
            if (res.data.reCode == "0") {
              this.sendMessage();
            } else {
              this.$store.commit("updateLoadingStatus", { isLoading: false });
              this.$vux.alert.show({
                title: "提示",
                buttonText: "知道了",
                content: res.data.reInfo,
              });
              this.buttonFlag = true;
            }
          })
          .catch((err) => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.$vux.toast.text(err.message, "middle");
            this.buttonFlag = false;
          });
      } else {
        this.sendMessage();
      }
    },
    //走后台接口，提供信息
    sendMessage() {
      // TODO
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      let json = {
        xid: this.xid, //通用ID
        taxWaybillId: this.taxWaybillId, //运单ID
        taxWaybillNo: this.taxWaybillNo, //运单号
        startProvinceId: this.startProvinceCode,
        startCityId: this.startCityCode,
        startCountyId: this.startCountyCode,
        endProvinceId: this.endProvinceCode,
        endCityId: this.endCityCode,
        endCountyId: this.endCountyCode,
        driverName: this.driverName, //司机姓名
        cartBadgeNo: this.cartBadgeNo, //车牌号
        transTrip: this.billCycleMode == 8 ? this.transTrip : "", //运输趟次
        goodsName: this.goodsName, //货物名称
        goodsAmount: this.goodsAmount, //货物数量
        goodsAmountType: this.goodsAmountType.key, //货物数量类型  默认0-吨 1-方 2-件 3-车
        unitPrice: this.isEmptyStr(this.unitPrice) ? "0.00" : this.unitPrice, //运输单价
        userFreight: this.userFreight, //运费金额
        // userFreight:Number(this.prepayments) + Number(this.arrivePay) + Number(this.backFee), //运费金额重新计算
        wbItem: this.wbItem, //业务项目
        drawee: this.loginState == 0 ? this.drawee[0] : "", //受票方
        prepayments: this.isEmptyStr(this.prepayments)
          ? "0.00"
          : this.prepayments, //预付现金
        backFee: this.isEmptyStr(this.backFee) ? "0.00" : this.backFee, //回单押金
        freightIncr: this.isEmptyStr(this.freightIncr)
          ? "0.00"
          : this.freightIncr, //运单增补
        prepaymentsBuyOil: this.isEmptyStr(this.prepaymentsBuyOil)
          ? "0.00"
          : this.prepaymentsBuyOil, //线下油款
        prepaymentsBuyEtc: this.isEmptyStr(this.prepaymentsBuyEtc)
          ? "0.00"
          : this.prepaymentsBuyEtc, //线下路桥费
        prepaymentsBuyGas: this.isEmptyStr(this.prepaymentsBuyGas)
          ? "0.00"
          : this.prepaymentsBuyGas, //线下气款
        lossFee: this.isEmptyStr(this.lossFee) ? "0.00" : this.lossFee, //运费扣减
        taxDraweePartyId: this.loginState == 0 ? this.taxDraweePartyId : "", //受票方ID
        freightChangeReason: this.msg, //修改原因
        note: this.note, //备注
        tranRequire: this.requirement, //运输要求
        klbState: this.klbState, //运输状态
        mobileNo: this.mobileNo, //手机号
        cartType: this.carType, //车型
        cartLength: parseFloat(this.carLength), //车长
        cartTonnage: parseFloat(this.carTonNumber), //吨位
        stateCfg: this.stateCfg, //运单跟踪状态
        payType: "", //正常的收款人类型
        hkbPayeeType: "", //回款宝收款人类型
        payName:
          this.advancePayState == "1" && this.collectTwoCfg == "8"
            ? ""
            : this.zyCapitalCfg === "8" && reciveType == "好运宝收款"
            ? this.name
            : window.sessionStorage.isChooseType == "1"
            ? this.reciveMsgPay.recivePersonName
            : this.value1 == "未填写"
            ? ""
            : this.payName, //收款人姓名
        payIdCard:
          this.advancePayState == "1" && this.collectTwoCfg == "8"
            ? ""
            : this.zyCapitalCfg == "8" && reciveType == "好运宝收款"
            ? this.idCard
            : window.sessionStorage.isChooseType == "1"
            ? this.reciveMsgPay.recivePersonCardNum
            : this.value1 == "未填写"
            ? ""
            : this.payIdCard, //收款人身份证
        payBankName:
          this.advancePayState == "1" && this.collectTwoCfg == "8"
            ? ""
            : this.zyCapitalCfg == "8" && reciveType == "好运宝收款"
            ? this.payBankName
            : window.sessionStorage.isChooseType === "1"
            ? this.reciveMsgPay.reciveBank == "好运宝钱包"
              ? "浙江网商银行"
              : this.reciveMsgPay.reciveBank
            : this.value1 == "未填写"
            ? ""
            : this.payBankName, //收款人银行名称
        payBankNo:
          this.advancePayState == "1" && this.collectTwoCfg == "8"
            ? ""
            : this.zyCapitalCfg == "8" && reciveType == "好运宝收款"
            ? this.payBankNo
            : window.sessionStorage.isChooseType === "1"
            ? this.reciveMsgPay.recivePersonBankNum
            : this.value1 == "未填写"
            ? ""
            : this.payBankNo, //收款人银行卡号
        payMobileNo:
          this.advancePayState == "1" && this.collectTwoCfg == "8"
            ? ""
            : this.zyCapitalCfg == "8" && reciveType == "好运宝收款"
            ? this.phoneNumber
            : window.sessionStorage.isChooseType === "1"
            ? this.reciveMsgPay.recivePersonphoneNum
            : this.value1 == "未填写"
            ? ""
            : this.payMobileNo, //收款人手机号
        provinceId:
          this.advancePayState == "1" && this.collectTwoCfg == "8"
            ? ""
            : this.zyCapitalCfg == "8" && reciveType == "好运宝收款"
            ? ""
            : window.sessionStorage.isChooseType === "1"
            ? this.reciveMsgPay.reciveBank == "好运宝钱包"
              ? "7"
              : this.reciveMsgPay.provinceId
            : this.value1 == "未填写"
            ? ""
            : this.provinceId, //开户行省份id
        cityId:
          this.advancePayState == "1" && this.collectTwoCfg == "8"
            ? ""
            : this.zyCapitalCfg == "8" && reciveType == "好运宝收款"
            ? ""
            : window.sessionStorage.isChooseType === "1"
            ? this.reciveMsgPay.reciveBank == "好运宝钱包"
              ? "701"
              : this.reciveMsgPay.cityId
            : this.value1 == "未填写"
            ? ""
            : this.cityId, //开户行城市id
        oilCardNo:
          this.prepaymentsOilCard == "" ||
          Number(this.prepaymentsOilCard) == "0"
            ? ""
            : this.oilCardNo, //油卡卡号
        prepaymentsOilCard:
          this.prepaymentsOilCard == "" ? "0.00" : this.prepaymentsOilCard, //预付油卡
        goodsCost: this.goodsCost,
        alipayNo:
          this.advancePayState == "1" && this.collectTwoCfg == "8"
            ? ""
            : this.zyCapitalCfg == "8" && reciveType == "好运宝收款"
            ? this.aliNum
            : window.sessionStorage.isChooseType == "1"
            ? this.reciveMsgPay.alipayNo
            : this.value1 == "未填写"
            ? ""
            : this.alipayNo, //收款人支付宝账号
        startTime: this.startTime, //起运时间
        carrierProject: this.carrierProject[0], //承运项目
        deposit:
          this.depositCfg == 9 &&
          (Number(this.deposit) == 0 || this.deposit == "")
            ? ""
            : this.depositCfg == "8" && this.deposit == ""
            ? "0.00"
            : this.deposit, //定金
        promotionFee:
          this.promotionFeeCfg == "9" &&
          (this.promotionFee == "" || Number(this.promotionFee) == "0")
            ? ""
            : this.promotionFeeCfg == "8" && this.promotionFee == ""
            ? "0.00"
            : this.promotionFee, //推广费
        receivablePayback:
          this.receivablePaybackCfg == "9" &&
          (this.receivablePayback == "" ||
            Number(this.receivablePayback) == "0")
            ? ""
            : this.receivablePaybackCfg == "8" && this.receivablePayback == ""
            ? "0.00"
            : this.receivablePayback, //应收回款
        relatedShipper: this.cargoOwner.length > 0 ? this.cargoOwner[0] : "", // 关联货主
      };

      // 收款方式
      let advancePayState =
        this.advancePayState == "1" && this.collectTwoCfg == "8" ? "1" : "0";
      let reciveType = this.$refs.reciver.getReciveType();
      // 收款人信息
      let reciveJson = {};
      if (this.carTeamInfo.payeeBankNo) {
        // 车队长传值逻辑
        reciveJson = {
          payName: this.carTeamInfo.payeeName,
          payIdCard: this.carTeamInfo.payeeIdCard,
          payBankName: this.carTeamInfo.payeeBankName,
          payBankNo: this.carTeamInfo.payeeBankNo,
          payMobileNo: this.carTeamInfo.mobileNo,
          provinceId: this.carTeamInfo.payeeProvinceId,
          cityId: this.carTeamInfo.payeeCityId,
          alipayNo: this.carTeamInfo.alipayNo,
        };
      } else if (this.advancePayState == "1" && this.collectTwoCfg == "8") {
        // 垫付单不传支付信息
        reciveJson = {
          payName: "",
          payIdCard: "",
          payBankName: "",
          payBankNo: "",
          payMobileNo: "",
          provinceId: "",
          cityId: "",
          alipayNo: "",
        };
      } else if (this.zyCapitalCfg === "8" && reciveType == "好运宝收款") {
        // 好运宝收款
        reciveJson = {
          payName: this.name,
          payIdCard: this.idCard,
          payBankName: this.payBankName,
          payBankNo: this.payBankNo,
          payMobileNo: this.phoneNumber,
          provinceId: "",
          cityId: "",
          alipayNo: this.aliNum,
        };
      } else {
        // 正常收款
        reciveJson = {
          payName: this.reciveMsgPay.recivePersonName,
          payIdCard: this.reciveMsgPay.recivePersonCardNum,
          payBankName: this.reciveMsgPay.reciveBank,
          payBankNo: this.reciveMsgPay.recivePersonBankNum,
          payMobileNo: this.reciveMsgPay.recivePersonphoneNum,
          provinceId: this.reciveMsgPay.provinceId,
          cityId: this.reciveMsgPay.cityId,
          alipayNo: this.reciveMsgPay.alipayNo,
        };
        // 为了兼容默认store
        if (this.reciveMsgPay.reciveBank instanceof Array) {
          reciveJson.payBankName = "";
        }
        if (this.reciveMsgPay.reciveBankAdress instanceof Array) {
          reciveJson.reciveBankAdress = "";
        }

        if (this.reciveMsgPay.reciveBank == "好运宝钱包") {
          // 特殊处理改为浙江网商银行
          reciveJson.payBankName = "浙江网商银行";
          reciveJson.provinceId = "7";
          reciveJson.cityId = "701";
        }
      }

      Object.assign(json, reciveJson);
      let configJson = {
        reciveType: reciveType,
        recivePersonName: json.payName,
        driverName: json.driverName,
        advancePayState: advancePayState,
        zyCapitalCfg: this.zyCapitalCfg,
      };
      let { payType, hkbPayeeType } = getPayTypeAndHkbPayeeType(configJson);
      json.payType = payType;
      json.hkbPayeeType = hkbPayeeType;

      this.buttonFlag = false; //禁用按钮
      reWriteWaybill(json)
        .then((res) => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          if (res.data.reCode == "0") {
            this.$vux.toast.text(res.data.reInfo, "middle");
            let json = {
              taxWaybillId: this.taxWaybillId, //运单号
              type: "3", //1删除 2终结 3修改
              content: {
                taxWaybillNo: this.taxWaybillNo,
                userFreight: this.userFreight + "元",
                lossFee: this.lossFee,
                backFee: this.backFee,
                freightIncr: this.freightIncr,
                prepayments: this.prepayments,
                cartBadgeNo: this.cartBadgeNo,
                driverName: this.driverName,
                mobileNo: this.mobileNo,
                goodsName: this.goodsName,
                goodsAmount: this.goodsAmount + this.goodsAmountType.value,
                note: this.note,
                startPlace: res.data.result.startPlace,
                endPlace: res.data.result.endPlace,
                supplyChainLogo:
                  this.supplyChainState == "8" &&
                  Number(this.prepaymentsOilCard) > 0
                    ? 1
                    : 0,
              },
            };
            console.log("====AppUpdateWaybillData========", json);
            AppUpdateWaybillData(json);
            //修改成功跳转到详情页
            setTimeout(() => {
              if (this.$route.query.type === "1") {
                this.$router.replace({
                  path: "/waybillDetail",
                  query: {
                    taxWaybillId: this.taxWaybillId,
                    xid: this.xid,
                  },
                });
              } else {
                this.$router.go(-1);
              }
              this.buttonFlag = true;
            }, 1500);
          } else {
            this.$vux.alert.show({
              title: "提示",
              buttonText: "知道了",
              content: res.data.reInfo,
            });
            this.buttonFlag = true;
          }
        })
        .catch((err) => {
          this.buttonFlag = true;
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          this.$vux.toast.text(err.message, "middle");
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
        let result = checkCommonCity(
          fromProvId,
          fromCityId,
          toCityId,
          fromCountyId,
          toCountyId
        )
          .then((res) => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            resolve(res.data.reCode);
          })
          .catch((err) => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.$vux.toast.text(err.message, "middle");
            resolve("1");
          });
      });
    },
    //始发城市赋值
    startValue: function () {
      var CodeArr = this.value3;
      this.startProvinceCode = CodeArr[0];
      this.startCityCode = CodeArr[1];
      this.startCountyCode = CodeArr[2];
    },
    //目的城市赋值
    endValue: function () {
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
      this.drawee = [];
      this.drawee = val;
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
        this.getCarrierProject(this.taxDraweePartyId);
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
              this.list3 = [];
              let arr = [];
              for (let i = 0; i < data.length; i++) {
                this.taxDraweePartyIdArr.push(data[i].taxDraweePartyId);
                arr.push(data[i].drawee);
              }
              this.list3.push(arr);
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
      // 3020 货主有值
      if (this.relatedList && this.relatedList.length > 0) {
        this.cargoOwnerArr.push(this.relatedList);
      }
      // 3020 货主没有值
      if(this.relatedList.length === 0 && this.relatedShipper){
        this.cargoOwnerArr.push([this.relatedShipper]);
      }
    },

    getCarrierProject(item) {
      if (
        this.report003Cfg == "2" &&
        this.carrierProject.length == "0" &&
        this.carrierProjectShow == false
      ) {
        return;
      }
      getCarrierProject(item)
        .then((res) => {
          //3072
          this.carrierProjectArr = [];
          if (res.data.reCode === "0") {
            let result = res.data.result;
            //配置有值
            if (result.length > 0) {
              let arr = [];
              for (let i = 0; i < result.length; i++) {
                arr.push(result[i].carrierProject);
              }
              this.carrierProjectArr.push(arr);
              //默认取第一个
              if (this.report003Cfg == "2" && arr.length == "0") {
                this.carrierProjectShow = false;
              } else {
                this.carrierProjectShow = true;
              }
              console.log(this.carrierProjectShow);
              this.carrierProject = [];
              this.carrierProjectState = true;
            } else {
              //配置没有值
              this.carrierProjectArr = [];
              this.carrierProject = [];
              this.carrierProjectState = false;
            }
          } else {
            this.$vux.toast.text(res.data.reInfo, "middle");
          }
        })
        .catch((err) => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          this.$vux.toast.text(err.message, "middle");
        });
    },
    //点击更多的时候
    carTypeBtn(menuKey, menuItem) {
      if (menuKey != "menu4") {
        this.carType = menuItem;
      } else {
        this.show15 = true;
      }
    },
    //更多车型按钮
    cartTypeBtn() {
      if (this.activeFlag3 === -1) {
        this.$vux.toast.text("请选择车型~~~", "middle");
        return false;
      }
      this.show15 = false;
      this.carType = this.cartType[this.activeFlag3].type;
    },
    //车长点击确定按钮
    carLongBtn() {
      if (this.activeFlag === -1) {
        if (this.carLen == "") {
          this.$vux.toast.text("请选择你需要的车长~~~", "middle");
          return false;
        } else {
          this.show2 = false;
          let reg = /^\d+(\.\d{1,2})?$/;
          if (!reg.test(this.carLen)) {
            this.$vux.toast.text("输入的车长不符合规则~~~", "middle");
            return false;
          }
          this.carLength = this.carLen + "米";
          return false;
        }
      }
      this.show2 = false;
      this.carLength = this.carLongList[this.activeFlag].cartAttr + "米";
    },
    //吨位点击确定按钮
    carTonBtn() {
      if (this.activeFlag1 === -1) {
        if (this.carTon == "") {
          this.$vux.toast.text("请选择你需要的车吨位~~~", "middle");
          return false;
        } else {
          this.show3 = false;
          let reg = /^\d+(\.\d{1,2})?$/;
          if (!reg.test(this.carTon)) {
            this.$vux.toast.text("输入的吨位不符合规则~~~", "middle");
            return false;
          }
          this.carTonNumber = this.carTon + "吨";
          return false;
        }
      }
      this.show3 = false;
      this.carTonNumber = this.carTonList[this.activeFlag1].cartAttr + "吨";
    },
    //点击收款人信息,跳转页面
    receiveBill() {
      try {
        MtaH5.clickStat("modifywaybill_webrecivemsg");
      } catch (error) {
        JSON.stringify(error);
      }

      if (this.collectTwoCfg === "8" && this.advancePayState === "1") {
        if (this.collectionFlagCfg == "46") {
          this.$router.push({
            path: "/carMasterReceiveMsg",
            query: {
              collectionFlagCfg: this.collectionFlagCfg,
              mobileNo: this.mobileNo,
              payeeName: this.payName ? this.payName : this.driverName,
              driverName: this.driverName,
              cartBadgeNo: this.cartBadgeNo,
            },
          });
        }
        return;
      }
      if (this.zyCapitalCfg === "8" && this.value2 == "好运宝收款") {
        this.$router.push({
          path: "/webReciveMsg2",
          //携带四要素
          query: {
            driverName: this.name,
            idCard: this.idCard,
            mobileNo: this.phoneNumber,
            alipayNo: this.aliNum,
          },
        });
      } else {
        this.$router.push("/webReciveMsg");
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
    trim: function (i) {
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
    /**
     * 司机金融1.1新加逻辑
     */
    driverFinanceJudge() {
      if (this.driverFinanceCfg == "8") {
        let prepaymentsOilCardRate = parseFloat(
          this.oilCardPayUpperCfg * this.userFreight
        ).toFixed(2);
        let allFreightRate = parseFloat(
          this.driverFinanceProportionCfg * this.userFreight
        ).toFixed(2);
        if (Number(this.prepaymentsOilCard) > prepaymentsOilCardRate) {
          this.$vux.alert.show({
            title: "提示",
            content: `您输入的预付油卡金额超过运费的${this.toPercent(
              this.oilCardPayUpperCfg
            )}，请重新输入！`,
          });
          return false;
        }
        if (Number(this.lossFee) > 0 || Number(this.freightIncr) > 0) {
          return true;
        } else {
          if (Number(this.driverFinanceProportionCfg) != 1) {
            if (this.isEmptyStr(this.backFee) || Number(this.backFee) <= "0") {
              this.$vux.alert.show({
                title: "提示",
                content: "请输入回单押金！",
              });
              return false;
            }
            if (Number(this.arrivePay) > allFreightRate) {
              this.$vux.alert.show({
                title: "提示",
                content: "您输入的到付款&回单押金金额不合规，请重新输入！",
              });
              return false;
            }
            if (Number(this.arrivePay) <= "0") {
              this.$vux.alert.show({
                title: "提示",
                content: "到付金额必须大于0！",
              });
              return false;
            }
          } else {
            return true;
          }
        }
      } else {
        return true;
      }
    },
    changeReciver() {
      this.$refs.reciver.changeReciver();
    },
    driverNameChange(val) {
      console.log(val, this.driverNameNoRawData);
      if (val != this.driverNameNoRawData) {
        this.changeReciver();
      }
    },
    // 小数转换百分比
    toPercent: function (point) {
      var str = Number(point * 100).toFixed(2);
      str += "%";
      return str;
    },
  },
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
  .img3 {
    width: 20px;
    height: 20px;
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
    // .weui-cell__hd {
    //   color: #202020;
    // }
    .vux-label {
      color: #888;
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
      color: #888;
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
}
</style>
