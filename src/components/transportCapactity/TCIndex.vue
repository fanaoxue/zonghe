<template>
  <div id="home" class="home" :style="{ height: clientHeight + 'px' }">
    <div @touchmove="touchmove">
      <c-header :isShowTitle="true">
        <van-nav-bar
          left-arrow
          @click-left="onClickLeft"
          :fixed="true"
          title="发展运力"
          right-text="✚ 运力"
          @click-right="addYl(1)"
        ></van-nav-bar>
      </c-header>
      <div style="height:46px;"></div>
      <section ref="banner" class="banner" @click="addYl(2)">
        <img class="banner-circle" alt src="../../assets/imgs/wbs/home_circle.png" />
      </section>
    </div>
    <div v-show="watingFlag === false">
      <template>
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <div class="content" :style="{ height: clientHeight - 196 + 'px' }">
            <van-list
              v-model="loading"
              :finished="finished"
              :finished-text="finishedText"
              @load="onLoad(0)"
              :error.sync="error"
              :error-text="errorText"
            >
              <section class="comp" v-if="isContentShow">
                <img class="comp-star" alt src="../../assets/imgs/icons/star_icon.png" />
                <span class="comp-name">{{ groupOrg.name | formatOrgName }}</span>
                <span class="comp-num">
                  {{ groupOrg.carCount | formatCarCount }}
                  <span class="comp-num-info">运力</span>
                </span>
              </section>
              <div class="line"></div>
              <!-- :class="orgList.length === 1 && orgList[0].managerArray.length === 0 ? 'projects2 van-hairline--bottom' : 'projects van-hairline--bottom'" -->
              <div
                class="van-hairline--bottom projects"
                v-for="(item, index) in orgList"
                :class="!(orgList.length === 1 && orgList[0].managerArray.length === 0) && index === orgList.length - 1 ? 'projects2' : ''"
                :key="index"
              >
                <div @click="showUser(index)" class="project">
                  <img class="line-icon" alt src="../../assets/imgs/icons/line_icon.png" />
                  <span class="project-name">{{ item.name }}</span>
                  <span class="project-num">
                    {{ item.carCount }}
                    <img
                      v-if="item.defShow === true && item.managerArray.length > 0"
                      class="arrow-updown-icon"
                      alt
                      src="../../assets/imgs/icons/up_arrow_icon2.png"
                    />
                    <img
                      v-if="item.defShow === false && item.managerArray.length > 0"
                      class="arrow-updown-icon"
                      alt
                      src="../../assets/imgs/icons/down_arror_icon2.png"
                    />
                  </span>
                </div>
                <div
                  v-if="item.managerArray.length > 0"
                  :class="{ 'users hid': item.defShow === false, users: item.defShow === true }"
                >
                  <div
                    :class="{ user: userItem.isLoginUser === false, 'user blue': userItem.isLoginUser === true }"
                    @click="goDetail(userItem, item.allowQuery)"
                    v-for="(userItem, innerIndex) in item.managerArray"
                    :key="innerIndex"
                  >
                    <img class="user-icon" alt src="../../assets/imgs/wbs/jlr_logo.png" />
                    <span class="is-login-user" v-if="userItem.isLoginUser">本账号</span>
                    <span>运力经理人：{{ userItem.name }}</span>
                    <span
                      :class="{ 'user-num': item.allowQuery === true, 'user-num2': item.allowQuery === false }"
                    >
                      {{ userItem.carCount }}
                      <img
                        v-if="item.allowQuery"
                        class="arrow-right-icon"
                        alt
                        src="../../assets/imgs/icons/right_arrow_icon.png"
                      />
                    </span>
                  </div>
                </div>
              </div>
            </van-list>
            <div style="height:15px;"></div>
          </div>
        </van-pull-refresh>
      </template>
    </div>
  </div>
</template>

