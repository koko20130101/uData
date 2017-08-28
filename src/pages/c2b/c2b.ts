import {Component, ViewChild} from '@angular/core';
import {Slides, NavController, Refresher} from 'ionic-angular';

import {Endpoint} from '../../providers/endpoint';
import {CacheField} from '../../providers/cache-field';
import {C2bService} from '../../providers/services/c2b.service';
import {GlobalVars} from '../../providers/services/global.service';

import {PublicFactory} from '../../providers/factory/public.factory';
import {PopupFactory} from '../../providers/factory/popup.factory';

import * as chartOptions from '../../providers/charts-option'

@Component({
    selector: 'c2b-page',
    templateUrl: 'c2b.html',
    providers: [C2bService]
})
export class C2bPage {
    @ViewChild('MainSlides') mainSlides: Slides;
    pageInfo: any = {
        name: 'C2bPage',
        id: 3
    };
    C2BType = 1;
    C2BTypeValue: any[] = [];
    saleChannelTypeIn = 2;
    saleChannelTypeOut = 2;
    modelContent: any[] = [1, 1, 1, 1];  //list内容展开收起状态
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
    saleChannelDataIn: any = {
        1: [],
        2: [],
        3: []
    };
    //销售渠道分布
    saleChannelDataOut: any = {
        1: [],
        2: [],
        3: []
    };
    //折线图
    assetsInOutData: any = {
        "in": [],
        "out": []
    };
    profitData: any = {};
    assetsHealthyData: any = {};
    grossMarginData: any = {};
    inoutFlag: any = 'in';

    barChartOption: any;
    lineChartOption_1: any;  // 引入额和销售额折线图设置
    lineChartOption_2: any;  // 利润走势
    lineChartOption_3: any;  // 资产健康值折线图

    barChartInstance: any;

    constructor(public navCtrl: NavController,
                public publicFactory: PublicFactory,
                public popupFactory: PopupFactory,
                public c2bService: C2bService,
                public globalVars: GlobalVars) {

    }

    ngOnInit() {
        //全局变量实例
        this.dateInstance = this.globalVars.getInstance();
        //判断有无模块权限
        if (this.dateInstance.adminCode['09']) {
            this.C2BTypeValue.push(1);
        }
        if (this.dateInstance.adminCode['10']) {
            this.C2BTypeValue.push(2);
        }
        if (this.dateInstance.adminCode['11']) {
            this.C2BTypeValue.push(3);
        }

        this.C2BType = this.C2BTypeValue[0];

        //设置图表数据
        this.barChartOption = chartOptions.BarChartOption_2();
        this.lineChartOption_1 = chartOptions.LineChartOption_1();
        //利润走势
        this.lineChartOption_2 = chartOptions.LineChartOption_1();
        this.lineChartOption_2.yAxis[0].axisLabel.formatter = '{value} %';
        this.lineChartOption_2.title.show = false;
        this.lineChartOption_2.grid.top = '8%';
        //资产健康值
        this.lineChartOption_3 = chartOptions.LineChartOption_2();

    }

    ngAfterViewInit() {
        //订阅选择单位传过来的信息
        this.publicFactory.unitInfo.subscribe((data) => {
            if (data.page == this.pageInfo.name) {
                // console.log(data.page)
                this.slideChange();
            }
        });
    }

    ionViewWillEnter() {
        this.slideChange();
    }

    ionViewDidEnter() {
    }

    ionViewWillLeave() {
        //取消选择单位订阅
        this.publicFactory.unitInfo.observers.pop();
    }

    //得到运营分析的柱图实例
    onChartInit(ec) {
        this.barChartInstance = ec;
    }

