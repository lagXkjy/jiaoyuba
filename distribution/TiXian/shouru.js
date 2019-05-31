// pages/shouru/shouru.js
var common = require('../../Common.js')
const util = require('../../utils/util.js')
var LIST = []
var page = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    hidden:true,
    rmb: common.config.ImgPath+'rmb.png',
  },
  onReachBottom: function () {

  },
  fanye: function () {
    var that = this;
    that.setData({
      hidden: false,
    })
    var openid = wx.getStorageSync("openid");
    wx.request({
      url: common.config.YongJingMinXi,
      method:'post',
      data:{
        openid: openid
      },
      success:function(res){
        console.log(res)
        var list=res.data.list
        if (list.length>0){
          for (var i = 0; i < list.length; i++) { 
            if (list[i].Remark.length > 25)
            {
              list[i].Remark = list[i].Remark.substr(0, 24) + '...';
            }
            list[i].CreateOn = common.timeStamp2String(list[i].CreateOn)
          }
        }
       
      that.setData({
          list:list
        })
      },
      fail:function(res){
        common.modalTap('网络错误')
      },
      complete:function(){
        that.setData({
          hidden: true,
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fanye()
    this.GetMyDisSaleInfo()
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
    page = 0;
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    page=0;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  tixian(){
    let that = this;
    let yongjin = this.data.yongjin;
    if(yongjin<1){
      util.showModal('提示','最低提现金额为1元');
      return
    }
    wx.showModal({
      title: '提现',
      content: `您的提现金额为￥${yongjin}`,
      confirmText:'确认',
      success(res){
        console.log(res)
        if(res.confirm){
          console.log("确认了")
          util.request(
            common.config.DisCorPutForward,
            "POST",
            {
              openId:wx.getStorageSync('openid'),
              money: yongjin,
            },
            (res)=>{
              console.log(res);
              if(res.data.res){
                that.setData({
                  yongjin: res.data.data.surplus
                })
                util.showModal('提示', '提现成功');
              }else{
                if (res.data.data.errMsg){
                  util.showModal('提示', res.data.data.errMsg)
                }
              }
            },
            (err)=>{
              util.showModal('提示','网络异常')
            },
            (res)=>{

            }
          )
        }
      }
    })
  },
  GetMyDisSaleInfo() {
    util.request(
      common.config.GetMyDisSaleInfo,
      "POST",
      {
        openId: wx.getStorageSync('openid')
      },
      (res) => {
        console.log(res)
        if (res.data.result) {
          let data = res.data.data;
          this.setData({
            yongjin: data.yongjin.toFixed(2),
          })
        }
      },
      (err) => {
        util.showModal('提示', '网络异常');
      },
      (res) => {

      }
    )
  },
})