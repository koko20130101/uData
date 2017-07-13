import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Storage} from '@ionic/storage';
import {Api} from './api';
import {Endpoint} from './endpoint';
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
    _user: any;

    constructor(public http: Http, public api: Api, public storage: Storage) {
    }

    login(accountInfo: any) {
        let seq = this.api.post(Endpoint.login, accountInfo).share();

        seq
            .map(res => res.json());
        /*.subscribe(res => {
         // If the API returned a successful response, mark the user as logged in
         if (res.status == 'success') {
         // this.storage.set('userInfo', res);
         this._loggedIn(res);
         } else {
         }
         }, err => {
         console.error('ERROR', err);
         });*/

        return seq;
    }

    /**
     * 检查是否登录
     * */
    checkLogin(accountInfo: any) {
        let seq = this.api.post(Endpoint.checkLogin, accountInfo).share();

        seq
            .map(res => res.json())
            .subscribe(res => {

            }, err=> {

            });
        return seq;
    }


    /**
     * Send a POST request to our signup endpoint with the data
     * the user entered on the form.
     */
    signup(accountInfo: any) {
        let seq = this.api.post('signup', accountInfo).share();

        seq
            .map(res => res.json())
            .subscribe(res => {
                // If the API returned a successful response, mark the user as logged in
                if (res.status == 'success') {

                    this._loggedIn(res);
                }
            }, err => {
                console.error('ERROR', err);
            });

        return seq;
    }

    /**
     * 登出
     */
    logout() {
        this._user = null;
    }

    /**
     * Process a login/signup response to store user data
     */
    _loggedIn(resp) {
        this._user = resp.user;
    }
}
