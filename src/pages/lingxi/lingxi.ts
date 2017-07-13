import {Component, ViewChild} from '@angular/core';
import {Slides, NavController, PopoverController} from 'ionic-angular';

import {PopOverPage} from '../public/popover';

import {GlobalVars} from '../../providers/global-vars';
import {PublicFactory} from '../../providers/factory/public.factory'

@Component({
    selector: 'linXi-page',
    templateUrl: 'lingxi.html'
})
export class LingXiPage {
    @ViewChild("MainSlides") mainSlides: Slides;
    pageName: any = 'LingXiPage';
    lingxiType = '1';
    userOperateType = '1';
    dateList: any;
    activeDate: any;
    activeUnit: any;
    dateInstance: any;

    constructor(public navCtrl: NavController,
                public popoverCtrl: PopoverController,
                public publicFactory:PublicFactory,
                public globalVars:GlobalVars) {

    }

    ngOnInit() {
        this.dateInstance = this.globalVars.getInstance();
        this.activeDate = this.dateInstance.dateInfo.currentDate;
        this.activeUnit = this.dateInstance.dateInfo.unit;
        this.dateList = this.dateInstance.dateInfo.currentDateList;
    }

    ngAfterViewInit() {

    }

    ionViewWillEnter() {
        //订阅选择单位传过来的信息
        this.publicFactory.unitInfo.subscribe((data) => {
            this.activeDate = this.dateInstance.dateInfo.currentDate;
            this.activeUnit = this.dateInstance.dateInfo.unit;
            if (data.page == this.pageName) {
                console.log(data.page)
            }
        });
    }

    ionViewWillLeave() {
        //取消选择单位订阅
        this.publicFactory.unitInfo.observers.pop();
    }

    //弹出时间单位
    presentPopover(ev: UIEvent) {
        let popover = this.popoverCtrl.create(PopOverPage, {page: this.pageName}, {
            cssClass: 'my-popover',
        });
        popover.present({
            ev: ev
        });
    }

    goSegment() {
        let num = Number(this.lingxiType);
        this.mainSlides.slideTo(num - 1);
    }

    slideChange() {
        let active = this.mainSlides.getActiveIndex();
        let total = this.mainSlides.length();
        if (active == total) return;
        this.lingxiType = String(active + 1);
    }
}