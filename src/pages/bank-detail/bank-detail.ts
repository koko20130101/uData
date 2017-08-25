import {Component} from '@angular/core';
import {NavController, NavParams, Refresher} from 'ionic-angular';

import {Endpoint} from '../../providers/endpoint';
import {CacheField} from '../../providers/cache-field';
import {GlobalVars} from '../../providers/services/global.service';
import {BankService} from '../../providers/services/bank.service';

import {PublicFactory} from '../../providers/factory/public.factory';
import {PopupFactory} from '../../providers/factory/popup.factory';

import * as chartOptions from '../../providers/charts-option';

@Component({
    selector: 'bank-detail-page',
    templateUrl: 'bank-detail.html',
    providers: [BankService]
})
export class BankDetailPage {
    pageInfo: any = {
        name: 'BankDetailPage',
        id: 6
    };
    projectType = '1';
    projectTrendType = '1';
    userOperateType = '1';
    modelContent: any[] = [1, 1, 1, 1, 1];  //list内容展开收起状态
    dateInstance: any;
    bankInfo: any;
    currentEndpoint:any;
    //平台数据
    bankTotalData: any = {
        total: ['--', ''],
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
    bankMoneyData: any;
    //渠道占比
    bankChannelData: any;
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
    bankRateTrendSecData: any;
    //资产类型
    bankAssetsTypeData: any;
    //收益率走势
    bankTrendRateData: any;
    //期限走势
    bankTrendTermData: any;
    //项目规模走势
    bankTrendDealData: any;

    lineChartOption_1: any;
    lineChartOption_2: any;
    lineChartOption_3: any;
    lineChartOption_4: any;
    pieChartOption_1: any;
    pieChartOption_2: any;

    //银行数据端口：B端,C端
    radioList:any[]=[];
    currentEndPoint:any={
        name:"",
        tip:"",
        bankCode:""
    };
    showEndPoint:boolean = true;
    showEndPointArrow:boolean = true;

    constructor(public navCtrl: NavController,
                public publicFactory: PublicFactory,
                public popupFactory: PopupFactory,
                public bankService: BankService,
                public params: NavParams,
                public globalVars: GlobalVars) {
        this.bankInfo = params.data;
        Object.assign(this.currentEndPoint, this.bankInfo.endPoint[0]);

        if(this.bankInfo.endPoint.length==1){
            this.showEndPointArrow = false
        }
        if(this.bankInfo.endPoint.length==1 && this.bankInfo.endPoint[0].name==''){
            this.showEndPoint = false
        }
        //数据端不能为空
        if(this.currentEndPoint.tip==''){
            this.currentEndPoint.tip = 'C'
        }
    }

    ngOnInit() {
        this.dateInstance = this.globalVars.getInstance();
        //交易额折线图设置
        this.lineChartOption_1 = chartOptions.LineChartOption_1();
        this.lineChartOption_1.tooltip.formatter = function (params) {
            let res = params[0].name;
            for (var i = 0; i < params.length; i++) {
                res += '<br/>' + params[i].seriesName + ' : ' + this.publicFactory.moneyFormat(params[i].data, true);
            }
            return res;
        }.bind(this);

        //利率折线图设置
        this.lineChartOption_2 = chartOptions.LineChartOption_1();
        this.lineChartOption_2.yAxis[0].axisLabel.formatter = '{value} %';
        this.lineChartOption_2.title.show = false;
        this.lineChartOption_2.tooltip.formatter = function (params: any) {
            let res = params[0].name;
            for (var i = 0; i < params.length; i++) {
                res += '<br/>' + params[i].seriesName + '：' + params[i].data + '%';
            }
            return res;
        };

        this.lineChartOption_3 = chartOptions.LineChartOption_1();
        this.lineChartOption_3.title.subtext = '单位（天）';
        this.lineChartOption_3.tooltip.formatter = function (params: any) {
            let res = params[0].name;
            for (var i = 0; i < params.length; i++) {
                res += '<br/>' + params[i].seriesName + '：' + params[i].data + '天';
            }
            return res;
        };

        this.lineChartOption_4 = chartOptions.LineChartOption_1();
        this.lineChartOption_4.title.subtext = '单位（万元）';
        this.lineChartOption_4.tooltip.formatter = function (params: any) {
            let res = params[0].name;
            for (var i = 0; i < params.length; i++) {
                res += '<br/>' + params[i].seriesName + '：' + this.publicFactory.moneyFormat(params[i].data, true);
            }
            return res;
        }.bind(this);

        //资产类型饼图设置
        this.pieChartOption_1 = chartOptions.PieChartOptions_1();
        this.pieChartOption_1.legend.x = 'right';
        this.pieChartOption_1.series[0].center = ['40%', '50%'];

        //渠道占比饼图
        this.pieChartOption_2 = chartOptions.PieChartOptions_1();
    }

    ngAfterViewInit() {
        //订阅选择单位传过来的信息
        this.publicFactory.unitInfo.subscribe((data) => {
            if (data.page == this.pageInfo.name) {
                this.loadInfo();
            }
        });
    }

    ionViewWillEnter() {
    }

    ionViewDidEnter() {
        this.loadInfo();
    }

    ionViewWillLeave() {
        //取消选择单位订阅
        this.publicFactory.unitInfo.observers.pop();
    }

    showContent(value) {
        if (this.modelContent[value]) {
            this.modelContent[value] = 0;
        } else {
            this.modelContent[value] = 1;
        }
    }

    showAlert() {
        if(this.bankInfo.endPoint.length==1) return;
        this.radioList = [];
        for (let i=0;i < this.bankInfo.endPoint.length;i++) {
            this.radioList.push({
                type: 'radio',
                label: this.bankInfo.endPoint[i].name,
                value: i,
                checked: this.bankInfo.endPoint[i].name == this.currentEndPoint.name ? true : false
            });
        }
        //弹出日期选择弹窗
        this.popupFactory.showAlert({
            title: '',
            subTitle: '',
            inputs: this.radioList,
            buttons: [
                {
                    text: '确 定',
                    handler: (data)=> {
                        Object.assign(this.currentEndPoint, this.bankInfo.endPoint[data]);
                        this.loadInfo();
                    }
                }
            ]
        })
    }

    loadInfo(){
        this.getDataFromCache(Endpoint.bankTotal, CacheField.bankTotal,[this.currentEndPoint.bankCode,this.currentEndPoint.tip]);
        this.getDataFromCache(Endpoint.bankMoney, CacheField.bankMoney,[this.currentEndPoint.bankCode,this.currentEndPoint.tip]);
        this.getDataFromCache(Endpoint.bankChannel, CacheField.bankChannel,[this.currentEndPoint.bankCode,this.currentEndPoint.tip]);
        this.getDataFromCache(Endpoint.bankTotalSec, CacheField.bankTotalSec,[this.currentEndPoint.bankCode,this.currentEndPoint.tip]);
        this.getDataFromCache(Endpoint.bankRateTrendSec, CacheField.bankRateTrendSec,[this.currentEndPoint.bankCode,this.currentEndPoint.tip]);
        this.getProjectType();
        this.getProjectTrendType();
    }

    /**
     * 从本地存储中获取数据
     * getDataFromCache(接口,本地存储key,资源类型标识)
     * */
    getDataFromCache(endpoint, cacheKey, source?: any) {
        let _cacheData: any = this.bankService.getValue(cacheKey,source);
        switch (cacheKey) {
            case CacheField.bankTotal:
                if (!!_cacheData) {
                    this.bankTotalData = _cacheData;
                    console.log(this.bankTotalData)
                    return;
                } else {
                    break;
                }
            case CacheField.bankMoney:
                if (!!_cacheData) {
                    this.bankMoneyData = _cacheData;
                    return;
                } else {
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
                    break;
                }
            case CacheField.bankRateTrendSec:
                if (!!_cacheData) {
                    this.bankRateTrendSecData = _cacheData;
                    return;
                } else {
                    break;
                }
            //==> 资产类型饼图
            case CacheField.bankAssetsType:
                if (!!_cacheData) {
                    this.setPieOption_1(_cacheData);
                    return;
                } else {
                    break;
                }
            case CacheField.bankTrendRate:
                if (!!_cacheData) {
                    this.bankTrendRateData = _cacheData;
                    return;
                } else {
                    break;
                }
            case CacheField.bankTrendTerm:
                if (!!_cacheData) {
                    this.bankTrendTermData = _cacheData;
                    return;
                } else {
                    break;
                }
            case CacheField.bankTrendDeal:
                if (!!_cacheData) {
                    this.bankTrendDealData = _cacheData;
                    return;
                } else {
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
                this.loadData(endpoint, cacheKey, null, loader);
            });
            return;
        }
        this.globalVars.loaders.push(1);
        this.loadData(endpoint, cacheKey, null, loader);
    }

