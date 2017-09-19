import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import moment from 'moment';

import {Api} from '../api/api';
import {Endpoint} from '../api/endpoint';
import {CacheField} from '../api/cache-field';
import {GlobalVars} from  './global.service';
import {StorageFactory} from '../factories/storage.factory';


@Injectable()
export class DateService {
    _date: any;
    dataInstance:any;
    constructor(public http: Http,
                public api: Api,
                public storage: StorageFactory,
                public globalVars:GlobalVars) {
        this.storage.get(CacheField.dateList).then((data)=> {
            if (!!data) {
                this._date = data;
            }
        });
        this.dataInstance = this.globalVars.getInstance();
    }

    loadDateList(sendData: any) {
        let req = this.api.post(Endpoint.dateList, sendData).share();
        req.map(res => res.json())
            .subscribe(res=> {
                //处理数据
                for(let key in res.data) {
                    switch (key) {
                        case 'day':
                            res.data[key][0] += ' (今日)';
                            res.data[key][1] += ' (昨日)';
                            break;
                        case 'week':
                            res.data[key][0] += ' (本周)';
                            res.data[key][1] += ' (上周)';
                            break;
                        case 'month':
                            res.data[key][0] += ' (本月)';
                            res.data[key][1] += ' (上月)';
                            break;
                        case 'year':
                            res.data[key][0] += ' (今年)';
                            res.data[key][1] += ' (去年)';
                            break;
                        default:
                            break;
                    }
                }
                let today = moment().format('YYYYMMDD');
                //添加时间戳
                Object.assign(res.data, {stamp:today});
                //存储到地本地
                this.storage.set(CacheField.dateList, res.data);
                this._date = res.data;
            }, err=> {

            });
        return req;
    }

    getValue() {
        let today = moment().format('YYYYMMDD');
        //对比时间戳
        if (!!this._date && this._date.stamp == today) {
            return this._date;
        } else {
            return false;
        }
    }
}