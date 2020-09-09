<template>
  <div class="road_trans_tapacity">
    <c-header isShowTitle>
      <van-nav-bar @click-left="onClickLeft" title="路优运力" fixed>
        <template #left>
          <div @click="PositioningAgain">
            <i class="iconfont icondingwei"></i>
            <span>{{ location }}</span>
          </div>
        </template>
        <template #right>
          <div @click="goDeliveryGoodsRecord">任务记录</div>
        </template>
      </van-nav-bar>
    </c-header>
    <div class="container">
      <div class="useinfo">
        <div class="avatar">
          <img :src="headImg" alt />
        </div>
        <div class="info">
          <div class="name yellow">{{ realName }}</div>
          <div class="positon">
            经理人级别:
            <span class="level yellow">{{ managerLevel }}</span>
          </div>
        </div>
      </div>
      <div class="tag">
        <div class="item item1_0" @click="goMytransCap">
          <div class="mytrans">
            <span class="shan"></span>
          </div>
          <div class="mytrans_1">
            <span class="shan_bottom"></span>
          </div>
          <div class="icon">
            <img src="@/assets/imgs/roadTransCapacity/wodeyunli_icon@2x.png" alt />
          </div>
          <div class="text text_1">
            <span class="label">
              我的运力
              <span class="info" v-show="Number(approvalCount) > 0">
                {{
                approvalCount
                }}
              </span>
            </span>
            <span class="details">详情>>></span>
          </div>
        </div>
        <div class="item">
          <div class="mytrans_1">
            <span class="shan_bottom"></span>
          </div>
          <div class="icon">
            <img src="@/assets/imgs/roadTransCapacity/zaituyunli_icon@2x.png" alt />
          </div>
          <div class="text text_2">
            在途运力
            <span class="number">({{ transitCount | numberEmpty }})</span>
          </div>
        </div>
      </div>
      <div class="statistics">
        <div class="item">
          <div class="number yellow">{{ transOrgCount | numberEmpty }}</div>
          <div>运力资源总数</div>
        </div>
        <div class="line_2"></div>
        <div class="item">
          <div class="yellow">
            <span class="number">{{ districtCount | numberEmpty }}</span>市
          </div>
          <div>运力分布</div>
        </div>
        <div class="line_2"></div>
        <div class="item">
          <div class="yellow" v-show="locationSuccess">
            {{ location
            }}
            <span class="number">{{ localCount | numberEmpty }}</span>辆
          </div>
          <div class="yellow">
            本地运力
            <i class="iconfont iconxiaoche"></i>
          </div>
        </div>
      </div>
      <div class="echarts">
        <div class="time_box">
          <div class="time">截止{{ date | formatDate("Y-m-d H:i") }}</div>
        </div>
        <div :style="{ height: '340px', width: '100%' }" ref="myEchart"></div>
      </div>
      <div class="btn_box">
        <div class="btn" @click="goDeliveryGoods">分配运输任务</div>
      </div>
    </div>
    <div id="container" style="display:none"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import MapLoader from '@/utils/AMap.js'
