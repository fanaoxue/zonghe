<template>
  <div class="modify-delivery">
    <c-header :isShowTitle="true">
      <van-nav-bar title="修改发货" left-arrow fixed @click-left="goBack"></van-nav-bar>
    </c-header>
    <div v-show="pageShow" class="sub_page_base">
      <group label-width="6.5em" label-align="right" class="group1">
        <cell value-align="left" placeholder="请选择装货地" is-link @click.native="chooseStCity(0)">
          <div slot="title" style="text-align:right;width:6.5em;">
            <img
              :src="bitian"
              alt
              width="8"
              height="8"
              style="font-size:20px;vertical-align:middle;"
              class="img1"
            />
            <span style="vertical-align:middle;">装货地：</span>
          </div>
          <div>{{startPlace}}</div>
        </cell>
        <cell value-align="left" placeholder="请选择卸货地" is-link @click.native="chooseStCity(1)">
          <div slot="title" style="text-align:right;width:6.5em;">
            <img
              :src="bitian"
              alt
              width="8"
              height="8"
              style="font-size:20px;vertical-align:middle;"
              class="img1"
            />
            <span style="vertical-align:middle;">卸货地：</span>
          </div>
          <div>{{endPlace}}</div>
        </cell>
        <x-input title="货物名称：" v-model.trim="formData.goodsName" type="text">
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
          v-model.trim="formData.goodsAmount"
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
              default-item-class="demo1-item"
              selected-item-class="demo1-item-selected"
              radio-required
            >
              <checker-item
                :value="item"
                v-for="(item, index) in items1"
                :key="index"
              >{{ item.value }}</checker-item>
            </checker>
          </div>
        </x-input>
        <cell value-align="left" is-link @click.native="show1 = true">
          <span>{{ formData.loadNumUnloadNum }}</span>
          <div slot="title" style="text-align:right;width:6.5em;">
            <img
              :src="bitian"
              alt
              width="8"
              height="8"
              style="font-size:20px;vertical-align:middle;"
              class="img1"
            />
            <span style="vertical-align:middle;">几装几卸：</span>
          </div>
        </cell>

        <cell value-align="left" is-link @click.native="showMore = true">
          <span>{{ formData.cartType }}</span>
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
        <cell value-align="left" is-link @click.native="show3 = true">
          <span>{{ formData.cartLength }}</span>
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
      </group>
      <group label-width="6.5em" label-align="right" class="group2">
        <cell
          value-align="left"
          placeholder="请选择装货时间"
          is-link
          @click.native="selectDatePickerShow = true"
        >
          <div slot="title" style="text-align:right;width:6.5em;">
            <img
              :src="bitian"
              alt
              width="8"
              height="8"
              style="font-size:20px;vertical-align:middle;"
              class="img1"
            />
            <span style="vertical-align:middle;">装货时间：</span>
          </div>
          <div>{{loadingTime}}</div>
        </cell>
        <x-input
          title="期望运费："
          v-model.trim="formData.expectFreight"
          placeholder="请填写期望运费金额"
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
            <span style="vertical-align:middle;">期望运费：</span>
          </div>
          <span slot="right">元</span>
        </x-input>
        <cell value-align="left">
          <div slot="title" style="text-align:right;width:6.5em;">
            <img
              :src="bitian"
              alt
              width="8"
              height="8"
              style="font-size:20px;vertical-align:middle;"
              class="img1"
            />
            <span style="vertical-align:middle;">结算方式：</span>
          </div>
          <div>
            <checker
              v-model="settleType"
              type="checkbox"
              default-item-class="demo2-item"
              selected-item-class="demo2-item-selected"
            >
              <checker-item :value="item" v-for="(item, index) in items2" :key="index">{{ item }}</checker-item>
            </checker>
          </div>
        </cell>
        <cell value-align="left">
          <div slot="title" style="text-align:right;width:6.5em;">
            <!-- <img
              :src="bitian"
              alt
              width="8"
              height="8"
              style="font-size:20px;vertical-align:middle;"
              class="img1"
            />-->
            <span style="vertical-align:middle;">提供通行证：</span>
          </div>
          <div>
            <van-radio-group v-model="formData.isSupportTraffic" class="radio-group">
              <van-radio name="0" checked-color="#15499A" :class="modelRadio==='0'?'checked':''">否</van-radio>
              <van-radio name="1" checked-color="#15499A" :class="modelRadio==='1'?'checked':''">是</van-radio>
            </van-radio-group>
          </div>
        </cell>
        <cell value-align="left">
          <div slot="title" style="text-align:right;width:6.5em;">
            <!-- <img
              :src="bitian"
              alt
              width="8"
              height="8"
              style="font-size:20px;vertical-align:middle;"
              class="img1"
            />-->
            <span style="vertical-align:middle;">服务要求：</span>
          </div>
          <div>
            <checker
              v-model="serviceRequire"
              type="checkbox"
              default-item-class="demo2-item"
              selected-item-class="demo2-item-selected"
            >
              <checker-item :value="item" v-for="(item, index) in items3" :key="index">{{ item }}</checker-item>
            </checker>
          </div>
        </cell>
        <x-textarea
          title="特殊说明："
          placeholder="请填写特殊说明和运输要求"
          autosize
          v-model.trim="formData.specialExplain"
        ></x-textarea>
      </group>
      <div id="footer"></div>
      <div id="button">
        <x-button @click.native="saveData" type="primary">保存</x-button>
      </div>
    </div>

    <!-- 几装几卸 -->
    <popup v-model="show1" position="bottom" max-height="80%">
      <popup-header
        left-text="取消"
        right-text="确定"
        @on-click-left="show1 = false"
        @on-click-right="loadNumUnloadNumBtn()"
        title="几装几卸"
      ></popup-header>
      <div class="car-msg-choose">
        <div
          class="car-choose-btn"
          :class="{ 'choose-btn-active': activeFlag1 === index }"
          @click="activeFlag1 = index"
          v-for="(item, index, key) in loadNumUnloadNumList"
          :key="key"
        >{{ item }}</div>
      </div>
    </popup>
    <!-- 车型 -->
    <actionsheet v-model="showMore" :menus="menus1" @on-click-menu="cartTypeBtn1"></actionsheet>
    <popup v-model="show2" position="bottom">
      <popup-header
        left-text="取消"
        right-text="确定"
        @on-click-left="show2 = false"
        @on-click-right="cartTypeBtn2()"
        title="更多车型"
      ></popup-header>
      <div class="car-msg-choose">
        <div
          class="car-choose-btn"
          :class="{ 'choose-btn-active': activeFlag2 === index }"
          @click="activeFlag2 = index"
          v-for="(item, index, key) in cartTypeList"
          :key="key"
        >{{ item }}</div>
      </div>
    </popup>
    <!-- 车长 -->
    <popup v-model="show3" position="bottom" max-height="80%">
      <popup-header
        left-text="取消"
        right-text="确定"
        @on-click-left="show3 = false"
        @on-click-right="carLongBtn()"
        title="请选择车长(米)"
      ></popup-header>
      <div class="car-msg-choose">
        <div
          class="car-choose-btn"
          :class="{ 'choose-btn-active': activeFlag3 === index }"
          @click="activeFlag3 = index"
          v-for="(item, index, key) in carLongList"
          :key="key"
        >{{ item }}米</div>
      </div>
      <div class="self-ipt">
        <span>其他：</span>
        <input type="number" placeholder="请输入车长" v-model="carLen" @click="activeFlag3 = -1" />
        <span>米</span>
      </div>
    </popup>

    <!-- 装货时间 -->
    <van-popup v-model="selectDatePickerShow" position="bottom">
      <datePicker @onConfirm="onConfirmDatePicker" @onCancel="selectDatePickerShow = false"></datePicker>
    </van-popup>
  </div>
