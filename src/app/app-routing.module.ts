import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { DashboardComponent } from './dashboard/dashboard.component'
import { GensessionidComponent } from './gensessionid/gensessionid.component'
import { SyncentityComponent } from './syncentity/syncentity.component'
import { UpdateadsComponent } from './updateads/updateads.component'
import { EcsEntityInfoComponent } from './ecsentityinfo/ecsentityinfo.component'
import { SynclogsComponent } from './synclogs/synclogs.component'

const routes: Routes = [
	{ path: 'dashboard', component: DashboardComponent },
	{ path: 'gensessionid', component: GensessionidComponent },
	{ path: 'syncentity', component: SyncentityComponent },
	{ path: 'resaveads', component: UpdateadsComponent },
	{ path: 'ecsentityinfo', component: EcsEntityInfoComponent },
	{ path: 'synclogs', component: SynclogsComponent },
	{ path: 'sasutil', redirectTo: '/dashboard', pathMatch: 'full' }, // for production compat with sebas
	{ path: '', redirectTo: '/dashboard', pathMatch: 'full' }
]

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
