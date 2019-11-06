const cloud = require('wx-server-sdk');

cloud.init({
  env: 'test-o4xhh'
})

exports.main = (event, context,cb) => {
  const { OPENID } = cloud.getWXContext()

  return {
    OPENID
  }

}