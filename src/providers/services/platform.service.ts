import {Injectable} from '@angular/core';
import moment from 'moment';

import {Api} from '../api/api';
import {CacheField} from '../api/cache-field';

import {GlobalVars} from './global.service';
import {PublicFactory} from '../factories/public.factory';
import {StorageFactory} from '../factories/storage.factory';
import {ListPipe} from '../../pipes/list/list';

@Injectable()
export class PlatformService {

    //初始化总金额
    totalData: any = {};
    //各平台间的比较
    platformsCompareData: any = {};
    enemyPlatformsCompareData: any = {};
    //折线图数据
    trendData: any = {};
    //折线图数据
    enemyBarData: any = {};
    //传统理财渠道收益对比
    regularCompareData: any = {};
    //传统理财折线图
    regularTrendData: any = {};
    //基金折线图
    fundTrendData: any = {};

    constructor(public publicFactory: PublicFactory,
                public api: Api,
                public globalVars: GlobalVars,
                public listPipe: ListPipe,
                public storage: StorageFactory) {
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
        //发起请求
        let req = this.api.post(endpoint, _sendData).share();
        req.map(res =>res.json())
            .subscribe(res => {
                let _res: any = res;
                //当前时间
                let _thisTime = moment().unix();
                let _cacheData: any;

                switch (cacheKey) {
                    //==> 总额
                    case CacheField.platformTotal:
                        _cacheData = this.totalData;
                        //格式化数据
                        for (let key in _res.data) {
                            // console.log(key)
                            _res.data[key][0] = this.publicFactory.moneyFormatToHtml(_res.data[key][0]);
                            // console.log(_res[key][0])
                        }
                        //添加时间戳
                        Object.assign(_res.data, {stamp: _thisTime});
                        break;

                    //==> 网金平台指数排行
                    case CacheField.platformsCompare:
                        _cacheData = this.platformsCompareData;
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

                    //==> 网金成交额折线图
                    case CacheField.platformTrend:
                        _cacheData = this.trendData;
                        _res.data = this.handleValue(_res.data);
                        //添加时间戳
                        Object.assign(_res.data, {stamp: _thisTime});
                        break;

                    //==> 竞品平台指数排行
                    case CacheField.enemyPlatformsCompare:
                        _cacheData = this.enemyPlatformsCompareData;
                        if (_res.dataType == 2) {
                            //格式化数据
                            for (let item of _res.data.list) {
                                item.number = this.publicFactory.moneyFormatToHtml(item.number);
                            }
                        }
                        //通过管道排序:1为降序，0为升序
                        _res.data.list = this.listPipe.orderBy(_res.data.list, ['percent'], 1);
                        let _enemyData: any = {};
                        _enemyData[_res.dataType] = _res.data;
                        //添加时间戳
                        Object.assign(_enemyData[_res.dataType], {stamp: _thisTime});
                        _res.data = _enemyData;
                        break;

                    //==> 竞品成交额柱状图
                    case CacheField.enemyBar:
                        _cacheData = this.enemyBarData;//处理数据
                        _res.data = this.handleValue(_res.data);
                        //添加时间戳
                        Object.assign(_res.data, {stamp: _thisTime});
                        break;

                    //==> 传统理财和基金 渠道收益对比
                    case CacheField.regularCompare:
                        _cacheData = this.regularCompareData;
                        //通过管道排序:1为降序，0为升序
                        _res.data.list = this.listPipe.orderBy(_res.data.list, ['percent'], 1);
                        let _regularData: any = {};
                        _regularData[_res.sourceType] = _res.data.list;
                        //添加时间戳
                        Object.assign(_regularData[_res.sourceType], {stamp: _thisTime});
                        _res.data = _regularData;
                        break;

                    //==> 传统理财折线图
                    case CacheField.regularTrend:
                        _cacheData = this.regularTrendData;
                        let _regularRate: any = {};
                        _regularRate[_res.dataType] = this.handleValue(_res.data);
                        //添加时间戳
                        Object.assign(_regularRate[_res.dataType], {stamp: _thisTime});
                        _res.data = _regularRate;
                        break;

                    //==> 基金折线图
                    case CacheField.fundTrend:
                        _cacheData = this.fundTrendData;
                        _res.data = this.handleValue(_res.data);
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
                    case CacheField.platformTotal:
                        this.totalData = _cacheData;
                        break;
                    case CacheField.platformsCompare:
                        this.platformsCompareData = _cacheData;
                        break;
                    case CacheField.platformTrend:
                        this.trendData = _cacheData;
                        break;
                    case CacheField.enemyPlatformsCompare:
                        this.enemyPlatformsCompareData = _cacheData;
                        break;
                    case CacheField.enemyBar:
                        this.enemyBarData = _cacheData;
                        break;
                    case CacheField.regularCompare:
                        this.regularCompareData = _cacheData;
                        break;
                    case CacheField.regularTrend:
                        this.regularTrendData = _cacheData;
                        break;
                    case CacheField.fundTrend:
                        this.fundTrendData = _cacheData;
                        break;
                    default:
                        _cacheData = {};
                        break;
                }
                //存储到本地
                this.storage.set(cacheKey, _cacheData);
            },err=>{
                console.log(err)
            });
        return req
    }

