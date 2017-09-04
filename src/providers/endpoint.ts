// export const HOST = 'https://example.com/api/v1/';
export const HOST = 'http://172.17.2.95:8080/';
// export const HOST = 'http://localhost:8100/';
// export const HOST = 'http://172.17.20.31:8080/';
// export const HOST = 'http://192.168.0.102:8100';
// export const HOST_1 = 'https://reportcenterapi.ucsmy.com/View/Web/';

//接口
export const Endpoint = {
    smsCode: HOST+'assets/data/sms.json',     //获取短信
    login: HOST+'assets/data/login.json',   //登录
    logout:HOST+'assets/data/logout.json',    //登出
    checkLogin:HOST+'assets/data/check-login.json',  //检查登录
    userPower:HOST+'assets/data/user.json',  //用户权限
    dateList:HOST+'assets/data/date-list.json',  //日期列表
    tutorial:HOST+'assets/data/tutorial.json',  //启动页广告
    homeData:HOST+'assets/data/main.json',  //首页总额

    /**
     * 平台数据统计
     * */
    platformTotal:HOST+'assets/data/main-1.json',  //平台总数据
    platformTrend:HOST+'assets/data/platforms-line-1.json',  //平台折线图数据
    platformsCompare:HOST+'assets/data/platforms-compare-1.json',  //平台指数排行

    enemyPlatformsCompare:HOST+'assets/data/platforms-compare-2.json',  //竞品平台指数排行
    enemyBar:HOST+'assets/data/platforms-bar-1.json',  //竞品平台指数排行

    regularCompare:HOST+'assets/data/platforms-compare-5.json',  //传统理财和基金渠道收益对比
    regularTrend:HOST+'assets/data/platforms-line-3.json',  //传统理财利率趋势
    fundTrend:HOST+'assets/data/fund-rate-1.json',  //基金年化收益率趋势

    /**
     * C2B 资产运营统计
     * */
    saleTotal:HOST+'assets/data/main-3.json',  //引入额和销售额总数
    saleChannelInOut:HOST+'assets/data/channel-data-1.json',  //引入和销售渠道分布
    assetsInOut:HOST+'assets/data/assets-in.json',  //引入额和销售额趋势折线图
    assetsMain:HOST+'assets/data/asset-main.json',  //资产运营总额
    profitData:HOST+'assets/data/profit-data.json',  //资产总额对比
    assetsHealthy:HOST+'assets/data/assets-healthy.json',  //资产健康值
    grossMargin:HOST+'assets/data/gross-margin-data.json',  //毛利率折线图

    /**
     * 网金旗下平台
     * */
    bankList:HOST+'assets/data/bank-list.json',  //网金银行列表
    bankTotal:HOST+'assets/data/main-2.json',  //银行总数据
    bankMoney:HOST+'assets/data/bank-money.json',  //平台交易额折线图
    bankChannel:HOST+'assets/data/channel-data.json',  //渠道占比
    bankTrendRate:HOST+'assets/data/project-rate.json', //项目走势 > 收益率走势
    bankTrendTerm:HOST+'assets/data/project-term.json', //项目走势 > 期限走势
    bankTrendDeal:HOST+'assets/data/project-deal.json', //项目走势 > 发布规模走势
    bankTotalSec:HOST+'assets/data/main-2-sec.json',  //二级市场交易总额
    bankRateTrendSec:HOST+'assets/data/sec-rate.json',  //二级市场收益率趋势
    bankAssetsType:HOST+'assets/data/assets-type.json',  //银行资产类型

    /**
     * 灵犀
     * */
    lingXiTotal:HOST+'assets/data/main-2-lx.json', // 灵犀数据总额
    lingXiTrendDeal:HOST+'assets/data/lingXi-deal.json', // 成交数据折线图
    lingXiTrendRate:HOST+'assets/data/lingXi-rate.json', // 收益率折线图
    lingXiChannel:HOST+'assets/data/channel-lx.json', // 渠道占比

    /**
     * 埋点
     * */
    recordOperationLog:'',
};