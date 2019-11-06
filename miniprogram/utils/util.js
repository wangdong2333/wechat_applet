let requestData = (url) => {
  return new Promise((resolve) => {
    wx.request({
      url: url,
      success: resolve
    });
  });
}

let setStorage = (key, data) => {
  wx.setStorage({
    key,
    data
  })
}

let deleWrap = (str) => {
  let reg = /<br \/\>/g;
  let str1 = str.replace(reg, "");
  return str1;
}

let dealQuery = (obj) => {
  return Object.keys(obj).map((item) => {
    return item + "=" + obj[item]
  }).join("&");
}

function formatterDateTime() {
  var date = new Date()
  var month = date.getMonth() + 1
  var datetime = date.getFullYear() +
    "" // "年"
    +
    (month >= 10 ? month : "0" + month) +
    "" // "月"
    +
    (date.getDate() < 10 ? "0" + date.getDate() : date
      .getDate()) +
    "" +
    (date.getHours() < 10 ? "0" + date.getHours() : date
      .getHours()) +
    "" +
    (date.getMinutes() < 10 ? "0" + date.getMinutes() : date
      .getMinutes()) +
    "" +
    (date.getSeconds() < 10 ? "0" + date.getSeconds() : date
      .getSeconds());
  return datetime;
}

let getOpenId = () => {
  return new Promise((resolve) => {
    wx.cloud.callFunction({
      name: "getUserData",
      success: resolve
    })
  });
}

let deleWrap1 = (str)=> {
  let reg =/<br \/\>/g;
  return str.replace(reg, "");
}
export default {
  requestData,
  setStorage,
  deleWrap,
  dealQuery,
  formatterDateTime,
  getOpenId,
  deleWrap1
}