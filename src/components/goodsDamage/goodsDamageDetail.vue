<template>
  <div class="goods_damage_detail">
    <c-header class="header">
      <van-nav-bar title="货损保障" left-arrow @click-left="onClickLeft" />
    </c-header>
    <!-- <c-header>
      <x-header :left-options="{ backText: '' }">货损保障</x-header>
    </c-header>-->
    <div v-show="pageShow">
      <div class="content">
        <img
          src="../../assets/imgs/goodsDamage/bg@2x.png"
          alt
          width="100%"
          style="position: absolute;width: 100%;left: 0px;top: -30px;"
        />
        <div class="header_info">
          <div class="damage_list">
            <span class="list-left grey">货损保障额度：</span>
            <span class="list_right yellow">{{lossEnsureLimit}}元</span>
          </div>
          <div class="damage_list">
            <span class="list-left grey">保障对象：</span>

            <span class="list_right" v-if="Number(driverInsFee) > 0">{{driverName}}</span>
            <span class="list_right" v-else>{{orgName}}</span>
          </div>
          <div class="damage_list">
            <span class="list-left grey">保障时间：</span>
            <span class="list_right">从起运到运输结束</span>
          </div>
          <img :src="bangzhangSrc" alt class="logo_state" />
        </div>
      </div>
      <div class="center_list">
        <div class="card_content">
          <van-tabs
            v-model="active"
            color="#15499a"
            title-active-color="#15499a"
            title-inactive-color="#6C6C6C"
            swipeable
          >
            <van-tab title="申请进度" v-if="showTab">
              <div class="tab_style">
                <div class="step_card">
                  <div class="step noval valMargin">
                    <div class="number">1</div>
                    <div class="right_info">
                      <div class="title1">司机申请货损保障</div>
                      <div class="title2"></div>
                      <div class="title3">{{dataResult.applyEnsureTime}}</div>
                    </div>
                    <div class="line"></div>
                  </div>
                  <div
                    class="step"
                    :class="{'noval':Boolean(dataResult.ensurerConfirmMaterialTime) == false,'valMargin':Boolean(dataResult.ensurerConfirmMaterialTime) == true}"
                  >
                    <div class="number">2</div>
                    <div class="right_info">
                      <div class="title1">
                        保障已受理
                        <span class="grey">已受理货损金额{{dataResult.driverLossFee}}元</span>
                      </div>
                      <div
                        class="title2 green"
                        v-show="dataResult.ensurerConfirmMaterialTime"
                      >保障材料已确认</div>
                      <div
                        class="title3"
                        v-show="dataResult.ensurerConfirmMaterialTime"
                      >{{dataResult.ensurerConfirmMaterialTime}}</div>
                    </div>
                    <div
                      class="line"
                      :class="{'longline':Boolean(dataResult.ensurerConfirmMaterialTime) == true}"
                    ></div>
                  </div>
                  <div
                    class="step"
                    :class="{'noval':Boolean(dataResult.orgConfirmLossTime) == false,'valMargin':Boolean(dataResult.orgConfirmLossTime) == true }"
                  >
                    <div
                      class="number"
                      :class="{'dashBg':Boolean(dataResult.orgConfirmLossTime) == false}"
                    >3</div>
                    <div class="right_info">
                      <div
                        class="title1"
                        :class="{'dashText':Boolean(dataResult.orgConfirmLossTime) == false }"
                      >
                        物流企业确认货损金额
                        <span
                          class="yellow"
                          v-if="dataResult.orgConfirmLossTime"
                          @click="ensureGoodsDamage"
                        >查看货损</span>
                        <span class="yellow" v-else @click="ensureGoodsDamage">确认货损</span>
                      </div>
                      <div class="title2 green" v-show="dataResult.orgConfirmLossTime">已确认</div>
                      <div
                        class="title3"
                        v-show="dataResult.orgConfirmLossTime"
                      >{{dataResult.orgConfirmLossTime}}</div>
                    </div>
                    <div
                      class="line"
                      :class="{'longline':Boolean(dataResult.orgConfirmLossTime) == true}"
                    ></div>
                  </div>
                  <div
                    class="step"
                    :class="{'noval':Boolean(dataResult.ensurerConfirmLossTime) == false,
                    'valMargin':Boolean(dataResult.ensurerConfirmLossTime) == true }"
                  >
                    <div
                      class="number"
                      :class="{'dashBg':Boolean(dataResult.ensurerConfirmLossTime) == false}"
                    >4</div>
                    <div class="right_info">
                      <div
                        class="title1"
                        :class="{'dashText':Boolean(dataResult.ensurerConfirmLossTime) == false}"
                      >保障专员处理中</div>
                      <div
                        class="title2 green"
                        v-show="dataResult.ensurerConfirmLossTime"
                      >已确认 货损保障金额{{dataResult.ensurerLossFee || dataResult.orgLossFee || dataResult.driverLossFee }}元</div>
                      <div
                        class="title3"
                        v-show="dataResult.ensurerConfirmLossTime"
                      >{{dataResult.ensurerConfirmLossTime}}</div>
                    </div>
                    <div
                      class="line"
                      :class="{'longline':Boolean(dataResult.ensurerConfirmLossTime) == true}"
                    ></div>
                  </div>
                  <div class="step">
                    <div
                      class="number"
                      :class="{'dashBg': Boolean(dataResult.ensurerConfirmClaimTime) == false}"
                    >5</div>
                    <div class="right_info">
                      <div
                        class="title1"
                        :class="{'dashText':Boolean(dataResult.ensurerConfirmClaimTime) == false}"
                      >处理完成</div>
                      <div
                        class="title2 green"
                        v-show="dataResult.ensurerConfirmPayTime"
                      >货损保障金额已支付给{{dataResult.payeeType | nameFilter}}</div>
                      <div
                        class="title3"
                        v-show="dataResult.ensurerConfirmClaimTime"
                      >{{dataResult.ensurerConfirmClaimTime}}</div>
                    </div>
                    <div class="lineHidden"></div>
                  </div>
                </div>
              </div>
            </van-tab>
            <van-tab title="货损保障">
              <div class="tab_style">
                <ul>
                  <li>
                    <div class="li_title">什么是货损保障？</div>
                    <p>发生货损后，物流企业不仅遭受经济损失，还会面临与司机之间的责任纠纷，既劳神又烦心。所以路歌为企业提供一项货损保障服务，发生货损(额度内)后，企业无需承担实际货损金额。</p>
                  </li>
                  <!-- <li>
                    <div class="li_title">2. 货损保障对企业的价值</div>
                    <p>①降低发生货损时企业因保险免赔产生的经济损失</p>
                    <p>②缓解企业因货损扣司机运费导致的双方矛盾</p>
                  </li>
                  <li>
                    <div class="li_title">3. 货损发生后的处理流程：</div>
                    <p>司机拨打路歌保障专员的电话，运单详情中点击【发起保障】，在路歌保障专员的指引下提供申请货损补偿金的资料，审核资料无误后，路歌1个工作日将费用转给企业。</p>
                  </li>-->
                </ul>
              </div>
            </van-tab>
            <van-tab title="保障须知">
              <div class="tab_style">
                <ul>
                  <li>
                    <div class="li_title">第一条 保障责任范围：</div>
                    <p>在发生以下情况导致的货物直接损失可申请货损保障补偿：</p>
                    <p>1、火灾、爆炸造成的货物损坏；</p>
                    <p>2、运输工具发生外部碰撞、倾覆造成货物损坏；</p>
                    <p>3、碰撞、挤压导致货物破损、包装破裂或容器损坏；</p>
                    <p>4、运输过程中遭受雨淋造成的货物损坏；</p>
                    <p>5、货物的正常装卸、搬运时发生的意外事故造成的货物损坏。</p>
                    <p>6、如下货物仅负责赔偿因火灾、爆炸、运输工具发生外部碰撞、倾覆造成货物的直接损失： 1）蔬菜、水果类生鲜货物；2）果木花卉类货物；3）牲畜禽鱼类、禽蛋类货物；4）裸装货物、退换货、返修货物、二手货物。</p>
                  </li>
                  <span v-show="showMore">
                    <li>
                      <div class="li_title">第二条 保障货物范围：</div>
                      <p>除如下货物以外的货物：</p>
                      <p>1、《危险货物品名表》GB12268中列明的易燃、易爆的危险品；</p>
                      <p>2、任何违禁、违法运输货物。</p>
                    </li>
                    <li>
                      <div class="li_title">第三条 货损保障赔付原则：</div>
                      <p>1、每次事故赔付金额由在路歌平台开通配置金额为上限，且不高于最终确定的实际货损金额；</p>
                      <p>2、路歌确认申请赔付的材料齐全后一个工作日内进行赔付，企业得到赔偿后不得以扣减司机运费的方式再次获得赔偿，否则路歌将有追回已赔偿款项的权利。</p>
                    </li>
                    <li>
                      <div class="li_title">第四条 货损保障生效条件及责任起讫期间：</div>
                      <p>1、保障生效条件：司机在路歌平台接单之时，保障生效。</p>
                      <p>2、保障起讫期间：以保障生效时间为起始时间，至承运车辆到达卸货地点时间为终止时间，且最长不超过企业与司机确认相应的运输协议后15天，两者以先发生为准。该时间范围内发生的保障事故，经路歌认定属于保障范围内的，路歌提供货损保障赔付。</p>
                    </li>
                    <li>
                      <div class="li_title">第五条 不予货损保障赔付情形</div>
                      <p>由于下列原因造成的损失，路歌不提供货损保障赔付：</p>
                      <p>1、自然灾害；</p>
                      <p>本协议所称自然灾害是指雷击、暴风、洪水、暴雪、冰雹、沙尘暴、冰凌、泥石流、崖崩、突发性滑坡、火山爆发、地面突然塌陷、地震、海啸及其他人力不可抗拒的破坏力强大的自然现象。</p>
                      <p>2、企业的故意行为或重大过失；</p>
                      <p>3、企业提供虚假证据，虚报损失金额，骗取路歌补偿的；</p>
                      <p>4、任何罚款、罚金及惩罚性赔偿导致的企业的损失；</p>
                      <p>5、货物设计错误、工艺不善、本质缺陷或特性、自然渗漏、自然损耗、自然磨损、自燃或由于自身原因造成腐烂、变质、伤病、死亡等自身变化（运输货物装载标准详见附件）；</p>
                      <p>6、货物包装不当，或货物包装完好而内容损坏或不符，或货物标记错制、漏制、不清；</p>
                      <p>7、非全封闭式货车，未使用防水布密封覆盖承运货物；</p>
                      <p>8、货物遭受盗窃或不明原因地失踪；</p>
                      <p>9、罐装货物因罐体自然损坏导致的货物损失；</p>
                      <p>10、违反国家、行业或物流企业的安全运输规定或操作规程；</p>
                      <p>11、行政行为或司法行为；</p>
                      <p>12、承运车辆违反道路/桥梁/隧道/立交桥/限宽门（桩）等各类道路设施的通行规定或要求造成的货物损失；</p>
                      <p>13、承运车辆超载比例【（实际载重 - 核定载重）/ 核定载重】超过50%；</p>
                      <p>14、战争、敌对行动、军事行为、武装冲突、罢工、骚乱、暴动、恐怖活动；</p>
                      <p>15、核辐射、核爆炸、核污染及其他放射性污染；</p>
                      <p>16、大气污染、土地污染、水污染及其他各种污染；</p>
                      <p>17、公共供电、供水、供气及其他的公共能源中断；</p>
                      <p>18、未经企业与路歌平台确认，司机私自与收货人达成赔付协议的；</p>

                      <p>由于下列原因或情形造成的任何费用及损失，路歌不提供货损保障赔付：</p>
                      <p>1、企业未能提供真实、准确的起运时间、送达时间、现场照片、运输清单、货损证明等相关信息，或提供的信息与实际运输不符；实际运输货物的车辆与运单中约定的车辆信息不符</p>
                      <p>2、任何间接损失；</p>
                      <p>3、企业与司机使用同样的IP地址或相同的设备登录平台并进行交易；</p>
                      <p>4、司机未配合平台进行运输途中的位置定位；</p>
                      <p>5、任何形式的仓储期间的损失，但运输过程中的临时仓储除外；</p>
                      <p>6、司机没有具备合格的驾驶证、行驶证及营运证/许可证；</p>
                      <p>7、不可抗力原因（包括但不限于天气恶劣、政府管制、地震等意外灾害等）造成的运输延误损失；</p>
                      <p>8、企业填写的货物名称不能反映实际货物内容，或填写的货物名称、规格不规范的（即货物名称过于模糊或包含标点符号、数字及其他与货物名称无关的文字等）；</p>
                      <p>9、实际开始运输前，发生的货物损失</p>
                      <p>10、运输或装卸工具不适合运输或装卸货物。</p>
                    </li>
                    <li>
                      <div class="li_title">第六条 货损补偿材料提交时效</div>
                      <p>申请货损补偿时效要求：当企业或司机在可预知或已知道可能产生损失时，应当及时告知路歌工作人员（货损保障专员联系电话：徐成-17318532265），因司机未及时向货损保障专员申请运费补偿导致无法核定损失或损失扩大的，路歌不提供货损保障，且申请货损保障时长不得超过事故发生后24小时。</p>
                    </li>
                  </span>
                  <div class="checkall" @click="showMore = true" v-show="!showMore">
                    查看全部
                    <span class="down">↓</span>
                  </div>
                  <div class="checkall" @click="showMore = false" v-show="showMore">
                    收起
                    <span class="up">↑</span>
                  </div>
                </ul>
              </div>
            </van-tab>
          </van-tabs>
        </div>
      </div>
    </div>

    <div class="height" style="height:50px;"></div>
    <div class="footer" v-show="lossEnsureState != 4">
      <van-button @click="dialPhone">联系保障专员</van-button>
    </div>
  </div>
