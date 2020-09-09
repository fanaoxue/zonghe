<template>
  <div class="modify_line">
    <c-header isShowTitle>
      <van-nav-bar
        title="修改线路"
        left-arrow
        fixed
        @click-left="onClickLeft"
      ></van-nav-bar>
    </c-header>
    <div class="sub_page_base">
      <div class="content">
        <div @click="showOrHide(0)" class="header_cell_title">
          <div>货物信息</div>
          <div class="show-or-hide">
            <img
              src="../../assets/imgs/bigCompre/down_arror_icon.png"
              alt
              width="16"
              height="10"
              class="img-icon"
              :class="{
                shouQi: showControl[0] === 0,
                zhanKai: showControl[0] === 1
              }"
            />
          </div>
        </div>
        <div class="slide" :class="{ animate: showControl[0] === 0 }">
          <van-cell-group>
            <van-field
              v-model.trim="formData.goodsName"
              label="货物名称："
              placeholder="请输入货物名称"
              type="text"
              maxlength="16"
              required
              clearable
            />
            <van-field
              v-model.trim="formData.curTransportUnitPrice"
              label="运输单价："
              placeholder="请输入运输单价"
              type="number"
              clearable
            >
              <div slot="right-icon">
                <div>元</div>
              </div>
            </van-field>
            <van-field
              v-model.trim="formData.lossUnitPrice"
              label="货损单价："
              placeholder="请输入货损单价"
              type="number"
              clearable
            >
              <div slot="right-icon">
                <div>元</div>
              </div>
            </van-field>
          </van-cell-group>
          <van-cell-group>
            <div class="cell">
              <div class="label">请选择货物单位</div>
              <div class="checbox_group_box">
                <van-radio-group
                  v-model="formData.transportUnitPriceType"
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
                      >吨</van-button
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
                      >方</van-button
                    >
                  </van-radio>
                  <van-radio name="3">
                    <van-button
                      class="btn"
                      slot="icon"
                      slot-scope="props"
                      :class="props.checked ? 'activeIcon' : 'inactiveIcon'"
                      type="primary"
                      size="large"
                      >车</van-button
                    >
                  </van-radio>
                </van-radio-group>
              </div>
            </div>
            <div class="cell">
              <div class="label">司机可见运输单价</div>
              <div class="checbox_group_box">
                <van-radio-group
                  v-model="formData.unitPriceVisible"
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
                      >可见</van-button
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
                      >不可见</van-button
                    >
                  </van-radio>
                </van-radio-group>
              </div>
            </div>
            <div class="cell">
              <div class="label">一天多趟</div>
              <div class="checbox_group_box">
                <van-radio-group
                  v-model="formData.manyTrips"
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
                      >否</van-button
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
                      >是</van-button
                    >
                  </van-radio>
                </van-radio-group>
              </div>
            </div>
            <div class="cell">
              <div class="label">磅单区分上传</div>
              <div class="checbox_group_box">
                <van-radio-group
                  v-model="formData.poundDiffUpload"
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
                      >否</van-button
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
                      >是</van-button
                    >
                  </van-radio>
                </van-radio-group>
              </div>
            </div>
            <div class="cell" v-show="formData.transportUnitPriceType === '0'">
              <div class="label">允许货损范围</div>
              <div class="checbox_group_box">
                <van-radio-group
                  v-model="formData.allowLossType"
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
                      >固定值</van-button
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
                      >百分比</van-button
                    >
                  </van-radio>
                </van-radio-group>
                <input
                  type="number"
                  v-model.trim="formData.allowLossWeight"
                  placeholder="请输入允许货损的范围"
                  class="last_input"
                  v-if="formData.allowLossType === '0'"
                  oninput="this.value=(this.value.replace(/[^0-9.]+/,''))"
                />
                <span v-else>
                  <input
                    type="number"
                    v-model.trim="formData.allowLossPercent"
                    placeholder="请输入允许货损的范围"
                    class="last_input"
                    oninput="this.value=(this.value.replace(/[^0-9.]+/,''))"
                  />
                  <span>%</span>
                </span>
              </div>
            </div>
          </van-cell-group>
        </div>

        <div @click="showOrHide(1)" class="header_cell_title">
          <div>线路信息</div>
          <div class="show-or-hide">
            <img
              src="../../assets/imgs/bigCompre/down_arror_icon.png"
              alt
              width="16"
              height="10"
              class="img-icon"
              :class="{
                shouQi: showControl[1] === 0,
                zhanKai: showControl[1] === 1
              }"
            />
          </div>
        </div>
        <div class="slide" :class="{ animate: showControl[1] === 0 }">
          <van-cell-group>
            <div class="startPlace_top">
              <div><i class="iconfont icondingwei"></i>请完善装货地信息</div>
              <img
                src="../../assets/imgs/bigCompre/loading_icon@2x.png"
                alt=""
                class="loading_icon"
              />
            </div>
            <van-field
              v-model="startPlace"
              label="装货地城市："
              placeholder="请选择装货地城市"
              right-icon="arrow"
              @click="chooseStCity(0)"
              required
              readonly
            />
            <van-field
              v-model.trim="formData.loadingAddressName"
              label="装货地名称："
              placeholder="请输入装货地名称"
              maxlength="32"
              required
              clearable
            />
            <div>
              <div class="address_style">详细地址：</div>
              <van-field
                v-model="formData.loadingDetailAddress"
                autosize
                type="textarea"
                maxlength="120"
                placeholder="如道路、门牌号等"
                show-word-limit
              />
            </div>
          </van-cell-group>
          <van-cell-group>
            <div class="endPlace_top">
              <div><i class="iconfont icondingwei"></i>请完善卸货地信息</div>
              <img
                src="../../assets/imgs/bigCompre/unloading_icon@2x.png"
                alt=""
                class="unloading_icon"
              />
            </div>
            <van-field
              v-model="endPlace"
              label="卸货地城市："
              placeholder="请选择卸货地城市"
              right-icon="arrow"
              @click="chooseStCity(1)"
              required
              readonly
            />
            <van-field
              v-model.trim="formData.unloadingAddressName"
              label="卸货地名称："
              placeholder="请输入卸货地名称"
              maxlength="32"
              required
              clearable
            />
            <div>
              <div class="address_style">详细地址：</div>
              <van-field
                v-model="formData.unloadingDetailAddress"
                autosize
                type="textarea"
                maxlength="120"
                placeholder="如道路、门牌号等"
                show-word-limit
              />
            </div>
          </van-cell-group>
        </div>

        <div @click="showOrHide(2)" class="header_cell_title">
          <div>其他信息</div>
          <div class="show-or-hide">
            <img
              src="../../assets/imgs/bigCompre/down_arror_icon.png"
              alt
              width="16"
              height="10"
              class="img-icon"
              :class="{
                shouQi: showControl[2] === 0,
                zhanKai: showControl[2] === 1
              }"
            />
          </div>
        </div>
        <div class="slide" :class="{ animate: showControl[2] === 0 }">
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
      </div>
      <div class="footer">
        <van-button type="primary" size="large" @click="saveData"
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
  Cell,
  Field,
  RadioGroup,
  Radio,
  Button,
  Toast,
  Picker,
  Popup
} from "vant";
import { cityDataToIWant, value2name } from "@/utils/cMethods";
import { moneyReg_2, moneyReg_4 } from "../../utils/regularSets.js";
import { getDrawee } from "../../api/api.js";
import { getLineDetail, modifyLine } from "@/api/bigCompre";
import { setNativeHead, AppFinish, finishCallBack } from "@/utils/app.js";
export default {
  components: {
    vanNavBar: NavBar,
    vanCellGroup: CellGroup,
    vanCell: Cell,
    vanField: Field,
    vanRadioGroup: RadioGroup,
    vanRadio: Radio,
    vanButton: Button,
    vanToast: Toast,
    vanPicker: Picker,
    vanPopup: Popup
  },
  name: "ModifyLine",
  data() {
    return {
      showControl: [0, 1, 1],
      formData: {
        goodsName: "",
        curTransportUnitPrice: "",
        lossUnitPrice: "",
        transportUnitPriceType: "0",
        unitPriceVisible: "0",
        manyTrips: "0",
        poundDiffUpload: "0",
        allowLossType: "0",
        allowLossWeight: "",
        allowLossPercent: "",

        loadingProvinceName: "",
        loadingCityName: "",
        loadingCountyName: "",
        unloadingProvinceName: "",
        unloadingCityName: "",
        unloadingCountyName: "",

        loadingProvinceId: "",
        loadingCityId: "",
        loadingCountyId: "",
        unloadingProvinceId: "",
        unloadingCityId: "",
        unloadingCountyId: "",

        loadingAddressName: "",
        unloadingAddressName: "",

        loadingDetailAddress: "", // 装货地详细地址
        unloadingDetailAddress: "", //卸货地详细地址

        drawee: "",
        taxDraweePartyId: "",
        contactName: "",
        contactMobileNo: "",

        autoFreightState: "0",
        roundDownState: "0",
        roundDownType: "0"
      },

      citys: cityDataToIWant(window.city.data),
      cityIdArr: "",
      startPlace: "",
      endPlace: "",

      draweeState: false,
      draweeArray: [], // 受票方集合
      draweeDefaultIndex: 0,
      transportLineId: this.$route.query.transportLineId,

      oldcurTransportUnitPrice: ""
    };
  },
  beforeRouteEnter(to, from, next) {
    let json = { isShow: "0" };
    setNativeHead(json);
    if (from.name === "chooseCity") {
      next(vm => {
        vm.$store.commit("updateLoadingStatus", { isLoading: false });
        vm.cityIdArr = JSON.parse(localStorage.getItem("cityIdArr"));
      });
    } else {
      next(vm => {
        vm.$store.commit("updateLoadingStatus", { isLoading: false });
      });
    }
  },
  watch: {
    cityIdArr() {
      if (this.cityIdArr.length != 0) {
        let types = localStorage.getItem("types");
        if (types == 0) {
          this.startPlace = this.getAddressName();

          let arr = this.startPlace.split(" ");
          this.formData.loadingProvinceName = arr[0];
          this.formData.loadingCityName = arr[1];
          this.formData.loadingCountyName = arr[2];

          this.formData.loadingProvinceId = this.cityIdArr[0];
          this.formData.loadingCityId = this.cityIdArr[1];
          this.formData.loadingCountyId = this.cityIdArr[2];
        } else {
          this.endPlace = this.getAddressName();

          let arr = this.endPlace.split(" ");
          this.formData.unloadingProvinceName = arr[0];
          this.formData.unloadingCityName = arr[1];
          this.formData.unloadingCountyName = arr[2];

          this.formData.unloadingProvinceId = this.cityIdArr[0];
          this.formData.unloadingCityId = this.cityIdArr[1];
          this.formData.unloadingCountyId = this.cityIdArr[2];
        }
      }
      window.localStorage.clear();
    },
    "formData.transportUnitPriceType": {
      handler: function(val) {
        if (val !== "0") {
          this.formData.allowLossPercent = "";
          this.formData.allowLossWeight = "";
          this.formData.allowLossType = "";
        } else {
          this.formData.allowLossType = "0";
        }
      }
    }
  },
  mounted() {
    this.dataInit();
  },
  methods: {
    onClickLeft() {
      // this.$router.back();
      AppFinish(-1)
      // finishCallBack({ methodName: "javascript:AppJSApi_finishCallBack()" });
    },
    // 展开or折叠
    showOrHide(type) {
      if (this.showControl[type]) {
        this.$set(this.showControl, type, 0);
      } else {
        this.$set(this.showControl, type, 1);
      }
    },
    chooseStCity(index) {
      this.$router.push({
        path: "/chooseCity",
        query: {
          type: index
        }
      });
    },
    // 通过code获取地址名称
    getAddressName() {
      return value2name(this.cityIdArr, this.citys);
    },
    // 受票方点击确定
    onConfirmDrawee(picker, value, index) {
      this.draweeState = false;
      this.formData.drawee = picker;
      this.formData.taxDraweePartyId = this.draweeObj[value].taxDraweePartyId;
    },
    // 受票方拉数据
    draweeClickMethod() {
      const Toast = this.$toast.loading({
        duration: 0,
        message: "加载中...",
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
    dataInit() {
      const loading = this.$toast.loading({
        duration: 0,
        message: "加载中...",
        forbidClick: true
      });
      getLineDetail({ transportLineId: this.transportLineId })
        .then(res => {
          loading.clear();
          if (res.data.reCode == "0") {
            let result = res.data.result;
            Object.assign(this.formData, result);
            this.formData.allowLossPercent = result.allowLossPercent ? (result.allowLossPercent * 100).toFixed(2) : '';
            
            this.oldcurTransportUnitPrice = result.curTransportUnitPrice;
            // 城市赋值
            this.startPlace = `${result.loadingProvinceName} ${
              result.loadingCityName
            } ${result.loadingCountyName}`;
            this.endPlace = `${result.unloadingProvinceName} ${
              result.unloadingCityName
            } ${result.unloadingCountyName}`;
          } else {
            Toast(res.data.reInfo);
          }
        })
        .catch(err => {
          loading.clear();
        });
    },
    saveData() {
      // 验证
      if (!this.$utils.isNotEmpty(this.formData.goodsName)) {
        Toast("货物名称不能为空~~");
        return;
      }
      if (
        this.$utils.isNotEmpty(this.formData.curTransportUnitPrice) &&
        !moneyReg_2.test(this.formData.curTransportUnitPrice)
      ) {
        Toast("运输单价输入不合法~~");
        return false;
      }
      if (
        this.$utils.isNotEmpty(this.formData.lossUnitPrice) &&
        !moneyReg_2.test(this.formData.lossUnitPrice)
      ) {
        Toast("货损单价输入不合法~~");
        return false;
      }
      if (this.formData.transportUnitPriceType === "0") {
        if (this.formData.allowLossType === "0") {
          if (!this.$utils.isNotEmpty(this.formData.allowLossWeight)) {
            this.$vux.toast.text("允许货损不能为空~~", "middle");
            return false;
          } else {
            if (!moneyReg_4.test(this.formData.allowLossWeight)) {
              this.$vux.toast.text("允许货损输入不合法~~", "middle");
              return false;
            }
          }
        }

        if (this.formData.allowLossType === "1") {
          if (!this.$utils.isNotEmpty(this.formData.allowLossPercent)) {
            this.$vux.toast.text("允许货损百分比不能为空~~", "middle");
            return false;
          } else {
            if (!moneyReg_2.test(this.formData.allowLossPercent)) {
              this.$vux.toast.text("允许货损百分比输入不合法~~", "middle");
              return false;
            }
          }
        }
      }
      if (!this.$utils.isNotEmpty(this.formData.loadingAddressName)) {
        Toast("装货地名称不能为空~~");
        return false;
      }
      if (!this.$utils.isNotEmpty(this.formData.unloadingAddressName)) {
        Toast("卸货地名称不能为空~~");
        return false;
      }
      if (!this.$utils.isNotEmpty(this.formData.contactMobileNo)) {
        Toast("手机号码不能为空~~");
        return false;
      }
      if (!this.$utils.isMobileNo(this.formData.contactMobileNo)) {
        Toast("手机号码输入不合法~~");
        return false;
      }
      const loading = this.$toast.loading({
        duration: 0,
        message: "加载中...",
        forbidClick: true
      });
      let params = {
        transportLineId: this.transportLineId,
        goodsName: this.formData.goodsName,
        curTransportUnitPrice: this.oldcurTransportUnitPrice,
        modTransportUnitPrice:
          this.oldcurTransportUnitPrice && Number(this.oldcurTransportUnitPrice) ==
          Number(this.formData.curTransportUnitPrice) 
            ? ""
            : this.formData.curTransportUnitPrice,
        lossUnitPrice: this.formData.lossUnitPrice,
        loadingProvinceName: this.formData.loadingProvinceName,
        loadingCityName: this.formData.loadingCityName,
        loadingCountyName: this.formData.loadingCountyName,
        loadingAddressName: this.formData.loadingAddressName,
        loadingDetailAddress: this.formData.loadingDetailAddress,
        unloadingProvinceName: this.formData.unloadingProvinceName,
        unloadingCityName: this.formData.unloadingCityName,
        unloadingCountyName: this.formData.unloadingCountyName,
        unloadingAddressName: this.formData.unloadingAddressName,
        unloadingDetailAddress: this.formData.unloadingDetailAddress,
        contactName: this.formData.contactName,
        contactMobileNo: this.formData.contactMobileNo,
        manyTrips: this.formData.manyTrips,
        drawee: this.formData.drawee,
        taxDraweePartyId: this.formData.taxDraweePartyId,
        allowLossType: this.formData.allowLossType,
        allowLossWeight:
          this.formData.transportUnitPriceType === "0" &&
          this.formData.allowLossType === "0"
            ? this.formData.allowLossWeight
            : "",
        allowLossPercent:
          this.formData.transportUnitPriceType === "0" &&
          this.formData.allowLossType === "1"
            ? this.formData.allowLossPercent
            : "",
        transportUnitPriceType: this.formData.transportUnitPriceType,
        poundDiffUpload: this.formData.poundDiffUpload,
        roundDownState: this.formData.roundDownState,
        roundDownType: this.formData.roundDownType,
        autoFreightState: this.formData.autoFreightState,
        unitPriceEffectTime:this.formData.unitPriceEffectTime
      };
      modifyLine(params)
        .then(res => {
          loading.clear();
          if (res.data.reCode === "0") {
            Toast("修改成功~~");
            setTimeout(() => {
              finishCallBack({
                methodName: "javascript:AppJSApi_finishCallBack()"
              });
              // this.$router.replace('/LineList')
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
.modify_line {
  background: #ffffff;
  font-size: 16px;
  /deep/.van-cell {
    font-size: 16px;
    &:not(:last-child)::after {
      right: 16px;
      border-bottom: 1px solid #bfbfbf;
    }
    .van-cell__value--alone {
      background-color: #efefef;
      border-radius: 5px;
      padding: 8px;
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
    /**动画部分**/
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
    .content {
      margin-top: 10px;
      .header_cell_title {
        position: relative;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 10px 16px;
        margin: 10px 10px 0px;
        overflow: hidden;
        color: #121212;
        font-size: 16px;
        line-height: 24px;
        background-color: #fff;
        border-radius: 5px;
      }

      .startPlace_top {
        background-color: #e7f2fa;
        height: 45px;
        line-height: 45px;
        width: 100%;
        border-left: 6px solid #1581cf;
        position: relative;
        color: #1380d2;
        font-size: 15px;
        padding-left: 10px;
        box-sizing: border-box;
        .loading_icon {
          position: absolute;
          right: 10px;
          top: -1px;
          width: 45px;
        }
      }
      .endPlace_top {
        background-color: #fcf9ef;
        height: 45px;
        line-height: 45px;
        width: 100%;
        border-left: 6px solid #ffba00;
        position: relative;
        color: #ffba00;
        font-size: 15px;
        padding-left: 10px;
        box-sizing: border-box;
        .unloading_icon {
          position: absolute;
          right: 10px;
          top: -1px;
          width: 45px;
        }
      }
      .address_style {
        color: #454545;
        padding: 12px 16px 8px;
      }

      /deep/.van-cell-group {
        overflow: hidden;
        margin: 1px 10px 0px 10px;
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
            // line-height: 65px;
            display: flex;
            align-items: center;
            .van-button {
              font-size: 15px;
            }
            .van-radio__icon {
              height: 100%;
              line-height: 100%;
            }
            .btn {
              width: 75px;
              height: 30px!important;
              line-height: 30px!important;
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
          .last_input {
            font-size: 16px;
            width: 90%;
            background-color: #efefef;
            border: none;
            height: 40px;
            line-height: 40px;
            border-radius: 5px;
            text-indent: 0.5em;
            &::placeholder {
              color: #a6a6a6;
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
}
</style>