<script>
import Const from "../../utils/const.js";
import { NavBar, PullRefresh, List } from "vant";
import { openNewWindow, systemType, AppFinish } from "../../utils/app.js";
import { getTCItem, ruleLogIfs } from "../../api/apiTC.js";
export default {
  data() {
    return {
      isContentShow: false,
      clientHeight: document.documentElement.clientHeight,
      isLoading: false,
      loading: false,
      finished: false,
      finishedText: "",
      groupOrg: {},
      orgList: [],
      belongActSys: "",
      error: false,
      errorText: "请求失败，下拉重新加载"
    };
  },
  components: {
    vanNavBar: NavBar,
    vanPullRefresh: PullRefresh,
    vanList: List
  },
  computed: {
    watingFlag() {
      return this.$store.state.loading.isLoading;
    }
  },
  created() {
    this.$store.commit("updateLoadingStatus", { isLoading: false });
  },
  methods: {
    touchmove() {
      console.log("touchmove");
      event.preventDefault();
    },
    onLoad(type) {
      this.dataInit(type);
    },
    onRefresh() {
      this.onLoad(1);
    },
    onClickLeft() {
      // this.$router.go(-1);
      AppFinish()
    },
    dataInit(type) {
      let _this = this;
      _this.orgList = [];
      _this.isContentShow = false;
      getTCItem() //20000
        .then(res => {
          console.log(
            type +
              "===" +
              _this.loading +
              "===" +
              _this.finished +
              "===" +
              _this.isLoading
          );
          if (res.data.reCode !== "0") {
            _this.error = true;
            _this.loading = false;
            _this.errorText = res.data.reInfo;
            return;
          }
          let result = JSON.parse(res.data.result);
          _this.groupOrg = result.groupOrg;
          let belongActSys = result.user.belongActSys;
          _this.belongActSys = belongActSys;
          if (type === 1) {
            _this.orgList = result.orgList;
            _this.$nextTick(() => {
              _this.isLoading = false;
            });
          } else {
            _this.orgList = [...this.orgList, ...result.orgList];
            _this.$nextTick(() => {
              _this.loading = false;
            });
          }
          _this.finished = true;
          _this.isContentShow = true;
          if (_this.orgList.length === 0) {
            _this.finishedText = "暂无项目~~~";
          } else {
            _this.finishedText = "";
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    goDetail(userItem, allowQuery) {
      if (allowQuery) {
        this.recordLogFuc(3, { managerId: userItem.id });
        let sysType = systemType();
        let headTitle = userItem.isLoginUser !== true ? userItem.name : "我";
        headTitle = encodeURIComponent(encodeURIComponent(headTitle));
        let url =
          window.location.protocol +
          "//" +
          Const.tc_base_http +
          "/ngcbapp_h5/dist/index.html#/TCDetail?managerId=" +
          userItem.id +
          "&headTitle=" +
          headTitle +
          "&isLoginUser=" +
          (userItem.isLoginUser ? "1" : "0");
        let item = {};
        item.url = url;
        if (sysType === 0) {
          this.$router.push({
            name: "TCDetail",
            query: {
              managerId: userItem.id,
              headTitle: headTitle,
              isLoginUser: userItem.isLoginUser ? "1" : "0"
            }
          });
        } else {
          openNewWindow(item);
        }
      }
    },
    addYl(flag) {
      let _this = this;
      _this.recordLogFuc(flag, { belongActSys: _this.belongActSys });
      let sysType = systemType();
      console.info("sysType=" + sysType);
      let url =
        window.location.protocol +
        "//" +
        Const.tc_base_http +
        "/ngcbapp_h5/dist/index.html#/addTransport?belongActSys=" +
        this.belongActSys;
      console.info("url=" + url);
      let item = {};
      item.url = url;
      if (sysType === 0) {
        _this.$router.push({
          name: "addTransport",
          query: { belongActSys: _this.belongActSys }
        });
      } else {
        openNewWindow(item);
      }
    },
    showUser(index) {
      if (this.orgList[index].defShow) {
        this.orgList[index].defShow = false;
      } else {
        this.orgList[index].defShow = true;
      }
    },
    recordLogFuc(type, requestBody) {
      // 记录日志
      ruleLogIfs(type, requestBody)
        .then(response => {
          if (response.data.reCode !== "0") {
            console.log(
              "行为数据返回结果" + type + ":" + JSON.stringify(response)
            );
          }
        })
        .catch(function(error) {
          console.log("行为数据异常:" + error);
        });
    }
  }
};
</script>

<style lang="less">
@keyframes scaleDraw {
  /*定义关键帧、scaleDrew是需要绑定到选择器的关键帧名称*/
  0% {
    transform: scale(1, 1);
    opacity: 1;
  }
  25% {
    transform: scale(1.2, 1.2);
    opacity: 0.8;
  }
  100% {
    transform: scale(1, 1);
    opacity: 1;
  }
}
.home {
  background: #ececec;
  //   .van-nav-bar {
  //   background-color: #15499a;
  // }
  // .van-nav-bar__title {
  //   color: #ffffff;
  // }
  // .van-icon,
  // .van-nav-bar__text {
  //   color: #ffffff;
  //   background: #15499a;
  //   font-size: 16px;
  // }
  // .van-hairline--bottom::after {
  //   border-bottom-width: 0px;
  // }
  // .van-nav-bar__arrow {
  //   font-size: 24px;
  // }
  .hid {
    display: none;
  }
  .banner {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 150px;
    background-image: url("../../assets/imgs/wbs/home_banner.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    position: relative;
  }
  .banner-circle {
    width: 110px;
    height: 53px;
    position: absolute;
    bottom: -1px;
    left: calc((100% - 110px) / 2);
    animation: scaleDraw 0.6s infinite;
  }
  .comp {
    background: #fff;
    text-align: left;
    height: 53px;
    width: calc(100% - 20px);
    padding: 0 10px;
    color: #121212;
    font-size: 16px;
    line-height: 53px;
    position: relative;
  }
  .line {
    width: 100%;
  }
  .line:before {
    content: "";
    display: block;
    height: 1px;
    background: #efefef;
  }
  .comp-star {
    width: 10px;
    height: 10px;
    margin-right: 5px;
    position: relative;
    top: -1px;
  }
  .comp-name {
    font-size: 16px;
    color: #121212;
    font-weight: bold;
  }
  .comp-num {
    float: right;
    color: #ffba00;
    font-size: 17px;
    font-weight: bold;
  }
  .comp-num-info {
    font-size: 15px;
  }
  .content {
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
  }
  // .content .projects:last-child {
  //   padding-bottom: 14px;
  // }
  .projects {
    background: #fff;
    font-size: 15px;
    color: #313233;
    text-align: left;
  }
  .projects2 {
    padding-bottom: 14px;
  }
  .project {
    width: calc(100% - 20px);
    padding: 17px 10px 14px 10px;
    display: block;
  }
  .line-icon {
    width: 0.125rem;
    height: 0.75rem;
    // margin-top: 4px;
    // float: left;
    // margin-right: 6px;
  }
  .project-name {
    color: #202020;
    font-weight: bold;
  }
  .project-num {
    float: right;
    color: #15499a;
    font-size: 17px;
    font-weight: bold;
    line-height: 22px;
  }

  .users {
    background: #efefef;
    border-radius: 12px;
    margin: 0 12px;
    border: 1px solid #ececec;
    padding: 10px;
  }
  .user {
    position: relative;
    padding: 10px 0;
  }
  .is-login-user {
    position: absolute;
    margin-top: -5px;
    margin-left: -18px;
    background: #ffba00;
    color: #fff;
    font-size: 11px;
    padding: 0;
    border-radius: 2px;
    width: 37px;
    height: 15px;
    line-height: 15px;
    text-align: center;
  }
  .user-icon {
    width: 20px;
    height: 22px;
    margin-right: 7px;
    top: 6px;
    position: relative;
  }
  .user-num {
    float: right;
    margin-top: 8px;
  }
  .user-num2 {
    float: right;
    padding-right: 15px;
    margin-top: 8px;
  }
  .arrow-updown-icon {
    width: 0.6875rem;
    height: 0.4375rem;
    top: -3px;
    margin-left: 0.3125rem;
    position: relative;
  }
  .arrow-right-icon {
    width: 7px;
    height: 11px;
    margin-top: -3px;
    margin-left: 5px;
  }
  .blue {
    color: #15499a;
  }
}
</style>
