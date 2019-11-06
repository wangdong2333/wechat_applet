const cloud = require('wx-server-sdk');

cloud.init({
  env: 'test-o4xhh'
})

exports.main = (event, context,cb) => {
  // 这里获取到的 openId、 appId 是可
  const { OPENID } = cloud.getWXContext()

  return {
    OPENID
  }

}