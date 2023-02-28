import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewComponent } from './pages';
import { DiagramComponent } from './pages/diagram.component';

const routes: Routes = [
  {
    path: '',
    component: DiagramComponent,
    children: [
      { path: 'view', component: ViewComponent },
      { path: 'edit', component: ViewComponent },
      {
        path: '',
        redirectTo: 'view',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiagramRoutingModule {}
