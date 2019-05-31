// angli/choose/choose.js
const common = require('../../Common.js')
const util = require('../../utils/util.js')
const app = getApp()
let page = 1
let size = 20
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rule: false,
    all: false,
    count: 0,
    money: 0,
    zheMoney: 0,
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
    myCourList: app.globalData.comboList
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(app.globalData)
    this.GetCorPRule()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // page = app.globalData.comboPage
    // this.setData({
    //   myCourList: app.globalData.comboList
    // })
    page = 1
    this.getDatas()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log("more")
    //this.getMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: common.data.TitleName,
      path: 'Kecheng/Home/Home'
    }
  },
  showRule() {
    this.setData({
      rule: true
    })
  },
  hideRule() {
    this.setData({
      rule: false
    })
  },
  jiesuan() {
    let myCourList = this.data.myCourList
    let arr = []
    for (let i = 0; i < myCourList.length; i++) {
      if (myCourList[i].choose) {
        arr.push(myCourList[i])
      }
    }
    app.globalData.comboPayList = arr
    if (this.data.count <= 0) {
      util.showModal('提示', '请选择需要购买的课程')
      return
    }
    wx.navigateTo({
      url: `../tcOuder/tcOuder?money=${this.data.money}&zheMoney=${this.data.zheMoney}`,
    })
  },
  itemChoose(e) {
    let index = e.target.dataset.index
    let myCourList = this.data.myCourList
    let count = 0
    util.request(
      common.config.PutMyCorPSelInfo,
      "POST", {
        openId: wx.getStorageSync('openid'),
        cpId: myCourList[index].CpId,
        opType: myCourList[index].choose ? 2 : 1 //操作类型（1 新增  2 删除）
      },
      (res) => {
        if (res.data.res) {
          myCourList[index].choose = !myCourList[index].choose
          for (let i = 0; i < myCourList.length; i++) {
            if (myCourList[i].choose) {
              count++
            }
          }
          this.setData({
            myCourList,
            count,
            money: res.data.data.oriPrice,
            zheMoney: res.data.data.disPrice
          })
          if (count == myCourList.length) {
            this.setData({
              all: true
            })
          } else {
            this.setData({
              all: false
            })
          }
        }
      },
      (err) => {

      },
      (res) => {

      }
    )
    /*
    let index = e.target.dataset.index
    let arr = this.data.myCourList
    arr[index].choose = !arr[index].choose
    let count = 0
    for(let i = 0;i<arr.length;i++){
      if (arr[i].choose){
        count++
      }
    }
    this.setData({ myCourList: arr,count })
    if (count == arr.length) {
      this.setData({ all: true })
    }else{
      this.setData({ all: false })
    }
    this.cal()
    this.setChoose()
    */

  },
  //全选
  allChoose() {
    let all = !this.data.all
    let arr = []
    let myCourList = this.data.myCourList
    for (let i = 0; i < myCourList.length; i++) {
      arr.push(myCourList[i].CpId)
    }
    util.request(
      common.config.PutMyCorSelInfos,
      "POST", {
        openId: wx.getStorageSync('openid'),
        cpIds: arr,
        opType: all ? 1 : 2
      },
      (res) => {
        console.log('全选', res)
        if (res.data.res) {
          for (let i = 0; i < myCourList.length; i++) {
            myCourList[i].choose = all
          }
          this.setData({
            myCourList,
            all,
            count: all ? arr.length : 0,
            money: res.data.data.oriPrice,
            zheMoney: res.data.data.disPrice,
          })
        }
      },
      (err) => {
        util.showModal('提示', '网络异常')
      },
      (res) => {

      }
    )
    /*
    let all = !this.data.all
    let arr = this.data.myCourList
    for (let i = 0; i < arr.length; i++) {
      arr[i].choose = all
    }
    this.setData({
      all,
      count: all ? arr.length : 0,
      myCourList:arr
    })
    this.cal()
    this.setChoose()
    */
  },
  
  //获取套餐班课程
  getMore() {
    //util.showLoading('努力加载ing...')
    util.request(
      common.config.GetCorPInfos,
      "POST", {
        page,
        size,
      },
      (res) => {
        console.log("套餐班课程", res)
        if (res.data.res) {
          let myCourList = this.data.myCourList
          let datas = res.data.data.CorInfos
          for (let i = 0; i < datas.length; i++) {
            datas[i].CpPrice = datas[i].CpPrice.toFixed(2)
            if (datas[i].CpTitle.length > 20) {
              datas[i].CpTitle = datas[i].CpTitle.substr(0, 18) + "..."
            }
          }
          for (let i = 0; i < myCourList.length; i++) {
            for (let j = 0; j < datas.length; j++)
              if (myCourList[i].CpId == datas[j].CpId) {
                datas.splice(j,1)
              }
          }
          if(datas.length == 0){
            this.setData({all:true})
          }
          myCourList = myCourList.concat(datas)
          this.setData({
            myCourList
          })
          page++
        }
      },
      (err) => {
        util.showModal('提示', '网络异常')
      },
      (res) => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
      }
    )
  },
  //获取已选择课程
  getDatas() {
    util.showLoading('努力加载ing...')
    util.request(
      common.config.GetMySelCorInfos,
      "POST", {
        openId: wx.getStorageSync('openid')
      },
      (res) => {
        console.log("获取已选择课程", res)
        if (res.data.res) {
          let count = 0
          let arr = this.data.myCourList
          let myCourList = res.data.data.cpInfos
          for (let i = 0; i < myCourList.length; i++) {
            myCourList[i].CpPrice = myCourList[i].CpPrice.toFixed(2)
            if (myCourList[i].CpTitle.length > 20){
              myCourList[i].CpTitle = myCourList[i].CpTitle.substr(0,18) +"..."
            }
            myCourList[i].choose = true
          }
          this.setData({
            myCourList,
            count: myCourList.length,
            money: res.data.data.oriPrice,
            zheMoney: res.data.data.disPrice,
            all:true
          })
          // if (count == myCourList.length) {
          //   this.setData({
          //     all: true
          //   })
          // } else {
          //   this.setData({
          //     all: false
          //   })
          // }
          // this.setData({
          //   myCourList: res.data.data.cpInfos
          // })

          // this.allChoose()
        }
        if (res.data.errCode == 1106) //未选择
        {

        }
      },
      (err) => {
        util.showModal('提示', '网络异常')
      },
      (res) => {
        wx.hideLoading()

        //this.getMore()
      }
    )
  },
  //获取规则
  GetCorPRule() {
    util.request(
      common.config.GetCorPRule,
      "POST", {
      },
      (res) => {
        console.log('GetCorPRule', res)
        if (res.data.res) {
          this.setData({
            rules: res.data.data.CprInfo.CprRule,
            CprUseIntro: res.data.data.CprInfo.CprUseIntro,
            CprRuleByMonth: res.data.data.CprInfo.CprRuleByMonth
          })
        }
      },
      (err) => {
        util.showModal('提示', '网络异常')
      },
      (res) => {
        //wx.hideLoading()
      }
    )
  },

  cal() {
    let arr = this.data.myCourList
    let count = 0
    let money = 0
    let zheMoney
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].choose) {
        count++
        money = (arr[i].CpPrice * 1 + money * 1).toFixed(2)
      }
    }
    zheMoney = (money * 0.9).toFixed(2)
    this.setData({
      money,
      zheMoney
    })
  },
  getChoose() {
    let chooseList = wx.getStorageSync('chooseList')
    let arr = this.data.myCourList
    if (chooseList) {
      chooseList = JSON.parse(chooseList)
      console.log('getChoose', chooseList)
      let count = 0
      for (let i = 0; i < chooseList.length; i++) {
        for (let j = 0; j < arr.length; j++) {
          if (chooseList[i].Id == arr[j].Id) {
            arr[j].choose = true
            count++
          }
        }
      }
      this.setData({
        myCourList: arr,
        count
      })
      if (count == arr.length) {
        this.setData({
          all: true
        })
      } else {
        this.setData({
          all: false
        })
      }
      this.cal()
    }
  },
  setChoose() {
    let arr = this.data.myCourList
    let chooseList = []
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].choose) {
        chooseList.push(arr[i])
      }
    }
    console.log('setChoose', chooseList)
    wx.setStorageSync('chooseList', JSON.stringify(chooseList))
  },
})