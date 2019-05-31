const util = require('utils/util.js')
var data = {
  // TitleName: "易招吧"
  TitleName: "教育吧"
  /*
   * ！！！
   * 上传前需确认项：
   * 1. Common.js中的TitleName、host
   * 2. app.json 中 navigationBarTitleText
   * 3. utils文件夹下的config.js中的host
   * ！！！
   */
}
var QQMapWX = require('libs/qqmap-wx-jssdk.js');
var demo = new QQMapWX({
  key: '4WABZ-V2ARX-NLS45-T5Q7T-CETWK-KMB7C' // 必填
});
var host = "jiaoyuba.1-zhao.cn"; //教育吧教育吧
// var host = "test.1-zhao.com";//易招吧
var hot = "localhost:5894";
var config = {

  //下面的地址配合云端 Server 工作
  host,
  //资质证明中图片路径
  LogoPath: `https://${host}/LogoFile/`,
  //课程图片路径
  CoursePath: `https://${host}/CourseImg/`,
  //经销商二维码
  disQRFile: `https://${host}/disQRFile/`,
  //图片路径
  ImgPath: `https://${host}/HtmlImgs/`,
  StaticPath: `https://${host}/HtmlImgs/`,
  IconImg: `https://${host}/BannerIcons/`,
  //课程二维码图片路径
  CodePath: `https://${host}/QRFile/`,
  //首页banner路径
  BannersImg: `https://${host}/BannersImg/`,
  //砍价课程海报路径
  GroupImgFile: `https://${host}/GroupImgFile/`,
  //答题课程题目路径
  AnswerQuesImg: `https://${host}/AnswerQuesImg/`,
  //课程卡路径
  CourseCard: `https://${host}/CourseCard/`,
  //首页红包banner
  RedBannerPath: `https://${host}/RedBanner/`,
  //红包活动背景
  RedBackgroundPath: `https://${host}/RedBackground/`,
  //机构logo图片
  AgeLogoPicPath: `https://${host}/LogoFile/`,

  //获取用户Openid +
  GetOrSetOpenid: `https://${host}/ltp/UserInfo/GetUserOpenId`,
  //分页获取课程列表 +
  HomeCourseListOfPage: `https://${host}/Course/HomeCourseListOfPage`,
  //根据ID获取发布的课程 -
  GetUpdateCourse: `https://${host}/Course/GetCourse`,
  //根据课程ID获取课程信息以及可拼团的信息 -
  GetCourseAndGrop: `https://${host}/Course/GetCourseAndGrop`,
  //根据团购Id获取团购信息   -
  GetGropuBookingOfId: `https://${host}/GroupBooking/GetGropuBookingOfId`,
  //根据openId获取团购信息   -
  GetGropuBookingOfOpenId: `https://${host}/GroupBooking/GetGropuBookingOfOpenId`,
  //拼团成功后跳转等待页面获取信息   -
  GetGropuBookingOfOpenIdAndKid: `https://${host}/GroupBooking/GetGropuBookingOfOpenIdAndKid`,
  //根据openid获取我所报名的所有课程    +
  GetMyIndexCoursesNew: `https://${host}/GroupBooking/GetMyIndexCourses`,
  //获取“我”中的红包、优惠券、分销员信息  +
  GetMyIndexInfo: `https://${host}/GroupBooking/GetMyIndexInfo`,
  //根据openid获取用户最后一个报名的课程Id   -
  GetGroupIdOfOpenId: `https://${host}/GroupBooking/GetGroupIdOfOpenId`,
  //根据openid获取之前拼团填写的姓名和电话   -
  GetNameAndPhoneOfOpenId: `https://${host}/GroupBooking/GetNameAndPhoneOfOpenId`,
  //下拉刷新砍价     -
  GetGidOfCidAndOpenId: `https://${host}/GroupBooking/GetGidOfCidAndOpenId`,
  //添加砍价   -
  InsertKanGroupBooking: `https://${host}/GroupBooking/InsertKanGroupBooking`,
  //根据砍价ID获取详细   -
  GetKanGropAndCourse: `https://${host}/GroupBooking/GetKanGropAndCourse`,
  //好友点击进入帮忙砍价   -
  KanGropOfGid: `https://${host}/GroupBooking/KanGropOfGid`,
  //根据课程ID获取详细和猜你喜欢    +
  GetKanGropOfCourseId: `https://${host}/GroupBooking/GetKanGropOfCourseId`,
  //答题后添加订单   -
  InsertGroupAnswer: `https://${host}/GroupBooking/InsertGroupAnswer`,
  //答题后领取课程   -
  LingOrderCard: `https://${host}/GroupBooking/LingOrderCard`,
  //根据红包Id获取红包信息   -
  GetRedBannerOfRid: `https://${host}/RedEnvelope/GetRedBannerOfRid`,
  //添加拆分红包   -
  InsertEnvelopeSplits: `https://${host}/RedEnvelope/InsertEnvelopeSplits`,
  //好友拆分红包    +
  InsertEnvelopeSplitsUsers: `https://${host}/RedEnvelope/InsertEnvelopeSplitsUsers`,
  //根据红包拆分Id获取红包及拆分信息   -
  GetRedBannerOfEsid: `https://${host}/RedEnvelope/GetRedBannerOfEsid`,
  //获取商户的可用红包课程    +
  GetRedCourseList: `https://${host}/RedEnvelope/GetRedCourseList`,
  //获取我的红包列表    +
  GetMyRedPockets: `https://${host}/RedEnvelope/GetMyRedPockets`,
  //添加优惠券助力订单   -
  InsertCouponsSplits: `https://${host}/Coupons/InsertCouponsSplits`,
  //根据id csid获取优惠券及助力订单信息  -
  GetCouponsBannerOfCid: `https://${host}/Coupons/GetCouponsBannerOfCid`,
  //好友助力    +
  InsertCoupSplitsUsers: `https://${host}/Coupons/InsertEnvelopeSplitsUsers`,
  //我的优惠券列表   -
  GetMyCoupList: `https://${host}/Coupons/GetMyRedList`,
  //优惠课程列表    +
  GetCouponsCourseList: `https://${host}/Coupons/GetCouponsCourseList`,
  //领取优惠券   -
  LinCouponsSplits: `https://${host}/Coupons/LinCouponsSplits`,
  //微信支付
  //+
  pay: `https://${host}/Pay/SavePay`,
  //+
  pinpay: `https://${host}/Pay/SavePingPay`,
  //删除订单（取消支付或其他）-
  DeleteGroupOfgidOrcidAndopenid: `https://${host}/GroupBooking/DeleteGroupOfgidOrcidAndopenid`,
  //消息推送    +
  SendTempletMessge: `https://${host}/TS/SendTempletMessge`,
  //拼团成功模版消息推送    +
  TsGroupBooking: `https://${host}/GroupBooking/TsGroupBooking`,
  // 添加经销商申请   +
  ApplyJingXiaoShang: `https://${host}/Distributors/InsertDistributors`,
  // 申请提交状态  -
  ApplyStyle: `https://${host}/Distributors/GetDistributorsOfOpenid`,
  // 佣金明细   -
  YongJingMinXi: `https://${host}/Distributors/GetDistributorsRecordList`,
  // 营收金额明细  -
  YinShouJinE: `https://${host}/Distributors/GetDistributorsOrderList`,
  // 浏览次数商品  -
  LiuLanCiShu: `https://${host}/Distributors/InsertBrowsingRecord`,
  // 购买人数   -
  GouMaiRen: `https://${host}/Distributors/GetDistributorsOrderUsersCount`,
  // 浏览人数查看   +
  GetBrowsingRecordListNew: `https://${host}/Distributors/GetBrowsingRecordListNew`,
  // 营收订单详情    -
  revenuelist: `https://${host}/Distributors/GetDistributorsOrderOfId`,
  //编辑   -
  editAll: `https://${host}/Distributors/GetDistributorsCourseOfId`,
  // 保存  -
  editpreservation: `https://${host}/Distributors/UpdateDistributorsCouresPrice`,
  //获取首页Tag    +
  GetToolModule: `https://${host}/AdminsTools/GetToolModule`,
  //获取首页滑动导航    +
  GetNewToolModules: `https://${host}/AdminsTools/GetToolModulesNew`,
  //获取首页推荐课程信息  +
  GetRecomCourseList: `https://${host}/AdminsTools/GetRecomCourseList`,
  //根据首页Tag获取课程  -
  GetCourseOfTools: `https://${host}/AdminsTools/GetCourseOfToolsNew`,
  //新版Tab获取红包或优惠券活动   +
  GetHuoDong: `https://${host}/AdminsTools/GetHuoDong`,
  //根据商户号已经课程类型获取课程红包活动    +
  GetCurrOfMchId: `https://${host}/Course/GetCurrOfMchId`,
  //添加分享人记录或浏览首页记录    +
  InsertColonelOpenIdShare: `https://${host}/Course/InsertColonelOpenIdShare`,
  // 根据校区ID获取校区信息  -
  GetCpInfo: `https://${host}/ltp/ClaArea/GetCpInfo`,
  //根据课程ID获取该课程所属的所有校区信息     -
  GetClaAreaInfos: `https://${host}/ltp/ClaArea/GetClaAreaInfos`,
  //根据校区ID获取校区信息与该校区可上课程信息 -
  GetCorInfos: `https://${host}/ltp/ClaArea/GetCorInfos`,
  //获取我的优惠券信息  -
  GetCpInfos: `https://${host}/ltp/CouponNew/GetCpInfos`,
  //获取校区    +
  GetCampInfos: `https://${host}/ltp/ClaArea/GetCampInfos`,
  //获取某商户的所有课程包课程信息  +
  GetCorPInfos: `https://${host}/ltp/CorPackage/GetCorPInfos`,
  //获取课程包使用规则  +
  GetCorPRule: `https://${host}/ltp/CorPackage/GetCorPRule`,
  //获取课程包已选择的课程数量  +
  GetAlChosenCor: `https://${host}/ltp/CorPackage/GetAlChosenCor`,
  //获取课程包课程详细信息  +
  GetCorPInfo: `https://${host}/ltp/CorPackage/GetCorPInfo`,
  // 用户新增或者删除已选择的课程包课程   +
  PutMyCorPSelInfo: `https://${host}/ltp/CorPackage/PutMyCorPSelInfo`,
  // 全选    +
  PutMyCorSelInfos: `https://${host}/ltp/CorPackage/PutMyCorSelInfos`,
  // 获取已选择课程信息   +
  GetMySelCorInfos: `https://${host}/ltp/CorPackage/GetMySelCorInfos`,
  // 课程包课程提交订单   +
  PlaceAnOrder: `https://${host}/ltp/CorPackage/PlaceAnOrder`,
  // 课程包课程取消支付或支付失败  -
  PlaceAnOrderFailed: `https://${host}/ltp/CorPackage/PlaceAnOrderFailed`,
  // 课程包课程在线支付成功 +
  PayMentSuccess: `https://${host}/ltp/CorPackage/PayMentSuccess`,
  // 套餐班查看订单     +
  GetCpOdrInfo: `https://${host}/ltp/CorPackage/GetCpOdrInfo`,
  // 修改头像和昵称   -
  PutAvaUrlNick: `https://${host}/ltp/UserInfo/PutAvaUrlNick`,
  // 获取我的分销课程信息   + 
  GetMyDisCorInfos: `https://${host}/Distributors/GetMyDisCorInfos`,
  // 获取我的佣金、营业额、购买人数和浏览人次   -
  GetMyDisSaleInfo: `https://${host}/Distributors/GetMyDisSaleInfo`,
  //分销员提现接口  +
  DisCorPutForward: `https://${host}/Distributors/DisCorPutForward`,
  //根据搜索内容查询机构信息.新
  GetAgenInfos: `https://${host}/ltp/Agency/GetAgenInfos`,
  //根据机构ID获取机构信息
  GetAgenInfo: `https://${host}/ltp/Agency/GetAgenInfo`,
  //根据机构账号获取机构发布课程信息
  GetCorInfoByAge: `https://${host}/ltp/CourseInfo/GetCorInfoByAge`,
  //根据机构ID获取机构信息与机构申请状态
  GetAgencyApplyStatus: `https://${host}/ltp/Agency/GetAgencyApplyStatus`,
  //机构入驻平台申请
  ApplyAgency: `https://${host}/ltp/Agency/ApplyAgency`,
  //课程浏览次数增加
  UpdateCorBrowTimes: `https://${host}/ltp/CourseInfo/UpdateCorBrowTimes`,
  //获取该课程所属校区信息
  GetCorCpInfos: `https://${host}/ltp/ClaArea/GetCpInfos`,
};

