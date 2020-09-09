<template>
  <div class="delivery-goods-record">
    <c-header isShowTitle class="header">
      <van-nav-bar title="发货记录" left-arrow fixed @click-left="onClickLeft"></van-nav-bar>
    </c-header>
    <div class="sub_page_base">
      <div class="header_tab">
        <div class="tab-content">
          <div
            @click="checkTab(0)"
            :class="{ 'tab tab-left selected-tab ': active === 0, 'tab tab-left': active !== 0 }"
          >
            <span :class="{ 'num selected-tab': active === 0, 'num num-black': active !== 0 }">匹配中</span>
          </div>
          <div></div>
          <div
            @click="checkTab(1)"
            :class="{ 'tab selected-tab ': active === 1, tab: active !== 1 }"
          >
            <div v-if="active === 2" class="small-line-left"></div>
            <span :class="{ 'num selected-tab': active === 1, 'num num-black': active !== 1 }">已匹配</span>
            <div v-if="active === 0" class="small-line-right"></div>
          </div>
          <div
            @click="checkTab(2)"
            :class="{ 'tab tab-right selected-tab ': active === 2, 'tab tab-right': active !== 2 }"
          >
            <span :class="{ 'num selected-tab': active === 2, 'num num-black': active !== 2 }">匹配记录</span>
          </div>
        </div>
      </div>
      <div class="content">
        <van-tabs v-model="active" :animated="true">
          <van-tab title v-for="xlIndex in 3" :key="xlIndex"></van-tab>
        </van-tabs>
        <div class="detail-list-cxt">
          <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <van-list
              v-model="loading"
              :finished="finished"
              :finished-text="finishText"
              :immediate-check="false"
              @load="onLoadMoreData"
            >
              <div
                class="card"
                v-for="(item,index) in totalData"
                :key="index"
                @click="gotoDetailPage(item)"
                v-show="totalData.length !=0 "
              >
                <div class="card-top vux-1px-b">
                  <div class="top-left">
                    <img
                      src="../../assets/imgs/wbs/dingwei_icon@2x.png"
                      alt
                      width="14"
                      class="dingwei"
                    />
                    {{item.loadingProvinceName + item.loadingCityName}}
                    <img
                      src="../../assets/imgs/wbs/jiantou_icon2@2x.png"
                      alt
                      width="15"
                      class="jiantou"
                    />
                    {{item.unloadingProvinceName + item.unloadingCityName}}
                  </div>
                  <div
                    class="top-right"
                    :class="{ 'yellow':item.goodsState == 0 ||  item.goodsState == 1,'blue': item.goodsState == 2,'green': item.goodsState == 3,'grey': item.goodsState == 4}"
                  >
                    <span v-if="item.goodsState == 0 ||  item.goodsState == 1">匹配中</span>
                    <span v-else-if="item.goodsState == 2">已匹配</span>
                    <span v-else-if="item.goodsState == 3">已成交</span>
                    <span v-else>已取消</span>
                  </div>
                </div>
                <div class="card-content">
                  <div class="content-list">
                    <div class="list-left">发布时间：</div>
                    <div class="list-right">{{item.createdTime}}</div>
                  </div>
                  <div class="content-list">
                    <div class="list-left">车辆要求：</div>
                    <div class="list-right">{{item.cartLength + '米 ' + item.cartType}}</div>
                  </div>
                  <div class="content-list">
                    <div class="list-left">期望运费：</div>
                    <div class="list-right">{{item.expectFreight}}元</div>
                  </div>
                  <div class="content-list" v-show="item.driverName">
                    <div class="list-left">司机信息：</div>
                    <div class="list-right">
                      {{item.driverName + ','+ item.driverMobileNo}}
                      <img
                        src="../../assets/imgs/wbs/dianhua_icon@2x.png"
                        alt
                        width="15px"
                        @click.stop="dialNumber(item.driverMobileNo)"
                      />
                    </div>
                  </div>
                </div>
                <div class="card-footer vux-1px-t">
                  <x-button
                    type="default"
                    @click.native.stop="cancelSendGoods(item)"
                    v-show="item.goodsState == 0 ||  item.goodsState == 1"
                  >取消发货</x-button>
                  <x-button
                    type="primary"
                    @click.native.stop="sendGoodsAgain(item)"
                    v-show="item.goodsState == 0 ||  item.goodsState == 1 || item.goodsState == 3 || item.goodsState == 4 "
                  >再发一单</x-button>

                  <x-button
                    type="default"
                    @click.native.stop="sendGoodsAgain(item)"
                    v-show="item.goodsState == 2"
                  >再发一单</x-button>
                  <x-button
                    type="primary"
                    @click.native.stop="confirmBuildWaybill(item)"
                    v-show="item.goodsState == 2"
                  >确认建单</x-button>
                </div>
              </div>
            </van-list>
          </van-pull-refresh>
          <span v-show="totalData.length === 0 ">
            <div class="default" style="text-align:center;margin-top: 4em;">
              <p>暂无数据~</p>
            </div>
          </span>
        </div>
        <!-- 取消发货弹框 -->
        <div v-transfer-dom>
          <confirm
            v-model="cancelShow"
            title="取消发货"
            cancelText="暂不取消"
            confirmText="确认取消"
            @on-cancel="cancelShow = false"
            @on-confirm="onConfirm()"
          >
            <div class="card-box">
              <div class="card-top">
                <div class="top-left">
                  <img
                    src="../../assets/imgs/wbs/dingwei_icon@2x.png"
                    alt
                    width="14"
                    class="dingwei"
                  />
                  {{confirmData.loadingProvinceName + confirmData.loadingCityName}}
                  <img
                    src="../../assets/imgs/wbs/jiantou_icon2@2x.png"
                    alt
                    width="15"
                    class="jiantou"
                  />
                  {{confirmData.unloadingProvinceName + confirmData.unloadingCityName}}
                </div>
              </div>
              <div class="card-content">
                <div class="content-list">
                  <div class="list-left">发货时间：</div>
                  <div class="list-right">{{confirmData.createdTime}}</div>
                </div>
                <div class="content-list">
                  <div class="list-left">车辆要求：</div>
                  <div class="list-right">{{confirmData.cartLength + '米 ' + confirmData.cartType}}</div>
                </div>
                <div class="content-list">
                  <div class="list-left">期望运费：</div>
                  <div class="list-right">{{confirmData.expectFreight}}元</div>
                </div>
              </div>
            </div>
          </confirm>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { NavBar, Tab, Tabs, List, PullRefresh } from "vant";
