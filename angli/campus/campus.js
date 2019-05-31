// angli/campus/campus.js
const common = require('../../Common.js')
const util = require('../../utils/util.js')
let page = 1,size = 20;
let campusId;
let value = ''
Page({
  /**
   * 页面的初始数据
   */
  data: {
    html: common.config.StaticPath + "logo_bu_03.png",
    pingimg: common.config.StaticPath + "pingtuan_03.png",
    kanimg: common.config.StaticPath + "KanJia_03.png",
    yiimg: common.config.StaticPath + "YiYuan.png",
    dati: common.config.StaticPath + "DaTi.png",
    jiantou: common.config.StaticPath + "jiantou-red_06.png",
    hongbao: common.config.StaticPath + "RedBao_03.png",
    youhui: common.config.StaticPath + "YouHui_03.png",
    youimg: common.config.StaticPath + "hui_3_03.png",
    shiting: common.config.StaticPath + "shit_03.png",
    taocan: common.config.StaticPath + "taocan_03.png",
    jiantou: common.config.StaticPath + "jiantou-red_06.png",
    CoursePath: common.config.CoursePath,
    myCourList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = 1
    campusId = options.campusId;
    let cName = options.cName;
    let cPhone = options.cPhone;
    let cAddress = options.cAddress;
    let dis = options.dis;
    this.setData({
      campusId,
      cName,
      cPhone,
      cAddress,
      dis:dis
    })
    util.showLoading('努力加载ing...')
    this.getDatas(campusId,"")
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let campusId = this.data.campusId
    this.getDatas(campusId,"")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getDatas(campusId, value)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: common.data.TitleName,
      path: 'Kecheng/Home/Home'
    }
  },
  searchCourses(e){
    console.log(e)
    let val = e.detail.value
    if(val == value){return}
    page = 1
    value = val
    this.setData({ myCourList : [] })
    this.getDatas(campusId,val)
  },
  getDatas(campusId,val){
    //util.showLoading('努力加载ing...')
    util.request(
      common.config.GetCorInfos,
      "POST",
      {
        corName:val,
        cpId:campusId,
        page,
        size,
      },
      (res)=>{
        console.log(res)
        if(res.data.res){
          let myCourList = res.data.data.corInfos
          for (let i = 0; i < myCourList.length;i++){
            myCourList[i].RetailPrice = myCourList[i].RetailPrice.toFixed(2)
            myCourList[i].GroupPrice = myCourList[i].GroupPrice.toFixed(2)
            if (myCourList[i].Title.length > 20){
              myCourList[i].Title = myCourList[i].Title.substr(0,20) + '...'
            }
          }
          this.setData({
            myCourList
          })
        }
      },
      (err) => {
        console.log(err)
      },
      (res) => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
      },
    )
  },
  xiangxi(e){
    var Id = e.currentTarget.dataset.pid;
    var gid = e.currentTarget.dataset.gid;
    var types = e.currentTarget.dataset.type;
    var scount = e.currentTarget.dataset.scount;
    var openid = wx.getStorageSync('openid');
    var name = wx.getStorageSync('nickName');
    if (types == "1") //拼团
    {
      wx.navigateTo({
        url: '../../Kecheng/Detail/Detail?id=' + Id + "&yu=0&copenid=0"
      });
    }
    if (types == "4") //砍价
    {
      wx.navigateTo({
        url: '../../Kecheng/Onebargaining/Onebargaining?cid=' + Id + "&yu=0&copenid=0"
      });
    }
    if (types == "5")//一元
    {
      var oid = "0";
      if (e.currentTarget.dataset.oid != undefined) {
        oid = e.currentTarget.dataset.oid;
      }
      var sheng = e.currentTarget.dataset.sheng;
      if (sheng != "0") {
        wx.navigateTo({
          url: '../../Kecheng/YiYuan/YiYuan?id=' + Id + "&yu=0&copenid=0&oid=" + oid
        });
      }
    }
    if (types == "6")//答题
    {
      var otype = e.currentTarget.dataset.otype;
      var oid = e.currentTarget.dataset.oid;
      var sheng = e.currentTarget.dataset.sheng;
      if (sheng != "0") {
        if (otype == "2") {
          var title = e.currentTarget.dataset.title
          wx.navigateTo({
            url: '../../newpage/succeed/succeed?oid=' + oid + "&cid=" + Id + "&title=" + title
          });
        }
        if (otype == "3") {
          wx.navigateTo({
            url: '../../newpage/answer/answer?id=' + Id,
          });
        }
        else if (otype == undefined) {
          wx.navigateTo({
            url: '../../newpage/customer/customer?id=' + Id
          });
        }
      }
    }
    if (types == '10')//优惠
    {
      wx.navigateTo({
        url: '../../Kecheng/YouHui/YouHui?id=' + Id + "&yu=0&copenid=0" 
      });
    }
    if (types == "11")//试听
    {
      var oid = "0";
      if (e.currentTarget.dataset.oid != undefined) {
        oid = e.currentTarget.dataset.oid;
      }
      var sheng = e.currentTarget.dataset.sheng;
      if (sheng != "0") {
        wx.navigateTo({
          url: '../../Kecheng/ShiTing/ShiTing?id=' + Id + "&yu=0&copenid=0&oid=" + oid
        });
      }
    }
    if (types == '13')//套餐
    {
      wx.navigateTo({
        url: '../tcDetail/tcDetail?id=' + Id + "&yu=0&copenid=0"
      });
    }
    if (types == '9')//分销课程
    {
      wx.navigateTo({
        url: '../../distribution/Detail/Detail?id=' + Id + "&yu=0&copenid=0" + "lid="+Id
      });
    }
  }
})