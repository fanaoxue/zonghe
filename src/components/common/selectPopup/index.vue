<template>
  <div>
    <div class="toolbar">
      <button type="button" class="cancel" @click="cancel">取消</button>
      <div class="title" v-show="title">{{ title }}</div>
      <button type="button" class="confirm" @click="submit">确认</button>
    </div>
    <div class="car_msg_choose" :class="BtnClassName">
      <div
        class="car_choose_btn"
        v-for="(item, index, key) in arrayList"
        :class="{ 'choose-btn-active': active === index }"
        @click="active = index"
        :key="key"
      >{{ item.type }}</div>
    </div>
    <div class="self_ipt" v-if="inputShow">
      <span>其他：</span>
      <input type="number" :placeholder="inputPlaceholder" v-model="input" @click="active = -1" />
      <span>{{ inputUnit }}</span>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'
export default {
  name: "selectPopup",
  props: {
    arrayList: Array,
    inputShow: {
      type: Boolean,
      default: false
    },
    inputPlaceholder: {
      type: String,
      default: "请输入车长"
    },
    inputUnit: {
      type: String,
      default: "米"
    },
    title: {
      type: String,
      default: ""
    },
    BtnClassName: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      active: -1,
      input: ""
    };
  },
  methods: {
    cancel() {
      this.$emit("on-cancle");
    },
    submit() {
      if (this.active === -1) {
        if (this.input === "") {
          Toast("请选择~~~", "middle");
          return false;
        } else {
          let reg = /^\d+(\.\d{1,2})?$/;
          if (!reg.test(this.input)) {
            Toast("输入的不符合规则~~~", "middle");
            return false;
          }
        }
      }
      let val;
      if (this.active >= 0) {
        val = this.arrayList[this.active].type;
      } else {
        val = this.input + this.inputUnit;
      }
      this.$emit("on-submit", val);
    }
  }
};
</script>

<style lang="less" scoped>
.toolbar {
  background: #15499a;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  justify-content: space-between;
  height: 11.733vw;
  line-height: 11.733vw;
  color: #fff;
  font-size: 4vw;
}
.cancel,
.confirm {
  padding: 0 4.267vw;
  color: #fff;
  font-size: 3.733vw;
  background-color: transparent;
  border: none;
}
.car_msg_choose {
  box-sizing: border-box;
  width: 100%;
  min-height: 56px;
  height: auto;
  display: flex;
  flex-wrap: wrap;
  background-color: #fff;
  .car_choose_btn {
    width: 30%;
    text-align: center;
    height: 2rem;
    line-height: 2rem;
    border-radius: 0.3125rem;
    color: #797979;
    background: #f6f6f6;
    margin: 0.625rem 0.3rem;
  }
  .choose-btn-active {
    background-color: #1581cf;
    color: #fff;
  }
}
.car_msg_choose_2 {
  padding: 25px 60px;
  justify-content: space-between;
  .car_choose_btn {
    width: 45%;
    height: 35px;
    line-height: 35px;
  }
}
.self_ipt {
  font-size: 16px;
  color: #797979;
  display: block;
  height: 36px;
  padding-left: 6px;
  background: #fff;
  padding-bottom: 10px;
  input {
    font-size: inherit;
    color: #797979;
    width: 65%;
    height: 32px;
    line-height: 32px;
    border: 1px solid #d9d9d9;
    margin-left: 2.4%;
    text-indent: 5px;
    outline: none;
    background: #f6f6f6;
  }
}
</style>
