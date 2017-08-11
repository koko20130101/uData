import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage'
import moment from 'moment';

import {Api} from '../api';
import {Endpoint} from '../endpoint';
import {CacheField} from '../cache-field';

import {GlobalVars} from '../services/global.service';
import {PublicFactory} from '../factory/public.factory';

@Injectable()
export class HomeService {

    //初始化总金额
    totalAmount: any = {};

    constructor(public publicFactory: PublicFactory,
                public api:Api,
                public globalVars:GlobalVars,
                public storage:Storage,
    ) {
        //从本地存储中取数据
        this.storage.get(CacheField.homeData).then((data)=> {
            if(!!data) {
                this.totalAmount = data;
            }
        })
    }
    //从服务器请求数据
    loadValue(sendData?:any){
        let _instance = this.globalVars.getInstance();
        let _sendData = {
            type: _instance.dateInfo.unit.tip,
            now: _instance.dateInfo.sendDate
        };
        if(!!sendData) {
            Object.assign(_sendData, sendData);
        }
        console.log(_sendData)
        //发起请求
        let req = this.api.post(Endpoint.homeData, _sendData).share();
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

                this.storage.set(CacheField.homeData, this.totalAmount);
            },err=>{

            });
        return req
    }
    getValue(){
        let _data:any;
        //调用公共方法中的对比时间戳方法,得到返回的数据
        _data = this.publicFactory.checkValueStamp(this.totalAmount);
        if(!!_data) {
            return _data;
        }else{
            return false;
        }
    }
}