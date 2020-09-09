<!-- LineItem -->
<template>
  <div class="LineItem">
    <div class="title_box">
      <i class="iconfont iconhuowu"></i>
      <span class="text">{{ item.goodsInfo }}</span>
    </div>
    <div class="content_box van-hairline--top-bottom" @click="seeDetail(item)">
      <div class="left">
        <i class="iconfont icondizhi"></i>
        <div class="dot">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <i class="iconfont icondizhi"></i>
      </div>
      <div class="mid">
        <div class="text">
          <span class="label">装 货 地 :</span>
          <span class="value">{{ item.loadingAddressName }}</span>
        </div>
        <div class="text">
          <span class="label">卸 货 地 :</span>
          <span class="value">{{ item.unloadingAddressName }}</span>
        </div>
      </div>
      <div class="right">
        <img
          src="@/assets/imgs/bigCompre/dan_img@2x.png"
          alt=""
          v-show="item.manyTrips === '0'"
        />
        <img
          src="@/assets/imgs/bigCompre/duo_img@2x.png"
          alt=""
          v-show="item.manyTrips === '1'"
        />
      </div>
    </div>
    <div class="footer_box">
      <van-button
        type="primary"
        color="#164a9a"
        class="btn"
        plain
        @click="buildWayBill(item)"
        >建单</van-button
      >
      <van-button
        type="primary"
        color="#164a9a"
        class="btn"
        plain
        @click="modifyLine(item)"
        >修改线路</van-button
      >
      <van-button
        type="primary"
        color="#164a9a"
        class="btn"
        plain
        :loading="btnLoading"
        @click="seeQRCode(item)"
        >查看二维码</van-button
      >
    </div>
  </div>
</template>

<script>
import { Button } from "vant";
export default {
  name: "LineItem",
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      btnLoading: false
    };
  },
  components: {
    vanButton: Button
  },
  computed: {},
  mounted() {},
  methods: {
    buildWayBill(item) {
      this.$emit("buildWayBill", item);
    },
    modifyLine(item) {
      this.$emit("modifyLine", item);
    },
    seeQRCode(item) {
      this.$emit("seeQRCode", item);
    },
    seeDetail(item) {
      this.$emit("seeDetail", item);
    }
  }
};
</script>
<style lang="less" scoped>
.LineItem {
  box-sizing: border-box;
  border-radius: 5px;
  background: #fff;
  .title_box {
    width: 94%;
    padding-left: 20px;
    height: 55px;
    line-height: 55px;
    font-size: 17px;
    font-weight: 500;
    color: #1682d0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    .iconhuowu {
      color: #1682d0;
      margin-right: 14px;
    }
  }
  .content_box {
    box-sizing: border-box;
    height: 120px;
    padding: 30px 20px;
    display: flex;
    .left {
      position: relative;
      padding-right: 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .iconfont {
        line-height: 1;
        position: relative;
        z-index: 1;
        color: #1581cf;
        &:last-child {
          color: #ffba00;
        }
      }
      .dot {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        span {
          // flex: 1;
          // width: 0px;
          // border-left: 4px dotted #5ba7dd;
          width: 5px;
          height: 5px;
          background-color: #5ba7dd;
          border-radius: 50%;
          margin: 2px 0px;
        }
      }
    }
    .mid {
      height: 100%;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-sizing: border-box;
      overflow: hidden;
      .text {
        line-height: 1;
        font-size: 16px;
        font-weight: 500;
        color: #7a7a7a;
        display: flex;
        .value {
          flex: 1;
          color: #202020;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
          max-width: 160px;
        }
      }
    }
    .right {
      position: absolute;
      right: 20px;
      img {
        width: 70px;
        height: 60px;
      }
    }
  }
  .footer_box {
    padding: 15px 13px;
    display: flex;
    justify-content: space-between;
    .btn {
      width: 100px;
      height: 34px;
      line-height: 34px;
      padding: 0;
      background: #ffffff;
      border-radius: 17px;
    }
  }
}
</style>
