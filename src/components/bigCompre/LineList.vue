<!-- LineList -->
<template>
  <div class="LineList">
    <c-header isShowTitle class="header">
      <van-nav-bar
        title="建单"
        fixed
        :z-index="100"
        @click-left="onClickLeft"
        @click-right="onClickRight"
      >
        <template slot="right">
          新增线路
        </template>
      </van-nav-bar>
    </c-header>
    <div class="sub_page_base">
      <van-pull-refresh
        class="content"
        v-model="refreshing"
        @refresh="onRefresh"
      >
        <div class="no-data" v-show="dataList.length === 0">
          <img
            src="../../assets/imgs/bigCompre/kong@2x.png"
            alt=""
            class="kong"
          />
          <p>暂无数据~~</p>
        </div>

        <van-list
          v-model="loading"
          :finished="finished"
          :immediate-check="false"
          :finished-text="finishedText"
          :offset="10"
          @load="onLoadList"
        >
          <LineItem
            v-show="dataList.length > 0"
            v-for="(item, index) in dataList"
            :key="index"
            :item="item"
            @buildWayBill="buildWayBill"
            @modifyLine="modifyLine"
            @seeQRCode="seeQRCode"
            @seeDetail="seeDetail"
          ></LineItem>
        </van-list>
      </van-pull-refresh>
    </div>

    <van-Popup
      v-model="showPoster"
      closeable
      close-icon="close"
      :close-on-click-overlay="false"
    >
      <!-- <div class="close" @click="showPoster = false">
        <i class="iconfont iconguanbi"></i>
      </div> -->
      <Poster
        :transportLineId="item.transportLineId"
        :goodsName="item.goodsName"
        :loadingAddressName="item.loadingAddressName"
        :unloadingAddressName="item.unloadingAddressName"
        :orgName="item.orgName"
        :lock-scroll="false"
      ></Poster>
    </van-Popup>
  </div>
</template>

<script>
import { NavBar, List, PullRefresh, Popup, Toast } from "vant";
import LineItem from "./components/LineItem";
import Poster from "./components/Poster";
import { getLineList } from "@/api/bigCompre";
import Const from "@/utils/const.js";
import { openNewWindow } from "@/utils/app.js";
export default {
  name: "LineList",
  data() {
    return {
      refreshing: false,
      loading: false, // 上拉加载
      finished: false, // 上拉加载完毕
      pageIdx: 1,
      dataList: [],
      showPoster: false,
      item: {}
    };
  },
  components: {
    vanNavBar: NavBar,
    vanPullRefresh: PullRefresh,
    vanList: List,
    vanPopup: Popup,
    LineItem,
    Poster
  },
  computed: {
    finishedText() {
      return this.dataList.length > 0 ? "没有更多了~" : "";
    }
  },
  mounted() {
    window.AppJSApi_finishCallBack = this.onRefresh;
    this.$store.commit("updateLoadingStatus", { isLoading: false });
    this.init();
  },
  methods: {
    onClickLeft() {
      this.$router.back();
    },
    onClickRight() {},
    // 初始化
    init() {
      this.onRefresh();
    },
    // 上拉加载请求方法
    onLoadList() {
      this.loading = true;
      this.finished = false;
      this.pageIdx ++ ;
      console.log('触发上拉加载~~',this.pageIdx)
      this.$_getLineList().then((res)=>{
        if(res.length < 10){
          this.loading = false;
          this.finished = true;
        }else{
          this.loading = false;
          this.finished = false;
        }
        this.dataList = this.dataList.concat(res)
        console.log(this.dataList)
      })
    },
    // 下拉刷新
    onRefresh() {
      console.log("下拉刷新~~");
      this.refreshing = true;
      this.finished = false;
      this.pageIdx = 1
      this.$_getLineList().then(res => {
        this.refreshing = false;
        // 赋值
        this.dataList = res;
      });
    },
    // 建单
    buildWayBill({ transportUnitPriceType, transportLineId }) {
      const url = `${
        Const.APP_URL
      }/bigCompreWayBillInfo?transportUnitPriceType=${transportUnitPriceType}&transportLineId=${transportLineId}`;
      openNewWindow({ url });
    },
    // 新建线路
    onClickRight() {
      const url = `${Const.APP_URL}/GoodsInfo`;
      openNewWindow({ url });
    },
    // 修改线路
    modifyLine({ transportLineId }) {
      const url = `${
        Const.APP_URL
      }/ModifyLine?transportLineId=${transportLineId}`;
      openNewWindow({ url });
    },
    // 查看详情
    seeDetail({ transportLineId }) {
      const url = `${
        Const.APP_URL
      }/LineDetail?transportLineId=${transportLineId}`;
      openNewWindow({ url });
    },
    // 查看二维码
    seeQRCode(item) {
      this.item = item;
      this.showPoster = true;
    },
    // 调用接口获取线路列表
    $_getLineList() {
      return new Promise((resolve, reject) => {
        const loading = Toast.loading({
          message: "加载中..."
        });
        getLineList({ pageIdx: this.pageIdx })
          .then(res => {
            loading.clear();
            if (res.data.reCode == "0") {
              let result = res.data.result.lineList;
              resolve(result);
            } else {
              this.refreshing = false;
              Toast(res.data.reInfo);
              reject();
            }
          })
          .catch(err => {
            loading.clear();
            Toast(err.message);
            reject();
          });
      });
    }
  }
};
</script>
<style lang="less" scoped>
/deep/.van-popup__close-icon--top-right{
  top: 6px;
  right: -1px;
  font-size: 25px;
  color: #ffffff;
}
/deep/.van-nav-bar__right{
  color: #ffffff;
  font-size: 17px;
}
.LineList {
  background: #efefef;
  box-sizing: border-box;
  .sub_page_base {
    min-height: 100vh;
    box-sizing: border-box;
    padding: 45px 10px 30px;
    .LineItem {
      margin-top: 10px;
    }
    .no-data {
      margin: 100px auto;
      text-align: center;
      color: #454545;
      .kong {
        width: 130px;
        margin: 10px auto 20px;
      }
    }
  }
  /deep/ .van-popup {
    background: none;
    // .close {
    //   float: right;
    //   .iconguanbi {
    //     color: #fff;
    //   }
    // }
    // @media screen and (max-width: 320px) {
    //   transform: translate3d(-50%,-50%,0) scale(0.8);
    // }
  }
}
</style>
