import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { ContactUsComponent } from './pages/contactus/contact-us/contact-us.component';
import { HomeComponent } from './pages/home/home.component';
import { HomeUsComponent } from './pages/home/home-us.component';


@NgModule({
  declarations: [
    AboutUsComponent,
    ContactUsComponent,
    HomeComponent,
    HomeUsComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
