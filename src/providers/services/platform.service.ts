import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage'
import moment from 'moment';

import {Api} from '../api';
import {Endpoint} from '../endpoint';
import {CacheField} from '../cache-field';

import {GlobalVars} from '../services/global.service';
import {PublicFactory} from '../factory/public.factory';

@Injectable()
export class PlatformService {

    //初始化总金额
    totalData: any = {};

    constructor(public publicFactory: PublicFactory,
                public api: Api,
                public globalVars: GlobalVars,
                public storage: Storage,) {
        //从本地存储中取数据
        this.storage.get(CacheField.platformTotalData).then((data)=> {
            if (!!data) {
                this.totalData = data;
            }
        })
    }

    //从服务器请求数据
    loadValue(sendData?: any) {
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
        let req = this.api.post(Endpoint.platformTotalData, _sendData).share();
        req.map(res => res.json())
            .subscribe(res => {
                let _res: any = res.data;
                //当前时间
                let _thisTime = moment().unix();
                //格式化数据
                for(let key in _res) {
                    console.log(key)
                    _res[key][0] = this.publicFactory.moneyFormatToHtml(_res[key][0]);
                    console.log(_res[key][0])
                }

                //添加时间戳
                Object.assign(_res, {stamp: _thisTime});

                //如果本地总数据超过60天(5184000 秒),则清空数据
                if(!this.totalData.stamp || this.totalData.stamp + 5184000 < _thisTime) {
                    this.totalData = {};
                    Object.assign(this.totalData,{stamp:_thisTime});
                }
                this.totalData[_instance.dateInfo.currentDate] = _res;

                this.storage.set(CacheField.platformTotalData, this.totalData);
            });
        return req
    }

    getValue() {
        let _data: any;
        //调用公共方法中的对比时间戳方法,得到返回的数据
        _data = this.publicFactory.checkValueStamp(this.totalData);
        if (!!_data) {
            return _data;
        } else {
            return false;
        }
    }
}