//貌似已经无用的接口
//根据用户openid获取用户信息
//GetUserOfId: `https://${host}/Users/GetUserOfId`,
//获取首页课程列表
//GetHomeCourseList:`https://${host}/Course/CourseList`,
//获取我所发布的课程
//GetMyCourse: `https://${host}/Course/GetMyCourse`,
//上传资质或Logo
//SaveLicenseLogo: `https://${host}/Users/SaveLicenseLogo`,
//提交资质证明
//SaveCertification: `https://${host}/Users/SaveCertification`,
//修改资质证明
//UpdateCertification: `https://${host}/Users/UpdateCertification`,
//查询用户是否已提交资质并且是否审核
//GetUserCertificationType: `https://${host}/Users/GetUserCertificationType`,
//根据openid获取资质model
//GetCertificationModel: `https://${host}/Users/GetCertificationModel`,
//用资质的id获取资质
//GetCertificationOfId: `https://${host}/Users/GetCertificationOfId`,
//根据openid查询资质证明电话
//GetCertification: `https://${host}/Users/GetCertification`,
//添加课程图片
//SaveCourseImage: `https://${host}/Course/SaveCourseImage`,
//上传课程
//SaveCourse: `https://${host}/Course/SaveCourse`,
//根据ID删除发布的课程
//DeleteCourse: `https://${host}/Course/DeleteCourse`,
//修改发布的课程
//UpdateCourse: `https://${host}/Course/UpdateCourse`,
//将课程发布等待审核
//FabuCourse: `https://${host}/Course/UpdateCourseStatus`,
//生成并返回二维码
//SaveQRImg: `https://${host}/QR/SaveInitQrCode`,
//根据课程id查询所有拼团
//GetGropuBookingListOfCid: `https://${host}/GroupBooking/GetGropuBookingListOfCid`,
//根据openid获取我的收入明细
//GetRevenueList: `https://${host}/TiXian/GetRevenueList`,
//根据openid获取剩余可提现的金额
//GetOutPrice: `https://${host}/TiXian/GetOutPrice`,
//添加提现信息
//InsertReven: `https://${host}/TiXian/InsertReven`,
//查询首页banner图
//GetHomeBanners: `https://${host}/Banners/GetHomeBanners`,
//获取小程序商户信息
//GetAdminmodel: `https://${host}/Home/GetAdminmodel`,
//根据商户号获取首页红包banner活动
//GetRedBanner: `https://${host}/RedEnvelope/GetRedBanner`,
//获取我的红包列表
//GetMyRedList: `https://${host}/RedEnvelope/GetMyRedList`,
// 浏览人数查看
//LIUChaKan: `https://${host}/Distributors/GetBrowsingRecordList`,

