<template>
  <div class="ETCRecommendedReward-container">
    <c-header isShowTitle>
      <x-header :left-options="{backText: ''}">ETC推荐奖励</x-header>
    </c-header>
    <!-- 时间线 -->
    <div v-show="showPage">
      <etcListCompent :listData="listData"></etcListCompent>
      <div class="no-data" v-show="showNoData"><img src="../../../assets/imgs/activity/etc/youkajilu_icon@2x.png" alt=""><div>暂无奖励记录~</div></div>
    </div>
  </div>
</template>

<script>
import etcListCompent from '../../common/etcListCompent/etcListCompent.vue'
import { getETCRewardList }from '../../../api/apiETC.js'
export default {
  name: "ETCRecommendedReward",
  data() {
    return {
        showPage: false,//默认页面不展示
        showNoData:false,
        listData:[]
    };
  },
  // beforeRouteEnter(to,from,next){
  //     next();
  // },
  created(){

  },
  mounted() {
    getETCRewardList().then(res => {
      if(res.data.reCode == '0'){
        if(res.data.result.list.length){
          this.showNoData = false;
          this.listData = res.data.result.list;
        }else{
          this.showNoData = true;
        }
      }else{
        this.$vux.toast.text(res.data.reInfo, "middle");
      }
      this.$store.commit("updateLoadingStatus", { isLoading: false });
      this.showPage = true;
    }).catch(err =>{
      this.$store.commit("updateLoadingStatus", { isLoading: false });
      this.$vux.toast.text(err.message,'middle');
      this.showPage = true;
    })
  },
  methods: {


  },
  components:{
    etcListCompent
  }
};
</script>

<style lang="less">
.ETCRecommendedReward-container{
    position: absolute;
    width: 100%;
    min-height: 100%;
    background: rgba(246,246,246,1);;
  .no-data{
    width: 100%;
    height: 100%;
    position: fixed;
    display: flex;
    // justify-content: center;
    align-items: center;
    flex-direction: column;
    font-size:17px;
    font-weight:500;
    color:rgba(121,121,121,1);
    img{
      margin-top: 20%;
      margin-bottom: 10px;
      width: 110px;
    }
  }
}
</style>
