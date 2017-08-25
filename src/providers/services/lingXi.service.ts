import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import moment from 'moment';

import {Api} from '../api';
import {CacheField} from '../cache-field';
import {GlobalVars} from '../services/global.service';

import {PublicFactory} from '../factory/public.factory';

@Injectable()
export class LingXiService {
    lingXiTotalData: any = {};
    dealTrendData: any = {};
    rateTrendData: any = {};
    lingXiChannelData: any = {};

    constructor(public api: Api,
                public publicFactory: PublicFactory,
                public globalVars: GlobalVars,
                public storage: Storage) {
        this.storage.get(CacheField.lingXiTotal).then((data)=> {
            if (!!data) {
                this.lingXiTotalData = data;
            }
        });
        this.storage.get(CacheField.lingXiTrendDeal).then((data)=> {
            if (!!data) {
                this.dealTrendData = data;
            }
        });
        this.storage.get(CacheField.lingXiTrendRate).then((data)=> {
            if (!!data) {
                this.rateTrendData = data;
            }
        });
        this.storage.get(CacheField.lingXiChannel).then((data)=> {
            if (!!data) {
                this.lingXiChannelData = data;
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
                    case CacheField.lingXiTotal:
                        _cacheData = this.lingXiTotalData;
                        //格式化数据
                        _res.data['total'][0] = this.publicFactory.moneyFormatToHtml(_res.data['total'][0]);
                        _res.data['inTotal'][0] = this.publicFactory.moneyFormatToHtml(_res.data['inTotal'][0]);
                        _res.data['outTotal'][0] = this.publicFactory.moneyFormatToHtml(_res.data['outTotal'][0]);
                        let temp: any = {};
                        temp[_res.dataType] = _res.data;
                        //添加时间戳
                        Object.assign(temp[_res.dataType], {stamp: _thisTime});
                        _res.data = temp;
                        break;

                    //==> 交易额折线图
                    case CacheField.lingXiTrendDeal:
                        _cacheData = this.dealTrendData;
                        //处理数据
                        let _trendDeal: any = {};
                        _trendDeal[_res.dataType] = this.handleValue(_res.data);
                        //添加时间戳
                        Object.assign(_trendDeal[_res.dataType], {stamp: _thisTime});
                        _res.data = _trendDeal;
                        break;

                    //==> 收益率折线图
                    case CacheField.lingXiTrendRate:
                        _cacheData = this.rateTrendData;
                        //处理数据
                        let _trendRate: any = {};
                        _trendRate[_res.dataType] = this.handleValue(_res.data);
                        //添加时间戳
                        Object.assign(_trendRate[_res.dataType], {stamp: _thisTime});
                        _res.data = _trendRate;
                        break;

                    //==> 渠道占比
                    case CacheField.lingXiChannel:
                        _cacheData = this.lingXiChannelData;
                        //处理数据
                        for (let item of _res.data.list) {
                            _newData.legend.push(item.name);
                        }
                        _newData.series.push(_res.data.list);
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
                    case CacheField.lingXiTotal:
                        this.lingXiTotalData = _cacheData;
                        break;
                    case CacheField.lingXiTrendDeal:
                        this.dealTrendData = _cacheData;
                        break;
                    case CacheField.lingXiTrendRate:
                        this.rateTrendData = _cacheData;
                        break;
                    case CacheField.lingXiChannel:
                        this.lingXiChannelData = _cacheData;
                        break;
                    default:
                        _cacheData = {};
                        break;
                }
                //存储到本地
                this.storage.set(cacheKey, _cacheData);

            },err=>{

            });
        return req;
    }

    getValue(key,tip?:any){
        let _data:any;
        switch (key){
            case CacheField.lingXiTotal:
                _data = this.publicFactory.checkValueStamp(this.lingXiTotalData,false,[tip]);
                break;
            case CacheField.lingXiTrendDeal:
                _data = this.publicFactory.checkValueStamp(this.dealTrendData,false,[tip]);
                break;
            case CacheField.lingXiTrendRate:
                _data = this.publicFactory.checkValueStamp(this.rateTrendData,false,[tip]);
                break;
            case CacheField.lingXiChannel:
                _data = this.publicFactory.checkValueStamp(this.lingXiChannelData);
                break;
            default:
                break;
        }
        if(!!_data) {
            return _data;
        }else{
            return false;
        }
    }
}