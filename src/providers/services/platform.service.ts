import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage'
import moment from 'moment';

import {Api} from '../api';
import {CacheField} from '../cache-field';

import {GlobalVars} from '../services/global.service';
import {PublicFactory} from '../factory/public.factory';
import {ListPipe} from '../../providers/pipes/list.pipe';

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
                public storage: Storage,) {
        //从本地存储中取数据
        this.storage.get(CacheField.platformTotal).then((data)=> {
            if (!!data) {
                this.totalData = data;
            }
        });
        //从本地存储中取平台比较数据
        this.storage.get(CacheField.platformsCompare).then((data) => {
            if (!!data) {
                this.platformsCompareData = data;
            }
        });
        //从本地存储中取平台比较数据
        this.storage.get(CacheField.platformTrend).then((data) => {
            if (!!data) {
                this.trendData = data;
            }
        });
        //从本地存储中取出竞品平台比较数据
        this.storage.get(CacheField.enemyPlatformsCompare).then((data) => {
            if (!!data) {
                this.enemyPlatformsCompareData = data;
            }
        });
        //从本地存储中取出竞品柱状图数据
        this.storage.get(CacheField.enemyBar).then((data) => {
            if (!!data) {
                this.enemyBarData = data;
            }
        });
        //从本地存储中取出传统理财渠道收益对比数据
        this.storage.get(CacheField.regularCompare).then((data) => {
            if (!!data) {
                this.regularCompareData = data;
            }
        });
        //从本地存储中取出传统理财渠道收益对比数据
        this.storage.get(CacheField.regularTrend).then((data) => {
            if (!!data) {
                this.regularTrendData = data;
            }
        });
        //从本地存储中取出传统理财手线图数据
        this.storage.get(CacheField.fundTrend).then((data) => {
            if (!!data) {
                this.fundTrendData = data;
            }
        });
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
        console.log(_sendData)
        //发起请求
        let req = this.api.post(endpoint, _sendData).share();
        req.map(res => res.json())
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
                        temp[_res.dataType] = _res.data.list;
                        //添加时间戳
                        Object.assign(temp, {stamp: _thisTime});
                        _res.data = temp;
                        break;

                    //==> 网金成交额折线图
                    case CacheField.platformTrend:
                        _cacheData = this.trendData;
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
                        _enemyData[_res.dataType] = _res.data.list;
                        //添加时间戳
                        Object.assign(_enemyData, {stamp: _thisTime});
                        _res.data = _enemyData;
                        break;

                    //==> 竞品成交额折线图
                    case CacheField.enemyBar:
                        _cacheData = this.enemyBarData;
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
                        Object.assign(_regularData, {stamp: _thisTime});
                        _res.data = _regularData;
                        break;

                    //==> 传统理财折线图
                    case CacheField.regularTrend:
                        _cacheData = this.regularTrendData;
                        //添加时间戳
                        Object.assign(_res.data, {stamp: _thisTime});
                        break;

                    //==> 基金折线图
                    case CacheField.fundTrend:
                        _cacheData = this.fundTrendData;
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
            });
        return req
    }

    /**
     * @比较本地数据的时间戳
     * @getValue(本地存储key)
     * */
    getValue(key) {
        let _data: any;
        switch (key) {
            case CacheField.platformTotal:
                //调用公共方法中的对比时间戳方法,得到返回的数据
                _data = this.publicFactory.checkValueStamp(this.totalData);
                break;
            case CacheField.platformsCompare:
                _data = this.publicFactory.checkValueStamp(this.platformsCompareData);
                break;
            case CacheField.platformTrend:
                _data = this.publicFactory.checkValueStamp(this.trendData);
                break;
            case CacheField.enemyPlatformsCompare:
                _data = this.publicFactory.checkValueStamp(this.enemyPlatformsCompareData);
                break;
            case CacheField.enemyBar:
                _data = this.publicFactory.checkValueStamp(this.enemyBarData);
                break;
            case CacheField.regularCompare:
                _data = this.publicFactory.checkValueStamp(this.regularCompareData);
                break;
            case CacheField.regularTrend:
                _data = this.publicFactory.checkValueStamp(this.regularTrendData);
                break;
            case CacheField.fundTrend:
                _data = this.publicFactory.checkValueStamp(this.fundTrendData);
                break;
        }
        if (!!_data) {
            return _data;
        } else {
            return false;
        }
    }
}