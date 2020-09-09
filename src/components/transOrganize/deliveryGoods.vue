<template>
  <div class="delivery_goods">
    <c-header isShowTitle class="header">
      <van-nav-bar
        title="发货"
        left-arrow
        fixed
        @click-left="onClickLeft"
      ></van-nav-bar>
    </c-header>
    <div class="sub_page_base" v-show="page">
      <div class="content">
        <van-button class="btn">常用发货模板</van-button>
        <van-button type="default" @click="buildDeliveryGoods"
          >新建货源</van-button
        >
      </div>
      <div class="default_tips" v-show="cardList.length === 0">
        <div class="p1">
          <span class="iconfont iconleijijingyingshouyijieshi"></span>
          <i class="iconfont iconwenhao"></i>什么是常用发货模板？
        </div>
        <div class="p2">
          您可以在发货完成后保存为常用模板，便于后期直接使用模板发货，无需再次填写相关固定信息。
        </div>
        <div class="p3">当前无常用模板，请点击上方【新建货源】。</div>
      </div>
      <div class="list" v-show="cardList.length !== 0">
        <!-- vant下拉刷新组件 -->
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            :finished-text="finishedText"
            :immediate-check="false"
            :offset="100"
            @load="onLoad"
          >
            <div
              class="list-card"
              v-for="(item, index) in cardList"
              :key="index"
            >
              <!-- @click="chooseItem(item)" -->
              <div class="card-left">
                <div class="card-left-cell">
                  <div class="left-cell-title">装货地</div>
                  <div class="maohao">：</div>
                  <div class="left-cell-value blue">
                    {{ item.startAddress }}
                  </div>
                </div>
                <div class="card-left-cell">
                  <div class="left-cell-title">卸货地</div>
                  <div class="maohao">：</div>
                  <div class="left-cell-value blue">{{ item.endAddress }}</div>
                </div>
                <div class="card-left-cell">
                  <div class="left-cell-title">车辆信息</div>
                  <div class="maohao">：</div>
                  <div class="left-cell-value black">{{ item.carInfo }}</div>
                </div>
                <div class="card-left-cell">
                  <div class="left-cell-title">期望运费</div>
                  <div class="maohao">：</div>
                  <div class="left-cell-value black">
                    {{ item.expectFreight }}
                  </div>
                </div>
              </div>
              <div class="card-right">
                <div
                  class="btn"
                  @click.stop="useBtnClick(item.transportTemplateId)"
                >
                  使用
                </div>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </div>
    </div>

    <!-- 弹出层 -->
    <van-action-sheet
      v-model="cardShow"
      :actions="actions"
      @select="onSelect"
      cancel-text="取消"
      @cancel="cardShow = false"
    />
  </div>
