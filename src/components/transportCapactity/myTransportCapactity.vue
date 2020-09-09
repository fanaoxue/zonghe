<template>
  <div class="my_transport_capactity">
    <c-header isShowTitle>
      <van-nav-bar @click-left="onClickLeft" title="我的运力" left-arrow fixed />
    </c-header>
    <div style="height:46px;"></div>
    <div class="top_header">
      <img src="../../assets/imgs/myTransportcapacity/bg@2x.png" alt width="100%" />
      <div class="mingpian">
        <div class="human">
          <div class="img_bg">
            <img
              src="../../assets/imgs/myTransportcapacity/yunlijingliren_icon@2x.png"
              alt
              class="human_pic"
            />
          </div>
          <div class="human_name">{{realName}}</div>
        </div>
        <div class="description">
          <div class="fazhan">
            <span class="dian">·</span>已发展
            <span class="number">{{total}}</span>名路优运力
          </div>
          <div class="lianjie" @click="toseeNewPage">
            <img src="../../assets/imgs/myTransportcapacity/logo@2x.png" alt class="logo" />
            <div class="know">了解路优运力>></div>
          </div>
        </div>
      </div>
    </div>
    <div class="card-content">
      <div class="card-list">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            :finished-text="finishText"
            :immediate-check="false"
            @load="onLoadMoreData"
          >
            <div class="card" v-for="(item,index) in dataResult" :key="index">
              <div class="card-top">
                <div class="top-left">
                  <div class="card-pic">{{item.driverName | namefilter}}</div>
                </div>
                <div class="top-right">
                  <p>
                    {{item.cartBadgeNo}}
                    <span class="hezuo">合作{{item.cooperateNum}}单</span>
                  </p>
                  <p>
                    {{item.driverName}}
                    <span class="blue">{{item.driverMobileNo}}</span>
                    <img
                      src="../../assets/imgs/myTransportcapacity/dianhua_icon@2x.png"
                      alt
                      class="dianhua"
                      @click="dialPhone(item.driverName,item.driverMobileNo)"
                    />
                  </p>
                  <p>{{item.cartLength}}米 {{item.cartType}}</p>
                  <p>
                    <img
                      src="../../assets/imgs/myTransportcapacity/dingwei_icon@2x.png"
                      alt
                      class="dingwei"
                    />
                    车辆位置：
                    <span
                      v-if="item.currentPosition"
                    >{{item.currentPosition}}</span>
                    <span v-else>暂无信息</span>
                  </p>
                </div>
              </div>
              <div class="line vux-1px-t"></div>
              <div class="card-bottom">
                <div class="day">已关联{{item.relDays}}天</div>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </div>
      <div class="no-data" v-show="dataResult.length === 0">暂无数据~~</div>
    </div>
  </div>
