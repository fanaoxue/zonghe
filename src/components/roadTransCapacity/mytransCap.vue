<template>
  <div class="mytransCap">
    <c-header isShowTitle>
      <van-nav-bar @click-left="onClickLeft" title="我的运力" left-arrow fixed>
        <template #right>
          <i class="iconfont iconshuoming" style="color:#ffffff;font-size:24px" @click="toKnown"></i>
        </template>
      </van-nav-bar>
    </c-header>
    <van-tabs
      v-model="active"
      @click="onClick"
      title-inactive-color="#000"
      title-active-color="#15499A"
    >
      <van-tab :title="'直属运力' + '(' + qipao.directCount + ')'"></van-tab>
      <van-tab :title="'初级运力' + '(' + qipao.primaryCount + ')'">

      </van-tab>
      <van-tab title="审批">
        <template #title>
          <span class="resolve_title">
            审批
            <span
              class="red_badge"
              v-show="Number(qipao.approvalCount) > 0"
            >{{ qipao.approvalCount }}</span>
          </span>
        </template>
      </van-tab>
    </van-tabs>
    <div class="container">

      <div class="content">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
           <van-list
            v-model="isUpLoading"
            :finished="upFinished"
            :immediate-check="false"
            :offset="offset"
            @load="onLoadList"
          >
            <div  v-show="active == 0" class="card_list card_list_0">
              <van-checkbox-group v-model="chooseList_0" ref="checkboxGroup_0">
                <div
                  class="card"
                  v-for="(item, index) in dataList_0"
                  :key="index"
                  v-show="dataList_0.length > 0"
                >
                  <div class="check_box">
                    <van-checkbox :name="item" checked-color="#15499A" icon-size="16px"></van-checkbox>
                  </div>
                  <div class="card_content">
                    <div class="card_top">
                      <div class="cardBadge">{{ item.cartBadgeNo | cartBadgeNoFilter }}</div>
                      <div class="time">合作次数:&nbsp;{{ item.cooperateNum }}</div>
                      <div class="logo">
                        <span class="level">直属</span>
                      </div>
                    </div>
                    <div class="card_bottom">
                      <div class="bottom_left">
                        <div class="diver_img">
                          <img :src="item.headImg" alt />
                        </div>
                        <div class="loyal">忠诚度{{ item.matchingDegree }}</div>
                      </div>
                      <div class="bottom_right">
                        <div class="driver_info">
                          <span class="driver">
                            {{ item.driverName }}
                            <span class="tel">{{ item.mobileNo }}</span>
                          </span>
                        </div>
                        <!-- <div class="long_type">
                        <span>13米 高栏</span>
                        </div>-->
                        <div class="location">
                          <span>
                            车辆位置：{{
                            item.curPosition | positionFilter
                            }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="no_data" v-show="dataList_0.length === 0">
                  <img src="../../assets/imgs/roadTransCapacity/kongzhuangtai_img@2x.png" alt />
                  <div>很遗憾您当前还没有升级的直属运力~</div>
                  <div class="blue" @click="upgrade">快去升级直属运力吧>></div>
                  <div class="blue" @click="toKnown">了解直属运力>></div>
                </div>
              </van-checkbox-group>
            </div>

            <div  v-show="active == 1" class="card_list card_list_1">
              <van-checkbox-group v-model="chooseList_1" ref="checkboxGroup_1">
                <div class="card" v-for="(item, index) in dataList_1" :key="index">
                  <div class="check_box">
                    <van-checkbox :name="item" checked-color="#15499A" icon-size="16px"></van-checkbox>
                  </div>
                  <div class="card_content">
                    <div class="card_top">
                      <div class="cardBadge">{{ item.cartBadgeNo | cartBadgeNoFilter }}</div>
                      <div class="time">合作次数:&nbsp;{{ item.cooperateNum }}</div>
                      <div class="logo">
                        <span class="level">初级</span>
                      </div>
                    </div>
                    <div class="card_bottom">
                      <div class="bottom_left">
                        <div class="diver_img">
                          <img :src="item.headImg" alt />
                        </div>
                        <div
                          class="loyal"
                          v-if="item.upgradeState != 1"
                        >忠诚度{{ item.matchingDegree }}</div>
                        <div class="upgradeState" v-else>升级待通过</div>
                      </div>
                      <div class="bottom_right">
                        <div class="driver_info">
                          <span class="driver">
                            {{ item.driverName }}
                            <span class="tel">{{ item.mobileNo }}</span>
                          </span>
                        </div>
                        <!-- <div class="long_type">
                        <span>13米 高栏</span>
                        </div>-->
                        <div class="location">
                          <span>
                            车辆位置：{{
                            item.curPosition | positionFilter
                            }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="no_data" v-show="dataList_1_finished && dataList_1.length === 0">
                  <img src="../../assets/imgs/roadTransCapacity/chujiyunlizhuagntai_img@2x.png" alt />
                  <div>很遗憾您当前还没有初级运力~</div>
                  <div class="blue" @click="toKnown">了解直属运力>></div>
                </div>
              </van-checkbox-group>
            </div>

            <div v-show="active == 2" class="card_list card_list_1">
              <div class="card direction" v-for="(item, index) in dataList_2" :key="index">
                <div class="card_content">
                  <div class="card_top">
                    <div class="cardBadge">{{ item.cartBadgeNo | cartBadgeNoFilter }}</div>
                    <div class="sign" @click="gotoDetail(item)">
                      <span class="qianshu">协议已签署</span>
                    </div>
                  </div>
                  <div class="card_bottom">
                    <div class="bottom_left">
                      <div class="diver_img">
                        <img src="../../assets/imgs/roadTransCapacity/morentouxiang_img@2x.png" alt />
                      </div>
                      <div class="loyal">忠诚度{{ item.matchingDegree }}</div>
                    </div>
                    <div class="bottom_right">
                      <div class="driver_info">
                        <span class="driver">
                          {{ item.driverName }}
                          <span class="tel">{{ item.mobileNo }}</span>
                        </span>
                      </div>
                      <!-- <div class="long_type">
                      <span>13米 高栏</span>
                      </div>-->
                      <div class="location">
                        <span>
                          车辆位置：{{
                          item.curPosition | positionFilter
                          }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="card_footer">
                  <div class="footer_left">升级直属申请</div>
                  <div class="footer_right">
                    <van-button mini type="default" disabled v-show="item.state == 2">已通过</van-button>
                    <van-button
                      mini
                      type="default"
                      @click="passProtocol(item)"
                      v-show="item.state == 0"
                    >通过</van-button>
                    <van-button
                      mini
                      type="default"
                      class="orange"
                      @click="passProtocol(item)"
                      v-show="item.state == 1"
                    >已拒绝，重新通过</van-button>
                  </div>
                </div>
              </div>
              <div class="no_data" v-show="dataList_2.length === 0">
                <img src="../../assets/imgs/roadTransCapacity/shenpizhuagntai_img@2x.png" alt />
                <div>当前无待您审批的内容~~</div>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>


      </div>
      <div class="footer">
        <div class="footer_item" v-show="active === 0">
          <div class="check_box">
            <van-checkbox
              v-model="checkedAll_0"
              checked-color="#15499A"
              icon-size="16px"
              @click="checkAll_0"
            ></van-checkbox>全选
          </div>
          <div class="checked">
            已选：
            <span>{{ chooseList_0.length }}</span>
          </div>
          <van-button
            class="btn"
            :disabled="!(chooseList_0.length > 0)"
            @click="releaseNotice(0)"
          >下发通知</van-button>
        </div>
        <div class="footer_item" v-show="active === 1">
          <div class="check_box">
            <van-checkbox
              v-model="checkedAll_1"
              checked-color="#15499A"
              icon-size="16px"
              @click="checkAll_1"
            ></van-checkbox>全选
          </div>
          <div class="checked">
            已选：
            <span>{{ chooseList_1.length }}</span>
          </div>
          <van-button
            class="btn"
            :disabled="!(chooseList_1.length > 0)"
            @click="releaseNotice(1)"
          >下发通知</van-button>
          <van-button class="btn" :disabled="!(chooseList_1.length > 0)" @click="upgradeDirect">升级直属</van-button>
        </div>
      </div>

      <!-- 弹框说明页 -->
      <van-popup v-model="descriptionPage" round :style="{ width: '90%', height: '75%' }" closeable>
        <description></description>
      </van-popup>

      <!-- popup弹框成功页 -->
      <van-popup
        v-model="popState"
        :close-on-click-overlay="false"
        :style="{
          padding: '20px 0px',
          width: '80%',
          textAlign: 'center',
          borderRadius: '10px'
        }"
      >
        <p style="font-weight:bold;color:#313233" v-show="noticeInfo.type == 1">发送升级直属运力成功！</p>
        <p style="font-weight:bold;color:#313233" v-show="noticeInfo.type == 2">下发通知成功！</p>
        <p
          style="font-weight:bold;color:#313233"
          v-show="noticeInfo.type == 3 && noticeInfo.driverName"
        >已升级{{ noticeInfo.driverName }}为直属运力！</p>
        <p
          style="font-weight:bold;color:#313233"
          v-show="noticeInfo.type == 3 && !noticeInfo.driverName"
        >审核成功！</p>
        <p v-show="noticeInfo.type != 3">接收人：{{ noticeInfo.dataLength }}</p>
      </van-popup>
    </div>
  </div>
</template>

<script>
import {
  NavBar,
  Popup,
  Tab,
  Tabs,
  Checkbox,
  CheckboxGroup,
  Button,
  Toast,
  PullRefresh,
  List,
} from "vant";
import description from "./components/description.vue";
import {
  getInfos,
  getCapacityList,
  isFirstCome,
  approvalOperation
} from "@/api/apiRoadTransCapacity.js";
import { AppFinish } from "../../utils/app";
import { mapState, mapGetters } from "vuex";
export default {
  components: {
    vanNavBar: NavBar,
    vanPopup: Popup,
    vanTab: Tab,
    vanTabs: Tabs,
    vanCheckbox: Checkbox,
    vanCheckboxGroup: CheckboxGroup,
    vanButton: Button,
    vanPullRefresh: PullRefresh,
    vanList: List,
    description
  },
  data() {
    return {
      isUpLoading: false, // 上拉加载
      upFinished: false, // 上拉加载完毕
      offset: 10, // 滚动条与底部距离小于 offset 时触发load事件
      pageIdx: 1,
      descriptionPage: false,
      popState: false,
      refreshing: false,
      active: 0,
      checkedAll_0: false,
      chooseList_0: [],
      dataList_0: [],
      checkedAll_1: false,
      chooseList_1: [],
      dataList_1: [],
      dataList_1_finished: false,
      dataList_2: [],
      qipao: {
        directCount: "0",
        primaryCount: "0",
        approvalCount: "0"
      }
    };
  },
  filters: {
    cartBadgeNoFilter(item) {
      return (item = item.slice(0, 2) + "·" + item.slice(2, item.length));
    },
    positionFilter(item) {
      return (item = item ? item : "暂无信息");
    }
  },
  computed: {
    ...mapState("roadTransCapacity/", {
      noticeInfo: state => state.noticeInfo
    }),
    ...mapState("roadTransCapacity/", {
      xiafaNotice: state => state.xiafaNotice
    })
  },
  watch: {
    noticeInfo(val) {
      this.popState = true;
      setTimeout(() => {
        this.popState = false;
        if (val.type === "1") {
          this.onClick(1);
        } else if (val.type === "2") {
          this.chooseList_0 = [];
          this.chooseList_1 = [];
          this.checkedAll_0 = false;
          this.checkedAll_1 = false;
        } else if (val.type === "3") {
          this.onClick(2);
        }
      }, 1500);
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // console.log(vm.active);
      if (
        from.name == "sendProtocol" ||
        from.name == "checkProtocol" ||
        from.name == "releaseNotice" ||
        from.name == "introducePage"
      ) {
        vm.$store.commit("updateLoadingStatus", { isLoading: false });
      }
    });
  },
  mounted() {
    this._getInfos().then(result => {
      let type = result.directCount > 0 ? 0 : result.primaryCount > 0 ? 1 : 2;
      this.active = type == 2 ? 0 : type;
      if (this.active == 1) {
        // 控制no_data的显示
        this.dataList_1_finished = false;
      }
      this._getListDetail(type)
        .then(res => {
          if (result.directCount > 0) {
            this.dataList_0 = res.list;
          } else if (result.primaryCount > 0) {
            this.dataList_1 = res.list;
            // 控制no_data的显示
            this.dataList_1_finished = true;
          } else {
            this.dataList_2 = res.list;
          }
          // 判断是否是第一次进来
          if (result.directCount == 0 && this.active == 0) {
            this._isFirstCome().then(response => {
              this.descriptionPage = response.isPopup === "1" ? true : false;
            });
          }
        })
        .catch(err => {
          this.$vux.toast.text(err, "middle");
        });
    });
  },
  methods: {
    initVanList(length) {
      this.isUpLoading = false; // 上拉加载
      if (length < 15) {
        this.upFinished = true;
      } else {
        this.upFinished = false;
      }
    },
    // 上拉加载请求方法
    onLoadList() {
      this.pageIdx++;
      this.__getListDetail(this.active).then((res) => {
        this.isUpLoading = false;
      });
    },
    // 获取列表
    __getListDetail(type) {
      return new Promise((resolve, reject) => {
        // 初始化页面显示toast弹窗
        this.$store.commit("updateLoadingStatus", { isLoading: true });
        getCapacityList({ type: type, pageIdx: this.pageIdx })
          .then(res => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode === "0") {
              let list = res.data.result.list || [];
              if (this.active == '0') {
                list.length > 0 ? this.dataList_0.push(...list) : '';
              } else if (this.active == '1') {
                list.length > 0 ? this.dataList_1.push(...list) : '';
              } else if (this.active == '2') {
                list.length > 0 ? this.dataList_2.push(...list) : '';
              }
              if (list.length < 15) {
                this.upFinished = true;
              } else {
                this.upFinished = false;
              }
              resolve();
            } else {
              this.$vux.toast.text(res.data.reInfo, "middle");
              reject(res.data.reInfo);
            }
          })
          .catch(e => {
            reject(e);
            this.$store.commit("updateLoadingStatus", { isLoading: false });
          });
      });
    },
    onClickLeft() {
      AppFinish(-1);
    },
    onRefresh() {
      this.pageIdx = 1;
      console.log("下拉刷新");
      this.refreshing = false;
      if (this.active == 1) {
        // 控制no_data的显示
        this.dataList_1_finished = false;
      }
      this._getListDetail(this.active)
        .then(res => {
          this.initVanList(res.list.length);
    
          this.checkedAll_0 = false;
          this.checkedAll_1 = false;
          this.chooseList_0 = [];
          this.chooseList_1 = [];

          if (this.active == 0) {
            this.dataList_0 = res.list;
            // this.qipao.directCount = this.dataList_0.length;
          } else if (this.active == 1) {
            this.dataList_1 = res.list;
            // 控制no_data的显示
            this.dataList_1_finished = true;
            // this.qipao.primaryCount = this.dataList_1.length;
          } else {
            this.$store.commit("updateLoadingStatus", { isLoading: true });
            getInfos({ type: "0" })
              .then(res => {
                this.$store.commit("updateLoadingStatus", { isLoading: false });
                if (res.data.reCode === "0") {
                  this.qipao.approvalCount = res.data.result.approvalCount;
                } else {
                  this.$vux.toast.text(res.data.reInfo, "middle");
                }
              })
              .catch(e => {
                this.$store.commit("updateLoadingStatus", { isLoading: false });
              });
            this.dataList_2 = res.list;
          }
        })
        .catch(err => {
          this.$vux.toast.text(err, "middle");
        });
    },
    checkAll_0() {
      this.checkedAll_0 = !this.checkedAll_0;
      // this.$refs.checkboxGroup_0.toggleAll(this.checkedAll_0);
      if (!this.checkedAll_0) {
        this.chooseList_0 = [];
      } else {
        // this.chooseList_0 = this.dataList_0;
        this.chooseList_0 = [...this.dataList_0];
      }
    },
    checkAll_1() {
      this.checkedAll_1 = !this.checkedAll_1;
      // this.$refs.checkboxGroup_1.toggleAll(this.checkedAll_1);
      if (!this.checkedAll_1) {
        this.chooseList_1 = [];
      } else {
        // this.chooseList_1 = this.dataList_1;
        this.chooseList_1 = [...this.dataList_1];
      }
    },
    onClick(index, title) {
      this.pageIdx = 1;
      this.upFinished = true;
      this._getInfos().then(res => {
        if (index === 2) {
          try {
            MtaH5.clickStat("yl_primary_capacity");
          } catch (error) {
            console.log(error);
          }
          this._getListDetail(2)
            .then(res => {
              this.initVanList(res.list.length);
              this.dataList_2 = res.list;
            })
            .catch(err => {
              this.$vux.toast.text(err, "middle");
            });
        } else if (index === 1) {
          try {
            MtaH5.clickStat("yl_primary_capacity");
          } catch (error) {
            console.log(error);
          }
          // 控制no_data的显示
          this.dataList_1_finished = false;
          this._getListDetail(1)
            .then(res => {
              this.initVanList(res.list.length);
              // 控制no_data的显示
              this.dataList_1_finished = true;
              this.checkedAll_1 = false;
              this.chooseList_1 = [];
              this.dataList_1 = res.list;
            })
            .catch(err => {
              this.$vux.toast.text(err, "middle");
            });
        } else {
          try {
            MtaH5.clickStat("yl_direct_capacity");
          } catch (error) {
            console.log(error);
          }
          this._getListDetail(0)
            .then(res => {
              this.initVanList(res.list.length);
              this.checkedAll_0 = false;
              this.chooseList_0 = [];
              this.dataList_0 = res.list;
              // 判断是否是第一次进来
              if (this.qipao.directCount == 0) {
                this._isFirstCome().then(response => {
                  this.descriptionPage =
                    response.isPopup === "1" ? true : false;
                });
              }
            })
            .catch(err => {
              this.$vux.toast.text(err, "middle");
            });
        }
      });
    },
    upgrade() {
      this.active = 1;
    },
    toKnown() {
      this.$router.push({
        path: "/introducePage"
      });
    },
    // 是否是第一次
    _isFirstCome() {
      return new Promise((resolve, reject) => {
        this.$store.commit("updateLoadingStatus", { isLoading: true });
        isFirstCome({})
          .then(res => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode === "0") {
              resolve(res.data.result);
            } else {
              this.$vux.toast.text(res.data.reInfo, "middle");
              reject(res.data.Info);
            }
          })
          .catch(e => {
            reject(e);
            this.$store.commit("updateLoadingStatus", { isLoading: false });
          });
      });
    },
    _getListDetail(item) {
      return new Promise((resolve, reject) => {
        this.$store.commit("updateLoadingStatus", { isLoading: true });
        getCapacityList({ type: item, pageIdx: this.pageIdx })
          .then(res => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode === "0") {
              resolve(res.data.result);
            } else {
              this.$vux.toast.text(res.data.reInfo, "middle");
              reject(res.data.reInfo);
            }
          })
          .catch(e => {
            reject(e);
            this.$store.commit("updateLoadingStatus", { isLoading: false });
          });
      });
    },
    // 统计所有气泡数据
    _getInfos() {
      return new Promise((resolve, reject) => {
        this.$store.commit("updateLoadingStatus", { isLoading: true });
        getInfos({ type: "0" })
          .then(res => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode === "0") {
              this.qipao = res.data.result;
              resolve(res.data.result);
            } else {
              this.$vux.toast.text(res.data.reInfo, "middle");
              reject(res.data.reInfo);
            }
          })
          .catch(e => {
            reject(e);
            this.$store.commit("updateLoadingStatus", { isLoading: false });
          });
      });
    },
    // 下发通知
    releaseNotice(item) {
      try {
        MtaH5.clickStat("yl_release_notice");
      } catch (error) {
        console.log(error);
      }
      let list = item === 0 ? this.chooseList_0 : this.chooseList_1;
      this.$store.commit("roadTransCapacity/setXiafaNotice", list);
      this.$router.push({
        path: "./releaseNotice"
      });
    },
    // 升级直属
    upgradeDirect() {
      try {
        MtaH5.clickStat("yl_upgrade_direct");
      } catch (error) {
        console.log(error);
      }
      this.$store.commit("roadTransCapacity/setXiafaNotice", this.chooseList_1);
      this.$router.push({
        path: "./sendProtocol"
      });
    },
    // 协议已签署点击 /通过 / 重新通过
    gotoDetail(item) {
      try {
        MtaH5.clickStat("yl_qianshu");
      } catch (error) {
        console.log(error);
      }
      this.$store.commit("roadTransCapacity/setShenpi", item);
      this.$router.push({
        path: "/checkProtocol"
      });
    },
    passProtocol(item) {
      if (item.state == 1) {
        try {
          MtaH5.clickStat("yl_repass");
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          MtaH5.clickStat("yl_pass");
        } catch (error) {
          console.log(error);
        }
      }
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      let json = {
        transApprId: item.transApprId,
        cartBadgeNo: item.cartBadgeNo,
        mobileNo: item.mobileNo,
        state: "2"
      };
      approvalOperation(json)
        .then(res => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          if (res.data.reCode === "0") {
            this.$store.commit("roadTransCapacity/setNoticeInfo", {
              driverName: item.driverName,
              type: "3"
            });
            // 跳转对应的tab栏
            this.qipao.approvalCount -= 1;
            this.active = 2;
            this.onClick(this.active);
          } else {
            this.$vux.toast.text(res.data.reInfo, "middle");
          }
        })
        .catch(err => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
        });
    }
  }
};
</script>

