import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Storage} from '@ionic/storage';

import {Api} from '../api/api';
import {Endpoint} from '../api/endpoint';
import {CacheField} from '../api/cache-field';
import {GlobalVars} from './global.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class User {

    constructor(public http: Http,
                public api: Api,
                public globalVars: GlobalVars,
                public storage: Storage) {
    }

    login(accountInfo: any) {
        return new Promise((resolve, reject)=> {
            let globalInstance = this.globalVars.getInstance();
            let seq = this.api.post(Endpoint.login, accountInfo).share();
            seq
                .map(res => res.json())
                .subscribe(res => {
                    if (res.code == 1) {
                        this.storage.set('MTK', res.data.token);
                        globalInstance.sendMassage.token = res.data.token;
                        resolve(res);
                    }
                }, err => {
                    console.error('ERROR', err);
                    reject(err);
                });
            return seq;
        });
    }

    /**
     * 检查是否登录
     * */
    checkLogin(sendData: any) {
        return new Promise((resolve, reject)=> {
            let seq = this.api.post(Endpoint.checkLogin, sendData).share();
            seq .map(res => res.json())
                .subscribe(
                    (data)=> {
                        resolve(data);
                    }, (err)=> {
                        resolve(err)
                    }
                );
            return seq;
        });
    }

    /**
     * 登出
     */
    logout(sendData?:any) {
        let seq = this.api.post(Endpoint.logout,sendData).share();
        seq.map(res => res.json())
            .subscribe(res => {
                if(res.code == 1) {
                    this.storage.remove(CacheField.MTK);
                }
            });
        return seq;
    }

    /**
     * 获取用户权限
     * */
    getUserPower(sendData?: any) {
        return new Promise((resolve, reject)=> {
            let seq = this.api.post(Endpoint.userPower, sendData).share()
                .map(res => res.json())
                .subscribe(
                    (res) => {
                        if (res.code == 1) {
                            //把用权限存到全局变量
                            let dateInstance = this.globalVars.getInstance();
                            for (let item of res.data) {
                                dateInstance.adminCode[item.PCode] = true;
                            }
                        }
                        resolve(res)
                    }, (err)=> {
                        reject(err);
                    });
            return seq;
        });
    }

    /**
     * 设置埋点
     * */
    setRecordOperationLog(sendData?: any) {
        let _sendData = {
            CurrentPage: sendData.pageID,  //页面
            BankCode: sendData.bankCode,
            PointID: sendData.point, //埋点位置
            AppVersion: 'v1.3'
        };
        console.log('当前页面：' + _sendData.CurrentPage);
        console.log('埋点：' + _sendData.PointID);
        let seq = this.api.post(Endpoint.recordOperationLog, _sendData).share();
        seq.map(res => res.json())
            .subscribe(res => {

            });
        return seq;
    };

    getTutorials(sendData?: any){
        return new Promise((resolve, reject)=> {
            let seq = this.api.post(Endpoint.tutorial, sendData).share();
            seq.map(res => res.json())
                .subscribe(res => {
                    resolve(res);
                });
            return seq;
        });
    }

    loadSmsCode(sendData?:any){
        let seq = this.api.post(Endpoint.smsCode,sendData).share();
        return seq;
    }
}
