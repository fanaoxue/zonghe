<template>
  <div class="receive-record">
    <c-header>
      <x-header :left-options="{ backText: '' }">领取记录</x-header>
    </c-header>
    <group v-show="rewardList.length != 0">
      <div class="vux-1px-b cell_flex" v-for="(item,index) in rewardList" :key="index">
        <div class="left">
          <p class="title">{{item.rewardDateNyr}}</p>
          <p class="time">{{item.rewardDateSf}}</p>
        </div>
        <div class="right">
          <p>{{item.rewardContent}}</p>
        </div>
      </div>
    </group>
    <div style="text-align: center;margin-top:50px;" v-show="rewardList.length == 0">
      <img alt src="../../assets/imgs/wbs/ydzz_konghezi@2x.png" width="125px" />
      <div class="p">暂无数据~~</div>
    </div>
  </div>
</template>
<script>
import { getReceiveRecord } from '../../api/apiHybWallet.js';
export default {
  name: 'receiveRecord',
  data() {
    return {
      rewardList: []
    };
  },
  created() {},
  mounted() {
    getReceiveRecord({})
      .then(res => {
        this.$store.commit('updateLoadingStatus', { isLoading: false });
        if (res.data.reCode == '0') {
          this.rewardList = res.data.result.rewardList;
        } else {
          this.$vux.toast.text(res.data.reInfo, 'middle');
        }
      })
      .catch(err => {
        this.$store.commit('updateLoadingStatus', { isLoading: false });
        console.log(err);
      });
  }
};
</script>
<style lang="less">
@import '~vux/src/styles/1px.less';
.receive-record {
  width: 100%;
  background-color: #efefef;
  position: absolute;
  top: 0px;
  min-height: 100%;
  height: auto;
  color: #202020;
  .cell_flex {
    display: flex;
    padding: 8px 4px;
    .left,
    .right {
      flex: 1;
      p {
        margin: 4px;
      }
      .time {
        color: #9f9f9f;
      }
    }
    .right {
      margin-top: 14px;
      color: #ff8d23;
      font-weight: bold;
      text-align: right;
    }
  }
}
</style>