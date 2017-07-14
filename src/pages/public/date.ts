import {Component,Input} from '@angular/core';

import {GlobalVars} from '../../providers/global-vars';
import {PublicFactory} from '../../providers/factory/public.factory'

@Component({
    selector: 'ucs-date',
    template: ` 
        <button ion-button clear icon-only small>
            <ion-icon name="arrow-back"></ion-icon>
        </button>
        <button ion-button clear small>{{activeDate}} ({{activeTip}})</button>
        <button ion-button clear icon-only small>
            <ion-icon name="arrow-forward"></ion-icon>
        </button>
`
})
export class Date {
    @Input()pageName:any;
    dateInstance: any;
    activeDate:any;
    activeTip: any;

    constructor(public publicFactory: PublicFactory,
                public globalVars: GlobalVars) {
    }

    ngOnInit() {
        // console.log(0)
        this.dateInstance = this.globalVars.getInstance();
        this._setVars();
        //订阅选择单位传过来的信息
        this.publicFactory.unitInfo.subscribe((data) => {
            this._setVars();
        });
    }
    ngAfterViewInit(){
        // console.log(1)
    }
    ngOnDestroy() {
        // console.log(2)
        //取消选择单位订阅
        this.publicFactory.unitInfo.observers.pop();
    }

    _setVars(){
        this.activeDate = this.dateInstance.dateInfo.currentDate;
        this.activeTip = this.dateInstance.dateInfo.tip;
    }
}