import { setNativeHead, AppGotoTell, AppFinish } from "../../utils/app.js";
import { openNewWindow, systemType } from "@/utils/app.js";
import Const from "@/utils/const.js";
import {
  goodsResourceList,
  cancelGoodsResource
} from "../../api/transOrganize.js";
export default {
  components: {
    vanNavBar: NavBar,
    vanTab: Tab,
    vanTabs: Tabs,
    vanList: List,
    vanPullRefresh: PullRefresh
  },
  data() {
    return {
      isFrom: this.$route.query.isFrom, // 0 客户端 1 H5
      cancelShow: false,
      isLoading: false, // 下拉刷新状态
      loading: false, // 上拉加载状态
      finished: false, // 是否已完成加载所有数据
      finishText: "",
      confirmData: {
        loadingProvinceName: "",
        loadingCityName: "",
        unloadingProvinceName: "",
        unloadingCityName: "",
        createdTime: "",
        cartLength: "",
        cartType: "",
        expectFreight: ""
      },
      dataResult: {},
      total: {
        cartCount: "0",
        relevanceCartCount: "0",
        unRelevanceCartCount: "0"
      },
      totalData: [],
      active: this.$route.query.active || 0,
      pageIdx: 1,
      pageSize: 30,
      goodsState: "0,1"
    };
  },
  beforeRouteEnter(to, from, next) {
    let json = { isShow: "0" };
    setNativeHead(json);
    if (
      from.name == "delivery_goods_first" ||
      from.name == "wayBillInfo" ||
      from.name == "delivery_goods_success"
    ) {
      next(vm => {
        vm.$store.commit("updateLoadingStatus", { isLoading: false });
      });
    } else if (from.name == "wayBillSuccess" || from.name == "deliveryDetail") {
      next(vm => {
        console.log("回来了");
        vm.$store.commit("updateLoadingStatus", { isLoading: false });
        vm.datdaInit(1);
      });
    }
    next();
  },
  mounted() {
    window.AppJSApi_finishCallBack1 = this.onRefresh;
    this.datdaInit(1);
  },
  methods: {
    onClickLeft() {
      AppFinish(-1);
    },
    // 下拉刷新
    onRefresh() {
      console.log("触发刷新！!");
      // this.isLoading = false;
      this.pageIdx = 1;
      this.datdaInit(this.pageIdx);
    },
    // 上拉加载
    onLoadMoreData() {
      console.log("触发加载~~");
      this.finished = false;
      this.pageIdx++;
      goodsResourceList({
        pageIdx: this.pageIdx,
        pageSize: this.pageSize,
        goodsState: this.goodsState
      }).then(res => {
        if (res.data.reCode == "0") {
          if (res.data.result.goodsList.length < 30) {
            this.totalData = this.totalData.concat(res.data.result.goodsList);
            this.loading = false;
            this.finished = true;
            if (this.totalData.length === 0) {
              this.finishText = "";
            } else {
              this.finishText = "没有更多了~~";
            }
          } else {
            this.totalData = this.totalData.concat(res.data.result.goodsList);
            this.loading = false;
          }
        } else {
          this.$vux.toast.text(res.data.reInfo, "middle");
        }
      });
    },
    datdaInit(yema) {
      console.log("刷数据");
      let json = {
        goodsState:
          this.active == 0 ? "0,1" : this.active == 1 ? "2" : this.goodsState,
        pageIdx: yema,
        pageSize: this.pageSize
      };
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      goodsResourceList(json).then(res => {
        this.finished = false;
        this.isLoading = false;
        this.$store.commit("updateLoadingStatus", { isLoading: false });
        if (res.data.reCode === "0") {
          this.totalData = res.data.result.goodsList;
        } else {
          this.$vux.toast.text(res.data.reInfo, "middle");
        }
      });
    },
    checkTab(index) {
      this.active = index;
      console.log(index);
      window.scrollTo(0, 0);
      this.pageIdx = 1;
      this.finished = false;
      this.finishText = "";
      if (index == 0) {
        this.goodsState = "0,1";
      } else if (index == 1) {
        this.goodsState = "2";
      } else {
        this.goodsState = "3,4";
      }
      this.datdaInit(1);
    },
    cancelSendGoods(item) {
      Object.assign(this.confirmData, item);
      this.cancelShow = true;
    },
    onConfirm() {
      let json = {
        goodsId: this.confirmData.goodsId,
        userId: this.confirmData.userId,
        userName: this.confirmData.klbUserName,
        operatorRole: "0"
      };
      cancelGoodsResource(json).then(res => {
        if (res.data.reCode == "0") {
          this.datdaInit(1);
        } else {
          this.$vux.toast.text(res.data.reInfo, "middle");
        }
      });
    },
    sendGoodsAgain(item) {
      let sysType = systemType();
      if (sysType === 0) {
        this.$router.push({
          path: "/delivery_goods_first",
          query: {
            goodsId: item.goodsId,
            pageType: "2"
          }
        });
      } else {
        const url = `${Const.APP_URL}/delivery_goods_first?pageType=2&goodsId=${item.goodsId}`;
        openNewWindow({ url });
      }
      // Object.assign(item, { wbBusinessType: "2" });
      // window.localStorage.setItem("sendGoodsInfo", JSON.stringify(item));
    },
    waybillAgain() {},
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
    },
    gotoDetailPage(item) {
      let sysType = systemType();
      if (sysType === 0) {
        this.$router.push({
          path: "/deliveryDetail",
          query: {
            goodsId: item.goodsId
          }
        });
      } else {
        const url = `${Const.APP_URL}/deliveryDetail?goodsId=${item.goodsId}`;
        openNewWindow({ url });
      }
    }
  }
};
</script>
<style lang="less">
@import "~vux/src/styles/1px.less";
.weui-dialog .weui-dialog__ft {
  padding-bottom: 10px !important;
}
.weui-dialog .weui-dialog__bd .card-box {
  font-size: 14px;
  min-height: 150px !important;
  background: #fff;
  position: relative;
  .card-top {
    min-height: 30px;
    height: auto;
    display: flex;
    text-align: left;
    margin-bottom: 10px;
    .top-left {
      flex: 4;
      color: #121212;
      text-align: left;
      .dingwei {
        vertical-align: sub;
        width: 14px;
      }
      .jiantou {
        margin-bottom: 3px;
      }
    }
  }
  .card-content {
    height: auto;
    font-size: 14px;
    .content-list {
      display: flex;
      padding: 4px 0px;
      min-height: 20px;
      line-height: 20px;
      .list-left {
        color: #797979;
        width: auto;
        text-align: left;
      }
      .list-right {
        color: #202020;
        width: auto;
        max-width: 200px;
        word-break: break-word;
        text-align: left;
        img {
          vertical-align: middle;
        }
        @media screen and (max-width: 320px) {
          max-width: 110px;
        }
      }
    }
  }
}
.delivery-goods-record {
  width: 100%;
  text-align: left;
  background-color: #efefef;
  position: absolute;
  top: 0px;
  min-height: 100%;
  height: auto;
  @media screen and (max-width: 320px) {
    font-size: 14px;
    .weui-btn {
      font-size: 14px !important;
    }
  }
  .sub_page_base {
    text-align: center;
    min-height: 100vh;
    box-sizing: border-box;
    padding-top: 46px;
    background: #efefef;
  }
  .header_tab {
    z-index: 2;
    background: #efefef;
    position: fixed;
    width: 100%;
    display: block;
    .tab-content {
      width: calc(100% - 32px);
      margin: 20px 15px 20px 15px;
      text-align: center;
      display: inline-block;
      font-size: 14px;
      color: #202020;
      background: #ffffff;
      border: 1px solid #fcfcfc;
      border-radius: 5px;
      display: flex;
      position: relative;
      height: 50px;
    }
    .tab {
      width: 33.33%;
      float: left;
      /*padding: 5px 0;*/
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-color: #dfdfdf;
    }
    .selected-tab {
      background: #15499a;
      font-weight: 400;
      color: #ffffff;
    }
    .tab-left {
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
    }
    .tab-right {
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
    }
    .tab .num {
      font-size: 17px;
    }
    .num-black {
      color: #202020;
    }
    .small-line-left {
      position: absolute;
      width: 1px;
      height: 3.2rem;
      background-color: #dfdfdf;
      left: 33.33%;
      top: 0.01rem;
    }
    .small-line-right {
      position: absolute;
      width: 1px;
      height: 3.2rem;
      background-color: #dfdfdf;
      left: 66.66%;
      top: 0.01rem;
    }
  }
  .van-tabs__line {
    width: 0px !important;
  }
  .van-tabs--line {
    padding-top: 0px;
  }
  .van-tabs--line .van-tabs__wrap {
    display: none;
  }
  .detail-list-cxt {
    // width: 100%;
    // min-height: 16px;
    // height: auto;
    .card {
      min-height: 190px;
      border-radius: 4px;
      background: #fff;
      position: relative;
      margin-bottom: 10px;
      .card-top {
        min-height: 30px;
        height: auto;
        padding: 5px 5px 5px 10px;
        display: flex;
        .top-left {
          flex: 4;
          color: #121212;
          text-align: left;
          .dingwei {
            vertical-align: sub;
            width: 14px;
          }
          .jiantou {
            margin-bottom: 3px;
          }
        }
        .top-right {
          text-align: center;
          flex: 1;
        }
        .yellow {
          color: #ffba00;
        }
        .blue {
          color: #15499a;
        }
        .grey {
          color: #9f9f9f;
        }
        .green {
          color: #28b072;
        }
      }
      .card-content {
        height: auto;
        padding: 10px;
        font-size: 14px;
        .content-list {
          display: flex;
          padding: 4px 0px;
          min-height: 20px;
          line-height: 20px;
          .list-left {
            color: #797979;
            width: auto;
            text-align: left;
          }
          .list-right {
            color: #202020;
            width: auto;
            max-width: 200px;
            word-break: break-word;
            text-align: left;
            img {
              vertical-align: middle;
            }
          }
        }
      }
      .card-footer {
        width: 100%;
        height: auto;
        text-align: right;
        padding: 10px;
        box-sizing: border-box;
        .weui-btn {
          font-size: 15px !important;
          width: 100px;
          padding: 0px;
          display: inline-block;
          border-radius: 25px;
          padding: 2px;
          margin: 0px;
          line-height: 2 !important;
        }
        .weui-btn_default {
          color: #15499a;
          border: 1px solid #15499a;
          background-color: #ffffff;
          margin-right: 12px;
        }
        .weui-btn_primary {
          background-color: #15499a;
        }
      }
    }
  }
  .content {
    margin: 95px 15px 25px 15px;
  }
}
</style>
