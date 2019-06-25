// export const HOST = 'https://example.com/api/v1/';
// export const HOST = 'http://172.17.2.31:8080/';
// export const HOST = 'http://172.17.20.31:8080/';
// export const HOST = 'http://172.17.9.80:8080/';
// export const HOST = 'http://localhost:8100/';
// export const HOST = 'http://172.17.20.31:8080/';
// export const HOST = 'http://192.168.0.103:8080/assets/data/';
// export const HOST = 'http://172.20.10.3:8080/assets/data/';
export const HOST = 'http://www.scbbsc.com/uData/data/';
// export const HOST_1 = 'https://reportcenterapi.ucsmy.com/View/Web/';

export const Extension = '.json';    //接口后缀

//接口
export const Endpoint = {
    smsCode: HOST + 'sms' + Extension,     //获取短信
    login: HOST + 'login' + Extension,   //登录
    logout: HOST + 'logout' + Extension,    //登出
    checkLogin: HOST + 'check-login' + Extension,  //检查登录
    // checkLogin:HOST+'checkLogin',  //检查登录
    userPower: HOST + 'user' + Extension,  //用户权限
    dateList: HOST + 'date-list' + Extension,  //日期列表
    tutorial: HOST + 'tutorial' + Extension,  //启动页广告
    homeData: HOST + 'main' + Extension,  //首页总额

    /**
     * 平台数据统计
     * */
    platformTotal: HOST + 'main-1' + Extension,  //平台总数据
    platformTrend: HOST + 'platforms-line-1' + Extension,  //平台折线图数据
    platformsCompare: HOST + 'platforms-compare-1' + Extension,  //平台指数排行

    enemyPlatformsCompare: HOST + 'platforms-compare-2' + Extension,  //竞品平台指数排行
    enemyBar: HOST + 'platforms-bar-1' + Extension,  //竞品平台指数排行

    regularCompare: HOST + 'platforms-compare-5' + Extension,  //传统理财和基金渠道收益对比
    regularTrend: HOST + 'platforms-line-3' + Extension,  //传统理财利率趋势
    fundTrend: HOST + 'fund-rate-1' + Extension,  //基金年化收益率趋势

    /**
     * C2B 资产运营统计
     * */
    saleTotal: HOST + 'main-3' + Extension,  //引入额和销售额总数
    saleChannelInOut: HOST + 'channel-data-1' + Extension,  //引入和销售渠道分布
    assetsInOut: HOST + 'assets-in' + Extension,  //引入额和销售额趋势折线图
    assetsMain: HOST + 'asset-main' + Extension,  //资产运营总额
    profitData: HOST + 'profit-data' + Extension,  //资产总额对比
    assetsHealthy: HOST + 'assets-healthy' + Extension,  //资产健康值
    grossMargin: HOST + 'gross-margin-data' + Extension,  //毛利率折线图

    /**
     * 网金旗下平台
     * */
    bankList: HOST + 'bank-list' + Extension,  //网金银行列表
    bankTotal: HOST + 'main-2' + Extension,  //银行总数据
    bankMoney: HOST + 'bank-money' + Extension,  //平台交易额折线图
    bankChannel: HOST + 'channel-data' + Extension,  //渠道占比
    bankTrendRate: HOST + 'project-rate' + Extension, //项目走势 > 收益率走势
    bankTrendTerm: HOST + 'project-term' + Extension, //项目走势 > 期限走势
    bankTrendDeal: HOST + 'project-deal' + Extension, //项目走势 > 发布规模走势
    bankTotalSec: HOST + 'main-2-sec' + Extension,  //二级市场交易总额
    bankRateTrendSec: HOST + 'sec-rate' + Extension,  //二级市场收益率趋势
    bankAssetsType: HOST + 'assets-type' + Extension,  //银行资产类型

    /**
     * 灵犀
     * */
    lingXiTotal: HOST + 'main-2-lx' + Extension, // 灵犀数据总额
    lingXiTrendDeal: HOST + 'lingXi-deal' + Extension, // 成交数据折线图
    lingXiTrendRate: HOST + 'lingXi-rate' + Extension, // 收益率折线图
    lingXiChannel: HOST + 'channel-lx' + Extension, // 渠道占比

    /**
     * 埋点
     * */
    recordOperationLog: '',
};