import {Component, ViewChild} from '@angular/core';
import {Slides, NavController, Refresher} from 'ionic-angular';

import {Endpoint} from '../../providers/endpoint';
import {CacheField} from '../../providers/cache-field';
import {C2bService} from '../../providers/services/c2b.service';
import {GlobalVars} from '../../providers/services/global.service';

import {PublicFactory} from '../../providers/factory/public.factory';
import {PopupFactory} from '../../providers/factory/popup.factory';

@Component({
    selector: 'c2b-page',
    templateUrl: 'c2b.html',
    providers: [C2bService]
})
export class C2bPage {
    @ViewChild('MainSlides') mainSlides: Slides;
    pageName = 'C2bPage';
    C2BType = '1';
    saleChannelTypeIn = '2';
    saleChannelTypeOut = '2';
    dateInstance: any;
    //引入及销售总额
    saleTotalData: any = {
        totalAssetsIn: ['--', ''],
        totalAssetsOut: ['--', ''],
    };
    //资产运营总额
    assetsMain: any = {
        TotalAssetAmount: ['--', ''],
        SurplusAmount: ['--', ''],
    };
    //引入渠道分布
    saleChannelDataIn:any={
        1:[],
        2:[],
        3:[]
    };
    //销售渠道分布
    saleChannelDataOut:any={
        1:[],
        2:[],
        3:[]
    };
    //折线图
    assetsInOutData:any={
        "in":[],
        "out":[]
    };
    profitData: any = {};
    assetsHealthyData: any = {};
    grossMarginData: any = {};
    inoutFlag: any = 'in';

    constructor(public navCtrl: NavController,
                public publicFactory: PublicFactory,
                public popupFactory: PopupFactory,
                public c2bService: C2bService,
                public globalVars: GlobalVars) {

    }

    ngOnInit() {
        //全局变量实例
        this.dateInstance = this.globalVars.getInstance();
    }

    ngAfterViewInit() {
        //订阅选择单位传过来的信息
        this.publicFactory.unitInfo.subscribe((data) => {
            if (data.page == this.pageName) {
                // console.log(data.page)
                this.goSegment();
            }
        });
    }

    ionViewWillEnter() {
        this.getDataFromCache(Endpoint.saleTotal, CacheField.saleTotal);
        this.getDataFromCache(Endpoint.saleChannelInOut, CacheField.saleChannelIn);
        this.getDataFromCache(Endpoint.assetsInOut, CacheField.assetsInOut);
    }

    ionViewDidEnter() {
    }

    ionViewWillLeave() {
        //取消选择单位订阅
        this.publicFactory.unitInfo.observers.pop();
    }

