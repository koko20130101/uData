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

    /**
     * 平台数据统计
     * */
    platformTotal:'assets/data/main-1.json',  //平台总数据
    platformTrend:'assets/data/platforms-line-1.json',  //平台折线图数据
    platformsCompare:'assets/data/platforms-compare-1.json',  //平台指数排行

    enemyPlatformsCompare:'assets/data/platforms-compare-2.json',  //竞品平台指数排行
    enemyBar:'assets/data/platforms-bar-1.json',  //竞品平台指数排行

    regularCompare:'assets/data/platforms-compare-5.json',  //传统理财和基金渠道收益对比
    regularTrend:'assets/data/platforms-line-3.json',  //传统理财利率趋势
    fundTrend:'assets/data/fund-rate-1.json',  //基金年化收益率趋势

    /**
     * C2B 资产运营统计
     * */
    saleTotal:'assets/data/main-3.json',  //引入额和销售额总数
    saleChannelIn:'assets/data/channel-data-1.json',  //引入渠道分布
    saleChannelOut:'assets/data/channel-data-1.json',  //销售渠道分布

};