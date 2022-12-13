import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin-routing.module').then((m) => m.AdminRoutingModule),
  },
  {
    path: 'diagram',
    loadChildren: () =>
      import('./diagram/diagram-routing.module').then(
        (m) => m.DiagramRoutingModule
      ),
  },
  {
    path: '',
    redirectTo: 'admin',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
