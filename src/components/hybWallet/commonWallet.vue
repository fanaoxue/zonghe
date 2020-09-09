<template>
  <div class="common-wallet"></div>
</template>
<script>
import { setNativeHead, AppFinish } from "../../utils/app.js";
import Const from '../../utils/const.js';
import { getMd5 } from '../../api/apiHybWallet.js';
export default {
  name: 'commonWallet',
  data() {
    return {
      flag: '',
      his_len: window.history.length // 进入页面的时候就记
    };
  },
  beforeRouteEnter(to, from, next) {
    let json = { isShow: "0" };
    setNativeHead(json);
    next();
  },
  beforeRouteLeave(to, from, next) {
    let json = { isShow: "1" };
    setNativeHead(json);
    next();
  },
  created() {
    // console.log(window.history.length);
    // this.$store.commit('updateLoadingStatus', { isLoading: false });
  },
  mounted() {
    this.handleBack();
  },
  methods: {
    // // 清除浏览器存的值
    // clearCache() {
    //   console.log('清除数据');
    //   window.sessionStorage.removeItem('flag');
    // },
    // // 添加数据
    // addCache() {
    //   console.log('存储数据');
    //   window.sessionStorage.setItem('flag', '1');
    // },
    // // 获取浏览器存的值
    // isSessCache() {
    //   console.log('取数据');
    //   window.sessionStorage.getItem('flag');
    // },
    // 处理返回的问题
    handleBack() {
      // let _this = this;
      // let tp = null;
      // let refer = document.referrer || ''; //获取跳转渠道
      try {
        // let tp = performance.navigation.type;
        // alert(tp)
        this.dataInit();
        // 区分来源 关闭中间页
        // if('区分是点击上面返回的或者点击按钮返回的'){
        //   window.history.go(-1);
        // }else{
        //   this.dataInit();
        // }
      }catch(err){
        console.log(err)
      }
      //   tp = performance.navigation.type;
      //   // alert(tp)
      //   // 2：网页通过前进或后退按钮加载，相当于常数performance.navigation.TYPE_BACK_FORWARD。
      //   if (tp == performance.navigation.TYPE_BACK_FORWARD) {
      //     this.clearCache();
      //     window.history.go(-1);
      //     return true;
      //   }
      //   // 0：网页通过点击链接、地址栏输入、表单提交、脚本操作等方式加载，相当于常数performance.navigation.TYPE_NAVIGATENEXT。
      //   if (tp == performance.navigation.TYPE_NAVIGATE) {
      //     //微信高版本不知道何时开始返回不会走这里的流程了，现在加个判断，如果是正常跳转过来的，清除session中的缓存
      //     this.clearCache();
      //     this.dataInit();
      //   }
      //   if(tp == performance.navigation.TYPE_NAVIGATENEXT){
      //     this.clearCache();
      //     this.dataInit();
      //   }
      // } catch (error) {
      //   tp = null;
      // }
      // //处理ios少数不兼容performance api场景
      // if (this.isSessCache()) {
      //   window.history.go(-1);
      //   return true;
      // }
      // this.addCache();
      // return false;
    },
    back() {
      setTimeout(() => {
        AppFinish(-1)
      }, 1000);
    },
    dataInit() {
      getMd5({})
        .then(res => {
          this.$store.commit('updateLoadingStatus', { isLoading: false });
          // 接口返回的MD5码
          if (res.data.reCode == '0') {
            let reMD5 = res.data.result.wallMd5;
            let path = reMD5 + '&t=' + new Date().getTime() + '?hiddenNativeNav=true';
            // window.location.href = path;
            window.location.replace(path)
          } else {
            this.$vux.toast.text(res.data.reInfo, 'middle');
            this.back();
          }
        })
        .catch(err => {
          this.$store.commit('updateLoadingStatus', { isLoading: false });
          this.back();
        });
    }
  }
};
</script>