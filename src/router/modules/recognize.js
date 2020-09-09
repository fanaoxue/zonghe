export default [
  {
    path: "/Recognize",
    name: "Recognize",
    component: () => import("@/components/recognize/Recognize"),
    meta: {
      title: "证件识别"
    }
  },
  {
    path: "/mauIndex",
    name: "mauIndex",
    component: () => import("@/components/recognize/mauIndex"),
    meta: {
      title: "证件识别"
    }
  },
  {
    path: "/discernSuccess",
    name: "discernSuccess",
    component: () => import("@/components/recognize/discernSuccess"),
    meta: {
      title: "证件识别"
    }
  },
  {
    path: "/RecognizeInfo",
    name: "RecognizeInfo",
    component: () => import("@/components/recognize/RecognizeInfo"),
    meta: {
      title: "证件识别",
      keepAlive: true
    }
  }
];
