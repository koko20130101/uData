import {Component} from '@angular/core';
import {NavController, NavParams,Refresher} from 'ionic-angular';

import {Endpoint} from '../../providers/endpoint';
import {CacheField} from '../../providers/cache-field';
import {GlobalVars} from '../../providers/services/global.service';
import {BankService} from '../../providers/services/bank.service';

import {PublicFactory} from '../../providers/factory/public.factory';
import {PopupFactory} from '../../providers/factory/popup.factory';

@Component({
    selector: 'bank-detail-page',
    templateUrl: 'bank-detail.html',
    providers: [BankService]
})
export class BankDetailPage {
    pageName: any = 'BankDetailPage';
    projectType = '1';
    projectTrendType = '1';
    userOperateType = '1';
    dateInstance: any;
    bankInfo: any;
    //平台数据
    bankTotalData:any = {
        total: ['--',''],
        AverageRate: [],
        AverageDeal: [],
        AverageTerm: [],
        ProjectNumber: [],
        PeopleNumber: [],
        UserNumber: [],
        DealNumber: [],
        time: [],
        repeatRate: [],
        activeRate: [],
        selfBank: [],
        heavyInvest: [],
        newInvest: [],
        newBindCard: [],
        newUser: [],
        otherDeal: [],
        financingNumber: []
    };
    //交易总额折线图
    bankMoneyData:any;
    //渠道占比
    bankChannelData:any;
    //二级市场数据总额
    bankTotalSecData: any = {
        secProjectNumber: [],
        secReleaseNumber: [],
        secDealNumber: [],
        secPeriod: [],
        averageTime: [],
        secUser: [],
        secRepeatRate: [],
        secAverageRate: []
    };
    //二级市场收益率折线图
    bankRateTrendSecData:any;
    //资产类型
    bankAssetsTypeData:any;
    bankTrendRateData: any;
    bankTrendTermData: any;
    bankTrendDealData: any;

    constructor(public navCtrl: NavController,
                public publicFactory: PublicFactory,
                public popupFactory: PopupFactory,
                public bankService: BankService,
                public params: NavParams,
                public globalVars: GlobalVars) {
        this.bankInfo = params.data;
    }

    ngOnInit() {
        this.dateInstance = this.globalVars.getInstance();
    }

    ngAfterViewInit() {
        //订阅选择单位传过来的信息
        this.publicFactory.unitInfo.subscribe((data) => {
            if (data.page == this.pageName) {
                this.getDataFromCache(Endpoint.bankTotal, CacheField.bankTotal);
                this.getDataFromCache(Endpoint.bankMoney, CacheField.bankMoney);
                this.getDataFromCache(Endpoint.bankChannel, CacheField.bankChannel);
                this.getDataFromCache(Endpoint.bankTotalSec, CacheField.bankTotalSec);
                this.getDataFromCache(Endpoint.bankRateTrendSec, CacheField.bankRateTrendSec);
                this.getProjectType();
                this.getProjectTrendType();
            }
        });
    }

    ionViewWillEnter() {
        this.getDataFromCache(Endpoint.bankTotal, CacheField.bankTotal);
    }

