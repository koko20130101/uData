import {Component, ViewChild} from '@angular/core';
import {Slides, NavController, PopoverController} from 'ionic-angular';

import {PopOverPage} from '../public/popover';

import {GlobalVars} from '../../providers/global-vars';
import {PublicFactory} from '../../providers/factory/public.factory';


@Component({
    selector: 'platform-page',
    templateUrl: 'platform-total.html'
})
export class PlatformTotalPage {
    @ViewChild('MainSlides') mainSlides: Slides;
    pageName = 'PlatformTotalPage';
    platformType = "1";
    dataType = "1";  //各平台指数排行
    dateList: any;
    activeDate: any;
    currentUnit: any;
    dateInstance: any;

    constructor(public navCtrl: NavController,
                public popoverCtrl: PopoverController,
                public publicFactory:PublicFactory,
                public globalVars: GlobalVars) {
    }

    ngOnInit() {
        this.dateInstance = this.globalVars.getInstance();
        this.activeDate = this.dateInstance.dateInfo.currentDate;
        this.currentUnit = this.dateInstance.dateInfo.unit;
    }

    ngAfterViewInit() {
        //订阅选择单位传过来的信息
        this.publicFactory.unitInfo.subscribe((data) => {
            this.activeDate = this.dateInstance.dateInfo.currentDate;
            this.currentUnit = this.dateInstance.dateInfo.unit;
            if(data.page== this.pageName) {
                console.log(data.page)
            }
        });
    }

    ionViewWillLeave(){
        //取消选择单位订阅
        this.publicFactory.unitInfo.observers.pop();
    }

    getPlatformSegment() {
        let num = Number(this.platformType);
        this.mainSlides.slideTo(num - 1);
    }

    //弹出时间单位
    presentPopover(ev: UIEvent) {
        let popover = this.popoverCtrl.create(PopOverPage, {page:this.pageName}, {
            cssClass: 'my-popover',
        });
        popover.present({
            ev: ev
        });
    }

    //重设时间单位
    resetDate() {

    }

    slideChange() {
        let active = this.mainSlides.getActiveIndex();
        let total = this.mainSlides.length();
        if (active == total) return;
        this.platformType = String(active + 1);
    }

}