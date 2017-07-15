import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Storage} from '@ionic/storage'
import moment from 'moment';

import {Api} from '../api';
import {Endpoint} from '../endpoint';
import {CacheField} from '../cache-field';


@Injectable()
export class DateService {
    private _date: any;

    constructor(public http: Http, public api: Api, public storage: Storage) {

    }

    loadDateList(sendData: any) {
        let req = this.api.post(Endpoint.dateList, sendData).share();
        req.map(res => res.json())
            .subscribe(res=> {
                //存储到地本地
                this._date = res.data;
                let today = moment().format('YYYYMMDD');
                //添加时间戳
                Object.assign(this._date, {stamp:today});
                this.storage.set(CacheField.dateList, res.data);
            }, err=> {

            });
        return req;
    }

    getValue() {
        let today = moment().format('YYYYMMDD');
        //如果数据符合时间戳
        return this.storage.get(CacheField.dateList).then(data=> {
            //对比时间戳
            if (!!data && data.stamp == today) {
                this._date = data;
                return data;
            } else {
                return false;
            }
        });
    }
}