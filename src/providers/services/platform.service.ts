import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage'
import moment from 'moment';

import {Api} from '../api';
import {CacheField} from '../cache-field';

import {GlobalVars} from '../services/global.service';
import {PublicFactory} from '../factory/public.factory';

@Injectable()
export class PlatformService {

    //初始化总金额
    totalData: any = {};
    //各平台间的比较
    platformsCompareData: any = {};
    //折线图数据
    trendData: any = {};

    constructor(public publicFactory: PublicFactory,
                public api: Api,
                public globalVars: GlobalVars,
                public storage: Storage,) {
        //从本地存储中取数据
        this.storage.get(CacheField.platformTotalData).then((data)=> {
            if (!!data) {
                this.totalData = data;
            }
        });
        //从本地存储中取平台比较数据
        this.storage.get(CacheField.platformsCompareData).then((data) => {
            if (!!data) {
                this.platformsCompareData = data;
                console.log(this.platformsCompareData )
            }
        });
        //从本地存储中取平台比较数据
        this.storage.get(CacheField.trendData).then((data) =>{
            if(!!data) {
                this.trendData = data;
            }
        })
    }

    /**
     * 从服务器请求数据
     * loadValue(接口，本地存储key,post数据)
     * */
    loadValue(endpoint,cacheKey,sendData?: any) {
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
                let _res: any = res.data;
                //当前时间
                let _thisTime = moment().unix();
                let _cacheData:any;
                //格式化数据
                for(let key in _res) {
                    // console.log(key)
                    _res[key][0] = this.publicFactory.moneyFormatToHtml(_res[key][0]);
                    // console.log(_res[key][0])
                }

                //添加时间戳
                Object.assign(_res, {stamp: _thisTime});

                switch (cacheKey) {
                    case CacheField.platformTotalData:
                        _cacheData = this.totalData;
                        break;
                    case CacheField.platformsCompareData:
                        _cacheData = this.platformsCompareData;
                        break;
                    case CacheField.trendData:
                        _cacheData = this.trendData;
                        break;
                }

                //如果本地总数据超过60天(5184000 秒),则清空数据
                if(!_cacheData.stamp || _cacheData.stamp + _instance.cacheTime.long < _thisTime) {
                    _cacheData = {};
                    Object.assign(_cacheData,{stamp:_thisTime});
                }
                _cacheData[_instance.dateInfo.currentDate] = _res;

                switch (cacheKey) {
                    case CacheField.platformTotalData:
                        this.totalData = _cacheData;
                        break;
                    case CacheField.platformsCompareData:
                        this.platformsCompareData = _cacheData;
                        break;
                    case CacheField.trendData:
                        this.trendData =  _cacheData;
                        break;
                }
                this.storage.set(cacheKey, _cacheData);
            });
        return req
    }

    /**
     * @从服务器请求数据
     * @getValue(本地存储key)
     * */

    getValue(key) {
        let _data: any;
        switch (key) {
            case CacheField.platformTotalData:
                //调用公共方法中的对比时间戳方法,得到返回的数据
                _data = this.publicFactory.checkValueStamp(this.totalData);
                break;
            case CacheField.platformsCompareData:
                _data = this.publicFactory.checkValueStamp(this.platformsCompareData);
                break;
            case CacheField.trendData:
                _data = this.publicFactory.checkValueStamp(this.trendData);
                break;
        }
        if (!!_data) {
            return _data;
        } else {
            return false;
        }
    }
}