function addCorBrowTimes(corId) {
  wx.request({
    url: config.UpdateCorBrowTimes,
    method: 'POST',
    data: {
      corId: corId
    },
    header: {
      'content-type': 'application/json'
    },
    success: function(res) {
      if (res.data.res) {
        console.log('课程浏览次数更新成功！corId：' + corId);
      } else {
        console.log('课程浏览次数更新失败！corId：' + corId);
      }
    },
    fail: function() {
      console.log('课程浏览次数更新请求失败！corId：' + corId);
    }
  });
}

function modalTap(data) { //弹出提示框
  wx.showModal({
    title: "提示信息",
    content: data,
    showCancel: false,
    confirmText: "确定"
  });
}

function loading(data, msg) {
  wx.showToast({
    title: msg,
    icon: "loading",
    duration: data
  })
}

function DoSuccess(data) {
  wx.showToast({
    title: data,
    icon: "success",
    duration: 2000
  })
}

function IsOpenId() {
  var openid = wx.getStorageSync("openid");
  if (openid == "" || openid == null) {
    GetOpenId();
  }
}
const GetOpenId = function(cb, ty) {
  cb = typeof cb === 'function' ? cb : function cb() {}
  wx.login({
    complete(res) {
      if (res.code) {
        util.request(
          config.GetOrSetOpenid,
          "POST", {
            code: res.code
          },
          (res) => {
            console.log("GETOPENID", res)
            if (res.data.res) {
              wx.setStorageSync('openid', res.data.data.openId);
              if (ty == 1) {
                dingwei(cb);
              } else {
                dingwei();
                cb();
              }
            }
          },
          (err) => {
            console.log(err)
          },
          (res) => {},
        )
      }
    }
  })
}

