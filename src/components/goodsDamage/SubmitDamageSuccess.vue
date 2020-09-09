<!-- SubmitDamageSuccess -->
<template>
  <div class="SubmitDamageSuccess">
    <c-header class="header">
      <van-nav-bar title="确认完成" left-arrow @click-left="onClickLeft" />
    </c-header>
    <div class="container">
      <div class="top">
        <img src="@/assets/imgs/goodsDamage/jiandancheng_icon@2x.png" alt="" />
        <span>确认成功!</span>
      </div>
      <div class="tips">请等待保障专员确认，确认无误后即可进行处理~</div>
      <div class="btn_box">
        <van-button
          class="btn"
          @click="submitClick()"
          type="primary"
          plain
          color="#15499A"
          size="large"
          >完成</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { NavBar, Button } from "vant";
export default {
  name: "SubmitDamageSuccess",
  data() {
    return {
      taxWaybillId: this.$route.query.taxWaybillId || "",
      isFromH5: this.$route.query.isFromH5 || "0",
    };
  },
  components: {
    vanNavBar: NavBar,
    vanButton: Button
  },
  computed: {},
  mounted() {
    this.$store.commit("updateLoadingStatus", { isLoading: false });
  },
  methods: {
    onClickLeft() {
      this.$router.back();
    },
    submitClick() {
      if (this.isFromH5 == '1') {
        this.$router.go(-2)
      } else {
        this.$router.push({
          path: "/goodsDamageDetail",
          query: {
            taxWaybillId: this.taxWaybillId,
            isFromH5: '0'
          }
        });
      }
    }
  }
};
</script>
<style lang="less">
.SubmitDamageSuccess {
  .container {
    .top {
      padding: 60px 0 31px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 17px;
      font-weight: 500;
      color: rgba(32, 32, 32, 1);
      img {
        width: 52px;
        height: 52px;
        margin-bottom: 15px;
      }
    }
    .tips {
      font-size: 15px;
      font-weight: 500;
      color: rgba(32, 32, 32, 1);
      text-align: center;
    }
    .btn_box {
      padding: 0 102px;
      margin-top: 76px;
      .btn {
        border-radius: 5px;
      }
    }
  }
}
</style>
