<template>
  <div class="list-compent-container">
    <div class="list-box" v-for="(item,key) in listData" :key="key">
      <div class="title-box">
        <div class="title-box-title">{{item.createdTime|formatDate}}</div>
        <div class="title-box-right">
          <!-- <img src="./tuijianjiangli_icon@2x.png" alt=""> -->
          {{item.total}}笔，共计{{item.rewardAmountSum}}元
        </div>
      </div>
      <div class="content-box">
        <ul>
          <li  v-for="(_item,_key) in item.dataList" :key="_key" :class="(_key+1)<item.dataList.length?'vux-1px-b':''">
            <div class="content-box-left">
              <!-- <div class="content-box-left-top">{{_item.cartBadgeNo}}</div> -->

              <div class="content-box-left-bottom">
                <img class="icon" src="../listCompent/jiagnli_icon@2x.png" alt />
                <span>{{_item.mobileNo}}，{{_item.driverName}}</span>
              </div>
            </div>
            <div class="content-box-right">+{{_item.rewardAmount}}元</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { dateFormat } from 'vux'
export default {
  name: "listCompent",
  data() {
    return {};
  },
  props: {
    listData: Array
  },
  mounted() {
    // console.log(this.listData)
  },
  filters: {
    formatDate(time) {
      return time.substr(5)||''
    }
  },
  methods: {}
};
</script>
<style lang="less">
@listbg :rgba(246,246,246,1);
.list-compent-container {
  .list-box {
    width: 100%;
  }
  .title-box {
    width: 100%;
    box-sizing: border-box;
    padding: 0 15px;
    height: 50px;
    background: rgba(246, 246, 246, 1);
    display: flex;
    justify-content: space-between;
    font-family: PingFang-SC-Bold;
    line-height: 50px;
    .title-box-title {
      font-size: 17px;
      font-weight: bold;
      color: rgba(18, 18, 18, 1);
    }
    .title-box-right {
      font-size: 1rem;
      font-weight: 500;
      // color:rgba(21,73,154,1);
      color: rgba(102, 102, 102, 1);
      display: flex;
      align-items: center;
      img {
        height: 16px;
        margin-right: 2px;
      }
    }
  }
  .content-box {
    width: 100%;
    box-sizing: border-box;
    background: #fff;
    font-family: PingFang-SC-Medium;
    color: rgba(32, 32, 32, 1);
    ul {
      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 15px;
        .content-box-left {
          .content-box-left-bottom {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 15px;
            font-family: PingFang-SC-Medium;
            font-weight: 500;
            color: rgba(32, 32, 32, 1);
            .icon {
              width: 20px;
              height: 20px;
              margin-right: 10px;
            }
          }
        }
        .content-box-right {
          font-size: 18px;
          font-family: PingFang-SC-Bold;
          font-weight: bold;
          color: rgba(255, 186, 0, 1);
        }
      }
    }
  }
}
</style>