    ionViewDidEnter(){
        this.getDataFromCache(Endpoint.bankMoney, CacheField.bankMoney);
        this.getDataFromCache(Endpoint.bankChannel, CacheField.bankChannel);
        this.getDataFromCache(Endpoint.bankTotalSec, CacheField.bankTotalSec);
        this.getDataFromCache(Endpoint.bankRateTrendSec, CacheField.bankRateTrendSec);
        this.getProjectType();
        this.getProjectTrendType();
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
        let _sendData: any = {
            BankCode:this.bankInfo.bankCode
        };
        let _cacheData: any = this.bankService.getValue(cacheKey);
        switch (cacheKey) {
            case CacheField.bankTotal:
                if (!!_cacheData) {
                    this.bankTotalData = _cacheData;
                    return;
                } else {
                    Object.assign(_sendData, {cd: this.bankInfo.hasB});
                    break;
                }
            case CacheField.bankMoney:
                if (!!_cacheData) {
                    this.bankMoneyData = _cacheData;
                    return;
                } else {
                    Object.assign(_sendData, {cd: this.bankInfo.hasB});
                    break;
                }
            case CacheField.bankChannel:
                if (!!_cacheData) {
                    this.bankChannelData = _cacheData;
                    return;
                } else {
                    break;
                }
            case CacheField.bankTotalSec:
                if (!!_cacheData) {
                    this.bankTotalSecData = _cacheData;
                    return;
                } else {
                    Object.assign(_sendData, {cd: this.bankInfo.hasB});
                    break;
                }
            case CacheField.bankRateTrendSec:
                if (!!_cacheData) {
                    this.bankRateTrendSecData = _cacheData;
                    return;
                } else {
                    Object.assign(_sendData, {cd: this.bankInfo.hasB});
                    break;
                }
            case CacheField.bankAssetsType:
                if (!!_cacheData) {
                    this.bankAssetsTypeData = _cacheData;
                    return;
                } else {
                    Object.assign(_sendData, {cd: this.bankInfo.hasB});
                    break;
                }
            case CacheField.bankTrendRate:
                if (!!_cacheData) {
                    this.bankTrendRateData = _cacheData;
                    return;
                } else {
                    Object.assign(_sendData, {cd: this.bankInfo.hasB});
                    break;
                }
            case CacheField.bankTrendTerm:
                if (!!_cacheData) {
                    this.bankTrendTermData = _cacheData;
                    return;
                } else {
                    Object.assign(_sendData, {cd: this.bankInfo.hasB});
                    break;
                }
            case CacheField.bankTrendDeal:
                if (!!_cacheData) {
                    this.bankTrendDealData = _cacheData;
                    return;
                } else {
                    Object.assign(_sendData, {cd: this.bankInfo.hasB});
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
        this.bankService.loadValue(endpoint, cacheKey, sendData).subscribe((data)=> {
            let res: any = data;
            if (res._body.code == 1) {
                switch (cacheKey) {
                    case CacheField.bankTotal:
                        this.bankTotalData = res._body.data;
                        break;
                    case CacheField.bankMoney:
                        this.bankMoneyData = res._body.data;
                        break;
                    case CacheField.bankChannel:
                        this.bankChannelData = res._body.data;
                        break;
                    case CacheField.bankTotalSec:
                        this.bankTotalSecData = res._body.data;
                    case CacheField.bankRateTrendSec:
                        this.bankRateTrendSecData = res._body.data;
                        break;
                    case CacheField.bankAssetsType:
                        this.bankAssetsTypeData = res._body.data;
                        break;
                    case CacheField.bankTrendRate:
                        this.bankTrendRateData = res._body.data;
                        break;
                    case CacheField.bankTrendTerm:
                        this.bankTrendTermData = res._body.data;
                        break;
                    case CacheField.bankTrendDeal:
                        this.bankTrendDealData = res._body.data;
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

    getProjectTrendType(){
        switch (this.projectTrendType) {
            case '1':
                this.getDataFromCache(Endpoint.bankTrendRate, CacheField.bankTrendRate);
                break;
            case '2':
                this.getDataFromCache(Endpoint.bankTrendTerm, CacheField.bankTrendTerm);
                break;
            case '3':
                this.getDataFromCache(Endpoint.bankTrendDeal, CacheField.bankTrendDeal);
                break;
        }
    }
    getProjectType(){
        if(this.projectType=='2') {
            this.getDataFromCache(Endpoint.bankAssetsType, CacheField.bankAssetsType);
        }
    }

    //下拉刷新
    doRefresh(refresher: Refresher) {
        setTimeout(() => {
            this.loadData(Endpoint.bankTotal, CacheField.bankTotal, refresher);
            this.loadData(Endpoint.bankMoney, CacheField.bankMoney, refresher);
            this.loadData(Endpoint.bankChannel, CacheField.bankChannel, refresher);
            this.loadData(Endpoint.bankTotalSec, CacheField.bankTotalSec, refresher);
            this.loadData(Endpoint.bankRateTrendSec, CacheField.bankRateTrendSec, refresher);
            if(this.projectType == '2') {
                this.loadData(Endpoint.bankAssetsType, CacheField.bankAssetsType, refresher);
            }
            switch (this.projectTrendType) {
                case '1':
                    this.loadData(Endpoint.bankTrendRate, CacheField.bankTrendRate,refresher);
                    break;
                case '2':
                    this.loadData(Endpoint.bankTrendTerm, CacheField.bankTrendTerm,refresher);
                    break;
                case '3':
                    this.loadData(Endpoint.bankTrendDeal, CacheField.bankTrendDeal,refresher);
                    break;
            }
        }, 500);
    }
}