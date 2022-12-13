import { NgModule } from '@angular/core';
import { AdminRoutingModule } from './admin-routing.module';
import {
  UserComponent,
  RightsComponent,
  DashboardComponent,
  AdminComponent,
} from './pages';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    UserComponent,
    RightsComponent,
    DashboardComponent,
    AdminComponent,
  ],
  imports: [AdminRoutingModule, SharedModule],
})
export class AdminModule {}
