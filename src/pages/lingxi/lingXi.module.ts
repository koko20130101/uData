import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {IonicPageModule} from 'ionic-angular';
import {SharedModule} from '../../components/shared.module';
import {DirectivesModule} from '../../directives/directives.module';

import {LingXiPage} from './lingXi';

@NgModule({
    declarations: [
        LingXiPage,
    ],
    imports: [
        IonicPageModule.forChild(LingXiPage),
        TranslateModule.forChild(),
        SharedModule,
        DirectivesModule
    ],
    exports: [
        LingXiPage
    ]
})
export class LingXiPageModule {
}
