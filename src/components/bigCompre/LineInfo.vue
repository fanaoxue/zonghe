<template>
  <div class="line_info">
    <c-header isShowTitle>
      <van-nav-bar
        title="线路信息"
        left-arrow
        fixed
        @click-left="onClickLeft"
      ></van-nav-bar>
    </c-header>
    <div class="sub_page_base">
      <div class="content">
        <div class="startPlace_top">
          <div><i class="iconfont icondingwei"></i>请完善装货地信息</div>
          <img
            src="../../assets/imgs/bigCompre/loading_icon@2x.png"
            alt=""
            class="loading_icon"
          />
        </div>
        <van-cell-group>
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
      </div>
      <div class="content">
        <div class="endPlace_top">
          <div><i class="iconfont icondingwei"></i>请完善卸货地信息</div>
          <img
            src="../../assets/imgs/bigCompre/unloading_icon@2x.png"
            alt=""
            class="unloading_icon"
          />
        </div>
        <van-cell-group>
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
      <div class="footer">
        <van-button
          type="primary"
          size="large"
          :disabled="disabledState"
          @click="nextStep"
          >下一步</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { NavBar, CellGroup, Field, Button } from "vant";
import { cityDataToIWant, value2name } from "@/utils/cMethods";
import { setNativeHead } from "../../utils/app.js";
import { mapState } from "vuex";
export default {
  components: {
    vanNavBar: NavBar,
    vanCellGroup: CellGroup,
    vanField: Field,
    vanButton: Button
  },
  name: "LineInfo",
  data() {
    return {
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

        loadingAddressName: "",
        unloadingAddressName: "",

        loadingDetailAddress: "", // 装货地详细地址
        unloadingDetailAddress: "" //卸货地详细地址
      },
      citys: cityDataToIWant(window.city.data),
      cityIdArr: "",
      startPlace: "",
      endPlace: ""
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
  computed: {
    disabledState() {
      if (
        this.$utils.isNotEmpty(this.startPlace) &&
        this.$utils.isNotEmpty(this.formData.loadingAddressName) &&
        this.$utils.isNotEmpty(this.endPlace) &&
        this.$utils.isNotEmpty(this.formData.unloadingAddressName)
      ) {
        return false;
      }
      return true;
    },
    ...mapState("bigCompre/", {
      lineInfo: state => state.lineInfo
    })
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
  created() {},
  mounted() {},
  methods: {
    onClickLeft() {
      this.$router.back();
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
    nextStep() {
      this.$store.commit("bigCompre/setLineInfo", this.formData);
      this.$router.push('/OtherInfo')
    }
  }
};
</script>
<style lang="less" scoped>
.line_info {
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
  .sub_page_base {
    text-align: left;
    min-height: 100vh;
    box-sizing: border-box;
    padding-top: 46px;
    background: #efefef;
    display: flex;
    flex-direction: column;
    .content {
      overflow: hidden;
      margin: 10px 10px 0px 10px;
      border-radius: 5px;
      box-shadow: 0px 0px 5px 0px rgba(160, 165, 170, 0.3);
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
</style>