    /**
     * @比较本地数据的时间戳
     * @getValue(本地存储key)
     * */
    getValue(key,source?:any) {
        let _data: any;
        return new Promise((resolve, reject)=> {
            switch (key) {
                case CacheField.platformTotal:
                    console.log(this.totalData)
                    //提取本地存储
                    this.storage.get(key).then((data) => {
                        if(!!data){
                            this.totalData = data;
                            //调用公共方法中的对比时间戳方法,得到返回的数据
                            _data = this.publicFactory.checkValueStamp(this.totalData);
                            resolve(_data)
                        }else{
                            resolve(false);
                        }
                    });
                    break;
                case CacheField.platformsCompare:
                    //从本地存储中取平台比较数据
                    this.storage.get(key).then((data) => {
                        if(!!data){
                            this.platformsCompareData = data;
                            _data = this.publicFactory.checkValueStamp(this.platformsCompareData,false,[source]);
                            resolve(_data.list)
                        }else{
                            resolve(false);
                        }
                    });
                    break;
                case CacheField.platformTrend:
                    //从本地存储中取平台比较数据
                    this.storage.get(key).then((data) => {
                        if(!!data){
                            this.trendData = data;
                            _data = this.publicFactory.checkValueStamp(this.trendData);
                            resolve(_data)
                        }else{
                            resolve(false);
                        }
                    });
                    break;
                case CacheField.enemyPlatformsCompare:
                    //从本地存储中取出竞品平台比较数据
                    this.storage.get(key).then((data) => {
                        if(!!data){
                            this.enemyPlatformsCompareData = data;
                            _data = this.publicFactory.checkValueStamp(this.enemyPlatformsCompareData,false,[source]);
                            resolve(_data.list)
                        }else{
                            resolve(false);
                        }
                    });
                    break;
                case CacheField.enemyBar:
                    //从本地存储中取出竞品柱状图数据
                    this.storage.get(key).then((data) => {
                        if(!!data){
                            this.enemyBarData = data;
                            _data = this.publicFactory.checkValueStamp(this.enemyBarData);
                            resolve(_data)
                        }else{
                            resolve(false);
                        }
                    });
                    break;
                case CacheField.regularCompare:
                    //从本地存储中取出传统理财渠道收益对比数据
                    this.storage.get(key).then((data) => {
                        if(!!data){
                            this.regularCompareData = data;
                            _data = this.publicFactory.checkValueStamp(this.regularCompareData,false,[source]);
                            resolve(_data)
                        }else{
                            resolve(false);
                        }
                    });
                    break;
                case CacheField.regularTrend:
                    //从本地存储中取出传统理财渠道收益对比数据
                    this.storage.get(key).then((data) => {
                        if(!!data){
                            this.regularTrendData = data;
                            _data = this.publicFactory.checkValueStamp(this.regularTrendData,false,[source]);
                            resolve(_data)
                        }else{
                            resolve(false);
                        }
                    });
                    break;
                case CacheField.fundTrend:
                    //从本地存储中取出传统理财手线图数据
                    this.storage.get(key).then((data) => {
                        if(!!data){
                            this.fundTrendData = data;
                            _data = this.publicFactory.checkValueStamp(this.fundTrendData);
                            resolve(_data)
                        }else{
                            resolve(false);
                        }
                    });
                    break;
            }
        });
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
                case 'bank':
                    _newData.xAxis.push({data: _data['bank']});
                    break;
                case 'data':
                    _newData.series.push(_data['data_' + _key[1]]);
                    break;
            }
        }
        return  _newData;
    }
}