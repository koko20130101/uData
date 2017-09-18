import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BankListPage } from './bank-list';
import { TranslateModule } from '@ngx-translate/core';
import {SharedModule} from '../../components/shared.module';
import {DirectivesModule} from '../../directives/directives.module';

@NgModule({
  declarations: [
    BankListPage,
  ],
  imports: [
    IonicPageModule.forChild(BankListPage),
    TranslateModule.forChild(),
    SharedModule,
    DirectivesModule
  ],
  exports: [
    BankListPage
  ]
})
export class BankListPageModule { }
