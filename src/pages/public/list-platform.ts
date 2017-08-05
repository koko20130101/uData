import {Component, Input} from '@angular/core';

@Component({
    selector: 'list-platform',
    template: `<div class="info-list info-list-bg">
                 <ion-row *ngFor="let item of listData"
                                         [style.background-size]="item.percent*100+'% 100%'" align-items-center>
                      <ion-col col-4 text-left>{{item.bankName}}</ion-col>
                      <ion-col text-right ion-text color="{{item['up'] == true ? 'danger':(item['up']==false ? 'secondary':'')}}">
                            <span [innerHTML]="item.number"></span> {{unit}}
                            <ion-icon name="{{item['up']==true?'arrow-up':(item['up']==false ? 'arrow-down':'reduce')}}"></ion-icon>
                       </ion-col>
                 </ion-row>
               </div>`
})
export class ListPlatform {
    @Input() listData: any[];
    @Input() unit: any;

    constructor() {

    }
}