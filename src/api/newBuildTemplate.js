import server from './server.js'
let $http = server.Axios
export function newBuildTemplate (condition) { // 新增模板
  return new Promise((resolve, reject) => {
    $http({
      sid: '3050',
      iResType: 1,
      datas: condition,
      timeout: 60000
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

export function modTemplate (condition) { // 修改模板
  return new Promise((resolve, reject) => {
    $http({
      sid: '3051',
      iResType: 1,
      datas: condition,
      timeout: 60000
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

export function templateDetail (condition) { // 根据模板ID查询模板信息
  return new Promise((resolve, reject) => {
    $http({
      sid: '3056',
      iResType: 1,
      datas: condition,
      timeout: 60000
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}
