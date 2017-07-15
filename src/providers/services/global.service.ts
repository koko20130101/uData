import {Injectable} from '@angular/core';

/**
 * GlobalVars 全局定义 单例模式
 */
@Injectable()
export class GlobalVars {
    private static instance: GlobalVars = new GlobalVars();

    dateList: any[]=[];
    //单位
    units = [
        {title: '日', tip: 'date'},
        {title: '周', tip: 'week'},
        {title: '月', tip: 'month'},
        {title: '年', tip: 'year'}];
    //时间信息
    dateInfo: any = {
        unit: {title: '日', tip: 'date'},
        currentDateList: [],
        currentDate: null,
        sendDate: ''
    };

    constructor() {

    }


    //设置dateInfo: index时间列表中active数据
    setDateValue(data?:any,index?:any) {
        let _dateInfo = GlobalVars.instance.dateInfo;
        let _index = index | 0;

        if(!!data) {
            for(let key in data) {
                switch (key) {
                    case 'date':
                        data[key][0] += ' (今日)';
                        data[key][1] += ' (昨日)';
                        break;
                    case 'week':
                        data[key][0] += ' (本周)';
                        data[key][1] += ' (上周)';
                        break;
                    case 'month':
                        data[key][0] += ' (本月)';
                        data[key][1] += ' (上月)';
                        break;
                    case 'year':
                        data[key][0] += ' (今年)';
                        data[key][1] += ' (去年)';
                        break;
                    default:
                        break;
                }
            }
             GlobalVars.instance.dateList = data;
        }

        _dateInfo.currentDateList = GlobalVars.instance.dateList[this.dateInfo.unit.tip];
        _dateInfo.currentDate = _dateInfo.currentDateList[_index];

        switch (this.dateInfo.unit.title) {
            case '日':
                _dateInfo.sendDate = _dateInfo.currentDate.split(' ')[0];
                break;
            case '周':
                _dateInfo.sendDate = _dateInfo.currentDate.split('至')[0];
                break;
            case '月':
                _dateInfo.sendDate = _dateInfo.currentDate.split(' ')[0] + '-01';
                break;
            case '年':
                _dateInfo.sendDate = _dateInfo.currentDate.split(' ')[0] + '-01-01';
                break;
            default:
                break;
        }
    }

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