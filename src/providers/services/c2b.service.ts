import {Injectable} from '@angular/core';
import moment from 'moment';

import {Api} from '../api/api';
import {CacheField} from '../api/cache-field'

import {GlobalVars} from './global.service';
import {PublicFactory} from '../factories/public.factory';
import {StorageFactory} from '../factories/storage.factory';
import {ListPipe} from '../../pipes/list/list';

@Injectable()
export class C2bService {

    //引入额和销售额的总数
    saleData: any = {};
    saleChannelDataIn: any = {};
    saleChannelDataOut: any = {};
    assetsInOutData: any = {};
    assetsMainData: any = {};
    profitData: any = {};
    assetsHealthyData: any = {};
    grossMarginData: any = {};

    constructor(public api: Api,
                public globalVars: GlobalVars,
                public publicFactory: PublicFactory,
                public listPipe: ListPipe,
                public storage: StorageFactory) {
    }

    private handleValue(_data:any){
        let _newData: any = {
            legend: [],
            xAxis: [],
            yAxis: [],
            series: []
        };
        //处理数据
        for (let key in _data) {
            let _key = key.split('_');
            switch (_key[0]) {
                case 'name':
                    _newData.legend = _data['name'];
                    break;
                case 'time':
                    _newData.xAxis.push({data: _data['time']});
                    break;
                case 'data':
                    _newData.series.push(_data['data_' + _key[1]]);
                    break;
            }
        }
        return  _newData;
    }

    /**
     * 从服务器请求数据
     * loadValue(接口，本地存储key,post数据)
     * */
    loadValue(endpoint, cacheKey, sendData?: any) {
        let _instance = this.globalVars.getInstance();
        let _sendData = {
            type: _instance.dateInfo.unit.tip,
            now: _instance.dateInfo.sendDate
        };
        if (!!sendData) {
            Object.assign(_sendData, sendData);
        }
        // console.log(_sendData);
        //发起请求
        let req = this.api.post(endpoint, _sendData).share();
        req.map(res => res.json())
            .subscribe(res => {
                let _res: any = res;
                //当前时间
                let _thisTime = moment().unix();
                let _cacheData: any;
                let _newData: any = {
                    xAxis: [],
                    yAxis: [],
                    series: []
                };

                switch (cacheKey) {
                    //==> 总额
                    case CacheField.saleTotal:
                        _cacheData = this.saleData;
                        //格式化数据
                        for (let key in _res.data) {
                            // console.log(key)
                            _res.data[key][0] = this.publicFactory.moneyFormatToHtml(_res.data[key][0]);
                            // console.log(_res[key][0])
                        }
                        //添加时间戳
                        Object.assign(_res.data, {stamp: _thisTime});
                        break;

                    //==> 引入渠道分布
                    case CacheField.saleChannelIn:
                        _cacheData = this.saleChannelDataIn;
                        if (_res.dataType == 2) {
                            //格式化数据
                            for (let item of _res.data.list) {
                                item.number = this.publicFactory.moneyFormatToHtml(item.number);
                            }
                        }
                        //通过管道排序:1为降序，0为升序
                        _res.data.list = this.listPipe.orderBy(_res.data.list, ['percent'], 1);
                        let temp: any = {};
                        temp[_res.dataType] = _res.data;
                        //添加时间戳
                        Object.assign(temp[_res.dataType], {stamp: _thisTime});
                        _res.data = temp;
                        break;

                    //==> 销售渠道分布
                    case CacheField.saleChannelOut:
                        _cacheData = this.saleChannelDataOut;
                        if (_res.dataType == 2) {
                            //格式化数据
                            for (let item of _res.data.list) {
                                item.number = this.publicFactory.moneyFormatToHtml(item.number);
                            }
                        }
                        //通过管道排序:1为降序，0为升序
                        _res.data.list = this.listPipe.orderBy(_res.data.list, ['percent'], 1);
                        let _channelOut: any = {};
                        _channelOut[_res.dataType] = _res.data;
                        //添加时间戳
                        Object.assign(_channelOut[_res.dataType], {stamp: _thisTime});
                        _res.data = _channelOut;
                        break;

                    //==> 引入额及销售额折线图
                    case CacheField.assetsInOut:
                        _cacheData = this.assetsInOutData;
                        let _assetsData: any = {};
                        _assetsData[_res.dataType] = this.handleValue(_res.data);
                        //添加时间戳
                        Object.assign(_assetsData[_res.dataType], {stamp: _thisTime});
                        _res.data = _assetsData;
                        break;

                    //==> 资产运营总额
                    case CacheField.assetsMain:
                        _cacheData = this.assetsMainData;
                        //格式化数据
                        for (let key in _res.data) {
                            _res.data[key] = this.publicFactory.moneyFormatToHtml(_res.data[key], true);
                        }
                        //添加时间戳
                        Object.assign(_res.data, {stamp: _thisTime});
                        break;

                    //==> 资产总额对比折线图
                    case CacheField.profitData:
                        _cacheData = this.profitData;
                        _newData.series[0] = _res.data.series[5].data;
                        _newData.series[1] = _res.data.series[2].data;
                        _newData.series[2] = _res.data.series[3].data;
                        _newData.series[3] = _res.data.series[4].data;
                        _newData.series[4] = _res.data.series[1].data;
                        _newData.series[5] = _res.data.series[0].data;
                        _newData.yAxis.push({data: _res.data.yAxis[0].ydata});

                        _res.data = _newData;
                        //添加时间戳
                        Object.assign(_res.data, {stamp: _thisTime});
                        break;

                    //==> 资产健康值折线图
                    case CacheField.assetsHealthy:
                        _cacheData = this.assetsHealthyData;
                        _res.data = this.handleValue(_res.data);
                        //添加时间戳
                        Object.assign(_res.data, {stamp: _thisTime});
                        break;

                    //==> 毛利率折线图
                    case CacheField.grossMargin:
                        _cacheData = this.grossMarginData;
                        //格式化数据
                        for (let i=0;i< _res.data['grossProfit'].length;i++) {
                            _res.data['grossProfit'][i] = this.publicFactory.moneyFormatToHtml(_res.data['grossProfit'][i])
                        }
                        _newData['total'] = this.publicFactory.moneyFormatToHtml(_res.data['total']);
                        _newData['grossProfit'] = _res.data['grossProfit'];
                        Object.assign(_newData, this.handleValue(_res.data));
                        //处理数据
                        _res.data = _newData;
                        //添加时间戳
                        Object.assign(_res.data, {stamp: _thisTime});
                        break;
                    default:
                        _cacheData = {};
                        break;
                }

                //如果本地总数据超过60天(5184000 秒),则清空数据
                if (!_cacheData.stamp || _cacheData.stamp + _instance.cacheTime.long < _thisTime) {
                    _cacheData = {};
                    Object.assign(_cacheData, {stamp: _thisTime});
                }
                if (!!_cacheData[_instance.dateInfo.currentDate]) {
                    Object.assign(_cacheData[_instance.dateInfo.currentDate], _res.data);
                } else {
                    _cacheData[_instance.dateInfo.currentDate] = _res.data;
                }

                //重新赋值
                switch (cacheKey) {
                    case CacheField.saleTotal:
                        this.saleData = _cacheData;
                        break;
                    case CacheField.saleChannelIn:
                        this.saleChannelDataIn = _cacheData;
                        break;
                    case CacheField.saleChannelOut:
                        this.saleChannelDataOut = _cacheData;
                        break;
                    case CacheField.assetsInOut:
                        this.assetsInOutData = _cacheData;
                        break;
                    case CacheField.assetsMain:
                        this.assetsMainData = _cacheData;
                        break;
                    case CacheField.profitData:
                        this.profitData = _cacheData;
                        break;
                    case CacheField.assetsHealthy:
                        this.assetsHealthyData = _cacheData;
                        break;
                    case CacheField.grossMargin:
                        this.grossMarginData = _cacheData;
                        break;
                    default:
                        break;
                }

                //存储到本地
                this.storage.set(cacheKey, _cacheData);

            },err=>{
            });
        return req;
    }

