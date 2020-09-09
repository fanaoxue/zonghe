<template>
  <div class="yunli">
    <h4>一.初级运力和我的关系？</h4>
    <p>是近期与我合作过，沟通顺畅、配合良好的司机。</p>
    <h4>二.直属运力和我的关系？</h4>
    <p>
      是直属于我的司机，对我有较深的忠诚度和信任度，会优先配合我的运输任务。同时我作为直属运力的
      经理人，也需要优先保障司机的各项利益，确保双
      方之间合作稳定。
    </p>
    <h4>三.直属运力服务标准</h4>
    <div class="card" v-for="(item1,index1) in cardList1" :key="index1">
      <img :src="item1.imgUrl" alt />
      <div class="info_detail">
        <div class="items">{{item1.title}}</div>
        <div class="detail">{{item1.desc}}</div>
      </div>
    </div>
    <h4>四.如何添加直属运力？</h4>
    <table>
      <tr>
        <div>①</div>
        <td>主动升级：在初级列表中选择初级运力点击【升级直属】，司机同意即可。</td>
      </tr>
      <tr>
        <div>②</div>
        <td>审批通过：司机主动申请升级您的直属运力，在我的运力-审批中，审批通过即可。</td>
      </tr>
    </table>
    <div class="footer" style="height:60px"></div>
  </div>
</template>

<script>
export default {
  name: "description",
  data() {
    return {
      cardList1: [
        {
          imgUrl: require("../../../assets/imgs/roadTransCapacity/lvyuenengli_icon@2x.png"),
          title: "履约能力",
          desc:
            "面对运输任务要按时到场，不临时加价，秉着诚信原则响应并完成运输。"
        },
        {
          imgUrl: require("../../../assets/imgs/roadTransCapacity/fuwunengli_icon@2x.png"),
          title: "服务能力",
          desc: "积极配合装卸货现场的要求，与经理人共同服务好上游货主。"
        },
        {
          imgUrl: require("../../../assets/imgs/roadTransCapacity/baozhanganquan_icon@2x.png"),
          title: "保障安全",
          desc: "保障货物运输安全，根据物品属性做好防护措施。"
        },
        {
          imgUrl: require("../../../assets/imgs/roadTransCapacity/taiduliagnhao_icon@2x.png"),
          title: "态度良好",
          desc: "面对可能出现的各种突发事件或纠纷，能够冷静沟通积极处理。"
        }
      ]
    };
  }
};
</script>

<style lang="less" scoped>
.yunli {
  background-color: #ffffff;
  // margin-top: 20px;
  padding: 10px 20px;
  height: 90vh;
  // overflow: auto;
  h4 {
    color: #202020;
    margin: 20px 0px 5px;
  }
  p {
    font-size: 14px;
    color: #313233;
  }
  .card {
    width: 100%;
    padding: 5px 10px 5px 0px;
    box-sizing: border-box;
    img {
      height: 50px;
      width: 50px;
      border-radius: 50%;
      vertical-align: top;
      margin-top: 4px;
    }
    .info_detail {
      margin-left: 8px;
      width: 75%;
      @media screen and (max-width: 320px) {
        width: 70%;
      }
      height: 22px;
      line-height: 22px;
      display: inline-block;
      .items {
        font-weight: Bold;
        font-size: 14px;
      }
      .detail {
        font-size: 13px;
        color: #6c6c6c;
        span {
          color: #15499a;
        }
      }
    }
  }
  table {
    td {
      font-size: 14px;
      color: #313233;
    }
  }
}
</style>