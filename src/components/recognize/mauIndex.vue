<template>
  <div class="mau-index-cxt">
    <c-header :isShowTitle="true">
      <van-nav-bar
        title="证件识别"
        left-arrow
        @click-left="onClickLeft"
        fixed
      ></van-nav-bar>
    </c-header>
    <div class="sub_page_base">
      <img
        class="banner-img-style"
        src="../../assets/imgs/wbs/zhengjianshibie_bg.png"
        alt=""
      />
      <div style="height:17px"></div>
      <div class="mau-indtro-cxt">
        <h3 class="mau-indtro-title">识别说明</h3>
        <div
          class="mau-indtro-list"
          v-for="(item, index, key) in indtroduceMsg"
          :key="key"
        >
          <div class="list-item-title">{{ index + 1 }}</div>
          <div class="list-item-msg">{{ item.msg }}</div>
        </div>
      </div>
      <x-button
        type="primary"
        style="width:90%;height:48px;margin-top:30px;background-color:#15499A"
        @click.native="suerBtnClick()"
        >开始识别</x-button
      >
      <div style="height:16px;"></div>
    </div>
  </div>
</template>

<script>
import { startRecgnize } from '@/utils/app.js';
import { UPLOAD_APP_FUN } from '@/utils/version.js';
import { NavBar } from "vant";
import { setNativeHead, AppFinish } from "@/utils/app.js";
export default {
  name: "mauIndex",
  data() {
    return {
      indtroduceMsg: [
        {
          msg: "证件识别是核实运输车辆及司机的真实性，以避免运输风险。"
        },
        {
          msg:
            "您上传的身份证件我们将与国家公安部备案数据进行比对，以保证信息的准确。"
        },
        {
          msg:
            "您上传的所有图片，我们只做识别认证试使用，绝不另做他用，请放心识别。"
        }
      ]
    };
  },
  components: {
    vanNavBar: NavBar
  },
  beforeRouteEnter(to, from, next) {
    let json = { isShow: "0" };
    setNativeHead(json);
    if (!UPLOAD_APP_FUN) {
      // 没app上传就调用老的认证
      next();
    } else {
      if (to.query.recState === "1") {
        next();
      } else {
        next({ path: "/Recognize", replace: true, query: to.query });
      }
    }
  },
  created() {
    this.$store.commit("updateLoadingStatus", { isLoading: false });
  },
  methods: {
    // 返回
    onClickLeft() {
      AppFinish(-1);
    },
    suerBtnClick() {
      try {
        MtaH5.clickStat("mau_start_btn");
      } catch (error) {
        JSON.stringify(error);
      }
      if (!UPLOAD_APP_FUN) {
        // 没app上传就调用老的认证
        startRecgnize();
      } else {
        this.$router.replace({
          path: "/Recognize",
          query: {
            taxWaybillId: this.$route.query.taxWaybillId || "",
            from: this.$route.query.from || "",
            driverName: this.$route.query.driverName || "",
            mobileNo: this.$route.query.mobileNo || "",
            cartBadgeNo: this.$route.query.cartBadgeNo || "",
            recState: this.$route.query.recState || "",
            updateWaybillUrl: this.$route.query.updateWaybillUrl || ""
          }
        });
      }

      //   if (this.$sysType === 0) {
      //     this.$vux1.confirm.show({
      //       title: "提示",
      //       content: "此操作只可在快路宝app操作，快去应用商店下载吧~~~",
      //       confirmText: "确认",
      //       cancelText: "取消"
      //     });
      //   } else {
      //     try {
      //       MtaH5.clickStat("mau_start_btn");
      //     } catch (error) {
      //       JSON.stringify(error);
      //     }
      //     startRecgnize();
      //   }
    }
  }
};
</script>

<style lang="less">
.mau-index-cxt {
  .sub_page_base {
    min-height: 100vh;
    box-sizing: border-box;
    padding-top: 45px;
  }
  text-align: center;
  background-color: #efefef;
  position: absolute;
  top: 0px;
  min-height: 100%;
  height: auto;
  .banner-img-style {
    width: 100%;
  }
  .mau-indtro-cxt {
    width: 90%;
    min-height: 46px;
    display: inline-block;
    padding: 10px;
    text-align: start;
    border-radius: 5px;
    background: #fff;
    .mau-indtro-title {
      color: #202020;
      font-size: 17px;
    }
    .mau-indtro-list {
      display: flex;
      align-items: baseline;
      margin-top: 10px;
      .list-item-title {
        border-radius: 50%;
        background-color: #ffba00;
        color: #ffff;
        font-size: 12px;
        padding: 0px 6px;
      }
      .list-item-msg {
        color: #454545;
        font-size: 14px;
        padding-left: 6px;
      }
    }
  }
}
</style>