</template>

<script>
import { NavBar, Button, Tab, Tabs, Toast } from "vant";
import { AppFinish, AppGotoTell } from "../../utils/app.js";
import { waybillDetail } from "../../api/api.js";
import {
  getGoodsDamageDetail,
  getApolloParams,
} from "../../api/goodsDamage.js";
export default {
  components: {
    vanNavBar: NavBar,
    vanButton: Button,
    vanTab: Tab,
    vanTabs: Tabs,
  },
  data() {
    return {
      active: 1,
      pageShow: false, // 页面展示状态
      showMore: false, // 默认看不到更多
      showTab: false, // 默认不展示进度条栏位
      taxWaybillId: this.$route.query.taxWaybillId,
      lossEnsureLimit: "", // 保障额度
      orgName: "", // 企业名称
      driverName: "",
      driverInsFee: "",
      lossEnsureNodeState: "", // 节点时间
      dataResult: {},
      bangzhangSrc: "",
      lossEnsureState: "", //货损保障状态
      baozhangzhong: require("../../assets/imgs/goodsDamage/baozhangzhong_img@2x.png"),
      yishouli: require("../../assets/imgs/goodsDamage/yishouli_img@2x.png"),
      yiwancheng: require("../../assets/imgs/goodsDamage/yiwancheng_img@2x.png"),
      yijieshu: require("../../assets/imgs/goodsDamage/yijieshu_img@2x.png"),
      isFromH5: this.$route.query.isFromH5,
      orgCfg714: "",
    };
  },
  mounted() {
    this.$_waybillDetail().then(() => {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      getGoodsDamageDetail({ taxWaybillId: this.taxWaybillId })
        .then((res) => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
          if (res.data.reCode === "0") {
            this.dataResult = res.data.result;
            this.lossEnsureState = this.dataResult.lossEnsureState; // 货损保障状态
            this.lossEnsureNodeState = this.dataResult.lossEnsureNodeState;
            if (this.lossEnsureState === "2" || this.lossEnsureState === "3") {
              this.showTab = true;
            }
            setTimeout(() => {
              this.active = 0;
              this.pageShow = true;
            }, 20);
            console.log(this.lossEnsureState);
            switch (this.lossEnsureState) {
              case "1":
                this.bangzhangSrc = this.baozhangzhong;
                break;
              case "2":
                this.bangzhangSrc = this.yishouli;
                break;
              case "3":
                this.bangzhangSrc = this.yiwancheng;
                break;
              case "4":
                this.bangzhangSrc = this.yijieshu;
                break;
              default:
                this.bangzhangSrc = "";
                break;
            }
          } else {
            this.$vux.toast.text(res.data.reInfo, "middle");
          }
        })
        .catch((err) => {
          this.$store.commit("updateLoadingStatus", { isLoading: false });
        });
    });
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === "SubmitDamageSuccess") {
      AppFinish(-1);
    }
    next();
  },
  filters: {
    nameFilter(val) {
      return val == "1" ? "物流企业" : "司机";
    },
  },
  methods: {
    onClickLeft() {
      this.$router.back();
    },
    _getApolloParams(val) {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      return new Promise((resolve, reject) => {
        getApolloParams({ key: val })
          .then((res) => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode === "0") {
              resolve(res.data.result.value);
            } else {
              this.$vux.toast.text(res.data.reInfo, "middle");
              reject();
            }
          })
          .catch((err) => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            this.$vux.toast.text(error.message, "middle");
            reject();
          });
      });
    },
    async dialPhone() {
      try {
        let name = await this._getApolloParams("goods.damage.name");
        let mobile = await this._getApolloParams("goods.damage.mobileNo");
        this.$vux1.confirm.show({
          title: "拨打电话",
          content:
            `<p style='text-align:left'>确认拨打：</p><p style='color:#FFBA00;text-align:left'>` +
            name +
            ` , ` +
            mobile +
            `</p>`,
          confirmText: "确认",
          cancelText: "取消",
          onConfirm: () => {
            AppGotoTell(mobile);
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    // 获取运单详情
    $_waybillDetail() {
      this.$store.commit("updateLoadingStatus", { isLoading: true });
      return new Promise((resolve, reject) => {
        waybillDetail({ taxWaybillId: this.taxWaybillId })
          .then((res) => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            if (res.data.reCode === "0") {
              let result = res.data.result;
              this.lossEnsureLimit = result.lossEnsureLimit;
              this.orgName = result.orgName;
              this.driverName = result.driverName;
              this.driverInsFee = result.driverInsFee;
              resolve();
            } else {
              this.$vux.toast.text(error.message, "middle");
              reject();
            }
          })
          .catch((err) => {
            this.$store.commit("updateLoadingStatus", { isLoading: false });
            reject();
          });
      });
    },
    // 确认货损
    ensureGoodsDamage() {
      this.$router.push({
        path: "/SubmitDamage",
        query: {
          taxWaybillId: this.taxWaybillId,
          isFromH5: "1", // 从H5跳转到下一页的标识
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.goods_damage_detail {
  width: 100%;
  background-color: #efefef;
  position: absolute;
  top: 0px;
  min-height: 100%;
  height: auto;
  box-sizing: border-box;
  .content {
    // position: fixed;
    // width: 100vw;
    // top: 46px;
    // left: 0px;
    height: auto;
    text-align: center;
    .header_info {
      width: 95%;
      background-color: #ffffff;
      border-radius: 5px;
      padding: 10px;
      box-sizing: border-box;
      margin: 15px auto 10px;
      position: relative;
      .damage_list {
        text-align: left;
        min-height: 28px;
        height: auto;
        .list_right {
          margin-left: -6px;
        }
        .grey {
          color: #797979;
        }
        .yellow {
          color: #ffba00;
        }
      }
      .logo_state {
        position: absolute;
        right: 5px;
        top: 8px;
        width: 58px;
      }
    }
  }
  .center_list {
    // margin-top: 125px;
    min-height: 200px;
    padding: 10px;
    // left: 0px;
    // position: fixed;
    width: 100vw;
    box-sizing: border-box;
    .card_content {
      border-radius: 5px;
      width: 100%;
      background-color: #ffffff;
      margin: 0px auto;
      overflow: hidden;
      /deep/.van-tab {
        font-size: 15px;
      }
      /deep/.van-tab--active {
        font-size: 17px;
      }
      /deep/.van-tabs__content {
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        height: calc(~"100vh - 250px");
      }
      /deep/.van-hairline--top-bottom::after {
        border-width: 2px 0;
      }
      .tab_style {
        padding: 10px;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        // 步进器样式
        .step_card {
          min-height: 400px;
          width: 100%;
          display: flex;
          flex-direction: column;
          .noval {
            height: 40px !important;
          }
          .valMargin {
            margin-bottom: 22px !important;
          }
          .step {
            height: 70px;
            margin: 5px;
            position: relative;
            .number {
              padding: 2px;
              margin-top: 5px;
              border-radius: 50%;
              width: 15px;
              height: 15px;
              line-height: 15px;
              color: #ffffff;
              text-align: center;
              background-color: #15499a;
            }
            .dashBg {
              background-color: #bcbcbc;
            }
            .dashText {
              color: #9f9f9f;
            }
            .right_info {
              color: #313233;
              position: absolute;
              left: 45px;
              top: 0px;
              .title3 {
                font-size: 13px;
                font-weight: 400;
              }
              .yellow {
                background-color: #ffba00;
                color: #ffffff;
                border-radius: 15px;
                padding: 4px 6px 2px;
                font-size: 14px;
              }
              .grey {
                color: #9f9f9f;
                font-size: 13px;
              }
              .green {
                color: #28b072;
                font-size: 14px;
              }
            }
            .line {
              color: #313233;
              position: absolute;
              left: 9px;
              top: 25px;
              width: 1px;
              height: 60px;
              border-left: 1px dashed #ccc;
            }
            .lineHidden {
              position: absolute;
              left: 9px;
              top: 25px;
              width: 3px;
              height: 60px;
              background-color: #ffffff;
            }
            .longline {
              height: 75px !important;
            }
          }
        }
        li {
          font-weight: bold;
          font-size: 16px;
          .li_title {
            margin: 10px 0px;
          }
          p {
            font-size: 14px;
            font-weight: normal;
          }
        }
        .checkall {
          text-align: center;
          color: #15499a;
          font-size: 15px;
          font-weight: normal;
        }
      }
    }
  }
  .footer {
    position: fixed;
    left: 0px;
    bottom: 0px;
    width: 100%;
    /deep/.van-button {
      height: 50px;
      width: 100%;
      color: #ffff;
      font-size: 16px;
      background-color: #15499a;
      color: #ffffff;
      border: none;
      border-radius: 0px;
    }
  }
}
</style>