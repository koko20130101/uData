import {Injectable, EventEmitter} from '@angular/core';
import moment from 'moment';

import {GlobalVars} from '../services/global.service';

@Injectable()
export class PublicFactory {
    //数据交互：选择单位
    unitInfo: EventEmitter<any> = new EventEmitter<any>();
    //数据交互：当与远程服务器会话返回的code不为1时
    error:EventEmitter<any> = new EventEmitter<any>();

    constructor(public globalVars: GlobalVars) {

    }

    //倒计时
    countdown(value) {
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
    moneyFormatToHtml(num, isShort?: boolean) {
        num = Number(num);
        let ohm = parseInt((num / Math.pow(10, 8)).toFixed(9)),  //有多少亿
            tenth = Math.floor((num % Math.pow(10, 8)) / Math.pow(10, 4)), //除以亿的余数后，有多少个万
            yuan = Math.floor((num % Math.pow(10, 8)) % Math.pow(10, 4)), //除以亿和万的余数后，有多少元
            format = '';
        if (ohm <= 0 && tenth <= 0) {
            format = yuan + '<i>元</i>';
        } else if (ohm <= 0 && tenth > 0) {
            format = tenth + '<i>万</i>' + yuan + '<i>元</i>';
        } else if (isShort) {
            format = ohm + '<i>亿</i>' + tenth + '<i>万元';
        } else {
            format = ohm + '<i>亿</i>' + tenth + '<i>万</i>' + yuan + '<i>元</i>';
        }
        return format.toString();
    }

    //格式化 money
    moneyFormat(num, isShort?: boolean) {
        num = Number(num);
        let ohm = parseInt((num / Math.pow(10, 8)).toFixed(9)),  //有多少亿
            tenth = Math.floor((num % Math.pow(10, 8)) / Math.pow(10, 4)), //除以亿的余数后，有多少个万
            yuan = Math.floor((num % Math.pow(10, 8)) % Math.pow(10, 4)), //除以亿和万的余数后，有多少元
            format = '';
        if (ohm <= 0 && tenth <= 0) {
            format = yuan + '元';
        } else if (ohm <= 0 && tenth > 0) {
            format = tenth + '万' + yuan + '元';
        } else if (isShort) {
            format = ohm + '亿' + tenth + '万元';
        } else {
            format = ohm + '亿' + tenth + '万' + yuan + '元';
        }
        return format.toString();
    }

    //检查数据时间戳
    checkValueStamp(data, short?: boolean,tips?:any) {
        let _data: any = data;
        //当前时间戳
        let _thisTime = moment().unix();
        //全局变量实例
        let _instance = this.globalVars.getInstance();
        let _currentDate = _instance.dateInfo.currentDate;
        let _index = _instance.dateInfo.index;

        if (_index == 0 || short) {
            //过期时间: 60秒前 (在global.service中设置)
            if (!!_data && !!_data[_currentDate] && !!_data[_currentDate].stamp && _data[_currentDate].stamp + _instance.cacheTime.short > _thisTime) {
                return _data[_currentDate];
            } else if(!!_data[_currentDate]  && !!tips) {
                let temp:any=_data[_currentDate];
                for(let tip of tips) {
                    if(!!temp[tip]) {
                        temp = temp[tip];
                    }else{
                        return false
                    }
                }
                if(temp.stamp + _instance.cacheTime.short > _thisTime) {
                    return temp
                }else{
                    return false;
                }
            }else{
                return false;
            }
        } else {
            //过期时间: 30天 (在global.service中设置)
            if (!!_data && !!_data[_currentDate] && !!_data[_currentDate].stamp && _data[_currentDate].stamp + _instance.cacheTime.middle > _thisTime) {
                return _data[_currentDate];
            } else if(!!_data[_currentDate]  && !!tips) {
                let temp2:any=_data[_currentDate];
                for(let tip of tips) {
                    if(!!temp2[tip]) {
                        temp2 = temp2[tip];
                    }else{
                        return false
                    }
                }
                if(temp2.stamp + _instance.cacheTime.middle > _thisTime) {
                    return temp2
                }else{
                    return false;
                }
            }else{
                return false;
            }
        }
    }

    //格式化时间
    formatTime(val) {
        let timeString;
        let ms = val;
        let ss = 1000,
            mi = ss * 60,
            hh = mi * 60,
            dd = hh * 24;
        let day = Math.floor(ms / dd), //天
            hour = Math.floor((ms - day * dd) / hh), //小时
            minute = Math.floor((ms - day * dd - hour * hh) / mi), //分钟
            second = Math.floor((ms - day * dd - hour * hh - minute * mi) / ss); //秒
        timeString = day + "<i>天</i>" + hour + "<i>小时</i>" + minute + "<i>分钟</i>" + second + "<i>秒</i>";
        return timeString
    }
}