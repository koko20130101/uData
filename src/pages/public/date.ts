import {Component, Input} from '@angular/core';

import {GlobalVars} from '../../providers/global-vars';
import {PublicFactory} from '../../providers/factory/public.factory'
import {PopupFactory} from '../../providers/factory/popup.factory'

@Component({
    selector: 'ucs-date',
    template: ` 
        <button ion-button clear icon-only small>
            <ion-icon name="arrow-back"></ion-icon>
        </button>
        <button ion-button clear small (click)="_showAlert()">{{activeDate}} ({{activeTip}})</button>
        <button ion-button clear icon-only small>
            <ion-icon name="arrow-forward"></ion-icon>
        </button>
`
})
export class Date {
    //输入属性:记录从那个页面引入的 date
    @Input() pageName: any;
    dateInstance: any;
    currentDateList: any[]=[];
    activeDate: any;
    activeTip: any;

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
        this.popupFactory.showAlert({
            inputs: this.currentDateList,
            buttons: [
                {
                    text: '确 定',
                    handler: (data)=> {
                        this.activeDate = data;
                        this._setDate();
                    }
                }
            ]

        })
    }

    _setDate() {
    }

    _setVars() {
        let _currentDateList = this.dateInstance.dateInfo.currentDateList;
        this.activeDate = this.dateInstance.dateInfo.currentDate;
        this.activeTip = this.dateInstance.dateInfo.tip;
        this.currentDateList = [];
        //处理时间列表
        for(let value of _currentDateList) {
            this.currentDateList.push({
                type: 'radio',
                label: value,
                value: value
            });
        }
    }
}