<style lang="less" scoped>
.mytransCap {
  min-height: 100vh;
  box-sizing: border-box;
  /deep/ .van-tabs {
    position: fixed;
    width: 100%;
    z-index: 999;
  }
  /deep/ .van-tab {
    height: 55px;
  }
  /deep/ .van-list {
    padding: 0 10px;
    padding-top: 100px;
    padding-bottom: 60px;
    min-height: 100vh;
    box-sizing: border-box;
  }
  /deep/.van-tabs__line {
    background-color: #15499a;
  }
  /deep/.van-tabs {
    top: 46px;
    // height: 100%;
    // .van-tab__pane {
    //   min-height: 100%;
    //   height: auto;
    //   background: #efefef;
    // }
  }
  .van-nav-bar__right {
    bottom: -4px;
  }
  /deep/ .van-tabs__wrap {
    height: 40px;
    width: 100%;
    position: fixed;
    z-index: 999;
  }
  // /deep/ .van-tabs__content {
  //   padding-top: 40px;
  //   min-height: 100%;
  //   box-sizing: border-box;
  //   background: #efefef;
  // }
  /deep/ .van-popup--center.van-popup--round {
    border-radius: 5px;
  }
  .van-tab {
    .resolve_title {
      position: relative;
      .red_badge {
        position: absolute;
        top: 5px;
        right: 24px;
        background: red;
        min-height: 16px;
        min-width: 16px;
        border-radius: 50%;
        line-height: 16px;
        color: #ffffff;
        font-size: 12px;
        // font-weight: 100;
      }
    }
  }
  .container {
    // padding-top: 46px;
    // height: 100vh;
    // position: relative;
    // box-sizing: border-box;
    // overflow: auto;
    flex-direction: column;
    box-sizing: border-box;
    background: #ededed;
    .card_list {
      width: 100%;
      // min-height: 100%;
      padding: 10px;
      padding-bottom: 60px;
      box-sizing: border-box;
      font-size: 14px;
      .direction {
        flex-direction: column;
      }
      .card {
        min-height: 114px;
        height: auto;
        width: 100%;
        margin-bottom: 15px;
        padding-top: 10px;
        box-sizing: border-box;
        display: flex;
        .check_box {
          margin: 4px 0px 0px 8px;
        }
        .card_content {
          position: relative;
          flex: 1;
          padding-left: 10px;
          .card_top {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .cardBadge {
              // margin-left: 10px;
              background: #eaa732;
              border: 1px solid #1d1200;
              border-radius: 2px;
              padding: 0px 4px;
            }
            .sign {
              position: absolute;
              width: 70px;
              height: 48px;
              line-height: 38px;
              right: 12px;
              top: 0px;
              background: url("../../assets/imgs/roadTransCapacity/xieyiqianshu_img@2x.png")
                no-repeat center center;
              background-size: 76% 100%;
              color: #d84b4c;
            }
            .time {
              // flex: 1;
              margin-left: 6px;
              color: #d84b4c;
            }
            .logo {
              text-align: right;
              width: 64px;
              background: url("../../assets/imgs/roadTransCapacity/zhishubiaoqian_img@2x.png")
                no-repeat center center;
              background-size: 100% 100%;
              position: absolute;
              right: 0px;
              top: 0px;
              .level {
                margin-right: 4px;
                color: #0b3a5e;
              }
            }
          }
          .card_bottom {
            width: 100%;
            padding: 12px 0px 10px 0px;
            height: auto;
            display: flex;
            font-size: 14px;
            box-sizing: border-box;
            display: flex;
            .bottom_left {
              width: 74px;
              padding-right: 2px;
              height: 100%;
              text-align: center;
              .diver_img {
                width: 50px;
                height: 50px;
                background: #fff;
                border-radius: 50%;
                overflow: hidden;
                // display: inline-block;
                margin: 0 auto;
                margin-bottom: 1px;
                img {
                  width: 100%;
                  height: 100%;
                }
              }
              .loyal {
                color: #f17d29;
                border: 1px solid #f17d29;
                background-color: #fef4e2;
                font-size: 12px;
                // width: 55px;
                display: inline-block;
                padding: 0 3px;
                height: 15px;
                line-height: 15px;
                margin: 0 auto;
                border-top-left-radius: 6px;
                border-bottom-right-radius: 6px;
              }
              .upgradeState {
                color: #1cb49d;
                border: 1px solid #1cb49d;
                background-color: #f7f7f7;
                font-size: 11px;
                padding: 0px 5px;
                display: inline-block;
                border-radius: 10px;
              }
            }
            .bottom_right {
              min-height: 66px;
              // width: 80%;
              flex: 1;
              height: auto;
              border-left: 1px solid #c5c5c5;
              // margin-left: 6px;
              padding-left: 10px;
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
              .driver_info {
                // line-height: 22px;
                // vertical-align: top;
                line-height: 100%;
                margin-bottom: 8px;
                color: #3b2705;
                .driver {
                  font-weight: bold;
                  margin: 0;
                }
                .tel {
                  padding-left: 4px;
                  opacity: 0.8;
                  font-weight: normal;
                }
              }
              .long_type {
                color: #313233;
              }
              .location {
                color: #3b2705;
                line-height: 18px;
                word-break: break-all;
                // line-height: 100%;
              }
            }
          }
        }
        .card_footer {
          width: 100%;
          background: #ffffff;
          padding: 6px;
          box-sizing: border-box;
          display: -webkit-box;
          display: -webkit-flex;
          display: flex;
          -webkit-box-pack: justify;
          -webkit-justify-content: space-between;
          justify-content: space-between;
          .footer_left {
            color: #9f9f9f;
            line-height: 30px;
          }
          .footer_right {
            .van-button {
              height: 30px;
              line-height: 30px;
              border-radius: 20px;
              min-width: 74px;
            }
            .van-button--default {
              background-color: #15499a;
              color: #ffffff;
            }
            .van-button--disabled {
              background-color: #bfbfbf;
              opacity: 1;
            }
            .orange {
              background-color: #ff8a00;
              color: #ffffff;
            }
          }
        }
      }
      .no_data {
        text-align: center;
        margin-top: 100px;
        img {
          width: 100px;
        }
        .blue {
          color: #15499a;
          margin: 10px;
        }
      }
    }
    .card_list_0 {
      .card {
        background: url("../../assets/imgs/roadTransCapacity/zhishubg_img@2x.png")
          no-repeat center center;
        background-size: 100% 100%;
      }
      /deep/ .van-icon {
        border: 1px solid #d0b482;
        background-color: #ffffff;
      }
      .bottom_right {
        border-left: 1px solid #bca374 !important;
      }
    }
    .card_list_1 {
      /deep/ .van-icon {
        border: 1px solid #b2b2b2;
        background-color: #ffffff;
      }
      .card {
        background: linear-gradient(
          0deg,
          rgba(245, 245, 245, 1),
          rgba(237, 237, 237, 1),
          rgba(218, 218, 218, 1)
        );
        .card_content {
          .card_top {
            .logo {
              background: url("../../assets/imgs/roadTransCapacity/chujibg_img_logo@2x.png")
                no-repeat center center;
              background-size: 100% 100%;
              .level {
                color: #454545;
              }
            }
          }
        }
      }
    }
    .footer {
      font-size: 14px;
      .footer_item {
        position: fixed;
        width: 100%;
        z-index: 999;
        left: 0;
        bottom: 0;
        height: 60px;
        padding: 0 13px;
        box-sizing: border-box;
        background: #fff;
        display: flex;
        align-items: center;
        .check_box {
          display: flex;
          align-items: center;
          margin-right: 15px;
          /deep/.van-checkbox__icon--round .van-icon {
            margin-right: 6px;
            background-color: #ffffff;
            border: 1px solid #b2b2b2;
          }
        }
        .checked {
          flex: 1;
          span {
            color: #15499a;
          }
        }
        .btn {
          height: 35px;
          line-height: 31px;
          background: #15499a;
          border-radius: 25px;
          font-size: 14px;
          color: #ffffff;
          @media screen and (max-width: 320px) {
            font-size: 12px;
          }
        }
        .van-button--disabled {
          opacity: 1;
          background-color: #bfbfbf;
        }
      }
    }
  }
}
</style>
