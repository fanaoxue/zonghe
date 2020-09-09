import SelectImageComponent from "./SelectImage.vue";
import objectAssign from "object-assign";

const mergeOptions = function($vm, options) {
  const defaults = {};
  for (let i in $vm.$options.props) {
    if (i !== "value") {
      defaults[i] = $vm.$options.props[i].default;
    }
  }
  const _options = objectAssign({}, defaults, options);
  for (let i in _options) {
    $vm[i] = _options[i];
  }
};
let $vm;

const plugin = {
  install(vue, options = {}) {
    const SelectImageObj = vue.extend(SelectImageComponent);

    if (!$vm) {
      $vm = new SelectImageObj({
        el: document.createElement("div")
      });
      document.body.appendChild($vm.$el);
    }

    const SelectImage = function(options) {
      if (typeof options === "object") {
        mergeOptions($vm, options);
      }
      $vm.fileClick(options);
    };

    if (!vue.$klb) {
      vue.$klb = {
        SelectImage
      };
    } else {
      vue.$klb.SelectImage = SelectImage;
    }
    vue.mixin({
      created: function() {
        this.$klb = vue.$klb;
      }
    });
  }
};

export default plugin;
// export const install = plugin.install;