    /**
     * @比较本地数据的时间戳
     * @getValue(本地存储key,资源标识)
     * */
    getValue(key,source?:any) {
        let _data: any;
        return new Promise((resolve, reject)=> {
            switch (key) {
                case CacheField.saleTotal:
                    //调用公共方法中的对比时间戳方法,得到返回的数据
                    //提取本地存储
                    this.storage.get(key).then((data) => {
                        if(!!data){
                            this.saleData = data;
                            //调用公共方法中的对比时间戳方法,得到返回的数据
                            _data = this.publicFactory.checkValueStamp(this.saleData);
                            resolve(_data)
                        }else{
                            resolve(false);
                        }
                    });
                    break;
                case CacheField.saleChannelIn:
                    this.storage.get(key).then((data) => {
                        if(!!data){
                            this.saleChannelDataIn = data;
                            _data = this.publicFactory.checkValueStamp(this.saleChannelDataIn,false,[source]);
                            resolve(_data.list)
                        }else{
                            resolve(false);
                        }
                    });
                    break;
                case CacheField.saleChannelOut:
                    this.storage.get(key).then((data) => {
                        if(!!data){
                            this.saleChannelDataOut = data;
                            _data = this.publicFactory.checkValueStamp(this.saleChannelDataOut,false,[source]);
                            resolve(_data.list)
                        }else{
                            resolve(false);
                        }
                    });
                    break;
                case CacheField.assetsInOut:
                    this.storage.get(key).then((data) => {
                        if(!!data){
                            this.assetsInOutData = data;
                            _data = this.publicFactory.checkValueStamp(this.assetsInOutData,false,[source]);
                            resolve(_data)
                        }else{
                            resolve(false);
                        }
                    });
                    break;
                case CacheField.assetsMain:
                    this.storage.get(key).then((data) => {
                        if(!!data){
                            this.assetsMainData = data;
                            _data = this.publicFactory.checkValueStamp(this.assetsMainData,true);
                            resolve(_data)
                        }else{
                            resolve(false);
                        }
                    });
                    break;
                case CacheField.profitData:
                    this.storage.get(key).then((data) => {
                        if(!!data){
                            this.profitData = data;
                            _data = this.publicFactory.checkValueStamp(this.profitData,true);
                            resolve(_data)
                        }else{
                            resolve(false);
                        }
                    });
                    break;
                case CacheField.assetsHealthy:
                    this.storage.get(key).then((data) => {
                        if(!!data){
                            this.assetsHealthyData = data;
                            _data = this.publicFactory.checkValueStamp(this.assetsHealthyData,true);
                            resolve(_data)
                        }else{
                            resolve(false);
                        }
                    });
                    break;
                case CacheField.grossMargin:
                    this.storage.get(key).then((data) => {
                        if(!!data){
                            this.grossMarginData = data;
                            _data = this.publicFactory.checkValueStamp(this.grossMarginData,true);
                            resolve(_data)
                        }else{
                            resolve(false);
                        }
                    });
                    break;
                default:
                    break;
            }
        });
    }
}