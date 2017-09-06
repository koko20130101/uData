import {Component} from  '@angular/core';
import {NavController, Refresher} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {Device} from '@ionic-native/device';
import {StatusBar} from '@ionic-native/status-bar';

import {LoginPage} from '../login/login';
import {PlatformTotalPage} from '../platform-total/platform-total';
import {C2bPage} from '../c2b/c2b';
import {LingXiPage} from '../lingxi/lingXi';
import {BankListPage} from '../bank-list/bank-list';
import {HelpPage} from '../help/help';

import {CacheField} from '../../providers/cache-field';
import {Endpoint} from '../../providers/endpoint';
import {GlobalVars} from  '../../providers/services/global.service';
import {HomeService} from '../../providers/services/home.service';
import {User} from '../../providers/providers';

import {PublicFactory} from  '../../providers/factory/public.factory';
import {PopupFactory} from  '../../providers/factory/popup.factory';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
    providers: [HomeService]
})
export class HomePage {
    pageInfo: any = {
        name: 'HomePage',
        id: 1
    };
    dateList: any;
    dateInstance: any;
    isShow: boolean = true;
    totalAmount: any = {
        platformTotal: 0,
        C2BTotal: 0,
        LingXiTotal: 0
    };
    errorCount: any = 0; //请求错误次数
    myDevice:any;

    constructor(public navCtrl: NavController,
                public globalVars: GlobalVars,
                public homeService: HomeService,
                public user: User,
                public device:Device,
                private statusBar:StatusBar,
                public publicFactory: PublicFactory,
                public popupFactory: PopupFactory,
                public storage: Storage) {
    }

    ngOnInit() {
        //全局变量实例
        this.dateInstance = this.globalVars.getInstance();
        this.statusBar.backgroundColorByHexString('#282836');
    }

    ngAfterViewInit() {
        //显示头部状态栏
        this.statusBar.show();
        // console.log(1)
        //订阅选择时间传过来的信息
        this.publicFactory.unitInfo.subscribe((data) => {
            if (data.page == this.pageInfo.name) {
                this.getHomeData(Endpoint.homeData, CacheField.homeData);
            }
        });

    }

    ionViewDidLoad() {
        //订阅请求错误信息
        this.publicFactory.error.subscribe((data)=> {
            if (this.errorCount == 0) {
                let toast = this.popupFactory.showToast({
                    message: '<i class="icon icon-ios ion-ios-warning toast-icon" ></i>' + data.message,
                    duration: 3000,
                    position: 'top'
                });
                toast.onDidDismiss(()=> {
                    this.errorCount = 0;
                    console.log(this.errorCount);
                })
            }
            this.errorCount++;
        });
    }

    //每当当前视图为活动视图时调用
    ionViewWillEnter() {
        // console.log(3)
        this.getHomeData(Endpoint.homeData, CacheField.homeData);
    }

    ionViewDidEnter(){

    }

    getHomeData(endpoint, cacheKey) {
        let _sendData: any = null;
        this.homeService.getValue(cacheKey).then(data=> {
            if (!!data) {
                this.totalAmount = data;
            } else {
                //如果没取到，则向服务器取
                var loader = this.popupFactory.loading();
                loader.present().then(()=> {
                    this.loadData(endpoint, cacheKey, null, loader, _sendData);
                });
            }
        });
    }

    loadData(endpoint, cacheKey, refresher?: any, loader?: any, sendData?: any) {
        //从服务器取数据
        this.homeService.loadValue(endpoint, cacheKey)
            .map(res=>res.json())
            .subscribe(data => {
                let res: any = data;
                if (res.code == 1) {
                    this.totalAmount = res.data;
                }
                if (!!refresher) {
                    refresher.complete();
                }
                if (!!loader) {
                    loader.dismiss();
                }
            }, err=> {
                if (!!loader) {
                    loader.dismiss();
                }
            })
    }

    removeCache() {
        for (let key in CacheField) {
            this.storage.remove(CacheField[key]);
        }
    }

    doLogout() {
        this.user.logout({}).subscribe((data) => {
            let res: any = data;
            if (res._body.code == 1) {
                this.navCtrl.setRoot(LoginPage);
            }
        });
    }

    //下拉刷新
    doRefresh(refresher: Refresher) {
        setTimeout(() => {
            this.loadData(Endpoint.homeData, CacheField.homeData, refresher);
        }, 500);
    }

    showMomey() {
        this.isShow = this.isShow ? false : true;
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