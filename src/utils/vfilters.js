import Vue from "vue";
const formatCarCount = carCount => {
  if (Vue.$utils.isNotEmpty(carCount) && carCount > 1000) {
    return "1000+";
  } else {
    return carCount;
  }
};
const formatOrgName = orgName => {
  if (
    Vue.$utils.isNotEmpty(orgName) &&
    orgName.length > 12 &&
    document.documentElement.clientWidth === 320
  ) {
    return (
      orgName.substring(0, 7) +
      "..." +
      orgName.substring(orgName.length - 4, orgName.length)
    );
  } else if (
    Vue.$utils.isNotEmpty(orgName) &&
    orgName.length > 17 &&
    document.documentElement.clientWidth > 320 &&
    document.documentElement.clientWidth <= 375
  ) {
    return (
      orgName.substring(0, 11) +
      "..." +
      orgName.substring(orgName.length - 4, orgName.length)
    );
  } else if (
    Vue.$utils.isNotEmpty(orgName) &&
    orgName.length > 17 &&
    document.documentElement.clientWidth > 375 &&
    document.documentElement.clientWidth <= 414
  ) {
    return (
      orgName.substring(0, 13) +
      "..." +
      orgName.substring(orgName.length - 4, orgName.length)
    );
  } else {
    return orgName;
  }
};
const formatDriverName = name => {
  if (Vue.$utils.isNotEmpty(name) && name.length >= 1) {
    return name.substring(0, 1) + "师傅";
  } else {
    return name;
  }
};
const formatName20 = name => {
  if (Vue.$utils.isNotEmpty(name) && name.length >= 20) {
    return name.substring(0, 20)+ "....";
  } else {
    return name;
  }
};
// 4位一空格（格式化银行卡0000 0000 0000 0000 000）
const formatBank = val => {
  if (val) {
    return val
      .toString()
      .replace(/\s/g, '')
      .replace(/(.{4})/g, '$1 ')
  }
}
export function switchReward(item) {
  let type 
  switch (item) {
    case 0:
      type = '27'
      break;
    case 1:
      type = '31'
      break;
    case 2:
      type = '29'
      break;
    case 3:
      type = '30'
      break;
    case 4:
      type = '32'
      break;
    default:
      break;
  }
  return type
}

/**
 * @description 时间格式化，默认：Y-m-d
 * @export timestamp 时间戳（毫秒级）
 * @export formats 时间格式
 *  1. Y-m-d
 * 2. Y-m-d H:i:s
 * 3. Y年m月d日
 * 4. Y年m月d日 H时i分
 * 5. Y-m
 * 6. Y年m月
 * @returns 返回指定时间格式
 */
function formatDate(timestamp, formats) {
  formats = formats || 'Y-m-d'
  let zero = function (value) {
    if (value < 10) {
      return '0' + value
    }
    return value
  }
  let myDate = timestamp ? new Date(timestamp) : new Date()
  let year = myDate.getFullYear()
  let month = zero(myDate.getMonth() + 1)
  let day = zero(myDate.getDate())
  let hour = zero(myDate.getHours())
  let minite = zero(myDate.getMinutes())
  let second = zero(myDate.getSeconds())

  return formats.replace(/Y|m|d|H|i|s/gi, function (matches) {
    return {
      Y: year,
      m: month,
      d: day,
      H: hour,
      i: minite,
      s: second
    }[matches]
  })
}


function formatUnitType(item) {
  // 0-吨
  // 1-方
  // 2-件
  // 3-车
  let type = "";
  switch (item) {
    case "0":
      type = "吨";
      break;
    case "1":
      type = "方";
      break;
    case "2":
      type = "件";
      break;
    case "3":
      type = "车";
      break;
    default:
      type = "";
      break;
  }
  return type;
}

function formatYesOrNo(str, type) {
  if (type) {
    return !!+ str ? type[1] : type[0]
  }
  return !!+ str ? '是':'否'
}

export default {
  formatCarCount,
  formatOrgName,
  formatDriverName,
  formatName20,
  formatBank,
  formatDate,
  formatUnitType,
  formatYesOrNo
}
