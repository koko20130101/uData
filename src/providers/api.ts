import {Injectable} from '@angular/core';
import {Http, RequestOptions, URLSearchParams, Headers} from '@angular/http';
import {PublicFactory} from './factory/public.factory';
import {GlobalVars} from './services/global.service';
import 'rxjs/add/operator/map';

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {

    headers: any = new Headers();
    options: any;
    globalInstance:any;

    constructor(public http: Http,
                public globalVars:GlobalVars,
                public publicFactory:PublicFactory) {
        //form表单数据被编码为key/value格式发送到服务器（表单默认的提交数据的格式）服务端要用body-parser来解析
        this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
        this.options = {
            withCredentials: true, //使用withCredentials发送跨域请求凭据
            headers: this.headers,
            responseType: 1,
        };
        this.globalInstance = this.globalVars.getInstance();
    }

    get(endpoint: string, params?: any, options?: RequestOptions) {
        if (!options) {
            options = new RequestOptions();
        }

        // Support easy query params for GET requests
        if (params) {
            let p = new URLSearchParams();
            for (let k in params) {
                p.set(k, params[k]);
            }
            // Set the search field if we have params and don't already have
            // a search field set in options.
            options.search = !options.search && p || options.search;
        }

        return this.http.get(endpoint, options);
    }

    post(endpoint: string, body: any, options?: RequestOptions) {
        // let sendData = Object.assign(this.globalInstance.sendMassage, {body: body});
        // console.log(endpoint + ":");
        // console.log(sendData);
        // return this.http.post(HOST + '/' + endpoint, JSON.stringify(sendData), this.options);
        let seq = this.http.get(endpoint, this.options).share();
        seq.map(res => res.json())
            .subscribe(res => {
                if (!!res && res.code != 1) {
                    //发布错误提示
                    this.publicFactory.error.emit({message: res.description});
                }
            }, err => {
                switch (err.status) {
                    case 0:
                        /*this.publicFactory.error.emit({
                            message: '无法链接到网络，请稍后重试!'
                        });*/
                        break;
                    default:
                        /*this.publicFactory.error.emit({
                            message: '有部分数据没有返回，请下拉刷新重试!'
                        });*/
                        break;
                }
            });
        return seq;
    }

    put(endpoint: string, body: any, options?: RequestOptions) {
        return this.http.put(endpoint, body, options);
    }

    delete(endpoint: string, options?: RequestOptions) {
        return this.http.delete(endpoint, options);
    }

    patch(endpoint: string, body: any, options?: RequestOptions) {
        return this.http.put(endpoint, body, options);
    }
}
