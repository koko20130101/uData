import {Component} from  '@angular/core';
import {NavController, PopoverController} from 'ionic-angular';
import {Storage} from '@ionic/storage';

import {PlatformTotalPage} from '../platform-total/platform-total';
import {C2bPage} from '../c2b/c2b';
import {LingXiPage} from '../lingxi/lingxi';
import {BankListPage} from '../bank-list/bank-list';

import {PublicFactory} from  '../../providers/factory/public.factory';
import {GlobalVars} from  '../../providers/global-vars';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    pageName:any = 'HomePage';
    dateList: any;
    dateInstance:any;

    constructor(public navCtrl: NavController,
                public popoverCtrl: PopoverController,
                public globalVars: GlobalVars,
                public publicFactory:PublicFactory,
                public storage: Storage) {

    }
    ngOnInit(){
        // console.log(0)
        //全局变量实例
        this.dateInstance = this.globalVars.getInstance();
    }

    ngAfterViewInit() {
        // console.log(1)
    }

    ionViewDidLoad() {
        // console.log(2)
    }

    ionViewWillEnter() {
        console.log(3)
        //订阅选择单位传过来的信息
        this.publicFactory.unitInfo.subscribe((data) => {
            if( data.page == this.pageName) {
                console.log(data.page)
            }
        });
    }

    //重设时间单位
    resetDate(){

    }

    openPlatformData() {
        this.navCtrl.push(PlatformTotalPage)
    }

    openC2bPage() {
        this.navCtrl.push(C2bPage)
    }

    openLingXiPage() {
        this.navCtrl.push(LingXiPage)
    }

    openBankListPage() {
        this.navCtrl.push(BankListPage)
    }
}