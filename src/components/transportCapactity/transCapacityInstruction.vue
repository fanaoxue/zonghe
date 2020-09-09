<template>
  <div class="trans-capacity-instruction">
    <c-header isShowTitle>
      <van-nav-bar @click-left="onClickLeft" title="路优运力说明" left-arrow fixed />
    </c-header>
    <div style="height:46px;"></div>
    <div class="bg">
      <img src="../../assets/imgs/myTransportcapacity/yunlishuoming.jpg" alt width="100%" />
    </div>
  </div>
</template>
<script>
import { NavBar } from "vant";
export default {
  components: {
    vanNavBar: NavBar
  },
  data() {
    return {};
  },
  created() {
    this.$store.commit("updateLoadingStatus", { isLoading: false });
  },
  methods: {
    // 导航左侧点击
    onClickLeft() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="less" scoped>
.trans-capacity-instruction {
  width: 100%;
  background-color: #efefef;
  position: absolute;
  top: 0px;
  min-height: 100%;
  height: auto;
  color: #202020;
}
</style>