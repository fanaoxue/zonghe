import server from './server.js'
let $http = server.Axios
export function getQuestion (conditon) { // 获取会话问题
  return new Promise((resolve, reject) => {
    $http({
      sid: '23000',
      iResType: 1,
      datas: {
        utterance: conditon.utterance,
        sessionId: conditon.sessionId
      },
      timeout: 60000
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

export function gotoCheck (conditon) { // 根据问题ID进行会话
  return new Promise((resolve, reject) => {
    $http({
      sid: '23001',
      iResType: 1,
      datas: {
        knowledgeId: conditon.knowledgeId,
        sessionId: conditon.sessionId
      },
      timeout: 60000
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

export function firstQuestion () { // 第一次会话请求
  return new Promise((resolve, reject) => {
    $http({
      sid: '23002',
      iResType: 1,
      datas: {
        utterance: 'wtyt.log56'
      },
      timeout: 60000
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}
