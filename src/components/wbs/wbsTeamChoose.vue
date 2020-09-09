<template>
  <div class="wbs-team-choose">
    <c-header>
      <x-header :left-options="{ backText: '' }">我的车队</x-header>
    </c-header>
    <div class="search-ipt-cxt-box">
      <div class="search-ipt-cxt">
        <!-- <van-dropdown-menu active-color="#15499A" class="search-title-box">
          <van-dropdown-item
            v-model="searchTitle"
            :options="searchTitleOption"
            title-class="search-title"
            @change="changeSearchTitle"
            :error.sync="error"
            error-text="请求失败，点击重新加载"
          />
        </van-dropdown-menu>-->
        <div class="search-ipt-style">
          <i class="iconfont iconsousuo iconsousuo-style"></i>
          <x-input title placeholder="输入车牌号/司机姓名/司机手机" v-model="condition"></x-input>
        </div>
        <div class="search-control-btn" @click="searchBtn()">{{ searchBtnMsg }}</div>
      </div>
    </div>
    <div class="search-result-cxt" v-if="driverList.length > 0">
      <van-list v-model="loading" :finished="finished" :finished-text="finishedText" @load="onLoad" :immediate-check="false">
        <div
          class="search-result-list"
          :class="{ 'search-resul-active': resulActiveFlag === index }"
          v-for="(item, index, key) in driverList"
          :key="key"
          @click="itemClick(index)"
        >
          <div class="list-item-top">
            <img class="che-pai-style" src="../../assets/imgs/wbs/chepai_icon@2x.png" alt />
            <span class="car-number-sp">{{ item.cartBadgeNo }}</span>
          </div>
          <div class="list-item-bottom">
            <span class="driver-phone-number">{{ item.mobileNo | capitalize }}，</span>
            <span class="driver-name-sp">{{ item.driverName }}</span>
            <span v-show="item.hybWallet == '1'">
              <img src="../../assets/imgs/wbs/qianbao_icon@2x.png" width="16px" alt="" style="width: 16px;margin-left: 6px;">
            </span>
          </div>
          <div
            class="use-btn-style"
            v-show="resulActiveFlag === index"
            @click="useBtnClick(item)"
          >使用</div>
        </div>
      </van-list>
    </div>
    <div class="search-no-result" v-if="driverList.length === 0 && !loading&&searchResult">
      <img class="error-img-style" src="../../assets/imgs/wbs/pipeixinxi_icon@2x.png" alt="" />
      <div>未搜索到匹配信息~</div>
    </div>
  </div>
</template>

