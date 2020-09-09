<template>
  <div class="etcInvitantionListCompent-container">
    <div class="list-box" v-for="(item, key) in listData" :key="key">
      <div class="title-box">
        <div class="title-box-title">{{ item.title }}</div>
        <div class="title-box-right">{{ item.childList.length }}笔</div>
      </div>
      <div class="content-box">
        <ul>
          <li v-for="(_item, _key) in item.childList" :key="_key">
            <div class="item">
              <div class="item-left">
                <span class="row"
                  >司机手机号：<span class="val">{{
                    _item.mobileNo
                  }}</span></span
                >
              </div>
              <div class="item-right" @click="phoneCall(_item.mobileNo)">
                <i class="iconfont icondianhua"></i>联系司机
              </div>
            </div>
            <div class="item">
              <div class="item-left">
                <span class="row"
                  >司机姓名：<span class="val">{{ _item.realName }}</span></span
                >
              </div>
            </div>
            <div class="item">
              <div class="item-left">
                <span class="row"
                  >车牌号：<span class="val">{{
                    _item.cartBadgeNo
                  }}</span></span
                >
              </div>
            </div>
            <div class="item">
              <div class="item-left">
                <span class="row"
                  >授信额度：<span class="val">{{
                    _item.creditQuota
                  }}</span></span
                >
              </div>
            </div>
            <div class="item">
              <div class="item-left">
                <span class="row"
                  >卡类型：<span class="val">{{ _item.etcType }}</span></span
                >
              </div>
            </div>
            <!-- 0-全部
            1-待完善
            2-提交成功
            3-开卡成功
            4-开卡失败 -->
            <img
              class="state-img"
              v-if="_item.etcState === '1'"
              src="./daiwanshan@2x.png"
              alt=""
            />
            <img
              class="state-img"
              v-if="_item.etcState === '2'"
              src="./tijiao@2x.png"
              alt=""
            />
            <img
              class="state-img"
              v-if="_item.etcState === '3'"
              src="./kaikashibai@2x.png"
              alt=""
            />
            <img
              class="state-img"
              v-if="_item.etcState === '4'"
              src="./kaikachengong@2x.png"
              alt=""
            />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { AppGotoTell } from "@/utils/app.js";
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
  methods: {
    //拨打电话
    phoneCall(mobileNo) {
      AppGotoTell(mobileNo);
    }
  }
};
</script>
<style lang="less">
@listbg: rgba(246, 246, 246, 1);
.etcInvitantionListCompent-container {
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
      color: #15499a;
    }
  }
  .content-box {
    width: 100%;
    box-sizing: border-box;
    background: #fff;
    font-family: PingFang-SC-Medium;
    color: rgba(32, 32, 32, 1);
    ul {
      background: rgba(246, 246, 246, 1);
      li {
        background: #fff;
        // display: flex;
        // align-items: center;
        // justify-content: center;
        // flex-direction: column;
        padding: 10px 15px;
        margin-bottom: 10px;
        position: relative;
        &:last-child {
          margin-bottom: 0px;
        }
        .item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 15px;
          font-weight: 500;
          .item-left {
            .row {
              color: #797979;
              .val {
                color: #202020;
              }
            }
          }
          .item-right {
            color: #15499a;
            .icondianhua {
              margin-right: 5px;
            }
          }
        }
        .state-img {
          position: absolute;
          right: 20px;
          top: calc(~"50% - 32px");
          width: 68px;
        }
      }
    }
  }
}
</style>
