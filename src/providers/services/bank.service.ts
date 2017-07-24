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
        })
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
                    case CacheField.bankTotal:
                        _cacheData = this.bankTotalData;
                        //格式化数据
                        _res.data['total'][0] = this.publicFactory.moneyFormatToHtml(_res.data['total'][0]);
                        _res.data['AverageTerm'][0] = Math.floor(_res.data['AverageTerm'][0]);
                        _res.data['time'][0] = this.publicFactory.formatTime(_res.data['time'][0]*1000);
                        //添加时间戳
                        Object.assign(_res.data, {stamp: _thisTime});
                        break;

                    //==> 平台交易额折线图
                    case CacheField.bankMoney:
                        _cacheData = this.bankMoneyData;
                        //添加时间戳
                        Object.assign(_res.data, {stamp: _thisTime});
                        break;

                    //==> 渠道占比饼图
                    case CacheField.bankChannel:
                        _cacheData = this.bankChannelData;
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
                    default:
                        _cacheData = {};
                        break;
                }
                //存储到本地
                this.storage.set(cacheKey, _cacheData);
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
            default:
                break;
        }
        if (!!_data) {
            return _data;
        } else {
            return false;
        }

    }
}