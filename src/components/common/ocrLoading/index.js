/* eslint-disable */
import LoadingComponent from "./ocrLoading.vue";

const mergeOptions = function($vm, options) {
  const defaults = {};
  for (let i in $vm.$options.props) {
    if (i !== "value") {
      defaults[i] = $vm.$options.props[i].default;
    }
  }
  const _options = Object.assign({}, defaults, options);
  for (let i in _options) {
    $vm[i] = _options[i];
  }
};
let $vm;

const plugin = {
  install(vue, options = {}) {
    const Loading = vue.extend(LoadingComponent);

    if (!$vm) {
      $vm = new Loading({
        el: document.createElement("div"),
        propsData: {
          title: ""
        }
      });
      document.body.appendChild($vm.$el);
    }

    const ocrLoading = {
      show(options) {
        if (typeof options === "object") {
          mergeOptions($vm, options);
        }
        if (typeof options === "object" && (options.onShow || options.onHide)) {
          options.onShow && options.onShow();
        }
        this.$watcher && this.$watcher();
        this.$watcher = $vm.$watch("showValue", val => {
          if (!val && options && options.onHide) {
            options.onHide();
          }
        });

        $vm.showValue = true;
      },
      success() {
        $vm.state = 'success';
        setTimeout(() => {
          $vm.showValue = false;
        }, 200);
      },
      failed() {
        $vm.state = 'failed';
        setTimeout(() => {
          $vm.showValue = false;
        }, 200);
      },
      hide() {
        $vm.showValue = false;
      },
      isVisible() {
        return $vm.showValue;
      }
    };

    if (!vue.$klb) {
      vue.$klb = {
        ocrLoading
      };
    } else {
      vue.$klb.ocrLoading = ocrLoading;
    }
    vue.mixin({
      created: function() {
        this.$klb = vue.$klb;
      }
    });
  }
};

export default plugin;
export const install = plugin.install;
