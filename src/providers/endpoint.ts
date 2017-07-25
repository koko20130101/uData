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
    saleChannelInOut:'assets/data/channel-data-1.json',  //引入和销售渠道分布
    assetsInOut:'assets/data/assets-in.json',  //引入额和销售额趋势折线图
    assetsMain:'assets/data/asset-main.json',  //资产运营总额
    profitData:'assets/data/profit-data.json',  //资产总额对比
    assetsHealthy:'assets/data/assets-healthy.json',  //资产健康值
    grossMargin:'assets/data/gross-margin-data.json',  //毛利率折线图

    /**
     * 网金旗下平台
     * */
    bankList:'assets/data/bank-list.json',  //网金银行列表
    bankTotal:'assets/data/main-2.json',  //银行总数据
    bankMoney:'assets/data/bank-money.json',  //平台交易额折线图
    bankChannel:'assets/data/channel-data.json',  //渠道占比
    bankTrendRate:'assets/data/project-rate.json', //项目走势 > 收益率走势
    bankTrendTerm:'assets/data/project-term.json', //项目走势 > 期限走势
    bankTrendDeal:'assets/data/project-deal.json', //项目走势 > 发布规模走势
    bankTotalSec:'assets/data/main-2-sec.json',  //二级市场交易总额
    bankRateTrendSec:'assets/data/sec-rate.json',  //二级市场收益率趋势
    bankAssetsType:'assets/data/assets-type.json',  //银行资产类型

    /**
     * 灵犀
     * */
    lingXiTotal:'assets/data/main-2-lx.json', // 灵犀数据总额
    lingXiTrendDeal:'assets/data/lingXi-deal.json', // 成交数据折线图
    lingXiTrendRate:'assets/data/lingXi-rate.json', // 收益率折线图
    lingXiChannel:'assets/data/channel-lx.json', // 渠道占比
};