<script>
import {
  // getDriverMsgSearchPagination,
  getDriverMsgSearch,
  getDriverMsgList
} from "../../api/api.js";
import { DropdownMenu, DropdownItem, List } from "vant";
export default {
  name: "wbsTeamChoose",
  data() {
    return {
      condition: "",
      driverList: [],
      resulActiveFlag: -1,
      searchBtnMsg: "搜索",
      searchResult: false,
      searchBtnDisabled: false,
      searchTitle: "车牌号",
      searchTitleOption: [
        { text: "车牌号", value: "车牌号" },
        { text: "司机姓名", value: "司机姓名" },
        { text: "司机手机", value: "司机手机" }
      ],
      finished: false,
      loading: false,
      error: false,
      finishedText:'',
      pageSize: "15",
      pageIdx: "1",
      searchParams: {
        condition: "",
        pageSize: "",
        pageIdx: ""
      }
    };
  },
  created() {
    this.$store.commit("updateLoadingStatus", { isLoading: false });
  },
  mounted() {
    getDriverMsgList().then(res => {
      if (res.data.reCode === "0") {
        this.driverList = res.data.result.driverList;
        this.finished = true;
      }
    });
  },
  watch: {},
  components: {
    vanDropdownMenu: DropdownMenu,
    vanDropdownItem: DropdownItem,
    vanList: List
  },
  filters: {
    //司机手机号用****处理
    capitalize: function(value) {
      if (!value) return "";
      value = value.toString();
      return value.replace(/^(\d{3})\d{4}(\d+)/, "$1****$2");
    }
  },
  computed: {
    isLoading() {
      return this.$store.state.loading.isLoading;
    }
  },
  methods: {
    checkSearchData() {
      var pattern = /^[\u4e00-\u9fa5]+$/;
      if(pattern.test(this.condition)&&this.condition.length >1){
        return true
      }
      if (this.condition.length < 3) {
        this.$vux.toast.text("请至少输入3个字符！", "middle");
        return false;
      }
      return true;
    },
    onLoad() {
      this.searchParams.pageIdx = Number(this.searchParams.pageIdx) + 1;
      // this._getDriverMsgSearchPagination();
    },
    changeSearchTitle() {
      this.condition = "";
    },
    itemClick(index) {
      this.resulActiveFlag = index;
    },
    useBtnClick(item) {
      try {
        MtaH5.clickStat("my_car_team_use");
      } catch (error) {
        JSON.stringify(error);
      }
      let updateOpions = {
        type: "weyBillSecond",
        updatMsg: Object.assign(
          {
            note: this.$store.state.wayBill.weyBillSecond.note,
            carType:
              item.cartType === ""
                ? this.$store.state.wayBill.weyBillSecond.carType
                : item.cartType,
            carLength:
              item.cartLength === ""
                ? this.$store.state.wayBill.weyBillSecond.carLength
                : item.cartLength,
            carTonNumber:
              item.cartTonnage === ""
                ? this.$store.state.wayBill.weyBillSecond.carTonNumber
                : item.cartTonnage
          },
          item
        )
      };
      this.$store.commit("updateWayBillStatus", updateOpions);
      this.$router.go(-1);
    },
    searchBtn() {
      if (!this.checkSearchData() || this.searchBtnDisabled) return false;
      this.pageIdx = "1";
      this.driverList = [];
      this.finished = false;
      this.finishedText='没有更多了'
      this._firstGetDriverMsgSearchPagination();
    },
    _firstGetDriverMsgSearchPagination() {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      this.searchResult = false;
      this.searchBtnDisabled = true;
      let json = {
        condition: this.condition,
        pageSize: this.pageSize,
        pageIdx: this.pageIdx
      };
      this.searchParams = json;
      // getDriverMsgSearchPagination(json)
      getDriverMsgSearch(json)
        .then(res => {
          try {
            MtaH5.clickStat("my_car_team_search");
          } catch (error) {
            JSON.stringify(error);
          }
          if (res.data.reCode === "0") {
            this.driverList = res.data.result.driverList;
            if (res.data.result.isPrecise == 1) {
              // 精确查询最多15条
              this.finished = true;
            } else {
              if (res.data.result.driverList.length < 15) {
                this.finished = true;
              }
            }
          } else {
            this.$vux.toast.text(res.data.reInfo, "middle");
          }
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          this.searchBtnDisabled = false;
          this.searchResult = true;
        })
        .catch(error => {
          this.$vux.toast.text("搜索异常，请稍后再试~~~", "middle");
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          this.searchBtnDisabled = false;
          this.searchResult = true;
        });
    },
    _getDriverMsgSearchPagination() {
      // getDriverMsgSearchPagination(this.searchParams)
      getDriverMsgSearch(this.searchParams)
        .then(res => {
          try {
            MtaH5.clickStat("my_car_team_search");
          } catch (error) {
            JSON.stringify(error);
          }
          if (res.data.reCode === "0") {
            res.data.result.driverList.forEach(element => {
              this.driverList.push(element);
            });
            if (res.data.result.driverList.length < 15) {
              this.finished = true;
            }
          } else {
            this.error = true;
          }
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="less">
@import "../../assets/styles/common.less";
.wbs-team-choose {
  height: 100vh;
  // overflow: hidden;
  overflow-y: auto;
  .van-cell:not(:last-child)::after {
    left: 0;
  }
  .search-title-box {
    background: rgba(242, 242, 242, 1);
    .search-title {
      line-height: 15px;
    }
  }
  .search-ipt-cxt-box {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 98;
    .search-ipt-cxt {
      background: #fff;
      display: flex;
      // margin-top: 10px;
      .wh(100%, 46px);
      line-height: 46px;
      padding: 12px;
      .search-ipt-style {
        display: flex;
        align-items: center;
        .wh(80%, 44px);
        .borderRadius(20px);
        border: 1px solid #bfbfbf;
        .iconsousuo-style {
          color: #15499a;
          margin-left: 5px;
        }
        .weui-cell {
          width: 96%;
        }
        .weui-cell:before {
          position: static;
        }
        .weui-input {
          width: 100%;
          height: 24px;
          padding: 11px 0px;
          line-height: 24px;
        }
        input::-webkit-input-placeholder {
          color: #9f9f9f;
          font-size: 14px;
        }
        img {
          width: 14px;
          height: 14px;
          padding-left: 12px;
        }
      }
      .search-control-btn {
        padding-left: 12px;
        color: #15499a;
      }
    }
    // .search-ipt-cxt {
    //   box-sizing: border-box;
    //   background: rgba(242, 242, 242, 1);
    //   display: flex;
    //   justify-content: flex-start;
    //   align-items: center;
    //   .wh(100%, 60px);
    //   line-height: 60px;
    //   padding: 12px;
    //   color: #15499a;
    //   .search-ipt-style {
    //     display: flex;
    //     align-items: center;
    //     flex: 1;
    //     // margin-left: 20px;
    //     height: 33px;
    //     background: rgba(255, 255, 255, 1);
    //     border: 1px solid rgba(202, 202, 202, 1);
    //     border-radius: 4px;
    //     color: #121212;
    //     .iconsousuo-style {
    //       color: #15499a;
    //       margin-left: 5px;
    //     }
    //     .weui-cell {
    //       width: 96%;
    //     }
    //     .weui-cell:before {
    //       position: static;
    //     }
    //     .weui-input {
    //       width: 100%;
    //       height: 23px;
    //       padding: 5px 0px;
    //       line-height: 23px;
    //     }
    //     input::-webkit-input-placeholder {
    //       color: #9f9f9f;
    //       font-size: 14px;
    //     }
    //     img {
    //       width: 14px;
    //       height: 14px;
    //       padding-left: 12px;
    //     }
    //   }
    //   .search-control-btn {
    //     padding-left: 12px;
    //     color: #15499a;
    //   }
    // }
  }
  .search-result-cxt {
    box-sizing: border-box;
    padding: 80px 12px 30px;
    min-height: 60px;
    height: 100vh;
    overflow-y: auto;
    .search-result-list {
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 100%;
      height: 60px;
      background-color: #f6f6f6;
      border-radius: 5px;
      .list-item-top {
        padding-left: 10px;
        display: flex;
        align-items: center;
        .car-number-sp {
          padding-left: 10px;
          color: #15499a;
          font-size: 15px;
        }
      }
      .list-item-bottom {
        padding-left: 32px;
        display: flex;
        align-items: center;
        .driver-phone-number,
        .driver-name-sp {
          color: #121212;
          font-size: 15px;
        }
      }
      .use-btn-style {
        position: absolute;
        right: 26px;
        width: 60px;
        background-color: #03a9f4;
        color: #fff;
        text-align: center;
        border-radius: 25px;
        top: 18px;
      }
    }
    .search-resul-active {
      position: relative;
      background-color: #e0effb;
      border: 1px solid #3699ff;
    }
  }
  .search-no-result {
    margin-top: 70px;
    width: 100%;
    text-align: center;
    color: #797979;
  }
  .che-pai-style {
    width: 15px;
    height: 15px;
  }
  .error-img-style {
    width: 48px;
    height: 56px;
  }
}
</style>
