<template>
  <div id="app">
    <loading v-model="isLoading"></loading>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <!-- <router-view/> -->
  </div>
</template>

<script>
import { Loading } from "vux";
import { mapState } from "vuex";
// import { klbGetUserInfo } from "./utils/app";
export default {
  name: "App",
  data() {
    return {};
  },
  components: {
    Loading
  },
  created() {
    // klbGetUserInfo(this.getAppMesgUserInfo);
  },
  mounted() {
    // window.AppMesgUserInfoCallBack = this.getAppMesgUserInfo;
  },
  computed: {
    ...mapState({
      isLoading: state => state.loading.isLoading
    })
  },
  methods: {
    // getAppMesgUserInfo(res) {
    //   console.log("getAppMesgUserInfo===========>" + res);
    // }
  },
  mounted() {}
};
</script>

<style lang="less">
@import "~vux/src/styles/close.less";
@import "~vux/src/styles/1px.less";
@import "~vux/src/styles/reset.less";
html,
body {
  padding: 0px;
  margin: 0px;
}
#app {
  font-family: Microsoft Yahei, Helvetica Neue, Tahoma, Arial,
    PingFangSC-Regular, Hiragino Sans GB, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  font-size: 16px;
}
.vux-header {
  background-color: #15499a !important;
}
.weui-cell {
  padding: 10px !important;
  font-size: 16px;
}
.weui-cells {
  margin-top: 10px !important;
}
.vux-cell-value {
  color: #202020 !important;
  -webkit-text-fill-color: #202020 !important;
  -webkit-opacity: 1;
  opacity: 1;
}
.weui-toast__content {
  word-break: break-word;
}
// dialog样式
.weui-dialog {
  .weui-dialog__hd {
    background: #15499a;
    .weui-dialog__title {
      color: #fff;
    }
  }
  .weui-dialog__hd {
    padding: 0.5em 1em;
  }
  .vux-prompt {
    padding: 2em;
  }
  .weui-dialog__bd {
    font-size: 16px;
    color: #454545;
    padding: 2em;
    line-height: 40px;
    div {
      overflow-y: auto;
      overflow-x: hidden;
      max-height: 130px;
      line-height: 1.5;
    }
  }
  .weui-dialog__ft {
    line-height: 40px;
    .weui-dialog__btn {
      font-size: 16px;
      color: #fff;
      background: #15499a;
      border-radius: 8px;
      margin: 0.5em 1em;
    }
    @media screen and (max-width: 320px) {
      .weui-dialog__btn {
        font-size: 14px;
        line-height: 30px;
        margin: 5px;
      }
    }
    .weui-dialog__btn_default {
      background: #fff;
      color: #15499a;
      border: 1px solid #15499a;
    }
  }
  .weui-dialog__ft:after {
    border-top: 0;
  }
  .weui-dialog__btn:after {
    border-left: 0;
  }
}
.weui-textarea {
  word-break: break-all;
}
.van-icon-arrow-left:before {
  color: #fff;
}
</style>
