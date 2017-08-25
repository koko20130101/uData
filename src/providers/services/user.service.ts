import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Storage} from '@ionic/storage';
import {Api} from '../api';
import {Endpoint} from '../endpoint';
import {CacheField} from '../cache-field';
import {GlobalVars} from '../services/global.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

/**
 * Most apps have the concept of a User. This is a simple provider
 * with stubs for login/signup/etc.
 *
 * This User provider makes calls to our API at the `login` and `signup` endpoints.
 *
 * By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: 'success',
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }
 * ```
 *
 * If the `status` field is not `success`, then an error is detected and returned.
 */
@Injectable()
export class User {

    constructor(public http: Http,
                public api: Api,
                public globalVars: GlobalVars,
                public storage: Storage) {
    }

    login(accountInfo: any) {
        console.log(accountInfo)
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
            let seq = this.api.post(Endpoint.checkLogin, sendData).share()
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

    loadSmsCode(sendData?:any){
        let seq = this.api.post(Endpoint.smsCode,sendData).share();
        return seq;
    }
}