</template>
<script>
import { NavBar, Field, RadioGroup, Radio, Popup } from "vant";
import datePicker from "./components/datePicker";
import { setNativeHead, AppFinish, finishCallBack } from "../../utils/app.js";
import { cityDataToIWant, value2name } from "../../utils/cMethods";
import {
  goodsResourceDetail,
  modifyGoodsResource
} from "../../api/transOrganize.js";
export default {
  components: {
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    vanField: Field,
    vanPopup: Popup,
    datePicker,
    vanNavBar: NavBar
  },
  data() {
    return {
      pageShow: false,
      selectDatePickerShow: false,
      goodsId: "",
      citys: cityDataToIWant(city.data),
      bitian: require("../../assets/imgs/wbs/bitian_icon@2x.png"),
      cityIdArr: "",
      startPlace: "",
      endPlace: "",
      goodsName: "",
      goodsAmount: "",
      loadingTime: "",
      settleType: [],
      serviceRequire: [],
      formData: {
        loadingProvinceName: "",
        loadingCityName: "",
        loadingCountyName: "",
        unloadingProvinceName: "",
        unloadingCityName: "",
        unloadingCountyName: ""
      },
      goodsAmountType: {
        key: "0",
        value: "吨"
      },
      items1: [
        {
          key: "0",
          value: "吨"
        },
        {
          key: "1",
          value: "方"
        },
        {
          key: "2",
          value: "件"
        },
        {
          key: "3",
          value: "车"
        }
      ],
      cartTypeList: [
        "平板",
        "低栏",
        "中栏",
        "高栏",
        "集装箱",
        "自卸",
        "开顶厢",
        "冷藏车",
        "危险品",
        "其他"
      ],
      carLongList: ["4.2", "6.8", "8.7", "9.6", "13", "17.5"],
      menus1: {
        menu1: "厢式",
        menu2: "半挂",
        menu3: "高低板",
        menu4: "更多>>"
      },
      carLen: "", //输入的车长
      cartType: "", //车型
      cartLength: "", //车长
      loadNumUnloadNum: "", // 几装几卸
      loadNumUnloadNumList: ["一装一卸", "一装两卸", "两装一卸", "两装两卸"],
      show1: false,
      show2: false,
      show3: false,
      showMore: false,
      activeFlag1: -1,
      activeFlag2: -1,
      activeFlag3: -1,
      money: "", // 期望运费金额
      payType: "",
      items2: ["预付", "到付", "回单付"],
      modelRadio: "", // 是否提供通行证
      requirement: "", //服务要求
      items3: ["三不超", "需雨布", "急需走"],
      note: "" //特殊说明
    };
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
    }
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
        vm.goodsId = vm.$route.query.goodsId;
        vm.dataInit();
        vm.$store.commit("updateLoadingStatus", { isLoading: false });
      });
    }
  },
  created() {},
  mounted() {},
  methods: {
    dataInit() {
      console.log("来了");
      goodsResourceDetail({ goodsId: this.goodsId }).then(res => {
        this.$store.commit("updateLoadingStatus", { isLoading: false });
        if (res.data.reCode == "0") {
          let result = res.data.result;
          if (result.loadingCountyName) {
            this.startPlace = `${result.loadingProvinceName} ${result.loadingCityName} ${result.loadingCountyName}`;
          } else {
            this.startPlace = `${result.loadingProvinceName} ${result.loadingCityName}`;
          }
          if (result.unloadingCountyName) {
            this.endPlace = `${result.unloadingProvinceName} ${result.unloadingCityName} ${result.unloadingCountyName}`;
          } else {
            this.endPlace = `${result.unloadingProvinceName} ${result.unloadingCityName}`;
          }
          this.formData = result;
          this.settleType = result.settleType
            ? result.settleType.split(",")
            : [];
          this.serviceRequire = result.serviceRequire
            ? result.serviceRequire.split(",")
            : [];
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
          this.loadNumUnloadNumList.forEach((item, index, val) => {
            if (this.formData.loadNumUnloadNum == item) {
              this.activeFlag1 = index;
            }
          });
          this.loadingTime = this.formData.loadingTime;
        } else {
          this.$vux.toast.text(res.data.reInfo, "middle");
        }
        this.pageShow = true;
      });
    },
    goBack() {
      this.$router.go(-1);
    },
    modifyWaybill() {
      console.log("修改运单");
    },
    confirmBuildWaybill() {
      console.log("确认建单");
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
    //选择城市
    chooseStCity(index) {
      this.$router.push({
        path: "/chooseCity",
        query: {
          type: index
        }
      });
    },
    loadNumUnloadNumBtn() {
      this.formData.loadNumUnloadNum = this.loadNumUnloadNumList[
        this.activeFlag1
      ];
      this.show1 = false;
    },
    cartTypeBtn1(menuKey, menuItem) {
      if (menuKey != "menu4") {
        this.formData.cartType = menuItem;
      } else {
        this.show2 = true;
      }
    },
    //车长点击确定按钮
    carLongBtn() {
      if (this.activeFlag3 === -1) {
        if (this.carLen == "") {
          this.$vux.toast.text("请选择你需要的车长~~~", "middle");
          return false;
        } else {
          this.show3 = false;
          let reg = /^\d+(\.\d{1,2})?$/;
          if (!reg.test(this.carLen)) {
            this.$vux.toast.text("输入的车长不符合规则~~~", "middle");
            return false;
          }
          this.formData.cartLength = this.carLen + "米";
          return false;
        }
      }
      this.formData.cartLength = this.carLongList[this.activeFlag3] + "米";
      this.show3 = false;
    },
    cartTypeBtn2() {
      if (this.activeFlag2 === -1) {
        this.$vux.toast.text("请选择车型~~~", "middle");
        return false;
      }
      this.formData.cartType = this.cartTypeList[this.activeFlag2];
      this.show2 = false;
    },
    onConfirmDatePicker({ text, code }) {
      this.selectDatePickerShow = false;
      this.loadingTime = text;
      // this.formData.loadingTime = code.toString();
      this.formData.loadingTime = text;
    },
    // 通过code获取地址名称
    getAddressName() {
      return value2name(this.cityIdArr, this.citys);
    },
    //非空验证通用方法
    isEmptyStr(str) {
      var pat = /^[\s]*$/;
      if (undefined == str || "" == str || null == str || pat.test(str)) {
        return true;
      }
      return false;
    },
    verifyData() {
      //始发城市必填、目的城市必填判断
      if (this.isEmptyStr(this.startPlace)) {
        this.$vux.toast.text("装货地必填！", "middle");
        return false;
      }
      if (this.isEmptyStr(this.endPlace)) {
        this.$vux.toast.text("卸货地必填！", "middle");
        return false;
      }
      //货物名称
      if (this.isEmptyStr(this.formData.goodsName)) {
        this.goodsName = this.formData.goodsName;
        this.$vux.toast.text("货物名称必填！", "middle");
        return false;
      }
      //货物数量
      if (!this.isEmptyStr(this.formData.goodsAmount)) {
        let regexp;
        regexp = /^([1-9]\d{0,6}|0)([\.]\d{0,4})?$/;
        if (!regexp.test(this.formData.goodsAmount)) {
          this.$vux.toast.text("无效的货物数量！", "middle");
          return false;
        }
      } else {
        this.$vux.toast.text("货物数量必填！", "middle");
        return false;
      }
      // 几装几卸
      if (this.isEmptyStr(this.formData.loadNumUnloadNum)) {
        this.$vux.toast.text("请几装几卸", "middle");
        return false;
      }

      // 车型
      if (this.isEmptyStr(this.formData.cartType)) {
        this.$vux.toast.text("请选择车型", "middle");
        return false;
      }
      // 车长
      if (this.isEmptyStr(this.formData.cartLength)) {
        this.$vux.toast.text("请选择你需要的车长~~~", "middle");
        return false;
      } else {
        let reg = /^\d+(\.\d{1,2})?$/;
        if (!reg.test(parseFloat(this.formData.cartLength))) {
          this.$vux.toast.text("输入的车长不符合规则~~~", "middle");
          return false;
        }
      }
      //装货时间
      if (this.isEmptyStr(this.loadingTime)) {
        this.$vux.toast.text("请选择装货时间", "middle");
        return false;
      }
      //期望运费必填！
      if (this.isEmptyStr(this.formData.expectFreight)) {
        this.$vux.toast.text("期望运费必填！", "middle");
        return false;
      }
      //结算方式
      if (this.settleType.length === 0) {
        this.$vux.toast.text("请选择结算方式", "middle");
        return false;
      }
      // //提供通行证
      // if (this.isEmptyStr(this.formData.isSupportTraffic)) {
      //   this.$vux.toast.text("请选择是否提供通行证", "middle");
      //   return false;
      // }
      // //服务要求
      // if (this.serviceRequire.length === 0) {
      //   this.$vux.toast.text("请选择服务要求", "middle");
      //   return false;
      // }
      // //特殊说明
      // if (this.isEmptyStr(this.formData.specialExplain)) {
      //   this.$vux.toast.text("特殊说明必填！", "middle");
      //   return false;
      // }
      return true;
    },
    // 最后保存数据
    saveData() {
      if (this.verifyData()) {
        let json = {
          goodsId: this.formData.goodsId,
          loadingProvinceName: this.formData.loadingProvinceName,
          loadingCityName: this.formData.loadingCityName,
          loadingCountyName: this.formData.loadingCountyName
            ? this.formData.loadingCountyName
            : "",
          unloadingProvinceName: this.formData.unloadingProvinceName,
          unloadingCityName: this.formData.unloadingCityName,
          unloadingCountyName: this.formData.unloadingCountyName
            ? this.formData.unloadingCountyName
            : "",

          loadingProvinceId: this.formData.loadingProvinceId,
          loadingCityId: this.formData.loadingCityId,
          loadingCountyId: this.formData.loadingCountyId
            ? this.formData.loadingCountyId
            : "",
          unloadingProvinceId: this.formData.unloadingProvinceId,
          unloadingCityId: this.formData.unloadingCityId,
          unloadingCountyId: this.formData.unloadingCountyId
            ? this.formData.unloadingCountyId
            : "",

          goodsName: this.formData.goodsName,
          goodsAmount: this.formData.goodsAmount,
          goodsAmountType: this.goodsAmountType.key,
          loadNumUnloadNum: this.formData.loadNumUnloadNum,
          cartLength: parseFloat(this.formData.cartLength),
          cartType: this.formData.cartType,
          loadingTime: this.formData.loadingTime,
          expectFreight: this.formData.expectFreight,
          settleType: this.settleType.toString(),
          isSupportTraffic: this.formData.isSupportTraffic,
          serviceRequire: this.serviceRequire.toString(),
          specialExplain: this.formData.specialExplain,
          userId: this.formData.klbUserId,
          userName: this.formData.klbUserName,
          operatorRole: 2
        };
        console.log(json);
        this.$store.commit("updateLoadingStatus", { isLoading: true });
        modifyGoodsResource(json).then(res => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          if (res.data.reCode == "0") {
            this.$vux.toast.text("保存成功~~", "middle");
            window.sessionStorage.setItem("changType", 1);
            setTimeout(() => {
              this.$router.push({
                path: "/deliveryDetail",
                query: {
                  goodsId: this.formData.goodsId
                }
              });
            }, 1000);
          } else {
            this.$vux.toast.text(res.data.reInfo, "middle");
          }
        });
      }
    }
  }
};
</script>
<style lang="less">
.modify-delivery {
  width: 100%;
  text-align: left;
  background-color: #efefef;
  position: absolute;
  top: 0px;
  min-height: 100%;
  height: auto;
  .sub_page_base {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    box-sizing: border-box;
    padding-top: 45px;
    background: #efefef;
  }
  @media screen and (max-width: 320px) {
    .demo2-item {
      min-width: 44px !important;
      padding: 3px !important;
    }
  }
  .weui-cell__ft {
    color: #202020;
  }
  .img1 {
    width: 8px;
    height: 8px;
  }
  .demo1-item {
    background: #bebebe;
    padding: 0 4px;
    margin: 2px;
    border-radius: 6px;
    color: #fff;
  }
  .demo1-item-selected {
    background: #1581cf;
  }
  .demo2-item {
    background: #bebebe;
    padding: 5px;
    margin: 0 5px;
    border-radius: 2px;
    color: #fff;
    min-width: 55px;
    text-align: center;
  }
  .demo2-item-selected {
    background: #1581cf;
  }
  .car-msg-choose {
    width: 100%;
    min-height: 56px;
    height: auto;
    display: flex;
    flex-wrap: wrap;
    background-color: #fff;
    padding: 20px 10px;
    box-sizing: border-box;
    .car-choose-btn {
      width: 44%;
      text-align: center;
      height: 2rem;
      line-height: 2rem;
      border-radius: 0.3125rem;
      color: #797979;
      background: #f6f6f6;
      margin: 0.625rem 0.5rem;
    }
    .choose-btn-active {
      background-color: #15499a;
      color: #fff;
    }
  }
  .radio-group {
    padding: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 16px;
    .van-radio {
      margin-right: 10px;
    }
    .checked {
      .van-radio__label {
        color: #1581cf;
      }
    }
  }
  .van-radio__icon--checked .van-icon {
    background-color: #1581cf !important;
    border-color: #1581cf !important;
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
  #footer {
    height: 5rem;
  }
  #button {
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
}
</style>
