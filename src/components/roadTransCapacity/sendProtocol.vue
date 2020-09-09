<template>
  <div class="send_protocol" v-show="pageState">
    <c-header isShowTitle>
      <van-nav-bar @click-left="onClickLeft" title="发送协议" left-arrow fixed />
    </c-header>
    <div class="top">
      <p>请确认以下协议内容, 发送后司机接受即成为您的直属运力</p>
      <div class="person_info">
        <img :src="headImg" alt />
        <div class="info_detail">
          <div>{{orgName}}</div>
          <div class="name">运力经理人：{{ realName }}</div>
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
          <div class="detail" v-html="item2.content">
            <!-- {{item2.content}} -->
            <span v-show="item2.url">{{item2.url}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="receive">
        <div class="receive_cell">
          <div class="receive_label">接收人：</div>
          <div class="receive_info">
            <span class="person_length">{{this.xiafaNotice.length}}</span>
            <span>{{this.nameList}}</span>
          </div>
          <div class="check_info" @click="checkPerson">查看>></div>
        </div>
      </div>
      <div class="phone">
        <div class="phone_notice">电话通知：</div>
        <div class="phone_info">司机超24h未确认，客户经理跟进电话通知司机</div>
        <div class="phone_switch">
          <van-switch
            v-model="checked"
            active-color="#15499A"
            inactive-color="#BCBCBC"
            size="18px"
          />
        </div>
      </div>
      <div class="footer">
        <van-button
          type="default"
          size="large"
          :disabled="disabledState"
          @click="sendProtocol"
        >发送直属邀请</van-button>
      </div>
    </div>

    <!-- 弹框 -->
    <!-- <van-popup
      v-model="popState"
      :close-on-click-overlay="false"
      :style="{ padding: '20px 0px',width:'80%',textAlign:'center',borderRadius:'10px'}"
    >
      <p style="font-weight:bold;color:#313233">发送升级直属运力成功！</p>
      <p>接收人：{{transOrgs.length}}</p>
    </van-popup>-->
  </div>
</template>

<script>
import { NavBar, Switch, Button, Popup } from "vant";
import {
  getUserInfo,
  getServeInfo,
  upgradeDirect
} from "../../api/apiRoadTransCapacity";
import { mapState } from "vuex";
export default {
  components: {
    vanNavBar: NavBar,
    vanSwitch: Switch,
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
      nameList: "",
      transOrgs: [],
      checked: true,
      // popState: false, //弹框状态
      headImg: "",
      realName: "",
      orgName: "",
      pageState: false
    };
  },
  computed: {
    disabledState: {
      get() {
        return this.checked === false;
      }
    },
    ...mapState("roadTransCapacity/", {
      xiafaNotice: state => state.xiafaNotice
    })
  },
  watch: {
    checked(val) {
      this.transOrgs = [];
      this.xiafaNotice.forEach(item => {
        this.transOrgs.push(item.transOrgId);
      });
    }
    // popState(val) {
    //   if (val) {
    //     setTimeout(() => {
    //       this.popState = false;
    //     }, 1500);
    //   }
    // }
  },
  mounted() {
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
      if (this.xiafaNotice.length > 0) {
        this.xiafaNotice.forEach((element, index) => {
          if (index == 0) {
            this.nameList += element.driverName;
          } else {
            this.nameList += "、" + element.driverName;
          }
          this.transOrgs.push(element.transOrgId);
        });
      }
    });
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    checkPerson() {
      try {
        MtaH5.clickStat("yl_receive_person");
      } catch (error) {
        console.log(error);
      }
      this.$router.push({
        path: "/receivePerson"
      });
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
    sendProtocol() {
      try {
        MtaH5.clickStat("yl_send_direct_invite");
      } catch (error) {
        console.log(error);
      }
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      let json = {
        transOrgs: this.transOrgs
      };
      upgradeDirect(json)
        .then(res => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          if (res.data.reCode === "0") {
            this.$store.commit("roadTransCapacity/setNoticeInfo", {
              dataLength: this.transOrgs.length,
              type: "1"
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
.send_protocol {
  width: 100%;
  position: absolute;
  top: 0px;
  min-height: 100%;
  height: auto;
  color: #202020;
  background-color: #efefef;
  /*修改滚动条样式*/
  div::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  div::-webkit-scrollbar-track {
    background: rgb(239, 239, 239);
    border-radius: 2px;
  }
  div::-webkit-scrollbar-thumb {
    background: #bfbfbf;
    border-radius: 10px;
  }
  div::-webkit-scrollbar-thumb:hover {
    background: #333;
  }
  div::-webkit-scrollbar-corner {
    background: #179a16;
  }
  .top {
    position: absolute;
    top: 46px; /*头部绝对定位位置*/
    left: 0;
    width: 100%;
    p {
      padding: 10px 0px;
      font-size: 12px;
      color: #121212;
      margin-left: 10px;
      height: 22px;
      line-height: 22px;
    }
    .person_info {
      background-color: #ffffff;
      width: 100%;
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      padding: 10px;
      box-sizing: border-box;
      img {
        width: 50px;
        height: 50px;
      }
      .info_detail {
        margin-left: 10px;
        .name {
          font-size: 15px;
        }
      }
    }
  }
  .main {
    position: absolute;
    width: 100%;
    top: 168px;
    bottom: 203px;
    // overflow-y: scroll;
    overflow: auto;
    background-color: #ffffff;
    p {
      margin-top: 10px;
      margin-bottom: 12px;
      margin-left: 10px;
      font-size: 16px;
      font-weight: bold;
    }
    .card {
      width: 100%;
      padding: 0px 10px 4px;
      box-sizing: border-box;
      img {
        height: 40px;
        width: 40px;
        border-radius: 50%;
        vertical-align: top;
        margin-top: 2px;
      }
      .info_detail {
        margin-left: 4px;
        width: 78%;
        @media screen and (max-width: 320px) {
          width: 70%;
        }
        vertical-align: super;
        display: inline-block;
        height: 22px;
        line-height: 22px;
        .items {
          font-weight: Bold;
          font-size: 15px;
          line-height: 1.8;
        }
        .detail {
          font-size: 13px;
          color: #6c6c6c;
          line-height:20px;
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
  .bottom {
    position: absolute;
    bottom: 0; /*尾部绝对定位位置*/
    left: 0;
    width: 100%;
    .receive {
      background-color: #ffffff;
      margin-top: 10px;
      .receive_cell {
        height: 24px;
        line-height: 24px;
        padding: 10px;
        font-weight: bold;
        font-size: 15px;
        display: flex;
        .receive_label {
          width: 68px;
        }
        .receive_info {
          font-weight: normal;
          width: 230px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          @media screen and (max-width: 320px) {
            width: 165px;
          }
          .person_length {
            color: #15499a;
            margin-right: 6px;
          }
        }
        .check_info {
          color: #15499a;
          width: 68px;
          font-weight: normal;
          text-align: right;
          // position: absolute;
          // right: 0;
        }
      }
    }
    .phone {
      background-color: #ffffff;
      margin-top: 10px;
      line-height: 24px;
      padding: 10px;
      font-weight: bold;
      font-size: 15px;
      display: flex;
      position: relative;
      .phone_notice {
        width: 78px;
      }
      .phone_info {
        font-weight: normal;
        width: 205px;
        @media screen and (max-width: 320px) {
          width: 165px;
        }
      }
      .phone_switch {
        width: 70px;
        height: 30px;
        text-align: right;
        // position: absolute;
        // right: 0px;
        // top: 20px;
      }
    }
    .footer {
      width: 100%;
      padding: 10px;
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
    }
  }
}
</style>