</template>
<script>
import { NavBar, Button, List, PullRefresh, ActionSheet, Toast } from "vant";
import { AppFinish, openNewWindow, systemType } from "@/utils/app.js";
import Const from "@/utils/const.js";
import { getDeliveryGoodsTemplete } from "@/api/transOrganize.js";
import { getBaseInfo } from "@/api/api";
export default {
  name: "delivery_goods",
  data() {
    return {
      page: false,
      isLoading: false,
      cardShow: false, //模板操作弹框

      loading: false,
      finished: false,
      finishedText: "",

      actions: [
        { name: "修改", value: "modify" },
        { name: "删除", value: "delete" }
      ], //操作栏位
      pageIdx: 1,
      cardList: [],
      transportTemplateId: ""
    };
  },
  components: {
    vanNavBar: NavBar,
    vanButton: Button,
    vanList: List,
    vanPullRefresh: PullRefresh,
    vanActionSheet: ActionSheet
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name == "modify_template") {
        vm.cardShow = false;
      }
    });
  },
  mounted() {
    window.AppJSApi_finishCallBack = this.onRefresh;
    this.$store.commit("updateLoadingStatus", { isLoading: false });
    this.dataInit(this.pageIdx);
  },
  methods: {
    // 导航左侧点击
    onClickLeft() {
      AppFinish(-1);
    },
    _getBaseInfo() {
      return new Promise((resolve, reject) => {
        this.$store.commit("updateLoadingStatus", { isLoading: true });
        getBaseInfo({})
          .then(res => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode == 0) {
              resolve(res.data.result);
            } else {
              this.$vux.toast.text(res.data.reInfo, "middle");
              reject();
            }
          })
          .catch(err => {
            this.$vux.toast.text(err.message, "middle");
            reject();
          });
      });
    },
    dataInit() {
      this._getBaseInfo().then(res => {
        this.finished = false;
        this.pageIdx = "1";
        this._getDeliveryGoodsTemplete()
          .then(res => {
            this.page = true;
          })
          .catch(err => {
            this.page = true;
          });
      });
    },
    _getDeliveryGoodsTemplete() {
      return new Promise((resolve, reject) => {
        this.finishedText = "没有更多了~~";
        this.$store.commit("updateLoadingStatus", { isLoading: true });
        getDeliveryGoodsTemplete({
          pageIdx: this.pageIdx
        })
          .then(res => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.isLoading = false;
            if (res.data.reCode === "0") {
              if (this.pageIdx == "1") {
                this.cardList = res.data.result.list;
              } else {
                this.cardList.push(...res.data.result.list);
              }
              if (Number(res.data.result.list.length) < 15) {
                this.finished = true;
              }
              resolve();
            } else {
              this.$vux.toast.text(res.data.reInfo, "middle");
              reject();
            }
          })
          .catch(() => {
            this.$vux.toast.text(err.message, "middle");
            reject();
          });
      });
    },
    // 下拉刷新
    onRefresh() {
      this.pageIdx = "1";
      this.finished = false;
      this._getDeliveryGoodsTemplete();
    },
    // 上拉加载
    onLoad() {
      setTimeout(() => {
        this.pageIdx = Number(this.pageIdx) + 1;
        this._getDeliveryGoodsTemplete(this.pageIdx)
          .then(res => {})
          .catch(err => {
            Toast(err.message);
          });
        this.loading = false;
      }, 1000);
    },
    // 新建运单
    buildDeliveryGoods() {
      let sysType = systemType();
      console.log("==========" + sysType);
      if (sysType === 0) {
        this.$router.push({
          path: "/delivery_goods_first",
          pageType: "0"
        });
      } else {
        const url = `${Const.APP_URL}/delivery_goods_first?pageType=0`;
        openNewWindow({ url });
      }
    },
    // 点击使用
    useBtnClick(id) {
      let sysType = systemType();
      if (sysType === 0) {
        this.$router.push({
          path: "/delivery_goods_first",
          query: {
            transportTemplateId: id,
            pageType: "1"
          }
        });
      } else {
        const url = `${Const.APP_URL}/delivery_goods_first?transportTemplateId=${id}&pageType=1`;
        openNewWindow({ url });
      }
    },
    chooseItem(item) {
      this.transportTemplateId = item.transportTemplateId;
      this.cardShow = true;
    },
    // 模板操作
    onSelect(item) {
      this.cardShow = false;
      // 删除模板
      if (item.value === "delete") {
        this.$klb.confirm.show({
          title: "提示",
          confirmText: "确定",
          cancelText: "取消",
          content: "是否确认删除？",
          onConfirm: () => {
            deleteTemplate({
              transportTemplateId: this.transportTemplateId,
              source: "2"
            })
              .then(res => {
                Toast(res.data.reInfo);
                // 删除后 刷新数据
                this.dataInit("1", this.templateType);
              })
              .catch(() => {});
          },
          onCancel: () => {},
          onClose: () => {}
        });
      } else {
        // 修改模板
        this.$router.push({
          path: "/modify_template",
          query: {
            transportTemplateId: this.transportTemplateId
          }
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
.delivery_goods {
  /deep/.van-cell {
    font-size: 16px;
  }
  /deep/.van-pull-refresh__head {
    overflow: hidden;
    top: -60px;
  }
  .header {
    z-index: 999;
    position: fixed;
  }
  .sub_page_base {
    text-align: center;
    height: 100vh;
    box-sizing: border-box;
    padding-top: 46px;
    background: #efefef;
    display: flex;
    flex-direction: column;
    .van-button {
      width: 135px;
      height: 50px;
      margin: 20px 8px;
      border-radius: 5px;
      // font-weight: bold;
    }
    .content {
      position: relative;
      z-index: 1;
      // border: 1px solid #efefef;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      .btn {
        color: #fff;
        background: #15499a;
      }
      /deep/ .van-button--normal {
        font-size: 17px;
        font-weight: normal;
      }
    }
    .default_tips {
      background: #ffffff;
      padding: 22px 14px 27px;
      text-align: left;
      border-radius: 10px;
      margin: 0px 12px 0px 12px;
      font-size: 15px;
      font-family: PingFang SC;
      .p1 {
        color: #1581cf;
        span {
          font-size: 20px;
          margin-right: 4px;
        }
        .iconwenhao {
          margin-right: 7px;
        }
      }
      .p2 {
        font-weight: 500;
        color: rgba(69, 69, 69, 1);
        line-height: 24px;
        margin: 22px 0 20px;
      }
      .p3 {
        font-weight: bold;
      }
    }
    .list {
      // max-height: 500px;
      flex: 1;
      overflow-y: auto;
      padding-bottom: 45px;
      box-sizing: border-box;
      // margin-top: 100px;
      // .collected_list_warpper {
      //   // height: calc(~'100vh - 303px');
      //   height: 100vh;
      //   overflow: hidden;
      //   overflow-y: auto;
      // }
      .van-pull-refresh {
        overflow: visible;
      }
      &-card {
        height: auto;
        background: #ffffff;
        border-radius: 5px;
        margin: 0px 12px 16px 12px;
        padding: 10px 12px;
        font-size: 15px;
        display: flex;
        .card-left {
          flex: 4;
          &-cell {
            position: relative;
            display: flex;
            text-align: left;
            // -webkit-box-align: center;
            // -webkit-align-items: center;
            // align-items: center;
            margin: 7px auto;
            .left-cell-title {
              color: #797979;
              // width: 200px;
              min-width: 74px;
              height: 16px;
              text-align: justify;
              text-align-last: justify;
              &:after {
                display: inline-block;
                content: "";
                overflow: hidden;
                width: 100%;
                height: 0;
              }
            }
            .maohao {
              color: #797979;
              margin-left: 2px;
            }
            .left-cell-value {
              word-break: break-all;
            }
            .blue {
              color: #1581cf;
            }
            .black {
              color: #202020;
            }
          }
        }
        .card-right {
          flex: 1;
          position: relative;
          -webkit-appearance: none;
          .btn {
            position: absolute;
            top: calc(~"50% - 10px");
            left: calc(~"50% - 25px");
            border-radius: 12px;
            border: none;
            color: #fff;
            background: rgba(21, 129, 207, 1);
            // padding: 4px 12px;
            box-shadow: 0 0 0 0.5px #ddd;
            width: 60px;
            height: 25px;
            border-radius: 12px;
          }
        }
      }
    }
  }
}
</style>
