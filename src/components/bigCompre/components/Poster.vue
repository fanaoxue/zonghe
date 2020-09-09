<!-- Poster -->
<template>
  <div class="Poster">
    <van-tabs v-model="active" color="#164A9A" title-active-color="#164A9A">
      <van-tab title="装货地二维码"></van-tab>
      <van-tab title="卸货地二维码"></van-tab>
    </van-tabs>
    <div class="continer">
      <div class="box" ref="imageTofile_0" v-show="active === 0">
        <div class="title_box">
          <div class="title"><span class="line"></span>装货地建单码</div>
        </div>
        <div class="content_box">
          <div class="text">打开好运宝APP扫一扫</div>
          <div class="car">
            <img
              class="car_img"
              src="@/assets/imgs/bigCompre/kache_img@2x.png"
              alt=""
            />
            <qrcode
              class="qr_img"
              :value="QRCodeImg_0"
              type="img"
              :size="105"
            ></qrcode>
          </div>
          <div class="goods">【{{ goodsName }}】</div>
          <div class="detail">
            <div class="left">
              <img
                class="zhuang"
                src="@/assets/imgs/bigCompre/zhuang@2x.png"
                alt=""
              />
              <div class="dot">
                <span></span>
              </div>
              <img
                class="xie"
                src="@/assets/imgs/bigCompre/xie@2x.png"
                alt=""
              />
            </div>
            <div class="right">
              <div class="value">{{ loadingAddressName }}</div>
              <div class="value">{{ unloadingAddressName }}</div>
            </div>
          </div>
        </div>
        <div class="footer_Box">
          <span>{{ orgName }}</span>
          <span class="line"></span>
          <img
            class="log56"
            src="@/assets/imgs/bigCompre/log56@2x.png"
            alt=""
          />
          <span class="line"></span>
          <img class="hyb" src="@/assets/imgs/bigCompre/hyb@2x.png" alt="" />
        </div>
      </div>
      <div class="box" ref="imageTofile_1" v-show="active === 1">
        <div class="title_box">
          <div class="title"><span class="line"></span>卸货地建单码</div>
        </div>
        <div class="content_box">
          <div class="text">打开好运宝APP扫一扫</div>
          <div class="qrcode">
            <qrcode
              class="qr_img"
              :value="QRCodeImg_1"
              type="img"
              :size="105"
            ></qrcode>
          </div>
          <div class="goods">【{{ goodsName }}】</div>
          <div class="detail">
            <div class="left">
              <img
                class="zhuang"
                src="@/assets/imgs/bigCompre/zhuang@2x.png"
                alt=""
              />
              <div class="dot">
                <span></span>
              </div>
              <img
                class="xie"
                src="@/assets/imgs/bigCompre/xie@2x.png"
                alt=""
              />
            </div>
            <div class="right">
              <div class="value">{{ loadingAddressName }}</div>
              <div class="value">{{ unloadingAddressName }}</div>
            </div>
          </div>
        </div>
        <div class="footer_Box">
          <span>{{ orgName }}</span>
          <span class="line"></span>
          <img
            class="log56"
            src="@/assets/imgs/bigCompre/log56@2x.png"
            alt=""
          />
          <span class="line"></span>
          <img class="hyb" src="@/assets/imgs/bigCompre/hyb@2x.png" alt="" />
        </div>
      </div>
    </div>
    <div class="footer">
      <van-button
        @click="save"
        class="btn"
        type="primary"
        size="large"
        color="#164a9a"
        >保存二维码</van-button
      >
    </div>
  </div>
</template>

