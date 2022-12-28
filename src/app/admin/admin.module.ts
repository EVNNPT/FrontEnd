import { NgModule } from '@angular/core';
import { AdminRoutingModule } from './admin-routing.module';
import {
  UserComponent,
  RightsComponent,
  DashboardComponent,
  AdminComponent,
} from './pages';
import { DuongDayListComponent } from './pages/danh-muc/duong-day/list/duong-day-list.component';
import { MayBienApListComponent } from './pages/danh-muc/may-bien-ap/list/may-bien-ap-list.component';
import { RoLeListComponent } from './pages/danh-muc/ro-le/list/ro-le-list.component';
import { ThanhCaiListComponent } from './pages/danh-muc/thanh-cai/list/thanh-cai-list.component';
import { DuongDayDetailComponent } from './pages/danh-muc/duong-day/detail/duong-day-detail.component';
import { MayBienApDetailComponent } from './pages/danh-muc/may-bien-ap/detail/may-bien-ap-detail.component';
import { RoLeDetailComponent } from './pages/danh-muc/ro-le/detail/ro-le-detail.component';
import { ThanhCaiDetailComponent } from './pages/danh-muc/thanh-cai/detail/thanh-cai-detail.component';
import { SharedModule } from '../shared/shared.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogThemMoiDtlqComponent } from './pages/danh-muc/dialog/dialog-them-moi-dtlq/dialog-them-moi-dtlq.component';
import { DialogXoaDtlqComponent } from './pages/danh-muc/dialog/dialog-xoa-dtlq/dialog-xoa-dtlq.component';

export const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY', // this is how your date will be parsed from Input
  },
  display: {
    dateInput: 'DD/MM/YYYY', // this is how your date will get displayed on the Input
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [
    UserComponent,
    RightsComponent,
    DashboardComponent,
    AdminComponent,
    DuongDayListComponent,
    DuongDayDetailComponent,
    MayBienApListComponent,
    MayBienApDetailComponent,
    RoLeListComponent,
    RoLeDetailComponent,
    ThanhCaiListComponent,
    ThanhCaiDetailComponent,
    DialogThemMoiDtlqComponent,
    DialogXoaDtlqComponent,
  ],
  imports: [
    AdminRoutingModule,
    SharedModule,
    MatPaginatorModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatGridListModule,
    CommonModule,
    MatTabsModule,
    MatDialogModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
})
export class AdminModule {}
