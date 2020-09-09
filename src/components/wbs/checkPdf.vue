<template>
  <div class="check_pdf">
    <!-- <c-header isShowTitle>
      <van-nav-bar @click-left="onClickLeft" title="查看协议" left-arrow fixed></van-nav-bar>
    </c-header>-->
    <div class="content">
      <van-tabs color="#15499a" title-active-color="#15499a" title-inactive-color="#6C6C6C" sticky>
        <van-tab v-for="(item,index) in dataList" :title="item.contractTitle" :key="index">
          <div style="height:auto">
            <iframe
              :src="'https://pdf.log56.com/generic/web/viewer.html?file=' +item.contractUrl"
              id="bdIframe"
              frameborder="0"
              width="100%"
              height="auto"
              scrolling="no"
              onload="this.height=1800"
            ></iframe>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { toSeeAgreement } from "../../api/api.js";
import { NavBar, Tab, Tabs, Toast } from "vant";
export default {
  name: "checkPdf",
  components: {
    vanNavBar: NavBar,
    vanTab: Tab,
    vanTabs: Tabs
  },
  data() {
    return {
      taxWaybillId: this.$route.query.taxWaybillId,
      dataList: []
    };
  },
  created() {
    this.dataInit();
  },
  mounted() {},
  methods: {
    dataInit() {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      toSeeAgreement({ taxWaybillId: this.taxWaybillId })
        .then(res => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          if (res.data.reCode === "0") {
            // 两条PDF数据
            this.dataList = res.data.result.contractList;
          } else {
            this.$vux.toast.text(res.data.reInfo, "middle");
          }
        })
        .catch(err => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
        });
    },
    onClickLeft() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
.check_pdf {
  .content {
    // margin-top: 46px;
  }
}
</style>