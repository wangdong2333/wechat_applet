const menuAppkey = "d84a730b819430e5a41c09989fbcda66";
// 首页的热门分类接口
// 参数列表： appkey
const menuUrl ="https://way.jd.com/jisuapi/recipe_class?";

// 首页每日推荐的列表的url接口
//参数列表： classid  start  num  appkey
const recommendListUrl ="https://way.jd.com/jisuapi/byclass?";

// 每日推荐的详情的url接口
// 参数列表： id appkey 
const menuDetailUrl ="https://way.jd.com/jisuapi/detail?";

// 首页的关键字搜索url接口
// 参数： keyword  num  appkey
const searchUrl = "https://way.jd.com/jisuapi/search?";

// 科普数据接口的appid
const showapi_appid ="92922";

// 科普数据的签名密钥
const showapi_sign ="dffb8bfdbad944f8b421891019cf6c19";

// 科普的列表数据的接口
// https://wxapi.hotapp.cn/proxy/?appkey=hotapp669046474&url=http://www.wxapp-union.com/
// 参数列表： showapi_timestamp(时间戳)  showapi_appid  showapi_sign  tid（分类id）
const scienceListUrl ="https://wxapi.hotapp.cn/proxy/?appkey=hotapp669046474&url=http://route.showapi.com/90-87";

// 科普详情数据的接口
// 参数列表： showapi_timestamp(时间戳)  showapi_appid  showapi_sign  id (文章详情id)
const scienceDetailUrl ="https://wxapi.hotapp.cn/proxy/?appkey=hotapp669046474&url=http://route.showapi.com/90-88";



export default{
  menuUrl,
  recommendListUrl,
  menuAppkey,
  menuDetailUrl,
  scienceListUrl,
  showapi_appid,
  showapi_sign,
  searchUrl
}