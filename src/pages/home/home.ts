import {Component} from  '@angular/core';
import {NavController, PopoverController,Refresher} from 'ionic-angular';
import {Storage} from '@ionic/storage';

import {PlatformTotalPage} from '../platform-total/platform-total';
import {C2bPage} from '../c2b/c2b';
import {LingXiPage} from '../lingxi/lingxi';
import {BankListPage} from '../bank-list/bank-list';

import {GlobalVars} from  '../../providers/services/global.service';
import {HomeService} from '../../providers/services/home.service';

import {PublicFactory} from  '../../providers/factory/public.factory';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
    providers:[HomeService]
})
export class HomePage {
    pageName: any = 'HomePage';
    dateList: any;
    dateInstance: any;

    totalAmount:any = {
        platformTotal: 0,
        C2BTotal: 0,
        LingXiTotal: 0
    };

    constructor(public navCtrl: NavController,
                public popoverCtrl: PopoverController,
                public globalVars: GlobalVars,
                public homeService:HomeService,
                public publicFactory: PublicFactory,
                public storage: Storage) {

    }

    ngOnInit() {
        // console.log(0)
        //全局变量实例
        this.dateInstance = this.globalVars.getInstance();
    }

    ngAfterViewInit() {
        // console.log(1)
        //订阅选择时间传过来的信息
        this.publicFactory.unitInfo.subscribe((data) => {
            console.log(data)
            if (data.page == this.pageName) {
                this.getHomeData();
            }
        });
    }

    ionViewDidLoad() {
        // console.log(2)
    }

    //每当当前视图为活动视图时调用
    ionViewWillEnter() {
        // console.log(3)
        //从本地数据库中取数据
        this.homeService.getValue().then(data=>{
            if(!!data) {
                this.totalAmount = data;
            }else{
                //如果没取到，则向服务器取
                this.getHomeData();
            }
        });
    }

    getHomeData(refresher?:any){
        this.homeService.loadHomeData({}).subscribe(data =>{
            let res:any = data;
            if(res._body.code==1) {
                this.totalAmount = res._body.data;
            }
            if (!!refresher) {
                refresher.complete();
            }
        })
    }

    doRefresh(refresher: Refresher) {
        setTimeout(() => {
            this.getHomeData(refresher);
        }, 500);
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