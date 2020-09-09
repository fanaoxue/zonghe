<template>
  <div class="delivery_goods_success">
    <c-header isShowTitle>
      <van-nav-bar title="发货成功" left-arrow fixed @click-left="onClickLeft"></van-nav-bar>
    </c-header>
    <div class="sub_page_base">
      <div class="content">
        <div>
          <img class="image" src="@/assets/imgs/transOrganize/jiandancheng_icon@2x.png" alt />
        </div>
        <div>发货成功！</div>
      </div>
      <div class="footer">
        <div class="button_box">
          <van-button
            plain
            type="primary"
            size="large"
            @click="setTemplete"
            :disabled="templeteDisabled"
          >设为常用模板</van-button>
        </div>
        <div class="button_box">
          <van-button plain type="primary" size="large" @click="deliveryGoodsAgain">再发一单</van-button>
        </div>
        <div class="button_box">
          <van-button plain type="primary" size="large" @click="seeWaybill">查看记录</van-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { NavBar, Button } from "vant";
import { AppFinish, AppHowtoBack, finishCallBack } from "@/utils/app.js";
import { addDeliveryGoodsTemplete } from "@/api/transOrganize";
export default {
  name:'delivery_goods_success',
  data() {
    return {
      templeteDisabled: false
    };
  },
  components: {
    vanNavBar: NavBar,
    vanButton: Button
  },
  computed: {
    deliveryGoodsFirst() {
      return this.$store.state.deliveryGoods.deliveryGoodsFirst;
    },
    deliveryGoodsSecond() {
      return this.$store.state.deliveryGoods.deliveryGoodsSecond;
    }
  },
  beforeRouteEnter(to, from, next) {
    if (from.name === 'deliveryGoodsRecord') {
      next(vm=>{
        vm.howtoback()
      })
    } else {
      next()
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'delivery_goods_second') {
      this.howtoback()
    }
    next()
  },
  mounted() {
    // AppHowtoBack("1");
    // window.localStorage.removeItem("sendGoodsInfo");
    this.$store.commit("updateLoadingStatus", { isLoading: false });
  },
  methods: {
    // 导航左侧点击
    onClickLeft() {
      // AppFinish(-3);
      this.howtoback()
    },
    //how to back
    howtoback(){
      if (this.templeteDisabled) {
        finishCallBack({ methodName: 'javascript:AppJSApi_finishCallBack()' })
      } else {
        AppFinish(-3)
      }
    },
    // 设置模板
    setTemplete() {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      let data = Object.assign(
        {},
        this.deliveryGoodsFirst,
        this.deliveryGoodsSecond
      );
      data.transportTemplateId = "";
      addDeliveryGoodsTemplete(data).then(res => {
        this.$store.commit("updateLoadingStatus", { isLoading: false });
        if (res.data.reCode == 0) {
          this.$vux.toast.text("设置成功！", "middle");
          this.templeteDisabled = true;
        } else {
          this.$vux.toast.text(res.data.reInfo, "middle");
        }
      });
    },
    // 再建一单
    deliveryGoodsAgain() {
      this.$router.go(-2);
    },
    // 查看运单
    seeWaybill() {
      this.$router.push({ path: "/deliveryGoodsRecord", query: { active: 0 } });
    },
    // 清除store数据
    clearStore() {
      // 暂时不需要
    }
  }
};
</script>
<style lang="less" scoped>
.delivery_goods_success {
  /deep/.van-button--primary {
    background-color: #fff;
    border: 1px solid #15499a;
    color: #15499a;
    border-radius: 5px;
  }
  /deep/.van-button--disabled {
    opacity: 1;
    border: 1px solid #999;
    color: #999;
  }
  .sub_page_base {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: #fff;
    padding-top: 45px;
    box-sizing: border-box;
    .content {
      margin: 0 auto;
      font-size: 17px;
      margin-bottom: 66px;
      margin-top: 60px;
      .image {
        width: 80px;
      }
      div {
        position: relative;
        span {
          position: absolute;
          bottom: 16px;
          right: 2px;
          background: #28b072;
          color: #fff;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          text-align: center;
          height: 28px;
          line-height: 28px;
        }
      }
    }
    .footer {
      margin: 0 auto;
      .button_box {
        width: 175px;
        height: 45px;
        margin-bottom: 13px;
      }
    }
  }
}
</style>
