<template>
  <div class="delivery_goods_first">
    <c-header isShowTitle>
      <van-nav-bar title="发布货源" left-arrow fixed @click-left="onClickLeft"></van-nav-bar>
    </c-header>
    <div class="sub_page_base">
      <div class="gray"></div>
      <div class="content">
        <van-cell-group>
          <van-field
            v-model="startPlace"
            label="装货地："
            placeholder="请选择装货地"
            right-icon="arrow"
            @click="chooseStCity(0)"
            required
            readonly
          />
          <van-field
            v-model="endPlace"
            label="卸货地："
            placeholder="请选择卸货地"
            right-icon="arrow"
            @click="chooseStCity(1)"
            required
            readonly
          />
          <van-field
            v-model.trim="formData.goodsName"
            label="货物名称："
            placeholder="请输入货物名称"
            required
            clearable
          />
          <van-field
            v-model.trim="formData.goodsAmount"
            label="货物数量："
            type="number"
            placeholder="请输入货物数量"
            required
            clearable
          >
            <div slot="right-icon">
              <van-radio-group v-model="formData.goodsAmountType" class="goods-amount-type-box">
                <van-radio name="0">
                  <div
                    slot="icon"
                    slot-scope="props"
                    class="goods-amount-type-item"
                    :class="props.checked ? 'active' : 'inactive'"
                  >吨</div>
                </van-radio>
                <van-radio name="1">
                  <div
                    slot="icon"
                    slot-scope="props"
                    class="goods-amount-type-item"
                    :class="props.checked ? 'active' : 'inactive'"
                  >方</div>
                </van-radio>
                <van-radio name="2">
                  <div
                    slot="icon"
                    slot-scope="props"
                    class="goods-amount-type-item"
                    :class="props.checked ? 'active' : 'inactive'"
                  >件</div>
                </van-radio>
                <van-radio name="3">
                  <div
                    slot="icon"
                    slot-scope="props"
                    class="goods-amount-type-item"
                    :class="props.checked ? 'active' : 'inactive'"
                  >车</div>
                </van-radio>
              </van-radio-group>
            </div>
          </van-field>
          <van-field
            v-model="formData.loadNumUnloadNum"
            label="几装几卸："
            placeholder="请选择"
            right-icon="arrow"
            @click="loadNumUnloadNumShow = true"
            required
            readonly
          />
        </van-cell-group>
        <div class="gray"></div>
        <van-cell-group>
          <van-field
            v-model="formData.cartType"
            label="车型："
            placeholder="请输入车型"
            right-icon="arrow"
            readonly
            required
            @click="showCartTypeActions"
          />
          <van-field
            v-model="formData.cartLength"
            label="车长(米)："
            placeholder="请输入车长"
            right-icon="arrow"
            readonly
            required
            @click="showCartLength"
          />
        </van-cell-group>
      </div>
      <div class="footer">
        <van-button @click="nextClick()" type="primary" size="large">下一步</van-button>
      </div>
    </div>
    <!-- 选择车型 -->
    <van-action-sheet
      v-model="cartTypeActionsShow"
      close-on-click-action
      :actions="cartTypeActions"
      @select="onSelectCartType"
    />

    <!-- 更多车型 -->
    <van-popup v-model="moreCartTypeShow" position="bottom" :overlay="true">
      <selectPopup
        title="更多车型"
        :arrayList="cartTypeList"
        @on-cancle="moreCartTypeShow = false"
        @on-submit="submitMoreCartType"
      ></selectPopup>
    </van-popup>

    <!-- 选择车长 -->
    <van-popup v-model="cartLengthShow" position="bottom" :overlay="true">
      <selectPopup
        :arrayList="cartLengthList"
        :inputShow="true"
        title="请选择车长(米)"
        inputUnit="米"
        inputPlaceholder="请输入车长"
        @on-cancle="cartLengthShow = false"
        @on-submit="submitCartLength"
      ></selectPopup>
    </van-popup>

    <!-- 几装几卸  -->
    <van-popup v-model="loadNumUnloadNumShow" position="bottom" :overlay="true">
      <selectPopup
        :arrayList="loadNumUnloadNumList"
        title="几装几卸"
        BtnClassName="car_msg_choose_2"
        @on-cancle="loadNumUnloadNumShow = false"
        @on-submit="submitloadNumUnloadNum"
      ></selectPopup>
    </van-popup>
  </div>
</template>

