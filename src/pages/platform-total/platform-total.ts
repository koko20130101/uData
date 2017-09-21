import {Component, ViewChild} from '@angular/core';
import {IonicPage,Slides, NavController, Refresher,App} from 'ionic-angular';

import {Endpoint} from '../../providers/providers';
import {CacheField} from '../../providers/providers';
import {GlobalVars} from '../../providers/services/global.service';
import {PlatformService} from '../../providers/services/platform.service';

import {PublicFactory} from '../../providers/providers';
import {PopupFactory} from '../../providers/providers';
import * as chartOptions from '../../providers/charts-option';

@IonicPage()
@Component({
    selector: 'platform-page',
    templateUrl: 'platform-total.html',
    providers: [PlatformService]
})
export class PlatformTotalPage {
    @ViewChild('MainSlides') mainSlides: Slides;
    pageInfo: any = {
        name: 'PlatformTotalPage',
        id: 2
    };
    loader: any;
    platformType = 1;
    ucsDataType = 2;     //各平台指数排行
    enemyDataType = 2;     //竞品平台指数排行
    rateTime = 0;  //定期理财利率统计
    backCount = 1; //slides 和 segment的数值差
    modelContent: any[] = [1, 1, 1, 1];  //list内容展开收起状态
    dateInstance: any;
    //总额
    totalData: any = {
        totalUCS: ['--', ''],
        totalEnemy: ['--', ''],
    };
    //折线图数据
    trendData: any = {};
    //柱状图数据
    enemyBarData: any = {};
    enemyBarData_1: any = {};
    //平台指数数据
    platformsCompareData: any = {
        1: [],
        2: [],
        3: [],
        4: [],
    };
    //竞口平台指数数据
    enemyPlatformsCompareData: any = {
        1: [],
        2: [],
        3: [],
        4: [],
    };
    //传统理财和基金渠道收益对比
    regularCompareData: any = {
        1: [],
        2: []
    };
    //传统理财折线图
    regularTrendData: any = {};
    //基金折线图
    fundTrendData: any = {};

    lineChartOption_1: any;
    lineChartOption_2: any;
    lineChartOption_3: any;
    barChartOption_1: any;
    barChartOption_2: any;
    barChartWidth: any = 320;
    chartInstance: any;

    unitSubscription:any;

    constructor(public navCtrl: NavController,
                public app:App,
                public publicFactory: PublicFactory,
                public popupFactory: PopupFactory,
                public platformService: PlatformService,
                public globalVars: GlobalVars) {
    }

    ngOnInit() {
        this.dateInstance = this.globalVars.getInstance();
        //判断有无查看网金平台数据权限
        if (this.dateInstance.adminCode['05']) {
            this.platformType = 1;
            this.backCount = 1;
        } else {
            this.platformType = 2;
            this.backCount = 2;
        }

        this.lineChartOption_1 = chartOptions.LineChartOption_1();
        this.lineChartOption_1.tooltip.formatter = function (params) {
            let res = params[0].name;
            for (var i = 0; i < params.length; i++) {
                res += '<br/>' + params[i].seriesName + ' : ' + this.publicFactory.moneyFormat(params[i].data, true);
            }
            return res;
        }.bind(this);

        this.lineChartOption_2 = chartOptions.LineChartOption_3();
        this.lineChartOption_3 = chartOptions.LineChartOption_3({
            color: ['#f45a1e', '#294181']
        });

        this.barChartOption_1 = chartOptions.BarChartOptions_1();
        this.barChartOption_1.tooltip.formatter = function (params) {
            let res = params[0].name;
            for (var i = 0; i < params.length; i++) {
                res += '<br/>' + params[i].seriesName + ' : ' + this.publicFactory.moneyFormat(params[i].data, true);
            }
            return res;
        }.bind(this);

    }

    ngAfterViewInit() {
        //订阅选择单位传过来的信息
        this.unitSubscription = this.publicFactory.unitInfo.subscribe((data) => {
            console.log(data.page);
            if (data.page == this.pageInfo.name) {
                this.slideChange();
            }
        });
    }

    ionViewWillEnter() {
        this.getDataFromCache(Endpoint.platformTotal, CacheField.platformTotal);
    }

    ionViewDidEnter() {
        this.getDataFromCache(Endpoint.platformTrend, CacheField.platformTrend);
        this.getDataFromCache(Endpoint.platformsCompare, CacheField.platformsCompare, this.ucsDataType);
    }

    ionViewWillLeave() {
        //取消选择单位订阅
        this.unitSubscription.unsubscribe();
    }

    onChartInit(ec) {
        this.chartInstance = ec;
    }

    test(){
        console.log(this.app.getActiveNav().canGoBack())
    }

    showContent(value) {
        if (this.modelContent[value]) {
            this.modelContent[value] = 0;
        } else {
            this.modelContent[value] = 1;
        }
    }

