import {Injectable} from '@angular/core';

/**
 * GlobalVars 全局定义 单例模式
 */
@Injectable()
export class GlobalVars {
    private static instance: GlobalVars = new GlobalVars();

    dateList: any;
    //单位
    units = [
        {title: '日', tip: 'date'},
        {title: '周', tip: 'week'},
        {title: '月', tip: 'month'},
        {title: '年', tip: 'year'}];
    //时间信息
    dateInfo: any = {
        unit: '日',
        currentDateList: [],
        currentDate: null,
        sendDate: ''
    };


    constructor() {
    }

    //请求时间列表
    /*private loadDateList() {
     this.dateService.getDateList({}).subscribe(resp => {
     let res: any = resp;
     if (res._body.code == 1) {
     Object.assign(this.dateList, res._body.data);
     //今天日期
     let today = moment().format('YYYYMMDD');
     this.dateList.stamp = today;
     // 存储到本地
     this.storage.set(CacheField.dateList, this.dateList);
     this.formatDate();
     }
     })
     }*/

    //设置dateInfo
    setDateValue(value?:any) {
        let _dateInfo = GlobalVars.instance.dateInfo;
        let _dateList;
        if(!!value) {
            _dateList = GlobalVars.instance.dateList = value;
        }else{
            _dateList = GlobalVars.instance.dateList;
        }
        switch (this.dateInfo.unit) {
            case '日':
                _dateInfo.currentDateList = _dateList.date;
                _dateInfo.currentDate = _dateInfo.currentDateList[0];
                _dateInfo.sendDate = _dateInfo.currentDate;
                break;
            case '周':
                _dateInfo.currentDateList = _dateList.week;
                _dateInfo.currentDate = _dateInfo.currentDateList[0];
                _dateInfo.sendDate = _dateInfo.currentDate.split('至')[0];
                break;
            case '月':
                _dateInfo.currentDateList = _dateList.month;
                _dateInfo.currentDate = _dateInfo.currentDateList[0];
                _dateInfo.sendDate = _dateInfo.currentDate + '-01';
                break;
            case '年':
                _dateInfo.currentDateList = _dateList.year;
                _dateInfo.currentDate = _dateInfo.currentDateList[0];
                _dateInfo.sendDate = _dateInfo.currentDate + '-01-01';
                break;
            default:
                break;
        }
    }

    /*_getDateInfo() {
     //今天日期
     let today = moment().format('YYYYMMDD');
     let dateList: any;
     //比对时间戳
     if (this.dateList.stamp == today) {
     console.log(this.dateInfo)
     return this.dateInfo;
     }
     //从本地数据库中取数据
     dateList = this.storage.get(CacheField.dateList);
     //如果存在数据
     if (!dateList) {
     Object.assign(this.dateList, dateList);
     this._getDateInfo();
     } else {
     this.loadDateList()
     }
     }*/
    /**
     * 获取当前实例
     *
     * @static
     * @returns {GlobalVars}
     */
    public getInstance(): GlobalVars {
        return GlobalVars.instance;
    }

}