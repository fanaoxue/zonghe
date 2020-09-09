<template>
  <div class="release_notice">
    <c-header isShowTitle>
      <van-nav-bar @click-left="onClickLeft" title="下发通知" left-arrow fixed />
    </c-header>
    <div class="content">
      <p>通过群发消息，发送最新的公司通知等重要消息</p>
      <van-field
        v-model.trim="message"
        autosize
        rows="10"
        type="textarea"
        maxlength="500"
        placeholder="请输入群发消息内容"
        show-word-limit
      />
      <p>接收人数: {{this.xiafaNotice.length}}</p>
    </div>
    <div class="footer">
      <van-button type="default" size="large" @click="ensureToSend" :disabled="!this.message">确认发送</van-button>
    </div>

    <!-- 弹框 -->
    <!-- <van-popup
      v-model="popState"
      :close-on-click-overlay="false"
      :style="{ padding: '20px 0px',width:'80%',textAlign:'center',borderRadius:'10px'}"
    >
      <p style="font-weight:bold;color:#313233">下发通知成功！</p>
      <p>接收人：{{xiafaNotice.length}}</p>
    </van-popup>-->
  </div>
</template>

<script>
import { NavBar, Field, Button, Popup } from "vant";
import { mapState } from "vuex";
import { releaseNotice } from "@/api/apiRoadTransCapacity.js";
export default {
  components: {
    vanNavBar: NavBar,
    vanField: Field,
    vanButton: Button,
    vanPopup: Popup
  },
  data() {
    return {
      message: "",
      mobileNoList: []
      // popState: false
    };
  },
  computed: {
    ...mapState("roadTransCapacity/", {
      xiafaNotice: state => state.xiafaNotice
    })
  },
  created() {
    this.$store.commit("updateLoadingStatus", { isLoading: false });
  },
  mounted() {
    this.mobileNoList = [];
    this.xiafaNotice.forEach(item => {
      this.mobileNoList.push(item.mobileNo);
    });
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    //确认发送
    ensureToSend() {
      try {
        MtaH5.clickStat("yl_ensure_send");
      } catch (error) {
        console.log(error);
      }
      let json = {
        mobileNoList: this.mobileNoList,
        content: this.message
      };
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      releaseNotice(json)
        .then(res => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          if (res.data.reCode === "0") {
            this.$store.commit("roadTransCapacity/setNoticeInfo", {
              dataLength: this.mobileNoList.length,
              type: "2"
            });
            this.$router.go(-1);
          } else {
            this.$vux.toast.text(res.data.reInfo, "middle");
          }
        })
        .catch(err => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          console.log(err);
        });
    }
  }
};
</script>

<style lang="less" scoped>
.release_notice {
  width: 100%;
  position: absolute;
  top: 0px;
  min-height: 100%;
  height: auto;
  color: #202020;
  background-color: #efefef;
  @media screen and(max-width: 320px) {
    font-size: 14px;
  }
  .content {
    margin-top: 46px;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
    p {
      height: 25px;
      line-height: 25px;
      padding: 10px 0px;
    }
    .van-cell {
      width: 100%;
      font-size: 16px;
    }
  }
  .footer {
    width: 100%;
    margin-top: 60px;
    text-align: center;
    .van-button--default {
      background-color: #15499a;
      width: 90%;
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
</style>