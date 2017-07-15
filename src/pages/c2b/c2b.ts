import {Component, ViewChild} from '@angular/core';
import {Slides, NavController} from 'ionic-angular';

import {GlobalVars} from '../../providers/services/global.service';

import {PublicFactory} from '../../providers/factory/public.factory';

@Component({
    selector: 'c2b-page',
    templateUrl: 'c2b.html'
})
export class C2bPage {
    @ViewChild('MainSlides') mainSlides: Slides;
    pageName = 'C2bPage';
    C2BType = '1';
    operateDataType = '1';
    dateInstance: any;

    constructor(public navCtrl: NavController,
                public publicFactory: PublicFactory,
                public globalVars: GlobalVars) {

    }

    ngOnInit() {
        //全局变量实例
        this.dateInstance = this.globalVars.getInstance();
    }

    ngAfterViewInit() {
        //订阅选择单位传过来的信息
        this.publicFactory.unitInfo.subscribe((data) => {
            if(data.page == this.pageName) {
                console.log(data.page)
            }
        });
    }

    ionViewWillLeave() {
        //取消选择单位订阅
        this.publicFactory.unitInfo.observers.pop();
    }

    goSegment() {
        let num = Number(this.C2BType);
        this.mainSlides.slideTo(num - 1);
    }

    slideChange() {
        let active = this.mainSlides.getActiveIndex();
        let total = this.mainSlides.length();
        if (active == total) return;
        this.C2BType = String(active + 1);
    }
}