    /**
     * 从服务器加载数据
     * loadData(接口,本地存储key,下拉刷新对象,loading对象)
     * */
    loadData(endpoint, cacheKey, refresher?: any, loader?: any, sendData?: any) {
        let _sendData: any = {
            BankCode: this.currentEndPoint.bankCode,
            cb: this.currentEndPoint.tip
        };
        Object.assign(_sendData, sendData);
        this.bankService.loadValue(endpoint, cacheKey, _sendData)
            .map(res =>res.json())
            .subscribe(res => {
                if (res.code == 1) {
                    switch (cacheKey) {
                        case CacheField.bankTotal:
                            this.bankTotalData = res.data[this.currentEndPoint.bankCode][this.currentEndPoint.tip];
                            break;
                        case CacheField.bankMoney:
                            this.bankMoneyData = res.data[this.currentEndPoint.bankCode][this.currentEndPoint.tip];
                            break;
                        case CacheField.bankChannel:
                            this.bankChannelData = res.data[this.currentEndPoint.bankCode][this.currentEndPoint.tip];
                            break;
                        case CacheField.bankTotalSec:
                            this.bankTotalSecData = res.data[this.currentEndPoint.bankCode][this.currentEndPoint.tip];
                        case CacheField.bankRateTrendSec:
                            this.bankRateTrendSecData = res.data[this.currentEndPoint.bankCode][this.currentEndPoint.tip];
                            break;
                        //资产类型饼图
                        case CacheField.bankAssetsType:
                            this.setPieOption_1(res.data[this.currentEndPoint.bankCode][this.currentEndPoint.tip]);
                            break;
                        //收益率走势
                        case CacheField.bankTrendRate:
                            this.bankTrendRateData = res.data[this.currentEndPoint.bankCode][this.currentEndPoint.tip];
                            break;
                        //期限走势
                        case CacheField.bankTrendTerm:
                            this.bankTrendTermData = res.data[this.currentEndPoint.bankCode][this.currentEndPoint.tip];
                            break;
                        //项目规模走势
                        case CacheField.bankTrendDeal:
                            this.bankTrendDealData = res.data[this.currentEndPoint.bankCode][this.currentEndPoint.tip];
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
            }, err=> {
                this.globalVars.loaders.pop();
                if (!!refresher && this.globalVars.loaders.length == 0) {
                    refresher.complete();
                }
                if (!!loader && this.globalVars.loaders.length == 0) {
                    loader.dismiss();
                }
            });
    }

    getProjectTrendType() {
        switch (this.projectTrendType) {
            case '1':
                this.getDataFromCache(Endpoint.bankTrendRate, CacheField.bankTrendRate,[this.currentEndPoint.bankCode,this.currentEndPoint.tip]);
                break;
            case '2':
                this.getDataFromCache(Endpoint.bankTrendTerm, CacheField.bankTrendTerm,[this.currentEndPoint.bankCode,this.currentEndPoint.tip]);
                break;
            case '3':
                this.getDataFromCache(Endpoint.bankTrendDeal, CacheField.bankTrendDeal,[this.currentEndPoint.bankCode,this.currentEndPoint.tip]);
                break;
        }
    }

    getProjectType() {
        if (this.projectType == '2') {
            this.getDataFromCache(Endpoint.bankAssetsType, CacheField.bankAssetsType,[this.currentEndPoint.bankCode,this.currentEndPoint.tip]);
        }
    }

    /**
     * 格式化资产类型饼图
     * loadData(本地或远程数据)
     * */
    setPieOption_1(_data: any) {
        this.pieChartOption_1.tooltip.formatter = function (params) {
            let mySeries: any = _data.series[0];
            let res = '<b style="color:' + this.pieChartOption_1.color[params.dataIndex] + '">' + params.name + '</b><br>';
            for (var i = 0; i < mySeries.length; i++) {
                if (params.name == mySeries[i].name) {
                    res += '项目量：' + mySeries[i].number + '<br/>';
                    res += '发布规模：' + this.publicFactory.moneyFormat(mySeries[i].money, true) + '<br/>';
                    res += '平均利率：' + mySeries[i].rate + '%<br/>';
                    res += '平均期限：' + mySeries[i].term + '天</span>';
                }
            }
            return res;
        }.bind(this);
        this.bankAssetsTypeData = _data;
    }

    //下拉刷新
    doRefresh(refresher: Refresher) {
        setTimeout(() => {
            this.loadData(Endpoint.bankTotal, CacheField.bankTotal, refresher);
            this.loadData(Endpoint.bankMoney, CacheField.bankMoney, refresher);
            this.loadData(Endpoint.bankChannel, CacheField.bankChannel, refresher);
            this.loadData(Endpoint.bankTotalSec, CacheField.bankTotalSec, refresher);
            this.loadData(Endpoint.bankRateTrendSec, CacheField.bankRateTrendSec, refresher);
            if (this.projectType == '2') {
                this.loadData(Endpoint.bankAssetsType, CacheField.bankAssetsType, refresher);
            }
            switch (this.projectTrendType) {
                case '1':
                    this.loadData(Endpoint.bankTrendRate, CacheField.bankTrendRate, refresher);
                    break;
                case '2':
                    this.loadData(Endpoint.bankTrendTerm, CacheField.bankTrendTerm, refresher);
                    break;
                case '3':
                    this.loadData(Endpoint.bankTrendDeal, CacheField.bankTrendDeal, refresher);
                    break;
            }
        }, 500);
    }
}