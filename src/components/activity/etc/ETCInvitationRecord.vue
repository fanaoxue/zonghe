<template>
  <div class="ETCInvitationRecord-container">
    <c-header isShowTitle class="header">
      <van-nav-bar title="ETC邀请记录" left-arrow @click-left="onClickLeft">
        <div slot="right" class="header-right">
          <van-dropdown-menu>
            <van-dropdown-item
              @change="changeItem"
              v-model="crruntEtcState"
              :options="option"
            />
          </van-dropdown-menu>
        </div>
      </van-nav-bar>
    </c-header>
    <!-- 时间线 -->
    <div v-show="showPage">
      <etcInvitantionListCompent
        :listData="FinallylistData"
      ></etcInvitantionListCompent>
      <div class="no-data" v-show="showNoData">
        <img
          src="../../../assets/imgs/activity/etc/youkajilu_icon@2x.png"
          alt=""
        />
        <div>暂无邀请记录~</div>
      </div>
    </div>
  </div>
</template>

<script>
import etcInvitantionListCompent from "../../common/etcInvitantionListCompent/index.vue";
import { getETCInvitationRecordList } from "../../../api/apiETC.js";
import { DropdownMenu, DropdownItem, NavBar } from "vant";
export default {
  name: "ETCInvitationRecord",
  data() {
    return {
      showPage: false, //默认页面不展示
      listData: [],
      FinallylistData: [],
      popupShow: false,
      crruntEtcState: "0",
      // 0-全部
      // 1-待完善
      // 2-提交成功
      // 3-开卡失败
      // 4-开卡成功
      option: [
        { text: "全部", value: "0" },
        { text: "待完善", value: "1" },
        { text: "提交成功", value: "2" },
        { text: "开卡失败", value: "3" },
        { text: "开卡成功", value: "4" }
      ]
    };
  },
  components: {
    etcInvitantionListCompent,
    vanDropdownMenu: DropdownMenu,
    vanDropdownItem: DropdownItem,
    vanNavBar: NavBar
  },
  computed: {
    showNoData() {
      return this.FinallylistData.length === 0;
    }
  },
  created() {},
  mounted() {
    this._getETCInvitationRecordList();
  },
  methods: {
    _getETCInvitationRecordList() {
      getETCInvitationRecordList()
        .then(res => {
          if (res.data.reCode == "0") {
            if (res.data.result.list.length) {
              this.listData = res.data.result.list;
              this.FinallylistData = this.listData;
            } else {
            }
          } else {
            this.$vux.toast.text(res.data.reInfo, "middle");
          }
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          this.showPage = true;
        })
        .catch(err => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          this.$vux.toast.text(err.message, "middle");
          this.showPage = true;
        });
    },
    changeItem() {
      if (this.crruntEtcState === "0") {
        this._getETCInvitationRecordList();
      } else {
        this.FinallylistData = [];
        this.listData.forEach(element => {
          let newChildList = element.childList.filter(item => {
            if (item.etcState === this.crruntEtcState) {
              return item;
            }
          });
          if (newChildList.length > 0) {
            let obj = {
              title: element.title,
              childEtcOpenNum: element.childEtcOpenNum,
              childRewardAmount: element.childRewardAmount,
              childList: newChildList
            };
            this.FinallylistData.push(obj);
          }
        });
      }
    },
    onClickLeft() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="less">
.ETCInvitationRecord-container {
  width: 100%;
  min-height: 100%;
  background: rgba(246, 246, 246, 1);
  padding-top: 50px;
  padding-bottom: 50px;
  min-height: calc(~"100vh - 100px");
  .header {
    position: fixed;
    z-index: 999;
    width: 100%;
    top: 0;
    left: 0;
    .header-right {
      color: #fff;
      margin-right: 5px;
    }
    .van-dropdown-menu {
      background: none;
      height: 46px;
      line-height: 100%;
    }
    .van-hairline--top-bottom::after {
      border: none;
    }
    .van-cell:not(:last-child)::after {
      left: 0;
    }
    .van-cell__value {
      display: none;
    }
  }
  .no-data {
    width: 100%;
    height: 100%;
    position: fixed;
    display: flex;
    // justify-content: center;
    align-items: center;
    flex-direction: column;
    font-size: 17px;
    font-weight: 500;
    color: rgba(121, 121, 121, 1);
    img {
      margin-top: 20%;
      margin-bottom: 10px;
      width: 110px;
    }
  }
}
</style>