import "../../../node_modules/echarts/map/js/china.js";
import { NavBar, Toast } from "vant";
import { checkLocationPermission } from "@/utils/app.js";
import {
  getUserInfo,
  getStatistics,
  getMapData,
  getInfos
} from "@/api/apiRoadTransCapacity.js";
import { openNewWindow, systemType } from "@/utils/app.js";
import Const from "@/utils/const.js";
import { formatDate } from "@/utils/vfilters.js";
export default {
  name: "RoadTransCapacity",
  props: ["userJson"],
  components: {
    vanNavBar: NavBar
  },
  filters: {
    numberEmpty(value) {
      return value || "-";
    }
  },
  data() {
    return {
      date: new Date(),
      headImg: "",
      realName: "",
      managerLevel: "",
      transitCount: "",
      transOrgCount: "",
      districtCount: "",
      localCount: "",
      approvalCount: "",
      list: [],
      chart: "",
      location: "",
      locationSuccess: false,
      img_1: require("../../assets/imgs/roadTransCapacity/didian_icon@2x.gif"),
      img_2: require("../../assets/imgs/roadTransCapacity/zhishu_icon@2x.png"),
      img_3: require("../../assets/imgs/roadTransCapacity/chuji_icon@2x.png")
    };
  },
  created() {
    this.$store.commit("updateLoadingStatus", { isLoading: false });
  },
  mounted() {
    let _this = this;
    MapLoader().then(AMap => {
      console.log('地图加载成功')
      this.timer = setInterval(() => {
        _this.date = new Date();
      }, 1000);
      window.AppMesgLocationPrivateCallBack = this.init;
      window.AppMesgTransportRefreshCallBack = this.init;
      checkLocationPermission();
    }).catch(e => {
      console.log('地图加载失败' ,e)
    })
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    onClickLeft() {},
    init() {
      this.gaodeGps();
    },
    getPageData() {
      this._getUserInfo().then(() => {
        this._getMapData().then(() => {
          this._getInfos().then(() => {
            this.myChart();
            if (this.locationSuccess) {
              this._getStatistics();
            }
          });
        });
      });
    },
    gaodeGps() {
      this.location = "定位中...";
      var v = this;
      var address = [];
      var map, geolocation;
      //加载地图，调用浏览器定位服务
      map = new AMap.Map("container", {
        resizeEnable: true
      });
      map.plugin(["AMap.Geolocation", "AMap.Geocoder"], function() {
        geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, //是否使用高精度定位，默认:true
          timeout: 10000, //超过10秒后停止定位，默认：无穷大
          buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          buttonPosition: "RB"
        });
        map.addControl(geolocation);
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, "complete", onComplete); //返回定位信息
        AMap.event.addListener(geolocation, "error", onError); //返回定位出错信息
      });
      //解析定位结果
      function onComplete(data) {
        var str = ["定位成功"];
        str.push("经度：" + data.position.getLng());
        str.push("纬度：" + data.position.getLat());
        address = [data.position.getLng(), data.position.getLat()];
        // address = [ 112.57, 35.08 ] // 济源市
        // address = [ 117.2, 39.13 ] // 天津市
        // address = [ 109.17361, 18.74986 ] // 乐东黎族自治县
        // address = [ 114.16546, 22.27534 ] // 
        // 定位信息解析成地址
        var geocoder = new AMap.Geocoder({
          city: "010" //城市，默认：“全国”
        });
        var marker = new AMap.Marker({
          map: map,
          bubble: true
        });
        marker.setPosition(address);
        geocoder.getAddress(address, function(status, result) {
          if (status == "complete") {
            let citycode = result.regeocode.addressComponent.citycode;
            let city = result.regeocode.addressComponent.city;
            // 北京 天津 上海 重庆 香港 澳门
            let whiteCityList = ['010', '022', '021', '023', '1852', '1853']
            if (!!city) {
              v.location = city;
            } else if (whiteCityList.includes(citycode.toString())) {
              // 4个直辖市和2个特别行政区
              v.location = result.regeocode.addressComponent.province;
            } else {
              v.location = result.regeocode.addressComponent.district;
            }
            v.locationSuccess = true;
            v.getPageData();
          }
        });
      }
      //解析定位错误信息
      function onError(data) {
        let sysType = systemType();
        if (sysType === 0) {
          // test
          v.location = "北京市";
          v.locationSuccess = true;
          v.getPageData();
        } else {
          v.location = "重新定位";
          v.locationSuccess = false;
          v.getPageData();
        }
      }
    },
    PositioningAgain() {
      if (this.location == "定位中...") {
        return;
      } else {
        checkLocationPermission();
        // this.gaodeGps();
      }
    },
    reloadMyChart() {
      try {
        this.chart.dispose();
        this.chart = null;
      } catch (error) {}
      this.myChart();
    },
    myChart() {
      // 全国省份数据
      let toolTipData = [];
      this.list.forEach(element => {
        toolTipData.push({
          name: element.provinceName,
          value: element.allNum,
          ...element
        });
      });
      function getGeoCoordMap(name) {
        name = name ? name : "china";
        /*获取地图数据*/
        var geoCoordMap = {};
        myChart.showLoading(); // loading start
        var mapFeatures = echarts.getMap(name).geoJson.features;
        myChart.hideLoading(); // loading end
        mapFeatures.forEach(function(v) {
          var name = v.properties.name; // 地区名称
          geoCoordMap[name] = v.properties.cp; // 地区经纬度
        });
        return geoCoordMap;
      }
      function convertData(data) {
        // 转换数据
        var geoCoordMap = getGeoCoordMap("");
        var res = [];
        for (var i = 0; i < data.length; i++) {
          var geoCoord = geoCoordMap[data[i].provinceName]; // 数据的名字对应的经纬度
          if (geoCoord) {
            // 如果数据data对应上，
            res.push({
              name: data[i].provinceName,
              value: geoCoord.concat(data[i].allNum)
            });
          }
        }
        return res;
      }
      let myChart = echarts.init(this.$refs.myEchart); //这里是为了获得容器所在位置
      this.chart = myChart;
      // window.onresize = myChart.resize;

      let vm = this;
      myChart.setOption({
        tooltip: {
          trigger: "item",
          showDelay: "100",
          triggerOn: "click",
          position: function(point, params, dom, rect, size) {
            return [point[0] - 40, point[1] - 40];
          },
          padding: 0,
          formatter: function(params) {
            // 鼠标滑过显示的数据
            var toolTiphtml = "";
            for (var i = 0; i < toolTipData.length; i++) {
              if (params.name == toolTipData[i].provinceName) {
                toolTiphtml = `<div class="tooltip_box"><div class="item"><img class="img img_1" src="${vm.img_1}"/><span class="provinceName">${toolTipData[i].provinceName}</span></div><div class="item"><img class="img" src="${vm.img_2}"/><span>直属:</span><span class="number">${toolTipData[i].directNum}</span></div><div class="item"><img class="img" src="${vm.img_3}"/><span>初级:</span><span>${toolTipData[i].primaryNum}</span></div></div>`;
              }
            }
            return toolTiphtml;
          }
        },
        visualMap: {
          show: false,
          type: "piecewise",
          pieces: [{ color: "#4459ab" }]
        },
        geo: [
          {
            show: true,
            map: "china",
            roam: false,
            aspectScale: 0.7,
            zoom: 1.25,
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                areaColor: "#050F3C",
                borderWidth: 2, //设置外层边框
                borderColor: "#d3a226",
                shadowColor: "rgba(211, 162, 38,0.6)",
                shadowBlur: 10
              },
              emphasis: {
                show: false
              }
            }
          },
          {
            map: "china",
            roam: true, //roam与上一个geo配置相同
            aspectScale: 0.7,
            scaleLimit: {
              min: 1.25,
              max: 4
            },
            zoom: 1.25,
            label: {
              normal: {
                show: false //显示省份标签
              },
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                areaColor: "#050F3C",
                borderColor: "#d3a226",
                borderWidth: 0.5
              },
              emphasis: {
                show: true,
                areaColor: "#0F2BAA"
              }
            }
          }
        ],
        series: [
          {
            name: "中国",
            type: "map",
            mapType: "china",
            // roam: true, //是否开启鼠标缩放和平移漫游
            data: toolTipData,
            // top: "3%",//组件距离容器的距离
            geoIndex: 1,
            // showLegendSymbol: false, // 存在legend时显示
            selectedMode: "single"
          },
          {
            name: "点",
            type: "scatter",
            coordinateSystem: "geo",
            geoIndex: 1,
            silent: true,
            symbol:
              "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAMAAACfWMssAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAJSUExURQAAAOu0Ieu0Ieu0Ieu0Ieu0Ieu0IRrP2+u0Ieu0Ieu0IRrP2xrP2xrP2+u0IRrP2+u0Ieu0Ieu0Ieu0Ieu0Ieu0Ieu0IRrP2xrP2xrP2xrP2xrP2+u0Ieu0Ieu0Ieu0Ieu0IRrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2+u0Ieu0Ieu0Ieu0Ieu0Ieu0Ieu0Ieu0Ieu0IRrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2+u0Ieu0Ieu0Ieu0Ieu0Ieu0Ieu0Ieu0Ieu0Ieu0Ieu0Ieu0IUTLtr+/S+u0Ib6/Teu6JT7Lu6PBZeu0Ieq6JyTO0hrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2+G7LxrP2+u0IRrP2xrP26DCZxrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2+u6Jm7HkhrP2+u1IRrP2xrP2xrP2xrP2xrP2xrP24nEe+y2Iu26JBrP2yDO1hrP2+u6Ju26JBrP2xrP29q8NRrP2+y2Iu26JJTDchrP21vJo+y2IhrP2xrP2xrP2xrP2xrP2xrP2+26JBrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2xrP2+u0Ie26JOu1Iey2Iuy3Iu25I/sCAJUAAADAdFJOUwAIgC83zyTM++z5BgIH6mKvjtX+nAcxATK2SFfwPo8/7ck/FiE9KJ4IPrhSVVhWuQnztfS5mQau1DgqhwkbyyZ+M4KEDI5eVCLHw3zEdkMSrWEwgZu0WjW0MyYwMiUutvHQjdTy7vL90826/JJpkrM5NQ9KgLxqF4+voN1GvqdBvXiJqhkEmqM3upEsQhGd/HNvOjYYOhojHcBCn8JxIPQILpXXZOmDh0Bo3wWuMY15bAGURcVPUKweKYiQRIplLzI6ACQAAAJPSURBVEjHrdZlc9tAEAZg2Y4tk6w4jmNKYsfMDjMzc1JmZmaGpMzMzMzcngP/q820HxrBaUfj9/szd7pb7R5BJDSFdmlRsUOtdhQXSe2FYJZW4ED/ZVFBGojJcg2IEcMcmSCT6JWII8pMCd4p5IgncgXOTdEh3qiS+F1SDsIkh1cqdAgbHc9uJXIkEDn3CemRYOZz3p9SGCpnc8BcBMhUjjozQKCBXX2pCJRUpjOmw2C6kQEzEDAZDCiFQikDJkNhMgOmQGEKA6qgUMWAaihUJwqK3qrowxF9HaILAFxydpFFPteYqN+KmAmD09gtIB/i8jl6zgxIs5KJbI96zr6aLdiQ52UndgT8GTp5OJeHG1cqcWOOIGbxD9bpAqM8U9wonxg+u9huuQz07rj6YDJ7ehb60Ll9bXxsdGTCjIyOjT98A1NazaWbbVdOxf/l1iPvMy2AaeobrvtqOu6f3vHX3Xvy8vlr6ztKaDWbxWvzdIbpM7Urly2Jx1fsvUE3db4I9ccu42Fk2Nwc6Llraa0kSXLBwsVLycpWy9tGj/tO89F6jNvn9rvM1e0kI+2vzC5/Wx2/o1o0VIUzi2Sl5cJFqjyE+cLqIerg4UNs6Dt3XtPbgNlq+faSLu+GsuCkRbMsddaqE8c2eXCHs3Yb7S51Rjfv93UPBGOx4ED3ybJVTYHS47Uus8A1btm4pq9kz2Prx3BkcDAS/mB17mxct3W3TSNYAaYquuLA+09fvv7os0W/9fd0HFlds94EKzqTtqvXH6V/Bn6Fvn+mtCYiofkNW4o+rw9u+2IAAAAASUVORK5CYII=", //气泡
            symbolSize: 20,
            label: {
              normal: {
                show: true,
                formatter: function(params) {
                  return params.data.value[2];
                },
                textStyle: {
                  color: "#062B4D",
                  fontSize: 9
                }
              }
            },
            itemStyle: {
              normal: {
                color: "#F62157"
              }
            },
            data: convertData(toolTipData)
          }
        ]
      });

      myChart.on("georoam", function(params) {
        let option = myChart.getOption();
        if (option.geo[0].show) {
          option.geo[0].show = false;
          myChart.setOption(option);
        }
      });

      myChart.on("click", function(params) {
        try {
          MtaH5.clickStat("yl_map_click");
        } catch (error) {
          console.log(error);
        }
      });
    },
    _getMapData() {
      return new Promise((resolve, reject) => {
        const loading = Toast.loading({
          duration: 0,
          message: "加载中",
          forbidClick: true
        });
        getMapData({})
          .then(res => {
            loading.clear();
            if (res.data.reCode === "0") {
              const { list } = res.data.result;
              this.list = list;
              resolve();
            } else {
              Toast(res.data.reInfo);
              reject();
            }
          })
          .catch(e => {
            loading.clear();
            Toast(e);
            reject();
          });
      });
    },
    _getUserInfo() {
      return new Promise((resolve, reject) => {
        const loading = Toast.loading({
          duration: 0,
          message: "加载中",
          forbidClick: true
        });
        getUserInfo({})
          .then(res => {
            loading.clear();
            if (res.data.reCode === "0") {
              const { headImg, realName } = res.data.result;
              this.headImg = headImg;
              this.realName = realName;
              resolve();
            } else {
              Toast(res.data.reInfo);
              reject();
            }
          })
          .catch(e => {
            loading.clear();
            Toast(e);
            reject();
          });
      });
    },
    _getStatistics() {
      return new Promise((resolve, reject) => {
        const loading = Toast.loading({
          duration: 0,
          message: "加载中",
          forbidClick: true
        });
        getStatistics({ cityName: this.location })
          .then(res => {
            loading.clear();
            if (res.data.reCode === "0") {
              const {
                managerLevel,
                transitCount,
                transOrgCount,
                districtCount,
                localCount
              } = res.data.result;
              this.managerLevel = managerLevel;
              this.transitCount = transitCount;
              this.transOrgCount = transOrgCount;
              this.districtCount = districtCount;
              this.localCount = localCount;
              resolve();
            } else {
              Toast(res.data.reInfo);
              reject();
            }
          })
          .catch(e => {
            loading.clear();
            Toast(e);
            reject();
          });
      });
    },
    _getInfos() {
      return new Promise((resolve, reject) => {
        const loading = Toast.loading({
          duration: 0,
          message: "加载中",
          forbidClick: true
        });
        getInfos({ type: "1" })
          .then(res => {
            loading.clear();
            if (res.data.reCode === "0") {
              const { approvalCount } = res.data.result;
              this.approvalCount = approvalCount;
              resolve();
            } else {
              Toast(res.data.reInfo);
              reject();
            }
          })
          .catch(e => {
            loading.clear();
            Toast(e);
            reject();
          });
      });
    },
    // 发货记录
    goDeliveryGoodsRecord() {
      try {
        MtaH5.clickStat("yl_task_record");
      } catch (error) {
        console.log(error);
      }
      let sysType = systemType();
      if (sysType === 0) {
        this.$router.push({
          path: "/deliveryGoodsRecord",
          query: { active: 0 }
        });
      } else {
        const url = `${Const.APP_URL}/deliveryGoodsRecord?active=0`;
        openNewWindow({ url });
      }
    },
    // 发货
    goDeliveryGoods() {
      try {
        MtaH5.clickStat("yl_go_delivery_goods");
      } catch (error) {
        console.log(error);
      }
      let sysType = systemType();
      if (sysType === 0) {
        this.$router.push({ path: "/deliveryGoods" });
      } else {
        const url = `${Const.APP_URL}/deliveryGoods`;
        openNewWindow({ url });
      }
    },
    // 我的运力
    goMytransCap() {
      try {
        MtaH5.clickStat("yl_roadtranscapacity_detail");
      } catch (error) {
        console.log(error);
      }
      let sysType = systemType();
      if (sysType === 0) {
        this.$router.push({ path: "/mytransCap" });
      } else {
        const url = `${Const.APP_URL}/mytransCap`;
        openNewWindow({ url });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.road_trans_tapacity {
  min-height: 100vh;
  background: url("../../assets/imgs/roadTransCapacity/bg_img@2x.png") no-repeat
    center center;
  background-size: cover;
  .icondingwei {
    font-size: 13px;
    color: #ebb421;
  }
  .location {
    width: 10px;
    height: 13px;
    vertical-align: middle;
  }
  .yellow {
    color: #ebb421;
  }
  .container {
    padding: 12px;
    padding-top: 46px;
    color: #fff;
    .useinfo {
      padding: 12px 0;
      display: flex;
      justify-content: flex-start;
      .avatar {
        border-radius: 2px;
        width: 50px;
        height: 50px;
        overflow: hidden;
        margin-right: 10px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .name {
          font-size: 17px;
        }
        .positon {
          font-size: 14px;
        }
      }
    }
    .tag {
      display: flex;
      justify-content: space-between;

      .item {
        width: 48%;
        height: 75px;
        position: relative;
        background-image: url("../../assets/imgs/roadTransCapacity/dianji_img@2x.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .icon {
          width: 34px;
          height: 34px;
          img {
            height: 100%;
            width: 100%;
          }
        }
        .text {
          font-size: 16px;
        }
        .text_1 {
          color: #1acfdb;
          .details {
            font-size: 12px;
            color: #ffba00;
          }
          .label {
            position: relative;
            .info {
              position: absolute;
              top: 0;
              right: 0;
              box-sizing: border-box;
              height: 14px;
              line-height: 14px;
              min-width: 14px;
              color: #fff;
              font-size: 10px;
              text-align: center;
              background-color: #ee0a24;
              border-radius: 8px;
              transform: translate(50%, -50%);
              transform-origin: 100%;
            }
          }
        }
        .text_2 {
          .number {
            color: #ebb421;
          }
        }
      }
      .item1_0 {
        &:active {
          background-image: url("../../assets/imgs/roadTransCapacity/dianjihover_img@2x.png");
        }
      }
      .mytrans {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        overflow: hidden;
        @keyframes changeImg {
          from {
            left: -100%;
          }
          to {
            left: 75%;
          }
        }
        .shan {
          position: absolute;
          animation: changeImg 1.5s ease 0s;
          top: 0;
          width: 50%;
          height: 100%;
          content: "";
          background: linear-gradient(
            to right,
            rgba(0, 234, 247, 0) 0,
            rgba(0, 234, 247, 0.2) 50%,
            rgba(0, 234, 247, 0) 100%
          );
          transform: skewX(-45deg);
          animation-iteration-count: infinite;
        }
      }
      .mytrans_1 {
        width: 90%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        overflow: hidden;
        @keyframes changeImg_bottom {
          from {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }
        .shan_bottom {
          position: absolute;
          animation: changeImg_bottom 2s ease 0s;
          bottom: 1px;
          width: 40%;
          height: 2px;
          content: "";
          // background: rgb(55, 200, 230);
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(64, 230, 254, 0.97) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          animation-iteration-count: infinite;
        }
      }
    }
    .statistics {
      margin-top: 12px;
      margin-bottom: 12px;
      width: 100%;
      height: 50px;
      background: rgba(2, 51, 187, 0.1);
      border: 1px solid rgba(21, 73, 154, 1);
      border-radius: 2px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-align: center;
      .item {
        flex: 1;
        vertical-align: bottom;
        font-size: 12px;
        .number {
          font-size: 18px;
        }
        .iconxiaoche {
          font-size: 13px;
          vertical-align: middle;
        }
      }
      .line_1 {
        // width: 1px;
        height: 30px;
        border-right: 1px dashed #fff;
      }
      .line_2 {
        width: 1px;
        height: 30px;
        background: linear-gradient(
          0deg,
          rgba(255, 255, 255, 0) 0%,
          rgba(64, 230, 254, 0.97) 50%,
          rgba(255, 255, 255, 0) 100%
        );
      }
    }
    .echarts {
      position: relative;
      .time_box {
        position: absolute;
        width: 100%;
        top: 10px;
        .time {
          text-align: center;
          color: #96b1ff;
          font-size: 12px;
        }
      }
    }
    .btn_box {
      margin-top: 10px;
      position: relative;
      .btn {
        width: 106px;
        height: 39px;
        margin: 0 auto;
        line-height: 39px;
        text-align: center;
        background: url("../../assets/imgs/roadTransCapacity/anniu_img@2x.png")
          no-repeat center center;
        background-size: cover;
        font-size: 13px;
        color: #011043;
      }
      .reset_btn {
        width: 40px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background: rgba(235, 180, 33, 0.5);
        border-radius: 50%;
        font-size: 15px;
        color: rgba(255, 255, 255, 1);
        position: absolute;
        top: 0;
        right: 0;
        &:active {
          background: rgba(235, 180, 33, 1);
        }
      }
    }
  }
}
</style>
<style lang="less">
.van-nav-bar__left,
.van-nav-bar__right {
  color: #fff;
  font-size: 15px;
}
.tooltip_box {
  width: 89px;
  height: 86px;
  padding: 14px 7px;
  box-sizing: border-box;
  background: url("../../assets/imgs/roadTransCapacity/biankuang_img@2x.png")
    no-repeat center center;
  background-size: cover;
  .item {
    padding: 3px 0;
    display: flex;
    align-items: center;
    font-size: 15px;
    line-height: 1;
    color: #fff;
    .img {
      width: 13px;
      height: 15px;
      margin-right: 4px;
    }
    .provinceName {
      color: #e3b027;
    }
    .number {
      color: #eb4057;
    }
  }
}
</style>
