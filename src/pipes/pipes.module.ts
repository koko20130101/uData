import { NgModule } from '@angular/core';
import { ListPipe } from './../pipes/list/list';
@NgModule({
	declarations: [ListPipe],
	imports: [],
	exports: [ListPipe],
	providers:[ListPipe]
})
export class PipesModule {}
