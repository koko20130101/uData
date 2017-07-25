import {Component, ViewChild} from '@angular/core';
import {Slides, NavController, Refresher} from 'ionic-angular';

import {Endpoint} from '../../providers/endpoint';
import {CacheField} from '../../providers/cache-field';
import {GlobalVars} from '../../providers/services/global.service';
import {LingXiService} from '../../providers/services/lingXi.service';

import {PublicFactory} from '../../providers/factory/public.factory';
import {PopupFactory} from '../../providers/factory/popup.factory'

@Component({
    selector: 'linXi-page',
    templateUrl: 'lingXi.html',
    providers:[LingXiService]
})
export class LingXiPage {
    @ViewChild("MainSlides") mainSlides: Slides;
    pageName: any = 'LingXiPage';
    lingXiType = '0';
    userOperateType = '1';
    dateInstance: any;
    model:any = {
        "total": ['--',''],
        "inTotal": ['--',''],
        "outTotal": ['--',''],
        "entrustUser": ['',''],
        "entrustOrder": ['',''],
        "entrustRepeatRate": ['',''],
        "entrustActiveRate": ['',''],
        "heavyInvest":['',''],
        "newInvest":['',''],
        "newBindCard":['',''],
        "newUser":['','']
    };
    lingXiTotalData:any = {};

    constructor(public navCtrl: NavController,
                public publicFactory:PublicFactory,
                public popupFactory:PopupFactory,
                public lingXiService:LingXiService,
                public globalVars:GlobalVars) {
        Object.assign(this.lingXiTotalData, this.model);
    }

    ngOnInit() {
        this.dateInstance = this.globalVars.getInstance();
    }

    ngAfterViewInit() {
        //订阅选择单位传过来的信息
        this.publicFactory.unitInfo.subscribe((data) => {
            if (data.page == this.pageName) {
                this.goSegment();
            }
        });
    }

    ionViewWillEnter() {
        this.getDataFromCache(Endpoint.lingXiTotal, CacheField.lingXiTotal);
    }
    ionViewDidEnter() {

    }

    ionViewWillLeave() {
        //取消选择单位订阅
        this.publicFactory.unitInfo.observers.pop();
    }

    /**
     * 从本地存储中获取数据
     * getDataFromCache(接口,本地存储key,资源类型标识)
     * */
    getDataFromCache(endpoint, cacheKey, source?: any) {
        let _sendData: any = {
            BankCode:''
        };
        let _totalData: any = this.lingXiService.getValue(cacheKey);
        switch (cacheKey) {
            case CacheField.lingXiTotal:
                if (!!_totalData && _totalData[this.lingXiType]) {
                    Object.assign(this.lingXiTotalData,_totalData[this.lingXiType]);
                    return;
                } else {
                    _sendData = {proType:parseInt(this.lingXiType)};
                    break;
                }
            default:
                break;
        }
        //判断请求个数
        if (this.globalVars.loaders.length == 0) {
            //记录加载对象个数
            this.globalVars.loaders.push(1);
            //如果没取到，则向服务器取
            var loader = this.popupFactory.loading();
            loader.present().then(()=> {
                this.loadData(endpoint, cacheKey, null, loader, _sendData);
            });
            return;
        }
        this.globalVars.loaders.push(1);
        this.loadData(endpoint, cacheKey, null, loader, _sendData);
    }

    /**
     * 从服务器加载数据
     * loadData(接口,本地存储key,下拉刷新对象,loading对象)
     * */
    loadData(endpoint, cacheKey, refresher?: any, loader?: any, sendData?: any) {
        this.lingXiService.loadValue(endpoint, cacheKey, sendData).subscribe(data => {
            let res: any = data;
            if (res._body.code == 1) {
                switch (cacheKey) {
                    case CacheField.lingXiTotal:
                        if(!!res._body.data[this.lingXiType]) {
                            this.lingXiTotalData = res._body.data[this.lingXiType];
                        }else{
                            Object.assign(this.lingXiTotalData,this.model);
                        }
                        break;
                    default:
                        break;
                }
            }

            this.globalVars.loaders.pop();

            if (!!refresher && this.globalVars.loaders.length == 0) {
                refresher.complete();
            }
            if (!!loader && this.globalVars.loaders.length == 0) {
                loader.dismiss();
            }
        })
    }

    goSegment() {
        let num = Number(this.lingXiType);
        this.mainSlides.slideTo(num);
        this.getDataFromCache(Endpoint.lingXiTotal, CacheField.lingXiTotal);
    }

    //下拉刷新
    doRefresh(refresher: Refresher) {
        let num = Number(this.lingXiType);
        setTimeout(() => {
            //总数据
            this.loadData(Endpoint.lingXiTotal, CacheField.lingXiTotal,refresher);
        }, 500);
    }

    slideChange() {
        let active = this.mainSlides.getActiveIndex();
        let total = this.mainSlides.length();
        if (active == total) return;
        this.lingXiType = String(active);
    }
}