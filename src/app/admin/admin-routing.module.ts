import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  UserComponent,
  RightsComponent,
  DashboardComponent,
  AdminComponent,
} from './pages';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'user', component: UserComponent },
      { path: 'rights', component: RightsComponent },
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
