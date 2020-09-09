<template>
  <div class="receive_person">
    <c-header isShowTitle>
      <van-nav-bar @click-left="onClickLeft" :title="title" left-arrow fixed />
    </c-header>
    <div class="content">
      <div class="card_list">
        <van-checkbox-group v-model="result">
          <div class="card" v-for="(item,index) in dataResult" :key="index" click="toggle(index)">
            <div class="card_top">
              <van-checkbox :name="item" ref="checkboxes" checked-color="#15499A" icon-size="16px"></van-checkbox>
              <div class="cardBadge">{{item.cartBadgeNo | cartBadgeNoFilter}}</div>
              <div class="time">合作次数： {{item.cooperateNum}}</div>
            </div>
            <div class="logo">
              <span class="level">初级</span>
            </div>
            <div class="card_bottom">
              <div class="bottom_left">
                <img :src="item.headImg" alt class="diver_img" />
                <div class="loyal" v-if="item.upgradeState != 1">忠诚度{{item.matchingDegree}}</div>
                <div class="upgradeState" v-else>升级待通过</div>
              </div>
              <div class="bottom_right">
                <div class="driver_info">
                  <span class="driver">{{item.driverName}}</span>
                  <span class="tel">{{item.mobileNo}}</span>
                </div>
                <!-- <div class="long_type">
                  <span>13米 高栏</span>
                </div>-->
                <div class="location">
                  <span>车辆位置：{{item.curPosition | positionFilter}}</span>
                </div>
              </div>
            </div>
          </div>
        </van-checkbox-group>
      </div>
    </div>
    <div style="height:70px"></div>
    <div class="footer">
      <van-button type="default" @click="select" :disabled="!(result.length > 0)">确认选择</van-button>
    </div>
  </div>
</template>

<script>
import { NavBar, Button, Checkbox, CheckboxGroup } from "vant";
import { receivePersonList } from "../../api/apiRoadTransCapacity";
import { mapState } from "vuex";
export default {
  components: {
    vanNavBar: NavBar,
    vanButton: Button,
    vanCheckbox: Checkbox,
    vanCheckboxGroup: CheckboxGroup
  },
  data() {
    return {
      result: [],
      dataResult: [],
      transOrgs: []
    };
  },
  // watch: {
  //   result(val) {
  //     console.log(val);
  //   }
  // },
  filters: {
    cartBadgeNoFilter(item) {
      return (item = item.slice(0, 2) + "·" + item.slice(2, item.length));
    },
    positionFilter(item) {
      return (item = item ? item : "暂无信息");
    }
  },
  computed: {
    title() {
      return "接收人" + "(" + this.result.length + ")";
    },
    ...mapState("roadTransCapacity/", {
      xiafaNotice: state => state.xiafaNotice
    })
  },
  mounted() {
    // console.log(this.xiafaNotice);
    this.$store.commit("updateLoadingStatus", { isLoading: false });
    this.result = this.xiafaNotice;
    this.dataResult = this.xiafaNotice;
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    // dataInit() {
    //   let json = {
    //     transOrgs: [6570, 6571, 6572, 6573]
    //   };
    //   receivePersonList(json)
    //     .then(res => {
    //       this.$store.commit("updateLoadingStatus", { isLoading: false });
    //       if (res.data.reCode === "0") {
    //         this.dataResult = res.data.result.list;
    //       } else {
    //         this.$vux.toast.text(res.data.reInfo, "middle");
    //       }
    //     })
    //     .catch(err => {
    //       this.$store.commit("updateLoadingStatus", { isLoading: false });
    //     });
    // },
    toggle(index) {
      this.$refs.checkboxes[index].toggle();
    },
    select() {
      this.$store.commit("roadTransCapacity/setXiafaNotice", this.result);
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
.receive_person {
  width: 100%;
  position: absolute;
  top: 0px;
  min-height: 100%;
  height: auto;
  color: #313233;
  background-color: #efefef;
  .content {
    .card_list {
      width: 100%;
      margin-top: 48px;
      padding: 10px;
      box-sizing: border-box;
      font-size: 14px;
      .card {
        min-height: 114px;
        height: auto;
        width: 100%;
        margin-bottom: 15px;
        position: relative;
        padding: 10px;
        box-sizing: border-box;
        box-shadow: 0px 0px 2px 0px #9f9f9f;
        background: url("../../assets/imgs/roadTransCapacity/chujibg_img@2x.png")
          no-repeat center center;
        background-size: 100% 100%;
        .card_top {
          display: flex;
          width: 80%;
          /deep/.van-checkbox__icon--round .van-icon {
            background-color: #ffffff;
            border: 1px solid #b2b2b2;
          }
          .cardBadge {
            margin-left: 10px;
            background: #eaa732;
            border: 1px solid #1d1200;
            border-radius: 4px;
            padding: 0px 4px;
          }
          .time {
            margin-left: 10px;
            color: #d84b4c;
          }
        }
        .logo {
          width: 64px;
          position: absolute;
          top: 10px;
          right: 0px;
          background: url("../../assets/imgs/roadTransCapacity/chujibg_img_logo@2x.png")
            no-repeat center center;
          background-size: 100% 100%;
          text-align: right;
          .level {
            margin-right: 4px;
            color: #797979;
          }
        }
        .card_bottom {
          width: 100%;
          padding: 10px 0px 10px 24px;
          height: auto;
          display: flex;
          font-size: 14px;
          box-sizing: border-box;
          .bottom_left {
            width: 78px;
            height: 100%;
            text-align: center;
            .diver_img {
              width: 43px;
              height: 43px;
              background: #fff;
              border-radius: 50%;
            }
            .loyal {
              color: #f17d29;
              border: 1px solid #f17d29;
              background-color: #fff2ea;
              font-size: 12px;
              padding: 0px 2px;
              border-top-left-radius: 6px;
              border-bottom-right-radius: 6px;
            }
            .upgradeState {
              color: #1cb49d;
              border: 1px solid #1cb49d;
              background-color: #f7f7f7;
              font-size: 12px;
              padding: 0px 2px;
              border-radius: 10px;
            }
          }
          .bottom_right {
            min-height: 70px;
            width: 80%;
            height: auto;
            border-left: 1px solid #9f9f9f;
            margin-left: 6px;
            padding-left: 6px;
            display: flex;
            display: -webkit-box;
            display: -webkit-flex;
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
            -webkit-flex-direction: column;
            flex-direction: column;
            .driver_info {
              .driver {
                font-weight: bold;
              }
              .tel {
                margin-left: 4px;
                color: #7d7d7e;
              }
            }
          }
        }
      }
    }
  }
  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #ffffff;
    height: 70px;
    line-height: 70px;
    text-align: center;
    .van-button--normal {
      width: 90%;
      background-color: #15499a;
      color: #ffffff;
      font-size: 17px;
      border-radius: 25px;
    }
    .van-button--disabled {
      background-color: #cccccc;
      opacity: 1;
    }
  }
}
</style>