import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiagramRoutingModule } from './diagram-routing.module';
import { DiagramComponent } from './pages/diagram.component';
import { SharedModule } from '../shared/shared.module';
import { ViewComponent } from './pages';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { LabelDetailComponent } from './pages/label-detail/label-detail.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [DiagramComponent, ViewComponent, LabelDetailComponent],
  imports: [
    CommonModule,
    DiagramRoutingModule,
    SharedModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSidenavModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule
  ],
})
export class DiagramModule {}
