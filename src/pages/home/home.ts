import {Component} from  '@angular/core';
import {NavController,Refresher} from 'ionic-angular';
import {Storage} from '@ionic/storage';

import {LoginPage} from '../login/login';
import {PlatformTotalPage} from '../platform-total/platform-total';
import {C2bPage} from '../c2b/c2b';
import {LingXiPage} from '../lingxi/lingXi';
import {BankListPage} from '../bank-list/bank-list';
import {HelpPage} from '../help/help';

import {CacheField} from '../../providers/cache-field';
import {GlobalVars} from  '../../providers/services/global.service';
import {HomeService} from '../../providers/services/home.service';
import {User} from '../../providers/providers';

import {PublicFactory} from  '../../providers/factory/public.factory';
import {PopupFactory} from  '../../providers/factory/popup.factory';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
    providers:[HomeService]
})
export class HomePage {
    pageInfo: any = {
        name:'HomePage',
        id:1
    };
    dateList: any;
    dateInstance: any;
    isShow:boolean = true;
    totalAmount:any = {
        platformTotal: 0,
        C2BTotal: 0,
        LingXiTotal: 0
    };

    constructor(public navCtrl: NavController,
                public globalVars: GlobalVars,
                public homeService:HomeService,
                public user:User,
                public publicFactory: PublicFactory,
                public popupFactory: PopupFactory,
                public storage: Storage) {
    }

    ngOnInit() {
        //全局变量实例
        this.dateInstance = this.globalVars.getInstance();
    }

    ngAfterViewInit() {
        // console.log(1)
        //订阅选择时间传过来的信息
        this.publicFactory.unitInfo.subscribe((data) => {
            if (data.page == this.pageInfo.name) {
                this.getHomeData();
            }
        });

    }

    ionViewDidLoad() {
        //订阅请求错误信息
        this.publicFactory.error.subscribe((data)=> {
            console.log(data)

            this.popupFactory.showToast({
                message: data.message,
                duration:3000,
                position:'top'
            });
        });
    }

    //每当当前视图为活动视图时调用
    ionViewWillEnter() {
        // console.log(3)
        this.getHomeData();
    }

    getHomeData(){
        let _data = this.homeService.getValue();
        if(!!_data) {
            this.totalAmount = _data;
            return;
        }else{
            //如果没取到，则向服务器取
            var loader = this.popupFactory.loading();
            loader.present().then(()=> {
                this.loadHomeData(null,loader);
            });
        }
    }

    loadHomeData(refresher?:any,loader?:any){
        //从服务器取数据
        this.homeService.loadValue().subscribe(data =>{
            let res:any = data;
            if(res._body.code==1) {
                this.totalAmount = res._body.data;
            }
            if (!!refresher) {
                refresher.complete();
            }
            if(!!loader) {
                loader.dismiss();
            }
        })
    }

    removeCache(){
        for(let key in CacheField) {
            this.storage.remove(CacheField[key]);
        }
    }

    doLogout(){
        this.user.logout({}).subscribe((data) =>{
            let res: any = data;
            if(res._body.code==1) {
                this.navCtrl.setRoot(LoginPage);
            }
        });
    }

    //下拉刷新
    doRefresh(refresher: Refresher) {
        setTimeout(() => {
            this.loadHomeData(refresher);
        }, 500);
    }

    showMomey(){
        this.isShow = this.isShow ? false :true;
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

    openHelpPage() {
        this.navCtrl.push(HelpPage)
    }

    openBankListPage() {
        this.navCtrl.push(BankListPage)
    }
}