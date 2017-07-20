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
    dateInstance: any;
    totalData: any = {
        totalUCS: ['--', ''],
        totalEnemy: ['--', ''],
    };
    trendData: any;
    platformsCompareData: any={
        1:[],
        2:[],
        3:[],
        4:[],
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
                // this.getDataFromCache(Endpoint.platformTotalData, CacheField.platformTotalData);
                // this.getDataFromCache(Endpoint.trendData, CacheField.trendData);
                this.getDataFromCache(Endpoint.platformsCompareData, CacheField.platformsCompareData);
            }
        });
    }

    ionViewDidEnter() {
        this.getDataFromCache(Endpoint.platformTotalData, CacheField.platformTotalData);
        this.getDataFromCache(Endpoint.trendData, CacheField.trendData);
        this.getDataFromCache(Endpoint.platformsCompareData, CacheField.platformsCompareData);
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
                    case CacheField.platformTotalData:
                        this.totalData = res._body.data;
                        break;
                    case CacheField.platformsCompareData:
                        Object.assign(this.platformsCompareData,res._body.data);
                        break;
                    case CacheField.trendData:
                        this.trendData = res._body.data;
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
        let _totalData:any = this.platformService.getValue(cacheKey);
        switch (cacheKey) {
            case CacheField.platformTotalData:
                if(!!_totalData) {
                    this.totalData = _totalData;
                    return;
                }else{
                    this.sendData = null;
                    break;
                };
            case CacheField.platformsCompareData:
                if(!!_totalData && !!_totalData[this.dataType]) {
                    this.platformsCompareData = _totalData;
                    //重新计算slide的尺寸
                    this.mainSlides.update();
                    return;
                }else{
                    this.sendData = {dataType: parseInt(this.dataType)};
                    break;
                };
            case CacheField.trendData:
                if(!!_totalData) {
                    this.trendData = _totalData;
                    return;
                }else{
                    this.sendData = null;
                    break;
                };
            default:
                break;
        }

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
            this.loadData(Endpoint.platformTotalData, CacheField.platformTotalData, refresher);
            //折线图数据
            this.loadData(Endpoint.trendData, CacheField.trendData, refresher);
            //平台指数排行数据
            this.loadData(Endpoint.platformsCompareData, CacheField.platformsCompareData, refresher, null, this.sendData);
        }, 500);
    }

    getPlatformSegment() {
        let num = Number(this.platformType);
        this.mainSlides.slideTo(num - 1);
    }

    ucsPlatformExponent() {
        this.getDataFromCache(Endpoint.platformsCompareData, CacheField.platformsCompareData);
    }

    slideChange() {
        let active = this.mainSlides.getActiveIndex();
        let total = this.mainSlides.length();
        if (active == total) return;
        this.platformType = String(active + 1);
    }

}