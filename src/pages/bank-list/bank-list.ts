import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

import {BankDetailPage} from '../bank-detail/bank-detail';

import {GlobalVars} from '../../providers/global-vars';
import {PublicFactory} from '../../providers/factory/public.factory'

@Component({
    selector: 'bank-page',
    templateUrl: 'bank-list.html'
})
export class BankListPage {
    pageName: any = 'BankListPage';
    dateInstance: any;

    constructor(public navCtrl: NavController,
                public publicFactory: PublicFactory,
                public globalVars: GlobalVars) {

    }

    ngOnInit() {
        this.dateInstance = this.globalVars.getInstance();
    }

    ngAfterViewInit() {

    }

    ionViewWillEnter() {
        //订阅选择单位传过来的信息
        this.publicFactory.unitInfo.subscribe((data) => {
            if (data.page == this.pageName) {
                console.log(data.page)
            }
        });
    }

    ionViewWillUnload() {
        //取消选择单位订阅
        this.publicFactory.unitInfo.observers.pop();
    }

    openBankDetail(){
        this.navCtrl.push(BankDetailPage);
    }

}