<template>
  <div>
    <div v-show="headerShow === 0||isShowTitle">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "commonHeader",
  data() {
    return {
      headerShow: this.$sysType
    };
  },
  props: {
    isShowTitle: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped>
.van-nav-bar {
  background-color: #15499a;
}
.van-nav-bar__title {
  color: #ffffff;
  font-size: 18px;
}
.van-icon,
.van-nav-bar__text {
  color: #ffffff;
  background: #15499a;
  font-size: 18px;
}
.van-hairline--bottom::after {
  border-bottom-width: 0px;
}
.van-nav-bar__arrow {
  font-size: 24px;
}
</style>