function Getnameandhead() {
  wx.login({
    success: function(res) {
      if (res.code) {
        wx.getUserInfo({
          success: function(res) {
            var s = JSON.parse(res.rawData);
            wx.setStorageSync("nickName", s.nickName); //昵称
            wx.setStorageSync("avatarUrl", s.avatarUrl); //头像
          }
        })
      }
    }
  });
}

function timeStamp2String(time) {
  var data = time;
  var datetime = new Date(parseInt(data.replace("/Date(", "").replace(")/", ""), 10));
  var year = datetime.getFullYear();
  var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
  var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
  var hour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
  var minute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
  var second = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
  return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
}

function timeStamp2StringNian(time) {
  var data = time;
  var datetime = new Date(parseInt(data.replace("/Date(", "").replace(")/", ""), 10));
  var year = datetime.getFullYear();
  var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
  var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
  return year + "年" + month + "月" + date + "日";
}

function timeStamp2StringNian2(time) {
  var data = time;
  var datetime = new Date(parseInt(data.replace("/Date(", "").replace(")/", ""), 10));
  var year = datetime.getFullYear();
  var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
  var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
  return year + "-" + month + "-" + date;
}

function dizhi(address) {
  demo.geocoder({
    address: address,
    success: function(res) {
      var d = res.result.location;
      var w = d.lat;
      var j = d.lng;
      wx.openLocation({
        latitude: w,
        longitude: j,
        name: address
      })
    },
    fail: function(res) {
      modalTap(res.message);
    },
    complete: function(res) {
      console.log(res);
    }
  });
}

