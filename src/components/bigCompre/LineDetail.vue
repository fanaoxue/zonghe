<!-- LineDetail -->
<template>
  <div class="LineDetail">
    <c-header isShowTitle class="header">
      <van-nav-bar
        title="查看线路"
        left-arrow
        fixed
        :z-index="100"
        @click-left="onClickLeft"
      ></van-nav-bar>
    </c-header>
    <div class="sub_page_base">
      <div class="item">
        <div class="title" @click="showCollapse('0')">
          <span class="text">货物信息</span>
          <van-icon name="arrow-up" color="#164a9a" v-show="collapse_0_show" />
          <van-icon
            name="arrow-down"
            color="#164a9a"
            v-show="!collapse_0_show"
          />
        </div>
        <div class="content" :class="{animate: collapse_0_show}">
          <ul>
            <li class="van-hairline--bottom">
              <span class="label">货物名称：</span
              ><span class="value">{{ result.goodsName }}</span>
            </li>
            <li class="van-hairline--bottom" v-if="Number(result.curTransportUnitPrice) > 0">
              <span class="label">运输单价：</span
              ><span class="value">{{ result.curTransportUnitPrice }}元/{{ result.transportUnitPriceType | formatUnitType }}
                <span v-if="result.unitPriceVisible == '1'">,司机不可见</span>
                <span v-else>,司机可见</span>
              </span>
            </li>
            <li v-if="Number(result.lossUnitPrice) > 0">
              <span class="label">货损单价：</span
              ><span class="value">{{ result.lossUnitPrice }}元/{{ result.transportUnitPriceType | formatUnitType }}</span>
            </li>
          </ul>
          <ul>
            <li class="van-hairline--bottom">
              <span class="label">货物单位：</span
              ><span class="value">{{
                result.transportUnitPriceType | formatUnitType
              }}</span>
            </li>
            <li class="van-hairline--bottom">
              <span class="label">一天多趟：</span
              ><span class="value">{{ result.manyTrips | formatYesOrNo}}</span>
            </li>
            <li class="van-hairline--bottom">
              <span class="label">磅单区分上传：</span
              ><span class="value">{{ result.poundDiffUpload | formatYesOrNo }}</span>
            </li>
            <li v-if="allowLossWeight">
              <span class="label">货损范围：</span
              ><span class="value">{{ allowLossWeight }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="item">
        <div class="title" @click="showCollapse('1')">
          <span class="text">线路信息</span>
          <van-icon name="arrow-up" color="#164a9a" v-show="collapse_1_show" />
          <van-icon
            name="arrow-down"
            color="#164a9a"
            v-show="!collapse_1_show"
          />
        </div>
        <div class="content" :class="{animate: collapse_1_show}">
          <ul>
            <li class="van-hairline--bottom">
              <span class="label">装货地城市：</span
              ><span class="value">{{
                result.loadingProvinceName + result.loadingCityName + result.loadingCountyName
              }}</span>
            </li>
            <li class="van-hairline--bottom">
              <span class="label">装货地名称：</span
              ><span class="value">{{ result.loadingAddressName }}</span>
            </li>
            <li v-if="result.loadingDetailAddress">
              <span class="label">详细地址：</span
              ><span class="value">{{ result.loadingDetailAddress }}</span>
            </li>
          </ul>
          <ul>
            <li class="van-hairline--bottom">
              <span class="label">卸货地城市：</span
              ><span class="value">{{
                result.unloadingProvinceName + result.unloadingCityName + result.unloadingCountyName
              }}</span>
            </li>
            <li class="van-hairline--bottom">
              <span class="label">卸货地名称：</span
              ><span class="value">{{ result.unloadingAddressName }}</span>
            </li>
            <li v-if="result.unloadingDetailAddress">
              <span class="label">详细地址：</span
              ><span class="value">{{ result.unloadingDetailAddress }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="item">
        <div class="title" @click="showCollapse('2')">
          <span class="text">其他信息</span>
          <van-icon name="arrow-up" color="#164a9a" v-show="collapse_2_show" />
          <van-icon
            name="arrow-down"
            color="#164a9a"
            v-show="!collapse_2_show"
          />
        </div>
        <div class="content" :class="{animate: collapse_2_show}">
          <ul>
            <li class="van-hairline--bottom">
              <span class="label">联系人姓名：</span
              ><span class="value">{{ result.contactName }}</span>
            </li>
            <li class="van-hairline--bottom">
              <span class="label">联系电话：</span
              ><span class="value">{{ result.contactMobileNo }}</span>
            </li>
            <li class="van-hairline--bottom">
              <span class="label">受票方：</span
              ><span class="value">{{ result.drawee }}</span>
            </li>
            <li class="van-hairline--bottom">
              <span class="label">自动计算运费：</span
              ><span class="value">{{ result.autoFreightState | formatYesOrNo({1:'开启',0:'关闭'}) }}</span>
            </li>
            <li>
              <span class="label">运费抹零：</span>
              <span class="value">
                <span v-if="result.roundDownState === '1'">开启,
                  <span v-if="result.roundDownType === '1'">
                    个位抹零
                  </span>
                  <span v-else>小数抹零</span>
                </span>
                <span v-else>关闭</span>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { NavBar, Icon, Toast } from "vant";
import { getLineDetail } from "@/api/bigCompre";
import { AppFinish } from "@/utils/app";
export default {
  name: "LineDetail",
  data() {
    return {
      transportLineId: this.$route.query.transportLineId || "",
      collapse_0_show: true,
      collapse_1_show: true,
      collapse_2_show: true,
      result: {}
    };
  },
  components: {
    vanNavBar: NavBar,
    vanIcon: Icon
  },
  computed: {
    allowLossWeight() {
      if (this.result.transportUnitPriceType === '0') {
        if(this.result.allowLossType === '1'){
          return (this.result.allowLossPercent * 100).toFixed(2) + '%'
        }else{
          return this.result.allowLossWeight + '吨'
        }
      }else{
        return ''
      }
    }
  },
  mounted() {
    this.$store.commit("updateLoadingStatus", { isLoading: false });
    this.$_getLineDetail();
  },
  methods: {
    onClickLeft() {
      AppFinish(-1);
    },
    showCollapse(id) {
      this[`collapse_${id}_show`] = !this[`collapse_${id}_show`];
    },
    // 查询大宗运输线路详情
    $_getLineDetail() {
      return new Promise((resolve, reject) => {
        const loading = Toast.loading({
          message: "加载中"
        });
        getLineDetail({ transportLineId: this.transportLineId })
          .then(res => {
            loading.clear();
            if (res.data.reCode == "0") {
              this.result = res.data.result;
              resolve();
            } else {
              Toast(res.data.reInfo);
              reject();
            }
          })
          .catch(err => {
            loading.clear();
            Toast(err.message);
            reject();
          });
      });
    }
  }
};
</script>
<style lang="less" scoped>
.LineDetail {
  background: #efefef;
  box-sizing: border-box;
  .sub_page_base {
    min-height: 100vh;
    box-sizing: border-box;
    padding: 55px 10px 30px;
    .item {
      margin-top: 10px;
      width: 100%;
      .title {
        background: #fff;
        height: 55px;
        border-radius: 5px;
        padding: 0 25px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .text {
          flex: 1;
        }
      }
      .content {
        overflow: hidden;
        max-height: 0;
        transition: max-height 0.5s;
        &.animate {
          max-height: 9999px;
          transition: max-height 1s;
        }
        ul {
          margin-bottom: 10px;
          background: #fff;
          border-radius: 5px;
          padding: 0 25px;
          li {
            // line-height: 50px;
            padding: 12px 0px;
            font-weight: 500;
            font-size: 16px;
            color: #464646;
            display: flex;
            .label{
              min-width: 66px;
              flex-shrink: 0;
            }
            .value {
              color: #202020;
            }
          }
        }
      }
    }
  }
}
</style>
