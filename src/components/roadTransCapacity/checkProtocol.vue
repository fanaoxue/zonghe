<template>
  <div class="check_protocol">
    <c-header isShowTitle>
      <van-nav-bar @click-left="onClickLeft" title="查看协议" left-arrow fixed />
    </c-header>
    <div class="content">
      <div class="white_bg">
        <div class="top">
          <p>直属运力协议</p>
          <div class="person_info">
            <div class="company">{{orgName}}</div>
            <div class="manager">直属经理人：{{realName}}</div>
            <div class="driver">直属运力：{{shenpi.driverName}}</div>
            <div class="right_img">
              <div class="img1">
                <img :src="shenpi.headImg" alt />
              </div>
              <div class="img2">
                <img :src="headImg" alt />
              </div>
            </div>
          </div>
        </div>
        <div class="main">
          <p class="p1">直属运力服务标准</p>
          <div class="card" v-for="(item1,index1) in cardList1" :key="index1">
            <img :src="item1.icon" alt />
            <div class="info_detail">
              <div class="items">{{item1.title}}</div>
              <div class="detail">{{item1.content}}</div>
            </div>
          </div>
          <div class="line"></div>
          <p class="p2" v-show="cardList2.length > 0">直属运力权益</p>
          <div class="card" v-for="(item2,index2) in cardList2" :key="'A'+ index2">
            <img :src="item2.icon" alt />
            <div class="info_detail">
              <div class="items">{{item2.title}}</div>
              <div class="detail" v-html="item2.content"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="triangle">
        <img src="../../assets/imgs/roadTransCapacity/luyouyunlilogo_img@2x.png" alt class="logo" />
      </div>
    </div>
    <div style="height:90px;"></div>
    <div class="footer">
      <div class="mini" v-show="shenpi.state == 0">
        <van-button type="default" mini plain @click="refuse">拒绝</van-button>
        <van-button type="default" mini @click="passProtocol(1)">通过</van-button>
      </div>
      <van-button type="default" size="large" v-show="shenpi.state == 2" disabled>已通过</van-button>
      <van-button
        type="default"
        size="large"
        color="#F17D29"
        v-show="shenpi.state == 1"
        @click="passProtocol(0)"
      >重新通过</van-button>
    </div>
    <!-- 弹框 -->
    <!-- <van-popup
      v-model="popState"
      :close-on-click-overlay="false"
      :style="{ padding: '20px 0px',width:'80%',textAlign:'center',borderRadius:'10px'}"
    >
      <p style="font-weight:bold;color:#313233">已升级{{shenpi.driverName}}为直属运力！</p>
    </van-popup>-->
  </div>
</template>

