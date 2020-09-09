<template>
  <van-popup v-model="show" position="bottom" class="cart_color_main" @click-overlay="chooseColor">
      <p class="popup_title">请选择车牌颜色</p>
      <div class="popup_list">
        <div class="row"
          v-for="(item, index) in cartBadgeColorData"
          :key="index"
          :class="{active: Number(activeCartColorIndex) === index}"
          @click="chooseColor(index)">
          <span class="row_color"
            :class="{
              yellow: index === 0,
              blue: index === 1,
              green: index === 2,
              yellowblue: index === 3,
              jiangreen: index === 4,
              nongblur: index === 5
            }"></span>
          <span class="name">{{ item }}</span>
        </div>
      </div>
    </van-popup>
</template>

<script>
import { Popup } from 'vant'

export default {
  components: {
    'van-popup': Popup
  },
  props: {
    activeCartColorIndex: {
      type: [String, Number]
    },
    cartBadgeColorShow: {
      type: Boolean,
      default: false
    },
    cartBadgeColorData: {
      type: Array
    }
  },
  name: '',
  data () {
    return {
      show: this.cartBadgeColorShow
    }
  },
  watch: {
    cartBadgeColorShow () {
      this.show = this.cartBadgeColorShow
    }
  },
  computed: {},
  methods: {
    // 选择颜色
    chooseColor (index) {
      this.$emit('change', index)
    }
  }
}
</script>

<style lang="less" scoped>
.cart_color_main {
  padding: 0 13px;
  width: calc(~'100% - 26px');
  .popup_title {
    font-size: 17px;
    color: #121212;
    padding: 22px 0px;
  }
  .popup_list {
    width: calc(100% + 10px);
    display: flex;
    flex-wrap: wrap;

    .row {
      list-style: none;
      background: #F5F5F5;
      border-radius: 2px;
      flex: 0 0 calc(33.33% - 10px);
      margin-right: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-bottom: 20px;
      padding-top: 10px;
      &.active {
        background: #E5E5E5;
      }
      .row_color {
        height: 22px;
        width: calc(100% - 30px);
        &.yellow {
          background: url('~@/assets/imgs/recognize/huangse_img.png') no-repeat;
          background-size: 100% 100%;
        }
        &.blue {
          background: url('~@/assets/imgs/recognize/lanse_img.png') no-repeat;
          background-size: 100% 100%;
        }
        &.green {
          background: url('~@/assets/imgs/recognize/lvse_img.png') no-repeat;
          background-size: 100% 100%;
        }
        &.yellowblue {
          background: url('~@/assets/imgs/recognize/huanglvse_img.png') no-repeat;
          background-size: 100% 100%;
        }
        &.jiangreen {
          background: url('~@/assets/imgs/recognize/jiangreen.png') no-repeat;
          background-size: 100% 100%;
        }
        &.nongblur {
          background: url('~@/assets/imgs/recognize/lvse_img_nong.png') no-repeat;
          background-size: 100% 100%;
        }
      }
      .name {
        font-size: 14px;
        padding: 4px 0;
      }
    }
  }
}
</style>
