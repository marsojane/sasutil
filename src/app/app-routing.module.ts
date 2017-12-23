import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { HomeComponent } from './home/home.component'
import { CmqueueComponent } from './cmqueue/cmqueue.component'
import { ECSEntityInfoComponent } from './ecsentityinfo/ecsentityinfo.component'
import { EntityHistoryComponent } from './entityhistory/entityhistory.component'

const routes: Routes = [
	{ path: 'home', component: HomeComponent },
	{ path: 'cmqueue', component: CmqueueComponent },
	{ path: 'entityhistory', component: EntityHistoryComponent },
	{ path: 'ecsentityinfo', component: ECSEntityInfoComponent },
	{ path: '', redirectTo: '/home', pathMatch: 'full' }
]

@NgModule({
	imports: [
		RouterModule.forRoot(routes)
	],
	exports: [
		RouterModule
	]
})
export class AppRoutingModule { }
