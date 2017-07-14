import {Component, ViewChild} from '@angular/core';
import {Slides, NavController} from 'ionic-angular';

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
    dataType = "1";     //各平台指数排行
    dateInstance: any;

    constructor(public navCtrl: NavController,
                public publicFactory:PublicFactory,
                public globalVars: GlobalVars) {
    }

    ngOnInit() {
        this.dateInstance = this.globalVars.getInstance();
    }

    ngAfterViewInit() {
        //订阅选择单位传过来的信息
        this.publicFactory.unitInfo.subscribe((data) => {
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