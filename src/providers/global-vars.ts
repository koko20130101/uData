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
        tip: '今天',
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
    setDateValue(value?:any,index?:any) {
        let _dateInfo = GlobalVars.instance.dateInfo;
        let _dateList;
        let _tip:any;
        let _index = index | 0;

        if(!!value) {
            _dateList = GlobalVars.instance.dateList = value;
        }else{
            _dateList = GlobalVars.instance.dateList;
        }

        for(let value of this.units) {
            if(value.title == this.dateInfo.unit) {
                _tip = value.tip;
                break;
            }
        }

        _dateInfo.currentDateList = _dateList[_tip];
        _dateInfo.currentDate = _dateInfo.currentDateList[_index];

        switch (this.dateInfo.unit) {
            case '日':
                if(_index == 0) {
                    _dateInfo.tip = '今天';
                }else if(_index == 1){
                    _dateInfo.tip = '昨天';
                }else{
                    _dateInfo.tip = '';
                }
                _dateInfo.sendDate = _dateInfo.currentDate;
                break;
            case '周':
                if(_index == 0) {
                    _dateInfo.tip = '本周';
                }else if(_index == 1){
                    _dateInfo.tip = '上周';
                }else{
                    _dateInfo.tip = '';
                }
                _dateInfo.sendDate = _dateInfo.currentDate.split('至')[0];
                break;
            case '月':
                if(_index == 0) {
                    _dateInfo.tip = '本月';
                }else if(_index == 1){
                    _dateInfo.tip = '上月';
                }else{
                    _dateInfo.tip = '';
                }
                _dateInfo.sendDate = _dateInfo.currentDate + '-01';
                break;
            case '年':
                if(_index == 0) {
                    _dateInfo.tip = '今年';
                }else if(_index == 1){
                    _dateInfo.tip = '去年';
                }else{
                    _dateInfo.tip = '';
                }
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