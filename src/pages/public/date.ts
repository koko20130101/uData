import {Component, Input} from '@angular/core';

import {GlobalVars} from '../../providers/services/global.service';

import {PublicFactory} from '../../providers/factory/public.factory'
import {PopupFactory} from '../../providers/factory/popup.factory'

@Component({
    selector: 'ucs-date',
    template: ` 
        <button ion-button clear icon-only small>
            <ion-icon name="arrow-back"></ion-icon>
        </button>
        <button ion-button clear small (click)="_showAlert()">{{activeDate}}</button>
        <button ion-button clear icon-only small>
            <ion-icon name="arrow-forward"></ion-icon>
        </button>
`
})
export class Date {
    //输入属性:记录从那个页面引入的 date
    @Input()pageName: any;
    dateInstance: any;
    currentDateList: any[]=[];
    activeDate: any;
    radioList: any[];

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

    ngAfterViewInit() {
        // console.log(1)
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

    _setDate(data,index) {
        console.log(this.pageName)
        //设置公共变量实例
        this.dateInstance.setDateValue(null, index);
        //发布消息
        this.publicFactory.unitInfo.emit(this.pageName);
        this._setVars();
    }

    _setVars() {
        this.currentDateList = this.dateInstance.dateInfo.currentDateList;
        this.activeDate = this.dateInstance.dateInfo.currentDate;
    }
}