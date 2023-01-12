import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GithubRoutingModule } from './github-routing.module';
import { RepolistComponent } from './pages/repolist/repolist.component';


@NgModule({
  declarations: [
    RepolistComponent
  ],
  imports: [
    CommonModule,
    GithubRoutingModule
  ]
})
export class GithubModule { }
