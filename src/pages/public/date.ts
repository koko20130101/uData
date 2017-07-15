import {Component, Input} from '@angular/core';

import {GlobalVars} from '../../providers/services/global.service';

import {PublicFactory} from '../../providers/factory/public.factory'
import {PopupFactory} from '../../providers/factory/popup.factory'

@Component({
    selector: 'ucs-date',
    template: ` 
        <button ion-button clear icon-only small [disabled]="isStart" (click)="_previousDate()">
            <ion-icon name="arrow-back"></ion-icon>
        </button>
        <button ion-button clear small (click)="_showAlert()">{{activeDate}}</button>
        <button ion-button clear icon-only small [disabled]="isEnd" (click)="_nextDate()">
            <ion-icon name="arrow-forward"></ion-icon>
        </button>
`
})
export class Date {
    //输入属性:记录从那个页面引入的 date
    @Input()pageName: any;
    dateInstance: any;  //单例模式的实例
    currentDateList: any[]=[];  //活动的时间列表
    activeDate: any;
    radioList: any[];
    isStart:boolean;
    isEnd:boolean = false;

    constructor(public popupFactory: PopupFactory,
                public publicFactory: PublicFactory,
                public globalVars: GlobalVars) {
    }

    ngOnInit() {
        // console.log(0)
        //全局变量实例
        this.dateInstance = this.globalVars.getInstance();
        this._setVars();
        //订阅选择单位传过来的信息
        this.publicFactory.unitInfo.subscribe((data) => {
            this._setVars();
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
        for(let value of this.currentDateList) {
            this.radioList.push({
                type: 'radio',
                label: value,
                value: value,
                checked: value == this.activeDate ? true :false
            });
        }

        //弹出日期选择弹窗
        this.popupFactory.showAlert({
            title:'请选择日期',
            inputs: this.radioList,
            buttons: [
                {
                    text: '确 定',
                    handler: (data)=> {
                        let index = this.currentDateList.indexOf(data);
                        this._setDate(data,index);
                    }
                }
            ]
        })
    }

    _previousDate(){
        let index = this.currentDateList.indexOf(this.activeDate);
        if(index == this.currentDateList.length-1) {
            this.isStart = true;
            return;
        }else{
            this.isEnd = false;
            this._setDate(this.currentDateList[index+1],index+1)
        }
    }

    _nextDate(){
        let index = this.currentDateList.indexOf(this.activeDate);
        if(index == 0) {
            this.isEnd = true;
            return;
        }else{
            this.isStart = false;
            this._setDate(this.currentDateList[index-1],index-1)
        }
    }

    _setDate(data,index) {
        //设置公共变量实例
        this.dateInstance.setDateValue(null, index);
        //发布消息
        this.publicFactory.unitInfo.emit({page:this.pageName});
        this._setVars();
    }

    _setVars() {
        this.currentDateList = this.dateInstance.dateInfo.currentDateList;
        this.activeDate = this.dateInstance.dateInfo.currentDate;
        let index = this.currentDateList.indexOf(this.activeDate);
        let length = this.currentDateList.length;
        if(index == 0) {
            this.isEnd = true;
        }else{
            this.isEnd = false;
        }
        if(index == length-1) {
            this.isStart = true;
        }else{
            this.isStart = false;
        }
    }
}