    /**
     * 从服务器加载数据
     * loadData(接口,本地存储key,下拉刷新对象,loading对象)
     * */
    loadData(endpoint, cacheKey, refresher?: any, loader?: any, sendData?: any) {
        this.platformService.loadValue(endpoint, cacheKey, sendData)
            .map(res => res.json())
            .subscribe(res => {
                if (res.code == 1) {
                    switch (cacheKey) {
                        case CacheField.platformTotal:
                            this.totalData = res.data;
                            break;
                        case CacheField.platformsCompare:
                            if (!!res.data[this.ucsDataType]) {
                                this.platformsCompareData[this.ucsDataType] = res.data[this.ucsDataType]['list'];
                            } else {
                                this.platformsCompareData[this.ucsDataType] = [];
                            }
                            break;
                        case CacheField.platformTrend:
                            this.trendData = res.data;
                            break;
                        case CacheField.enemyPlatformsCompare:
                            if (!!res.data[this.enemyDataType]) {
                                this.enemyPlatformsCompareData[this.enemyDataType] = res.data[this.enemyDataType]['list'];
                            } else {
                                this.enemyPlatformsCompareData[this.enemyDataType] = [];
                            }
                            break;
                        case CacheField.regularCompare:
                            Object.assign(this.regularCompareData, res.data);
                            break;
                        case CacheField.enemyBar:
                            this.barChartWidth = res.data.yAxis[0].data.length * 50;
                            let _myTimeOut = setTimeout(function () {
                                this.enemyBarData = res.data;
                                clearTimeout(_myTimeOut);
                            }.bind(this), 300);
                            break;
                        case CacheField.regularTrend:
                            this.regularTrendData = res.data[this.rateTime];
                            break;
                        case CacheField.fundTrend:
                            this.fundTrendData = res.data;
                            break;
                        default:
                            break;
                    }
                }

                this.globalVars.loaders.pop();
                if (!!refresher && this.globalVars.loaders.length == 0) {
                    refresher.complete();
                }
                if (!!loader && this.globalVars.loaders.length == 0) {
                    loader.dismiss();
                    this.loader =null;
                }
            }, err => {
                this.globalVars.loaders.pop();
                if (!!refresher && this.globalVars.loaders.length == 0) {
                    refresher.complete();
                }
                if (!!loader && this.globalVars.loaders.length == 0) {
                    loader.dismiss();
                    this.loader = null;
                }
            });
    }

    /**
     * 从本地存储中获取数据
     * getDataFromCache(接口,本地存储key,资源类型标识)
     * */
    getDataFromCache(endpoint, cacheKey, source?: any) {
        let _sendData: any = null;
        this.platformService.getValue(cacheKey, source).then(data=> {
            let _totalData: any = data;
            switch (cacheKey) {
                //总额
                case CacheField.platformTotal:
                    if (!!_totalData) {
                        this.totalData = _totalData;
                        return;
                    } else {
                        _sendData = null;
                        break;
                    }
                //网金平台指数排行
                case CacheField.platformsCompare:
                    if (!!_totalData) {
                        this.platformsCompareData[source] = _totalData;
                        return;
                    } else {
                        _sendData = {dataType: this.ucsDataType};
                        break;
                    }
                //网金成交额折线图
                case CacheField.platformTrend:
                    if (!!_totalData) {
                        this.trendData = _totalData;
                        return;
                    } else {
                        _sendData = null;
                        break;
                    }
                //竞品平台指数排行
                case CacheField.enemyPlatformsCompare:
                    if (!!_totalData) {
                        this.enemyPlatformsCompareData[source] = _totalData;
                        return;
                    } else {
                        _sendData = {dataType: this.enemyDataType};
                        break;
                    }
                //竞品柱状图
                case CacheField.enemyBar:
                    if (!!_totalData) {
                        this.barChartWidth = _totalData.yAxis[0].data.length * 50;
                        console.log(_totalData)
                        let _myTimeOut = setTimeout(function () {
                            this.enemyBarData = _totalData;
                            this.enemyBarData_1 = {
                                yAxis: this.enemyBarData.yAxis
                            };
                            clearTimeout(_myTimeOut);
                        }.bind(this), 300);
                        return;
                    } else {
                        _sendData = null;
                        break;
                    }
                //传统理财和基金渠道收益对比
                case CacheField.regularCompare:
                    if (!!_totalData) {
                        this.regularCompareData[source] = _totalData;
                        return;
                    } else if (source == 1) {
                        _sendData = {dataType: 1, sourceType: 1};
                    } else if (source == 2) {
                        _sendData = {dataType: 1, sourceType: 2};
                    }
                    break;
                //定期理财额折线图
                case CacheField.regularTrend:
                    if (!!_totalData) {
                        this.regularTrendData = _totalData;
                        return;
                    } else {
                        _sendData = {sourceType: 1, time: source};
                        break;
                    }
                //基金折线图
                case CacheField.fundTrend:
                    if (!!_totalData) {
                        this.fundTrendData = _totalData;
                        return;
                    } else {
                        _sendData = null;
                        break;
                    }
                default:
                    break;
            }
            //判断请求个数
            if (this.globalVars.loaders.length == 0) {
                //记录加载对象个数
                this.globalVars.loaders.push(1);
                //如果没取到，则向服务器取
                this.loader = this.popupFactory.loading();
                this.loader.present().then(()=> {
                    this.loadData(endpoint, cacheKey, null, this.loader, _sendData);
                });
                return;
            }
            this.globalVars.loaders.push(1);
            this.loadData(endpoint, cacheKey, null, this.loader, _sendData);
        });
    }

