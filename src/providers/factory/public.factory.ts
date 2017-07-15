import {Injectable,EventEmitter} from '@angular/core';

@Injectable()
export class PublicFactory{
    //数据交互：选择单位
    unitInfo: EventEmitter<any> = new EventEmitter<any>();

    constructor(){

    }

    //倒计时
    countdown(value){
        let count = value;
        let myInterval = setInterval(()=> {
            count--;
            if (count == 0) {
                clearInterval(myInterval)
            }
            return count
        }, 1000);
        return myInterval;
    }

    //格式化 money
    moneyFormatToHtml(num, isShort?:boolean){
        let ohm = parseInt((num / Math.pow(10, 8)).toFixed(9)),  //有多少亿
            tenth = Math.floor((num % Math.pow(10, 8)) / Math.pow(10, 4)), //除以亿的余数后，有多少个万
            yuan = (num % Math.pow(10, 8)) % Math.pow(10, 4), //除以亿和万的余数后，有多少元
            format = '';
        if (ohm <= 0 && tenth <= 0) {
            format = yuan + '<span>元</span>';
        } else if (ohm <= 0 && tenth > 0) {
            format = tenth + '<span>万</span>' + yuan + '<span>元</span>';
        } else if (isShort) {
            format = ohm + '<span>亿</span>' + tenth + '<span>万元';
        } else {
            format = ohm + '<span>亿</span>' + tenth + '<span>万</span>' + yuan + '<span>元</span>';
        }
        return format.toString();
    }
}