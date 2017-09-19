import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {IonicPageModule} from 'ionic-angular';
import {SharedModule} from '../../components/shared.module';
import {DirectivesModule} from '../../directives/directives.module';

import {PlatformTotalPage} from './platform-total';

@NgModule({
    declarations: [PlatformTotalPage],
    imports: [
        IonicPageModule.forChild(PlatformTotalPage),
        TranslateModule.forChild(),
        SharedModule,
        DirectivesModule
    ],
    exports: [
        PlatformTotalPage
    ]
})
export class PlatformTotalModule {}