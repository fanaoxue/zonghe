<template>
  <div class="hyb-wallet-activities">
    <c-header>
      <x-header :left-options="{ backText: '', preventGoBack: true, showBack: true }" @on-click-back="goBack()">好运宝钱包付款活动</x-header>
    </c-header>
    <div class="activity_header">
      <div class="activity_header_bg">
        <img src="../../assets/imgs/hybWalletActivities/hdtoutu_img@2x.png" alt="" width="100%" />
        <!-- <div class="activity_time">
          <span>限时活动时间: </span>
          <span class="dateRange">{{ activtiyDate }}</span>
        </div> -->
        <div class="activity_wodejiangbgli_img">
          <div class="item1"></div>
          <div class="item2">
            <div>
              <p>我的奖励：{{ rewardAmount }}元</p>
              <p>申请支付时选择好运宝钱包,</p>
              <p>运费到账后得<span>10元</span>奖励！</p>
            </div>
          </div>
          <div class="item3">
            <img src="../../assets/imgs/hybWalletActivities/tixiananniu_img@2x.png" alt="" width="100%" />
            <div class="qutixian" @click="gotoWallet">
              <p>去提现</p>
              <p>>></p>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="activity_rule"><a href="#section">规则</a></div> -->
      <div class="activity_rule" @click="gotoBottom">规则</div>
    </div>
    <div class="activity_content" v-show="isLeo != '0'">
      <div class="content_header">
        <img src="../../assets/imgs/hybWalletActivities/biaoti_img@2x.png" alt="" width="50%" />
      </div>
      <div class="content_paragraph">
        <p>申请支付时选择好运包钱包，运费到账后记<span style="color:#D45016;font-weight:bold;margin: 0 3px;">1</span>单。</p>
        <p>积累一定有效运单数后，即可获得相应的礼品奖励！</p>
      </div>
      <div class="dash"></div>
      <div class="yundanbg">
        <div class="item1">
          <img src="../../assets/imgs/hybWalletActivities/jiangli_img@2x.png" width="60%" alt="" />
        </div>
        <div class="item2">
          <p>
            <span>有效运单数：</span>
            <span class="white_bg">
              <span>{{ effWaybillNum }}</span
              >单
            </span>
          </p>
          <p>
            <img src="../../assets/imgs/activity/etc/jilu_icon@2x.png" width="16px" alt=""/>
            <span class="gold" @click="viewRecord">查看领取记录</span>
          </p>
        </div>
        <div class="lianzi1">
          <img src="../../assets/imgs/hybWalletActivities/lianzi_img@2x.png" width="40%" alt="" />
        </div>
        <div class="lianzi2">
          <img src="../../assets/imgs/hybWalletActivities/lianzi_img@2x.png" width="40%" alt="" />
        </div>
      </div>
      <div class="card_bg">
        <div class="card" v-for="(item, index) in itemList" :key="index">
          <div class="p1">
            <img src="../../assets/imgs/hybWalletActivities/jiagnlibiaoshi_img@2x.png" alt="" width="5%" />
            <span>{{ item.name }}</span>
            <img src="../../assets/imgs/hybWalletActivities/jiagnlibiaoshi_img@2x.png" alt="" width="5%" />
          </div>
          <span @click="checkLiping(index)">
            <div class="p2">
              <img :src="libaoList[index]" alt="" height="56px" />
            </div>
            <div class="p3">
              <span>查看礼品>></span>
            </div>
          </span>
          <div class="p4">
            <!-- <span :class="[item.state == 0 ? 'blue' : 'gray']" @click="receive(index)">领取</span> -->
            <input type="button" :class="[item.state == 0 ? 'blue' : 'gray']" :disabled="item.state != 0" @click="receive(index)" value="领取" />
          </div>
        </div>
      </div>
    </div>
    <div class="activity_footer" id="section">
      <div class="footer_title">
        <img src="../../assets/imgs/hybWalletActivities/hdguize_img@2x.png" alt="" width="50%" />
      </div>
      <table>
        <tr v-for="(item, index) in rules" :key="index" v-show="isLeo != '0'">
          <td><span class="circle">{{index+1}}</span></td>
          <td>{{item}}</td>
        </tr>
        <tr v-for="(item1, index1) in LeoRules" :key="'select'+index1" v-show="isLeo == '0'">
          <td><span class="circle">{{index1+1}}</span></td>
          <td>{{item1}}</td>
        </tr>
      </table>
    </div>

    <!-- 弹框一 -->
    <van-dialog
      class-name="dialog1"
      v-model="show1"
      :title="title"
      @confirm="understand"
      :show-cancel-button="false"
      confirm-button-text="知道啦"
      transition="fade"
    >
      <div>
        <p>有效运单数达到{{ wayBillNumber }}单后，可领取礼品：</p>
        <div class="lipingquan">
          <div v-for="(item1, index1) in rewardList" :key="index1" :class="rewardList.length == '1'?'card_center':''">
            <img src="../../assets/imgs/hybWalletActivities/lipinquan_img@2x.png" alt=""/>
            <div class="num">{{ item1.no }}</div>
            <p class="substance">{{ item1.name | formater1 }}</p>
            <p class="substance1">{{ item1.name | formater2 }}</p>
          </div>
        </div>
        <!-- <p>以上礼品只可选择其中一个，点击【领取】按钮后，运营人员会与您联系发放礼品~</p> -->
        <p>点击【领取】按钮后，运营人员会与您联系发放礼品~</p>
      </div>
    </van-dialog>

    <!-- 弹框二 -->
    <van-dialog class-name="dialog2" v-model="show2" title="消息提示" show-cancel-button @cancel="onCancel" @confirm="onConfirm" transition="fade">
      <p>您当前正在领取{{ wayBillNumber }}单礼品奖励，领取完成后，会消耗掉{{ wayBillNumber }}单有效运单数。是否确认领取？</p>
    </van-dialog>

    <!-- 弹框三 -->
    <van-dialog
      class-name="dialog1"
      v-model="show3"
      title="消息提示"
      :show-cancel-button="false"
      @confirm="queding"
      confirm-button-text="确定"
      transition="fade"
    >
      <p style="text-align:center">领取成功~</p>
      <p style="text-align:center">请等待运营人员与您联系发放礼品</p>
    </van-dialog>
  </div>
