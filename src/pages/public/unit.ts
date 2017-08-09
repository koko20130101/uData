import {Component, Input} from '@angular/core';
import {PopoverController} from 'ionic-angular';

import {PopOverPage} from './popover';

import {GlobalVars} from '../../providers/services/global.service';

import {PublicFactory} from '../../providers/factory/public.factory'

@Component({
    selector: 'ucs-unit',
    template: ` 
        <ion-buttons end>
            <button ion-button outline color="light" (click)="presentPopover($event)">{{activeUnit}}</button>
        </ion-buttons>
`
})
export class Unit {
    @Input() pageInfo: any;
    dateInstance: any;
    activeUnit: any;

    constructor(public popoverCtrl: PopoverController,
                public publicFactory: PublicFactory,
                public globalVars: GlobalVars) {
    }

    ngOnInit() {
        // console.log(0)
        this.dateInstance = this.globalVars.getInstance();
        this.activeUnit = this.dateInstance.dateInfo.unit.title;
        //订阅选择单位传过来的信息
        this.publicFactory.unitInfo.subscribe(() => {
            this.activeUnit = this.dateInstance.dateInfo.unit.title;
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

    //弹出时间单位
    presentPopover(ev: UIEvent) {
        let popover = this.popoverCtrl.create(PopOverPage, {pageInfo: this.pageInfo}, {
            cssClass: 'my-popover',
        });
        popover.present({
            ev: ev
        });
    }
}