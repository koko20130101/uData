import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {BankDetailPage} from './bank-detail';
import {TranslateModule} from '@ngx-translate/core';
import {SharedModule} from '../../components/shared.module';
import {DirectivesModule} from '../../directives/directives.module';

@NgModule({
    declarations: [
        BankDetailPage,
    ],
    imports: [
        IonicPageModule.forChild(BankDetailPage),
        TranslateModule.forChild(),
        SharedModule,
        DirectivesModule
    ],
    exports: [
        BankDetailPage
    ]
})
export class BankDetailPageModule {
}
