<template>
  <div class="recognize_upload_box">
    <div class="item" v-if="cardInfo.state === '-1'">
      <div class="square upload_box" @click="upload(cardInfo.type)">
        <i class="iconfont icontianjiatupian"></i>
        <p class="text">{{ cardInfo.title }}</p>
      </div>
      <div class="square example">
        <img
          src="@/assets/imgs/recognize/shenfenzheng_img.png"
          v-if="cardInfo.type === '1'"
          class="img"
        />
        <img
          src="@/assets/imgs/recognize/shenfenzhengfan_img.png"
          v-if="cardInfo.type === '4'"
          class="img"
        />
        <img
          src="@/assets/imgs/recognize/jiashizheng_img.png"
          v-if="cardInfo.type === '2'"
          class="img"
        />
        <img
          src="@/assets/imgs/recognize/xingshizheng_img.png"
          v-if="cardInfo.type === '3'"
          class="img"
        />
        <img src="@/assets/imgs/recognize/shilitu_img.png" class="stamp" />
      </div>
    </div>

    <div class="item" v-else-if="cardInfo.state === '0'">
      <div class="square img_show" @click="previewImg(cardInfo.photoUrl)">
        <img :src="cardInfo.photoUrl" class="img" />
      </div>
      <div class="square sucess">
        <div class="sucess_title">
          <i class="iconfont iconshibiezhengque"></i>
          <span class="text">识别成功！</span>
        </div>
        <p class="sucess_text">{{ cardInfo.msg }}</p>
        <div class="sucess_btn" v-if="recState !== '3'">
          <p class="recognize_btn" @click="upload(cardInfo.type)">重新上传</p>
        </div>
      </div>
    </div>

    <div class="item diff first" v-else-if="cardInfo.state === '2'">
      <div class="diff_title">
        <i class="iconfont iconshibiecuowu"></i>
        <span class="text">对比不一致！</span>
      </div>
      <p class="diff_text">{{ cardInfo.msg }}</p>
      <p class="diff_btn_box">
        <span class="diff_btn" @click="upload(cardInfo.type)">重新上传</span>
        <span
          v-if="
            cardInfo.type === '1' ||
              cardInfo.type === '2' ||
              cardInfo.type === '3'
          "
          class="diff_btn"
          @click="updateWaybill(cardInfo.type)"
        >
          {{ cardInfo.type === "3" ? "修改车牌" : "修改司机姓名" }}
        </span>
      </p>
    </div>

    <div class="item" v-else-if="cardInfo.state === '-2'">
      <div class="square img_show" @click="previewImg(cardInfo.photoUrl)">
        <img :src="cardInfo.photoUrl" class="img" />
      </div>
      <div class="square recognize">
        <div class="recognize_title">
          <i class="iconfont iconweishibie"></i>
          <span
            class="text"
            v-if="cardInfo.type === '1' || cardInfo.type === '4'"
            >身份证未识别！</span
          >
          <span class="text" v-if="cardInfo.type === '2'">驾驶证未识别！</span>
          <span class="text" v-if="cardInfo.type === '3'">行驶证未识别！</span>
        </div>
        <div class="recognize_btn_group">
          <p
            class="recognize_btn"
            @click="
              goRecognize({
                photoType: cardInfo.type,
                photoUrl: cardInfo.photoUrl
              })
            "
          >
            去识别
          </p>
          <p class="recognize_btn" @click="upload(cardInfo.type)">重新上传</p>
        </div>
      </div>
    </div>

    <div class="item" v-else-if ="cardInfo.state === '1'">
      <div class="square img_show" @click="upload(cardInfo.type)">
        <!-- <img v-lazy="cardInfo.photoUrl" :key="cardInfo.photoUrl" class="img" /> -->
        <img :src="cardInfo.photoUrl" class="img" />
        <div class="master">
          <i class="iconfont iconjiazai"></i>
          <p class="text">重新上传</p>
        </div>
      </div>
      <div class="square error">
        <div class="error_title">
          <i class="iconfont iconshibiecuowu"></i>
          <span class="text">识别失败！</span>
        </div>
        <p class="error_text">{{ cardInfo.msg }}</p>
      </div>
    </div>
  </div>
</template>

