import {Component, ViewChild} from '@angular/core';
import {Slides, NavController,Refresher} from 'ionic-angular';

import {PlatformService} from '../../providers/services/platform.service';
import {GlobalVars} from '../../providers/services/global.service';

import {PublicFactory} from '../../providers/factory/public.factory';
import {PopupFactory} from '../../providers/factory/popup.factory';


@Component({
    selector: 'platform-page',
    templateUrl: 'platform-total.html',
    providers:[PlatformService]
})
export class PlatformTotalPage {
    @ViewChild('MainSlides') mainSlides: Slides;
    pageName = 'PlatformTotalPage';
    platformType = "1";
    dataType = "1";     //各平台指数排行
    dateInstance: any;
    totalData:any = {
        totalUCS:['0',''],
        totalEnemy:['0',''],
    };

    constructor(public navCtrl: NavController,
                public publicFactory:PublicFactory,
                public popupFactory:PopupFactory,
                public platformService:PlatformService,
                public globalVars: GlobalVars) {
    }

    ngOnInit() {
        this.dateInstance = this.globalVars.getInstance();
        console.log(this.dateInstance);
    }

    ngAfterViewInit() {
        //订阅选择单位传过来的信息
        this.publicFactory.unitInfo.subscribe((data) => {
            console.log(data.page)
            if(data.page == this.pageName) {
                this.getTotalData();
            }
        });
    }

    ionViewWillEnter(){
        this.getTotalData();
    }

    ionViewWillLeave(){
        //取消选择单位订阅
        this.publicFactory.unitInfo.observers.pop();
    }

    getTotalData(){
        let _totalData = this.platformService.getValue();
        if(!!_totalData) {
            this.totalData = _totalData;
        }else{
            //如果没取到，则向服务器取
            var loader = this.popupFactory.loading();
            loader.present().then(()=> {
                this.loadTotalData(null,loader);
            });
        }

    }

    loadTotalData(refresher?:any,loader?:any){
        //从服务器取数据
        this.platformService.loadValue().subscribe(data =>{
            let res:any = data;
            if(res._body.code==1) {
                this.totalData = res._body.data;
            }
            if (!!refresher) {
                refresher.complete();
            }
            if(!!loader) {
                loader.dismiss();
            }
        })
    }

    //下拉刷新
    doRefresh(refresher: Refresher) {
        setTimeout(() => {
            this.loadTotalData(refresher);
        }, 500);
    }

    getPlatformSegment() {
        let num = Number(this.platformType);
        this.mainSlides.slideTo(num - 1);
    }

    slideChange() {
        let active = this.mainSlides.getActiveIndex();
        let total = this.mainSlides.length();
        if (active == total) return;
        this.platformType = String(active + 1);
    }

}