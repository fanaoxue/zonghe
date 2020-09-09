<template>
  <div class="item">
    <!-- 还没上传图片 -->
    <div class="group_item" v-if="!yuzhengData.photoUrl">
      <div class="upload_box square" @click="uploadImg(yuzhengData.type)">
        <i class="iconfont icontianjiatupian"></i>
        <p class="text">{{ yuzhengData.title }}</p>
      </div>
    </div>
    <!-- 上传了图片 -->
    <div class="group_item" v-if="yuzhengData.photoUrl">
      <div class="square img_show" @click="previewImg(yuzhengData.photoUrl)">
        <img :src="yuzhengData.photoUrl" class="img" />
      </div>
      <p class="reset_upload" @click="uploadImg(yuzhengData.type)">重新上传</p>
    </div>
    <div class="example square">
      <img
        src="@/assets/imgs/recognize/daoluyunshuzheng_img.png"
        class="img"
        v-show="yuzhengData.type === '5'"
      />
      <img
        src="@/assets/imgs/recognize/congyezigezheng_img.png"
        class="img"
        v-show="yuzhengData.type === '6'"
      />
      <img src="@/assets/imgs/recognize/shilitu_img.png" class="stamp" />
    </div>
  </div>
</template>

<script>
// import { previewClientImg, throttle } from '@/assets/js/utils'
import { ImagePreview } from "vant";

export default {
  components: {},
  name: "recognize-yunzheng",
  props: {
    yuzhengData: {
      type: Object
    }
  },
  data() {
    return {};
  },
  watch: {},
  computed: {},
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
    // 上传图片
    uploadImg(type) {
      this.$emit("callBackImgJson", type);
    }
  },
  created() {},
  mounted() {}
};
</script>

<style lang="less" scoped>
.item {
  line-height: 1;
  display: flex;
  padding-bottom: 7vw;
  .group_item {
    flex: 1;
    text-align: center;
    .reset_upload {
      font-size: 15px;
      color: #15499A;
      padding-top: 8px;
    }
    .square {
      height: 27vw;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
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
    height: 27vw;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: normal;
    flex-direction: column;
    margin-left: 5.3vw;
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
    overflow: hidden;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    .img {
      width: 100%;
    }
  }
}
</style>