<script>
// import { previewClientImg, throttle } from '@/assets/js/utils'
import { ImagePreview } from "vant";
export default {
  name: "recognize_upload",
  props: {
    cardInfo: {
      type: Object
    },
    recState: {
      type: String
    }
  },
  data() {
    return {};
  },
  methods: {
    // 预览图片
    previewImg(url) {
      // throttle(() => {
      //   previewClientImg(url, 0);
      // }, 200);
      ImagePreview({
        images: [url],
        startPosition: 0,
        closeOnPopstate: true,
        onClose() {
          // do something
        }
      });
    },
    // 去识别
    goRecognize(data) {
      this.$emit("callBackGoRecognize", data);
    },
    // 上传
    upload(type) {
      this.$emit("callBackUploadImg", type);
    },
    // 修改
    updateWaybill(type) {
      this.$emit("callUpdateWaybill", type);
    },
  }
};
</script>

<style lang="less" scoped>
// @import url('@/assets/less/mixin');
.recognize_upload_box {
  line-height: 1;
  &:last-child {
    padding-bottom: 7vw;
  }
  .item {
    margin-top: 7vw;
    display: flex;
    .square {
      height: 27vw;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      & + .square {
        margin-left: 5.3vw;
      }
    }
    .upload_box {
      border: 1px dashed #bfbfbf;
      .iconfont {
        font-size: 40px;
        color: #bfbfbf;
      }
      .text {
        margin-top: 10px;
        color: #202020;
        font-size: 16px;
      }
    }
    .example {
      position: relative;
      border: 1px dashed #bfbfbf;
      .img {
        width: 38vw;
      }
      .stamp {
        width: 60px;
        position: absolute;
        top: -1px;
        right: -1px;
      }
    }
    .img_show {
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      position: relative;
      flex-direction: row;
      .img {
        width: 100%;
      }
      .master {
        width: 100%;
        height: 100%;
        color: #ffffff;
        background-color: rgba(0, 0, 0, 0.5);
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        .iconfont {
          font-size: 21px;
        }
        .text {
          margin-top: 3px;
          font-size: 16px;
          text-decoration: underline;
        }
      }
    }
    .sucess {
      color: #57b36d;
      align-items: flex-start;
      .sucess_btn {
        width: 100%;
        display: flex;
        margin-top: 4px;
        .recognize_btn {
          width: 65px;
          height: 33px;
          font-size: 14px;
          display: flex;
          justify-content: center;
          align-items: center;
          line-height: normal;
          border-radius: 5px;
          color: #57b36d;
          border: 1px solid #57b36d;
        }
      }
      .sucess_title {
        display: flex;
        align-items: center;
        .iconfont {
          line-height: 16px;
        }
        .text {
          margin-left: 5px;
          font-size: 16px;
        }
      }
      .sucess_text {
        margin-top: 5px;
        font-size: 15px;
        line-height: 1.3;
      }
    }
    .error {
      color: #b4001b;
      align-items: flex-start;
      .error_title {
        display: flex;
        align-items: center;
        .iconfont {
          line-height: 16px;
        }
        .text {
          margin-left: 5px;
          font-size: 16px;
        }
      }
      .error_text {
        margin-top: 5px;
        font-size: 15px;
        line-height: 1.3;
      }
    }
    .recognize {
      color: #b4001b;
      align-items: flex-start;
      .recognize_title {
        display: flex;
        align-items: center;
        color: #1581cf;
        .iconfont {
          font-size: 16px;
          line-height: 16px;
        }
        .text {
          margin-left: 5px;
          font-size: 16px;
          line-height: 16px;
        }
      }
      .recognize_btn_group {
        margin-top: 14px;
        display: flex;
        .recognize_btn {
          width: 65px;
          height: 33px;
          font-size: 14px;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1px solid #1581cf;
          color: #1581cf;;
          border-radius: 5px;
          &:first-child {
            margin-right: 13px;
          }
        }
      }
    }
  }
  .diff {
    padding-top: 25px;
    color: #b4001b;
    flex-direction: column;
    text-align: center;
    position: relative;
    &:before {
      content: " ";
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      height: 1px;
      border-top: 1px solid #efefef;
      color: #efefef;
      transform-origin: 0 0;
      transform: scaleY(0.5);
    }
    .diff_title {
      font-size: 16px;
      margin-bottom: 10px;
    }
    .diff_text {
      font-size: 15px;
      line-height: 20px;
    }
    .diff_btn_box {
      display: flex;
      justify-content: center;
    }
    .diff_btn {
      width: 104px;
      height: 42px;
      // margin: 10px auto 0;
      margin: 10px 10px 0;
      font-size: 16px;
      border: 1px solid #1581cf;
      color: #1581cf;
      box-sizing: border-box;
      border-radius: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &.first {
      padding-top: 0;
      &::before {
        border: none;
      }
    }
  }
}
</style>