    /**
     * 从本地存储中获取数据
     * getDataFromCache(接口,本地存储key,资源类型标识)
     * */
    getDataFromCache(endpoint, cacheKey, source?: any) {
        let _sendData: any = null;
        this.c2bService.getValue(cacheKey, source).then(data=> {
            let _cacheData: any = data;
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
                    if (!!_cacheData) {
                        this.saleChannelDataIn[source] = _cacheData;
                        return;
                    } else {
                        _sendData = {dataType: this.saleChannelTypeIn, inoutFlag: this.inoutFlag};
                        break;
                    }
                //销售渠道分布
                case CacheField.saleChannelOut:
                    if (!!_cacheData) {
                        this.saleChannelDataOut[source] = _cacheData;
                        return;
                    } else {
                        _sendData = {dataType: this.saleChannelTypeOut, inoutFlag: this.inoutFlag};
                        break;
                    }
                //折线图
                case CacheField.assetsInOut:
                    if (!!_cacheData) {
                        this.assetsInOutData[source] = _cacheData;
                        return;
                    } else {
                        _sendData = {inoutFlag: this.inoutFlag};
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
                //运营分析总额柱状图
                case CacheField.profitData:
                    if (!!_cacheData) {
                        this.setBarChartOption(_cacheData);
                        return;
                    } else {
                        _sendData = null;
                        break;
                    }
                //资产健康值折线图
                case CacheField.assetsHealthy:
                    if (!!_cacheData) {
                        this.assetsHealthyData = _cacheData;
                        return;
                    } else {
                        _sendData = null;
                        break;
                    }
                //毛利率折线图
                case CacheField.grossMargin:
                    if (!!_cacheData) {
                        this.setLineChartOption_2(_cacheData);
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
        });
    }

    /**
     * 从服务器加载数据
     * loadData(接口,本地存储key,下拉刷新对象,loading对象)
     * */
    loadData(endpoint, cacheKey, refresher?: any, loader?: any, sendData?: any) {
        this.c2bService.loadValue(endpoint, cacheKey, sendData)
            .map(res => res.json())
            .subscribe((res)=> {
                if (res.code == 1) {
                    switch (cacheKey) {
                        case CacheField.saleTotal:
                            this.saleTotalData = res.data;
                            break;
                        case CacheField.assetsInOut:
                            this.assetsInOutData = res.data;
                            break;
                        case CacheField.saleChannelIn:
                            this.saleChannelDataIn = res.data;
                            break;
                        case CacheField.saleChannelOut:
                            this.saleChannelDataOut = res.data;
                            break;
                        case CacheField.assetsMain:
                            this.assetsMain = res.data;
                            break;
                        case CacheField.profitData:
                            this.setBarChartOption(res.data);
                            break;
                        case CacheField.assetsHealthy:
                            this.assetsHealthyData = res.data;
                            break;
                        case CacheField.grossMargin:
                            this.setLineChartOption_2(res.data);
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
            }, err => {
                this.globalVars.loaders.pop();
                if (!!refresher && this.globalVars.loaders.length == 0) {
                    refresher.complete();
                }
                if (!!loader && this.globalVars.loaders.length == 0) {
                    loader.dismiss();
                }
            });
    }

    /**
     * 格式化柱状图
     * loadData(本地或远程数据)
     *
     * */
    setBarChartOption(_data: any) {
        let _options = this.barChartOption;
        //深拷贝
        let _tempData: any = JSON.stringify(_data);
        _tempData = JSON.parse(_tempData);
        //格式化提示的值
        this.barChartOption.tooltip.formatter = function (params) {
            let res = params[0].name;
            for (let i = 0; i < params.length; i++) {
                if (i == 4) {
                    res += '<br/>' + params[i].seriesName + ' : ' + _data.series[4][params[i].dataIndex] + ' %';
                } else if (i == 5) {
                    res += '<br/>' + params[i].seriesName + ' : ' + _data.series[5][params[i].dataIndex] + ' %';
                } else {
                    res += '<br/>' + params[i].seriesName + ' : ' + this.publicFactory.moneyFormat(Math.abs(params[i].data), true);
                }
            }
            return res;
        }.bind(this);
        //格式化柱子上的值
        for (let i = 0; i < _options.series.length; i++) {
            _options.series[i].label.normal.formatter = function (params: any) {
                let num = _data.yAxis[0].data.indexOf(params.name);
                if (params.seriesName == '引入利率') {
                    return _data.series[4][num] + '%';
                } else if (params.seriesName == '销售利率') {
                    return _data.series[5][num] + '%';
                } else if (params.seriesName == '引入') {
                    return this.publicFactory.moneyFormat(Math.abs(params.value - _data.series[1][num]))
                } else if (params.seriesName == '回滚') {
                    return this.publicFactory.moneyFormat(Math.abs(params.value + _data.series[3][num]), true)
                } else {
                    return this.publicFactory.moneyFormat(Math.abs(params.value), true)
                }
            }.bind(this);
        }

        //重新计算柱子的比例
        let _concat = _data.series[2].concat(_data.series[3]);  //合并数据
        let topNumberRight = Math.ceil(Math.max.apply(Math, _concat)); //取最大值：获取X轴右侧的最大值
        _options.xAxis.min = -topNumberRight * 4 / 5;
        _options.xAxis.max = topNumberRight;

        for (let i = 0; i < _tempData.series[0].length; i++) {
            _tempData.series[0][i] = _tempData.series[0][i] * -1
        }
        for (let i = 0; i < _tempData.series[1].length; i++) {
            _tempData.series[1][i] = _tempData.series[1][i] * -1
        }
        for (let i = 0; i < _tempData.series[4].length; i++) {
            _tempData.series[4][i] = Math.round(_tempData.series[4][i] / 20 * topNumberRight * -1)
        }
        for (let i = 0; i < _tempData.series[5].length; i++) {
            _tempData.series[5][i] = Math.round(_tempData.series[5][i] / 20 * topNumberRight)
        }
        this.profitData = _tempData;
    }

    /**
     * 格式化利润走势折线图
     * loadData(本地或远程数据)
     * */
    setLineChartOption_2(_data: any) {
        this.lineChartOption_2.tooltip.formatter = function (params: any) {
            var res = params[0].name;
            for (var i = 0; i < params.length; i++) {
                res += '<br/>毛利率' + ' : ' + params[i].data + ' %<br/>毛利润' + ' : ' + _data.grossProfit[i];
            }
            return res;
        };
        this.grossMarginData = _data;
    }

    showContent(value) {
        if (this.modelContent[value]) {
            this.modelContent[value] = 0;
        } else {
            this.modelContent[value] = 1;
        }
    }

    //下拉刷新
    doRefresh(refresher: Refresher) {
        let num = this.C2BType;
        setTimeout(() => {
            //总数据
            switch (num) {
                //引入
                case 1:
                    //总额
                    this.loadData(Endpoint.saleTotal, CacheField.saleTotal, refresher);
                    this.loadData(Endpoint.saleChannelInOut, CacheField.saleChannelIn, refresher, null, {
                        dataType: this.saleChannelTypeIn,
                        inoutFlag: this.inoutFlag
                    });
                    this.loadData(Endpoint.assetsInOut, CacheField.assetsInOut, refresher, null, {inoutFlag: this.inoutFlag});
                    break;
                //销售
                case 2:
                    this.loadData(Endpoint.saleTotal, CacheField.saleTotal, refresher);
                    this.loadData(Endpoint.saleChannelInOut, CacheField.saleChannelOut, refresher, null, {
                        dataType: this.saleChannelTypeOut,
                        inoutFlag: this.inoutFlag
                    });
                    this.loadData(Endpoint.assetsInOut, CacheField.assetsInOut, refresher, null, {inoutFlag: this.inoutFlag});
                    break;
                //远营分析
                case 3:
                    this.loadData(Endpoint.assetsMain, CacheField.assetsMain, refresher);
                    this.loadData(Endpoint.profitData, CacheField.profitData, refresher);
                    this.loadData(Endpoint.assetsHealthy, CacheField.assetsHealthy, refresher);
                    this.loadData(Endpoint.grossMargin, CacheField.grossMargin);
                    break;
            }

        }, 500);
    }

    goSegment() {
        let num = this.C2BType;
        this.mainSlides.slideTo(this.C2BTypeValue.indexOf(num));
        switch (this.C2BType) {
            //引入额
            case 1:
                this.modelContent = [1, 0, 0, 0];
                break;
            //销售额
            case 2:
                this.modelContent = [0, 1, 0, 0];
                break;
            //运营分析
            case 3:
                this.modelContent = [0, 0, 1, 1];
                break;
        }
    }

    saleChannelSegmentIn() {
        this.getDataFromCache(Endpoint.saleChannelInOut, CacheField.saleChannelIn, this.saleChannelTypeIn);
    }

    saleChannelSegmentOut() {
        this.getDataFromCache(Endpoint.saleChannelInOut, CacheField.saleChannelOut, this.saleChannelTypeOut);
    }

    slideChange() {
        let active = this.mainSlides.getActiveIndex();
        let total = this.mainSlides.length();
        if (active == total) return;
        this.C2BType = this.C2BTypeValue[active];
        switch (this.C2BType) {
            //引入额
            case 1:
                this.inoutFlag = 'in';
                this.getDataFromCache(Endpoint.saleTotal, CacheField.saleTotal);
                this.getDataFromCache(Endpoint.saleChannelInOut, CacheField.saleChannelIn, this.saleChannelTypeIn);
                this.getDataFromCache(Endpoint.assetsInOut, CacheField.assetsInOut, this.inoutFlag);
                break;
            //销售额
            case 2:
                this.inoutFlag = 'out';
                this.getDataFromCache(Endpoint.saleTotal, CacheField.saleTotal);
                this.getDataFromCache(Endpoint.saleChannelInOut, CacheField.saleChannelOut, this.saleChannelTypeOut);
                this.getDataFromCache(Endpoint.assetsInOut, CacheField.assetsInOut, this.inoutFlag);
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
}