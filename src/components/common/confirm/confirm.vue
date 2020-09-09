<template>
  <div class="vux-confirm">
    <x-dialog
      v-model="showValue"
      :dialog-class="theme === 'android' ? 'weui-dialog weui-skin_android' : 'weui-dialog'"
      :mask-transition="maskTransition"
      :dialog-transition="theme === 'android' ? 'vux-fade' : dialogTransition"
      :hide-on-blur="hideOnBlur"
      :mask-z-index="maskZIndex"
      @on-hide="$emit('on-hide')">
      <div class="weui-dialog__hd" v-if="!!title" :class="{'with-no-content': !showContent}">
        <strong class="weui-dialog__title">{{ title }}</strong>
        <span @click="_on_Cancel" class="close_style">×</span>
      </div>
      <template v-if="showContent">
        <div class="weui-dialog__bd" v-if="!showInput">
          <slot><div v-html="content"></div></slot>
        </div>
        <div v-else class="vux-prompt">
          <input
            class="vux-prompt-msgbox"
            v-bind="getInputAttrs()"
            v-model="msg"
            :placeholder="placeholder"
            @touchend="setInputFocus"
            ref="input"/>
        </div>
      </template>
      <div class="weui-dialog__ft">
        <a v-if="showCancelButton" href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default" @click="_onCancel">{{cancelText || cancelText1}}</a>
        <a v-if="showConfirmButton" href="javascript:;" class="weui-dialog__btn" :class="`weui-dialog__btn_${confirmType}`" @click="_onConfirm">{{confirmText || confirmText1}}</a>
      </div>
    </x-dialog>
  </div>
</template>
<script>
import { XDialog } from 'vux'
export default {
  name: 'confirm',
  components: {
    XDialog
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    showInput: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    theme: {
      type: String,
      default: 'ios'
    },
    hideOnBlur: {
      type: Boolean,
      default: false
    },
    title: String,
    confirmText1:"确认",
    cancelText1:'取消',
    confirmText: String,
    cancelText: String,
    maskTransition: {
      type: String,
      default: 'vux-fade'
    },
    maskZIndex: [Number, String],
    dialogTransition: {
      type: String,
      default: 'vux-dialog'
    },
    content: String,
    closeOnConfirm: {
      type: Boolean,
      default: true
    },
    inputAttrs: Object,
    showContent: {
      type: Boolean,
      default: true
    },
    confirmType: {
      type: String,
      default: 'primary'
    },
    showCancelButton: {
      type: Boolean,
      default: true
    },
    showConfirmButton: {
      type: Boolean,
      default: true
    }
  },
  created () {
    this.showValue = this.show
    if (this.value) {
      this.showValue = this.value
    }
  },
  watch: {
    value (val) {
      this.showValue = val
    },
    showValue (val) {
      this.$emit('input', val)
      if (val) {
        if (this.showInput) {
          this.msg = ''
          setTimeout(() => {
            if (this.$refs.input) {
              this.setInputFocus()
            }
          }, 300)
        }
        this.$emit('on-show') // emit just after msg is cleared
      }
    }
  },
  data () {
    return {
      msg: '',
      showValue: false
    }
  },
  methods: {
    getInputAttrs () {
      return this.inputAttrs || {
        type: 'text'
      }
    },
    setInputValue (val) {
      this.msg = val
    },
    setInputFocus (evt) {
      if (evt) {
        evt.preventDefault()
      }
      this.$refs.input.focus()
    },
    _onConfirm () {
      if (!this.showValue) {
        return
      }
      if (this.closeOnConfirm) {
        this.showValue = false
      }
      this.$emit('on-confirm', this.msg)
    },
    _onCancel () {
      if (!this.showValue) {
        return
      }
      this.showValue = false
      this.$emit('on-cancel')
    },
    // 关闭的按钮
    _on_Cancel () {
      if (!this.showValue) {
        return
      }
      this.showValue = false
      this.$emit('on-close')
    }
  }
}
</script>
<style lang="less">
.vux-confirm{
  .close_style{
    font-size:18px;
    color:#fff;
    float:right;
  }
}
</style>