    /**
     * 从本地存储中获取数据
     * getDataFromCache(接口,本地存储key,资源类型标识)
     * */
    getDataFromCache(endpoint, cacheKey, source?: any) {
        let _sendData: any = null;
        let _cacheData: any = this.c2bService.getValue(cacheKey);
        switch (cacheKey) {
            //引入及销售总额
            case CacheField.saleTotal:
                if (!!_cacheData) {
                    this.saleTotalData = _cacheData;
                    return;
                } else {
                    _sendData = null;
                    break;
                }
            //引入渠道分布
            case CacheField.saleChannelIn:
                if (!!_cacheData && !!_cacheData[this.saleChannelTypeIn]) {
                    this.saleChannelDataIn = _cacheData;
                    return;
                } else {
                    _sendData = {dataType:parseInt(this.saleChannelTypeIn),inoutFlag:this.inoutFlag};
                    break;
                }
            //销售渠道分布
            case CacheField.saleChannelOut:
                if (!!_cacheData && !!_cacheData[this.saleChannelTypeOut]) {
                    this.saleChannelDataOut = _cacheData;
                    return;
                } else {
                    _sendData = {dataType:parseInt(this.saleChannelTypeOut),inoutFlag:this.inoutFlag};
                    break;
                }
            //折线图
            case CacheField.assetsInOut:
                if (!!_cacheData && !!_cacheData[this.inoutFlag]) {
                    this.assetsInOutData = _cacheData;
                    return;
                } else {
                    _sendData = {inoutFlag:this.inoutFlag};
                    break;
                }
            //运营分析总额
            case CacheField.assetsMain:
                if (!!_cacheData) {
                    this.assetsMain = _cacheData;
                    return;
                } else {
                    _sendData = null;
                    break;
                }
            //运营分析总额
            case CacheField.profitData:
                if (!!_cacheData) {
                    this.profitData = _cacheData;
                    return;
                } else {
                    _sendData = null;
                    break;
                }
            //资产健康值
            case CacheField.assetsHealthy:
                if (!!_cacheData) {
                    this.assetsHealthyData = _cacheData;
                    return;
                } else {
                    _sendData = null;
                    break;
                }
            //资产健康值
            case CacheField.grossMargin:
                if (!!_cacheData) {
                    this.grossMarginData = _cacheData;
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

    /**
     * 从服务器加载数据
     * loadData(接口,本地存储key,下拉刷新对象,loading对象)
     * */
    loadData(endpoint, cacheKey, refresher?: any, loader?: any, sendData?: any) {
        this.c2bService.loadValue(endpoint, cacheKey, sendData).subscribe((data)=> {
            let res: any = data;
            if (res._body.code == 1) {
                switch (cacheKey) {
                    case CacheField.saleTotal:
                        this.saleTotalData = res._body.data;
                        break;
                    case CacheField.saleChannelIn:
                        this.saleChannelDataIn = res._body.data;
                        break;
                    case CacheField.saleChannelOut:
                        this.saleChannelDataIn = res._body.data;
                        break;
                    case CacheField.assetsMain:
                        this.assetsMain = res._body.data;
                        break;
                    case CacheField.profitData:
                        this.profitData = res._body.data;
                        break;
                    case CacheField.assetsHealthy:
                        this.assetsHealthyData = res._body.data;
                        break;
                    case CacheField.grossMargin:
                        this.grossMarginData = res._body.data;
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
        });
    }

    //下拉刷新
    doRefresh(refresher: Refresher) {
        let num = Number(this.C2BType);
        setTimeout(() => {
            //总数据
            switch (num) {
                //引入
                case 1:
                    //总额
                    this.loadData(Endpoint.saleTotal, CacheField.saleTotal, refresher);
                    this.loadData(Endpoint.saleChannelInOut, CacheField.saleChannelIn, refresher,null,{inoutFlag:this.inoutFlag});
                    this.loadData(Endpoint.assetsInOut, CacheField.assetsInOut, refresher,null,{inoutFlag:this.inoutFlag});
                    break;
                //
                case 2:
                    this.loadData(Endpoint.saleTotal, CacheField.saleTotal, refresher);
                    this.loadData(Endpoint.saleChannelInOut, CacheField.saleChannelOut, refresher,null,{inoutFlag:this.inoutFlag});
                    this.loadData(Endpoint.assetsInOut, CacheField.assetsInOut, refresher,null,{inoutFlag:this.inoutFlag});
                    break;
                //传统理财
                case 3:
                    this.loadData(Endpoint.assetsMain, CacheField.assetsMain, refresher);
                    this.loadData(Endpoint.profitData, CacheField.profitData,refresher);
                    this.loadData(Endpoint.assetsHealthy, CacheField.assetsHealthy,refresher);
                    this.loadData(Endpoint.grossMargin, CacheField.grossMargin);
                    break;
            }

        }, 500);
    }

    goSegment() {
        let num = Number(this.C2BType);
        this.mainSlides.slideTo(num - 1);
        switch (num) {
            //引入额
            case 1:
                this.inoutFlag = 'in';
                this.getDataFromCache(Endpoint.saleTotal, CacheField.saleTotal);
                this.getDataFromCache(Endpoint.saleChannelInOut, CacheField.saleChannelIn);
                this.getDataFromCache(Endpoint.assetsInOut, CacheField.assetsInOut);
                break;
            //销售额
            case 2:
                this.inoutFlag = 'out';
                this.getDataFromCache(Endpoint.saleTotal, CacheField.saleTotal);
                this.getDataFromCache(Endpoint.saleChannelInOut, CacheField.saleChannelOut);
                this.getDataFromCache(Endpoint.assetsInOut, CacheField.assetsInOut);
                break;
            //运营分析
            case 3:
                this.getDataFromCache(Endpoint.assetsMain, CacheField.assetsMain);
                this.getDataFromCache(Endpoint.profitData, CacheField.profitData);
                this.getDataFromCache(Endpoint.assetsHealthy, CacheField.assetsHealthy);
                this.getDataFromCache(Endpoint.grossMargin, CacheField.grossMargin);
                break;
        }
    }

    saleChannelSegmentIn() {
        this.getDataFromCache(Endpoint.saleChannelInOut, CacheField.saleChannelIn);
    }

    saleChannelSegmentOut() {
        this.getDataFromCache(Endpoint.saleChannelInOut, CacheField.saleChannelOut);
    }

    slideChange() {
        let active = this.mainSlides.getActiveIndex();
        let total = this.mainSlides.length();
        if (active == total) return;
        this.C2BType = String(active + 1);
    }
}