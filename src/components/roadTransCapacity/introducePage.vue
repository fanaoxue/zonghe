<template>
  <div>
    <c-header isShowTitle>
      <van-nav-bar @click-left="onClickLeft" title="路优运力介绍" left-arrow fixed />
    </c-header>
    <div class="content">
      <!-- 弹框说明 -->
      <description></description>
    </div>
  </div>
</template>

<script>
import { NavBar } from "vant";
import description from "./components/description.vue";
export default {
  components: {
    vanNavBar: NavBar,
    description
  },
  data() {
    return {};
  },
  created() {
    this.$store.commit("updateLoadingStatus", { isLoading: false });
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
.content {
  margin-top: 48px;
}
</style>