<script>
import { NavBar, Button, Popup } from "vant";
import { mapState } from "vuex";
import {
  getUserInfo,
  getServeInfo,
  approvalOperation
} from "../../api/apiRoadTransCapacity";
export default {
  components: {
    vanNavBar: NavBar,
    vanButton: Button,
    vanPopup: Popup
  },
  data() {
    return {
      cardList1: [
        {
          icon: require("../../assets/imgs/roadTransCapacity/lvyuenengli_icon@2x.png"),
          title: "履约能力",
          content:
            "面对运输任务要按时到场，不临时加价，秉着诚信原则响应并完成运输。"
        },
        {
          icon: require("../../assets/imgs/roadTransCapacity/fuwunengli_icon@2x.png"),
          title: "服务能力",
          content: "积极配合装卸货现场的要求，与经理人共同服务好上游货主。"
        },
        {
          icon: require("../../assets/imgs/roadTransCapacity/baozhanganquan_icon@2x.png"),
          title: "保障安全",
          content: "保障货物运输安全，根据物品属性做好防护措施。"
        },
        {
          icon: require("../../assets/imgs/roadTransCapacity/taiduliagnhao_icon@2x.png"),
          title: "态度良好",
          content: "面对可能出现的各种突发事件或纠纷，能够冷静沟通积极处理。"
        }
      ],
      cardList2: [],
      showState: true,
      // popState: false,
      headImg: "",
      realName: "",
      orgName: ""
    };
  },
  created() {
    this.$store.commit("updateLoadingStatus", { isLoading: false });
  },
  computed: {
    ...mapState("roadTransCapacity/", {
      shenpi: state => state.shenpi
    })
  },
  mounted() {
    console.log(this.shenpi);
    this._getUserInfo().then(() => {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      getServeInfo({}).then(res => {
        this.$store.commit("updateLoadingStatus", { isLoading: false });
        if (res.data.reCode === "0") {
          this.cardList2 = res.data.result;
        } else {
          this.$vux.toast.text(res.data.reInfo, "middle");
        }
      });
    });
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    _getUserInfo() {
      return new Promise((resolve, reject) => {
        this.$store.commit("updateLoadingStatus", { isLoading: true });
        getUserInfo({})
          .then(res => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode === "0") {
              const { headImg, realName, orgName } = res.data.result;
              this.headImg = headImg;
              this.realName = realName;
              this.orgName = orgName;
              resolve();
            } else {
              this.$vux.toast.text(res.data.reInfo, "middle");
              reject();
            }
            this.pageState = true;
          })
          .catch(e => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.pageState = true;
            reject();
          });
      });
    },
    refuse() {
      try {
        MtaH5.clickStat("yl_refuse");
      } catch (error) {
        console.log(error);
      }
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      let json = {
        transApprId: this.shenpi.transApprId,
        cartBadgeNo: this.shenpi.cartBadgeNo,
        mobileNo: this.shenpi.mobileNo,
        state: "1"
      };
      approvalOperation(json)
        .then(res => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          if (res.data.reCode === "0") {
            this.$store.commit("roadTransCapacity/setNoticeInfo", {
              driverName: "",
              type: "3"
            });
            this.$router.go(-1);
          } else {
            this.$vux.toast.text(res.data.reInfo, "middle");
          }
        })
        .catch(err => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
        });
    },
    passProtocol(item) {
      if (item == "1") {
        try {
          MtaH5.clickStat("yl_pass");
        } catch (error) {
          console.log(error);
        }
      }
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      let json = {
        transApprId: this.shenpi.transApprId,
        cartBadgeNo: this.shenpi.cartBadgeNo,
        mobileNo: this.shenpi.mobileNo,
        state: "2"
      };
      approvalOperation(json)
        .then(res => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          if (res.data.reCode === "0") {
            this.$store.commit("roadTransCapacity/setNoticeInfo", {
              driverName: this.shenpi.driverName,
              type: "3"
            });
            this.$router.go(-1);
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
.check_protocol {
  width: 100%;
  position: absolute;
  top: 0px;
  min-height: 100%;
  height: auto;
  color: #313233;
  background-color: #efefef;
  padding: 10px;
  box-sizing: border-box;
  .content {
    margin-top: 46px;
    background-color: #decea8;
    min-height: 200px;
    height: auto;
    width: 100%;
    position: relative;
    padding: 5px;
    box-sizing: border-box;
    .white_bg {
      background-color: #ffffff;
      width: 100%;
      min-height: 200px;
      height: auto;
      padding: 10px;
      box-sizing: border-box;
      .top {
        width: 100%;
        height: auto;
        p {
          height: 25px;
          line-height: 25px;
          padding: 10px 0px 20px 0px;
          font-size: 18px;
          color: #121212;
          font-weight: bold;
          margin-left: 10px;
          text-align: center;
        }
        .person_info {
          background-color: #ffffff;
          width: 100%;
          min-height: 80px;
          height: auto;
          padding: 15px 10px;
          box-sizing: border-box;
          display: inline-block;
          border-top: 1px solid #bcbcbc;
          border-bottom: 1px dashed #bcbcbc;
          display: flex;
          display: -webkit-box;
          display: -webkit-flex;
          -webkit-box-orient: vertical;
          -webkit-box-direction: normal;
          -webkit-flex-direction: column;
          flex-direction: column;
          position: relative;
          .company {
            font-weight: bold;
            margin-bottom: 4px;
            max-width: 72%;
          }
          .manager {
            font-size: 14px;
            max-width: 72%;
          }
          .driver {
            font-size: 14px;
            max-width: 72%;
          }
          .right_img {
            width: 30%;
            min-height: 80px;
            position: absolute;
            right: 0px;
            .img1 {
              width: 60px;
              height: 60px;
              background-color: #ccc;
              border-radius: 50%;
              overflow: hidden;
              position: absolute;
              left: 0px;
              top: 10px;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .img2 {
              width: 60px;
              height: 60px;
              background-color: #ccc;
              border-radius: 50%;
              overflow: hidden;
              position: absolute;
              left: 30px;
              top: 10px;
              img {
                width: 100%;
                height: 100%;
              }
            }
          }
        }
      }
      .main {
        width: 100%;
        overflow: auto;
        p {
          // margin: 10px;
          // font-weight: bold;
          margin-top: 10px;
          margin-bottom: 12px;
          margin-left: 10px;
          font-size: 16px;
          font-weight: bold;
        }
        .card {
          // width: 100%;
          // padding: 5px 10px;
          min-height: 56px;
          width: 100%;
          padding: 0px 10px 4px;
          box-sizing: border-box;
          img {
            // height: 50px;
            // width: 50px;
            // border-radius: 50%;
            // vertical-align: top;
            // margin-top: 4px;
            height: 40px;
            width: 40px;
            border-radius: 50%;
            vertical-align: top;
            margin-top: 2px;
          }
          .info_detail {
            margin-left: 4px;
            width: 75%;
            @media screen and (max-width: 320px) {
              width: 70%;
            }
            display: inline-block;
            .items {
              font-weight: Bold;
              font-size: 15px;
            }
            .detail {
              font-size: 13px;
              color: #6c6c6c;
              span {
                color: #15499a;
              }
            }
          }
        }
        .line {
          border-bottom: 1px dashed #bcbcbc;
          margin: 10px;
        }
      }
    }
    .triangle {
      width: 0px;
      height: 0px;
      border: 85px solid;
      border-right: 0;
      border-color: #decea8 transparent transparent;
      position: absolute;
      right: 0;
      top: 0;
      .logo {
        width: 26px;
        position: absolute;
        top: -70px;
        left: -34px;
      }
    }
  }
  .footer {
    padding: 20px 10px;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    .van-button--default {
      background-color: #15499a;
      color: #ffffff;
      font-size: 16px !important;
      border-radius: 6px;
    }
    .van-button--disabled {
      background-color: #cccccc;
      opacity: 1;
    }
    .mini {
      text-align: center;
      .van-button--default {
        width: 34%;
        margin: 0px 20px;
      }
      .van-button--plain {
        background-color: #ffffff;
        color: #15499a;
        border: 1px solid #15499a;
      }
    }
  }
}
</style>