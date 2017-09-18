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
        {title: '日', tip: 'day'},
        {title: '周', tip: 'week'},
        {title: '月', tip: 'month'},
        {title: '年', tip: 'year'}];
    //时间信息
    dateInfo: any = {
        unit: {title: '日', tip: 'day'},
        index:0,
        currentDateList: [],
        currentDate: null,
        sendDate: ''
    };
    //本地存储时间
    cacheTime: any = {
        short:60,   //当日、本周、本月、今年的数据过时时间
        middle:10000,
        long:5184000
    };

    //权限
    adminCode: any = {};

    //请求数量
    loaders:any[]=[];
    //自动弹窗
    popupKey:any;
    //请求头
    sendMassage = {
        head: {
            appVersion: '',    // app版本
            manufacturer: '',  // 设备制造商
            UUID: '',          // 机器唯一识别码
            serial: '',     // 设备硬件序列号
            platform: '',      // 操作系统名称
            oSVersion: '',     // 操作系统版本
        },
        body:{

        },
        token: ''
    };
    //本地存储加密密码，每次打开App从后端获取
    cryptKey: String = '1234567890000000';

    constructor() {

    }

    //设置dateInfo: index时间列表中active数据
    setDateValue(data?:any,index?:any) {
        let _dateInfo = GlobalVars.instance.dateInfo;
        let _index = index | 0;

        if(!!data) {
             GlobalVars.instance.dateList = data;
        }

        _dateInfo.currentDateList = GlobalVars.instance.dateList[this.dateInfo.unit.tip];
        _dateInfo.currentDate = _dateInfo.currentDateList[_index];
        _dateInfo.index = _index;

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