import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import moment from 'moment';

import {Api} from '../api';
import {CacheField} from '../cache-field';
import {GlobalVars} from '../services/global.service';

import {PublicFactory} from '../factory/public.factory';

@Injectable()
export class BankService {
    bankTotalData: any = {};
    bankMoneyData: any = {};
    bankChannelData: any = {};
    bankTotalSecData: any = {};
    bankRateTrendSecData: any = {};
    bankAssetsTypeData: any = {};
    bankTrendRateData: any = {};
    bankTrendTermData: any = {};
    bankTrendDealData: any = {};

    constructor(public api: Api,
                public publicFactory: PublicFactory,
                public globalVars: GlobalVars,
                public storage: Storage) {
        this.storage.get(CacheField.bankTotal).then((data) => {
            if (!!data) {
                this.bankTotalData = data;
            }
        });
        this.storage.get(CacheField.bankMoney).then((data) => {
            if (!!data) {
                this.bankMoneyData = data;
            }
        });
        this.storage.get(CacheField.bankChannel).then((data) => {
            if (!!data) {
                this.bankChannelData = data;
            }
        });
        this.storage.get(CacheField.bankTotalSec).then((data) => {
            if (!!data) {
                this.bankTotalSecData = data;
            }
        });
        this.storage.get(CacheField.bankRateTrendSec).then((data) => {
            if (!!data) {
                this.bankRateTrendSecData = data;
            }
        });
        this.storage.get(CacheField.bankAssetsType).then((data) => {
            if (!!data) {
                this.bankAssetsTypeData = data;
            }
        });
        this.storage.get(CacheField.bankTrendRate).then((data) => {
            if (!!data) {
                this.bankTrendRateData = data;
            }
        });
        this.storage.get(CacheField.bankTrendTerm).then((data) => {
            if (!!data) {
                this.bankTrendTermData = data;
            }
        });
        this.storage.get(CacheField.bankTrendDeal).then((data) => {
            if (!!data) {
                this.bankTrendDealData = data;
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
        //发起请求
        let req = this.api.post(endpoint, _sendData).share();
        req.map(res => res.json())
            .subscribe(res => {
                let _res: any = res;
                //当前时间
                let _thisTime = moment().unix();
                let _cacheData: any;
                let _newData: any = {
                    legend: [],
                    xAxis: [],
                    yAxis: [],
                    series: []
                };

                switch (cacheKey) {
                    //==> 总额
                    case CacheField.bankTotal:
                        _cacheData = this.bankTotalData;
                        //格式化数据
                        _res.data['total'][0] = this.publicFactory.moneyFormatToHtml(_res.data['total'][0]);
                        _res.data['AverageTerm'][0] = Math.floor(_res.data['AverageTerm'][0]);
                        _res.data['time'][0] = this.publicFactory.formatTime(_res.data['time'][0]*1000);
                        let _bankTotal: any = {};
                        _bankTotal[sendData.BankCode] = _res.data;

                        //添加时间戳
                        Object.assign(_bankTotal[sendData.BankCode], {stamp: _thisTime});
                        _res.data = _bankTotal;
                        break;

                    //==> 平台交易额折线图
                    case CacheField.bankMoney:
                        _cacheData = this.bankMoneyData;
                        //处理数据
                        _res.data = this.handleValue(_res.data);
                        //添加时间戳
                        Object.assign(_res.data, {stamp: _thisTime});
                        break;

                    //==> 渠道占比饼图
                    case CacheField.bankChannel:
                        _cacheData = this.bankChannelData;
                        //处理数据
                        for (let item of _res.data.list) {
                            _newData.legend.push(item.name);
                        }
                        _newData.series.push(_res.data.list);
                        _res.data = _newData;
                        //添加时间戳
                        Object.assign(_res.data, {stamp: _thisTime});
                        break;

                    //==> 二级市场交易总额
                    case CacheField.bankTotalSec:
                        _cacheData = this.bankTotalSecData;
                        _res.data['secReleaseNumber'][0] = this.publicFactory.moneyFormatToHtml(_res.data['secReleaseNumber'][0]);
                        _res.data['secDealNumber'][0] = this.publicFactory.moneyFormatToHtml(_res.data['secDealNumber'][0]);
                        _res.data['averageTime'][0] = this.publicFactory.formatTime(_res.data['averageTime'][0]*1000);
                        //添加时间戳
                        Object.assign(_res.data, {stamp: _thisTime});
                        break;

                    //==> 二级市场利率趋势图
                    case CacheField.bankRateTrendSec:
                        _cacheData = this.bankRateTrendSecData;
                        //处理数据
                        _res.data = this.handleValue(_res.data);
                        //添加时间戳
                        Object.assign(_res.data, {stamp: _thisTime});
                        break;

                    //==> 银行资产类型
                    case CacheField.bankAssetsType:
                        _cacheData = this.bankAssetsTypeData;
                        //处理数据
                        for (let item of _res.data.list) {
                            _newData.legend.push(item.name);
                        }
                        _newData.series.push(_res.data.list);
                        _res.data = _newData;
                        //添加时间戳
                        Object.assign(_res.data, {stamp: _thisTime});
                        break;

                    //==> 项目走势 > 收益率走势
                    case CacheField.bankTrendRate:
                        _cacheData = this.bankTrendRateData;
                        //处理数据
                        _res.data = this.handleValue(_res.data);
                        //添加时间戳
                        Object.assign(_res.data, {stamp: _thisTime});
                        break;

                    //==> 项目走势 > 期限走势
                    case CacheField.bankTrendTerm:
                        _cacheData = this.bankTrendTermData;
                        //处理数据
                        _res.data = this.handleValue(_res.data);
                        //添加时间戳
                        Object.assign(_res.data, {stamp: _thisTime});
                        break;

                    //==> 项目走势 > 发布规模走势
                    case CacheField.bankTrendDeal:
                        _cacheData = this.bankTrendDealData;
                        //处理数据
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
                    case CacheField.bankTotal:
                        this.bankTotalData = _cacheData;
                        break;
                    case CacheField.bankMoney:
                        this.bankMoneyData = _cacheData;
                        break;
                    case CacheField.bankChannel:
                        this.bankChannelData = _cacheData;
                        break;
                    case CacheField.bankTotalSec:
                        this.bankTotalSecData = _cacheData;
                        break;
                    case CacheField.bankRateTrendSec:
                        this.bankRateTrendSecData = _cacheData;
                        break;
                    case CacheField.bankAssetsType:
                        this.bankAssetsTypeData = _cacheData;
                        break;
                    case CacheField.bankTrendRate:
                        this.bankTrendRateData = _cacheData;
                        break;
                    case CacheField.bankTrendTerm:
                        this.bankTrendTermData = _cacheData;
                        break;
                    case CacheField.bankTrendDeal:
                        this.bankTrendDealData = _cacheData;
                        break;
                    default:
                        _cacheData = {};
                        break;
                }
                //存储到本地
                this.storage.set(cacheKey, _cacheData);
            },err=>{

            });
        return req
    }

    getValue(key) {
        let _data: any;
        switch (key) {
            case CacheField.bankTotal:
                _data = this.publicFactory.checkValueStamp(this.bankTotalData);
                break;
            case CacheField.bankMoney:
                _data = this.publicFactory.checkValueStamp(this.bankMoneyData);
                break;
            case CacheField.bankChannel:
                _data = this.publicFactory.checkValueStamp(this.bankChannelData);
                break;
            case CacheField.bankTotalSec:
                _data = this.publicFactory.checkValueStamp(this.bankTotalSecData);
                break;
            case CacheField.bankRateTrendSec:
                _data = this.publicFactory.checkValueStamp(this.bankRateTrendSecData);
                break;
            case CacheField.bankAssetsType:
                _data = this.publicFactory.checkValueStamp(this.bankAssetsTypeData);
                break;
            case CacheField.bankTrendRate:
                _data = this.publicFactory.checkValueStamp(this.bankTrendRateData);
                break;
            case CacheField.bankTrendTerm:
                _data = this.publicFactory.checkValueStamp(this.bankTrendTermData);
                break;
            case CacheField.bankTrendDeal:
                _data = this.publicFactory.checkValueStamp(this.bankTrendDealData);
                break;

            default:
                break;
        }
        if (!!_data) {
            return _data;
        } else {
            return false;
        }
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
}