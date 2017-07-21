import {Component, ViewChild} from '@angular/core';
import {Slides, NavController, Refresher} from 'ionic-angular';

import {Endpoint} from '../../providers/endpoint';
import {CacheField} from '../../providers/cache-field';
import {PlatformService} from '../../providers/services/platform.service';
import {GlobalVars} from '../../providers/services/global.service';

import {PublicFactory} from '../../providers/factory/public.factory';
import {PopupFactory} from '../../providers/factory/popup.factory';

@Component({
    selector: 'platform-page',
    templateUrl: 'platform-total.html',
    providers: [PlatformService]
})
export class PlatformTotalPage {
    @ViewChild('MainSlides') mainSlides: Slides;
    pageName = 'PlatformTotalPage';
    platformType = "1";
    dataType = "2";     //各平台指数排行
    enemyDataType = "2";     //竞品平台指数排行
    dateInstance: any;
    totalData: any = {
        totalUCS: ['--', ''],
        totalEnemy: ['--', ''],
    };
    trendData: any;
    enemyBarData: any;
    platformsCompareData: any = {
        1: [],
        2: [],
        3: [],
        4: [],
    };
    enemyPlatformsCompareData: any = {
        1: [],
        2: [],
        3: [],
        4: [],
    };
    sendData: any = {
        dataType: 2
    };

    constructor(public navCtrl: NavController,
                public publicFactory: PublicFactory,
                public popupFactory: PopupFactory,
                public platformService: PlatformService,
                public globalVars: GlobalVars) {
    }

    ngOnInit() {
        this.dateInstance = this.globalVars.getInstance();
    }

    ngAfterViewInit() {
        //订阅选择单位传过来的信息
        this.publicFactory.unitInfo.subscribe((data) => {
            console.log(data.page);
            if (data.page == this.pageName) {
                this.getPlatformSegment();
            }
        });
    }

    ionViewDidEnter() {
        this.getDataFromCache(Endpoint.platformTotal, CacheField.platformTotal);
        this.getDataFromCache(Endpoint.platformTrend, CacheField.platformTrend);
        this.getDataFromCache(Endpoint.platformsCompare, CacheField.platformsCompare);
    }

    ionViewWillLeave() {
        //取消选择单位订阅
        this.publicFactory.unitInfo.observers.pop();
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
                    default:
                        break;
                }
            }

            this.globalVars.loaders.pop();

            if (!!refresher) {
                refresher.complete();
            }
            if (!!loader && this.globalVars.loaders.length == 0) {
                loader.dismiss();
            }
        })
    }

    /**
     * 从本地存储中获取数据
     * getDataFromCache(接口,本地存储key)
     * */
    getDataFromCache(endpoint, cacheKey) {
        let _totalData: any = this.platformService.getValue(cacheKey);
        switch (cacheKey) {
            //总额
            case CacheField.platformTotal:
                if (!!_totalData) {
                    this.totalData = _totalData;
                    return;
                } else {
                    this.sendData = null;
                    break;
                }
                //网金平台指数排行
            case CacheField.platformsCompare:
                if (!!_totalData && !!_totalData[this.dataType]) {
                    this.platformsCompareData = _totalData;
                    return;
                } else {
                    this.sendData = {dataType: parseInt(this.dataType)};
                    break;
                }
                //网金成交额折线图
            case CacheField.platformTrend:
                if (!!_totalData) {
                    this.trendData = _totalData;
                    return;
                } else {
                    this.sendData = null;
                    break;
                }
                //竞品平台指数排行
            case CacheField.enemyPlatformsCompare:
                if (!!_totalData && !!_totalData[this.enemyDataType]) {
                    this.enemyPlatformsCompareData = _totalData;
                    return;
                } else {
                    this.sendData = null;
                    break;
                }
            //竞品柱状图
            case CacheField.enemyBar:
                if (!!_totalData) {
                    this.enemyBarData = _totalData;
                    return;
                } else {
                    this.sendData = null;
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
                this.loadData(endpoint, cacheKey, null, loader, this.sendData);
            });
            return;
        }
        this.globalVars.loaders.push(1);
        this.loadData(endpoint, cacheKey, null, loader);
    }

    //下拉刷新
    doRefresh(refresher: Refresher) {
        setTimeout(() => {
            //总数据
            this.loadData(Endpoint.platformTotal, CacheField.platformTotal, refresher);
            switch (this.platformType) {
                //网金
                case '1':
                    //折线图数据
                    this.loadData(Endpoint.platformTrend, CacheField.platformTrend, refresher);
                    //平台指数排行数据
                    this.loadData(Endpoint.platformsCompare, CacheField.platformsCompare, refresher, null, this.sendData);
                    break;
                //竞品
                case '2':
                    this.loadData(Endpoint.enemyPlatformsCompare, CacheField.enemyPlatformsCompare, refresher, null, this.sendData);
                    this.loadData(Endpoint.enemyBar, CacheField.enemyBar, refresher, null, this.sendData);
                    break;
                //传统理财
                case '3':
                    break;
            }

        }, 500);
    }

    getPlatformSegment() {
        let num = Number(this.platformType);
        this.mainSlides.slideTo(num - 1);

        this.getDataFromCache(Endpoint.platformTotal, CacheField.platformTotal);
        switch (num) {
            //网金
            case 1:
                this.getDataFromCache(Endpoint.platformTrend, CacheField.platformTrend);
                this.getDataFromCache(Endpoint.platformsCompare, CacheField.platformsCompare);
                break;
            //竞品
            case 2:
                this.getDataFromCache(Endpoint.enemyPlatformsCompare, CacheField.enemyPlatformsCompare);
                this.getDataFromCache(Endpoint.enemyBar, CacheField.enemyBar);
                break;
            //传统理财
            case 3:
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