import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {TranslateModule} from '@ngx-translate/core';
import {TutorialPage} from './tutorial';

@NgModule({
    declarations: [
        TutorialPage,
    ],
    imports: [
        IonicPageModule.forChild(TutorialPage),
        TranslateModule.forChild()
    ],
    exports: [
        TutorialPage
    ]
})
export class TutorialPageModule {
}