<script>
import {
  NavBar,
  Button,
  CellGroup,
  Field,
  Radio,
  RadioGroup,
  ActionSheet,
  Popup
} from "vant";
import selectPopup from "@/components/common/selectPopup";
import { cityDataToIWant, value2name } from "@/utils/cMethods";
import { getTempleteDetails, goodsResourceDetail } from "@/api/transOrganize";
import { AppFinish, setNativeHead } from "@/utils/app.js";
export default {
  name: "delivery_goods_first",
  data() {
    return {
      transportTemplateId: this.$route.query.transportTemplateId,
      goodsId: this.$route.query.goodsId,
      pageType: this.$route.query.pageType?this.$route.query.pageType:'0', // 0 新建， 1 模板，2 再发一单（发货记录），3 再发一单（发货成功）
      citys: cityDataToIWant(window.city.data),
      cityIdArr: "",
      startPlace: "",
      endPlace: "",
      formData: {
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

        goodsName: "",
        goodsAmount: "",
        goodsAmountType: "0",
        loadNumUnloadNum: "",
        cartLength: "",
        cartType: ""
      },
      cartLengthShow: false,
      cartTonnageShow: false,
      moreCartTypeShow: false,
      cartTypeActionsShow: false,
      loadNumUnloadNumShow: false,
      cartTypeActions: [
        { name: "厢式" },
        { name: "半挂" },
        { name: "高低板" },
        { name: "更多>>", fn: "showMoreCartType" }
      ],
      cartTypeList: [
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
        { type: "其他" }
      ],
      cartLengthList: [
        { type: "4.2米" },
        { type: "6.8米" },
        { type: "8.7米" },
        { type: "9.6米" },
        { type: "13米" },
        { type: "17.5米" }
      ],
      loadNumUnloadNumList: [
        { type: "一装一卸" },
        { type: "一装两卸" },
        { type: "两装一卸" },
        { type: "两装两卸" }
      ]
    };
  },
  components: {
    vanNavBar: NavBar,
    vanButton: Button,
    vanCellGroup: CellGroup,
    vanField: Field,
    vanRadio: Radio,
    vanRadioGroup: RadioGroup,
    vanActionSheet: ActionSheet,
    vanPopup: Popup,
    selectPopup
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
    if (from.name === "chooseCity") {
      next(vm => {
        vm.$store.commit("updateLoadingStatus", { isLoading: false });
        vm.cityIdArr = JSON.parse(localStorage.getItem("cityIdArr"));
      });
    } else if (from.name === "delivery_goods_success") {
      // 再建一单
      next(vm => {
        vm.$store.commit("updateLoadingStatus", { isLoading: false });
        vm.pageType = "3";
      });
    } else {
      next(vm => {
        vm.$store.commit("updateLoadingStatus", { isLoading: false });
      });
    }
  },
  mounted() {
    if (this.pageType==='1') {
      this.dataInit();
    } else  if (this.pageType==='2'){
      this._goodsResourceDetail()
    }
  },
  methods: {
    // 导航左侧点击
    onClickLeft() {
      // this.$router.back()
      AppFinish(-1);
    },
    //清空数据
    // clearData() {
    //   this.$store.commit("cleareDeliveryGoods");
    //   this.startPlace = ''
    //   this.endPlace = ''
    //   this.formData = {
    //     loadingProvinceName: '',
    //     loadingCityName: '',
    //     loadingCountyName: '',
    //     unloadingProvinceName: '',
    //     unloadingCityName: '',
    //     unloadingCountyName: '',

    //     loadingProvinceId:'',
    //     loadingCityId:'',
    //     loadingCountyId:'',
    //     unloadingProvinceId:'',
    //     unloadingCityId:'',
    //     unloadingCountyId:'',

    //     goodsName: '',
    //     goodsAmount: '',
    //     goodsAmountType: '0',
    //     loadNumUnloadNum: '',
    //     cartLength: '',
    //     cartType: ''
    //   }
    // },
    // 初始化数据
    dataInit() {
      getTempleteDetails({
        transportTemplateId: this.transportTemplateId
      }).then(res => {
        if (res.data.reCode == 0) {
          let result = res.data.result;
          // this.cityIdArr = [result.loadingCityId,result.loadingCityId,result.loadingCityId]
          this.startPlace = `${result.loadingProvinceName} ${result.loadingCityName} ${result.loadingCountyName}`;
          this.endPlace = `${result.unloadingProvinceName} ${result.unloadingCityName} ${result.unloadingCountyName}`;

          Object.keys(this.formData).forEach(key => {
            this.formData[key] = result[key];
          });
          // this.formData = Object.assign({},result)

          let updateOpions = {
            type: "deliveryGoodsTemplete",
            updatMsg: result
          };
          this.$store.commit("updateDeliveryGoods", updateOpions);
        } else {
          this.$vux.toast.text(res.data.reInfo, "middle");
        }
      });
    },
    _goodsResourceDetail(){
      goodsResourceDetail({
        goodsId: this.goodsId
      }).then(res => {
        if (res.data.reCode == 0) {
          let result = res.data.result;
          let {loadingProvinceName,loadingCityName,loadingCountyName,unloadingProvinceName,unloadingCityName,unloadingCountyName} =result
          loadingCountyName?this.startPlace=`${loadingProvinceName} ${loadingCityName} ${loadingCountyName}`:this.startPlace=`${loadingProvinceName} ${loadingCityName}`
          unloadingCountyName? this.endPlace = `${unloadingProvinceName} ${unloadingCityName} ${unloadingCountyName}`: this.endPlace = `${unloadingProvinceName} ${unloadingCityName}`
          // this.startPlace = `${loadingProvinceName} ${loadingCityName} ${loadingCountyName}`;
          // this.endPlace = `${unloadingProvinceName} ${unloadingCityName} ${unloadingCountyName}`;

          Object.keys(this.formData).forEach(key => {
            this.formData[key] = result[key];
          });

          let updateOpions = {
            type: "deliveryGoodsAgain",
            updatMsg: result
          };
          this.$store.commit("updateDeliveryGoods", updateOpions);
        } else {
          this.$vux.toast.text(res.data.reInfo, "middle");
        }
      });
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
    // 验证
    validator() {
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
        // if (this.formData.goodsAmountType == "0") {
        //   regexp = /^([1-9]\d{0,6}|0)([\.]\d{0,4})?$/;
        // } else {
        //   regexp = /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/;
        // }
        // if (!regexp.test(this.formData.goodsAmount)) {
        //   this.$vux.toast.text("无效的货物数量！", "middle");
        //   return false;
        // }
      } else {
        this.$vux.toast.text("货物数量必填！", "middle");
        return false;
      }
      // 几装几卸
      if (this.isEmptyStr(this.formData.loadNumUnloadNum)) {
        this.$vux.toast.text("请选择几装几卸", "middle");
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
        if (!reg.test(this.formData.cartLength)) {
          this.$vux.toast.text("输入的车长不符合规则~~~", "middle");
          return false;
        }
      }
      return true;
    },
    // 下一步
    nextClick() {
      if (this.validator()) {
        let updateOpions = {
          type: "deliveryGoodsFirst",
          updatMsg: this.formData
        };
        this.$store.commit("updateDeliveryGoods", updateOpions);
        this.$router.push({
          path: "/delivery_goods_second",
          query: { transportTemplateId: this.transportTemplateId, pageType:this.pageType }
        });
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
    onSelectCartType(item) {
      // 默认情况下，点击选项时不会自动关闭菜单
      // 可以通过 close-on-click-action 属性开启自动关闭
      if (item.fn) {
        this[item.fn]();
      } else {
        this.formData.cartType = item.name;
      }
    },
    // 展示选择车型
    showCartTypeActions() {
      this.cartTypeActionsShow = true;
    },
    // 展示更多车型
    showMoreCartType() {
      this.moreCartTypeShow = true;
    },
    // 展示选择车长
    showCartLength() {
      this.cartLengthShow = true;
    },
    // 更多车型确定
    submitMoreCartType(val) {
      this.moreCartTypeShow = false;
      this.formData.cartType = val;
    },
    // 展示选择车长
    submitCartLength(val) {
      this.cartLengthShow = false;
      this.formData.cartLength = val.slice(0, val.length - 1);
    },
    // 几装几卸
    submitloadNumUnloadNum(val) {
      this.loadNumUnloadNumShow = false;
      this.formData.loadNumUnloadNum = val;
    }
  }
};
</script>
<style lang="less" scoped>
.delivery_goods_first {
  background: #ffffff;
  /deep/.van-cell {
    font-size: 16px;
  }
  /deep/ .van-button--primary {
    color: #fff;
    background-color: #15499a;
    border: 1px solid #15499a;
  }
  /deep/ .van-field__label {
    text-align: justify;
    text-align-last: justify;
    color: #797979;
    display: inline-block;
    max-height: 24px;
    &:after {
      display: inline-block;
      content: "";
      overflow: hidden;
      width: 100%;
      height: 0;
    }
  }
  .van-cell--required::before {
    color: #ffba00;
  }
  .gray {
    background: #efefef;
    height: 10px;
  }
  .sub_page_base {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    box-sizing: border-box;
    padding-top: 45px;
    background: #efefef;
    .footer {
      height: 50px;
      width: 100%;
      box-sizing: border-box;
      padding: 0 25px;
      // margin-bottom: 28px;
      margin-top: 50px;
    }
    // 吨方件车
    .goods-amount-type-box {
      display: flex;
      .goods-amount-type-item {
        font-size: 15px;
        background: #bebebe;
        padding: 0 2px;
        margin: 0 2px;
        border-radius: 4px;
        color: #fff;
        &.active {
          background: #1581cf;
        }
      }
    }
    // 趟次样式
    .tangci {
      display: flex;
      .van-radio {
        margin-left: 10px;
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
      }
    }
  }
}
</style>
