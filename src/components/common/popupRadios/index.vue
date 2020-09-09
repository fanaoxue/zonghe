<template>
  <cell @click.native="show" :title="title" :value="currentValue" :is-link="true" :value-align="valueAlign" :border-intent="borderIntent">
    <span class="vux-cell-placeholder" v-if="!displayValue && placeholder">{{ placeholder }}</span>
    <span class="vux-cell-value" v-if="displayValue">{{ displayValue }}</span>
    <span slot="icon">
      <slot name="icon"></slot>
    </span>
    <div v-transfer-dom>
      <popup v-model="showPopup" style="background-color:#fff;" @on-hide="$emit('on-hide')" @on-show="$emit('on-show')" :hide-on-blur="false" :should-rerender-on-show="true">
        <div class="pop_header">
          <slot name="popup-header" :options="options" :value="currentValue" class="pop_title"></slot>
          <span @click="_close" class="pop_close">×</span>
        </div>
        <radio :options="options" v-model="currentValue" :fill-mode="false" @on-change="onValueChange">
          <template slot="each-item" slot-scope="props">
            <slot name="each-item" :icon="props.icon" :label="props.label" :index="props.index">
              <p>
                <img class="vux-radio-icon" :src="props.icon" v-show="props.icon" />
                <span class="vux-radio-label">{{ props.label }}</span>
              </p>
            </slot>
          </template>
        </radio>
      </popup>
    </div>
  </cell>
</template>

<script>
import { Cell } from 'vux';
import { Popup } from 'vux';
import { Radio } from 'vux';
import radioProps from './radioProps';
import cellProps from './cellProps';
import TransferDom from './transferDom';
import find from 'array-find';
import Vue from 'vue';

const _cellProps = cellProps();
delete _cellProps.value;

export default {
  name: 'popup-radios',
  components: {
    Popup,
    Radio,
    Cell
  },
  directives: {
    TransferDom
  },
  props: {
    placeholder: String,
    readonly: Boolean,
    ..._cellProps,
    ...radioProps()
  },
  computed: {
    displayValue() {
      if (!this.options.length) {
        return '';
      }
      if (typeof this.options[0] === 'object') {
        const match = find(this.options, option => {
          return option.key === this.currentValue;
        });
        if (match) {
          return match.value;
        }
      }
      return this.currentValue;
    }
  },
  methods: {
    onValueChange(val) {
      this.hide();
    },
    show() {
      if (!this.readonly) {
        this.showPopup = true;
      }
    },
    hide() {
      this.showPopup = false;
    },
    _close(){
      this.hide();
    }
  },
  watch: {
    value(val) {
      this.currentValue = val;
    },
    currentValue(val) {
      this.$emit('input', val);
      this.$emit('on-change', val);
    }
  },
  data() {
    return {
      showPopup: false,
      currentValue: this.value
    };
  }
};
</script>

<style lang='less' scoped>
.vux-popup-radio-popup {
  background-color: #fff;
}
.vux-popup-dialog {
  left: 50% !important;
  bottom: 50% !important;
  transform: translate(-50%, 50%) !important;
  width: 80% !important;
  border-radius: 8px;
}
.pop_header{
  background: #15499A;
  color:#FFFFFF;
  text-align: center;
  height: 45px;
  line-height: 45px;
  position: relative;
}
.pop_title{
  display: inline-block;
}
.pop_close{
  font-size: 24px;
  position: absolute;
  top:0px;
  right:10px;
}
</style>
