import {Component, Input} from '@angular/core';
import {Storage} from '@ionic/storage';
import moment from 'moment';
import {GlobalVars} from '../../providers/services/global.service';
import {User} from '../../providers/services/user.service';

import {CacheField} from '../../providers/cache-field';

import {PublicFactory} from '../../providers/factory/public.factory';
import {PopupFactory} from '../../providers/factory/popup.factory';

@Component({
    selector: 'ucs-date',
    template: ` 
        <button ion-button clear icon-only small [disabled]="isStart" (click)="_previousDate()">
            <ion-icon name="arrow-left-1"></ion-icon>
        </button>
        <button ion-button clear small (click)="_showAlert()">{{activeDate}}</button>
        <button ion-button clear icon-only small [disabled]="isEnd" (click)="_nextDate()">
            <ion-icon name="arrow-right-1"></ion-icon>
        </button>
`
})
export class Date {
    //输入属性:记录从那个页面引入的 date
    @Input() pageInfo: any;
    globalInstance: any;  //单例模式的实例
    currentDateList: any[] = [];  //活动的时间列表
    activeDate: any;
    radioList: any[];
    isStart: boolean;
    isEnd: boolean = false;

    _hour: any;
    _today: any;
    _week: any;
    _day: any;

    constructor(public popupFactory: PopupFactory,
                public publicFactory: PublicFactory,
                public storage: Storage,
                public user:User,
                public globalVars: GlobalVars) {
    }

    ngOnInit() {
        //全局变量实例
        this.globalInstance = this.globalVars.getInstance();

        this._hour = moment().hour(); //现在几点
        this._today = moment().format('YYYY-MM-DD');  //今天
        this._week = moment().day();   //星期几
        this._day = moment().date();  //几号

        //存储弹窗点击信息
        this.storage.get(CacheField.popupKey).then(data => {
            if (!!data) {
                if (data.date != this._today) {
                    this.globalInstance.popupKey = {date: this._today};
                } else {
                    this.globalInstance.popupKey = data;
                }
            } else {
                this.globalInstance.popupKey = {date: this._today};
            }
            this.storage.set(CacheField.popupKey, this.globalInstance.popupKey);
            this._autoAlert(this.globalInstance.dateInfo.unit.title);
        });


        this._setVars();
        //订阅选择单位传过来的信息
        this.publicFactory.unitInfo.subscribe((data) => {
            console.log(data)
            if(data.page == this.pageInfo.name) {
                this._setVars(data.unit);
            }
        });
    }

    ngOnDestroy() {
        // console.log(2)
        //取消选择单位订阅
        this.publicFactory.unitInfo.observers.pop();
    }

    _showAlert() {
        this.radioList = [];
        //处理弹窗的时间列表
        for (let value of this.currentDateList) {
            this.radioList.push({
                type: 'radio',
                label: value,
                value: value,
                checked: value == this.activeDate ? true : false
            });
        }

        //弹出日期选择弹窗
        this.popupFactory.showAlert({
            title: '请选择日期',
            inputs: this.radioList,
            buttons: [
                {
                    text: '确 定',
                    handler: (data)=> {
                        let index = this.currentDateList.indexOf(data);
                        this._setDate(data, index);
                    }
                }
            ]
        })
    }

