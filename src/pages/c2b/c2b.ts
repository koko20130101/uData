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
    lineChartOption_1: any;
    lineChartOption_2: any;
    chartData: any;
    lineChartData: any;

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
        //设置图表数据
        this.barChartOption = chartOptions.BarChartOption_2();
        this.lineChartOption_1 = chartOptions.LineChartOption_1();
        this.lineChartOption_2 = chartOptions.LineChartOption_1();

        this.chartData = [[144, 556, 66, 666, 993, 333, 444], [200, 32, 444, 666, 88, 352, 380]];
        this.lineChartData = [[0, 0, 0, 0, 0, 0, 0]];
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
        // this.getDataFromCache(Endpoint.saleTotal, CacheField.saleTotal);
        // this.getDataFromCache(Endpoint.saleChannelInOut, CacheField.saleChannelIn);
        this.getDataFromCache(Endpoint.assetsInOut, CacheField.assetsInOut);
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
                    _sendData = {dataType: parseInt(this.saleChannelTypeIn), inoutFlag: this.inoutFlag};
                    break;
                }
            //销售渠道分布
            case CacheField.saleChannelOut:
                if (!!_cacheData && !!_cacheData[this.saleChannelTypeOut]) {
                    this.saleChannelDataOut = _cacheData;
                    return;
                } else {
                    _sendData = {dataType: parseInt(this.saleChannelTypeOut), inoutFlag: this.inoutFlag};
                    break;
                }
            //折线图
            case CacheField.assetsInOut:
                if (!!_cacheData && !!_cacheData[this.inoutFlag]) {
                    this.assetsInOutData = _cacheData;
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
                    this.profitData = _cacheData;
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
                    case CacheField.assetsInOut:
                        this.assetsInOutData = res._body.data;
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
                        this.setBarChartOption(res._body.data);
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

    /**
     * 格式化柱状图
     * loadData(本地或远程数据)
     * */
    setBarChartOption(_data: any) {
        let _timeOut = setTimeout(function () {
            //得到柱状图实例的设置
            let _options = this.barChartInstance.getOption();
            let _concat = _options.series[2].data.concat(_options.series[3].data);  //合并数据
            let topNumberRight = Math.ceil(Math.max.apply(Math, _concat)); //取最大值：获取X轴右侧的最大值
            _options.xAxis.min = -topNumberRight * 4 / 5;
            _options.xAxis.max = topNumberRight;

            for (let i = 0; i < _options.series[0].data.length; i++) {
                _options.series[0].data[i] = _data.series[0][i] * -1
            }
            for (let i = 0; i < _options.series[1].data.length; i++) {
                _options.series[1].data[i] = _data.series[1][i] * -1
            }
            for (let i = 0; i < _options.series[4].data.length; i++) {
                _options.series[4].data[i] = Math.round(_data.series[4][i] / 20 * topNumberRight * -1)
            }
            for (let i = 0; i < _options.series[5].data.length; i++) {
                _options.series[5].data[i] = Math.round(_data.series[5][i] / 20 * topNumberRight)
            }
            //修改设置：1、格式化label  2、格式化tips
            for (let i = 0; i < _options.series.length; i++) {
                _options.series[i].label.normal.formatter = _options.series[i].label.emphasis.formatter = function (params: any) {
                    let num = _data.yAxis[0].data.indexOf(params.name);
                    if (params.seriesName == '引入利率') {
                        return _data.series[4][num] + '%';
                    } else if (params.seriesName == '销售利率') {
                        return _data.series[5][num] + '%';
                    } else if (params.seriesName == '存量') {
                        return this.publicFactory.moneyFormat(Math.abs(params.value - _data.series[0][num]))
                    } else if (params.seriesName == '回滚') {
                        return this.publicFactory.moneyFormat(Math.abs(params.value + _data.series[3][num]), true)
                    } else {
                        return this.publicFactory.moneyFormat(Math.abs(params.value), true)
                    }
                }.bind(this);
                //console.log($scope.myChart.bar_option)
                _options.tooltip[0].formatter = function (params) {
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
                // _options.series[i].data = _data.series[i];
            }
            this.barChartInstance.setOption(_options);
            clearTimeout(_timeOut);
        }.bind(this), 100);
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
                    this.loadData(Endpoint.saleChannelInOut, CacheField.saleChannelIn, refresher, null, {inoutFlag: this.inoutFlag});
                    this.loadData(Endpoint.assetsInOut, CacheField.assetsInOut, refresher, null, {inoutFlag: this.inoutFlag});
                    break;
                //
                case 2:
                    this.loadData(Endpoint.saleTotal, CacheField.saleTotal, refresher);
                    this.loadData(Endpoint.saleChannelInOut, CacheField.saleChannelOut, refresher, null, {inoutFlag: this.inoutFlag});
                    this.loadData(Endpoint.assetsInOut, CacheField.assetsInOut, refresher, null, {inoutFlag: this.inoutFlag});
                    break;
                //传统理财
                case 3:
                    // this.loadData(Endpoint.assetsMain, CacheField.assetsMain, refresher);
                    this.loadData(Endpoint.profitData, CacheField.profitData, refresher);
                    // this.loadData(Endpoint.assetsHealthy, CacheField.assetsHealthy,refresher);
                    // this.loadData(Endpoint.grossMargin, CacheField.grossMargin);
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
                // this.getDataFromCache(Endpoint.assetsMain, CacheField.assetsMain);
                this.getDataFromCache(Endpoint.profitData, CacheField.profitData);
                // this.getDataFromCache(Endpoint.assetsHealthy, CacheField.assetsHealthy);
                // this.getDataFromCache(Endpoint.grossMargin, CacheField.grossMargin);
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