    //下拉刷新
    doRefresh(refresher: Refresher) {
        let num = Number(this.platformType);
        setTimeout(() => {
            //总数据
            switch (num) {
                //网金
                case 1:
                    //总额
                    this.loadData(Endpoint.platformTotal, CacheField.platformTotal, refresher);
                    //折线图数据
                    this.loadData(Endpoint.platformTrend, CacheField.platformTrend, refresher);
                    //平台指数排行数据
                    this.loadData(Endpoint.platformsCompare, CacheField.platformsCompare, refresher, null, {dataType: this.ucsDataType});
                    break;
                //竞品
                case 2:
                    //总额
                    this.loadData(Endpoint.platformTotal, CacheField.platformTotal, refresher);
                    this.loadData(Endpoint.enemyPlatformsCompare, CacheField.enemyPlatformsCompare, refresher, null, {dataType: this.enemyDataType});
                    this.loadData(Endpoint.enemyBar, CacheField.enemyBar, refresher);
                    break;
                //传统理财
                case 3:
                    this.loadData(Endpoint.regularCompare, CacheField.regularCompare, refresher, null, {
                        dataType: 1,
                        sourceType: 1
                    });
                    this.loadData(Endpoint.regularCompare, CacheField.regularCompare, refresher, null, {
                        dataType: 1,
                        sourceType: 2
                    });
                    this.loadData(Endpoint.regularTrend, CacheField.regularTrend, refresher);
                    this.loadData(Endpoint.fundTrend, CacheField.fundTrend, refresher);
                    break;
            }

        }, 300);
    }

    getPlatformSegment() {
        let num = this.platformType;
        this.mainSlides.slideTo(num - this.backCount);
        switch (this.platformType) {
            //网金
            case 1:
                this.modelContent = [1, 0, 0, 0];
                break;
            //竞品
            case 2:
                this.modelContent = [0, 1, 1, 0];
                break;
            //传统理财
            case 3:
                this.modelContent = [0, 0, 1, 1];
                break;
        }
    }

    getRateTimeSegment() {
        let num = this.rateTime;
        switch (num) {
            case 0:
                this.getDataFromCache(Endpoint.regularTrend, CacheField.regularTrend, 0);
                break;
            case 1:
                this.getDataFromCache(Endpoint.regularTrend, CacheField.regularTrend, 1);
                break;
            case 2:
                this.getDataFromCache(Endpoint.regularTrend, CacheField.regularTrend, 2);
                break;
            case 3:
                this.getDataFromCache(Endpoint.regularTrend, CacheField.regularTrend, 3);
                break;
        }
    }


    ucsPlatformExponent() {
        this.getDataFromCache(Endpoint.platformsCompare, CacheField.platformsCompare, this.ucsDataType);
    }

    enemyPlatformExponent() {
        this.getDataFromCache(Endpoint.enemyPlatformsCompare, CacheField.enemyPlatformsCompare, this.enemyDataType);
    }

    slideChange() {
        let active = this.mainSlides.getActiveIndex();
        let total = this.mainSlides.length();
        if (active == total) return;
        this.platformType = active + this.backCount;
        switch (this.platformType) {
            //网金
            case 1:
                this.getDataFromCache(Endpoint.platformTotal, CacheField.platformTotal);
                this.getDataFromCache(Endpoint.platformTrend, CacheField.platformTrend);
                this.getDataFromCache(Endpoint.platformsCompare, CacheField.platformsCompare, this.ucsDataType);
                break;
            //竞品
            case 2:
                //禁止滑动
                this.getDataFromCache(Endpoint.platformTotal, CacheField.platformTotal);
                this.getDataFromCache(Endpoint.enemyPlatformsCompare, CacheField.enemyPlatformsCompare, this.enemyDataType);
                this.getDataFromCache(Endpoint.enemyBar, CacheField.enemyBar);
                break;
            //传统理财
            case 3:
                this.getDataFromCache(Endpoint.regularCompare, CacheField.regularCompare, 1);
                this.getDataFromCache(Endpoint.regularCompare, CacheField.regularCompare, 2);
                this.getDataFromCache(Endpoint.regularTrend, CacheField.regularTrend, 0);
                this.getDataFromCache(Endpoint.fundTrend, CacheField.fundTrend);
                break;
        }
    }

}