export default [
    {
      path: "/GoodsInfo",
      name: "GoodsInfo",
      component: () => import("@/components/bigCompre/GoodsInfo"),
      meta: {
        title: "货物信息",
        keepAlive: true
      }
    },
    {
      path: "/LineList",
      name: "LineList",
      component: () => import("@/components/bigCompre/LineList"),
      meta: {
        title: "线路列表"
      }
    },
    {
      path: "/LineInfo",
      name: "LineInfo",
      component: () => import("@/components/bigCompre/LineInfo"),
      meta: {
        title: "线路信息",
        keepAlive: true
      }
    },
    {
      path: "/OtherInfo",
      name: "OtherInfo",
      component: () => import("@/components/bigCompre/OtherInfo"),
      meta: {
        title: "其他信息",
        keepAlive: true
      }
    },
    {
      path: "/ModifyLine",
      name: "ModifyLine",
      component: () => import("@/components/bigCompre/ModifyLine"),
      meta: {
        title: "修改线路",
        keepAlive: true
      }
    },
    {path: "/LineDetail",
      name: "LineDetail",
      component: () => import("@/components/bigCompre/LineDetail"),
      meta: {
        title: "查看线路"
      }
    },
  ]
  