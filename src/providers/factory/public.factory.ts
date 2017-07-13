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
}