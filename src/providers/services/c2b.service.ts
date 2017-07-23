import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import moment from 'moment';

import {Api} from '../api';
import {CacheField} from '../cache-field'

import {GlobalVars} from '../services/global.service';
import {PublicFactory} from '../factory/public.factory';
import {ListPipe} from '../../providers/pipes/list.pipe';

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
                public storage: Storage) {
        //从本地存储中取数据
        this.storage.get(CacheField.saleTotal).then((data)=> {
            if (!!data) {
                this.saleData = data;
            }
        });
        this.storage.get(CacheField.saleChannelIn).then((data)=> {
            if (!!data) {
                this.saleChannelDataIn = data;
            }
        });
        this.storage.get(CacheField.saleChannelOut).then((data)=> {
            if (!!data) {
                this.saleChannelDataOut = data;
            }
        });
        this.storage.get(CacheField.assetsInOut).then((data)=> {
            if (!!data) {
                this.assetsInOutData = data;
            }
        });
        this.storage.get(CacheField.assetsMain).then((data)=> {
            if (!!data) {
                this.assetsMainData = data;
            }
        });
        this.storage.get(CacheField.profitData).then((data)=> {
            if (!!data) {
                this.profitData = data;
            }
        });
        this.storage.get(CacheField.assetsHealthy).then((data)=> {
            if (!!data) {
                this.assetsHealthyData = data;
            }
        });
        this.storage.get(CacheField.grossMargin).then((data)=> {
            if (!!data) {
                this.grossMarginData = data;
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
        console.log(_sendData);
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
                        temp[_res.dataType] = _res.data.list;
                        //添加时间戳
                        Object.assign(temp, {stamp: _thisTime});
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
                        _channelOut[_res.dataType] = _res.data.list;
                        //添加时间戳
                        Object.assign(_channelOut, {stamp: _thisTime});
                        _res.data = _channelOut;
                        break;

                    //==> 引入额及销售额折线图
                    case CacheField.assetsInOut:
                        _cacheData = this.assetsInOutData;
                        let _assetsData: any = {};
                        _assetsData[_res.dataType] = _res.data;
                        //添加时间戳
                        Object.assign(_assetsData, {stamp: _thisTime});
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

                    //==> 资产总额对比
                    case CacheField.profitData:
                        _cacheData = this.profitData;
                        //添加时间戳
                        Object.assign(_res.data, {stamp: _thisTime});
                        break;

                    //==> 资产总额对比
                    case CacheField.assetsHealthy:
                        _cacheData = this.assetsHealthyData;
                        //添加时间戳
                        Object.assign(_res.data, {stamp: _thisTime});
                        break;

                    //==> 毛利率折线图
                    case CacheField.grossMargin:
                        _cacheData = this.grossMarginData;
                        //格式化数据
                        _res.data['total'] = this.publicFactory.moneyFormatToHtml(_res.data['total']);
                        for(let item of _res.data['grossProfit']) {
                            item = this.publicFactory.moneyFormatToHtml(item)
                        }
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

            });
        return req;
    }

    /**
     * @比较本地数据的时间戳
     * @getValue(本地存储key)
     * */
    getValue(key) {
        let _data: any;
        switch (key) {
            case CacheField.saleTotal:
                //调用公共方法中的对比时间戳方法,得到返回的数据
                _data = this.publicFactory.checkValueStamp(this.saleData);
                break;
            case CacheField.saleChannelIn:
                _data = this.publicFactory.checkValueStamp(this.saleChannelDataIn);
                break;
            case CacheField.saleChannelOut:
                _data = this.publicFactory.checkValueStamp(this.saleChannelDataOut);
                break;
            case CacheField.assetsInOut:
                _data = this.publicFactory.checkValueStamp(this.assetsInOutData);
                break;
            case CacheField.assetsMain:
                _data = this.publicFactory.checkValueStamp(this.assetsMainData, true);
                break;
            case CacheField.profitData:
                _data = this.publicFactory.checkValueStamp(this.profitData, true);
                break;
            case CacheField.assetsHealthy:
                _data = this.publicFactory.checkValueStamp(this.assetsHealthyData, true);
                break;
            case CacheField.grossMargin:
                _data = this.publicFactory.checkValueStamp(this.grossMarginData, true);
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