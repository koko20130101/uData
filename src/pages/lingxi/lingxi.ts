import {Component, ViewChild} from '@angular/core';
import {Slides, NavController} from 'ionic-angular';

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
    dateInstance: any;
    activeUnit: any;

    constructor(public navCtrl: NavController,
                public publicFactory:PublicFactory,
                public globalVars:GlobalVars) {

    }

    ngOnInit() {
        this.dateInstance = this.globalVars.getInstance();
    }

    ngAfterViewInit() {

    }

    ionViewWillEnter() {
        //订阅选择单位传过来的信息
        this.publicFactory.unitInfo.subscribe((data) => {
            if (data.page == this.pageName) {
                console.log(data.page)
            }
        });
    }

    ionViewWillLeave() {
        //取消选择单位订阅
        this.publicFactory.unitInfo.observers.pop();
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