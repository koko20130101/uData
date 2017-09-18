import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {IonicPageModule} from 'ionic-angular';
import {SharedModule} from '../../components/shared.module';
import {DirectivesModule} from '../../directives/directives.module';
import {C2bPage} from './c2b';

@NgModule({
    declarations: [
        C2bPage,
    ],
    imports: [
        IonicPageModule.forChild(C2bPage),
        TranslateModule.forChild(),
        SharedModule,
        DirectivesModule
    ],
    exports: [
        C2bPage
    ]
})
export class C2bPageModule {
}
