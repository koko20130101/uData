import {Component, ViewChild} from '@angular/core';
import {Slides, NavController, Refresher} from 'ionic-angular';

import {Endpoint} from '../../providers/endpoint';
import {CacheField} from '../../providers/cache-field';
import {C2bService} from '../../providers/services/c2b.service';
import {GlobalVars} from '../../providers/services/global.service';

import {PublicFactory} from '../../providers/factory/public.factory';
import {PopupFactory} from '../../providers/factory/popup.factory';

@Component({
    selector: 'c2b-page',
    templateUrl: 'c2b.html',
    providers: [C2bService]
})
export class C2bPage {
    @ViewChild('MainSlides') mainSlides: Slides;
    pageName = 'C2bPage';
    C2BType = '1';
    saleChannelTypeIn = '2';
    saleChannelTypeOut = '2';
    dateInstance: any;
    //引入及销售总额
    saleTotalData: any = {
        totalAssetsIn: ['--', ''],
        totalAssetsOut: ['--', ''],
    };
    //引入渠道分布
    saleChannelDataIn:any={
        1:[],
        2:[]
    };

    constructor(public navCtrl: NavController,
                public publicFactory: PublicFactory,
                public popupFactory: PopupFactory,
                public c2bService: C2bService,
                public globalVars: GlobalVars) {

    }

    ngOnInit() {
        //全局变量实例
        this.dateInstance = this.globalVars.getInstance();
    }

    ngAfterViewInit() {
        //订阅选择单位传过来的信息
        this.publicFactory.unitInfo.subscribe((data) => {
            if (data.page == this.pageName) {
                console.log(data.page)
            }
        });
    }

    ionViewDidEnter() {
        this.getDataFromCache(Endpoint.saleTotal, CacheField.saleTotal);
        this.getDataFromCache(Endpoint.saleChannelIn, CacheField.saleChannelIn);
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
        let _sendData: any = null;
        let _cacheData: any = this.c2bService.getValue(cacheKey);
        switch (cacheKey) {
            //引入及销售总额
            case CacheField.saleTotal:
                if (!!_cacheData) {
                    this.saleTotalData = _cacheData;
                    return;
                } else {
                    _sendData = null
                    break;
                }
            //引入渠道分布
            case CacheField.saleChannelIn:
                if (!!_cacheData && !!_cacheData[this.saleChannelTypeIn]) {
                    this.saleChannelDataIn = _cacheData;
                    return;
                } else {
                    _sendData = {dataType:parseInt(this.saleChannelTypeIn)};;
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
        this.c2bService.loadValue(endpoint, cacheKey, sendData).subscribe((data)=> {
            let res: any = data;
            if (res._body.code == 1) {
                switch (cacheKey) {
                    case CacheField.saleTotal:
                        this.saleTotalData = res._body.data;
                        break;
                    case CacheField.saleChannelIn:
                        this.saleChannelDataIn = res._body.data;
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
        });
    }

    //下拉刷新
    doRefresh(refresher: Refresher) {
        let num = Number(this.C2BType);
        setTimeout(() => {
            //总数据
            switch (num) {
                //网金
                case 1:
                    //总额
                    this.loadData(Endpoint.saleTotal, CacheField.saleTotal, refresher);
                    break;
                //竞品
                case 2:
                    //总额
                    break;
                //传统理财
                case 3:
                    break;
            }

        }, 500);
    }

    goSegment() {
        let num = Number(this.C2BType);
        this.mainSlides.slideTo(num - 1);
    }

    saleChannelSegmentIn() {
        this.getDataFromCache(Endpoint.saleChannelIn, CacheField.saleChannelIn);
    }

    slideChange() {
        let active = this.mainSlides.getActiveIndex();
        let total = this.mainSlides.length();
        if (active == total) return;
        this.C2BType = String(active + 1);
    }
}