<script>
import { Qrcode } from "vux";
import { Tabs, Tab, Button } from "vant";
import html2canvas from "html2canvas";
import { downloadByteImg } from "@/utils/app";
export default {
  name: "Poster",
  props: {
    transportLineId: {
      type: String,
      required: true
    },
    goodsName: {
      type: String,
      required: true
    },
    loadingAddressName: {
      type: String,
      required: true
    },
    unloadingAddressName: {
      type: String,
      required: true
    },
    orgName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      active: 0
    };
  },
  components: {
    vanTabs: Tabs,
    vanTab: Tab,
    vanButton: Button,
    Qrcode
  },
  computed: {
    QRCodeImg_0() {
      return `{ fid: "1", transportLineId: ${this.transportLineId} }`;
    },
    QRCodeImg_1() {
      return `{ fid: "2", transportLineId: ${this.transportLineId} }`;
    }
  },
  mounted() {},
  methods: {
    save() {
      this.$_html2canvas().then(res => {
        let json = {
          img_type: "0",
          img_url: res
        };
        downloadByteImg(json);
      });
    },
    $_html2canvas() {
      return new Promise((resolve, reject) => {
        // window.pageYOffset = 0;
        // document.documentElement.scrollTop = 0;
        // document.body.scrollTop = 0;

        html2canvas(this.$refs["imageTofile_" + this.active], {
          useCORS: true,
          backgroundColor: null,
          // scale: 4,
          scale: 2,
          scrollY: 0,
          scrollX: 0,
          dpi: window.devicePixelRatio
        })
          .then(canvas => {
            resolve(canvas.toDataURL());
          })
          .catch(() => {
            reject();
          });
      });
    }
  }
};
</script>
<style lang="less" scoped>
.Poster {
  height: 550px;
  width: 325px;
  background: #fff;
  margin-top: 40px;
  .continer {
    margin-top: 5px;
  }
  .box {
    margin: 0 auto;
    height: 421px;
    width: 298px;
    background: url("~@/assets/imgs/bigCompre/jiandanma_img@2x.png") no-repeat
      center center;
    background-size: cover;
    .title_box {
      padding: 14px 8px;
      .title {
        width: 102px;
        height: 21px;
        background: url("~@/assets/imgs/bigCompre/zhuagnhuomabg_img@2x.png")
          no-repeat center center;
        background-size: cover;
        font-size: 14px;
        font-weight: 500;
        color: #464646;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .line {
          display: inline-block;
          width: 2px;
          height: 12px;
          background: #464646;
          margin: 0 3px;
        }
      }
    }
    .content_box {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      .text {
        font-size: 18px;
        font-weight: 500;
        color: #ffffff;
        margin-bottom: 13px;
      }
      .qrcode {
        width: 164px;
        height: 164px;
        // background: #fff;
        // border-radius: 50%;
        // box-shadow: 0px 0px 5px #000;
        background: url("~@/assets/imgs/bigCompre/round@2x.png") no-repeat
          center center;
        background-size: cover;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 110px;
        }
      }
      .car {
        position: relative;
        height: 164px;
        .qr_img {
          box-sizing: content-box;
          position: relative;
          top: 12px;
          width: 105px;
          background: #fff;
          padding: 5px;
          display: flex;
        }
        .car_img {
          width: 161px;
          height: 97px;
          position: absolute;
          bottom: 0;
        }
      }
      .goods {
        font-size: 18px;
        font-weight: bold;
        color: #131313;
        line-height: 1;
        margin-top: 5px;
        margin-bottom: 20px;
      }
      .detail {
        display: flex;
        line-height: 1;
        font-size: 16px;
        color: #131313;
        font-weight: bold;
        height: 60px;
        max-width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
        .left {
          position: relative;
          padding-right: 10px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          img {
            position: relative;
            z-index: 1;
            width: 22px;
          }
          .zhuang {
            top: -2px;
          }
          .xie {
            bottom: -2px;
          }
          .dot {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            height: 100%;
            width: 100%;
            span {
              flex: 1;
              width: 0px;
              border-left: 1px solid #121212;
            }
          }
        }
        .right {
          height: 100%;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
          .value {
            color: #202020;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
    .footer_Box {
      margin-top: 20px;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      font-size: 10px;
      font-weight: 500;
      color: #464646;
      line-height: 1;
      .log56 {
        width: 30px;
        height: 15px;
      }
      .hyb {
        width: 30px;
        height: 10px;
      }
      .line {
        width: 1px;
        height: 8px;
        color: #464646;
        margin: 0 3px;
      }
    }
  }
  .footer {
    padding: 13px 26px;
    .btn {
      border-radius: 5px;
    }
  }
}
</style>
