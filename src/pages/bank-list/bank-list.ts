import {Component} from '@angular/core';
import {NavController, Refresher} from 'ionic-angular';

import {BankDetailPage} from '../bank-detail/bank-detail';
import {HelpPage} from '../help/help';

import {CacheField} from '../../providers/cache-field';
import {Endpoint} from '../../providers/endpoint';
import {GlobalVars} from '../../providers/services/global.service';
import {BankListService} from '../../providers/services/bank-lsit.service';
import {User} from '../../providers/services/user.service';

import {PublicFactory} from '../../providers/factory/public.factory'
import {PopupFactory} from '../../providers/factory/popup.factory'

@Component({
    selector: 'bank-page',
    templateUrl: 'bank-list.html',
    providers: [BankListService]
})
export class BankListPage {
    pageInfo: any = {
        name: 'BankListPage',
        id: 5
    };
    dateInstance: any;
    bankListData: any;

    constructor(public navCtrl: NavController,
                public publicFactory: PublicFactory,
                public popupFactory: PopupFactory,
                public bankListService: BankListService,
                public user: User,
                public globalVars: GlobalVars) {

    }

    ngOnInit() {
        // console.log(0);
        this.dateInstance = this.globalVars.getInstance();
    }

    ngAfterViewInit() {
        // console.log(1);
    }

    ionViewWillEnter() {
        // console.log(2);
        //订阅选择单位传过来的信息
        this.publicFactory.unitInfo.subscribe((data) => {
            if (data.page == this.pageInfo.name) {
                this.getDataFromCache(Endpoint.bankList, CacheField.bankList);
            }
        });
        this.getDataFromCache(Endpoint.bankList, CacheField.bankList);
    }

    ionViewWillUnload() {
        // console.log(4);
        //取消选择单位订阅
        this.publicFactory.unitInfo.observers.pop();
    }

    ionViewDidEnter() {
        // console.log(3);
    }

    /**
     * 从本地存储中获取数据
     * getDataFromCache(接口,本地存储key,资源类型标识)
     * */
    getDataFromCache(endpoint, cacheKey) {
        let _sendData: any = null;
        this.bankListService.getValue(cacheKey).then(data=>{
            if (!!data) {
                this.bankListData = data;
            } else {
                //如果没取到，则向服务器取
                var loader = this.popupFactory.loading();
                loader.present().then(()=> {
                    this.loadData(endpoint, cacheKey, null, loader, _sendData);
                });
            }
        });
    }

    /**
     * 从服务器加载数据
     * loadData(接口,本地存储key,下拉刷新对象,loading对象)
     * */
    loadData(endpoint, cacheKey, refresher?: any, loader?: any, sendData?: any) {
        this.bankListService.loadBankList(endpoint, cacheKey, sendData)
            .map(res=>res.json())
            .subscribe(res => {
                if (res.code == 1) {
                    this.bankListData = res.data.list;
                }

                if (!!refresher) {
                    refresher.complete();
                }
                if (!!loader) {
                    loader.dismiss();
                }
            }, err=> {
                if (!!refresher) {
                    refresher.complete();
                }
                if (!!loader) {
                    loader.dismiss();
                }
            })
    }

    //下拉刷新
    doRefresh(refresher: Refresher) {
        setTimeout(() => {
            this.loadData(Endpoint.bankList, CacheField.bankList, refresher);
        }, 500);
    }

    openBankDetail(bank) {
        this.navCtrl.push(BankDetailPage, bank);
    }

    openHelpPage() {
        this.navCtrl.push(HelpPage);
    }

    logout() {
        this.user.logout();
    }

}