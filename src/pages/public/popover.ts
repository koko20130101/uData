import {Component} from '@angular/core';
import {NavParams, ViewController} from 'ionic-angular';

import {GlobalVars} from  '../../providers/services/global.service';

import{PublicFactory} from '../../providers/factory/public.factory';

@Component({
    selector: 'page-popover',
    template: ` 
<ion-list class="popover-page">
      <button detail-none ion-item color="light" *ngFor="let unit of units" (click)="setDateUnit(unit)" >{{unit.title}}</button>
    </ion-list>
`
})
export class PopOverPage {
    private units: any;
    public parentPage: any;
    public dateInstance: any;

    constructor(public params: NavParams,
                public viewCtrl: ViewController,
                public publicFactory:PublicFactory,
                public globalVars: GlobalVars) {
        this.parentPage = params.data;
    }

    ngOnInit() {
        //全局变量实例
        this.dateInstance = this.globalVars.getInstance();
        this.units = this.dateInstance.units;
    }

    setDateUnit(val) {
        //关闭popover
        this.viewCtrl.dismiss();
        //设置全局变量值
        this.dateInstance.dateInfo.unit = val;
        this.dateInstance.setDateValue();
        this.publicFactory.unitInfo.emit({page:this.parentPage.page,unit:val.title});
    }

}