    //弹窗提示切换日期
    _autoAlert(unit) {
        switch (unit) {
            case '日':
                //判断是否是今天的 在多少小时之前
                if (this.globalInstance.popupKey.hour == null && this._hour < 21) {
                    this.popupFactory.showAlert({
                        title: '',
                        message: "部分项目尚未开售，是否切换为" + this.currentDateList[1] + "的数据？",
                        enableBackdropDismiss: false,
                        buttons: [
                            {
                                text: '取 消',
                                handler: (data)=> {
                                    this.globalInstance.popupKey.hour = false;
                                    this.storage.set(CacheField.popupKey, this.globalInstance.popupKey);
                                    //埋点
                                    this.user.setRecordOperationLog({
                                        pageID: this.pageInfo.id,
                                        point: 6
                                    });
                                }
                            },
                            {
                                text: '确认切换',
                                handler: (data)=> {
                                    this.globalInstance.popupKey.hour = true;
                                    this.storage.set(CacheField.popupKey, this.globalInstance.popupKey);
                                    //埋点
                                    this.user.setRecordOperationLog({
                                        pageID: this.pageInfo.id,
                                        point: 5
                                    });
                                    this._setDate(null, 1);
                                }
                            }
                        ]
                    });
                } else if (this.globalInstance.hour && this._hour < 21) {
                    this._setDate(null, 1);
                }
                break;
            case '周':
                //判断是否是周一，
                if (this.globalInstance.popupKey.week == null && this._week == 3) {
                    this.popupFactory.showAlert({
                        title: '',
                        message: "本周才刚刚开始，是否切换为" + this.currentDateList[1] + "的数据？",
                        enableBackdropDismiss: false,
                        buttons: [
                            {
                                text: '取 消',
                                handler: (data)=> {
                                    this.globalInstance.popupKey.week = false;
                                    this.storage.set(CacheField.popupKey, this.globalInstance.popupKey);
                                    //埋点
                                    this.user.setRecordOperationLog({
                                        pageID: this.pageInfo.id,
                                        point: 8
                                    });
                                }
                            }, {
                                text: '确认切换',
                                handler: (data)=> {
                                    this.globalInstance.popupKey.week = true;
                                    this.storage.set(CacheField.popupKey, this.globalInstance.popupKey);
                                    //埋点
                                    this.user.setRecordOperationLog({
                                        pageID: this.pageInfo.id,
                                        point: 7
                                    });
                                    this._setDate(null, 1);
                                }
                            }
                        ]
                    })
                }
                break;
            case '月':
                //判断是否是周一，
                if (this.globalInstance.popupKey.day == null && this._day == 9) {
                    this.popupFactory.showAlert({
                        title: '',
                        message: "本月才刚刚开始，是否切换为" + this.currentDateList[1] + "的数据？",
                        enableBackdropDismiss: false,
                        buttons: [
                            {
                                text: '取 消',
                                handler: (data)=> {
                                    this.globalInstance.popupKey.day = false;
                                    this.storage.set(CacheField.popupKey, this.globalInstance.popupKey);
                                    //埋点
                                    this.user.setRecordOperationLog({
                                        pageID: this.pageInfo.id,
                                        point: 10
                                    });
                                }
                            },
                            {
                                text: '确认切换',
                                handler: (data)=> {
                                    this.globalInstance.popupKey.day = true;
                                    this.storage.set(CacheField.popupKey, this.globalInstance.popupKey);
                                    //埋点
                                    this.user.setRecordOperationLog({
                                        pageID: this.pageInfo.id,
                                        point: 9
                                    });
                                    this._setDate(null, 1);
                                }
                            }
                        ]
                    });
                }
                break;
            default:
                break;
        }
    }

    _previousDate() {
        let index = this.currentDateList.indexOf(this.activeDate);
        if (index == this.currentDateList.length - 1) {
            this.isStart = true;
            return;
        } else {
            this.isEnd = false;
            this._setDate(this.currentDateList[index + 1], index + 1)
        }
    }

    _nextDate() {
        let index = this.currentDateList.indexOf(this.activeDate);
        if (index == 0) {
            this.isEnd = true;
            return;
        } else {
            this.isStart = false;
            this._setDate(this.currentDateList[index - 1], index - 1)
        }
    }

    _setDate(data, index) {
        //设置公共变量实例
        this.globalInstance.setDateValue(null, index);
        //发布消息
        this.publicFactory.unitInfo.emit({page: this.pageInfo.name});
        this._setVars();
    }

    _setVars(unit?: any) {
        this.currentDateList = this.globalInstance.dateInfo.currentDateList;
        this.activeDate = this.globalInstance.dateInfo.currentDate;
        let index = this.currentDateList.indexOf(this.activeDate);
        let length = this.currentDateList.length;

        if (index == 0) {
            this.isEnd = true;
        } else {
            this.isEnd = false;
        }
        if (index == length - 1) {
            this.isStart = true;
        } else {
            this.isStart = false;
        }
        this._autoAlert(unit);
    }
}