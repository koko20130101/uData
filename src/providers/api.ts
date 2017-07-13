import {Injectable} from '@angular/core';
import {Http, RequestOptions, URLSearchParams,Headers} from '@angular/http';
import 'rxjs/add/operator/map';

import {HOST} from './endpoint';  //导入接口地址

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {

    headers: any = new Headers();
    options: any;

    constructor(public http: Http) {
        //form表单数据被编码为key/value格式发送到服务器（表单默认的提交数据的格式）服务端要用body-parser来解析
        this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
        this.options = {
            withCredentials: true, //使用withCredentials发送跨域请求凭据
            headers: this.headers,
            responseType:1
        };
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

        return this.http.get(HOST + '/' + endpoint, options);
    }

    post(endpoint: string, body: any, options?: RequestOptions) {

        // return this.http.post(HOST + '/' + endpoint, body, this.options);
        return this.http.get(HOST + '/' + endpoint, this.options);
    }

    put(endpoint: string, body: any, options?: RequestOptions) {
        return this.http.put(HOST + '/' + endpoint, body, options);
    }

    delete(endpoint: string, options?: RequestOptions) {
        return this.http.delete(HOST + '/' + endpoint, options);
    }

    patch(endpoint: string, body: any, options?: RequestOptions) {
        return this.http.put(HOST + '/' + endpoint, body, options);
    }
}
