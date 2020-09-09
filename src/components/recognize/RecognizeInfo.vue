<!-- RecognizeInfo -->
<template>
  <div class="RecognizeInfo">
    <c-header :isShowTitle="true">
      <van-nav-bar
        title="证件识别"
        left-arrow
        @click-left="onClickLeft"
        fixed
      ></van-nav-bar>
    </c-header>
    <div class="sub_page_base">
      <van-cell-group>
        <van-field
          v-model.trim="mobileNo"
          type="tel"
          placeholder="手机号（必填）"
        >
          <template #left-icon>
            <i class="iconfont icondianhua1"></i>
          </template>
        </van-field>
        <van-field
          v-model="cartBadgeNo"
          placeholder="车牌号（必填）"
          readonly
          @click="carNumIpt"
        >
          <template #left-icon>
            <i class="iconfont iconchepaihao"></i>
          </template>
        </van-field>
        <van-field v-model.trim="driverName" placeholder="司机姓名（必填）">
          <template #left-icon>
            <i class="iconfont iconsijixingming"></i>
          </template>
        </van-field>
      </van-cell-group>
      <div class="btn_box">
        <van-button class="btn" size="normal" color="#15499a" @click="submit"
          >开始认证</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { setNativeHead, AppFinish } from "@/utils/app.js";
import { Field, Button, NavBar, CellGroup, Toast } from "vant";
export default {
  name: "RecognizeInfo",
  data() {
    return {
      mobileNo: "",
      cartBadgeNo: "",
      driverName: ""
    };
  },
  components: {
    vanField: Field,
    vanButton: Button,
    vanNavBar: NavBar,
    vanCellGroup: CellGroup
  },
  computed: {},
  // beforeRouteEnter(to, from, next) {
  //   let json = { isShow: "0" };
  //   setNativeHead(json);
  //   next()
  // },
  activated() {
    this.$store.commit("updateLoadingStatus", { isLoading: false });
  },
  methods: {
    // 返回
    onClickLeft() {
      AppFinish(-1);
    },
    carNumIpt() {
      let _this = this;
      this.$carIpt({
        dpCartNum: this.cartBadgeNo,
        fn: function(res) {
          _this.cartBadgeNo = res;
        }
      });
    },
    // 校验
    validate() {
      if (this.mobileNo === "") {
        Toast("手机号必填!");
        return false;
      }
      //司机手机号验证
      let re = /^1\d{10}$/;
      if (!re.test(this.mobileNo)) {
        Toast("司机手机号码输入错误!");
        return false;
      }
      // 车牌号
      if (this.cartBadgeNo === "") {
        Toast("车牌号必填!");
        return false;
      }
      // 车牌号
      if (this.driverName === "") {
        Toast("司机姓名必填!");
        return false;
      }
      //司机姓名64位规则验证
      if (this.driverName.length > 64) {
        Toast("司机姓名长度最大不可超过64位!");
        return false;
      }
      return true;
    },
    submit() {
      if (!this.validate()) {
        return;
      }
      this.$router.push({
        path: "/Recognize",
        query: {
          mobileNo: this.mobileNo,
          cartBadgeNo: this.cartBadgeNo,
          driverName: this.driverName,
          from: "1"
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.RecognizeInfo {
  .iconfont {
    color: #323233;
  }
  .sub_page_base {
    min-height: 100vh;
    box-sizing: border-box;
    padding-top: 45px;
    /deep/ .van-cell-group {
      padding: 20px;
      .van-field {
        background: #efefef;
        border-radius: 10px;
        margin-bottom: 10px;
      }
    }
    .btn_box {
      padding: 0 20px;
      .btn {
        width: 100%;
        border-radius: 10px;
      }
    }
  }
}
</style>
