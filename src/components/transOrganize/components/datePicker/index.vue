<template>
  <div class="date_picker">
    <!-- vant Picker 根据 绑定的columns数据，来渲染几级联动，这里我们使用的是三级联动 -->
    <van-picker
      show-toolbar
      title="请选择装货时间"
      :visible-item-count="3"
      :columns="columns"
      @cancel="onCancel"
      @confirm="onConfirm"
      @change="onChange"
      :item-height="50"
    />
  </div>
</template>
<script>
import { Picker , Toast } from 'vant'
export default {
  name: 'date_picker',
  components:{
    vanPicker: Picker
  },
  props: {
    startDate: {
      type: String,
      // default:'2020/11/01'
      default: () => {
        return new Date().toString()
      }
    },
    endDate: {
      type: String,
      default: '2022/01/01'
    }
  },
  data() {
    return {
      columns: [
        {
          values: '',
          className: 'column1'
        },
        {
          values: '',
          className: 'column2',
          defaultIndex: 0
        },
        {
          values: '',
          className: 'column3',
          defaultIndex: 0
        },
        {
          values: '',
          className: 'column4',
          defaultIndex: 0
        }
      ],
      cityDatas: '', //安联当前选中市的所有区所有数据
      showPicker: false, //vant Popup弹出框显示隐藏
      data: {} //接口返回所有省市区数据
    }
  },
  created() {
    // this.data = window.city.data
    this.data = [
      {
        text: '全天',
        code: '0',
        child: [
          // { text: '0点', code: '0' },
          // { text: '1点', code: '1' },
          // { text: '2点', code: '2' },
          // { text: '3点', code: '3' },
          // { text: '4点', code: '4' },
          // { text: '5点', code: '5' },
          // { text: '6点', code: '6' },
          // { text: '7点', code: '7' },
          // { text: '8点', code: '8' },
          // { text: '9点', code: '9' },
          // { text: '10点', code: '10' },
          // { text: '11点', code: '11' },
          // { text: '12点', code: '12' },
          // { text: '13点', code: '13' },
          // { text: '14点', code: '14' },
          // { text: '15点', code: '15' },
          // { text: '16点', code: '16' },
          // { text: '17点', code: '17' },
          // { text: '18点', code: '18' },
          // { text: '19点', code: '19' },
          // { text: '20点', code: '20' },
          // { text: '21点', code: '21' },
          // { text: '22点', code: '22' },
          // { text: '23点', code: '23' },
          // { text: '24点', code: '24' }
        ]
      },
      {
        text: '上午',
        code: '1',
        child: [
          { text: '6点', code: '6' },
          { text: '7点', code: '7' },
          { text: '8点', code: '8' },
          { text: '9点', code: '9' },
          { text: '10点', code: '10' },
          { text: '11点', code: '11' },
          { text: '12点', code: '12' }
        ]
      },
      {
        text: '下午',
        code: '2',
        child: [
          { text: '13点', code: '13' },
          { text: '14点', code: '14' },
          { text: '15点', code: '15' },
          { text: '16点', code: '16' },
          { text: '17点', code: '17' },
          { text: '18点', code: '18' }
        ]
      },
      {
        text: '晚上',
        code: '3',
        child: [
          { text: '19点', code: '19' },
          { text: '20点', code: '20' },
          { text: '21点', code: '21' },
          { text: '22点', code: '22' },
          { text: '23点', code: '23' },
          { text: '24点', code: '24' }
        ]
      },
      {
        text: '凌晨',
        code: '4',
        child: [
          { text: '1点', code: '1' },
          { text: '2点', code: '2' },
          { text: '3点', code: '3' },
          { text: '4点', code: '4' },
          { text: '5点', code: '5' }
        ]
      }
    ]

    // 默认展示一级的数据
    let startTime = new Date(this.startDate.replace(/-/g, '/'))
    let endTime = new Date(this.endDate.replace(/-/g, '/'))
    let arr = []
    while (endTime.getTime() - startTime.getTime() >= 0) {
      arr.push({ submitText: this.getSubmitName(startTime),text: this.getDayName(startTime), code: this.getDayCode(startTime) })
      startTime.setDate(startTime.getDate() + 1)
    }
    this.columns[0].values = arr
    // 默认展示二级的数据
    this.columns[1].values = Object.values(this.data).map(function(e) {
      return { text: e.text, code: e.code }
    })
    // 默认展示三级的数据
    this.columns[2].values = Object.values(this.data[0].child).map(function(e) {
      return { text: e.text, code: e.code }
    })
    // 默认展示三级的数据
    this.columns[3].values = Object.values(this.data[0].child).map(function(e) {
      return { text: e.text, code: e.code }
    })
  },
  mounted() {},
  methods: {
    getSubmitName(od) {
       let year = od.getFullYear();
      let month = od.getMonth() + 1
      let day =
        od.getDate().toString().length == 1
          ? '0' + od.getDate()
          : od.getDate()
      return year + '年' + month + '月' + day + '日'
    },
    getDayName(od) {
      let td = new Date()
      td = new Date(td.getFullYear(), td.getMonth(), td.getDate())
      // let od=new Date(startTime);
      od = new Date(od.getFullYear(), od.getMonth(), od.getDate())
      let xc = (od - td) / 1000 / 60 / 60 / 24
      if (xc == 0) {
        return '今天'
      } else if (xc < 2) {
        return '明天'
      } else {
        // let year = od.getFullYear();
        let month = od.getMonth() + 1
        let day =
          od.getDate().toString().length == 1
            ? '0' + od.getDate()
            : od.getDate()
        return month + '月' + day + '日'
      }
      // if(xc<-2){
      //     return -xc+"天前";
      // }else if(xc<-1){
      //     return "前天";
      // }else if(xc<0){
      //     return "昨天";
      // }else if(xc==0){
      //     return "今天";
      // }else if(xc<2){
      //     return "明天";
      // }else if(xc<3){
      //     return "后天";
      // }else{
      //   return xc+"天后";
      // }
    },
    getDayCode(date) {
      return `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`
    },
    // vant picker选择器回调
    // eslint-disable-next-line no-unused-vars
    async onChange(picker, values, index) {
      if (index === 1) {
        // 回调时修改第4列数据
        // 回调时修改第3列数据
        await picker.setColumnValues(2, this.modifyData(this.data, values[1]))
        await picker.setColumnValues(3, this.modifyData(this.data, values[1]))
      } else if (index === 2) {
        // 回调时修改第4列数据
      }
    },
    modifyData(data, value) {
      var that = this
      data.forEach(function(res) {
        if (res.code == value.code) {
          that.cityDatas = res
        }
      })

      return Object.values(this.cityDatas.child).map(function(res) {
        return { text: res.text, code: res.code }
      })
    },
    onConfirm(val, index) {
      let text
      let code
      if (val[1].code === '0') {
        // 全天不用选择
        this.showPicker = false
        text = val[0].submitText +','+ val[1].text
        code = [val[0].code , val[1].code]
      } else {
        if (Number(val[3].code) < Number(val[2].code)) {
          Toast('结束时间不能小于开始时间')
          return
        }
        this.showPicker = false
        text = val[0].submitText +','+ val[1].text +','+ val[2].text +'-'+ val[3].text
        code = val.map(function(res) {
          return res.code
        })
      }
      this.$emit('onConfirm', { text, code, val, index })
    },
    // eslint-disable-next-line no-unused-vars
    onCancel(val, index) {
      this.showPicker = false
      this.$emit('onCancel', val, index)
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.van-picker__toolbar{
  background: #15499A;
  color: #fff;
}
/deep/.van-picker__cancel, /deep/.van-picker__confirm {
  color: #fff;
}
</style>
