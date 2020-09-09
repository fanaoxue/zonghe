<template>
  <div class="delivery-detail">
    <c-header :isShowTitle="true">
      <van-nav-bar title="发货详情" left-arrow fixed @click-left="goBack"></van-nav-bar>
    </c-header>
    <div class="content sub_page_base" v-show="pageShow">
      <group label-width="6.0em" label-align="right">
        <cell title="发货时间：" value-align="left" v-show="dataResult.createdTime">
          <span>{{ dataResult.createdTime }}</span>
        </cell>
        <cell title="匹配时间：" value-align="left" v-show="dataResult.matchTime">
          <span>{{ dataResult.matchTime }}</span>
        </cell>
        <cell title="装 货 地：" value-align="left">
          <span>{{ dataResult.loadingProvinceName + dataResult.loadingCityName}}{{dataResult.loadingCountyName |emptyVal}}</span>
        </cell>
        <cell title="卸 货 地：" value-align="left">
          <span>{{ dataResult.unloadingProvinceName + dataResult.unloadingCityName}}{{dataResult.unloadingCountyName |emptyVal}}</span>
        </cell>
        <cell title="货物名称：" value-align="left" v-show="dataResult.goodsName">
          <span>{{ dataResult.goodsName }}</span>
        </cell>
        <cell title="货物数量：" value-align="left" v-show="dataResult.goodsAmount">
          <span>
            {{ dataResult.goodsAmount }}
            <span v-if="dataResult.goodsAmountType == 0">吨</span>
            <span v-else-if="dataResult.goodsAmountType == 1">方</span>
            <span v-else-if="dataResult.goodsAmountType == 2">件</span>
            <span v-else>车</span>
          </span>
        </cell>
        <cell title="几装几卸：" value-align="left" v-show="dataResult.loadNumUnloadNum">
          <span>{{ dataResult.loadNumUnloadNum }}</span>
        </cell>
        <cell title="车 型：" value-align="left" v-show="dataResult.cartType">
          <span>{{ dataResult.cartType }}</span>
        </cell>
        <cell title="车 长：" value-align="left" v-show="dataResult.cartLength">
          <span>{{ dataResult.cartLength }}米</span>
        </cell>
      </group>
      <group label-width="6.0em" label-align="right">
        <cell title="装货时间：" value-align="left" v-show="dataResult.loadingTime">
          <span>{{ dataResult.loadingTime }}</span>
        </cell>
        <cell title="期望运费：" value-align="left" v-show="dataResult.expectFreight">
          <span>{{dataResult.expectFreight}}元</span>
        </cell>
        <cell title="结算方式：" value-align="left" v-show="dataResult.settleType">
          <span>{{dataResult.settleType}}</span>
        </cell>
        <cell title="提供通行证：" value-align="left" v-show="dataResult.isSupportTraffic">
          <span v-if="dataResult.isSupportTraffic == 0">否</span>
          <span v-else>是</span>
        </cell>
        <cell title="服务要求：" value-align="left" v-show="dataResult.serviceRequire">
          <span>{{dataResult.serviceRequire}}</span>
        </cell>
        <cell title="特殊说明：" value-align="left" v-show="dataResult.specialExplain">
          <span>{{dataResult.specialExplain}}</span>
        </cell>
      </group>
      <group label-width="6.0em" label-align="right" v-show="dataResult.driverName">
        <cell title="车牌号码：" value-align="left" v-show="dataResult.cartBadgeNo">
          <span>{{dataResult.cartBadgeNo}}</span>
        </cell>
        <cell title="司机姓名：" value-align="left" v-show="dataResult.driverName">
          <span>{{dataResult.driverName}}</span>
        </cell>
        <cell title="司机手机：" value-align="left" v-show="dataResult.driverMobileNo">
          <span>{{dataResult.driverMobileNo}}</span>
          <img
            src="../../assets/imgs/wbs/dianhua_icon@2x.png"
            alt
            width="15px"
            @click="dialNumber(dataResult.driverMobileNo)"
          />
        </cell>
      </group>
      <div id="footer"></div>
      <div id="button" v-show="!(dataResult.goodsState == 3 || dataResult.goodsState == 4)">
        <x-button
          @click.native="modifyWaybill"
          type="primary"
          v-if="dataResult.goodsState == '0' || dataResult.goodsState == '1'"
        >修改</x-button>
        <x-button @click.native="confirmBuildWaybill(dataResult)" type="primary" v-else>确认建单</x-button>
      </div>
    </div>
  </div>
</template>
<script>
import { NavBar } from "vant";
import {
  AppFinish,
  AppHowtoBack,
  AppGotoTell,
  openNewWindow,
  finishCallBack,
  systemType
} from "../../utils/app.js";
import { goodsResourceDetail } from "../../api/transOrganize.js";
import Const from "@/utils/const.js";
export default {
  components: {
    vanNavBar: NavBar
  },
  data() {
    return {
      isFrom: this.$route.query.isFrom, // 0 客户端 1 H5
      goodsId: this.$route.query.goodsId,
      // goodsState: this.$route.query.goodsState, // 货源状态
      pageShow: false,
      backDisabled: false,
      dataResult: {}
    };
  },
  beforeRouteEnter(to, from, next) {
    if (from.name == "modifyDelivery") {
      if (window.sessionStorage.getItem("changType")) {
        next(vm => {
          vm.backDisabled = true;
          window.sessionStorage.removeItem("changType");
        });
      }
    }
    next();
  },
  filters: {
    emptyVal(val) {
      if (val == "" || val == null || val == "undefined") {
        return "";
      }
      return val;
    }
  },
  created() {},
  mounted() {
    this.datdaInit();
  },
  methods: {
    datdaInit() {
      goodsResourceDetail({ goodsId: this.goodsId }).then(res => {
        this.$store.commit("updateLoadingStatus", { isLoading: false });
        if (res.data.reCode == "0") {
          this.dataResult = res.data.result;
        } else {
          this.$vux.toast.text(res.data.reInfo, "middle");
        }
        this.pageShow = true;
      });
    },
    goBack() {
      // AppHowtoBack("1");
      // this.$router.replace({
      //   path: "/deliveryGoodsRecord",
      //   query: {
      //     goodsId: this.goodsId
      //   }
      // });
      if (this.backDisabled) {
        finishCallBack({ methodName: "javascript:AppJSApi_finishCallBack1()" });
      } else {
        AppFinish(-1);
      }
    },
    modifyWaybill() {
      this.$router.push({
        path: "/modifyDelivery",
        query: {
          goodsId: this.goodsId
        }
      });
    },
    confirmBuildWaybill(item) {
      let sysType = systemType();
      if (sysType === 0) {
        this.$router.push({
          path: "/wayBillInfo",
          query: {
            goodsId: item.goodsId
          }
        });
      } else {
        const url = `${Const.APP_URL}/wayBillInfo?goodsId=${item.goodsId}`;
        openNewWindow({ url });
      }
    },
    dialNumber(item) {
      AppGotoTell(item);
    }
  }
};
</script>
<style lang="less">
.delivery-detail {
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
  .weui-cell:before {
    border: none;
  }
  .weui-cells {
    padding: 0.5em 0;
  }
  .weui-cell {
    padding: 5px !important;
    .weui-cell__ft {
      color: #202020;
      word-break: break-all;
    }
    p {
      color: #797979;
    }
  }
  #footer {
    height: 3.5rem;
  }
  #button {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    .weui-btn_primary {
      background-color: #15499a !important;
      border-radius: 0;
    }
  }
}
</style>