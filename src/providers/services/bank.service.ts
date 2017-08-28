import {Injectable} from '@angular/core';
import moment from 'moment';

import {Api} from '../api';
import {CacheField} from '../cache-field';
import {GlobalVars} from '../services/global.service';

import {PublicFactory} from '../factory/public.factory';
import {StorageFactory} from '../factory/storage.factory';

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
                        let _bankTotalTip: any = {};
                        let _bankTotalBankCode: any = {};
                        _bankTotalTip[sendData.cb] = _res.data;
                        _bankTotalBankCode[sendData.BankCode] = _bankTotalTip;
                        //添加时间戳
                        Object.assign(_bankTotalTip[sendData.cb], {stamp: _thisTime});
                        _res.data = _bankTotalBankCode;
                        break;

                    //==> 平台交易额折线图
                    case CacheField.bankMoney:
                        _cacheData = this.bankMoneyData;
                        //处理数据
                        _res.data = this.handleValue(_res.data);

                        let _bankMoneyTip: any = {};
                        let _bankMoneyBankCode: any = {};
                        _bankMoneyTip[sendData.cb] = _res.data;
                        _bankMoneyBankCode[sendData.BankCode] = _bankMoneyTip;
                        //添加时间戳
                        Object.assign(_bankMoneyTip[sendData.cb], {stamp: _thisTime});
                        _res.data = _bankMoneyBankCode;
                        break;

                    //==> 渠道占比饼图
                    case CacheField.bankChannel:
                        _cacheData = this.bankChannelData;
                        //处理数据
                        for (let item of _res.data.list) {
                            _newData.legend.push(item.name);
                        }
                        _newData.series.push(_res.data.list);

                        //组装数据用于本地存储
                        let _bankChannelTip: any = {};
                        let _bankChannelBankCode: any = {};
                        _bankChannelTip[sendData.cb] = _newData;
                        _bankChannelBankCode[sendData.BankCode] = _bankChannelTip;
                        //添加时间戳
                        Object.assign(_bankChannelTip[sendData.cb], {stamp: _thisTime});
                        _res.data = _bankChannelBankCode;
                        break;

                    //==> 二级市场交易总额
                    case CacheField.bankTotalSec:
                        _cacheData = this.bankTotalSecData;
                        _res.data['secReleaseNumber'][0] = this.publicFactory.moneyFormatToHtml(_res.data['secReleaseNumber'][0]);
                        _res.data['secDealNumber'][0] = this.publicFactory.moneyFormatToHtml(_res.data['secDealNumber'][0]);
                        _res.data['averageTime'][0] = this.publicFactory.formatTime(_res.data['averageTime'][0]*1000);

                        //组装数据用于本地存储
                        let _bankTotalSecDataTip: any = {};
                        let _bankTotalSecDataBankCode: any = {};
                        _bankTotalSecDataTip[sendData.cb] = _res.data;
                        _bankTotalSecDataBankCode[sendData.BankCode] = _bankTotalSecDataTip;
                        //添加时间戳
                        Object.assign(_bankTotalSecDataTip[sendData.cb], {stamp: _thisTime});
                        _res.data = _bankTotalSecDataBankCode;
                        break;

                    //==> 二级市场利率趋势图
                    case CacheField.bankRateTrendSec:
                        _cacheData = this.bankRateTrendSecData;
                        //处理数据
                        _res.data = this.handleValue(_res.data);

                        //组装数据用于本地存储
                        let _bankRateTrendSecDataTip: any = {};
                        let _bankRateTrendSecDataBankCode: any = {};
                        _bankRateTrendSecDataTip[sendData.cb] = _res.data;
                        _bankRateTrendSecDataBankCode[sendData.BankCode] = _bankRateTrendSecDataTip;
                        //添加时间戳
                        Object.assign(_bankRateTrendSecDataTip[sendData.cb], {stamp: _thisTime});
                        _res.data = _bankRateTrendSecDataBankCode;
                        break;

                    //==> 银行资产类型
                    case CacheField.bankAssetsType:
                        _cacheData = this.bankAssetsTypeData;
                        //处理数据
                        for (let item of _res.data.list) {
                            _newData.legend.push(item.name);
                        }
                        _newData.series.push(_res.data.list);

                        //组装数据用于本地存储
                        let _bankAssetsTypeDataTip: any = {};
                        let _bankAssetsTypeDataBankCode: any = {};
                        _bankAssetsTypeDataTip[sendData.cb] = _newData;
                        _bankAssetsTypeDataBankCode[sendData.BankCode] = _bankAssetsTypeDataTip;
                        //添加时间戳
                        Object.assign(_bankAssetsTypeDataTip[sendData.cb], {stamp: _thisTime});
                        _res.data = _bankAssetsTypeDataBankCode;
                        break;

                    //==> 项目走势 > 收益率走势
                    case CacheField.bankTrendRate:
                        _cacheData = this.bankTrendRateData;
                        //处理数据
                        _res.data = this.handleValue(_res.data);

                        //组装数据用于本地存储
                        let _bankTrendRateDataTip: any = {};
                        let _bankTrendRateDataBankCode: any = {};
                        _bankTrendRateDataTip[sendData.cb] = _res.data;
                        _bankTrendRateDataBankCode[sendData.BankCode] = _bankTrendRateDataTip;
                        //添加时间戳
                        Object.assign(_bankTrendRateDataTip[sendData.cb], {stamp: _thisTime});
                        _res.data = _bankTrendRateDataBankCode;
                        break;

                    //==> 项目走势 > 期限走势
                    case CacheField.bankTrendTerm:
                        _cacheData = this.bankTrendTermData;
                        //处理数据
                        _res.data = this.handleValue(_res.data);

                        //组装数据用于本地存储
                        let _bankTrendTermDataTip: any = {};
                        let _bankTrendTermDataBankCode: any = {};
                        _bankTrendTermDataTip[sendData.cb] = _res.data;
                        _bankTrendTermDataBankCode[sendData.BankCode] = _bankTrendTermDataTip;
                        //添加时间戳
                        Object.assign(_bankTrendTermDataTip[sendData.cb], {stamp: _thisTime});
                        _res.data = _bankTrendTermDataBankCode;
                        break;

                    //==> 项目走势 > 发布规模走势
                    case CacheField.bankTrendDeal:
                        _cacheData = this.bankTrendDealData;
                        //处理数据
                        _res.data = this.handleValue(_res.data);

                        //组装数据用于本地存储
                        let _bankTrendDealDataTip: any = {};
                        let _bankTrendDealDataCode: any = {};
                        _bankTrendDealDataTip[sendData.cb] = _res.data;
                        _bankTrendDealDataCode[sendData.BankCode] = _bankTrendDealDataTip;
                        //添加时间戳
                        Object.assign(_bankTrendDealDataTip[sendData.cb], {stamp: _thisTime});
                        _res.data = _bankTrendDealDataCode;
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
                if (!!_cacheData[_instance.dateInfo.currentDate] && !!_cacheData[_instance.dateInfo.currentDate][sendData.BankCode]) {
                    Object.assign(_cacheData[_instance.dateInfo.currentDate][sendData.BankCode], _res.data[sendData.BankCode]);
                } else if(!!_cacheData[_instance.dateInfo.currentDate] && !_cacheData[_instance.dateInfo.currentDate][sendData.BankCode]){
                    _cacheData[_instance.dateInfo.currentDate][sendData.BankCode] = _res.data[sendData.BankCode];
                }else{
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

    getValue(key,source?:any) {
        let _data: any = {};
        return new Promise((resolve, reject)=>{
            switch (key) {
                case CacheField.bankTotal:
                    //提取本地存储
                    this.storage.get(key).then((data) => {
                        if(!!data){
                            this.bankTotalData = data;
                            //查找符合source的数据
                            _data = this.publicFactory.checkValueStamp(this.bankTotalData,false,source);
                            resolve(_data)
                        }else{
                            resolve(false);
                        }

                    });
                    break;
                case CacheField.bankMoney:
                    this.storage.get(key).then((data) => {
                        if(!!data){
                            this.bankMoneyData = data;
                            _data = this.publicFactory.checkValueStamp(this.bankMoneyData,false,source);
                            resolve(_data)
                        }else{
                            resolve(false)
                        }
                    });
                    break;
                case CacheField.bankChannel:
                    this.storage.get(key).then((data) => {
                        if(!!data){
                            this.bankChannelData = data;
                            _data = this.publicFactory.checkValueStamp(this.bankChannelData,false,source);
                            resolve(_data)
                        }else{
                            resolve(false)
                        }
                    });
                    break;
                case CacheField.bankTotalSec:
                    this.storage.get(key).then((data) => {
                        if(!!data){
                            this.bankTotalSecData = data;
                            _data = this.publicFactory.checkValueStamp(this.bankTotalSecData,false,source);
                            resolve(_data)
                        }else{
                            resolve(false)
                        }
                    });
                    break;
                case CacheField.bankRateTrendSec:
                    this.storage.get(key).then((data) => {
                        if(!!data){
                            this.bankRateTrendSecData = data;
                            _data = this.publicFactory.checkValueStamp(this.bankRateTrendSecData,false,source);
                            resolve(_data)
                        }else{
                            resolve(false)
                        }
                    });
                    break;
                case CacheField.bankAssetsType:
                    this.storage.get(key).then((data) => {
                        if(!!data){
                            this.bankAssetsTypeData = data;
                            _data = this.publicFactory.checkValueStamp(this.bankAssetsTypeData,false,source);
                            resolve(_data)
                        }else{
                            resolve(false)
                        }
                    });
                    break;
                case CacheField.bankTrendRate:
                    this.storage.get(key).then((data) => {
                        if(!!data){
                            this.bankTrendRateData = data;
                            _data = this.publicFactory.checkValueStamp(this.bankTrendRateData,false,source);
                            resolve(_data)
                        }else{
                            resolve(false)
                        }
                    });
                    break;
                case CacheField.bankTrendTerm:
                    this.storage.get(key).then((data) => {
                        if(!!data){
                            this.bankTrendTermData = data;
                            _data = this.publicFactory.checkValueStamp(this.bankTrendTermData,false,source);
                            resolve(_data)
                        }else{
                            resolve(false)
                        }
                    });
                    break;
                case CacheField.bankTrendDeal:
                    this.storage.get(key).then((data) => {
                        if(!!data){
                            this.bankTrendDealData = data;
                            _data = this.publicFactory.checkValueStamp(this.bankTrendDealData,false,source);
                            resolve(_data)
                        }else{
                            resolve(false)
                        }
                    });
                    break;

                default:
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
                case 'data':
                    _newData.series.push(_data['data_' + _key[1]]);
                    break;
            }
        }
        return  _newData;
    }
}