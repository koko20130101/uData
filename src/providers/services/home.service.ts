import {Injectable} from '@angular/core';
import moment from 'moment';

import {Api} from '../api/api';
import {CacheField} from '../api/cache-field';

import {GlobalVars} from './global.service';
import {PublicFactory} from '../factories/public.factory';
import {StorageFactory} from '../factories/storage.factory';

@Injectable()
export class HomeService {

    //初始化总金额
    totalAmount: any = {};

    constructor(public publicFactory: PublicFactory,
                public api:Api,
                public globalVars:GlobalVars,
                public storage:StorageFactory) {

    }
    //从服务器请求数据
    loadValue(endpoint, cacheKey, sendData?:any){
        let _instance = this.globalVars.getInstance();
        let _sendData = {
            type: _instance.dateInfo.unit.tip,
            now: _instance.dateInfo.sendDate
        };
        if(!!sendData) {
            Object.assign(_sendData, sendData);
        }
        //发起请求
        let req = this.api.post(endpoint, _sendData).share();
        req.map(res => res.json())
            .subscribe(res => {
                let _res: any = res.data;
                //当前时间
                let _thisTime = moment().unix();
                //格式化数据
                for(let key in _res) {
                    _res[key] = this.publicFactory.moneyFormatToHtml(_res[key]);
                }
                //添加时间戳
                Object.assign(_res, {stamp: _thisTime});

                //如果本地总数据超过60天(5184000 秒),则清空数据
                if(!this.totalAmount.stamp || this.totalAmount.stamp + _instance.cacheTime.long < _thisTime) {
                    this.totalAmount = {};
                    Object.assign(this.totalAmount,{stamp:_thisTime});
                }
                this.totalAmount[_instance.dateInfo.currentDate] = _res;

                this.storage.set(cacheKey, this.totalAmount);
            },err=>{

            });
        return req
    }
    getValue(key){
        let _data:any;
        return new Promise((resolve, reject)=> {
            switch (key) {
                case CacheField.homeData:
                    //提取本地存储
                    this.storage.get(key).then((data) => {
                        if(!!data){
                            this.totalAmount = data;
                            //查找符合时间戳的数据
                            //调用公共方法中的对比时间戳方法,得到返回的数据
                            _data = this.publicFactory.checkValueStamp(this.totalAmount);
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