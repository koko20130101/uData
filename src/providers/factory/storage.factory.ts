import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';

import {Crypto} from '../factory/crypto.factory';

import{GlobalVars} from '../services/global.service';

@Injectable()
export class StorageFactory {
    globalInstance:any;
    constructor(public storage: Storage,
                public globalVars:GlobalVars,
                public crypto: Crypto) {
        this.globalInstance = this.globalVars.getInstance();
    }

    get(key) {
        return this.storage.get(key).then(data=> {
            if (!!data) {
                //AES加密
                let decryptData = this.crypto.decrypt(data, this.globalInstance.cryptKey);
                if(!!decryptData) {
                    return decryptData
                }else{
                    this.storage.remove(key);
                    return false
                }
            }else{
                return false
            }
        });
    }

    set(cacheKey, data) {
        //AES解密
        let _data = this.crypto.encrypt(data,this.globalInstance.cryptKey);
        this.storage.set(cacheKey, _data);
    }

    remove(key){
        this.storage.remove(key);
    }
}