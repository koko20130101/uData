import {Component, ViewChild} from '@angular/core';
import {Slides, NavController, Refresher} from 'ionic-angular';

import {Endpoint} from '../../providers/endpoint';
import {CacheField} from '../../providers/cache-field';
import {GlobalVars} from '../../providers/services/global.service';
import {LingXiService} from '../../providers/services/lingXi.service';
import * as chartOptions from '../../providers/charts-option';

import {PublicFactory} from '../../providers/factory/public.factory';
import {PopupFactory} from '../../providers/factory/popup.factory'

@Component({
    selector: 'linXi-page',
    templateUrl: 'lingXi.html',
    providers: [LingXiService]
})
export class LingXiPage {
    @ViewChild("MainSlides") mainSlides: Slides;
    pageInfo: any = {
        name: 'LingXiPage',
        id: 4
    };
    loader: any;
    lingXiType = 0;
    userOperateType = '1';
    modelContent: any[] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];  //list内容展开收起状态
    dateInstance: any;
    model: any = {
        "total": ['--', ''],
        "inTotal": ['--', ''],
        "outTotal": ['--', ''],
        "entrustUser": ['', ''],
        "entrustOrder": ['', ''],
        "entrustRepeatRate": ['', ''],
        "entrustActiveRate": ['', ''],
        "heavyInvest": ['', ''],
        "newInvest": ['', ''],
        "newBindCard": ['', ''],
        "newUser": ['', '']
    };
    lingXiTotalData: any = {
        0: {},
        1: {},
        2: {},
        3: {},
        4: {}
    };
    dealTrendData: any = {};
    rateTrendData: any = {};
    lingXiChannelData: any = {};
    //成交额折线图
    lineChartOption_1: any;
    //年化收益率折线图
    lineChartOption_2: any;
    //渠道占比饼图设置
    pieChartOption: any;

    unitSubscription:any;

    constructor(public navCtrl: NavController,
                public publicFactory: PublicFactory,
                public popupFactory: PopupFactory,
                public lingXiService: LingXiService,
                public globalVars: GlobalVars) {

    }

    ngOnInit() {
        Object.assign(this.lingXiTotalData[0], this.model);
        Object.assign(this.lingXiTotalData[1], this.model);
        Object.assign(this.lingXiTotalData[2], this.model);
        Object.assign(this.lingXiTotalData[3], this.model);
        Object.assign(this.lingXiTotalData[4], this.model);
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
        this.lineChartOption_2.legend.show = false;
        this.lineChartOption_2.grid.top = '8%';
        this.lineChartOption_2.tooltip.formatter = function (params: any) {
            let res = params[0].name;
            for (var i = 0; i < params.length; i++) {
                res += ' : ' + params[i].value + '%';
            }
            return res;
        };

        //渠道占比
        this.pieChartOption = chartOptions.PieChartOptions_1();
    }

    ngAfterViewInit() {
        //订阅选择单位传过来的信息
        this.unitSubscription = this.publicFactory.unitInfo.subscribe((data) => {
            if (data.page == this.pageInfo.name) {
                this.slideChange();
            }
        });
    }

    ionViewWillEnter() {
        this.getDataFromCache(Endpoint.lingXiTotal, CacheField.lingXiTotal);
    }

    ionViewDidEnter() {
        this.getDataFromCache(Endpoint.lingXiTrendDeal, CacheField.lingXiTrendDeal);
        this.getDataFromCache(Endpoint.lingXiChannel, CacheField.lingXiChannel);
    }

    ionViewWillLeave() {
        //取消选择单位订阅
        this.unitSubscription.unsubscribe();
    }

    /**
     * 从本地存储中获取数据
     * getDataFromCache(接口,本地存储key,资源类型标识)
     * */
    getDataFromCache(endpoint, cacheKey, source?: any) {
        let _sendData: any = {
            BankCode: ''
        };
        let _num = this.lingXiType;
        this.lingXiService.getValue(cacheKey, _num).then(data=>{
            let _cacheData:any = data;
            switch (cacheKey) {
                case CacheField.lingXiTotal:
                    if (!!_cacheData) {
                        this.lingXiTotalData[_num] = _cacheData;
                        return;
                    } else {
                        _sendData = {proType: _num};
                        break;
                    }
                case CacheField.lingXiTrendDeal:
                    if (!!_cacheData) {
                        this.dealTrendData[_num] = _cacheData;
                        return;
                    } else {
                        _sendData = {proType: _num};
                        break;
                    }
                case CacheField.lingXiTrendRate:
                    if (!!_cacheData) {
                        this.rateTrendData[_num] = _cacheData;
                        return;
                    } else {
                        _sendData = {proType: _num};
                        break;
                    }
                case CacheField.lingXiChannel:
                    if (!!_cacheData) {
                        this.lingXiChannelData = _cacheData;
                        return;
                    } else {
                        _sendData = {proType: _num};
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

    /**
     * 从服务器加载数据
     * loadData(接口,本地存储key,下拉刷新对象,loading对象)
     * */
    loadData(endpoint, cacheKey, refresher?: any, loader?: any, sendData?: any) {
        this.lingXiService.loadValue(endpoint, cacheKey, sendData)
            .map(res =>res.json())
            .subscribe(res => {
                if (res.code == 1) {
                    switch (cacheKey) {
                        case CacheField.lingXiTotal:
                            if (!!res.data[this.lingXiType]) {
                                this.lingXiTotalData[this.lingXiType] = res.data[this.lingXiType];
                            } else {
                                Object.assign(this.lingXiTotalData[this.lingXiType], this.model);
                            }
                            break;
                        case CacheField.lingXiTrendDeal:
                            this.dealTrendData[this.lingXiType] = res.data[this.lingXiType];
                            break;
                        case CacheField.lingXiTrendRate:
                            this.rateTrendData[this.lingXiType] = res.data[this.lingXiType];
                            break;
                        case CacheField.lingXiChannel:
                            this.lingXiChannelData = res.data;
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
                    this.loader = null;
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
            })
    }

    goSegment() {
        let num = Number(this.lingXiType);
        this.mainSlides.slideTo(num);
    }

    //下拉刷新
    doRefresh(refresher: Refresher) {
        let num = Number(this.lingXiType);
        setTimeout(() => {
            //总数据
            this.loadData(Endpoint.lingXiTotal, CacheField.lingXiTotal, refresher,null,{proType: this.lingXiType});
            this.loadData(Endpoint.lingXiTrendDeal, CacheField.lingXiTrendDeal, refresher,null,{proType: this.lingXiType});
            if (num != 0) {
                this.loadData(Endpoint.lingXiTrendRate, CacheField.lingXiTrendRate, refresher,null,{proType: this.lingXiType});
            }
            if (num == 0) {
                this.loadData(Endpoint.lingXiChannel, CacheField.lingXiChannel, refresher,null,{proType: this.lingXiType});
            }
        }, 500);
    }

    showContent(value) {
        if (this.modelContent[value]) {
            this.modelContent[value] = 0;
        } else {
            this.modelContent[value] = 1;
        }
    }


    slideChange() {
        let active = this.mainSlides.getActiveIndex();
        let total = this.mainSlides.length();
        if (active == total) return;
        this.lingXiType = active;

        this.getDataFromCache(Endpoint.lingXiTotal, CacheField.lingXiTotal);
        this.getDataFromCache(Endpoint.lingXiTrendDeal, CacheField.lingXiTrendDeal);
        if (this.lingXiType != 0) {
            this.getDataFromCache(Endpoint.lingXiTrendRate, CacheField.lingXiTrendRate);
        }
        if (this.lingXiType == 0) {
            this.getDataFromCache(Endpoint.lingXiChannel, CacheField.lingXiChannel);
        }
    }
}