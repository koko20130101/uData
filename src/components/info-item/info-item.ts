import {Component,Input} from '@angular/core';

@Component({
    selector:'info-item',
    template:`
<ion-row align-items-center>
    <ion-col text-left>
        {{itemTitle}}
    </ion-col>
    <ion-col text-right ion-text color="{{itemInfo[1] =='true' ? 'danger':(itemInfo[1] =='false' ? 'secondary':'')}}">
         <span [innerHTML]="itemInfo[0]"></span><i ngClass="unit">{{unit}}</i>
        <ion-icon name="{{itemInfo[1] == 'true'? 'arrow-up':(itemInfo[1] == 'false' ? 'arrow-down':'reduce')}}"></ion-icon>
    </ion-col>
</ion-row>
`
})
export class InfoItem{
    @Input() itemTitle:any;
    @Input() unit:any;
    @Input() itemInfo:any[]=[];

    constructor(){

    }

    ngOnInit(){
        if(!this.itemInfo) {
            this.itemInfo = [];
        }
    }

}