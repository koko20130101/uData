// export const HOST = 'https://example.com/api/v1/';
// export const HOST = 'http://172.17.2.73:8100';
export const HOST = 'http://localhost:8100';
// export const HOST = 'http://172.17.20.31:8080/';
// export const HOST = 'http://192.168.0.102:8100';

//接口
export const Endpoint = {
    getImgCode: 'captcha',     //获取图形验证码
    getSmsCode: 'getVerifyCode',     //获取短信
    login: 'assets/data/user.json',   //登录
    signOut:'user/signOut',          //登出
    checkLogin:'assets/data/check-login.json',  //检查登录及版本信息
    dateList:'assets/data/date-list.json',  //日期列表
    homeData:'assets/data/main.json',  //日期列表

    platformTotal:'assets/data/main-1.json',  //平台总数据
    platformTrend:'assets/data/platforms-line-1.json',  //平台折线图数据
    platformsCompare:'assets/data/platforms-compare-1.json',  //平台指数排行

    enemyPlatformsCompare:'assets/data/platforms-compare-2.json',  //竞品平台指数排行
    enemyBar:'assets/data/platforms-bar-1.json',  //竞品平台指数排行

};