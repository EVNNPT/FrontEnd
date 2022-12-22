import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  UserComponent,
  RightsComponent,
  DashboardComponent,
  AdminComponent,
} from './pages';
import { DuongDayDetailComponent } from './pages/danh-muc/duong-day/detail/duong-day-detail.component';
import { DuongDayListComponent } from './pages/danh-muc/duong-day/list/duong-day-list.component';
import { MayBienApDetailComponent } from './pages/danh-muc/may-bien-ap/detail/may-bien-ap-detail.component';
import { MayBienApListComponent } from './pages/danh-muc/may-bien-ap/list/may-bien-ap-list.component';
import { RoLeDetailComponent } from './pages/danh-muc/ro-le/detail/ro-le-detail.component';
import { RoLeListComponent } from './pages/danh-muc/ro-le/list/ro-le-list.component';
import { ThanhCaiDetailComponent } from './pages/danh-muc/thanh-cai/detail/thanh-cai-detail.component';
import { ThanhCaiListComponent } from './pages/danh-muc/thanh-cai/list/thanh-cai-list.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'user', component: UserComponent },
      { path: 'rights', component: RightsComponent },
      {
        path: 'duong-day-list',
        component: DuongDayListComponent,
      },
      {
        path: 'duong-day-detail/:id',
        component: DuongDayDetailComponent,
      },
      {
        path: 'may-bien-ap-list',
        component: MayBienApListComponent,
      },
      {
        path: 'may-bien-ap-detail/:id',
        component: MayBienApDetailComponent,
      },
      {
        path: 'ro-le-list',
        component: RoLeListComponent,
      },
      {
        path: 'ro-le-detail/:id',
        component: RoLeDetailComponent,
      },
      {
        path: 'thanh-cai-list',
        component: ThanhCaiListComponent,
      },
      {
        path: 'thanh-cai-detail/:id',
        component: ThanhCaiDetailComponent,
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