</template>
<script>
import { NavBar, Tab, Tabs, List, PullRefresh } from "vant";
import { AppFinish, AppGotoTell } from "../../utils/app.js";
import { myTransportCapactity } from "../../api/apiTC.js";
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
      dataResult: [],
      pageIdx: 1,
      pageSize: 15,
      total: "",
      realName: "",
      isLoading: false, // 下拉刷新状态
      loading: false, // 上拉加载状态
      finished: false, // 是否已完成加载所有数据
      finishText: ""
    };
  },
  filters: {
    namefilter(val) {
      return val.substr(0, 1) + "师傅";
    }
  },
  mounted() {
    this.datdaInit(this.pageIdx);
  },
  methods: {
    // 导航左侧点击
    onClickLeft() {
      AppFinish(-1);
    },
    datdaInit(item) {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      myTransportCapactity({ pageIdx: item })
        .then(res => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          this.isLoading = false;
          if (res.data.reCode == 0) {
            this.dataResult = res.data.result.list;
            this.realName = res.data.result.realName;
            this.total = res.data.result.total;
          } else {
            this.$vux.toast.text(res.data.reInfo, "middle");
          }
        })
        .catch(err => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          this.$vux.toast.text(err, "middle");
        });
    },
    // 上拉加载
    onLoadMoreData() {
      // console.log("触发加载~~");
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      this.pageIdx++;
      this.finished = false;
      myTransportCapactity({ pageIdx: this.pageIdx })
        .then(res => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          if (res.data.reCode == 0) {
            if (res.data.result.list.length < 15) {
              this.dataResult = this.dataResult.concat(res.data.result.list);
              this.loading = false;
              this.finished = true;
              if (this.dataResult.length === 0) {
                this.finishText = "";
              } else {
                this.finishText = "没有更多了~~";
              }
            } else {
              this.dataResult = this.dataResult.concat(res.data.result.list);
              this.loading = false;
            }
          } else {
            this.$vux.toast.text(res.data.reInfo, "middle");
          }
        })
        .catch(err => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          this.$vux.toast.text(err, "middle");
        });
    },
    // 下拉刷新
    onRefresh() {
      // console.log("触发刷新！!");
      this.loading = false; // 上拉加载状态
      this.finished = false; // 是否已完成加载所有数据
      this.finishText = "";
      this.pageIdx = 1;
      this.datdaInit(this.pageIdx);
    },
    toseeNewPage() {
      try {
        MtaH5.clickStat("yl_liaojieyunli");
      } catch (error) {
        JSON.stringify(error);
      }
      this.$router.push("/transCapacityInstruction");
    },
    dialPhone(name, phoneNum) {
      this.$vux1.confirm.show({
        title: "拨打电话",
        content:
          `<p style='text-align:left;padding-top:15px;'>确认拨打：<span style='color:#FFBA00;text-align:left'>` +
          phoneNum +
          `</span></p>`,
        confirmText: "确认",
        cancelText: "取消",
        onConfirm: () => {
          AppGotoTell(phoneNum);
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import "~vux/src/styles/1px.less";
.my_transport_capactity {
  width: 100%;
  background-color: #efefef;
  position: absolute;
  top: 0px;
  min-height: 100%;
  height: auto;
  color: #202020;
  .top_header {
    text-align: center;
    position: fixed;
    height: 150px;
    background-color: #efefef;
    overflow: hidden;
    z-index: 1;
    .mingpian {
      position: absolute;
      background: url("../../assets/imgs/myTransportcapacity/mingpian_bg@2x.png")
        no-repeat;
      background-size: 100% 100%;
      top: 44px;
      left: 10px;
      width: 96%;
      min-height: 100px;
      height: auto;
      .human {
        height: 50px;
        position: relative;
        padding: 0 20px;
        .img_bg {
          width: 55px;
          height: 55px;
          border: 1px solid #15499a;
          background-color: #fff;
          border-radius: 5px;
          position: absolute;
          padding: 2px;
          top: -15px;
          left: 20px;
          .human_pic {
            width: 100%;
            height: 100%;
          }
        }
        .human_name {
          position: absolute;
          font-weight: bold;
          left: 86px;
          top: 10px;
        }
      }
      .description {
        height: 50px;
        padding: 0 20px;
        position: relative;
        font-size: 14px;
        @media screen and (max-width: 320px) {
          font-size: 12px;
        }
        .fazhan {
          position: absolute;
          padding: 2px;
          top: 4px;
          left: 20px;
          .dian {
            font-size: 12px;
            font-weight: bold;
            margin-right: 2px;
          }
          .number {
            font-size: 16px;
            color: #4753e7;
            font-weight: bold;
          }
        }
        .lianjie {
          position: absolute;
          background: url("../../assets/imgs/myTransportcapacity/liaojiebg_img@2x.png")
            no-repeat;
          background-size: 100% 100%;
          top: -6px;
          right: 16px;
          width: 46%;
          height: 50px;
          .logo {
            width: 24px;
            display: inline-block;
            position: absolute;
            left: 14px;
            top: 8px;
          }
          .know {
            display: inline-block;
            position: absolute;
            left: 44px;
            top: 12px;
          }
        }
      }
    }
  }
  .card-content {
    height: auto;
    min-height: 100px;
    text-align: center;
    width: 100%;
    margin-top: 150px;
    z-index: 0;
    .card {
      width: 90%;
      min-height: 130px;
      height: auto;
      margin: 10px auto;
      padding: 5px;
      font-size: 14px;
      background-color: #fff;
      box-shadow: 1px 1px 4px 1px #ccc;
      .card-top {
        min-height: 90px;
        height: auto;
        padding: 10px;
        .top-left {
          display: inline-block;
          vertical-align: top;
          .card-pic {
            width: 60px;
            height: 60px;
            line-height: 60px;
            border-radius: 50%;
            background-color: #0079f8;
            color: #fff;
          }
        }
        .top-right {
          padding-left: 10px;
          width: 70%;
          display: inline-block;
          text-align: left;
          p {
            // height: 20px;
            line-height: 24px;
            .hezuo {
              background-color: #fff2ea;
              color: #f17d29;
              border: 1px solid #f17d29;
              border-radius: 4px;
              padding: 0 2px;
            }
            .dianhua {
              width: 16px;
              margin-top: -2px;
              vertical-align: middle;
            }
            .dingwei {
              width: 12px;
              margin-right: 2px;
              margin-top: -4px;
              vertical-align: middle;
            }
            .blue {
              color: #15499a;
              margin: 0 4px;
            }
          }
        }
      }
      .card-bottom {
        height: 40px;
        color: #f17d29;
        position: relative;
        .day {
          position: absolute;
          right: 15px;
          top: 10px;
        }
      }
    }
  }
}
</style>