import {Component,ViewChild} from '@angular/core';
import {Slides} from 'ionic-angular';

@Component({
    selector:'linXi-page',
    templateUrl:'lingxi.html'
})
export class LingXiPage{
    @ViewChild("MainSlides") mainSlides: Slides;
    lingxiType = '1';
    userOperateType = '1';
    constructor(){

    }
    goSegment(){
        let num = Number(this.lingxiType);
        this.mainSlides.slideTo(num-1);
    }
    slideChange(){
        let active = this.mainSlides.getActiveIndex();
        let total = this.mainSlides.length();
        if(active == total) return;
        this.lingxiType = String(active+1);
    }
}