function dingwei(callback = () => {}) {
  var lgtlat = {};
  wx.getLocation({
    type: 'wgs84',
    success: function(res) {
      lgtlat.lgt = res.longitude;
      lgtlat.lat = res.latitude;
      wx.setStorageSync('lgtlat', lgtlat);
      callback();
      //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
      demo.reverseGeocoder({
        location: {
          latitude: res.latitude,
          longitude: res.longitude
        },
        success: function(addressRes) {
          var sheng = addressRes.result.address_component.province;
          var shi = addressRes.result.address_component.city;
          var address = addressRes.result.address;
          wx.setStorageSync("province", sheng); //省缓存
          wx.setStorageSync("city", shi); //市缓存
          wx.setStorageSync("address", address); //地址缓存
        }
      })
    },
    fail:function(){
      lgtlat.lgt = -256;
      lgtlat.lat = -256;
      wx.setStorageSync('lgtlat', lgtlat);
      callback();
    }
  });
}


function Tui(types, gid, ctype) {
  wx.request({
    url: config.SendTempletMessge,
    data: {
      type: types,
      openid: openid,
      formid: wx.getStorageSync("formId"),
      id: gid,
      ctype: ctype
    },
    method: 'GET',
    header: {
      'content-type': 'application/json'
    },
    success: function(res) {}
  });
}

function GetNumberTime() {
  var now = new Date();
  var year = now.getFullYear() + ""; //年  
  var month = now.getMonth() + 1 + ""; //月  
  var day = now.getDate() + ""; //日  
  var hh = now.getHours() + ""; //时  
  var mm = now.getMinutes() + ""; //分  
  var ss = now.getSeconds() + ""; //秒  
  return year + month + day + hh + mm + ss;
}

module.exports.config = config
module.exports.data = data
exports.IsOpenId = IsOpenId
exports.GetOpenId = GetOpenId
exports.modalTap = modalTap
exports.DoSuccess = DoSuccess
exports.timeStamp2String = timeStamp2String
exports.timeStamp2StringNian = timeStamp2StringNian
exports.timeStamp2StringNian2 = timeStamp2StringNian2
exports.Getnameandhead = Getnameandhead
exports.loading = loading
exports.dizhi = dizhi
exports.Tui = Tui
exports.dingwei = dingwei
exports.GetNumberTime = GetNumberTime
exports.demo = demo
exports.dingwei = dingwei
exports.addCorBrowTimes = addCorBrowTimes