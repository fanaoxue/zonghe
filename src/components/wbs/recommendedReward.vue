<template>
  <div class="recommended-reward">
    <c-header>
      <x-header :left-options="{backText: ''}">回款宝推荐奖励</x-header>
    </c-header>
    <!-- 时间线 -->
    <div v-show="showPage">
      <listCompent :listData="listData"></listCompent>
      <div class="no-data" v-show="showNoData"><img src="../../assets/imgs/wbs/ydzz_konghezi@2x.png" alt=""><div>当前还没有数据</div></div>
    </div>
  </div>
</template>

<script>
import listCompent from '../common/listCompent/listCompent.vue'
import { getRecommendedReward }from '../../api/api.js'
export default {
  name: "recommendedReward",
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
    getRecommendedReward().then(res => {
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
    listCompent
  }
};
</script>

<style lang="less">
.recommended-reward {
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
    img{
      margin-top: 20%;
      margin-bottom: 10px;
    }
  }
}
</style>
