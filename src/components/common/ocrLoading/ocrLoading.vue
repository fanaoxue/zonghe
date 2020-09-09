<!-- Loading -->
<template>
  <div class="klb_ocr_loading">
    <van-popup
      :close-on-click-overlay="closeOnClickCOverlay"
      :close-on-popstate="closeOnPopstate"
      v-model="showValue"
      :style="{ top: '45%', left: '50%', width: '90%' }"
      class="klb_popup"
    >
      <div class="loading_container">
        <div class="icon_box">
          <img
            v-if="state === 'loading'"
            class="load"
            src="./load_load@2x.png"
            alt=""
            srcset=""
          />
          <img
            v-if="state === 'failed'"
            class="fail"
            src="./load_fail@2x.png"
            alt=""
          />
          <img
            v-if="state === 'success'"
            class="success"
            src="./load_success@2x.png"
            alt=""
            srcset=""
          />
          <img v-if="state === 'loading'" class="loading_icon" src="./loading_icon@2x.png" alt="" />
        </div>
        <div class="text_box">
          <div>{{ title }}<span class="dotting"></span></div>
          <!-- <div>正在与公安备案信息比对中,正在与系统信息比对中</div> -->
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
/* eslint-disable */
import { Popup } from "vant";
export default {
  name: "OcrLoading",
  components: {
    vanPopup: Popup
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    closeOnClickCOverlay: {
      type: Boolean,
      default: false
    },
    closeOnPopstate: {
      type: Boolean,
      default: true
    },
    state: {
      validator: function(value) {
        // 这个值必须匹配下列字符串中的一个
        return ["loading", "failed", "success"].indexOf(value) !== -1;
      },
      default: "loading"
    },
    title: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  },
  created() {
    if (this.value) {
      this.showValue = this.value;
    }
  },
  watch: {
    value(val) {
      this.showValue = val;
    },
    showValue(val) {
      if (val) {
        this.$emit("on-show");
      }
    }
  },
  data() {
    return {
      showValue: false
    };
  },
  methods: {
    _onCancel() {
      if (!this.showValue) {
        return;
      }
      this.showValue = false;
      this.$emit("on-cancel");
    }
  }
};
</script>
<style lang="less" scoped>
/deep/ .van-popup {
  background: none;
}
.loading_container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .icon_box {
    width: 150px;
    height: 150px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img {
      width: 100%;
      height: 100%;
      position: absolute;
    }
    @keyframes turn {
      0% {
        -webkit-transform: rotate(0deg);
      }
      25% {
        -webkit-transform: rotate(90deg);
      }
      50% {
        -webkit-transform: rotate(180deg);
      }
      75% {
        -webkit-transform: rotate(270deg);
      }
      100% {
        -webkit-transform: rotate(360deg);
      }
    }
    .loading_icon {
      width: 140px;
      height: 140px;
      animation: turn 1s linear infinite;
    }
  }
  .text_box {
    margin-top: 10px;
    color: #36f9fc;
    text-align: center;
    .dotting {
      display: inline-block;
      min-width: 2px;
      min-height: 2px;
      box-shadow: 2px 0 currentColor, 6px 0 currentColor, 10px 0 currentColor; /* for IE9+, ..., 3个点 */
      animation: dot 2s infinite step-start both; /* for IE10+, ... */
    }
    .dotting {
      margin-right: 8px;
    } /* for IE9+,FF,CH,OP,SF 占据空间*/

    @keyframes dot {
      25% {
        box-shadow: none;
      } /* 0个点 */
      50% {
        box-shadow: 2px 0 currentColor;
      } /* 1个点 */
      75% {
        box-shadow: 2px 0 currentColor, 6px 0 currentColor; /* 2个点 */
      }
    }
  }
}
</style>