</template>
<script>
import { setNativeHead } from '../../utils/app.js';
import { hybWalletActivities, gethybRewards } from '../../api/apiHybWallet.js';
import { activityMaidian } from '../../api/maidian.js';
import { AppFinish } from '../../utils/app.js';
import { switchReward } from '../../utils/vfilters.js'
import { Dialog } from 'vant';
import Vue from 'vue';
Vue.use(Dialog);
export default {
  data() {
    return {
      libaoList: [
        require('../../assets/imgs/hybWalletActivities/lipin20_img@2x.png'),
        require('../../assets/imgs/hybWalletActivities/lipin50_img@2x.png'),
        require('../../assets/imgs/hybWalletActivities/lipin100_img@2x.png'),
        require('../../assets/imgs/hybWalletActivities/lipin200_img@2x.png'),
        require('../../assets/imgs/hybWalletActivities/lipin500_img@2x.png'),
        require('../../assets/imgs/hybWalletActivities/lipin1000_img@2x.png')
      ],
      rules:[
        "每个司机仅限第一次好运宝钱包到账后可领取10元现金；",
        "有效运单数：申请支付运费时选择司机好运宝钱包。运费到账后，该运单为本次活动的有效运单；",
        "活动期间内，申请支付运费选择好运宝钱包，运费到账后的运单数进行累计；当达到对应的运单数时即可点击领取相应的礼品，确认领取礼品后，当前运单数将扣除领取该礼品所需的运单数；",
        "活动有效运单数累计截止至2月29日 23:59:59，领取礼品截止至3月2日23:59:59。逾期失效，请及时领取；",
        "若发现用户恶意刷单行为，将取消活动资格；",
        "活动最终解释权归路歌互联网平台所有；",
        "本次活动与苹果（Apple Inc.）无关。"
      ],
      LeoRules:[
        "每个司机仅限第一次好运宝钱包到账后可领取10元现金；",
        "若发现用户恶意刷单行为，将取消活动资格；",
        "活动最终解释权归路歌互联网平台所有；",
        "本次活动与苹果（Apple Inc.）无关。"
      ],
      title: '',
      wayBillNumber: '',
      show1: false,
      show2: false,
      show3: false,
      rewardAmount: '', // 我的奖励
      effWaybillNum: '', // 有效运单数
      activtiyDate: '', // 活动日期
      itemList: [], // 奖励项目list
      rewardList: [], // 奖励内容list
      item: [], // 点击领取存值
      isLeo:'1', // isLeo事业部配置  ->0：是 1：不是
    };
  },
  components: {
    [Dialog.Component.name]: Dialog.Component
  },
  beforeRouteEnter(to, from, next) {
    let json = { isShow: '1' };
    setNativeHead(json);
    next();
  },
  created() {},
  filters: {
    formater1: function(item) {
      if (item.length <= 5) {
        return item.substr(0, 2);
      } else {
        return item.substr(0, 3);
      }
    },
    formater2: function(item) {
      if (item.length <= 5) {
        return item.substr(2, item.length - 1);
      } else {
        return item.substr(3, item.length - 1);
      }
    }
  },
  mounted() {
    
    window.scrollTo(0, 0);
    this.$nextTick(()=>{
      this.datInit();
    })
  },
  methods: {
    // 页面数据初始化
    datInit() { // 25015
      hybWalletActivities({})
        .then(res => {
          this.$store.commit('updateLoadingStatus', { isLoading: false });
          if (res.data.reCode == '0') {
            let result = res.data.result;
            this.rewardAmount = result.rewardAmount;
            this.effWaybillNum = result.effWaybillNum;
            this.activtiyDate = result.activtiyDate;
            this.itemList = result.itemList;
            this.isLeo = result.isLeo;
          } else {
            this.$vux.toast.text(res.data.reInfo, 'middle');
          }
        })
        .catch(err => {
          console.log(err);
          this.$store.commit('updateLoadingStatus', { isLoading: false });
        });
    },
    // 返回按钮
    goBack() {
      AppFinish('-1');
    },
    // 到页面底部
    gotoBottom() {
      // console.log(document.getElementsByClassName("hyb-wallet-activities")[0].clientHeight);
      var height = document.getElementsByClassName('hyb-wallet-activities')[0].clientHeight;
      window.scrollTo(0, height);
    },
    // 去提现
    gotoWallet() {
      let json = {
        behaviorType:'4',
        type:'24',
        mobileNo:''
      }
      activityMaidian(json).then((res)=>{
        this.$router.push('/commonWallet');
        // window.location.href = 'https://' + window.location.host + '/#/commonWallet';
      }).catch((err)=>{

      })
    },
    // 领取
    receive(index) {
      this.item = this.itemList[index];
      this.wayBillNumber = this.item.waybillNum;
      this.show2 = true;
    },
    // 查看礼品
    checkLiping(index) {
      // 调接口，将数据存在弹框里
      this.rewardList = [];
      this.rewardList = this.itemList[index].rewardList;
      this.title = this.itemList[index].name;
      this.wayBillNumber = this.itemList[index].waybillNum;
      let json = {
        behaviorType:'4',
        type:switchReward(index),
        mobileNo:''
      }
      activityMaidian(json).then((res)=>{
        this.show1 = true;
      }).catch((err)=>{

      })
    },
    onCancel() {
      console.log('取消');
    },
    onConfirm() {
      let json = {
        no: this.item.no,
        name: this.item.name,
        waybillNum: this.item.waybillNum
      };
      gethybRewards(json)
        .then(res => {
          if (res.data.reCode == '0') {
            this.show3 = true;
          } else {
            this.$vux.toast.text(res.data.reInfo, 'middle');
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    understand() {
      this.show2 = false;
    },
    queding() {
      this.datInit();
      this.show3 = false;
    },
    // 查看领取记录
    viewRecord(){
      let json = {
        behaviorType:'4',
        type:'33',
        mobileNo:''
      }
      activityMaidian(json).then((res)=>{
        this.$router.push('/receiveRecord')
      })
    }
  }
};
</script>
<style lang="less">
@keyframes heartBeat {
    0% {
	    transform:scale(1.0,1.0);
      opacity:1;
    }
    25% {
      transform:scale(1.1,1.1);
      opacity:0.9;
    }
    100% {
      transform: scale(1.0,1.0);
      opacity:1;
    }
}
.van-hairline--top::after{
  border-top-width:0px;
}
[class*=van-hairline]::after{
  border:none;
}
.dialog1 {
  border-radius: 8px;
  .van-dialog__header {
    background: #6440fa;
    color: #fff;
    padding: 10px;
    font-size: 18px;
  }
  .van-dialog__content {
    padding: 20px 20px 5px 20px;
    color: #313233;
    font-size: 14px;
    text-align: left;
    @media screen and (max-width: 320px) {
      font-size: 13px;
    }
  }
  .van-dialog__footer {
    text-align: center;
    .van-dialog__confirm {
      background: #6440fa;
      color: #fff;
      border: 1px solid #6440fa;
      border-radius: 30px;
      width: 40%;
      margin: 0.2rem auto 1.2rem;
    }
  }
  .lipingquan {
    color:#313233;
    .card_center{
      left: 50%;
      height:80px;
      margin:5px;
      transform: translateX(-65px);
    }
    div {
      display: inline-block;
      position: relative;
      margin-right: 4px;
      height:80px;
      img{
        width:120px;
        height:100%;
      }
      .num {
        position: absolute;
        top: 5px;
        left: 9px;
        color: #fff;
      }
      .substance {
        text-align: center;
        position: absolute;
        right: 20px;
        top: 17px;
        width: 72px;
        word-break: break-all;
        height: 20px;
        line-height: 20px;
      }
      .substance1{
        text-align: center;
        position: absolute;
        margin-top: 3px;
        right: 18px;
        top: 34px;
        // width: 72px;
        width: 80px;
        word-break: break-all;
        line-height: 1.2;
        height: 20px;
        line-height: 20px;
      }
    }
    @media screen and (min-width:414px){
      div{
        margin-right: 12px;
        img {
          width: 130px;
          height:70px;
        }
        .substance {
          width: 100px;
        }
        .substance1 {
          width: 100px;
        }
      }
    }
  }
}
.dialog2 {
  border-radius: 8px;
  .van-dialog__header {
    background: #6440fa;
    color: #fff;
    padding: 10px;
    font-size: 18px;
  }
  .van-dialog__content {
    padding: 20px;
    color: #313233;
    font-size: 14px;
    text-align: left;
  }
  .van-dialog__footer {
    .van-dialog__cancel {
      background: #fff;
      color: #6440fa;
      border: 1px solid #6440fa;
      border-radius: 30px;
      margin: 0.5em 1em;
    }
    .van-dialog__confirm {
      background: #6440fa;
      color: #fff;
      border: 1px solid #6440fa;
      border-radius: 30px;
      margin: 0.5em 1em;
    }
  }
}
.hyb-wallet-activities {
  background-color: #7a65fb;
  position: absolute;
  width: 100%;
  height: auto;
  overflow: hidden;
  // overflow-y: scroll;
  .activity_header {
    .activity_header_bg {
      height: auto;
      position: relative;
      .activity_wodejiangbgli_img {
        width: 100%;
        height: 22%;
        width: 95%;
        position: absolute;
        bottom: -30px;
        transform: translateX(10px);
        background-image: url('../../assets/imgs/hybWalletActivities/wodejiangbgli_img@2x.png');
        background-size: 100% auto;
        background-repeat: no-repeat;
        display: flex;
        z-index: 1;
        .item1 {
          flex: 1;
        }
        .item2 {
          flex: 2;
          @media screen and (max-width: 414px) {
            p{
              font-size: 14px;
              color: #6f4c10;
              &:nth-child(1){
                color: #5c49fa;
                font-weight: bold;
                font-size: 16px;
                margin-top: 14px;
              }
            }
          }
          @media screen and (max-width: 375px) {
            p{
              font-size: 13px;
              color: #6f4c10;
              &:nth-child(1){
                color: #5c49fa;
                font-weight: bold;
                font-size: 16px;
                margin-top: 10px;
              }
            }
          }
          @media screen and (max-width: 320px) {
            p{
              font-size: 12px;
              color: #6f4c10;
              &:nth-child(1){
                color: #5c49fa;
                font-weight: bold;
                font-size: 14px;
                margin-top: 8px;
              }
            }
          }
          // display: flex;
          // flex-direction: column;
          // .line1 {
          //   flex: 1;
          //   color: #5c49fa;
          //   font-size: 17px;
          //   font-weight: bold;
          //   font-family: MFLiHei-Regular;
          //   @media screen and (max-width: 320px) {
          //     font-size: 16px;
          //   }
          //   p {
          //     line-height: 2.5;
          //   }
          // }
          // .line2 {
          //   flex: 1;
          //   color: #6f4c10;
          //   font-size: 13px;
          //   line-height: 22px;
          //   margin-top: -14px;
          //   @media screen and (max-width: 320px) {
          //     font-size: 12px;
          //   }
          // }
        }
        .item3 {
          animation: heartBeat 0.6s infinite;
          flex: 1;
          position: relative;
          .qutixian {
            width: 100%;
            height: 100%;
            color: #fff;
            font-weight: bold;
            position: absolute;
            left: 0;
            top: 0;
            text-align: center;
            @media screen and (max-width: 320px) {
              height: 16px;
              line-height: 16px;
              font-size: 14px;
              margin-top: 23%;
            }
            @media screen and (max-width: 375px) {
              height: 20px;
              line-height: 20px;
              margin-top: 32%;
            }
            @media screen and (max-width: 414px) {
              height: 20px;
              line-height: 20px;
              margin-top: 32%;
            }
          }
        }
      }
      .activity_time {
        width: 256px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        color: #fff;
        font-size: 15px;
        background: rgba(253, 139, 12, 1);
        opacity: 0.8;
        border-radius: 15px;
        position: absolute;
        // top: 20vh;
        top:8rem;
        left: 50%;
        transform: translateX(-125px);
      }
      @media screen and (min-width:414px){
        .activity_time {
          top:9rem;
        }
      }
    }
    .activity_rule {
      font-size: 15px;
      color: #d45016;
      text-align: center;
      width: 55px;
      height: 40px;
      line-height: 33px;
      background-image: url('../../assets/imgs/hybWalletActivities/guize_img@2x.png');
      background-size: auto 100%;
      background-repeat: no-repeat;
      position: absolute;
      right: -5px;
      top: 130px;
      a {
        text-decoration: none;
      }
    }
  }
  .activity_content {
    width: 95%;
    height: auto;
    background: #fff;
    margin: 46px auto 0px;
    border-radius: 5px;
    text-align: center;
    padding: 10px;
    box-sizing: border-box;
    .content_header {
      height: 50px;
      line-height: 60px;
    }
    .content_paragraph {
      text-align: left;
      margin-bottom: 20px;
      p {
        font-size: 14px;
        height: 28px;
        line-height: 28px;
        color: #313233;
        @media screen and (max-width: 320px) {
          font-size: 12px;
        }
      }
    }
    .dash {
      height: 0;
      border-bottom: 1px dotted #e5bc77;
    }
    .yundanbg {
      background: rgba(92, 73, 250, 1);
      box-shadow: 0px 0px 16px 0px rgba(22, 23, 21, 0.12);
      border-radius: 5px;
      height: 82px;
      margin: 20px auto;
      display: flex;
      position: relative;
      .item1 {
        flex: 1.5;
        img {
          width: 86px;
        }
      }
      .item2 {
        flex: 2;
        text-align: left;
        padding: 10px 0;
        p {
          // height: 100%;
          // line-height: 5;
          color: #fff;
          // margin-top:5px;
          margin-top: 3px;
          .white_bg {
            color: #ff7c42;
            background: #fff;
            border-radius: 10px;
            padding: 1px 8px;
          }
          img{
            vertical-align: middle;
            width: 13px;
          }
          .gold{
            color:#FDDBAB;
            padding-bottom: 1px;
            border-bottom: 1px solid;
          }
        }
      }
      .lianzi1 {
        position: absolute;
        bottom: -40px;
        left: 45px;
      }
      .lianzi2 {
        position: absolute;
        bottom: -40px;
        right: 45px;
      }
    }
    .card_bg {
      width: 100%;
      height: auto;
      background: rgba(255, 247, 233, 1);
      box-shadow: 0px 0px 16px 0px rgba(22, 23, 21, 0.12);
      border-radius: 5px;
      display: flex;
      flex-wrap: wrap;
      padding: 10px;
      box-sizing: border-box;
      .card {
        flex-direction: row;
        width: 50%;
        height: 175px;
        background-image: url('../../assets/imgs/hybWalletActivities/lipjiangli_img@2x.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        padding: 10px;
        box-sizing: border-box;
        color: #313233;
        .p1 {
          font-size: 14px;
          font-weight: bold;
          @media screen and (max-width: 320px) {
            font-size: 12px;
          }
        }

        .p3 {
          font-size: 13px;
          color: #d45016;
          font-size: 13px;
          height: 25px;
          line-height: 25px;
          margin-top: -8px;
          margin-bottom: 15px;
        }
        .p4 {
          font-size: 15px;
          color: #fff;
          input{
            border:none;
            border-radius: 15px;
            padding: 0px 26px;
            -webkit-appearance: none;
          }
          .blue {
            background: #4d3dfa;
          }
          .gray {
            background: #dcdcdc;
          }
        }
      }
    }
  }
  .activity_footer {
    width: 95%;
    height: auto;
    background: #fff;
    margin: 50px auto 40px;
    border-radius: 5px;
    text-align: center;
    padding: 10px;
    box-sizing: border-box;
    .footer_title {
      height: 50px;
      line-height: 60px;
    }
    table {
      font-size: 14px;
      text-align: left;
      tr {
        td:nth-child(1) {
          font-size: 12px;
          width: 18px;
          // height: 16px;
          background: rgba(92, 73, 250, 1);
          border-radius: 50%;
          color: #fff;
          display: inline-block;
          text-align: center;
          margin-top: -3px;
        }
      }
    }
  }
}
</style>
