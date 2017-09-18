import {Component} from '@angular/core';
import {NavParams, ViewController} from 'ionic-angular';

import {GlobalVars} from  '../../providers/services/global.service';
import {User} from  '../../providers/services/user.service';
import{PublicFactory} from '../../providers/factories/public.factory';

@Component({
    selector: 'page-popover',
    templateUrl:'popover.html'
})
export class PopoverPage {
    private units: any;
    public parentPage: any;
    public globalInstance: any;

    constructor(public params: NavParams,
                public viewCtrl: ViewController,
                public publicFactory:PublicFactory,
                public user:User,
                public globalVars: GlobalVars) {
        this.parentPage = params.get('pageInfo');
    }

    ngOnInit() {
        //全局变量实例
        this.globalInstance = this.globalVars.getInstance();
        this.units = this.globalInstance.units;
    }

    setDateUnit(val) {
        //关闭popover
        this.viewCtrl.dismiss();
        //设置全局变量值
        this.globalInstance.dateInfo.unit = val;
        this.globalInstance.setDateValue();
        this.publicFactory.unitInfo.emit({page:this.parentPage.name,unit:val.title});
        //添加埋点
        switch (val.title) {
            case '日':
                this.user.setRecordOperationLog({
                    pageID: this.parentPage.id,
                    point: 1
                });
                break;
            case '周':
                this.user.setRecordOperationLog({
                    pageID: this.parentPage.id,
                    point: 2
                });
                break;
            case '月':
                this.user.setRecordOperationLog({
                    pageID: this.parentPage.id,
                    point: 3
                });
                break;
        }
    }

}