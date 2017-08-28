import {Injectable} from '@angular/core';
//导入加密核心模块
import CryptoJS from 'crypto-js/core';
import 'crypto-js/aes';

@Injectable()
export class Crypto {
    constructor() {

    }

    //AES加密算法
    public encrypt(data, key) {
        let keyUtf8 = CryptoJS.enc.Utf8.parse(key);
        let iv = CryptoJS.enc.Utf8.parse(key);
        let _data = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
        let encrypted = CryptoJS.AES.encrypt(_data, keyUtf8, {
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
            iv: iv
        });
        return encrypted.ciphertext.toString();
    }

    //AES解密算法
    public decrypt(data, key) {
        let keyUtf8 = CryptoJS.enc.Utf8.parse(key);
        let iv = CryptoJS.enc.Utf8.parse(key);
        let encryptedHexStr = CryptoJS.enc.Hex.parse(data);
        let _data = CryptoJS.enc.Base64.stringify(encryptedHexStr);
        let decrypted = CryptoJS.AES.decrypt(_data, keyUtf8, {
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
            iv: iv
        });
        try {
            var decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
            return JSON.parse(decryptedStr);
        } catch (e) {
            console.log(e.name + ": " + e.message);
        }
        /*var decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedStr);*/
    }
}