// const host = 'https://test.1-zhao.com';//易招吧
const host = 'https://jiaoyuba.1-zhao.cn';//教育吧
module.exports = {
  /**
   * 一元提现
   */
  //获取openid
  GetOpenId: `${host}/ltp/OnePutFwd/GetUserOpenId`,
  //提交用户信息
  SubmitUserInfo: `${host}/ltp/OnePutFwd/PutUserNickAva`,
  //获取拼团信息
  GetPinMsgs: `${host}/ltp/OnePutFwd/GetMyActivity`,
  //给自己创建拼团信息
  CreateActivity: `${host}/ltp/OnePutFwd/InitiatingAtyInfo`,
  //帮助好友拼团
  HelpFriends: `${host}/ltp/OnePutFwd/HelpFriendForOnePutFw`,
  //定时获取已经提现的用户
  GetBilledUsers: `${host}/ltp/OnePutFwd/GetPutFwUsers`,
  //用户提现
  Bill: `${host}/ltp/OnePutFwd/PutForward`,
  // /**
  //  * 课程
  //  */
  // //获取首页课程
  // GetCourses: `${host}/meet/CourseInfo/GetCourse`,
  // //获取课程详细信息
  // GetDetailCourse: `${host}/meet/CourseInfo/GetServiceAreaInfo`,
  // //提交购买课程信息
  // BuyCourse: `${host}/meet/CourseInfo/PostCouInfo`,
  // //确认订单购买课程
  // ConfirmOrder: `${host}/meet/CourseInfo/GetServeInfos`,
  // //查看我的所有订单
  // AllOrders: `${host}/meet/CourseInfo/GetCourseInfoBM`,
  // //查看单个订单
  // OrderDetail: `${host}/meet/CourseInfo/GetCourseInfoXQ`,
  // //zhifu
  // PayMOney: `${host}/meet/OneHomePage/PutZhifu`,
  // //
  // GetPayId: `${host}/meet/CourseInfo/PutZhifu`,
  // //支付成功
  // PaySuccess: `${host}/meet/CourseInfo/PayMentCallBack`,
  // //支付失败
  // PayFail: `${host}/PayFail`,
}