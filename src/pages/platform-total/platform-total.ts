import {Component, ElementRef, ViewChild} from '@angular/core';
import {Slides, NavController, Refresher} from 'ionic-angular';

import {Endpoint} from '../../providers/endpoint';
import {CacheField} from '../../providers/cache-field';
import {GlobalVars} from '../../providers/services/global.service';
import {PlatformService} from '../../providers/services/platform.service';

import {PublicFactory} from '../../providers/factory/public.factory';
import {PopupFactory} from '../../providers/factory/popup.factory';
import * as chartOptions from '../../providers/chart-options'

@Component({
    selector: 'platform-page',
    templateUrl: 'platform-total.html',
    providers: [PlatformService]
})
export class PlatformTotalPage {
    @ViewChild('MainSlides') mainSlides: Slides;
    @ViewChild('MoneyLineChart') moneyLineChart: ElementRef;
    pageName = 'PlatformTotalPage';
    platformType = "1";
    dataType = "2";     //各平台指数排行
    enemyDataType = "2";     //竞品平台指数排行
    modelContent: any[] = [1, 1, 1, 1];  //list内容展开收起状态
    dateInstance: any;
    //总额
    totalData: any = {
        totalUCS: ['--', ''],
        totalEnemy: ['--', ''],
    };
    //折线图数据
    trendData: any;
    //柱状图数据
    enemyBarData: any;
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
    regularTrendData: any;
    //基金折线图
    fundTrendData: any;
    chartOption: any;
    chartInstance:any;
    chartData:any;

    constructor(public navCtrl: NavController,
                public publicFactory: PublicFactory,
                public popupFactory: PopupFactory,
                public platformService: PlatformService,
                public globalVars: GlobalVars) {
    }

    ngOnInit() {
        this.dateInstance = this.globalVars.getInstance();
        this.chartOption = chartOptions.BarChartOptions1();
        this.chartData = chartOptions.BarChartDataset1;
    }

    ngAfterViewInit() {
        //订阅选择单位传过来的信息
        this.publicFactory.unitInfo.subscribe((data) => {
            console.log(data.page);
            if (data.page == this.pageName) {
                this.getPlatformSegment();
            }
        });
        // let canvas = eCharts.init(this.moneyLineChart.nativeElement);

    }

    ionViewWillEnter() {
        this.getDataFromCache(Endpoint.platformTotal, CacheField.platformTotal);
        this.getDataFromCache(Endpoint.platformTrend, CacheField.platformTrend);
        this.getDataFromCache(Endpoint.platformsCompare, CacheField.platformsCompare);
    }

    ionViewDidEnter() {
    }

    ionViewWillLeave() {
        //取消选择单位订阅
        this.publicFactory.unitInfo.observers.pop();
    }

    onChartInit(ec) {
        this.chartInstance = ec;
        console.log(this.chartInstance);
    }

    changeDataSet(){
        this.chartData = chartOptions.BarChartDataset2;
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
        this.platformService.loadValue(endpoint, cacheKey, sendData).subscribe(data => {
            let res: any = data;
            if (res._body.code == 1) {
                switch (cacheKey) {
                    case CacheField.platformTotal:
                        this.totalData = res._body.data;
                        break;
                    case CacheField.platformsCompare:
                        Object.assign(this.platformsCompareData, res._body.data);
                        break;
                    case CacheField.platformTrend:
                        this.trendData = res._body.data;
                        break;
                    case CacheField.enemyPlatformsCompare:
                        Object.assign(this.enemyPlatformsCompareData, res._body.data);
                        break;
                    case CacheField.regularCompare:
                        Object.assign(this.regularCompareData, res._body.data);
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
            }
        })
    }

    /**
     * 从本地存储中获取数据
     * getDataFromCache(接口,本地存储key,资源类型标识)
     * */
    getDataFromCache(endpoint, cacheKey, source?: any) {
        let _sendData: any = null;
        let _totalData: any = this.platformService.getValue(cacheKey);
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
                if (!!_totalData && !!_totalData[this.dataType]) {
                    this.platformsCompareData = _totalData;
                    return;
                } else {
                    _sendData = {dataType: parseInt(this.dataType)};
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
                if (!!_totalData && !!_totalData[this.enemyDataType]) {
                    this.enemyPlatformsCompareData = _totalData;
                    return;
                } else {
                    _sendData = {dataType: parseInt(this.enemyDataType)};
                    break;
                }
            //竞品柱状图
            case CacheField.enemyBar:
                if (!!_totalData) {
                    this.enemyBarData = _totalData;
                    return;
                } else {
                    _sendData = null;
                    break;
                }
            //传统理财和基金渠道收益对比
            case CacheField.regularCompare:
                if (!!_totalData && !!_totalData[source]) {
                    this.regularCompareData = _totalData;
                    return;
                } else if (source == 1) {
                    _sendData = {dataType: 1, sourceType: 1};
                    break;
                } else if (source == 2) {
                    _sendData = {dataType: 1, sourceType: 2};
                    break;
                }
            //传统理财额折线图
            case CacheField.regularTrend:
                if (!!_totalData) {
                    this.regularTrendData = _totalData;
                    return;
                } else {
                    _sendData = null;
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
            var loader = this.popupFactory.loading();
            loader.present().then(()=> {
                this.loadData(endpoint, cacheKey, null, loader, _sendData);
            });
            return;
        }
        this.globalVars.loaders.push(1);
        this.loadData(endpoint, cacheKey, null, loader, _sendData);
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
                    this.loadData(Endpoint.platformsCompare, CacheField.platformsCompare, refresher, null, {dataType: parseInt(this.dataType)});
                    break;
                //竞品
                case 2:
                    //总额
                    this.loadData(Endpoint.platformTotal, CacheField.platformTotal, refresher);
                    this.loadData(Endpoint.enemyPlatformsCompare, CacheField.enemyPlatformsCompare, refresher, null, {dataType: parseInt(this.enemyDataType)});
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

        }, 500);
    }

    getPlatformSegment() {
        let num = Number(this.platformType);
        this.mainSlides.slideTo(num - 1);
        switch (num) {
            //网金
            case 1:
                this.getDataFromCache(Endpoint.platformTotal, CacheField.platformTotal);
                this.getDataFromCache(Endpoint.platformTrend, CacheField.platformTrend);
                this.getDataFromCache(Endpoint.platformsCompare, CacheField.platformsCompare);
                break;
            //竞品
            case 2:
                this.getDataFromCache(Endpoint.platformTotal, CacheField.platformTotal);
                this.getDataFromCache(Endpoint.enemyPlatformsCompare, CacheField.enemyPlatformsCompare);
                this.getDataFromCache(Endpoint.enemyBar, CacheField.enemyBar);
                break;
            //传统理财
            case 3:
                this.getDataFromCache(Endpoint.regularCompare, CacheField.regularCompare, 1);
                this.getDataFromCache(Endpoint.regularCompare, CacheField.regularCompare, 2);
                this.getDataFromCache(Endpoint.regularTrend, CacheField.regularTrend);
                this.getDataFromCache(Endpoint.fundTrend, CacheField.fundTrend);
                break;
        }
    }

    ucsPlatformExponent() {
        this.getDataFromCache(Endpoint.platformsCompare, CacheField.platformsCompare);
    }

    enemyPlatformExponent() {
        this.getDataFromCache(Endpoint.enemyPlatformsCompare, CacheField.enemyPlatformsCompare);
    }

    slideChange() {
        let active = this.mainSlides.getActiveIndex();
        let total = this.mainSlides.length();
        if (active == total) return;
        this.platformType = String(active + 1);
    }

}