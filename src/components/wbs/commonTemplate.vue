<template>
  <div class="common-template">
    <c-header>
      <x-header :left-options="{ backText: '' }">修改常用模板</x-header>
    </c-header>
    <group label-width="6.5em" label-align="right">
      <popup-picker
        title="始发城市："
        :data="cityList"
        :columns="3"
        v-model="value3"
        show-name
        @on-hide="startValue"
        placeholder="请选择装货地"
        disabled
        @click.native="chooseCity(0)"
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
        @click.native="chooseCity(1)"
      ></popup-picker>
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
      <x-input title="货物数量：" v-model="goodsAmount" placeholder="请填写货物数量" :show-clear="false">
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
      <x-input title="运输单价：" v-model="unitPrice" placeholder="请输入货物的单价"></x-input>
    </group>
    <div id="footer" style="height: 56px;"></div>
    <div class="button">
      <x-button type="primary" @click.native="saveTemplate">保存</x-button>
    </div>
  </div>
</template>
<script>
import { AppRefreshData, AppFinish } from "../../utils/app.js";
import { cityDataToIWant } from "../../utils/cMethods";
import { checkCommonCity } from "../../api/api.js";
import { templateDetail, modTemplate } from "../../api/newBuildTemplate.js";
export default {
  name: "commonTemplate",
  data() {
    return {
      cityList: cityDataToIWant(city.data),
      bitian: require("../../assets/imgs/wbs/bitian_icon@2x.png"),
      value3: [], //起始地
      value4: [], //目的地
      goodsName: "", //货物名称
      unitPrice: "", //货物单价
      goodsAmount: "", //货物数量
      goodsAmountType: {
        key: "0",
        value: "吨"
      }, //货物数量类型  0吨  1方  2件
      items2: [
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
      cityIdArr: [],
      types: "", //判断始发还是目的城市的标志
      isDisable: true, //控制点击次数
      mWaybillTemplateId: this.$route.query.mWaybillTemplateId //模板ID
    };
  },
  watch: {
    cityIdArr() {
      if (this.cityIdArr.length != 0) {
        // this.cityIdArr = this.cityIdArr.split(',');
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
      window.localStorage.clear();
    }
  },
  beforeRouteEnter(to, from, next) {
    if (from.name === "chooseCity") {
      next(vm => {
        vm.$store.commit("updateLoadingStatus", { isLoading: false });
        vm.cityIdArr = JSON.parse(localStorage.getItem("cityIdArr"));
      });
    } else {
      next();
    }
  },
  created() {},
  mounted() {
    this.dataInit();
  },
  methods: {
    //数据初始化
    dataInit() {
      let json = {
        mWaybillTemplateId: this.mWaybillTemplateId
      };
      templateDetail(json)
        .then(res => {
          // 3056
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          if (res.data.reCode == 0) {
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
          } else {
            this.$vux.toast.text(res.data.reInfo, "middle");
          }
        })
        .catch(err => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          this.$vux.toast.text(err.message, "middle");
        });
    },
    //选择城市
    chooseCity(index) {
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
    //始发城市
    startValue() {
      var CodeArr = this.value3;
      this.startProvinceCode = CodeArr[0];
      this.startCityCode = CodeArr[1];
      this.startCountyCode = CodeArr[2];
    },
    //目的城市
    endValue() {
      var CodeArr = this.value4;
      this.endProvinceCode = CodeArr[0];
      this.endCityCode = CodeArr[1];
      this.endCountyCode = CodeArr[2];
    },
    //点击保存
    saveTemplate() {
      let startCityCode = this.value3[1];
      //始发城市必填、目的城市必填判断
      if (this.isEmptyStr(startCityCode)) {
        this.$vux.toast.text("始发城市必填！", "middle");
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
        let regexp;
        if (this.goodsAmountType.key == "0") {
          regexp = /^([1-9]\d{0,6}|0)([\.]\d{0,4})?$/;
        } else {
          regexp = /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/;
        }
        // let regexp = /^([1-9]\d{0,6}|0)([\.]\d{0,4})?$/;
        if (!regexp.test(this.goodsAmount)) {
          this.$vux.toast.text("无效的货物数量！", "middle");
          return false;
        }
      }
      //货物单位
      if (this.isEmptyStr(this.goodsAmountType.key)) {
        this.$vux.toast.text("请选择货物数量单位！", "middle");
        return false;
      }
      //运输单价
      if (!this.isEmptyStr(this.unitPrice)) {
        this.unitPrice = this.trim(this.unitPrice);
        let regExp = /^([1-9]\d{0,6}|0)([\.]\d{0,4})?$/;
        if (!regExp.test(this.unitPrice)) {
          this.$vux.toast.text("无效的运输单价！", "middle");
          return false;
        }
      }
      // 同城运输，区县必填验证
      let fromProvId = this.value3[0];
      let fromCityId = this.value3[1];
      let toCityId = this.value4[1];
      let fromCountyId = this.value3[2];
      let toCountyId = this.value4[2];
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      if (
        !this.isEmptyStr(fromProvId) &&
        !this.isEmptyStr(fromCityId) &&
        !this.isEmptyStr(toCityId)
      ) {
        checkCommonCity(
          fromProvId,
          fromCityId,
          toCityId,
          fromCountyId,
          toCountyId
        )
          .then(res => {
            if (res.data.reCode != 0) {
              this.$store.commit("updateLoadingStatus", { isLoading: false });
              this.$vux.toast.text(res.data.reInfo, "middle");
              return false;
            } else {
              this.gotoSave();
            }
          })
          .catch(err => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.$vux.toast.text(err.message, "middle");
          });
      } else {
        this.gotoSave();
      }
    },
    //保存上传
    gotoSave() {
      let json = {
        mWaybillTemplateId: this.mWaybillTemplateId,
        startProvinceId: this.value3[0],
        startCityId: this.value3[1],
        startCountyId: this.value3[2],
        endProvinceId: this.value4[0],
        endCityId: this.value4[1],
        endCountyId: this.value4[2],
        goodsName: this.goodsName, //货物名称
        goodsAmountType: this.goodsAmountType.key, //货物数量类型
        goodsAmount: this.goodsAmount, //货物数量
        unitPrice: this.unitPrice, //单价
        source: "2" //来源
      };
      modTemplate(json)
        .then(res => {
          // 3051
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          if (res.data.reCode === "0") {
            this.$vux.toast.text(res.data.reInfo, "middle");
            AppRefreshData({ type: "2" });
            setTimeout(() => {
              AppFinish(-1);
            }, 1000);
          } else {
            this.$vux.toast.text(res.data.reInfo, "middle");
          }
        })
        .catch(err => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          this.$vux.toast.text(err.message, "middle");
        });
    },
    //自定义去前后空格的方法
    trim(i) {
      return i.toString().replace(/(^\s*)|(\s*$)/g, "");
    },
    //非空验证通用方法
    isEmptyStr(str) {
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
.common-template {
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
  .weui-cell__hd {
    color: #797979;
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
  .demo2-item-selected {
    background: #1581cf;
  }
  .button {
    // position: fixed;
    // left: 0;
    // bottom: 0;
    width: 100%;
    // background: #fff;
  }
  .weui-btn_primary {
    background-color: #15499a !important;
    // margin: 1rem auto;
    width: 90% !important;
  }
}
</style>
