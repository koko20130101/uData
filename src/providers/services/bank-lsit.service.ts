import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import moment from 'moment';

import {Api} from '../api';
import {CacheField} from '../cache-field';
import {GlobalVars} from '../services/global.service';

import {PublicFactory} from '../factory/public.factory';

@Injectable()
export class BankListService {
    bankList: any = {};

    constructor(public api: Api,
                public publicFactory: PublicFactory,
                public globalVars: GlobalVars,
                public storage: Storage) {
    }

    loadBankList(endpoint, cacheKey, sendData?: any) {
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
                //格式化数据
                for (let item of _res.data.list) {
                    item.money = this.publicFactory.moneyFormatToHtml(item.money);
                }
                //添加时间戳
                Object.assign(_res.data, {stamp: _thisTime});
                //如果本地总数据超过60天(5184000 秒),则清空数据
                if (!this.bankList.stamp || this.bankList.stamp + _instance.cacheTime.long < _thisTime) {
                    this.bankList = {};
                    Object.assign(this.bankList, {stamp: _thisTime});
                }
                if (!!this.bankList[_instance.dateInfo.currentDate]) {
                    Object.assign(this.bankList[_instance.dateInfo.currentDate], _res.data);
                } else {
                    this.bankList[_instance.dateInfo.currentDate] = _res.data;
                }
                //存储到本地
                this.storage.set(cacheKey, this.bankList);
            },err=>{

            });
        return req;
    }

    getValue(key) {
        let _data: any;
        return new Promise((resolve, reject)=> {
            switch (key) {
                case CacheField.bankList:
                    //提取本地存储
                    this.storage.get(key).then((data) => {
                        if(!!data){
                            this.bankList = data;
                            //查找符合时间戳的数据
                            _data = this.publicFactory.checkValueStamp(this.bankList);
                            resolve(_data.list)
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