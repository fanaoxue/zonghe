<template>
  <div class="SelectImage-container">
    <input
      class="file"
      type="file"
      ref="file"
      name="imageFile"
      @change="handleFilesUpload($event)"
      accept="image/*"
    />
  </div>
</template>

<script>
// import { ImagePreview } from "vant";
import lrz from "lrz";
export default {
  name: "selectImage",
  data() {
    return {};
  },
  // props: {
  //   imgList: {
  //     type: Array,
  //     default: []
  //   }
  // },
  mounted() {
    // ImagePreview([this.imgList]);
  },
  methods: {
    fileClick(options) {
      this.options = options;
      this.$refs.file.dispatchEvent(new MouseEvent("click"));
    },
    handleFilesUpload(el) {
      let _this = this;
      let file = el.target.files[0];
      let _file = {};
      lrz(file, { quality: 0.5, fieldName: "file" })
        .then(function(rst) {
          _file.src = rst.base64;
          _file.name = file.name;
          // _this.$set(_this.imgList, _this.selectIndex, _file);
          _this.$refs.file.value = "";
          _this.options && _this.options.success && _this.options.success({file:_file,..._this.options})
        })
        .catch(function(err) {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="less" scoped>
.SelectImage-container {
  width: 100%;
  background: #fff;
  .file {
    width: 0;
    display: none;
  }
}
</style>
