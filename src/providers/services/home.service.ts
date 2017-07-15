import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage'
import moment from 'moment';

import {Api} from '../api';
import {Endpoint} from '../endpoint';
import {CacheField} from '../cache-field';

import {PublicFactory} from '../factory/public.factory';


/**
 * HomeService 首页数据 单例模式
 */
@Injectable()
export class HomeService {
    //初始化总金额
    _totalAmount: any = {
        platformTotal: 0,
        C2BTotal: 0,
        LingXiTotal: 0
    };

    constructor(public publicFactory: PublicFactory,
                public api:Api,
                public storage:Storage,
    ) {

    }

    //从服务器请求数据
    loadHomeData(sendData:any){
        let req = this.api.post(Endpoint.homeData, sendData).share();
        req.map(res => res.json())
            .subscribe(res=>{
                this._totalAmount = res.data;
                //格式化数据
                for(let key in this._totalAmount) {
                    this._totalAmount[key] = this.publicFactory.moneyFormatToHtml(this._totalAmount[key]);
                }
                //当前时间戳
                let thisTime = moment().unix();
                //添加时间戳
                Object.assign(this._totalAmount, {stamp: thisTime});
                //存储到本地
                this.storage.set(CacheField.homeData, this._totalAmount);
                return this._totalAmount
            });
        return req
    }

    getValue() {
        //当前时间戳
        let thisTime = moment().unix();
        return this.storage.get(CacheField.homeData).then((data)=> {
            //对比时间戳:  60秒前
            if (!!data && data.stamp + 60 > thisTime) {
                // console.log(0)
                this._totalAmount = data;
                return data;
            } else {
                // console.log(1)
                return false;
            }
        });
    }
}