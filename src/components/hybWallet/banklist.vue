<template>
  <div class="bank_list">
    <!-- <c-header :isShowTitle="true">
      <van-nav-bar title="选择银行" left-arrow fixed @click-left="handleBack">
      </van-nav-bar>
    </c-header> -->

    <div class="sub_page_base">
      <van-search class="search_box" show-action v-model="bankName"  placeholder="请输入银行名称" @search="onSearch">
        <div slot="action" @click="onSearch">搜索</div>
      </van-search>
      <div class="bank_content" v-show="firstLoad">
        <van-list
          v-model="isUpLoading"
          :finished="upFinished"
          finished-text="没有更多了"
          :immediate-check="false"
          v-if="listData.length > 0"
          @load="onLoadList"
        >
          <div
            class="item van-hairline--top"
            v-for="(item, index) in listData"
            :key="index"
            @click="choiceBank(item)"
          >
            <img :src="item.bankImgUrl" class="bank_logo" />
            {{ item.bankName }}
          </div>
        </van-list>
        <div class="bank_no_data" v-else>未找到您搜索的银行</div>
      </div>
    </div>
  </div>
</template>
<script>
import { NavBar, List, Search } from "vant";
import { getBankList } from "@/api/apiHybWallet";
export default {
  name: "bank_list",
  data() {
    return {
      firstLoad: false,
      isUpLoading: false,// 上拉加载
      upFinished: false,// 上拉加载完成
      bankName: "",
      pageNum: 1,
      pageSize: 25,
      listData: {}
    };
  },
  components: {
    vanNavBar: NavBar,
    vanList: List,
    vanSearch: Search
  },
  mounted() {
    this.$store.commit("updateLoadingStatus", { isLoading: false });
    this.init();
  },
  methods: {
    init() {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      getBankList({
        bankName: this.bankName,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          if (res.data.reCode === "0") {
            this.firstLoad = true
            this.isUpLoading = false;
            if (res.data.result.wsSupportBankList == null || res.data.result.wsSupportBankList.length === 0) {
              // 没有数据 禁止了上拉加载 - 加载结束
              this.upFinished = true
              if (this.pageNum === 1) {
                this.listData = []
              }
              return
            }
            if (res.data.result.wsSupportBankList < this.pageSize) {
              // 最后不足一页，也禁止上拉
              this.upFinished = true
            }
            if (this.pageNum === 1) {
              this.listData = res.data.result.wsSupportBankList;
            } else {
              this.listData.push(...res.data.result.wsSupportBankList);
            }
          }
      });
    },
    onSearch() {
      this.upFinished = false;
      this.pageNum = 1;
      this.init();
    },
    // 上拉加载请求方法
    onLoadList() {
      this.pageNum++;
      console.log("上拉加载init加载数据");
      this.init();
    },
    choiceBank(item) {
      localStorage.setItem('chooseBank',JSON.stringify(item));
      this.$router.back()
    },
    handleBack() {
      this.$router.back()
    }
  }
};
</script>
<style lang="less">
.bank_list {
  .sub_page_base {
    min-height: 100vh;
    box-sizing: border-box;
    // padding-top: 45px;
  }
  .search_box{
    position: fixed;
    // top: 45px;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 999;
  }
  .bank_content {
    padding-top: 45px;
  }
  /* 下拉刷新 */
  .bank_content .item {
    display: flex;
    display: -webkit-box; /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
    display: -moz-box; /* 老版本语法: Firefox (buggy) */
    display: -ms-flexbox; /* 混合版本语法: IE 10 */
    display: -webkit-flex; /* 新版本语法: Chrome 21+ */
    align-items: center;
    -webkit-align-items: center;
    box-align: center;
    -moz-box-align: center;
    -webkit-box-align: center;
    padding: 12.5px 15px;
    color: #313233;
    font-size: 17px;
    background: #fff;
  }

  .bank_content .item .bank_logo {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 14px;
  }

  .bank_no_data {
    font-size: 17px;
    color: #6c6c6c;
    text-align: center;
    padding-top: 89px;
  }
}
</style>
